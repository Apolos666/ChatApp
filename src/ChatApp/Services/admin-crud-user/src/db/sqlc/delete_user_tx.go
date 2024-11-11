package db

import (
	"context"
	"log"

	"github.com/Apolos666/ChatApp/src/util"
)

func (r *Repo) DeleteUserTx(ctx context.Context, userID int32) error {
	id := util.Int32ToPgTypeInt4(userID)
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
	if err := q.SetCreatorIDNullInRoom(ctx, id); err != nil {
		return err
	}
	if err := q.SetOwnerIDNullInFiles(ctx, id); err != nil {
		return err
	}
	if err := q.SetSenderIDNullInMess(ctx, id); err != nil {
		return err
	}
	if err := q.DeleteRoomUserByUserId(ctx, userID); err != nil {
		return err
	}
	if err := q.DeleteMessStatusUser(ctx, userID); err != nil {
		return err
	}
	if err := q.DeleteRefrTokenByUserId(ctx, id); err != nil {
		return err
	}
	if err := q.DeleteUser(ctx, userID); err != nil {
		return err
	}
	return tx.Commit(ctx)
}
