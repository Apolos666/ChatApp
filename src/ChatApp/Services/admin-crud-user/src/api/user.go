package api

import (
	"database/sql"
	"errors"
	"net/http"

	db "github.com/Apolos666/ChatApp/src/db/sqlc"
	"github.com/Apolos666/ChatApp/src/util"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

type createUserRequest struct {
	Name        string      `json:"name" binding:"required"`
	PhoneNumber string      `json:"phone_number" binding:"required"`
	Dob         pgtype.Date `json:"dob" binding:"required"` // "YYYY-MM-DD"
	Address     pgtype.Text `json:"address" binding:"required"`
	Email       string      `json:"email" binding:"required"`
	Password    string      `json:"password" binding:"required"`
	IsActive    pgtype.Bool `json:"is_active"`
	RoleID      int32       `json:"role_id" binding:"required"`
}

func (server *Server) createUser(ctx *gin.Context) {
	var req createUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	if existUser, err := server.r.GetUserByEmail(ctx, req.Email); err == nil && existUser.ID != 0 {
		ctx.JSON(http.StatusBadRequest, errorResponse(errors.New("email is already used")))
		return

	}
	user, err := server.r.CreateUser(ctx, db.CreateUserParams{
		Name:           req.Name,
		PhoneNumber:    req.PhoneNumber,
		Dob:            req.Dob,
		Address:        req.Address,
		Email:          req.Email,
		Password:       util.HashingPassword(req.Password),
		ActivationCode: pgtype.Text{String: ""},
		IsActive:       req.IsActive,
		RoleID:         req.RoleID,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, user)
}

type getUserIdRequest struct {
	ID int32 `uri:"id" binding:"required,min=1"`
}

func (server *Server) getUser(ctx *gin.Context) {
	var req getUserIdRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	user, err := server.r.GetUser(ctx, req.ID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, user)
}

func (server *Server) getListUsers(ctx *gin.Context) {
	users, err := server.r.ListUsers(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, users)
}

type updateUserRequest struct {
	ID          int32       `json:"id" binding:"required,min=1"`
	Name        string      `json:"name"`
	PhoneNumber string      `json:"phone_number"`
	Dob         pgtype.Date `json:"dob"` // "YYYY-MM-DD"
	Address     pgtype.Text `json:"address"`
	Email       string      `json:"email"`
	IsActive    pgtype.Bool `json:"is_active"`
	RoleID      int32       `json:"role_id"`
}

func (server *Server) updateUser(ctx *gin.Context) {
	var req updateUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	if req.Email != "" {
		userUsedThisEmail, _ := server.r.GetUserByEmail(ctx, req.Email)
		if userUsedThisEmail.ID != 0 && userUsedThisEmail.ID != req.ID {
			ctx.JSON(http.StatusBadRequest, errorResponse(errors.New("email is already used")))
			return
		}
	}
	user, err := server.r.UpdateUserTx(ctx, db.UpdateUserParams{
		ID:          req.ID,
		Name:        req.Name,
		PhoneNumber: req.PhoneNumber,
		Dob:         req.Dob,
		Address:     req.Address,
		Email:       req.Email,
		IsActive:    req.IsActive,
		RoleID:      req.RoleID,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, user)
}

func (server *Server) deleteUser(ctx *gin.Context) {
	var req getUserIdRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	if _, err := server.r.GetUser(ctx, req.ID); err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(errors.New("user not found")))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	err := server.r.DeleteUserTx(ctx, req.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"status": "deleted"})
}

func (server *Server) getMyself(ctx *gin.Context) {
	email, exists := ctx.Get("email")
	if !exists {
		ctx.JSON(http.StatusBadRequest, errorResponse(errors.New("email not found in context")))
		return
	}
	strEmail, ok := email.(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, errorResponse(errors.New("email is not a valid string")))
		return
	}
	user, err := server.r.GetUserByEmail(ctx, strEmail)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, user)
}
