-- name: GetUser :one
SELECT * FROM users
WHERE id = $1 LIMIT 1;

-- name: ListUsers :many
SELECT * FROM users
ORDER BY id
LIMIT $1 OFFSET $2;

-- name: ListAllUsers :many
SELECT * FROM users;

-- name: CreateUser :one
INSERT INTO users (
  name, phone_number, dob, address, email, password, activation_code, is_active, role_id
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9
)
RETURNING *;

-- name: UpdateUser :one
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
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1;