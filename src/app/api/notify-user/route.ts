import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { clerkClient } from "@clerk/nextjs/server";
import { sendUserEmail } from "@/utils/sendEmail";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { imageId } = await req.json();
  // 1. Get image/user info
  const { data: image, error } = await supabase.from("images").select("user_id, result_url").eq("s3_key", imageId).single();
  if (error || !image) return NextResponse.json({ error: "Image not found" }, { status: 404 });
  // 2. Get user email from Clerk
  const client = await clerkClient();
  const user = await client.users.getUser(image.user_id);
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!email) return NextResponse.json({ error: "User email not found" }, { status: 404 });
  // 3. Email content
  const html = `
    <div style="font-family: sans-serif;">
      <h1 style="color:#6366f1;">Your AI art is ready!</h1>
      <p>Download your image here:</p>
      <a href="${image.result_url}" style="background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Download Artwork</a>
      <p style="margin-top:24px;font-size:13px;color:#888;">This link may expire soon. Please save your artwork.</p>
    </div>
  `;
  await sendUserEmail({ to: email, subject: "Your AI art is ready!", html });
  // (Optional) Store notification timestamp in Supabase
  await supabase.from("images").update({ notified_at: new Date().toISOString() }).eq("s3_key", imageId);
  return NextResponse.json({ success: true });
}
