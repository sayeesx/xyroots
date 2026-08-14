"use client";

import { useState, useEffect } from "react";
import { FaXmark, FaSpinner, FaCircleCheck } from "react-icons/fa6";
import { updateJob, updateJobStatus } from "@/lib/actions/jobs";

interface EditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  onSuccess?: () => void;
}

export default function EditJobModal({ isOpen, onClose, job, onSuccess }: EditJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    location: "",
    salary_min: "",
    salary_max: "",
    experience_min: "",
    experience_max: "",
    description: "",
    qualification: "",
    professional_qualification: "",
    employment_type: "Full-time",
    status: "published",
  });

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "",
        subject: job.subject || "",
        location: job.location || "",
        salary_min: job.salary_min != null ? String(job.salary_min) : "",
        salary_max: job.salary_max != null ? String(job.salary_max) : "",
        experience_min: job.experience_min != null ? String(job.experience_min) : "",
        experience_max: job.experience_max != null ? String(job.experience_max) : "",
        description: job.description || "",
        qualification: job.qualification || "",
        professional_qualification: job.professional_qualification || "",
        employment_type: job.employment_type || "Full-time",
        status: job.status || "published",
      });
      setError(null);
    }
  }, [job, isOpen]);

  if (!isOpen || !job) return null;

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Job title is required."); return; }
    setLoading(true);
    setError(null);

    const [updateResult] = await Promise.all([
      updateJob(job.id, {
        title: form.title,
        subject: form.subject || undefined,
        location: form.location || null,
        salary_min: form.salary_min ? parseFloat(form.salary_min) : null,
        salary_max: form.salary_max ? parseFloat(form.salary_max) : null,
        experience_min: form.experience_min ? parseInt(form.experience_min) : null,
        experience_max: form.experience_max ? parseInt(form.experience_max) : null,
        description: form.description || null,
        qualification: form.qualification || null,
        professional_qualification: form.professional_qualification || null,
        employment_type: form.employment_type,
      }),
    ]);

    // Update status separately if changed
    if (form.status !== job.status && (form.status === 'published' || form.status === 'closed' || form.status === 'archived')) {
      await updateJobStatus(job.id, form.status as 'published' | 'closed' | 'archived');
    }

    setLoading(false);
    if (updateResult.success) {
      onSuccess?.();
      onClose();
    } else {
      setError(updateResult.error || "Failed to update vacancy.");
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
      <div
        className="bg-white w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        style={{ borderRadius: "1.5rem" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Vacancy</h2>
            <p className="text-xs text-gray-500 mt-0.5">Update details for this job posting</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            style={{ borderRadius: "50%" }}
            aria-label="Close"
          >
            <FaXmark className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 modal-scrollbar">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm" style={{ borderRadius: "0.75rem" }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              value={form.title} onChange={e => set("title", e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
              style={{ borderRadius: "0.75rem" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Subject</label>
              <input
                value={form.subject} onChange={e => set("subject", e.target.value)}
                placeholder="e.g. Mathematics"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                style={{ borderRadius: "0.75rem" }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Location</label>
              <input
                value={form.location} onChange={e => set("location", e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                style={{ borderRadius: "0.75rem" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Min Salary (₹)</label>
              <input
                type="number" value={form.salary_min} onChange={e => set("salary_min", e.target.value)}
                placeholder="25000"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                style={{ borderRadius: "0.75rem" }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Max Salary (₹)</label>
              <input
                type="number" value={form.salary_max} onChange={e => set("salary_max", e.target.value)}
                placeholder="50000"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                style={{ borderRadius: "0.75rem" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Min Exp (yrs)</label>
              <input
                type="number" value={form.experience_min} onChange={e => set("experience_min", e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                style={{ borderRadius: "0.75rem" }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Max Exp (yrs)</label>
              <input
                type="number" value={form.experience_max} onChange={e => set("experience_max", e.target.value)}
                placeholder="10"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                style={{ borderRadius: "0.75rem" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Academic Qual.</label>
              <input
                value={form.qualification} onChange={e => set("qualification", e.target.value)}
                placeholder="e.g. M.Sc"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                style={{ borderRadius: "0.75rem" }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Teaching Qual.</label>
              <input
                value={form.professional_qualification} onChange={e => set("professional_qualification", e.target.value)}
                placeholder="e.g. B.Ed"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                style={{ borderRadius: "0.75rem" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Description</label>
            <textarea
              value={form.description} onChange={e => set("description", e.target.value)}
              rows={3}
              placeholder="Describe the role and responsibilities..."
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all resize-none"
              style={{ borderRadius: "0.75rem" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Employment Type</label>
              <select
                value={form.employment_type} onChange={e => set("employment_type", e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                style={{ borderRadius: "0.75rem" }}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Temporary</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Status</label>
              <select
                value={form.status} onChange={e => set("status", e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal focus:bg-white transition-all"
                style={{ borderRadius: "0.75rem" }}
              >
                <option value="published">Published (Live)</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            style={{ borderRadius: "0.75rem" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-[2] py-2.5 text-sm font-semibold bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            style={{ borderRadius: "0.75rem" }}
          >
            {loading ? (
              <><FaSpinner className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><FaCircleCheck className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
