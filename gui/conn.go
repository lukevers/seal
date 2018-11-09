package main

import (
	"encoding/json"
	"fmt"
	"github.com/lukevers/seal/sdk"
	"github.com/lukevers/webview"
	"log"
)

// RequestMessage is a JSON encoded message passed from the application from
// the front-end to the back-end, and generally is expecting a response.
type RequestMessage struct {
	ID   string                 `json:"id"`
	FN   string                 `json:"fn"`
	Data map[string]interface{} `json:"data"`

	w webview.WebView
}

// ResponseMessage is a JSON encoded message passed to the application from
// the back-end to the front-end, and generally occurs due to an initial
// RequestMessage.
type ResponseMessage struct {
	ID    string      `json:"id"`
	Data  interface{} `json:"data"`
	Error interface{} `json:"error"`

	w webview.WebView
}

func handleMessage(w webview.WebView, data string) {
	var message RequestMessage
	if err := json.Unmarshal([]byte(data), &message); err != nil {
		log.Println("Could not decode JSON")
		log.Println(err)
		return
	}

	message.w = w

	switch message.FN {
	case "ping":
		handleMessagePing(message)
	case "load":
		handleMessageLoad(message)
	default:
		handleMessageNotSupported(message)
	}
}

func sendMessageResponse(message ResponseMessage) {
	data, err := json.Marshal(message)
	if err != nil {
		log.Println("Could not encode JSON")

		// Generate a string by hand if we can't marshal
		data = []byte(fmt.Sprintf(
			`{ "id": %s, "data": null, "error": %s }`,
			message.ID,
			"Could not encode message to JSON",
		))
	}

	message.w.Eval(
		fmt.Sprintf(
			`window.dispatchEvent(new CustomEvent('ResponseMessage-%s', { "detail": %s }));`,
			message.ID,
			string(data),
		),
	)
}

func handleMessageNotSupported(message RequestMessage) {
	sendMessageResponse(ResponseMessage{
		w:     message.w,
		ID:    message.ID,
		Error: fmt.Sprintf("Message type %s not supported", message.FN),
	})
}

func handleMessagePing(message RequestMessage) {
	sendMessageResponse(ResponseMessage{
		w:    message.w,
		ID:   message.ID,
		Data: "pong",
	})
}

func handleMessageLoad(message RequestMessage) {
	log.Println(message)

	sendMessageResponse(ResponseMessage{
		w:  message.w,
		ID: message.ID,
		Data: []sdk.Post{
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
		},
	})
}
