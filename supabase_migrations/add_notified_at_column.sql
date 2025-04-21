-- Add a column to track when the user was notified
ALTER TABLE images ADD COLUMN IF NOT EXISTS notified_at timestamptz;
