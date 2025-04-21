import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  const { imageId } = await req.json();
  // 1. Fetch image entry from Supabase
  const { data: image, error } = await supabase.from("images").select("s3_key, style, user_id").eq("s3_key", imageId).single();
  if (error || !image) return NextResponse.json({ error: error?.message || "Image not found" }, { status: 404 });

  // 2. Construct S3 URL and style prompt
  const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${image.s3_key}`;
  const stylePrompt = getPromptForStyle(image.style);

  // 3. Call Replicate API
  const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: process.env.REPLICATE_MODEL_VERSION, // e.g. "your-model-version-id"
      input: {
        image: s3Url,
        prompt: stylePrompt
      }
    })
  });
  const replicateData = await replicateRes.json();
  const resultUrl = replicateData?.output?.[0] || replicateData?.output;
  if (!resultUrl) return NextResponse.json({ error: "Replicate failed" }, { status: 500 });

  // 4. Download result image and upload to S3
  const resultKey = `result_${imageId}.jpg`;
  const putCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: resultKey,
    ContentType: "image/jpeg"
  });
  const signedPutUrl = await getSignedUrl(s3, putCommand, { expiresIn: 60 * 5 });
  // Download image from Replicate and upload to S3
  const resultImageRes = await fetch(resultUrl);
  const resultImageBuffer = Buffer.from(await resultImageRes.arrayBuffer());
  const uploadRes = await fetch(signedPutUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/jpeg" },
    body: resultImageBuffer
  });
  if (!uploadRes.ok) return NextResponse.json({ error: "Failed to upload result to S3" }, { status: 500 });

  // 5. Update Supabase entry
  const { error: updateError } = await supabase
    .from("images")
    .update({ status: "complete", result_url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${resultKey}` })
    .eq("s3_key", imageId)
    .eq("user_id", image.user_id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  // 6. Notify user by email
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/notify-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageId })
  });

  return NextResponse.json({ success: true, resultUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${resultKey}` });
}

function getPromptForStyle(style: string) {
  switch (style) {
    case "ghibli": return "in the style of Studio Ghibli animation";
    case "pixar": return "in the style of a Pixar movie";
    case "anime": return "in the style of Japanese anime";
    default: return "artistic style";
  }
}
