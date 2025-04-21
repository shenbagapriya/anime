-- Add a 'result_url' column to the images table if it doesn't already exist
ALTER TABLE images ADD COLUMN IF NOT EXISTS result_url text;
