-- name: CreateUser :one
INSERT INTO users (email, password)
VALUES ($1, $2)
RETURNING *;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1;

-- name: GetUserByID :one
SELECT * FROM users
WHERE id = $1;

-- name: CreateProfile :one
INSERT INTO profiles (user_id, name, bio)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetProfileByUserID :one
SELECT * FROM profiles
WHERE user_id = $1;

-- name: GetProfileByID :one
SELECT * FROM profiles
WHERE id = $1;

-- name: UpdateProfile :one
UPDATE profiles
SET name = $2,
    bio = $3,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteProfile :exec
DELETE FROM profiles
WHERE id = $1;

-- name: UpsertProfileContacts :one
INSERT INTO profile_contacts (
    profile_id, phone, email, website,
    linkedin, github, twitter, instagram
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (profile_id) DO UPDATE SET
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    website = EXCLUDED.website,
    linkedin = EXCLUDED.linkedin,
    github = EXCLUDED.github,
    twitter = EXCLUDED.twitter,
    instagram = EXCLUDED.instagram,
    updated_at = NOW()
RETURNING *;

-- name: GetProfileContacts :one
SELECT * FROM profile_contacts
WHERE profile_id = $1;

-- name: CreateQRToken :one
INSERT INTO qr_tokens (profile_id, token, expires_at)
VALUES ($1, $2, $3)
RETURNING *;

-- name: DisableQRToken :exec
UPDATE qr_tokens
SET is_active = FALSE
WHERE token = $1;

-- name: GetProfileByToken :one
SELECT 
    p.id,
    p.name,
    p.bio,
    

    pc.phone,
    pc.email,
    pc.website,
    pc.linkedin,
    pc.github,
    pc.twitter,
    pc.instagram

FROM qr_tokens q
JOIN profiles p ON p.id = q.profile_id
LEFT JOIN profile_contacts pc ON pc.profile_id = p.id

WHERE q.token = $1
AND q.is_active = TRUE
AND (q.expires_at IS NULL OR q.expires_at > NOW());

-- name: CreateScanLog :exec
INSERT INTO scan_logs (
    profile_id, device, location, ip_address
)
VALUES ($1, $2, $3, $4);

-- name: GetScanLogsByProfile :many
SELECT * FROM scan_logs
WHERE profile_id = $1
ORDER BY scanned_at DESC
LIMIT $2;

-- name: GetScanCount :one
SELECT COUNT(*) FROM scan_logs
WHERE profile_id = $1;