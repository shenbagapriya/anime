"use client";
import { useUser, SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/nextjs";
import { UploadImage } from "@/components/UploadImage";
import { ImageGallery } from "@/components/ImageGallery";
import { ArtStyleSelector } from "@/components/ArtStyleSelector";
import { useState } from 'react';

export default function DashboardPage() {
  const { user } = useUser();
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [lastImageId, setLastImageId] = useState<string | null>(null);

  const handleUploaded = (imageId: string) => {
    setLastImageId(imageId);
    setShowStyleSelector(true);
  };

  return (
    <>
      <SignedIn>
        {/* App Header */}
        <header className="w-full fixed top-0 left-0 z-30 bg-white/80 border-b border-blue-100 shadow-sm h-16 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-fuchsia-600 via-blue-600 to-indigo-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">anime</span>
            <span className="text-xs md:text-sm font-medium text-blue-700 ml-2">AI Art SaaS</span>
          </div>
          <div className="ml-auto">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <div className="relative flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50 pb-24">
          <div className="w-full max-w-4xl mx-auto px-4 pt-20">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-fuchsia-600 via-blue-600 to-indigo-500 bg-clip-text text-transparent mb-3 drop-shadow-sm">
              Welcome, {user?.firstName || user?.username || "User"}!
            </h1>
            <p className="text-lg md:text-xl text-center text-gray-600 mb-8">
              Upload your photo, pick a style, and download your magical AI art!
            </p>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center mb-12">
              <div className="w-full md:w-1/2 bg-white/80 rounded-2xl shadow-lg p-8 border border-blue-100">
                <UploadImage onUploaded={handleUploaded} />
                {showStyleSelector && lastImageId && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2 text-center">Choose an art style for your image:</h2>
                    <ArtStyleSelector imageId={lastImageId} onStyleSelected={() => setShowStyleSelector(false)} />
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-xl border border-blue-100 px-6 py-8 mt-8">
              <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Your Art History</h2>
              <ImageGallery />
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
