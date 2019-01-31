package main

import (
	"encoding/json"
	"fmt"
	"log"

	keyring "github.com/zalando/go-keyring"
)

var SettingsPrefix string

// Setting represents the structure of a key/value setting.
type Setting struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

func init() {
	if *flagDevelopment {
		SettingsPrefix = "debug-"
	} else {
		SettingsPrefix = "prod-"
	}
}

func key(k string) string {
	return fmt.Sprintf(
		"%s%s",
		SettingsPrefix,
		k,
	)
}

func updateSettings(settings string) ([]interface{}, error) {
	var s []Setting
	err := json.Unmarshal([]byte(settings), &s)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	for _, v := range s {
		err = keyring.Set(*flagKeychainService, key(v.Key), v.Value)
		if err != nil {
			log.Println(err)
			return nil, err
		}
	}

	return fetchSettings(settings)
}

func fetchSettings(settings string) ([]interface{}, error) {
	var s []Setting
	err := json.Unmarshal([]byte(settings), &s)
	if err != nil {
		return nil, err
	}

	var settingmap []interface{}
	for _, setting := range s {
		v, _ := keyring.Get(*flagKeychainService, key(setting.Key))
		settingmap = append(settingmap, Setting{setting.Key, v})
	}

	return settingmap, nil
}

func getSettingValue(setting string) string {
	value, _ := keyring.Get(*flagKeychainService, key(setting))
	return value
}
