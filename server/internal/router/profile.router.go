package router

import (
	"Frank2006x/WeMe/internal/auth"
	"Frank2006x/WeMe/internal/handler"

	"github.com/gofiber/fiber/v3"
)

func SetupProfileRoutes(app *fiber.App,h *handler.Handler) {
	profileGroup := app.Group("/profiles")
	profileGroup.Use(auth.AuthMiddleware)
	profileGroup.Get("/me", h.GetProfileMe)	
	profileGroup.Get("/:id", h.GetProfile)
	profileGroup.Post("/", h.CreateProfile)
	profileGroup.Put("/", h.UpdateProfile)
	profileGroup.Get("/", h.Hello)
}