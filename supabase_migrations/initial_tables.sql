-- Migration for initial tables used in the app

-- Images table
CREATE TABLE IF NOT EXISTS images (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    user_id text NOT NULL,
    status text NOT NULL DEFAULT 'uploaded',
    s3_key text NOT NULL,
    style text,
    created_at timestamptz DEFAULT now()
);

-- (Optional) Add more tables as needed for your app's features
