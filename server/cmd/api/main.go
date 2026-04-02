package main

import (
	"Frank2006x/WeMe/internal/db"
	"Frank2006x/WeMe/internal/dbgen"
	"Frank2006x/WeMe/internal/handler"
	"Frank2006x/WeMe/internal/router"
	"context"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/joho/godotenv"
)

func main(){
	_ = godotenv.Load()
	app:=fiber.New()
	app.Use(logger.New())
	dbPool:=db.NewPool()
	dbPool.Ping(context.Background())
	defer dbPool.Close()

	queries:=dbgen.New(dbPool)
	Handler := handler.NewHandler(queries)
	router.SetupAuthRoutes(app,Handler)
	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
	app.Listen(":3001")
}