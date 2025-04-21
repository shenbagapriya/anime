import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const event = await req.json();
  // Lemon Squeezy webhook docs: https://docs.lemonsqueezy.com/help/webhooks
  if (event.meta?.event_name === "order_created") {
    const userId = event.data?.attributes?.custom_data?.userId;
    const imageId = event.data?.attributes?.custom_data?.imageId;
    if (userId && imageId) {
      await supabase.from("images").update({ status: "paid" }).eq("user_id", userId).eq("s3_key", imageId);
    }
  }
  return NextResponse.json({ received: true });
}
