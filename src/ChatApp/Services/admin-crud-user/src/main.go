package main

import (
	"context"
	"log"

	"github.com/Apolos666/ChatApp/src/api"
	db "github.com/Apolos666/ChatApp/src/db/sqlc"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	connPool, err := pgxpool.New(ctx, "postgresql://postgres:phamtantudn3@postgres:5432/chat_app?sslmode=disable")
	if err != nil {
		log.Fatalf("cannot connect to db: %v", err)
	}
	defer connPool.Close()
	if err := connPool.Ping(ctx); err != nil {
		log.Fatalf("cannot ping db: %v", err)
	}
	repo := db.NewRepo(connPool)
	server := api.NewServer(repo)

	server.Start(":8085")
}
