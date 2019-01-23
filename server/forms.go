package main

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/go-chi/render"
	"github.com/lukevers/seal/server/models"
	"github.com/volatiletech/null"
	"github.com/volatiletech/sqlboiler/boil"
)

type SubscribeEmailForm struct {
	Email string `json:"email"`
}

func BoostForms(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "forms", strings.Index(r.URL.Path, "/forms") == 0)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func SubscribeEmail(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}

	var form SubscribeEmailForm
	err = json.Unmarshal(body, &form)
	if err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}

	if form.Email == "" {
		render.Render(w, r, ErrRender(errors.New("Email is required")))
		return
	}

	subscriber := models.Subscriber{
		Email:    form.Email,
		TeamID:   null.UintFrom(r.Context().Value("team").(*models.Team).ID),
		Referrer: null.StringFrom(r.Referer()),
	}

	err = subscriber.Insert(context.TODO(), db, boil.Infer())
	if err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}

	render.Render(w, r, &SuccessResponse{})
}
