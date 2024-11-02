-- name: SetOwnerIDNullInFiles :exec
UPDATE files SET
  owner_id = NULL
WHERE owner_id = $1;