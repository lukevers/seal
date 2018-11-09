package main

import (
	// "flag"
	"github.com/lukevers/seal/sdk"
)

func fetchPosts(flags string) ([]interface{}, error) {
	return []interface{}{
		sdk.Post{
			ID:      1,
			Title:   "Testing test test",
			Slug:    "testing-test-test",
			Content: "LOL content here later",
		},
		sdk.Post{
			ID:      2,
			Title:   "Testing 2 test",
			Slug:    "testing-2-test",
			Content: "2 !! test here later",
		},
	}, nil
}
