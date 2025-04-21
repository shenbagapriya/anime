"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface ImageRecord {
  id: string;
  name: string;
  s3_key: string;
  style: string | null;
  status: string;
  created_at: string;
}

export function ImageGallery() {
  const { user } = useUser();
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/list-images?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load images");
        setLoading(false);
      });
  }, [user]);

  if (!user) return null;
  if (loading) return <p className="text-center mt-8">Loading images...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (images.length === 0) return <p className="text-center mt-8">No images uploaded yet.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {images.map((img) => (
        <div key={img.id} className="border rounded-lg p-4 flex flex-col items-center bg-white shadow">
          <img
            src={`https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || 'animeart'}.s3.${process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1'}.amazonaws.com/${img.s3_key}`}
            alt={img.name}
            className="w-48 h-48 object-cover rounded mb-2"
            // onError={e => (e.currentTarget.src = '/placeholder.jpg')}
          />
          <div className="font-semibold mb-1">{img.name}</div>
          <div className="text-sm text-gray-500 mb-1">Style: {img.style || 'Not selected'}</div>
          <div className="text-xs text-gray-400">Status: {img.status}</div>
          <div className="text-xs text-gray-400">Uploaded: {new Date(img.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
