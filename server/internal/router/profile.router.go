package router

import (
	"Frank2006x/WeMe/internal/handler"

	"github.com/gofiber/fiber/v3"
)

func SetupProfileRoutes(app *fiber.App,h *handler.Handler) {
	profileGroup := app.Group("/profiles")
	profileGroup.Get("/:id", h.GetProfile)
	
}