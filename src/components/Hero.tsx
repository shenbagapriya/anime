"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();
  return (
    <section className="w-full min-h-[60vh] flex flex-col items-center justify-center py-24 bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-6">
        Turn Your Photos Into <span className="text-primary">Studio Ghibli Art</span>
      </h1>
      <p className="text-lg md:text-2xl text-gray-600 text-center mb-8 max-w-2xl">
        Upload your photo and get a magical Studio Ghibli-style transformation in seconds.
      </p>
      <Button className="px-8 py-4 text-lg" onClick={() => router.push("/sign-up")}>Try Now</Button>
    </section>
  );
}
