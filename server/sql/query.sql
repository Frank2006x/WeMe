-- name: CreateUser :one
INSERT INTO users (email, password)
VALUES ($1, $2)
RETURNING *;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1;

-- name: CreateProfile :one
INSERT INTO profiles (
    user_id, name, bio,
    phone, email, website,
    linkedin, github, twitter, instagram
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING *;

-- name: GetProfileByUserID :one
SELECT * FROM profiles
WHERE user_id = $1;

-- name: UpdateProfile :one
UPDATE profiles
SET name = $2,
    bio = $3,
    phone = $4,
    email = $5,
    website = $6,
    linkedin = $7,
    github = $8,
    twitter = $9,
    instagram = $10,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: CreateQRToken :one
INSERT INTO qr_tokens (profile_id, token, expires_at)
VALUES ($1, $2, $3)
RETURNING *;

-- name: DisableQRToken :exec
UPDATE qr_tokens
SET is_active = FALSE
WHERE token = $1;

-- name: GetProfileByToken :one
SELECT p.*
FROM qr_tokens q
JOIN profiles p ON p.id = q.profile_id
WHERE q.token = $1
AND q.is_active = TRUE
AND (q.expires_at IS NULL OR q.expires_at > NOW());

-- name: CreateScanLog :exec
INSERT INTO scan_logs (
    profile_id, device, location, ip_address
)
VALUES ($1, $2, $3, $4);

-- name: GetScanCount :one
SELECT COUNT(*) FROM scan_logs
WHERE profile_id = $1;