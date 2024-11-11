// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.20.0

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

type Querier interface {
	CreateUser(ctx context.Context, arg CreateUserParams) (User, error)
	DeleteMessStatusUser(ctx context.Context, userID int32) error
	DeleteRefrTokenByUserId(ctx context.Context, userID pgtype.Int4) error
	DeleteRoomUserByUserId(ctx context.Context, userID int32) error
	DeleteUser(ctx context.Context, id int32) error
	GetUser(ctx context.Context, id int32) (User, error)
	GetUserByEmail(ctx context.Context, email string) (User, error)
	ListAllUsers(ctx context.Context) ([]User, error)
	ListUsers(ctx context.Context, arg ListUsersParams) ([]User, error)
	SetCreatorIDNullInRoom(ctx context.Context, creatorID pgtype.Int4) error
	SetOwnerIDNullInFiles(ctx context.Context, ownerID pgtype.Int4) error
	SetSenderIDNullInMess(ctx context.Context, senderID pgtype.Int4) error
	SetUserIDNullInRoomUser(ctx context.Context, userID int32) error
	UpdateMessStatusUser(ctx context.Context, userID int32) error
	UpdateUser(ctx context.Context, arg UpdateUserParams) (User, error)
}

var _ Querier = (*Queries)(nil)
