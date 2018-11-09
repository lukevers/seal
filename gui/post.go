package main

type Post struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Slug    string `json:"slug"`
	Content string `json:"content"`
}
