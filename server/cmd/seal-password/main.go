package main

import (
	"flag"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

var (
	flagPassword = flag.String("password", "", "Password to hash")
	flagCost     = flag.Int("cost", bcrypt.DefaultCost, "Password hash cost")
)

func init() {
	flag.Parse()
}

func main() {
	pass, err := bcrypt.GenerateFromPassword([]byte(*flagPassword), *flagCost)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(string(pass))
	}
}
