import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { filename, type } = await req.json();
  const imageId = `${userId}_${Date.now()}_${filename}`;
  const bucket = process.env.AWS_BUCKET_NAME!;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: imageId,
    ContentType: type,
  });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

  // Save metadata in Supabase
  await supabase.from("images").insert([
    { name: filename, user_id: userId, status: "uploaded", s3_key: imageId },
  ]);

  return NextResponse.json({ uploadUrl, imageId });
}
