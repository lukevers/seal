package main

import (
	"encoding/json"
	"errors"
	"fmt"
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
		log.Println("could not decode JSON")
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
		log.Println("could not encode JSON")

		// Generate a string by hand if we can't marshal
		data = []byte(fmt.Sprintf(
			`{ "id": %s, "data": null, "error": %s }`,
			message.ID,
			"could not encode message to JSON",
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
		Error: fmt.Sprintf("message type %s not supported", message.FN),
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
	var what, how interface{}
	var exists bool

	if what, exists = message.Data["what"]; !exists {
		sendMessageResponse(ResponseMessage{
			w:     message.w,
			ID:    message.ID,
			Data:  nil,
			Error: errors.New("no `what` to load defined in data"),
		})

		return
	}

	if how, exists = message.Data["how"]; !exists {
		sendMessageResponse(ResponseMessage{
			w:     message.w,
			ID:    message.ID,
			Data:  nil,
			Error: errors.New("no `how` to load defined in data"),
		})

		return
	}

	var data []interface{}
	var err error

	switch what.(string) {
	case LoadWhatPosts:
		data, err = fetchPosts(how.(string))
	default:
		err = errors.New("the given `what` is not supported")
	}

	sendMessageResponse(ResponseMessage{
		w:     message.w,
		ID:    message.ID,
		Data:  data,
		Error: err,
	})
}
