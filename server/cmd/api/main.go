package main

import (
	"Frank2006x/WeMe/internal/db"
	"Frank2006x/WeMe/internal/dbgen"
	"Frank2006x/WeMe/internal/handler"
	"Frank2006x/WeMe/internal/router"
	"context"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/joho/godotenv"
)

func main(){
	_ = godotenv.Load()
	app:=fiber.New()
	app.Use(logger.New())
	app.Use(cors.New())
	dbPool:=db.NewPool()
	dbPool.Ping(context.Background())
	defer dbPool.Close()
	queries:=dbgen.New(dbPool)
	Handler := handler.NewHandler(queries)

	router.SetupAuthRoutes(app,Handler)
	router.SetupProfileRoutes(app,Handler)
	router.SetupQRRoutes(app,Handler)

	app.Get("/:name", func(c fiber.Ctx) error {
		name := c.Params("name")
		return c.SendString("Hello, " + name + "!")
	})
	app.Listen(":3001")
}