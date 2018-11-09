package main

import (
	"github.com/lukevers/webview"
	"log"
	"net"
	"net/http"
)

const (
	development = true
)

func main() {
	settings := webview.Settings{
		Title:                  "Seal",
		Width:                  1200,
		Height:                 800,
		Resizable:              true,
		Debug:                  development,
		ExternalInvokeCallback: handleMessage,
	}

	var w webview.WebView
	if development {
		w = initializeLocal(settings)
	} else {
		w = initializeBuild(settings)
	}

	w.Run()
}

func initializeLocal(settings webview.Settings) webview.WebView {
	settings.URL = "http://localhost:3000"
	return webview.New(settings)
}

func initializeBuild(settings webview.Settings) webview.WebView {
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		log.Fatal(err)
	}

	defer ln.Close()
	go func() {
		http.Handle("/", http.FileServer(http.Dir("app/build")))
		log.Fatal(http.Serve(ln, nil))
	}()

	settings.URL = "http://" + ln.Addr().String()
	return webview.New(settings)
}
