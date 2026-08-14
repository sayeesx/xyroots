"use client";

import { useState } from "react";
import { FaXmark, FaSpinner, FaCircleCheck } from "react-icons/fa6";
import { createJob } from "@/lib/actions/jobs";

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const subjectOptions = [
  "Mathematics","Physics","Chemistry","Biology","English","Hindi","Social Science",
  "Computer Science","Commerce","Economics","History","Geography","Sanskrit",
  "Physical Education","Art & Craft","Music","EVS","General Science",
];

const boardOptions = ["CBSE","ICSE","State Board","IB / IGCSE","NIOS","Other"];
const levelOptions = ["Nursery / KG","Primary (1–5)","Middle (6–8)","Secondary (9–10)","Senior Secondary (11–12)","All Levels"];
const employmentTypes = ["Full-time","Part-time","Contract","Temporary","Substitute"];

export default function PostJobModal({ isOpen, onClose, onSuccess }: PostJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
                <select
                  value={form.subject} onChange={e => set("subject", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <option value="">Select subject</option>
                  {subjectOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Employment Type</label>
                <select
                  value={form.employment_type} onChange={e => set("employment_type", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                >
                  {employmentTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Curriculum Board</label>
                <select
                  value={form.board} onChange={e => set("board", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <option value="">Any Board</option>
                  {boardOptions.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Teaching Level</label>
                <select
                  value={form.level} onChange={e => set("level", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <option value="">Any Level</option>
                  {levelOptions.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Qualifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Academic Qualification</label>
                <input
                  value={form.qualification} onChange={e => set("qualification", e.target.value)}
                  placeholder="e.g. B.Sc / M.Sc"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Teaching Qualification</label>
                <input
                  value={form.professional_qualification} onChange={e => set("professional_qualification", e.target.value)}
                  placeholder="e.g. B.Ed"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                />
              </div>
            </div>

            {/* Experience & Salary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Min Exp (yrs)</label>
                <input
                  type="number" min="0" value={form.experience_min} onChange={e => set("experience_min", e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Max Exp (yrs)</label>
                <input
                  type="number" min="0" value={form.experience_max} onChange={e => set("experience_max", e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                />
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
                <select
                  value={form.institution_type} onChange={e => set("institution_type", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <option value="">Select type</option>
                  {["School", "International School", "College", "University", "Coaching Centre", "Preschool / Nursery", "Special Needs School", "Vocational Institute", "Other"].map(t => <option key={t}>{t}</option>)}
                </select>
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
                <select
                  value={form.status} onChange={e => set("status", e.target.value as "draft" | "published")}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <option value="published">Published (Live Now)</option>
                  <option value="draft">Draft (Save for Later)</option>
                </select>
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
