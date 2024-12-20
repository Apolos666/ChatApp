// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.20.0
// source: users.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const createUser = `-- name: CreateUser :one
INSERT INTO users (
  name, phone_number, dob, address, email, password, activation_code, is_active, role_id
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9
)
RETURNING id, name, phone_number, dob, address, email, avatar, password, activation_code, is_active, created_at, updated_at, role_id
`

type CreateUserParams struct {
	Name           string      `json:"name"`
	PhoneNumber    string      `json:"phone_number"`
	Dob            pgtype.Date `json:"dob"`
	Address        pgtype.Text `json:"address"`
	Email          string      `json:"email"`
	Password       string      `json:"password"`
	ActivationCode pgtype.Text `json:"activation_code"`
	IsActive       pgtype.Bool `json:"is_active"`
	RoleID         pgtype.Int4 `json:"role_id"`
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRow(ctx, createUser,
		arg.Name,
		arg.PhoneNumber,
		arg.Dob,
		arg.Address,
		arg.Email,
		arg.Password,
		arg.ActivationCode,
		arg.IsActive,
		arg.RoleID,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.PhoneNumber,
		&i.Dob,
		&i.Address,
		&i.Email,
		&i.Avatar,
		&i.Password,
		&i.ActivationCode,
		&i.IsActive,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.RoleID,
	)
	return i, err
}

const deleteUser = `-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1
`

func (q *Queries) DeleteUser(ctx context.Context, id int32) error {
	_, err := q.db.Exec(ctx, deleteUser, id)
	return err
}

const getUser = `-- name: GetUser :one
SELECT id, name, phone_number, dob, address, email, avatar, password, activation_code, is_active, created_at, updated_at, role_id FROM users
WHERE id = $1 LIMIT 1
`

func (q *Queries) GetUser(ctx context.Context, id int32) (User, error) {
	row := q.db.QueryRow(ctx, getUser, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.PhoneNumber,
		&i.Dob,
		&i.Address,
		&i.Email,
		&i.Avatar,
		&i.Password,
		&i.ActivationCode,
		&i.IsActive,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.RoleID,
	)
	return i, err
}

const getUserByEmail = `-- name: GetUserByEmail :one
SELECT id, name, phone_number, dob, address, email, avatar, password, activation_code, is_active, created_at, updated_at, role_id FROM users
WHERE email = $1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRow(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.PhoneNumber,
		&i.Dob,
		&i.Address,
		&i.Email,
		&i.Avatar,
		&i.Password,
		&i.ActivationCode,
		&i.IsActive,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.RoleID,
	)
	return i, err
}

const listAllUsers = `-- name: ListAllUsers :many
SELECT id, name, phone_number, dob, address, email, avatar, password, activation_code, is_active, created_at, updated_at, role_id FROM users
`

func (q *Queries) ListAllUsers(ctx context.Context) ([]User, error) {
	rows, err := q.db.Query(ctx, listAllUsers)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []User{}
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.PhoneNumber,
			&i.Dob,
			&i.Address,
			&i.Email,
			&i.Avatar,
			&i.Password,
			&i.ActivationCode,
			&i.IsActive,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.RoleID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listUsers = `-- name: ListUsers :many
SELECT id, name, phone_number, dob, address, email, avatar, password, activation_code, is_active, created_at, updated_at, role_id FROM users
ORDER BY id
LIMIT $1 OFFSET $2
`

type ListUsersParams struct {
	Limit  int32 `json:"limit"`
	Offset int32 `json:"offset"`
}

func (q *Queries) ListUsers(ctx context.Context, arg ListUsersParams) ([]User, error) {
	rows, err := q.db.Query(ctx, listUsers, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []User{}
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.PhoneNumber,
			&i.Dob,
			&i.Address,
			&i.Email,
			&i.Avatar,
			&i.Password,
			&i.ActivationCode,
			&i.IsActive,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.RoleID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateUser = `-- name: UpdateUser :one
UPDATE users SET
  name = COALESCE($2, name),
  phone_number = COALESCE($3, phone_number),
  dob = COALESCE($4, dob),
  address = COALESCE($5, address),
  avatar = COALESCE($6, avatar),
  is_active = COALESCE($7, is_active),
  updated_at = current_timestamp,
  role_id = COALESCE($8, role_id)
WHERE id = $1
RETURNING id, name, phone_number, dob, address, email, avatar, password, activation_code, is_active, created_at, updated_at, role_id
`

type UpdateUserParams struct {
	ID          int32       `json:"id"`
	Name        string      `json:"name"`
	PhoneNumber string      `json:"phone_number"`
	Dob         pgtype.Date `json:"dob"`
	Address     pgtype.Text `json:"address"`
	Avatar      pgtype.Text `json:"avatar"`
	IsActive    pgtype.Bool `json:"is_active"`
	RoleID      pgtype.Int4 `json:"role_id"`
}

func (q *Queries) UpdateUser(ctx context.Context, arg UpdateUserParams) (User, error) {
	row := q.db.QueryRow(ctx, updateUser,
		arg.ID,
		arg.Name,
		arg.PhoneNumber,
		arg.Dob,
		arg.Address,
		arg.Avatar,
		arg.IsActive,
		arg.RoleID,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.PhoneNumber,
		&i.Dob,
		&i.Address,
		&i.Email,
		&i.Avatar,
		&i.Password,
		&i.ActivationCode,
		&i.IsActive,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.RoleID,
	)
	return i, err
}
