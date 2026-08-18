"use client";

import { useState, useRef } from "react";
import { FaXmark, FaSpinner, FaCircleCheck, FaCamera } from "react-icons/fa6";
import { createJob } from "@/lib/actions/jobs";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { v4 as uuidv4 } from "uuid";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  SUBJECT_OPTIONS,
  QUALIFICATION_OPTIONS,
  PROFESSIONAL_QUALIFICATION_OPTIONS,
  BOARD_OPTIONS,
  LEVEL_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  INSTITUTION_TYPE_OPTIONS,
  EXPERIENCE_OPTIONS,
  toSelectOptions,
} from "@/lib/constants/options";

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Build select options from centralized constants
const subjectSelectOptions = toSelectOptions(SUBJECT_OPTIONS, "Select subject");
const boardSelectOptions = toSelectOptions(BOARD_OPTIONS, "Any Board");
const levelSelectOptions = toSelectOptions(LEVEL_OPTIONS, "Any Level");
const employmentSelectOptions = EMPLOYMENT_TYPE_OPTIONS.map(t => ({ value: t, label: t }));
const institutionTypeOptions = toSelectOptions(INSTITUTION_TYPE_OPTIONS, "Select type");
const qualificationSelectOptions = toSelectOptions(QUALIFICATION_OPTIONS, "e.g. B.Sc / M.Sc");
const professionalQualificationSelectOptions = toSelectOptions(PROFESSIONAL_QUALIFICATION_OPTIONS, "e.g. B.Ed");
const expMinOptions = [{ value: "", label: "Min exp" }, ...EXPERIENCE_OPTIONS];
const expMaxOptions = [{ value: "", label: "Max exp" }, ...EXPERIENCE_OPTIONS];
const statusSelectOptions = [
  { value: "published", label: "Published (Live Now)" },
  { value: "draft", label: "Draft (Save for Later)" },
];

