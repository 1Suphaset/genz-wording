-- migrations/002_add_password.sql
-- Add password_hash column to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_hash TEXT;
