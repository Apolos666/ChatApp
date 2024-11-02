-- name: SetUserIDNullInRoomUser :exec
UPDATE room_users SET
  user_id = NULL
WHERE user_id = $1;

-- name: DeleteRoomUserByUserId :exec
DELETE FROM room_users
WHERE user_id = $1;