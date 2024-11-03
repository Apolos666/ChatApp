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
	if err := util.VerifyEmail(req.Email); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	if err := util.ValidatePassword(req.Password); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
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
		IsActive:       pgtype.Bool{Bool: true, Valid: true},
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

type userResponse struct {
	ID          int32       `json:"id" `
	Name        string      `json:"name" `
	PhoneNumber string      `json:"phone_number" `
	Dob         pgtype.Date `json:"dob" `
	Address     pgtype.Text `json:"address" `
	Email       string      `json:"email" `
	RoleID      int32       `json:"role_id" `
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
	resp := userResponse{
		ID:          user.ID,
		Name:        user.Name,
		PhoneNumber: user.PhoneNumber,
		Dob:         user.Dob,
		Address:     user.Address,
		Email:       user.Email,
		RoleID:      user.RoleID,
	}
	ctx.JSON(http.StatusOK, resp)
}

type listUsersRequest struct {
	PageID   int32 `form:"page_id" binding:"min=0"`          // default 1
	PageSize int32 `form:"page_size" binding:"min=0,max=10"` // default 5
}

type listUsersRespone struct {
	TotalElements int32          `json:"total_elements"`
	TotalPages    int32          `json:"total_pages"`
	PageID        int32          `json:"page_id"`
	PageSize      int32          `json:"page_size"`
	PageSizeMax   int32          `json:"page_size_max"`
	Users         []userResponse `json:"users"`
}

func (server *Server) getListUsers(ctx *gin.Context) {
	var req listUsersRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	if req.PageID == 0 {
		req.PageID = 1
	}
	if req.PageSize == 0 {
		req.PageSize = 5
	}
	listUser, err := server.r.ListAllUsers(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	users, err := server.r.ListUsers(ctx, db.ListUsersParams{
		Limit:  req.PageSize,
		Offset: (req.PageID - 1) * req.PageSize,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	var userResponses []userResponse
	for _, user := range users {
		userResponses = append(userResponses, userResponse{
			ID:          user.ID,
			Name:        user.Name,
			PhoneNumber: user.PhoneNumber,
			Dob:         user.Dob,
			Address:     user.Address,
			Email:       user.Email,
			RoleID:      user.RoleID,
		})
	}
	ctx.JSON(http.StatusOK, listUsersRespone{
		TotalElements: int32(len(listUser)),
		TotalPages:    int32(len(listUser))/int32(req.PageSize) + 1,
		PageID:        req.PageID,
		PageSize:      req.PageSize,
		PageSizeMax:   10,
		Users:         userResponses,
	})
}

type updateUserRequest struct {
	ID          int32       `json:"id" binding:"required,min=1"`
	Name        string      `json:"name"`
	PhoneNumber string      `json:"phone_number"`
	Dob         pgtype.Date `json:"dob"` // "YYYY-MM-DD"
	Address     pgtype.Text `json:"address"`
	IsActive    pgtype.Bool `json:"is_active"`
	RoleID      int32       `json:"role_id"`
}

func (server *Server) updateUser(ctx *gin.Context) {
	var req updateUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}
	userNeedUpdate, err := server.r.GetUser(ctx, req.ID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, errorResponse(errors.New("user not found")))
		return
	}
	var updateUserParam db.UpdateUserParams
	updateUserParam.ID = req.ID
	if req.Name != "" && req.Name != userNeedUpdate.Name {
		updateUserParam.Name = req.Name
	} else {
		updateUserParam.Name = userNeedUpdate.Name
	}
	if req.PhoneNumber != "" && req.PhoneNumber != userNeedUpdate.PhoneNumber {
		updateUserParam.PhoneNumber = req.PhoneNumber
	} else {
		updateUserParam.PhoneNumber = userNeedUpdate.PhoneNumber
	}
	if req.Dob.Valid && !util.IsEqualPgDate(req.Dob, userNeedUpdate.Dob) {
		updateUserParam.Dob = req.Dob
	} else {
		updateUserParam.Dob = userNeedUpdate.Dob
	}
	if req.Address.Valid && !util.IsEqualPgText(req.Address, userNeedUpdate.Address) {
		updateUserParam.Address = req.Address
	} else {
		updateUserParam.Address = userNeedUpdate.Address
	}
	if req.IsActive.Valid && !util.IsEqualPgBool(req.IsActive, userNeedUpdate.IsActive) {
		updateUserParam.IsActive = req.IsActive
	} else {
		updateUserParam.IsActive = userNeedUpdate.IsActive
	}
	if req.RoleID != 0 && req.RoleID != userNeedUpdate.RoleID {
		updateUserParam.RoleID = req.RoleID
	} else {
		updateUserParam.RoleID = userNeedUpdate.RoleID
	}
	user, err := server.r.UpdateUserTx(ctx, updateUserParam)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(errors.New(" failed to update user")))
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
