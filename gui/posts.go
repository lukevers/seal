package main

import (
	// "flag"
	"encoding/json"
	"github.com/lukevers/seal/server/models"
	"io/ioutil"
	"strings"
)

func fetchPosts(flags string) ([]interface{}, error) {
	s := &SDK{
		URL: "http://localhost:3333",
	}

	resp, err := s.Get("/posts")
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var ps models.PostSlice
	var posts []interface{}
	json.Unmarshal(body, &ps)

	for _, post := range ps {
		posts = append(posts, post)
	}

	return posts, err
}

func updatePost(post string) ([]interface{}, error) {
	s := &SDK{
		URL: "http://localhost:3333",
	}

	reader := strings.NewReader(post)
	resp, err := s.Patch("/posts", reader)
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var ps models.PostSlice
	var posts []interface{}
	err = json.Unmarshal(body, &ps)
	if err != nil {
		return nil, err
	}

	for _, post := range ps {
		posts = append(posts, post)
	}

	return posts, err
}
