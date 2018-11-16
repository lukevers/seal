package main

import (
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
)

// SDK represents how we communicate to the server.
type SDK struct {
	URL      string
	Email    string
	Password string
}

// Get sends a GET request to the server through the SDK.
func (s *SDK) Get(path string) (*http.Response, error) {
	req, err := http.NewRequest(
		"GET",
		fmt.Sprintf(
			"%s/api/%s",
			s.URL,
			path,
		),
		nil,
	)

	if err != nil {
		return nil, err
	}

	encoded := base64.StdEncoding.EncodeToString(
		[]byte(
			fmt.Sprintf(
				"%s:%s",
				s.Email,
				s.Password,
			),
		),
	)

	req.Header.Add("Authorization", fmt.Sprintf("Basic %s", encoded))
	return (&http.Client{}).Do(req)
}

// Patch sends a PATCH request to the server through the SDK.
func (s *SDK) Patch(path string, body io.Reader) (*http.Response, error) {
	req, err := http.NewRequest(
		"PATCH",
		fmt.Sprintf(
			"%s/api/%s",
			s.URL,
			path,
		),
		body,
	)

	if err != nil {
		return nil, err
	}

	encoded := base64.StdEncoding.EncodeToString(
		[]byte(
			fmt.Sprintf(
				"%s:%s",
				s.Email,
				s.Password,
			),
		),
	)

	req.Header.Add("Authorization", fmt.Sprintf("Basic %s", encoded))
	return (&http.Client{}).Do(req)
}
