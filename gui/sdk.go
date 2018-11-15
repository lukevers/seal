package main

import (
	"fmt"
	"io"
	"net/http"
)

// SDK represents how we communicate to the server.
type SDK struct {
	URL    string
	APIKey string
}

// Get sends a GET request to the server through the SDK.
func (s *SDK) Get(path string) (*http.Response, error) {
	req, err := http.NewRequest(
		"GET",
		fmt.Sprintf(
			"%s%s",
			s.URL,
			path,
		),
		nil,
	)

	if err != nil {
		return nil, err
	}

	req.Header.Add("X-API-KEY", s.APIKey)
	return (&http.Client{}).Do(req)
}

// Patch sends a PATCH request to the server through the SDK.
func (s *SDK) Patch(path string, body io.Reader) (*http.Response, error) {
	req, err := http.NewRequest(
		"PATCH",
		fmt.Sprintf(
			"%s%s",
			s.URL,
			path,
		),
		body,
	)

	if err != nil {
		return nil, err
	}

	req.Header.Add("X-API-KEY", s.APIKey)
	return (&http.Client{}).Do(req)
}
