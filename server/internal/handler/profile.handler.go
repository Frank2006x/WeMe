package handler

import (
	"Frank2006x/WeMe/internal/dbgen"
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
	profile, err := h.Queries.GetProfileByUserID(c.Context(), profileUUID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Profile not found"})
	}
	return c.JSON(profile)
}

func (h *Handler) GetProfileMe(c fiber.Ctx) error {
	userId:=c.Locals("user_id")
	var userUUID pgtype.UUID
	if err := userUUID.Scan(userId); err != nil {
		return err
	}
	profile, err := h.Queries.GetProfileByUserID(c.Context(), userUUID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Profile not found"})
	}
	return c.JSON(profile)
}
func (h *Handler) Hello(c fiber.Ctx) error {
	return c.SendString("Hello, World!")
}

type request struct {
	UserID    pgtype.UUID `json:"user_id"`
	Name      string      `json:"name"`
	Bio       pgtype.Text `json:"bio"`
	Phone     pgtype.Text `json:"phone"`
	Email     pgtype.Text `json:"email"`
	Website   pgtype.Text `json:"website"`
	Linkedin  pgtype.Text `json:"linkedin"`
	Github    pgtype.Text `json:"github"`
	Twitter   pgtype.Text `json:"twitter"`
	Instagram pgtype.Text `json:"instagram"`
}

func (h *Handler) CreateProfile(c fiber.Ctx) error {
	

	var body request
	if err:=c.Bind().Body(&body) ; err != nil {
		return err
	}
	userId:=c.Locals("user_id")
	var userUUID pgtype.UUID
	if err := userUUID.Scan(userId); err != nil {
		return err
	}
	profile, err := h.Queries.CreateProfile(c.Context(), dbgen.CreateProfileParams{
		UserID: userUUID,
		Name:   body.Name,
		Bio:    body.Bio,
		Phone:  body.Phone,
		Email:  body.Email,
		Website: body.Website,
		Linkedin: body.Linkedin,
		Github: body.Github,
		Twitter: body.Twitter,
		Instagram: body.Instagram,
	})	

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create profile",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(profile)
}

func (h *Handler) UpdateProfile(c fiber.Ctx) error {
	
	var body request
	if err := c.Bind().Body(&body); err != nil {
		return err
	}
	userId := c.Locals("user_id")
	var userUUID pgtype.UUID
	if err := userUUID.Scan(userId); err != nil {
		return err
	}
	profile, err := h.Queries.GetProfileByUserID(c.Context(), userUUID)
    if err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Profile not found"})
    }

    updatedProfile, err := h.Queries.UpdateProfile(c.Context(), dbgen.UpdateProfileParams{
        ID:        profile.ID,
        Name:      body.Name,
        Bio:       body.Bio,
        Phone:     body.Phone,
        Email:     body.Email,
        Website:   body.Website,
        Linkedin:  body.Linkedin,
        Github:    body.Github,
        Twitter:   body.Twitter,
        Instagram: body.Instagram,
    })
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update profile",
		})
	}
	return c.JSON(updatedProfile)
}
