"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const PLANS = [
  { name: "Free Trial", id: "free", price: 0 },
  { name: "Pay-per-use", id: "payg", price: 5 },
  { name: "Subscription", id: "sub", price: 15 },
];

export function Checkout({ userId, imageId }: { userId: string; imageId?: string }) {
  const [selected, setSelected] = useState<string>(PLANS[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected, userId, imageId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Choose a plan</h2>
      <div className="flex flex-col gap-3 mb-6">
        {PLANS.map((plan) => (
          <label key={plan.id} className={`flex items-center p-3 border rounded cursor-pointer ${selected === plan.id ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}>
            <input
              type="radio"
              name="plan"
              value={plan.id}
              checked={selected === plan.id}
              onChange={() => setSelected(plan.id)}
              className="mr-3"
            />
            <span className="font-semibold">{plan.name}</span>
            <span className="ml-auto">{plan.price === 0 ? "Free" : `$${plan.price}`}</span>
          </label>
        ))}
      </div>
      <Button onClick={handleCheckout} disabled={loading} className="w-full">
        {loading ? "Redirecting..." : "Proceed to Checkout"}
      </Button>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
}
