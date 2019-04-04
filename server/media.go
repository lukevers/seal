package main

import (
	"context"
	"errors"
	"log"
	"net/http"

	"github.com/go-chi/render"
	"github.com/lukevers/seal/server/models"
	"github.com/volatiletech/sqlboiler/queries/qm"
)

// MediaListResponse is a renderable response type wrapper for multiple media items
type MediaListResponse []*MediaResponse

// MediaResponse is a renderable response type wrapper for media
type MediaResponse struct {
	*models.Medium
}

// Render is the renderable interface function for the MediaResponse struct
func (e *MediaResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

// NewMediaListResponse wraps multiple posts in a renderable response
func NewMediaListResponse(ps models.MediumSlice) []render.Renderer {
	list := []render.Renderer{}
	for _, post := range ps {
		list = append(list, &MediaResponse{post})
	}

	return list
}

// ListMedia gets media for the requested user.
func ListMedia(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	_, ok := ctx.Value("user").(*models.User) // todo
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
		qm.InnerJoin("teams as t on t.id = media.team_id"),
		qm.Where("t.deleted_at IS NULL"),
		qm.Where("t.id = ?", teamid),
	}

	// TODO: ^ add support for per user if filtering that way

	media, err := models.Media(mods...).All(context.TODO(), db)
	if err != nil {
		log.Println(err)
		render.Render(w, r, ErrRender(err))
	} else {
		if err := render.RenderList(w, r, NewMediaListResponse(media)); err != nil {
			log.Println(err)
			render.Render(w, r, ErrRender(err))
			return
		}
	}
}

// CreateMedia creates a new media.
func CreateMedia(w http.ResponseWriter, r *http.Request) {
	// ctx := r.Context()
	// user, ok := ctx.Value("user").(*models.User)
	// if !ok {
	// 	render.Render(w, r, ErrRender(errors.New("Could not revive context")))
	// 	return
	// }

	// defer r.Body.Close()
	// body, err := ioutil.ReadAll(r.Body)
	// if err != nil {
	// 	log.Println(err)
	// 	render.Render(w, r, ErrRender(err))
	// 	return
	// }

	// var post models.Post
	// err = json.Unmarshal(body, &post)
	// if err != nil {
	// 	log.Println(err)
	// 	render.Render(w, r, ErrRender(err))
	// 	return
	// }

	// p := &models.Media{
	// 	Title:       post.Title,
	// 	Description: post.Description,
	// 	Route:       post.Route,
	// 	Template:    post.Template,
	// 	Content:     post.Content,
	// 	Markdown:    post.Markdown,
	// 	HTML:        post.HTML,
	// 	ReadTime:    post.ReadTime,
	// 	CoverImage:  post.CoverImage,
	// 	CreatedByID: user.ID,
	// 	UpdatedByID: user.ID,
	// 	OwnedByID:   post.OwnedByID,
	// 	PublishedAt: post.PublishedAt,
	// }

	// err = p.Insert(context.TODO(), db, boil.Infer())
	// if err != nil {
	// 	log.Println(err)
	// 	render.Render(w, r, ErrRender(err))
	// 	return
	// }

	// render.Render(w, r, &SuccessResponse{})
}
