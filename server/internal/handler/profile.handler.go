package handler

import (
	"fmt"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5/pgtype"
)

func (h *Handler) GetProfile(c fiber.Ctx) error {
	profileID := c.Params("id")
	fmt.Println(profileID)
	var profileUUID pgtype.UUID
	if err := profileUUID.Scan(profileID); err != nil {
		return err
	}
	profile, err := h.Queries.GetProfileByID(c.Context(), profileUUID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Profile not found"})
	}
	return c.JSON(profile)
}



	