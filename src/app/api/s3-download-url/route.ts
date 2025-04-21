import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@supabase/supabase-js";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
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
  const { key } = await req.json();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });
  // Check ownership in Supabase
  const { data: image, error } = await supabase.from("images").select("user_id").eq("s3_key", key).single();
  if (error || !image || image.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 600 }); // 10 min
  return NextResponse.json({ downloadUrl: url });
}
