package main

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate"
	"github.com/golang-migrate/migrate/database/mysql"
	_ "github.com/golang-migrate/migrate/source/file"
	"github.com/lukevers/seal/server/dbconfig"
	"log"
)

func main() {
	log.Println("Reading configuration from " + *flagConfig)
	c, err := dbconfig.NewConfig(*flagConfig)
	if err != nil {
		log.Fatal("Could not read file:", err)
	}

	db, err := sql.Open(c.Driver, c.GetDsn())
	if err != nil {
		log.Fatal("Could not open database:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Could not ping database:", err)
	}

	driver, err := mysql.WithInstance(db, &mysql.Config{})
	if err != nil {
		log.Fatal("Could not get instance:", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		*flagMigrations,
		c.Driver,
		driver,
	)

	if err != nil {
		log.Fatal("Could not setup for migrations:", err)
	}

	if *flagMigrateDown {
		if *flagMigrateAll {
			log.Println("Migrating all the way down")
			err = m.Down()
			if err != nil {
				log.Fatal("Error migrating all the way down:", err)
			}
		} else {
			log.Println("Migrating down one")
			err = m.Steps(-1)
			if err != nil {
				log.Fatal("Error migrating down one:", err)
			}
		}
	} else if *flagMigrateUp {
		if *flagMigrateAll {
			log.Println("Migrating all the way up")
			err = m.Up()
			if err != nil {
				log.Fatal("Error migrating all the way up:", err)
			}
		} else {
			log.Println("Migrating up one")
			err = m.Steps(1)
			if err != nil {
				log.Fatal("Error migrating up one:", err)
			}
		}
	}
}
