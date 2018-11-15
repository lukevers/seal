package main

import (
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/render"
	"net/http"
)

func main() {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.URLFormat)

	r.Route("/api/posts", func(r chi.Router) {
		r.Use(render.SetContentType(render.ContentTypeJSON))
		r.Use(AuthenticateRequest)

		r.Get("/", ListPosts)
		r.Patch("/", UpdatePost)
	})

	http.ListenAndServe(
		fmt.Sprintf(
			"%s:%d",
			*flagHost,
			*flagPort,
		),
		r,
	)
}
