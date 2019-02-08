package main

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"sync"

	"github.com/go-chi/render"
	"github.com/lukevers/seal/server/models"
	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries/qm"
)

// TeamIDToPostsMap contains a cached mapping of team id to all posts related to it.
var TeamIDToPostsMap *sync.Map

func init() {
	models.AddPostHook(boil.AfterUpsertHook, initPost)
	models.AddPostHook(boil.AfterUpdateHook, initPost)
	models.AddPostHook(boil.AfterInsertHook, initPost)
	models.AddPostHook(boil.AfterDeleteHook, initPost)
}

func initPosts(ctx context.Context, exe boil.ContextExecutor, team *models.Team) error {
	var mods []qm.QueryMod = []qm.QueryMod{
		qm.Where("posts.deleted_at IS NULL"),
	}

	if team != nil {
		mods = append(mods, qm.Where("posts.owned_by_id = ?", team.ID))
	}

	posts, err := models.Posts(mods...).All(context.TODO(), db)
	if err != nil {
		return err
	}

	var newmap sync.Map
	for _, post := range posts {
		innerMap, _ := newmap.LoadOrStore(post.OwnedByID, &sync.Map{})
		innerMap.(*sync.Map).Store(post.Route, post)
	}

	TeamIDToPostsMap = &newmap

	log.Println("Successfully re-initialized team/post map")
	return nil
}

func initPost(ctx context.Context, exe boil.ContextExecutor, post *models.Post) error {
	// If post is nil, re-init everything, otherwise only update this one post
	if post == nil {
		return initPosts(ctx, exe, nil)
	}

	// Reset templates for related team
	HostToTeamMap.Range(func(key, value interface{}) bool {
		teamWrapper := value.(*TeamWrapper)
		team := teamWrapper.Team

		if post.OwnedByID == team.ID {
			HostToTeamMap.Store(
				team.Domain,
				&TeamWrapper{
					Team:      team,
					Templates: &sync.Map{},
				},
			)

			return false
		}

		return true
	})

	// For now, let's re-init everything. TODO: improve
	return initPosts(ctx, exe, nil)
}

// PostListResponse is a renderable response type wrapper for multiple posts
type PostListResponse []*PostResponse

// PostResponse is a renderable response type wrapper for a post
type PostResponse struct {
	*models.Post
}

// Render is the renderable interface function for the PostResponse struct
func (e *PostResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

// NewPostListResponse wraps multiple posts in a renderable response
func NewPostListResponse(ps models.PostSlice) []render.Renderer {
	list := []render.Renderer{}
	for _, post := range ps {
		list = append(list, &PostResponse{post})
	}

	return list
}

// ListPosts gets posts for the requested user.
func ListPosts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user, ok := ctx.Value("user").(*models.User)
	if !ok {
		render.Render(w, r, ErrRender(errors.New("Could not revive context")))
		return
	}

	if err := r.ParseForm(); err != nil {
		log.Println(err)
		render.Render(w, r, ErrRender(err))
		return
	}

	teamid := r.Form.Get("team")
	if teamid == "" {
		render.Render(w, r, ErrRender(errors.New("Missing query parameter `team`")))
		return
	}

	var mods = []qm.QueryMod{
		qm.InnerJoin("teams as t on t.id = posts.owned_by_id"),
		qm.InnerJoin("team_members as tm on tm.team_id = t.id"),
		qm.InnerJoin("users as u on u.id = tm.user_id"),
		qm.Where("u.id = ?", user.ID),
		qm.Where("tm.status = ?", "active"),
		qm.Where("t.id = ?", teamid),
	}

	switch r.Form.Get("filter") {
	case "published":
		mods = append(mods, qm.Where("posts.status = ?", "published"))
	case "drafts":
		mods = append(mods, qm.Where("posts.status = ?", "draft"))
	case "archived":
		mods = append(mods, qm.Where("posts.status = ?", "deleted"))
	}

	posts, err := models.Posts(mods...).All(context.TODO(), db)
	if err != nil {
		log.Println(err)
		render.Render(w, r, ErrRender(err))
	} else {
		if err := render.RenderList(w, r, NewPostListResponse(posts)); err != nil {
			log.Println(err)
			render.Render(w, r, ErrRender(err))
			return
		}
	}
}

// UpdatePost updates a specific post.
func UpdatePost(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user, ok := ctx.Value("user").(*models.User)
	if !ok {
		render.Render(w, r, ErrRender(errors.New("Could not revive context")))
		return
	}

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		render.Render(w, r, ErrRender(err))
		return
	}

	var post models.Post
	err = json.Unmarshal(body, &post)
	if err != nil {
		log.Println(err)
		render.Render(w, r, ErrRender(err))
		return
	}

	if p, err := models.Posts(
		qm.InnerJoin("teams as t on t.id = posts.owned_by_id"),
		qm.InnerJoin("team_members as tm on tm.team_id = t.id"),
		qm.InnerJoin("users as u on u.id = tm.user_id"),
		qm.Where("u.id = ?", user.ID),
		qm.Where("tm.status = ?", "active"),
		qm.Where("posts.id = ?", post.ID),
	).One(context.TODO(), db); err != nil || p == nil {
		log.Println(err)
		render.Render(w, r, ErrRender(errors.New("Could not find post user can edit")))
		return
	}

	_, err = post.Update(context.TODO(), db, boil.Infer())
	if err != nil {
		log.Println(err)
		render.Render(w, r, ErrRender(err))
		return
	}

	render.Render(w, r, &SuccessResponse{})
}

// CreatePost creates a new post.
func CreatePost(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	user, ok := ctx.Value("user").(*models.User)
	if !ok {
		render.Render(w, r, ErrRender(errors.New("Could not revive context")))
		return
	}

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		render.Render(w, r, ErrRender(err))
		return
	}

	var post models.Post
	err = json.Unmarshal(body, &post)
	if err != nil {
		log.Println(err)
		render.Render(w, r, ErrRender(err))
		return
	}

	p := &models.Post{
		Title:       post.Title,
		Description: post.Description,
		Route:       post.Route,
		Template:    post.Template,
		Content:     post.Content,
		Markdown:    post.Markdown,
		HTML:        post.HTML,
		ReadTime:    post.ReadTime,
		CoverImage:  post.CoverImage,
		CreatedByID: user.ID,
		UpdatedByID: user.ID,
		OwnedByID:   post.OwnedByID,
		PublishedAt: post.PublishedAt,
	}

	err = p.Insert(context.TODO(), db, boil.Infer())
	if err != nil {
		log.Println(err)
		render.Render(w, r, ErrRender(err))
		return
	}

	render.Render(w, r, &SuccessResponse{})
}
