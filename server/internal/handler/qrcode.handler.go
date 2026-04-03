package handler

import (
	"Frank2006x/WeMe/internal/dbgen"
	"os"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/skip2/go-qrcode"
)



func (h *Handler) GenerateQR(c fiber.Ctx) error {
	
	userId := c.Locals("user_id")
	var userUUID pgtype.UUID
	if err := userUUID.Scan(userId); err != nil {
		return err
	}
	
	profile, err := h.Queries.GetProfileByUserID(c.Context(), userUUID)
	
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "profile not found"})
	}

	
	token := uuid.New().String()

	
	_, err = h.Queries.CreateQRToken(c.Context(), dbgen.CreateQRTokenParams{
		ProfileID: profile.ID,
		Token:     token,
		ExpiresAt: pgtype.Timestamp{Time: time.Now().Add(5 * 60 * time.Second), Valid: true},
	})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to create token"})
	}

	
	url := os.Getenv("BASE_URL") + "/qr/" + token

	
	png, err := qrcode.Encode(url, qrcode.Medium, 256)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "qr generation failed"})
	}

	c.Set("Content-Type", "image/png")
	return c.Send(png)
}


func (h *Handler) GetProfileByToken(c fiber.Ctx) error {
	token := c.Params("token")

	
	profile, err := h.Queries.GetProfileByToken(c.Context(), token)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "invalid or expired token"})
	}

	
	_ = h.Queries.CreateScanLog(c.Context(), dbgen.CreateScanLogParams{
		ProfileID: profile.ID,
		Device:    pgtype.Text{String: c.Get("User-Agent"), Valid: true},
		Location:  pgtype.Text{String: c.IP(), Valid: true},
		IpAddress: pgtype.Text{String: c.IP(), Valid: true},
	})

	
	return c.JSON(fiber.Map{
		"id":        profile.ID,
		"name":      profile.Name,
		"bio":       profile.Bio,
		"phone":     profile.Phone,
		"email":     profile.Email,
		"website":   profile.Website,
		"linkedin":  profile.Linkedin,
		"github":    profile.Github,
		"twitter":   profile.Twitter,
		"instagram": profile.Instagram,
	})
}