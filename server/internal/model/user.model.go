package model

import (
	"time"

	"gorm.io/gorm"
)

// User represents the user schema in the database
type User struct {
	gorm.Model
	Email        string    `gorm:"uniqueIndex;not null;size:255" json:"email"`
	PasswordHash string    `gorm:"not null" json:"-"`
	FullName     string    `gorm:"size:100" json:"full_name"`
	LastLogin    time.Time `json:"last_login"`
}
