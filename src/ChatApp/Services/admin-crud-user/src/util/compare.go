package util

import "github.com/jackc/pgx/v5/pgtype"

// IsEqualPgDate compares two pgtype.Date values for equality.
func IsEqualPgDate(d1, d2 pgtype.Date) bool {
	if d1.Valid != d2.Valid {
		return false // Different validity
	}
	if d1.Valid {
		return d1.Time.Equal(d2.Time) // Compare times if both are valid
	}
	return true // Both are not valid
}

// IsEqualPgText compares two pgtype.Text values for equality.
func IsEqualPgText(t1, t2 pgtype.Text) bool {
	if t1.Valid != t2.Valid {
		return false // Different validity
	}
	if t1.Valid {
		return t1.String == t2.String // Compare strings if both are valid
	}
	return true // Both are not valid (considered equal)
}

// IsEqualPgBool compares two pgtype.Bool values for equality.
func IsEqualPgBool(b1, b2 pgtype.Bool) bool {
	if b1.Valid != b2.Valid {
		return false // Different validity
	}
	if b1.Valid {
		return b1.Bool == b2.Bool // Compare boolean values if both are valid
	}
	return true // Both are not valid (considered equal)
}
