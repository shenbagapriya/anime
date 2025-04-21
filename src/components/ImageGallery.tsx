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
  result_url?: string;
}

export function ImageGallery() {
  const { user } = useUser();
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'complete'>('all');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/list-images?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [user]);

  if (!user) return null;
  if (loading) return <p className="text-center mt-8">Loading images...</p>;
  if (images.length === 0) return <p className="text-center mt-8">No images uploaded yet.</p>;

  // Filtering
  const filteredImages = images.filter(img => {
    if (filter === 'all') return true;
    if (filter === 'in_progress') return img.status !== 'complete';
    if (filter === 'complete') return img.status === 'complete';
    return true;
  });

  return (
    <div className="w-full">
      <div className="flex gap-3 mb-6 justify-center">
        <button className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setFilter('all')}>All</button>
        <button className={`px-4 py-2 rounded ${filter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setFilter('in_progress')}>In Progress</button>
        <button className={`px-4 py-2 rounded ${filter === 'complete' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setFilter('complete')}>Complete</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {filteredImages.map((img) => (
          <div key={img.id} className="border rounded-lg p-4 flex flex-col items-center bg-white shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || 'animeart'}.s3.${process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1'}.amazonaws.com/${img.s3_key}`}
              alt={img.name}
              className="w-48 h-48 object-cover rounded mb-2"
            />
            <div className="font-semibold mb-1">{img.name}</div>
            <div className="text-sm text-gray-500 mb-1">Style: {img.style || 'Not selected'}</div>
            <div className="text-xs text-gray-400">Status: {img.status}</div>
            <div className="text-xs text-gray-400 mb-2">Uploaded: {new Date(img.created_at).toLocaleString()}</div>
            {img.status === 'complete' && img.result_url && (
              <a
                href={img.result_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                download
              >
                Download
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
