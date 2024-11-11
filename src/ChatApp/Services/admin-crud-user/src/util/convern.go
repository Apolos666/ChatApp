package util

import (
	"fmt"

	"github.com/jackc/pgx/v5/pgtype"
)

// Chuyển từ int32 sang pgtype.Int4
func Int32ToPgTypeInt4(value int32) pgtype.Int4 {
	return pgtype.Int4{
		Int32: value,
		Valid: true, // Đánh dấu là hợp lệ (không phải NULL)
	}
}
func PgTypeInt4ToInt32(pgValue pgtype.Int4) (int32, error) {
	if !pgValue.Valid {
		return 0, fmt.Errorf("value is NULL")
	}
	return pgValue.Int32, nil
}
