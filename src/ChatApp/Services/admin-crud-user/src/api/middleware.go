package api

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/Apolos666/ChatApp/src/util"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func DeserializeAdmin() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authorizationHeader := ctx.GetHeader("authorization")
		if len(authorizationHeader) == 0 {
			err := errors.New("authorization header is not provided")
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, errorResponse(err))
			return
		}
		fields := strings.Fields(authorizationHeader)
		if len(fields) < 2 {
			err := errors.New("invalid authorization header format")
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, errorResponse(err))
			return
		}
		authorizationType := strings.ToLower(fields[0])
		if authorizationType != "bearer" {
			err := fmt.Errorf("unsupported authorization type %s", authorizationType)
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, errorResponse(err))
			return
		}
		accessToken := fields[1]
		tokenClaims, err := util.ValidateToken(accessToken)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, errorResponse(err))
			return
		}
		claims, ok := tokenClaims.Claims.(jwt.MapClaims)
		if ok && tokenClaims.Valid {
			if authorities, ok := claims["Authorities"].([]interface{}); ok {
				for _, auth := range authorities {
					if authority, ok := auth.(map[string]interface{}); ok {
						if authority["authority"] != "ADMIN" {
							err := errors.New("user is not an admin")
							ctx.AbortWithStatusJSON(http.StatusUnauthorized, errorResponse(err))
							return
						}
					}
				}
			}
		}

		ctx.Set("email", claims["sub"].(string))
		ctx.Next()
	}
}
