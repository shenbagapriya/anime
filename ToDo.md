* Improve the S3 bucket policy and restrict the public access
* The Lemon Squeezy webhook handler (/api/webhook) now:
Marks the image as "paid" in Supabase.
Immediately triggers the /api/process-image endpoint for that image.
* Ensure RLS (Row-Level Security) is enabled to restrict image access to owner only.
