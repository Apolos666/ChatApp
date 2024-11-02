-- name: SetCreatorIDNullInRoom :exec
UPDATE rooms SET
  creator_id = NULL
WHERE creator_id = $1;