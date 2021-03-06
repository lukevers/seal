package main

import (
	"context"
	"encoding/base64"
	"errors"
	"net/http"
	"strings"

	"github.com/go-chi/render"
	"github.com/lukevers/seal/server/models"
	"github.com/volatiletech/sqlboiler/queries/qm"
	"golang.org/x/crypto/bcrypt"
)

// AuthenticateRequest is a middleware that just checks to see if the request
// is coming from an active user that has valid credentials. Authorization
// should happen in each individual handler.
func AuthenticateRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		keys := r.Header["Authorization"]
		if len(keys) < 1 {
			render.Render(w, r, ErrRender(errors.New("Authorization header required")))
			return
		}

		key := keys[0]
		parts := strings.Split(key, " ")
		if len(parts) != 2 {
			render.Render(w, r, ErrRender(errors.New("Malformed authorization header")))
			return
		}

		decoded, err := base64.StdEncoding.DecodeString(parts[1])
		if err != nil {
			render.Render(w, r, ErrRender(err))
			return
		}

		// parts[0] = email
		// parts[1] = password
		parts = strings.Split(string(decoded), ":")
		if len(parts) != 2 {
			render.Render(w, r, ErrRender(errors.New("Malformed authorization header")))
			return
		}

		user, err := models.Users(
			qm.Where("email = ?", parts[0]),
		).One(context.TODO(), db)
		if err != nil {
			render.Render(w, r, ErrRender(errors.New("Could not file user by email")))
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(user.Password.String), []byte(parts[1]))
		if err != nil {
			render.Render(w, r, ErrRender(errors.New("Invalid credentials")))
			return
		}

		ctx := context.WithValue(r.Context(), "user", user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func BoostAPI(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "api", strings.Index(r.URL.Path, "/api") == 0)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
