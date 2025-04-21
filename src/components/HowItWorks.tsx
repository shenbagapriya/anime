import { CheckCircle } from "lucide-react";

const steps = [
  { title: "Upload", description: "Upload your photo to get started." },
  { title: "Choose Style", description: "Pick the Studio Ghibli style transformation." },
  { title: "Pay", description: "Select a plan and complete payment securely." },
  { title: "Download", description: "Download your magical Ghibli-style image!" },
];

export function HowItWorks() {
  return (
    <section className="w-full py-16 bg-white" id="how-it-works">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-white mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
              {idx < steps.length - 1 && (
                <span className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-300 text-3xl">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
