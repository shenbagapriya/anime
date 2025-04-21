"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp path="/signup" routing="path" signInUrl="/login" />
    </div>
  );
}
