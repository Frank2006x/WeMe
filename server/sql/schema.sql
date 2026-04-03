-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    bio TEXT,

  
    phone TEXT,
    email TEXT,
    website TEXT,

    linkedin TEXT,
    github TEXT,
    twitter TEXT,
    instagram TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE UNIQUE INDEX one_profile_per_user
ON profiles(user_id);


CREATE TABLE qr_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    token TEXT UNIQUE NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE scan_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

    scanned_at TIMESTAMP DEFAULT NOW(),

    device TEXT,
    location TEXT,
    ip_address TEXT
);


CREATE INDEX idx_profiles_user_id 
ON profiles(user_id);

CREATE INDEX idx_qr_tokens_token 
ON qr_tokens(token);

CREATE INDEX idx_scan_logs_profile_id 
ON scan_logs(profile_id);

CREATE INDEX idx_scan_logs_scanned_at 
ON scan_logs(scanned_at);