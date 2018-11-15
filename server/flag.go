package main

import (
	"flag"
)

var (
	flagHost = flag.String("host", "0.0.0.0", "Host to bind on")
	flagPort = flag.Int("port", 3333, "Port to bind on")
)

func init() {
	flag.Parse()
}
