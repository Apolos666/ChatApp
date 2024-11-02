package db

import "github.com/jackc/pgx/v5/pgxpool"

type Repo struct {
	*Queries
	connPool *pgxpool.Pool
}

func NewRepo(connPool *pgxpool.Pool) *Repo {
	return &Repo{
		Queries:  New(connPool),
		connPool: connPool,
	}
}
