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
import { addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist";
import Loader from "@/components/Loader";

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
    supabase.from('jobs').select('*, institutions(id, name, location, logo_url, verified)').eq('id', actualId).single()
      .then(({ data }: any) => {
        if (data) {
          const instName = data.institutions?.name || data.school_name || data.institution_name;
          const instLoc = data.location || data.institutions?.location || "India";
          const instLogo = data.logo_url || data.institutions?.logo_url || null;
          setDbJob({
            ...data,
            school: instName || "Educational Institution",
            schoolVerified: data.institutions?.verified || false,
            location: instLoc,
            logoUrl: instLogo,
            salaryMin: data.salary_min,
            salaryMax: data.salary_max,
            experienceMin: data.experience_min,
            experienceMax: data.experience_max,
            employmentType: data.employment_type || "Full-time",
            responsibilities: data.responsibilities || [],
            requirements: data.requirements || [],
            benefits: data.benefits || [],
            postedDate: new Date(data.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            postedAgo: (() => {
              const diff = Date.now() - new Date(data.created_at).getTime();
              const mins = Math.floor(diff / 60000);
              if (mins < 60) return `${mins}m ago`;
              const hrs = Math.floor(mins / 60);
              if (hrs < 24) return `${hrs}h ago`;
              const days = Math.floor(hrs / 24);
              if (days < 7) return `${days}d ago`;
              const weeks = Math.floor(days / 7);
              if (weeks < 5) return `${weeks}w ago`;
              const months = Math.floor(days / 30);
              return `${months}mo ago`;
            })(),
            institutionId: data.institutions?.id || data.institution_id || null,
          });
        } else { setNotFound(true); }
        setPageLoading(false);
      });
  }, [actualId]); // eslint-disable-line

  // Save state — DB-backed with optimistic update
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!actualId || !user) return;
    const checkSaved = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      const { data: profileRow } = await (supabase as any)
        .from("profiles").select("id").eq("auth_user_id", authUser.id).single();
      if (!profileRow) return;
      const { data } = await (supabase as any)
        .from("watchlist")
        .select("item_id")
        .eq("profile_id", profileRow.id)
        .eq("item_type", "job")
        .eq("item_id", actualId)
        .single();
      setSaved(!!data);
    };
    checkSaved();
  }, [actualId, user]); // eslint-disable-line

  const toggleSave = async () => {
    if (!actualId) return;
    const newSaved = !saved;
    setSaved(newSaved); // optimistic
    if (newSaved) {
      await addToWatchlist("job", actualId);
    } else {
      await removeFromWatchlist("job", actualId);
    }
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

  const institutionId = dbJob?.institutionId || null;
  const [showShareModal, setShowShareModal] = useState(false);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader />
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
            <button onClick={() => router.push('/jobs')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00a264] text-white text-sm font-semibold rounded-xl">
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
    <div className="min-h-screen flex flex-col bg-[#f8faf9]">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* ─── Glassdoor / Indeed Clean Header Card ───────────────────── */}
        <section className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg mb-4 transition-all"
            >
              <FaArrowLeft className="w-3 h-3" /> Back to Vacancies
            </button>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center font-bold text-2xl text-gray-700 bg-white border border-gray-200 rounded-xl overflow-hidden">
                  {job.logoUrl ? (
                    <img src={job.logoUrl} alt={job.school} className="w-full h-full object-cover" />
                  ) : (
                    (job.school || 'S').charAt(0).toUpperCase()
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {job.board && (
                      <span className="px-2.5 py-0.5 text-xs font-bold bg-[#e6f7ed] text-[#00a264] rounded-md border border-[#00a264]/20 uppercase tracking-wider">
                        {job.board}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-md">
                      {job.employmentType}
                    </span>
                    {job.level && (
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-md">
                        {job.level}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                    {job.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3.5 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5 font-bold text-gray-900">
                      <FaBuilding className="w-4 h-4 text-[#00a264] shrink-0" />
                      {institutionId ? (
                        <a href={`/institutions/${institutionId}`} className="hover:text-[#00a264] transition-colors">
                          {job.school}
                        </a>
                      ) : (
                        job.school
                      )}
                      {job.schoolVerified && <FaShieldHalved className="w-4 h-4 text-[#00a264]" />}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1.5">
                      <FaLocationDot className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {job.location}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FaCalendarDays className="w-3.5 h-3.5 text-gray-400 shrink-0" /> Posted {job.postedAgo || job.postedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop CTA in header */}
              <div className="hidden sm:flex items-center gap-3 shrink-0 pt-1">
                <button
                  onClick={toggleSave}
                  className={`px-4 py-3 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 ${
                    saved
                      ? "bg-[#e6f7ed] border-[#00a264]/40 text-[#00a264]"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {saved ? <FaBookmark className="w-3.5 h-3.5" /> : <FaRegBookmark className="w-3.5 h-3.5" />}
                  {saved ? "Saved" : "Save Job"}
                </button>
                <button
                  onClick={handleApply}
                  disabled={applyLoading || applied}
                  className={`px-6 py-3 text-xs font-extrabold rounded-xl transition-all  flex items-center gap-2 ${
                    applied
                      ? "bg-[#e6f7ed] text-[#00a264] cursor-default"
                      : "bg-[#00a264] text-white hover:bg-[#008f58]"
                  }`}
                >
                  {applyLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> :
                   applied ? <><FaCircleCheck className="w-4 h-4" /> Applied!</> :
                   <>Apply Now <FaArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </div>
            </div>
          </div>
        </section>

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
                  { label: "Monthly Salary", value: job.salaryMin && job.salaryMax ? `₹${(job.salaryMin/1000).toFixed(0)}k–${(job.salaryMax/1000).toFixed(0)}k` : formatSalary(job.salaryMin, job.salaryMax) || "Negotiable", icon: FaIndianRupeeSign, accent: true },                  { label: "Experience", value: `${job.experienceMin ?? 0}–${job.experienceMax ?? 5} Yrs`, icon: FaBriefcase },
                  { label: "Qualification", value: job.qualification || "B.Ed", icon: FaGraduationCap },
                  { label: "Subject", value: job.subject || "General", icon: FaWandMagicSparkles },
                ].map(stat => (
                  <div key={stat.label} className={`p-4 ${stat.accent ? "bg-[#e6f7ed] border border-[#00a264]/20" : "bg-white border border-gray-100"}`} style={{ borderRadius: "0.875rem" }}>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">{stat.label}</p>
                    <p className={`text-sm font-bold leading-tight ${stat.accent ? "text-[#00a264]" : "text-gray-900"}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {job.description && (
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-[#e6f7ed]" style={{ borderRadius: "0.375rem" }}>
                      <FaBuilding className="w-3 h-3 text-[#00a264]" />
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
                        <FaCircleCheck className="w-4 h-4 text-[#00a264] shrink-0 mt-0.5" /> {r}
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
                        <FaCircleCheck className="w-4 h-4 text-[#00a264] shrink-0 mt-0.5" /> {r}
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
                      <div key={i} className="flex items-center gap-2.5 p-3 bg-gray-50 text-sm text-gray-700 font-medium border border-gray-100" style={{ borderRadius: "0.75rem" }}>
                        <FaCircleCheck className="w-3.5 h-3.5 shrink-0 text-gray-500" /> {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Action Card */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6">
                <div className="text-center py-4 mb-5 bg-[#f0fdf4] border border-[#00a264]/20 rounded-xl">
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">Offered Salary</p>
                  <p className="text-2xl font-extrabold text-[#00a264] flex items-center justify-center gap-0.5">
                    <FaIndianRupeeSign className="w-4 h-4" />
                    {job.salaryMin && job.salaryMax ? `${(job.salaryMin/1000).toFixed(0)}k–${(job.salaryMax/1000).toFixed(0)}k/mo` : formatSalary(job.salaryMin, job.salaryMax) || "Negotiable"}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleApply}
                    disabled={applyLoading || applied}
                    className={`w-full py-3.5 px-6 font-extrabold text-sm rounded-xl transition-all  flex items-center justify-center gap-2 ${
                      applied
                        ? "bg-[#e6f7ed] text-[#00a264]  cursor-default"
                        : "bg-gradient-to-r from-[#00a264] to-[#00c278] hover:from-[#007a4d] hover:to-[#00a264] text-white  active:scale-[0.98]"
                    }`}
                  >
                    {applyLoading ? <><FaSpinner className="w-4 h-4 animate-spin" /> Submitting...</> :
                     applied ? <><FaCircleCheck className="w-4 h-4" /> Application Submitted!</> :
                     <>Apply Now <FaArrowRight className="w-4 h-4" /></>}
                  </button>

                  <button
                    onClick={toggleSave}
                    className={`w-full py-3 px-6 font-bold text-sm border rounded-xl transition-all flex items-center justify-center gap-2 ${
                      saved
                        ? "bg-[#e6f7ed] border-[#00a264]/40 text-[#00a264]"
                        : "border-gray-200 text-gray-700 hover:border-[#00a264] hover:text-[#00a264]"
                    }`}
                  >
                    {saved ? <FaBookmark className="w-4 h-4" /> : <FaRegBookmark className="w-4 h-4" />}
                    {saved ? "Saved to Watchlist" : "Save Job"}
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="w-full py-2.5 px-6 font-semibold text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FaShareNodes className="w-3.5 h-3.5" /> Share Position
                  </button>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 text-xs text-gray-500 space-y-2">
                  <div className="flex justify-between"><span>Posted</span><span className="font-semibold text-gray-800">{job.postedAgo || job.postedDate}</span></div>
                  <div className="flex justify-between"><span>Employment</span><span className="font-semibold text-gray-800">{job.employmentType}</span></div>
                  {job.application_deadline && (
                    <div className="flex justify-between"><span>Deadline</span><span className="font-semibold text-gray-800">{new Date(job.application_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                  )}
                </div>
              </div>

              {/* Institution Card */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">About Institution</h3>
                {institutionId ? (
                  <a href={`/institutions/${institutionId}`} className="flex items-center gap-3.5 group cursor-pointer">
                    <div className="w-12 h-12 bg-[#074526] text-white flex items-center justify-center font-bold text-lg rounded-xl overflow-hidden shrink-0">
                      {job.logoUrl ? (
                        <img src={job.logoUrl} alt={job.school} className="w-full h-full object-cover" />
                      ) : (
                        (job.school || 'S').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#00a264] transition-colors flex items-center gap-1 truncate">
                        {job.school} {job.schoolVerified && <FaShieldHalved className="w-3.5 h-3.5 text-[#00a264] shrink-0" />}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{job.location}</p>
                      <p className="text-xs text-[#00a264] font-bold mt-1 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Institution Profile →
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 bg-[#074526] text-white flex items-center justify-center font-bold text-lg rounded-xl overflow-hidden shrink-0">
                      {job.logoUrl ? (
                        <img src={job.logoUrl} alt={job.school} className="w-full h-full object-cover" />
                      ) : (
                        (job.school || 'S').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-1 truncate">
                        {job.school} {job.schoolVerified && <FaShieldHalved className="w-3.5 h-3.5 text-[#00a264] shrink-0" />}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{job.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky bar — bigger */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white/98 backdrop-blur-sm border-t border-gray-100 lg:hidden z-40 flex items-center justify-between gap-3">
        <div>
          {job.salaryMin && <p className="text-base font-bold text-gray-900">₹{(job.salaryMin/1000).toFixed(0)}k{job.salaryMax && `–${(job.salaryMax/1000).toFixed(0)}k`}<span className="text-xs font-normal text-gray-400">/mo</span></p>}
          <p className="text-xs text-gray-500 font-medium">{job.location}</p>
        </div>
        <button
          onClick={handleApply}
          disabled={applyLoading || applied}
          className={`flex-1 max-w-[220px] py-3.5 px-5 font-bold text-base transition-all flex items-center justify-center gap-2 ${
            applied ? "bg-[#e6f7ed] text-[#00a264]" : "bg-[#00a264] text-white hover:bg-[#008f58]"
          }`}
          style={{ borderRadius: "0.875rem" }}
        >
          {applyLoading ? <FaSpinner className="w-4 h-4 animate-spin" /> : applied ? "Applied ✓" : <>Apply Now <FaArrowRight className="w-4 h-4" /></>}
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
              className="w-full py-3 bg-[#00a264] text-white font-bold text-sm hover:bg-[#008f58] transition-colors"
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
