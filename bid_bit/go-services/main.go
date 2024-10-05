package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/arnab-afk/bid-bit/handler"
	"github.com/runabol/tork/cli"
	"github.com/runabol/tork/conf"
)

func main() {
	// Load Tork configuration
	if err := conf.LoadConfig(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	// Register the /execute endpoint and assign it to the handler
	http.HandleFunc("/execute", handler.Handler)

	// Start HTTP server on port 9000
	go func() {
		fmt.Println("Server started on port 9000")
		log.Fatal(http.ListenAndServe(":9000", nil))
	}()

	// Run Tork CLI as before
	if err := cli.New().Run(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}