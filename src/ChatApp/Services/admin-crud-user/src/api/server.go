package api

import (
	db "github.com/Apolos666/ChatApp/src/db/sqlc"
	"github.com/gin-gonic/gin"
)

type Server struct {
	q      *db.Queries
	router *gin.Engine
}

func NewServer(q *db.Queries) *Server {
	server := &Server{q: q}
	server.router = gin.Default()
	authRoutes := server.router.Group("/admin/manager/").Use(DeserializeAdmin())
	authRoutes.POST("/user", server.createUser)
	authRoutes.GET("/user/:id", server.getUser)
	authRoutes.GET("/users", server.getListUsers)
	authRoutes.GET("/myself", server.getMyself)
	authRoutes.PUT("/user", server.updateUser)
	authRoutes.DELETE("/:id", server.deleteUser)

	return server
}
func (server *Server) Start(address string) error {
	return server.router.Run(address)
}
func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
