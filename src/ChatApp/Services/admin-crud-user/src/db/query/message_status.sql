-- name: UpdateMessStatusUser :exec
UPDATE message_status SET
  user_id = NULL
WHERE user_id = $1;

-- name: DeleteMessStatusUser :exec
DELETE FROM message_status
WHERE user_id = $1;