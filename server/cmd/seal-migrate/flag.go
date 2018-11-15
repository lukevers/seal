package main

import (
	"flag"
	"fmt"
	"log"
	"path/filepath"
)

var (
	flagConfig      = flag.String("config", "db.json", "Path to JSON config file")
	flagMigrations  = flag.String("migrations", "./migrations", "Path to migrations directory")
	flagMigrateUp   = flag.Bool("up", false, "Migrate up one (use -all for all the way up)")
	flagMigrateDown = flag.Bool("down", false, "Migrate down (use -all for all the way down)")
	flagMigrateAll  = flag.Bool("all", false, "Migrate all the way up or all the way down")
)

func init() {
	flag.Parse()

	fullPath, err := filepath.Abs(*flagMigrations)
	if err != nil {
		log.Fatal("Could not get absolute path for migrations directory:", err)
	}

	fullPath = fmt.Sprintf(
		"file://%s",
		fullPath,
	)

	flagMigrations = &fullPath
}
