package main

import (
	"context"
	"log"

	"github.com/Apolos666/ChatApp/src/api"
	db "github.com/Apolos666/ChatApp/src/db/sqlc"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	// LoadEnv()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	connPool, err := pgxpool.New(ctx, "postgresql://root:secret@db:5432/chatapp")
	if err != nil {
		log.Fatalf("cannot connect to db: %v", err)
	}
	defer connPool.Close()
	if err := connPool.Ping(ctx); err != nil {
		log.Fatalf("cannot ping db: %v", err)
	}

	server := api.NewServer(db.New(connPool))

	server.Start(":8085")
}

// func LoadEnv() {
// 	err := godotenv.Load("admincrud.env")
// 	if err != nil {
// 		log.Fatalf("Failed to load .env file: %v", err)
// 	}
// }
