package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"
)

func main() {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.URLFormat)

	r.Use(BoostAPI)
	r.Use(MapHostToTeam)
	r.Use(RenderHost)

	r.Route("/api/user", func(r chi.Router) {
		r.Use(render.SetContentType(render.ContentTypeJSON))
		r.Use((cors.New(cors.Options{
			AllowedOrigins: []string{"*"},
			AllowedMethods: []string{"POST", "OPTIONS"},
		})).Handler)

		r.Options("/create", func(w http.ResponseWriter, r *http.Request) {})
		r.Post("/create", UserCreate)

		r.Options("/authenticate", func(w http.ResponseWriter, r *http.Request) {})
		r.Post("/authenticate", UserAuthenticate)
	})

	r.Route("/api/posts", func(r chi.Router) {
		r.Use(render.SetContentType(render.ContentTypeJSON))
		r.Use(AuthenticateRequest)

		r.Get("/", ListPosts)
		r.Patch("/", UpdatePost)
		r.Post("/", CreatePost)
	})

	r.Route("/api/meta", func(r chi.Router) {
		r.Use(render.SetContentType(render.ContentTypeJSON))
		r.Use(AuthenticateRequest)

		r.Get("/teams", MetaListTeams)
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
