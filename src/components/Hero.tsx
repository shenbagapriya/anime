"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();
  return (
    <section className="w-full min-h-[60vh] flex flex-col items-center justify-center py-24 bg-gradient-to-b from-blue-50 to-white relative">
      {/* Auth buttons in top right */}
      <div className="absolute top-6 right-8 flex flex-row gap-4 z-10">
        <Button className="px-6 py-2 text-base" onClick={() => router.push("/signup")}>Sign Up</Button>
        <Button variant="outline" className="px-6 py-2 text-base" onClick={() => router.push("/login")}>Sign In</Button>
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-6">
        Turn Your Photos Into <span className="text-primary">Studio Ghibli Art</span>
      </h1>
      <p className="text-lg md:text-2xl text-gray-600 text-center mb-8 max-w-2xl">
        Upload your photo and get a magical Studio Ghibli-style transformation in seconds.
      </p>
    </section>
  );
}
