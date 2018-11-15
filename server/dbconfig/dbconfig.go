package dbconfig

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

type Config struct {
	Driver string   `json:"driver"`
	MySQL  DbConfig `json:"mysql"`
}

type DbConfig struct {
	Dbname  string `json:"dbname"`
	Host    string `json:"host"`
	Port    int    `json:"port"`
	User    string `json:"user"`
	Pass    string `json:"pass"`
	Sslmode string `json:"sslmode"`
}

func NewConfig(path string) (*Config, error) {
	bytes, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var c Config
	err = json.Unmarshal(bytes, &c)
	if err != nil {
		return nil, err
	}

	return &c, nil
}

func (c *Config) GetDsn() string {
	switch c.Driver {
	case "mysql":
		return fmt.Sprintf(
			"%s:%s@tcp(%s:%d)/%s?parseTime=true&multiStatements=true",
			c.MySQL.User,
			c.MySQL.Pass,
			c.MySQL.Host,
			c.MySQL.Port,
			c.MySQL.Dbname,
		)
	}

	return ""
}
