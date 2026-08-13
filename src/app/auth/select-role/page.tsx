"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth/AuthProvider";
import { FaGraduationCap, FaBuilding, FaBriefcase, FaArrowRight } from "react-icons/fa6";

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<"teacher" | "management" | "agency" | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleContinue = async () => {
    if (!selectedRole) return;
    setLoading(true);

    try {
      // Import ensureProfileExists dynamically to use server action
      const { ensureProfileExists } = await import("@/lib/actions/auth");
      const result = await ensureProfileExists(selectedRole);

      if (result.success) {
        if (selectedRole === "teacher") router.push("/dashboard/teacher");
        else if (selectedRole === "management") router.push("/dashboard/employer");
        else router.push("/dashboard/agency");
      }
    } catch {
      console.error("Role selection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-xyroots-cream/40 px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <Image src="/logo1.webp" alt="Xyroots" width={160} height={48} className="h-10 w-auto mx-auto mb-6" />
          <h1 className="font-editorial text-3xl text-black mb-2">Welcome to Xyroots</h1>
          <p className="text-sm text-xyroots-muted">
            How will you be using Xyroots? Select your account type to continue.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {[
            { role: "teacher" as const, label: "I'm a Teacher", desc: "Find teaching jobs and build your profile", icon: FaGraduationCap, color: "xyroots-teal" },
            { role: "management" as const, label: "I'm a School / Institution", desc: "Post jobs and discover teachers", icon: FaBuilding, color: "xyroots-yellow" },
            { role: "agency" as const, label: "I'm a Recruitment Agency", desc: "Post jobs on behalf of institutions", icon: FaBriefcase, color: "purple-600" },
          ].map(({ role, label, desc, icon: Icon, color }) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`w-full p-5 text-left border-2 transition-all flex items-center gap-4 ${
                selectedRole === role
                  ? `border-${color} bg-${color}/5`
                  : "border-xyroots-border bg-white hover:border-gray-300"
              }`}
            >
              <div className={`w-12 h-12 flex items-center justify-center ${
                selectedRole === role ? `bg-${color} text-white` : "bg-xyroots-cream text-xyroots-muted"
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">{label}</p>
                <p className="text-xs text-xyroots-muted">{desc}</p>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedRole || loading}
          className={`w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            selectedRole
              ? "bg-xyroots-teal text-white hover:opacity-90"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Setting up your account..." : "Continue"}
          {!loading && <FaArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
