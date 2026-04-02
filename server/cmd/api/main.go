package main

import (
	"Frank2006x/WeMe/internal/db"
	"Frank2006x/WeMe/internal/router"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
)

func main() {
	// Initialize Database
	_, err := db.InitDB()
	if err != nil {
		panic(err)
	}

	app := fiber.New()

	app.Use(cors.New())
	app.Use(logger.New())

	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Get("/hello/:name", func(c fiber.Ctx) error {
		name := c.Params("name")
		return c.SendString("Hello, " + name + "!")
	})
	router.AuthRouter(app)
	

	app.Listen(":3000")

}