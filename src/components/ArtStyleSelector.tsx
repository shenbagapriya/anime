"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STYLES = [
  {
    name: "Studio Ghibli",
    value: "ghibli",
    image: "/styles/ghibli.jpg",
  },
  {
    name: "Pixar",
    value: "pixar",
    image: "/styles/pixar.jpg",
  },
  {
    name: "Anime",
    value: "anime",
    image: "/styles/anime.jpg",
  },
  // Add more styles as needed
];

export function ArtStyleSelector({ imageId, onStyleSelected }: { imageId: string, onStyleSelected?: (style: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (style: string) => {
    setSelected(style);
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/set-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, style }),
      });
      if (!res.ok) throw new Error("Failed to save style");
      if (onStyleSelected) onStyleSelected(style);
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {STYLES.map((s) => (
        <Card
          key={s.value}
          className={`w-48 cursor-pointer border-2 transition-all ${selected === s.value ? "border-blue-600 shadow-lg" : "border-gray-200 hover:border-blue-300"}`}
          onClick={() => handleSelect(s.value)}
        >
          <CardContent className="flex flex-col items-center p-4">
            <img src={s.image} alt={s.name} className="w-32 h-32 object-cover rounded mb-2" />
            <span className="font-semibold text-lg mb-2">{s.name}</span>
            {selected === s.value && <span className="text-blue-600 font-bold">Selected</span>}
          </CardContent>
        </Card>
      ))}
      {saving && <p className="w-full text-center text-blue-500 mt-4">Saving...</p>}
      {error && <p className="w-full text-center text-red-500 mt-4">{error}</p>}
    </div>
  );
}
