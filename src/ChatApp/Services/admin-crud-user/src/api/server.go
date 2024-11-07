package api

import (
	"time"

	db "github.com/Apolos666/ChatApp/src/db/sqlc"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Server struct {
	r      *db.Repo
	router *gin.Engine
}

func NewServer(r *db.Repo) *Server {
	server := &Server{r: r}
	server.router = gin.Default()
	server.corsConfig()
	authRoutes := server.router.Group("/api/admin/").Use(DeserializeAdmin())
	authRoutes.POST("/user", server.createUser)
	authRoutes.GET("/user/:id", server.getUser)
	authRoutes.GET("/users", server.getListUsers)
	authRoutes.GET("/myself", server.getMyself)
	authRoutes.PUT("/user", server.updateUser)
	authRoutes.DELETE("/user/:id", server.deleteUser)

	return server
}
func (server *Server) corsConfig() {

	server.router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,                                                // Cho phép tất cả origins
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},            // Các phương thức cho phép
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, // Các header cho phép
		AllowCredentials: true,                                                // Cho phép gửi cookie hoặc thông tin xác thực
		MaxAge:           12 * time.Hour,                                      // Thời gian tối đa cho phép lưu CORS trong cache của trình duyệt
	}))
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}
func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
