"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface UploadResponse {
  uploadUrl: string;
  imageId: string;
}

export function UploadImage({ onUploaded }: { onUploaded?: (imageId: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [uploadedImageId, setUploadedImageId] = useState<string | null>(null); // not used

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      // 1. Get signed upload URL from backend
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, type: file.type }),
      });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, imageId } = (await res.json()) as UploadResponse;

      // 2. Upload to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) throw new Error("Failed to upload to S3");
      // setUploadedImageId(imageId);
      if (onUploaded) onUploaded(imageId);
      // Optionally: notify backend of completion
      // await fetch(`/api/mark-uploaded?id=${imageId}`);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    }
    setUploading(false);
  }, [onUploaded]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-400 rounded-lg p-8 flex flex-col items-center cursor-pointer bg-white hover:bg-gray-50 transition">
      <input {...getInputProps()} />
      {preview ? (
        <Image src={preview} alt="Preview" width={200} height={200} className="object-contain rounded-lg mb-4" />
      ) : (
        <>
          <p className="text-lg text-gray-500 mb-2">Drag & drop an image here, or click to select</p>
          <p className="text-sm text-gray-400">JPG or PNG, max 10MB</p>
        </>
      )}
      {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
