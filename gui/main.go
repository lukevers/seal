package main

import (
	"fmt"
	"github.com/lukevers/webview"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	settings := webview.Settings{
		Title:                  "Seal",
		Width:                  1200,
		Height:                 800,
		Resizable:              true,
		Debug:                  *flagDebug,
		ExternalInvokeCallback: handleMessage,
	}

	var w webview.WebView
	if *flagDevelopment {
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

	go func() {
		ex, err := os.Executable()
		if err != nil {
			panic(err)
		}

		path := fmt.Sprintf(
			"%s/../Resources/",
			filepath.Dir(ex),
		)

		http.Handle("/", http.FileServer(http.Dir(path)))
		log.Fatal(http.Serve(ln, nil))
	}()

	settings.URL = "http://" + ln.Addr().String()
	return webview.New(settings)
}