export default function PostJobModal({ isOpen, onClose, onSuccess }: PostJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { profile } = useAuth();
  const supabase = createClient();

  // Institution logo
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image."); return; }
    if (file.size > 3 * 1024 * 1024) { setError("Logo must be under 3MB."); return; }
    const reader = new FileReader();
    reader.onload = ev => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setLogoUploading(true);
    try {
      // Must use auth.uid() as first folder to match storage RLS policy
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `logo-${uuidv4()}.${ext}`;
      const storagePath = `${user.id}/institution-logos/${filename}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(storagePath, file, { upsert: true, cacheControl: "3600" });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(storagePath);
      setLogoUrl(urlData.publicUrl);
    } catch (err: any) {
      setError(err?.message || "Failed to upload logo.");
      setLogoPreview(null);
    } finally {
      setLogoUploading(false);
      e.target.value = "";
    }
  };

  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    qualification: "",
    professional_qualification: "",
    experience_min: "",
    experience_max: "",
    employment_type: "Full-time",
    board: "",
    level: "",
    location: "",
    salary_min: "",
    salary_max: "",
    school_name: "",
    institution_type: "",
    application_deadline: "",
    status: "published" as "draft" | "published",
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.subject) {
      setError("Job title and subject are required.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const result = await createJob({
        title: form.title,
        subject: form.subject,
        description: form.description || null,
        qualification: form.qualification || null,
        professional_qualification: form.professional_qualification || null,
        experience_min: form.experience_min ? parseInt(form.experience_min) : null,
        experience_max: form.experience_max ? parseInt(form.experience_max) : null,
        employment_type: form.employment_type,
        board: form.board || null,
        level: form.level || null,
        location: form.location || null,
        salary_min: form.salary_min ? parseFloat(form.salary_min) : null,
        salary_max: form.salary_max ? parseFloat(form.salary_max) : null,
        school_name: form.school_name || null,
        application_deadline: form.application_deadline || null,
        status: form.status,
      });

      if (!result.success) {
        setError(result.error || "Failed to post vacancy.");
        return;
      }

      // If a logo was uploaded, save it to the institution record
      if (logoUrl && profile) {
        const supabaseClient = createClient();
        const { data: inst } = await supabaseClient
          .from("institutions")
          .select("id")
          .eq("created_by_profile_id", profile.id)
          .single();
        if (inst) {
          await supabaseClient.from("institutions").update({ logo_url: logoUrl } as any).eq("id", inst.id);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
        onClose();
        // Reset form
        setForm({
          title: "", subject: "", description: "", qualification: "",
          professional_qualification: "", experience_min: "", experience_max: "",
          employment_type: "Full-time", board: "", level: "", location: "",
          salary_min: "", salary_max: "", school_name: "", institution_type: "",
          application_deadline: "", status: "published",
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
            <h2 className="text-xl font-bold text-gray-900">Post a Teaching Vacancy</h2>
            <p className="text-sm text-gray-500 mt-0.5">Fill in the details to find the best educators.</p>
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

        {/* Success */}
        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 bg-green-100 flex items-center justify-center" style={{ borderRadius: "50%" }}>
              <FaCircleCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Vacancy Posted!</h3>
            <p className="text-sm text-gray-500">Your job listing is now live.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-7 py-5 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm" style={{ borderRadius: "0.75rem" }}>
                {error}
              </div>
            )}

            {/* Institution Logo */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200" style={{ borderRadius: "0.75rem" }}>
              <div className="relative shrink-0">
                <div className="w-14 h-14 flex items-center justify-center bg-gray-100 border-2 border-gray-200 overflow-hidden" style={{ borderRadius: "0.625rem" }}>
                  {logoPreview
                    ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    : <FaCamera className="w-6 h-6 text-gray-300" />}
                </div>
                {logoUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center" style={{ borderRadius: "0.625rem" }}>
                    <FaSpinner className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 mb-0.5">Institution Logo <span className="text-xs font-normal text-gray-400">(optional)</span></p>
                <p className="text-xs text-gray-500 mb-2">JPG, PNG · Max 3MB</p>
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" id="logo-upload-input" />
                <label htmlFor="logo-upload-input" className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold border cursor-pointer transition-all ${logoUploading ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border-gray-300 text-gray-700 hover:border-xyroots-teal hover:text-xyroots-teal"}`} style={{ borderRadius: "0.5rem" }}>
                  <FaCamera className="w-3 h-3" />{logoUploading ? "Uploading..." : logoPreview ? "Change Logo" : "Upload Logo"}
                </label>
              </div>
            </div>

            {/* Basic */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Job Title <span className="text-red-500">*</span></label>
              <input
                value={form.title} onChange={e => set("title", e.target.value)}
                placeholder="e.g. Senior Mathematics Teacher – CBSE"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                style={{ borderRadius: "0.75rem" }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Subject <span className="text-red-500">*</span></label>
                <CustomSelect value={form.subject} onChange={val => set("subject", val)} options={subjectSelectOptions} placeholder="Select subject" searchable />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Employment Type</label>
                <CustomSelect value={form.employment_type} onChange={val => set("employment_type", val)} options={employmentSelectOptions} placeholder="Employment Type" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Curriculum Board</label>
                <CustomSelect value={form.board} onChange={val => set("board", val)} options={boardSelectOptions} placeholder="Any Board" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Teaching Level</label>
                <CustomSelect value={form.level} onChange={val => set("level", val)} options={levelSelectOptions} placeholder="Any Level" />
              </div>
            </div>

            {/* Qualifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Academic Qualification</label>
                <CustomSelect value={form.qualification} onChange={val => set("qualification", val)} options={qualificationSelectOptions} placeholder="e.g. B.Sc / M.Sc" searchable />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Teaching Qualification</label>
                <CustomSelect value={form.professional_qualification} onChange={val => set("professional_qualification", val)} options={professionalQualificationSelectOptions} placeholder="e.g. B.Ed" searchable />
              </div>
            </div>

            {/* Experience & Salary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Min Exp</label>
                <CustomSelect value={form.experience_min} onChange={val => set("experience_min", val)} options={expMinOptions} placeholder="Min" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Max Exp</label>
                <CustomSelect value={form.experience_max} onChange={val => set("experience_max", val)} options={expMaxOptions} placeholder="Max" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Salary Min (₹)</label>
                <input
                  type="number" min="0" value={form.salary_min} onChange={e => set("salary_min", e.target.value)}
                  placeholder="25000"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Salary Max (₹)</label>
                <input
                  type="number" min="0" value={form.salary_max} onChange={e => set("salary_max", e.target.value)}
                  placeholder="50000"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">School / Institution Name</label>
                <input
                  value={form.school_name} onChange={e => set("school_name", e.target.value)}
                  placeholder="e.g. Greenfield International School"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Institution Type</label>
                <CustomSelect value={form.institution_type} onChange={val => set("institution_type", val)} options={institutionTypeOptions} placeholder="Select type" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Location</label>
                <input
                  value={form.location} onChange={e => set("location", e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Job Description (Optional)</label>
              <textarea
                value={form.description} onChange={e => set("description", e.target.value)}
                rows={3}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all resize-none"
                style={{ borderRadius: "0.75rem" }}
              />
            </div>

            {/* Deadline & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Application Deadline</label>
                <input
                  type="date" value={form.application_deadline} onChange={e => set("application_deadline", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Post As</label>
                <CustomSelect value={form.status} onChange={val => set("status", val as "draft" | "published")} options={statusSelectOptions} placeholder="Post As" />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-2 pb-2">
              <button
                type="button" onClick={onClose}
                className="flex-1 px-6 py-3 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                style={{ borderRadius: "0.75rem" }}
              >
                Cancel
              </button>
              <button
                type="submit" disabled={loading}
                className="flex-[2] px-6 py-3 text-sm font-semibold bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ borderRadius: "0.75rem" }}
              >
                {loading ? (
                  <><FaSpinner className="w-4 h-4 animate-spin" /> Posting...</>
                ) : (
                  <><FaCircleCheck className="w-4 h-4" /> Post Vacancy</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
