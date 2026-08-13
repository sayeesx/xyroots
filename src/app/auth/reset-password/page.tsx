"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { resetPassword } from "@/lib/actions/auth";
import { FaLock, FaArrowRight, FaCircleCheck } from "react-icons/fa6";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await resetPassword({ password });
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setError(result.error || "Failed to reset password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-xyroots-cream/40 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 border border-xyroots-border">
          <div className="text-center mb-8">
            <Image src="/logo1.webp" alt="Xyroots" width={140} height={42} className="h-9 w-auto mx-auto mb-6" />
            {success ? (
              <>
                <div className="w-14 h-14 bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <FaCircleCheck className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-bold text-black mb-2">Password Updated</h1>
                <p className="text-sm text-xyroots-muted">Your password has been successfully reset. Redirecting to login...</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-black mb-2">Reset Your Password</h1>
                <p className="text-sm text-xyroots-muted">Enter your new password below.</p>
              </>
            )}
          </div>

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">New Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-xyroots-muted" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-xyroots-cream/60 border border-xyroots-border outline-none focus:border-xyroots-teal"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Confirm Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-xyroots-muted" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-xyroots-cream/60 border border-xyroots-border outline-none focus:border-xyroots-teal"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-xyroots-teal text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {loading ? "Updating..." : "Reset Password"}
                {!loading && <FaArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
