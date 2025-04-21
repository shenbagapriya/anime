import { NextRequest, NextResponse } from "next/server";

// Set these as env vars or hardcode for test
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID!;
const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY!;
const PLANS = {
  free: process.env.LEMONSQUEEZY_FREE_PRODUCT_ID!,
  payg: process.env.LEMONSQUEEZY_PAYG_PRODUCT_ID!,
  sub: process.env.LEMONSQUEEZY_SUB_PRODUCT_ID!,
};

export async function POST(req: NextRequest) {
  const { plan, userId, imageId } = await req.json();
  const productId = PLANS[plan as keyof typeof PLANS];
  if (!productId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  // Lemon Squeezy API: https://docs.lemonsqueezy.com/api/checkouts#create-a-checkout
  const res = await fetch(`https://api.lemonsqueezy.com/v1/checkouts`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${LEMONSQUEEZY_API_KEY}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "checkout_data": {
        "custom": { userId, imageId },
        "redirect_url": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/success`,
        "product_id": productId,
        "variant_id": null // Use if you have variants
      },
      "store_id": LEMONSQUEEZY_STORE_ID
    })
  });
  const data = await res.json();
  if (!res.ok || !data.data?.attributes?.url) {
    return NextResponse.json({ error: data.errors?.[0]?.detail || "Failed to create checkout" }, { status: 500 });
  }
  return NextResponse.json({ url: data.data.attributes.url });
}
