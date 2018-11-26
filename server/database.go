package main

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/lukevers/seal/server/dbconfig"
	"github.com/volatiletech/sqlboiler/boil"
)

var db *sql.DB

func init() {
	c, err := dbconfig.NewConfig("db.json")
	if err != nil {
		log.Fatal("Could not read file:", err)
	}

	db, err = sql.Open(c.Driver, c.GetDsn())
	if err != nil {
		log.Fatal("Could not open database:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Could not ping database:", err)
	}

	boil.SetDB(db)
}
