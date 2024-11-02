-- name: DeleteRefrTokenByUserId :exec
DELETE FROM refresh_tokens
WHERE user_id = $1;