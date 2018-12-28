package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"

	"github.com/lukevers/seal/server/models"
)

func fetchTeams(how string) ([]interface{}, error) {
	s := &SDK{
		URL:      getSettingValue("url"),
		Email:    getSettingValue("email"),
		Password: getSettingValue("password"),
	}

	resp, err := s.Get("meta/teams")
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

	var ts models.TeamSlice
	var teams []interface{}
	json.Unmarshal(body, &ts)

	for _, team := range ts {
		teams = append(teams, team)
	}

	return teams, err
}
