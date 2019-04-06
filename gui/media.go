package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"strings"

	"github.com/lukevers/seal/server/models"
)

func fetchMedia(how string) ([]interface{}, error) {
	s := &SDK{
		URL:      getSettingValue("url"),
		Email:    getSettingValue("email"),
		Password: getSettingValue("password"),
	}

	resp, err := s.Get(fmt.Sprintf("media?%s", how))
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

	var ms models.MediumSlice
	var mediums []interface{}
	json.Unmarshal(body, &ms)

	for _, media := range ms {
		mediums = append(mediums, media)
		fmt.Println(*media)
	}

	return mediums, err
}

func createMedia(how string) ([]interface{}, error) {
	s := &SDK{
		URL:      getSettingValue("url"),
		Email:    getSettingValue("email"),
		Password: getSettingValue("password"),
	}

	reader := strings.NewReader(how)
	resp, err := s.Post("media", reader)
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
