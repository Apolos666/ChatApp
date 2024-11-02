package api

import (
	db "github.com/Apolos666/ChatApp/src/db/sqlc"
	"github.com/gin-gonic/gin"
)

type Server struct {
	r      *db.Repo
	router *gin.Engine
}

func NewServer(r *db.Repo) *Server {
	server := &Server{r: r}
	server.router = gin.Default()
	authRoutes := server.router.Group("/admin/manager/").Use(DeserializeAdmin())
	authRoutes.POST("/user", server.createUser)
	authRoutes.GET("/user/:id", server.getUser)
	authRoutes.GET("/users", server.getListUsers)
	authRoutes.GET("/myself", server.getMyself)
	authRoutes.PUT("/user", server.updateUser)
	authRoutes.DELETE("/user/:id", server.deleteUser)

	return server
}
func (server *Server) Start(address string) error {
	return server.router.Run(address)
}
func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
