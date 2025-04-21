"use client";
import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "../lib/utils";

const samples = [
  {
    before: "/sample1-before.jpg",
    after: "/sample1-after.jpg",
    alt: "Sample 1"
  },
  {
    before: "/sample2-before.jpg",
    after: "/sample2-after.jpg",
    alt: "Sample 2"
  },
  {
    before: "/sample3-before.jpg",
    after: "/sample3-after.jpg",
    alt: "Sample 3"
  }
];

export function Carousel() {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i === 0 ? samples.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === samples.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <div className="flex gap-4 w-full">
        <div className="flex-1 flex flex-col items-center">
          <span className="text-xs mb-1">Before</span>
          <div className="relative w-48 h-48">
            <Image src={samples[index].before} alt={samples[index].alt + ' before'} fill className="object-cover rounded-lg border" />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <span className="text-xs mb-1">After</span>
          <div className="relative w-48 h-48">
            <Image src={samples[index].after} alt={samples[index].alt + ' after'} fill className="object-cover rounded-lg border" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={prev} className="rounded-full w-8 h-8 bg-gray-200 hover:bg-gray-300 flex items-center justify-center">←</button>
        <button onClick={next} className="rounded-full w-8 h-8 bg-gray-200 hover:bg-gray-300 flex items-center justify-center">→</button>
      </div>
      <div className="flex gap-1 mt-2">
        {samples.map((_, i) => (
          <span key={i} className={cn("w-2 h-2 rounded-full", i === index ? "bg-primary" : "bg-gray-300")}></span>
        ))}
      </div>
    </div>
  );
}
