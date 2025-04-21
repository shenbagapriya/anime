"use client";
import { useUser } from "@clerk/nextjs";
import { Checkout } from "@/components/Checkout";

export default function CheckoutPage() {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Checkout userId={user.id} />
    </div>
  );
}
