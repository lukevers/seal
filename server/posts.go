package main

import (
	"context"
	"encoding/json"
	"github.com/go-chi/render"
	"github.com/lukevers/seal/server/models"
	"github.com/volatiletech/sqlboiler/boil"
	. "github.com/volatiletech/sqlboiler/queries/qm"
	"io/ioutil"
	"net/http"
)

type PostResponse struct {
	*models.Post
}

type PostListResponse []*PostResponse

func (e *PostResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func NewPostListResponse(ps models.PostSlice) []render.Renderer {
	list := []render.Renderer{}
	for _, post := range ps {
		list = append(list, &PostResponse{post})
	}

	return list
}

func ListPosts(w http.ResponseWriter, r *http.Request) {
	posts, err := models.Posts(
		Where("owned_by_id = ?", 1), // TODO
	).All(context.TODO(), db)

	if err != nil {
		render.Render(w, r, ErrRender(err))
	} else {
		if err := render.RenderList(w, r, NewPostListResponse(posts)); err != nil {
			render.Render(w, r, ErrRender(err))
			return
		}
	}
}

func UpdatePost(w http.ResponseWriter, r *http.Request) {
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

	_, err = post.Update(context.TODO(), db, boil.Infer())
	if err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}
}
