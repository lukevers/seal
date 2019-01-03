package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"strings"

	"github.com/lukevers/seal/server/models"
)

func fetchPosts(how string) ([]interface{}, error) {
	s := &SDK{
		URL:      getSettingValue("url"),
		Email:    getSettingValue("email"),
		Password: getSettingValue("password"),
	}

	resp, err := s.Get(fmt.Sprintf("posts?filter=%s", how))
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
		return nil, errors.New(string(body))
	}

	var ps models.PostSlice
	var posts []interface{}
	json.Unmarshal(body, &ps)

	for _, post := range ps {
		posts = append(posts, post)
	}

	return posts, err
}

func createPost(post string) ([]interface{}, error) {
	s := &SDK{
		URL:      getSettingValue("url"),
		Email:    getSettingValue("email"),
		Password: getSettingValue("password"),
	}

	reader := strings.NewReader(post)
	resp, err := s.Post("posts", reader)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
		return nil, errors.New(string(body))
	}

	return nil, err
}

func updatePost(post string) ([]interface{}, error) {
	s := &SDK{
		URL:      getSettingValue("url"),
		Email:    getSettingValue("email"),
		Password: getSettingValue("password"),
	}

	reader := strings.NewReader(post)
	resp, err := s.Patch("posts", reader)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
		return nil, errors.New(string(body))
	}

	return nil, err
}
