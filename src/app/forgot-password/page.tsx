"use client";

import { useState } from "react";
import Image from "next/image";
import { forgotPassword } from "@/lib/actions/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaEnvelope, FaArrowRight, FaArrowLeft, FaCircleCheck } from "react-icons/fa6";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await forgotPassword({ email });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-xyroots-cream/40">
      <Navbar />

      <main className="flex-1 pt-28 lg:pt-36 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white p-8 border border-xyroots-border">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-xyroots-teal text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                X
              </div>

              {sent ? (
                <>
                  <div className="w-14 h-14 bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <FaCircleCheck className="w-7 h-7" />
                  </div>
                  <h1 className="font-editorial text-2xl text-black mb-2">Check Your Email</h1>
                  <p className="text-sm text-xyroots-muted">
                    If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link.
                    Please check your inbox and spam folder.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="font-editorial text-2xl text-black mb-2">Forgot Password?</h1>
                  <p className="text-sm text-xyroots-muted">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </p>
                </>
              )}
            </div>

            {!sent && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-black mb-1.5">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-xyroots-muted" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-xyroots-cream/60 border border-xyroots-border outline-none focus:border-xyroots-teal"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-xyroots-teal text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                  {!loading && <FaArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-xyroots-teal hover:underline"
              >
                <FaArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
