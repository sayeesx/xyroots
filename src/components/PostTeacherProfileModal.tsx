"use client";

import { useState } from "react";
import { FaXmark, FaSpinner, FaCircleCheck } from "react-icons/fa6";
import ResumeUpload from "@/components/ResumeUpload";
import type { ResumeData } from "@/lib/resume/schema";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";

interface PostTeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const subjectOptions = [
  "Mathematics","Physics","Chemistry","Biology","English","Hindi","Social Science",
  "Computer Science","Commerce","Economics","History","Geography","Sanskrit",
  "Physical Education","Art & Craft","Music","EVS","General Science",
];

export default function PostTeacherProfileModal({ isOpen, onClose, onSuccess }: PostTeacherProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { profile } = useAuth();
  const supabase = createClient();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    subject: "",
    qualification: "",
    professional_qualification: "",
    experience_years: "",
    bio: "",
    skills: "",
    linkedin: "",
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleResumeExtracted = (data: ResumeData) => {
    setForm(prev => ({
      ...prev,
      fullName: prev.fullName || data.fullName || "",
      email: prev.email || data.email || "",
      phone: prev.phone || data.phone || "",
      location: prev.location || data.location || data.city || "",
      title: prev.title || data.title || "",
      subject: prev.subject || data.subject || "",
      qualification: prev.qualification || data.qualification || "",
      professional_qualification: prev.professional_qualification || data.professionalQualification || "",
      experience_years: prev.experience_years || (data.experienceYears ? String(data.experienceYears) : ""),
      skills: prev.skills || (data.skills?.join(", ") || ""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.subject) {
      setError("Candidate name and subject are required.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Create a managed teacher profile entry in the database
      // Insert into profiles as a managed (non-auth) teacher placeholder
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        setError("You must be logged in.");
        return;
      }

      // Get agency profile id
      const { data: agencyProfile } = await supabase
        .from("agency_profiles")
        .select("id")
        .eq("profile_id", profile?.id)
        .single();

      if (!agencyProfile) {
        setError("Agency profile not found.");
        return;
      }

      // We store managed teacher profiles as a special job listing (posting on behalf)
      // For now, insert a draft job that represents the teacher's availability
      const skillsArray = form.skills
        ? form.skills.split(",").map(s => s.trim()).filter(Boolean)
        : [];

      const { error: dbError } = await supabase.from("jobs").insert({
        posted_by_profile_id: profile?.id,
        posted_by_role: "agency",
        title: `${form.title || "Teacher"} – ${form.fullName}`,
        subject: form.subject,
        description: form.bio || null,
        qualification: form.qualification || null,
        professional_qualification: form.professional_qualification || null,
        experience_min: form.experience_years ? parseInt(form.experience_years) : null,
        location: form.location || null,
        school_name: form.fullName, // repurposed as candidate name marker
        status: "published",
      });

      if (dbError) {
        setError("Failed to post profile. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
        onClose();
        setForm({
          fullName: "", email: "", phone: "", location: "", title: "", subject: "",
          qualification: "", professional_qualification: "", experience_years: "", bio: "",
          skills: "", linkedin: "",
        });
      }, 1800);
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
      <div
        className="bg-white w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        style={{ borderRadius: "1.5rem" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Post a Teacher Profile</h2>
            <p className="text-sm text-gray-500 mt-0.5">Add a candidate profile on behalf of a teacher.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            style={{ borderRadius: "50%" }}
            aria-label="Close"
          >
            <FaXmark className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 bg-green-100 flex items-center justify-center" style={{ borderRadius: "50%" }}>
              <FaCircleCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Profile Posted!</h3>
            <p className="text-sm text-gray-500">The teacher profile has been published.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-7 py-5 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm" style={{ borderRadius: "0.75rem" }}>
                {error}
              </div>
            )}

            {/* Resume Upload */}
            <div className="p-4 bg-gray-50 border border-gray-200" style={{ borderRadius: "0.75rem" }}>
              <ResumeUpload onExtracted={handleResumeExtracted} />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-500 font-bold uppercase">Or Enter Manually</span>
              </div>
            </div>

            {/* Personal */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Personal Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="e.g. Anjali Menon"
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                    style={{ borderRadius: "0.75rem" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="teacher@example.com"
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                    style={{ borderRadius: "0.75rem" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                    style={{ borderRadius: "0.75rem" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Location</label>
                  <input value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Kochi, Kerala"
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                    style={{ borderRadius: "0.75rem" }} />
                </div>
              </div>
            </div>

            {/* Professional */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Professional Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Professional Title</label>
                  <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Senior Mathematics Teacher"
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                    style={{ borderRadius: "0.75rem" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Primary Subject <span className="text-red-500">*</span></label>
                  <select value={form.subject} onChange={e => set("subject", e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                    style={{ borderRadius: "0.75rem" }}>
                    <option value="">Select subject</option>
                    {subjectOptions.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Academic Qualification</label>
                  <input value={form.qualification} onChange={e => set("qualification", e.target.value)} placeholder="e.g. M.Sc Mathematics"
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                    style={{ borderRadius: "0.75rem" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Teaching Qualification</label>
                  <input value={form.professional_qualification} onChange={e => set("professional_qualification", e.target.value)} placeholder="e.g. B.Ed"
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                    style={{ borderRadius: "0.75rem" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Years of Experience</label>
                  <input type="number" min="0" value={form.experience_years} onChange={e => set("experience_years", e.target.value)} placeholder="e.g. 5"
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                    style={{ borderRadius: "0.75rem" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Skills (comma-separated)</label>
                  <input value={form.skills} onChange={e => set("skills", e.target.value)} placeholder="e.g. Mathematics, Problem Solving"
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                    style={{ borderRadius: "0.75rem" }} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Professional Bio (Optional)</label>
              <textarea value={form.bio} onChange={e => set("bio", e.target.value)} rows={3}
                placeholder="Brief description of the teacher's background and expertise..."
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all resize-none"
                style={{ borderRadius: "0.75rem" }} />
            </div>

            <div className="flex gap-3 pb-2">
              <button type="button" onClick={onClose}
                className="flex-1 px-6 py-3 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                style={{ borderRadius: "0.75rem" }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-[2] px-6 py-3 text-sm font-semibold bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ borderRadius: "0.75rem" }}>
                {loading ? (
                  <><FaSpinner className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><FaCircleCheck className="w-4 h-4" /> Save & Post Profile</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
