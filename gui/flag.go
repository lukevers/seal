package main

import (
	"flag"
)

var (
	flagDevelopment     = flag.Bool("development", false, "Development mode")
	flagDebug           = flag.Bool("debug", false, "Debug mode")
	flagKeychainService = flag.String("keychain-service", "seal", "Service name to use in keychain for settings")
)

func init() {
	flag.Parse()
}
