import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  // Support both Clerk auth and user_id as a query param for flexibility
  let userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) {
    const authObj = await auth();
    userId = authObj.userId;
  }
  if (!userId) return NextResponse.json({ images: [] });
  const { data, error } = await supabase
    .from("images")
    .select("id, name, s3_key, style, status, created_at, result_url")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ images: [], error: error.message }, { status: 500 });
  return NextResponse.json({ images: data });
}
