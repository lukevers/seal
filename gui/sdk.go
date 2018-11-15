package main

import (
	"fmt"
	"io"
	"net/http"
)

type SDK struct {
	URL    string
	APIKey string
}

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
