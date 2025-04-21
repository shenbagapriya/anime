import { Button } from "./ui/button";

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    features: ["3 image conversions", "Standard quality", "No credit card required"],
    cta: "Try Free",
    highlight: false,
  },
  {
    name: "Basic",
    price: "$9/mo",
    features: ["50 image conversions/mo", "HD quality", "Priority support"],
    cta: "Choose Basic",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29/mo",
    features: ["Unlimited conversions", "Ultra HD quality", "Priority support", "Commercial use"],
    cta: "Go Pro",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section className="w-full py-16 bg-gray-50" id="pricing">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 flex flex-col items-center ${plan.highlight ? "bg-primary text-white border-primary shadow-lg scale-105" : "bg-white"}`}
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-4">{plan.price}</div>
              <ul className="mb-6 space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span> {f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.highlight ? "default" : "outline"} className="w-full mt-auto">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
