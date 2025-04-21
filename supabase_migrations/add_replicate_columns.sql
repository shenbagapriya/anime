-- Add columns to store Replicate API properties for each image
ALTER TABLE images ADD COLUMN IF NOT EXISTS replicate_prediction_id text;
ALTER TABLE images ADD COLUMN IF NOT EXISTS replicate_status text;
ALTER TABLE images ADD COLUMN IF NOT EXISTS replicate_output_url text;
ALTER TABLE images ADD COLUMN IF NOT EXISTS replicate_logs text;
