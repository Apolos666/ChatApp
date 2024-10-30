package util

import (
	"encoding/base64"
	"fmt"
	"log"

	"github.com/golang-jwt/jwt/v5"
)

var base64SecretKey = "ZGZhNjcxNzAzN2Q2ZDJhZTM2MWQyY2E0NzEwMGM1NjNhYWNjN2FjOGVkYzU0MDFhNDJlMTk5NmE0OGM4OTVkZA=="

func ValidateToken(tokenString string) (*jwt.Token, error) {
	secretKey, err := base64.StdEncoding.DecodeString(base64SecretKey)
	if err != nil {
		log.Fatalf("Error decoding Base64 string: %v", err)
	}
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secretKey, nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}
