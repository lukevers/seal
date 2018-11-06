package main

import (
	"github.com/lukevers/webview"
	"log"
	"net"
	"net/http"
)

const (
	development = true
	height      = 800
	resizable   = true
	title       = "Seal"
	width       = 1200
)

func main() {
	if development {
		launchLocal()
	} else {
		launchBuild()
	}
}

func launchLocal() {
	webview.Open(title, "http://localhost:3000", width, height, resizable)
}

func launchBuild() {
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		log.Fatal(err)
	}

	defer ln.Close()
	go func() {
		http.Handle("/", http.FileServer(http.Dir("app/build")))
		log.Fatal(http.Serve(ln, nil))
	}()

	webview.Open(title, "http://"+ln.Addr().String(), width, height, resizable)
}
