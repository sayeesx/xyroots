"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaEnvelope, FaLock, FaArrowRight, FaCircleExclamation, FaSpinner } from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, isAuthenticated, role } = useAuth();
  const returnTo = searchParams.get('redirect') || null;
  const authError = searchParams.get('error') || null;

  useEffect(() => {
    // If already authenticated, redirect to appropriate dashboard
    if (isAuthenticated && role) {
      if (returnTo) {
        router.push(returnTo);
      } else {
        if (role === 'teacher') router.push('/dashboard/teacher');
        else if (role === 'management') router.push('/dashboard/employer');
        else router.push('/dashboard/agency');
      }
    }
  }, [isAuthenticated, role, router, returnTo]);

  useEffect(() => {
    if (authError === 'auth_failed') {
      setError('Authentication failed. Please try again.');
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn(email, password);
      
      if (result.success && result.data) {
        // Redirection is handled by the useEffect above
      } else {
        setError(result.error || 'Failed to sign in. Please check your credentials.');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-xyroots-cream/40">
      <Navbar />

      <main className="flex-1 pt-28 lg:pt-36 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 border border-xyroots-border shadow-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-xyroots-teal text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                X
              </div>
              <h1 className="font-editorial text-3xl text-black mb-2">Welcome Back</h1>
              <p className="text-xs text-xyroots-muted">Sign in to your Xyroots account to continue.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
                <FaCircleExclamation className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-black block mb-1.5">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-xyroots-muted" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border outline-none focus:ring-2 focus:ring-xyroots-teal disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-black">Password</label>
                  <Link href="/forgot-password" className="text-xs text-xyroots-teal font-semibold hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-xyroots-muted" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-xyroots-cream/60 rounded-xl border border-xyroots-border outline-none focus:ring-2 focus:ring-xyroots-teal disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-xyroots-teal text-white hover:bg-xyroots-dark transition-all btn-hover flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Xyroots
                    <FaArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-xs text-xyroots-muted before:h-px before:flex-1 before:bg-xyroots-border before:mr-4 after:h-px after:flex-1 after:bg-xyroots-border after:ml-4">
              OR
            </div>

            <button
              onClick={() => signInWithGoogle()}
              disabled={loading}
              type="button"
              className="mt-6 w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-white border border-xyroots-border text-black hover:bg-xyroots-cream transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" width={16} height={16} />
              Continue with Google
            </button>

            {/* Footer notice */}
            <div className="mt-8 pt-6 border-t border-xyroots-border text-center">
              <p className="text-xs text-xyroots-muted mb-2">Don't have an account yet?</p>
              <div className="flex items-center justify-center gap-4 text-xs">
                <Link href="/register/teacher" className="text-xyroots-teal font-bold hover:underline">
                  Teacher Registration
                </Link>
                <span className="text-xyroots-border">|</span>
                <Link href="/register/employer" className="text-xyroots-teal font-bold hover:underline">
                  School Registration
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
