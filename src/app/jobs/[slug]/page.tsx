"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaShieldHalved, FaLocationDot, FaClock, FaBookmark, FaRegBookmark,
  FaShareNodes, FaCircleCheck, FaBuilding, FaWandMagicSparkles,
  FaArrowLeft, FaIndianRupeeSign, FaGraduationCap, FaBriefcase, FaCalendarDays,
  FaSpinner, FaArrowRight
} from "react-icons/fa6";
import { createClient } from "@/lib/supabase/client";
import { formatSalary } from "@/lib/utils";
import { useAuth } from "@/lib/auth/AuthProvider";
import { applyToJob } from "@/lib/actions/jobs";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { user, profile, role } = useAuth();

  const [dbJob, setDbJob] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const supabase = createClient();

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const actualId = UUID_REGEX.test(slug) ? slug : slug?.split('-').pop();

  useEffect(() => {
    if (!actualId) { setNotFound(true); setPageLoading(false); return; }
    supabase.from('jobs').select('*, institutions(verified)').eq('id', actualId).single()
      .then(({ data }: any) => {
        if (data) {
          setDbJob({
            ...data,
            school: data.school_name || data.institution_name || "Institution",
            schoolVerified: data.institutions?.verified || false,
            location: data.location || "India",
            salaryMin: data.salary_min,
            salaryMax: data.salary_max,
            experienceMin: data.experience_min,
            experienceMax: data.experience_max,
            employmentType: data.employment_type || "Full-time",
            responsibilities: data.responsibilities || [],
            requirements: data.requirements || [],
            benefits: data.benefits || [],
            postedDate: new Date(data.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          });
        } else { setNotFound(true); }
        setPageLoading(false);
      })
      .catch(() => { setNotFound(true); setPageLoading(false); });
  }, [actualId]); // eslint-disable-line

  // Save state — persisted in localStorage
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!actualId) return;
    const ids: string[] = JSON.parse(localStorage.getItem('xyroots_watchlist') || '[]');
    setSaved(ids.includes(actualId));
  }, [actualId]);

  const toggleSave = () => {
    if (!actualId) return;
    const ids: string[] = JSON.parse(localStorage.getItem('xyroots_watchlist') || '[]');
    const next = saved ? ids.filter(i => i !== actualId) : [...ids, actualId];
    localStorage.setItem('xyroots_watchlist', JSON.stringify(next));
    setSaved(!saved);
  };

  // Apply state
  const [applyLoading, setApplyLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [showApplySuccess, setShowApplySuccess] = useState(false);

  const handleApply = async () => {
    if (!user) { router.push('/'); return; }
    if (role !== 'teacher') { setApplyError("Only teacher accounts can apply to jobs."); return; }
    setApplyLoading(true);
    setApplyError(null);
    const result = await applyToJob(actualId!);
    setApplyLoading(false);
    if (result.success) {
      setApplied(true);
      setShowApplySuccess(true);
    } else {
      setApplyError(result.error || "Failed to apply.");
    }
  };

  const [showShareModal, setShowShareModal] = useState(false);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-xyroots-teal border-t-transparent animate-spin mx-auto mb-4" style={{ borderRadius: "50%" }} />
            <p className="text-sm text-gray-500">Loading vacancy...</p>
          </div>
        </main>
      </div>
    );
  }

  if (notFound || !dbJob) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Job Not Found</h2>
            <p className="text-gray-500 text-sm mb-6">This vacancy may have been removed or the link is invalid.</p>
            <button onClick={() => router.push('/jobs')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-xyroots-teal text-white text-sm font-semibold" style={{ borderRadius: "0.75rem" }}>
              <FaArrowLeft className="w-3.5 h-3.5" /> Browse All Jobs
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const job = dbJob;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />

      <main className="flex-1 pb-28">
        {/* Hero: institution brand colour strip */}
        <div className="bg-xyroots-dark/95 text-white py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white mb-6 transition-colors group">
              <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> Back
            </button>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="flex-1 min-w-0">
                {/* Chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.board && (
                    <span className="px-2.5 py-1 text-[11px] font-bold bg-xyroots-teal/20 text-xyroots-teal border border-xyroots-teal/30 uppercase tracking-wider" style={{ borderRadius: "999px" }}>
                      {job.board}
                    </span>
                  )}
                  <span className="px-2.5 py-1 text-[11px] font-medium bg-white/10 text-white/80" style={{ borderRadius: "999px" }}>{job.employmentType}</span>
                  {job.level && <span className="px-2.5 py-1 text-[11px] font-medium bg-white/10 text-white/80" style={{ borderRadius: "999px" }}>{job.level}</span>}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-1.5">
                    <FaBuilding className="w-3.5 h-3.5 text-xyroots-teal shrink-0" />
                    <span className="font-semibold text-white">{job.school}</span>
                    {job.schoolVerified && <FaShieldHalved className="w-3.5 h-3.5 text-xyroots-teal" />}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaLocationDot className="w-3.5 h-3.5 shrink-0" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaCalendarDays className="w-3.5 h-3.5 shrink-0" /> Posted {job.postedDate}
                  </span>
                </div>
              </div>

              {/* Desktop quick apply */}
              <div className="hidden sm:flex items-center gap-3 shrink-0">
                <button
                  onClick={toggleSave}
                  className={`px-4 py-2.5 text-sm font-semibold border transition-all flex items-center gap-2 ${
                    saved ? "bg-white/10 border-white/20 text-white" : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                  }`}
                  style={{ borderRadius: "0.75rem" }}
                >
                  {saved ? <FaBookmark className="w-3.5 h-3.5" /> : <FaRegBookmark className="w-3.5 h-3.5" />}
                  {saved ? "Saved" : "Save"}
                </button>
                <button
                  onClick={handleApply}
                  disabled={applyLoading || applied}
                  className={`px-6 py-2.5 text-sm font-bold flex items-center gap-2 transition-all ${
                    applied ? "bg-green-500 text-white cursor-default" :
                    "bg-xyroots-teal text-white hover:bg-[#00875a] active:scale-95"
                  }`}
                  style={{ borderRadius: "0.75rem" }}
                >
                  {applyLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> :
                   applied ? <><FaCircleCheck className="w-4 h-4" /> Applied!</> :
                   <>Apply Now <FaArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Error banner */}
          {applyError && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3" style={{ borderRadius: "0.75rem" }}>
              <span>{applyError}</span>
              <button onClick={() => setApplyError(null)} className="ml-auto text-red-400 hover:text-red-700"><FaArrowLeft className="w-3 h-3 rotate-[135deg]" /></button>
            </div>
          )}

          {/* Success banner */}
          {showApplySuccess && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-3" style={{ borderRadius: "0.75rem" }}>
              <FaCircleCheck className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="font-bold">Application submitted successfully!</p>
                <p className="text-xs text-green-700 mt-0.5">You can track this in your dashboard → Applications.</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: main content */}
            <div className="lg:col-span-2 space-y-5">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Monthly Salary", value: job.salaryMin && job.salaryMax ? `₹${(job.salaryMin/1000).toFixed(0)}k–${(job.salaryMax/1000).toFixed(0)}k` : formatSalary(job.salaryMin, job.salaryMax) || "Negotiable", icon: FaIndianRupeeSign, accent: true },
                  { label: "Experience", value: `${job.experienceMin ?? 0}–${job.experienceMax ?? 5} Yrs`, icon: FaBriefcase },
                  { label: "Qualification", value: job.qualification || "B.Ed", icon: FaGraduationCap },
                  { label: "Subject", value: job.subject || "General", icon: FaWandMagicSparkles },
                ].map(stat => (
                  <div key={stat.label} className={`p-4 ${stat.accent ? "bg-xyroots-mint border border-xyroots-teal/20" : "bg-white border border-gray-100"}`} style={{ borderRadius: "0.875rem" }}>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">{stat.label}</p>
                    <p className={`text-sm font-bold leading-tight ${stat.accent ? "text-xyroots-teal" : "text-gray-900"}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {job.description && (
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-xyroots-mint" style={{ borderRadius: "0.375rem" }}>
                      <FaBuilding className="w-3 h-3 text-xyroots-teal" />
                    </span>
                    About the Role
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities?.length > 0 && (
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-blue-50" style={{ borderRadius: "0.375rem" }}>
                      <FaBriefcase className="w-3 h-3 text-blue-600" />
                    </span>
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <FaCircleCheck className="w-4 h-4 text-xyroots-teal shrink-0 mt-0.5" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements?.length > 0 && (
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-purple-50" style={{ borderRadius: "0.375rem" }}>
                      <FaGraduationCap className="w-3 h-3 text-purple-600" />
                    </span>
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <FaCircleCheck className="w-4 h-4 text-xyroots-teal shrink-0 mt-0.5" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits?.length > 0 && (
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-amber-50" style={{ borderRadius: "0.375rem" }}>
                      <FaWandMagicSparkles className="w-3 h-3 text-amber-500" />
                    </span>
                    Perks & Benefits
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {job.benefits.map((b: string, i: number) => (
                      <div key={i} className="flex items-center gap-2.5 p-3 bg-xyroots-mint/40 text-sm text-xyroots-teal font-medium border border-xyroots-teal/10" style={{ borderRadius: "0.75rem" }}>
                        <FaCircleCheck className="w-3.5 h-3.5 shrink-0" /> {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              {/* Apply card — sticky */}
              <div className="bg-white border border-gray-100 p-6 lg:sticky lg:top-24" style={{ borderRadius: "1rem" }}>
                <div className="mb-5">
                  {job.salaryMin && (
                    <div className="text-center py-4 mb-4 bg-xyroots-mint/30 border border-xyroots-teal/15" style={{ borderRadius: "0.75rem" }}>
                      <p className="text-xs text-gray-500 font-medium mb-1">Monthly Salary</p>
                      <p className="text-2xl font-bold text-xyroots-teal flex items-center justify-center gap-0.5">
                        <FaIndianRupeeSign className="w-4 h-4" />
                        {`${(job.salaryMin/1000).toFixed(0)}k`}
                        {job.salaryMax && `–${(job.salaryMax/1000).toFixed(0)}k`}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={handleApply}
                    disabled={applyLoading || applied}
                    className={`w-full py-3.5 px-6 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      applied ? "bg-green-100 text-green-700 cursor-default" :
                      "bg-xyroots-teal text-white hover:bg-[#068050] active:scale-[0.98]"
                    }`}
                    style={{ borderRadius: "0.75rem" }}
                  >
                    {applyLoading ? <><FaSpinner className="w-4 h-4 animate-spin" /> Submitting...</> :
                     applied ? <><FaCircleCheck className="w-4 h-4" /> Application Submitted!</> :
                     <>Apply Now <FaArrowRight className="w-3.5 h-3.5" /></>}
                  </button>

                  <button
                    onClick={toggleSave}
                    className={`w-full py-3 px-6 font-semibold text-sm border transition-all flex items-center justify-center gap-2 ${
                      saved ? "bg-amber-50 border-amber-200 text-amber-700" : "border-gray-200 text-gray-700 hover:border-xyroots-teal hover:text-xyroots-teal"
                    }`}
                    style={{ borderRadius: "0.75rem" }}
                  >
                    {saved ? <FaBookmark className="w-4 h-4" /> : <FaRegBookmark className="w-4 h-4" />}
                    {saved ? "Saved to Watchlist" : "Save to Watchlist"}
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="w-full py-3 px-6 font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    <FaShareNodes className="w-3.5 h-3.5" /> Share
                  </button>
                </div>

                {applyError && (
                  <p className="mt-3 text-xs text-red-600 text-center">{applyError}</p>
                )}

                <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1.5">
                  <div className="flex justify-between"><span>Posted</span><span className="font-medium text-gray-800">{job.postedDate}</span></div>
                  {job.application_deadline && <div className="flex justify-between"><span>Deadline</span><span className="font-medium text-gray-800">{new Date(job.application_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>}
                </div>
              </div>

              {/* School card */}
              <div className="bg-white border border-gray-100 p-5" style={{ borderRadius: "1rem" }}>
                <h3 className="text-sm font-bold text-gray-900 mb-3">About the Institution</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-xyroots-mint flex items-center justify-center font-bold text-xyroots-teal text-base border border-xyroots-teal/10" style={{ borderRadius: "0.75rem" }}>
                    {(job.school || 'S').charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                      {job.school} {job.schoolVerified && <FaShieldHalved className="w-3.5 h-3.5 text-xyroots-teal" />}
                    </p>
                    <p className="text-xs text-gray-500">{job.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-sm border-t border-gray-100 lg:hidden z-40 flex items-center justify-between gap-3">
        <div>
          {job.salaryMin && <p className="text-xs font-bold text-xyroots-teal">₹{(job.salaryMin/1000).toFixed(0)}k{job.salaryMax && `–${(job.salaryMax/1000).toFixed(0)}k`}/mo</p>}
          <p className="text-[10px] text-gray-400">{job.location}</p>
        </div>
        <button
          onClick={handleApply}
          disabled={applyLoading || applied}
          className={`flex-1 max-w-[200px] py-3 px-4 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            applied ? "bg-green-100 text-green-700" : "bg-xyroots-teal text-white"
          }`}
          style={{ borderRadius: "0.75rem" }}
        >
          {applyLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : applied ? "Applied ✓" : <>Apply <FaArrowRight className="w-3 h-3" /></>}
        </button>
      </div>

      {/* Share modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-hidden" onClick={() => setShowShareModal(false)}>
          <div className="bg-white p-6 max-w-sm w-full" style={{ borderRadius: "1rem" }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share this Vacancy</h3>
            <div className="bg-gray-50 p-3 text-sm text-gray-600 font-mono break-all mb-4" style={{ borderRadius: "0.75rem" }}>
              {typeof window !== 'undefined' ? window.location.href : ''}
            </div>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); setShowShareModal(false); }}
              className="w-full py-3 bg-xyroots-teal text-white font-bold text-sm hover:bg-[#068050] transition-colors"
              style={{ borderRadius: "0.75rem" }}
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
