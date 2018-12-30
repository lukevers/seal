package main

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"

	"github.com/go-chi/render"
	"github.com/lukevers/seal/server/models"
	"github.com/volatiletech/sqlboiler/boil"
	"github.com/volatiletech/sqlboiler/queries/qm"
)

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
		render.Render(w, r, ErrRender(err))
		return
	}

	teamid := r.Form.Get("team")
	if teamid == "" {
		render.Render(w, r, ErrRender(errors.New("Missing query parameter `team`")))
		return
	}

	var mods []qm.QueryMod = []qm.QueryMod{
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
		render.Render(w, r, ErrRender(err))
	} else {
		if err := render.RenderList(w, r, NewPostListResponse(posts)); err != nil {
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
		render.Render(w, r, ErrRender(err))
		return
	}

	var post models.Post
	err = json.Unmarshal(body, &post)
	if err != nil {
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
		render.Render(w, r, ErrRender(errors.New("Could not find post user can edit")))
		return
	}

	_, err = post.Update(context.TODO(), db, boil.Infer())
	if err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}
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
		render.Render(w, r, ErrRender(err))
		return
	}

	var post models.Post
	err = json.Unmarshal(body, &post)
	if err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}

	p := &models.Post{
		Title:       post.Title,
		Slug:        post.Slug,
		Content:     post.Content,
		Markdown:    post.Markdown,
		HTML:        post.HTML,
		CreatedByID: user.ID,
		UpdatedByID: user.ID,
		OwnedByID:   post.OwnedByID,
	}

	err = p.Insert(context.TODO(), db, boil.Infer())
	if err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}
}
