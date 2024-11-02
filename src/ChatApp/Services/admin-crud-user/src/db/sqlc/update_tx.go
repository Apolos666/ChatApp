package db

import (
	"context"
	"log"
)

func (r *Repo) UpdateUserTx(ctx context.Context, arg UpdateUserParams) (User, error) {
	tx, err := r.connPool.Begin(ctx)
	if err != nil {
		return User{}, err
	}
	defer func() {
		if err != nil {
			rollbackErr := tx.Rollback(ctx)
			if rollbackErr != nil {
				log.Printf("failed to rollback transaction: %v", rollbackErr)
			}
		}
	}()
	q := r.WithTx(tx)
	user, err := q.UpdateUser(ctx, arg)
	if err != nil {
		return User{}, err
	}
	return user, tx.Commit(ctx)
}
