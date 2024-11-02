package db

import (
	"context"
	"log"
)

func (r *Repo) DeleteUserTx(ctx context.Context, userID int32) error {
	tx, err := r.connPool.Begin(ctx)
	if err != nil {
		return err
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
	if err := q.SetCreatorIDNullInRoom(ctx, userID); err != nil {
		return err
	}
	if err := q.SetOwnerIDNullInFiles(ctx, userID); err != nil {
		return err
	}
	if err := q.SetSenderIDNullInMess(ctx, userID); err != nil {
		return err
	}
	if err := q.DeleteRoomUserByUserId(ctx, userID); err != nil {
		return err
	}
	if err := q.DeleteMessStatusUser(ctx, userID); err != nil {
		return err
	}
	if err := q.DeleteRefrTokenByUserId(ctx, userID); err != nil {
		return err
	}
	if err := q.DeleteUser(ctx, userID); err != nil {
		return err
	}
	return tx.Commit(ctx)
}
