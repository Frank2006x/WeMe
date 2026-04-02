package router

import (
	"Frank2006x/WeMe/internal/handler"

	"github.com/gofiber/fiber/v3"
)

func AuthRouter(app *fiber.App){
	authGroup:=app.Group("/auth")
	authGroup.Post("/register",handler.RegisterUser)
	authGroup.Post("/login",handler.LoginUser)
	authGroup.Post("/logout",handler.LogoutUser)
}