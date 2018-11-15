package main

import (
	"database/sql"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/render"
	_ "github.com/go-sql-driver/mysql"
	"github.com/lukevers/seal/server/dbconfig"
	"github.com/volatiletech/sqlboiler/boil"
	"log"
	"net/http"
)

var db *sql.DB

func main() {
	c, err := dbconfig.NewConfig("db.json")
	if err != nil {
		log.Fatal("Could not read file:", err)
	}

	db, err = sql.Open(c.Driver, c.GetDsn())
	if err != nil {
		log.Fatal("Could not open database:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Could not ping database:", err)
	}

	boil.SetDB(db)

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.URLFormat)
	r.Use(render.SetContentType(render.ContentTypeJSON))

	r.Route("/posts", func(r chi.Router) {
		r.Get("/", ListPosts)
		r.Patch("/", UpdatePost)

		/*
			r.Post("/", CreatePost) // POST /articles

			r.Route("/{articleID}", func(r chi.Router) {
				r.Get("/", GetPost)       // GET /articles/123
				r.Put("/", UpdatePost)    // PUT /articles/123
				r.Delete("/", DeletePost) // DELETE /articles/123
			})

			// GET /articles/whats-up
			r.Get("/{articleSlug:[a-z-]+}", GetPost)
		*/
	})

	http.ListenAndServe(":3333", r)
}

type ErrResponse struct {
	Err            error `json:"-"` // low-level runtime error
	HTTPStatusCode int   `json:"-"` // http response status code

	StatusText string `json:"status"`          // user-level status message
	AppCode    int64  `json:"code,omitempty"`  // application-specific error code
	ErrorText  string `json:"error,omitempty"` // application-level error message, for debugging
}

func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}

func ErrInvalidRequest(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 400,
		StatusText:     "Invalid request.",
		ErrorText:      err.Error(),
	}
}

func ErrRender(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 422,
		StatusText:     "Error rendering response.",
		ErrorText:      err.Error(),
	}
}
