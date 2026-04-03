package router

import (
	"Frank2006x/WeMe/internal/auth"
	"Frank2006x/WeMe/internal/handler"

	"github.com/gofiber/fiber/v3"
)

func SetupQRRoutes(app *fiber.App, h *handler.Handler) {
	qr := app.Group("/qr")
	qr.Use(auth.AuthMiddleware)
	qr.Post("/generate", h.GenerateQR)
	qr.Get("/:token", h.GetProfileByToken)
}
