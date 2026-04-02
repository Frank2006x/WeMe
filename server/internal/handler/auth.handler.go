package handler

import (
	"Frank2006x/WeMe/internal/db"
	"Frank2006x/WeMe/internal/model"
	"os"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(c fiber.Ctx) error {
	type request struct {
		Email string `json:"email"`
		Password string `json:"password"`
	}

	var body request

	if err:=c.Bind().Body(&body) ; err!= nil {	
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var existingUser model.User
	if err := db.DB.Where("email = ?", body.Email).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "User already exists",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash password",
		})
	}
	user := model.User{
		Email:        body.Email,
		PasswordHash: string(hashedPassword),
	}

	res:=db.DB.Create(&user)

	if res.Error != nil {	
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create user",
			})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "User registered successfully",
	})
}


func LoginUser(c fiber.Ctx) error {
	type request struct {
		Email string `json:"email"`
		Password string `json:"password"`
	}

	var body request

	if err := c.Bind().Body(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var user model.User
	if err := db.DB.Where("email = ?", body.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(body.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}
	token:=jwt.NewWithClaims(jwt.SigningMethodHS256,jwt.MapClaims{
		"userId": user.ID,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})
	jwtSecretKey:=os.Getenv("JWTSECRET_KEY")
	t,err:=token.SignedString([]byte(jwtSecretKey))
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate token",
		})
	}
	c.Cookie(&fiber.Cookie{
		Name: "jwt",
		Value: t,
		HTTPOnly: true,
		Secure: true,
		SameSite: "Strict",
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Login successful",
	})
}

func LogoutUser(c fiber.Ctx) error{
	c.Cookie(&fiber.Cookie{
		Name: "jwt",
		Value: "",
		HTTPOnly: true,
		Secure: true,
		SameSite: "Strict",
		Expires: time.Now().Add(-24 * time.Hour),
	})
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Logout successful",
	})
}
