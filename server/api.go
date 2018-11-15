package main

import (
	"encoding/base64"
	"errors"
	"github.com/go-chi/render"
	"net/http"
	"strings"
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

		// TODO: check if email exists
		// TODO: check password against hash

		next.ServeHTTP(w, r)
	})
}
