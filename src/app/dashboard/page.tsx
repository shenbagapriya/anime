"use client";
import { useUser, SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/nextjs";
import { UploadImage } from "@/components/UploadImage";
import { ImageGallery } from "@/components/ImageGallery";

export default function DashboardPage() {
  const { user } = useUser();
  return (
    <>
      <SignedIn>
        {/* User icon at top right for sign out and account management */}
        <div className="absolute top-6 right-8 z-20">
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold mb-4">Welcome, {user?.firstName || user?.username || "User"}!</h1>
          <p className="text-lg">This is your dashboard.</p>
          <UploadImage />
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen mt-8">
          <ImageGallery />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
