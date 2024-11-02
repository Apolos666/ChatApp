-- name: SetSenderIDNullInMess :exec
UPDATE messages SET
  sender_id = NULL
WHERE sender_id = $1;