"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaShieldHalved, FaArrowLeft, FaUser } from "react-icons/fa6";
import { Suspense } from "react";

function AccessDeniedContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const from = searchParams.get("from");

  const roleMessages: Record<string, string> = {
    teacher: "Teacher accounts cannot access this section. This area is reserved for schools and recruitment agencies.",
    management: "Management accounts cannot access this section. This area is reserved for teachers and job seekers.",
    agency: "Your agency account doesn't have access to this particular section.",
  };

  const message = role ? roleMessages[role] || "You don't have permission to access this section with your current account." : "You don't have permission to access this section with your current account.";

  return (
    <div className="min-h-screen flex flex-col bg-xyroots-cream/40">
      <Navbar />

      <main className="flex-1 pt-28 lg:pt-36 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="bg-white p-8 border border-xyroots-border">
            <div className="w-16 h-16 bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
              <FaShieldHalved className="w-8 h-8" />
            </div>

            <h1 className="font-editorial text-2xl text-black mb-3">
              This page isn&apos;t available
            </h1>

            <p className="text-sm text-xyroots-muted mb-8 leading-relaxed">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 py-3 px-6 text-sm font-semibold border border-xyroots-border text-black hover:bg-xyroots-cream transition-colors flex items-center justify-center gap-2"
              >
                <FaArrowLeft className="w-4 h-4" />
                Go back
              </Link>
              <Link
                href="/profile"
                className="flex-1 py-3 px-6 text-sm font-semibold bg-xyroots-teal text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <FaUser className="w-4 h-4" />
                Go to profile
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AccessDeniedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-xyroots-cream/40">
        <p className="text-xyroots-muted">Loading...</p>
      </div>
    }>
      <AccessDeniedContent />
    </Suspense>
  );
}
