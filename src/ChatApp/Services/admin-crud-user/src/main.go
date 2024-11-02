package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/Apolos666/ChatApp/src/api"
	db "github.com/Apolos666/ChatApp/src/db/sqlc"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	connPool, err := connectDB(ctx)
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

func connectDB(ctx context.Context) (*pgxpool.Pool, error) {
	dbUser := os.Getenv("DATABASE_USER")
	dbPassword := os.Getenv("DATABASE_PASSWORD")
	dbHost := os.Getenv("DATABASE_HOST")
	dbPort := os.Getenv("DATABASE_PORT")
	dbName := os.Getenv("DATABASE_NAME")
	dsn := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=disable", dbUser, dbPassword, dbHost, dbPort, dbName)
	connPool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		return nil, err
	}
	return connPool, nil
}
