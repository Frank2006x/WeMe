package router

import (
	"Frank2006x/WeMe/internal/auth"
	"Frank2006x/WeMe/internal/handler"

	"github.com/gofiber/fiber/v3"
)
	

func SetupAuthRoutes(app *fiber.App,h *handler.Handler) {
	authGroup := app.Group("/auth")
	authGroup.Post("/login", h.Login)
	authGroup.Post("/register", h.Register)
	authGroup.Post("/logout", auth.AuthMiddleware, h.Logout)
}