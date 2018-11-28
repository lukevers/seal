package main

import (
	"net/http"

	"github.com/go-chi/render"
)

// ErrResponse is a renderable struct for generic errors
type ErrResponse struct {
	Err            error `json:"-"` // low-level runtime error
	HTTPStatusCode int   `json:"-"` // http response status code

	StatusText string `json:"status"`          // user-level status message
	AppCode    int64  `json:"code,omitempty"`  // application-specific error code
	ErrorText  string `json:"error,omitempty"` // application-level error message, for debugging
}

// SuccessResponse is a renderable struct for generic successes
type SuccessResponse struct {
	OK bool `json:"ok"`
}

// Render is the renderable interface function for the ErrResponse struct
func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}

// Render is the renderable interface function for the SuccessResponse struct
func (s *SuccessResponse) Render(w http.ResponseWriter, r *http.Request) error {
	s.OK = true
	render.Status(r, 200)

	return nil
}

// ErrInvalidRequest is a shortcut renderable response for 400
func ErrInvalidRequest(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 400,
		StatusText:     "Invalid request.",
		ErrorText:      err.Error(),
	}
}

// ErrRender is a shortcut renderable response for 422
func ErrRender(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: 422,
		StatusText:     "Error rendering response.",
		ErrorText:      err.Error(),
	}
}
