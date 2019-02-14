package main

import (
	"flag"
)

var (
	flagHost        = flag.String("host", "0.0.0.0", "Host to bind on")
	flagPort        = flag.Int("port", 3333, "Port to bind on")
	flagCacheHash   = flag.String("cachehash", "0", "Cache query string")
	flagSessionKey  = flag.String("session-key", "replace-me", "Session key")
	flagSessionName = flag.String("session-name", "sid", "Session name")
)

func init() {
	flag.Parse()
}
