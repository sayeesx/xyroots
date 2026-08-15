"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostJobModal from "@/components/PostJobModal";
import EditJobModal from "@/components/EditJobModal";
import {
  FaUsers, FaRegFileLines, FaCirclePlus, FaShieldHalved,
  FaLocationDot, FaSpinner, FaBriefcase,
  FaBuilding, FaChartBar, FaGear, FaArrowRight, FaPencil,
  FaBookmark, FaRegBookmark, FaXmark
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Loader from "@/components/Loader";
import GetVerifiedModal from "@/components/GetVerifiedModal";

type Tab = "candidates" | "vacancies" | "pipeline" | "watchlist" | "settings";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-blue-50 text-blue-700",
  reviewed: "bg-purple-50 text-purple-700",
  shortlisted: "bg-amber-50 text-amber-700",
  interview: "bg-gray-100 text-gray-700",
  offered: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  withdrawn: "bg-gray-100 text-gray-500",
};

export default function EmployerDashboard() {
  const { profile, loading, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("candidates");
  const [showPostJob, setShowPostJob] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showGetVerified, setShowGetVerified] = useState(false);
  const supabase = createClient();

  // Watchlist state
  const [watchlistTeacherIds, setWatchlistTeacherIds] = useState<string[]>([]);
  const [watchlistJobIds, setWatchlistJobIds] = useState<string[]>([]);
  const [watchlistTeachers, setWatchlistTeachers] = useState<any[]>([]);
  const [watchlistJobs, setWatchlistJobs] = useState<any[]>([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [institutionVisible, setInstitutionVisible] = useState(true);
  const [savingVisibility, setSavingVisibility] = useState(false);
  const [visibilitySaved, setVisibilitySaved] = useState(false);

  // Fetch institution visibility on mount
  useEffect(() => {
    if (!profile) return;
    supabase
      .from("institutions")
      .select("id, is_visible")
      .eq("created_by_profile_id", profile.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setInstitutionId(data.id);
          setInstitutionVisible((data as any).is_visible ?? true);
        }
      });
  }, [profile]); // eslint-disable-line

  const saveVisibility = async () => {
    if (!institutionId) return;
    setSavingVisibility(true);
    await supabase.from("institutions").update({ is_visible: institutionVisible } as any).eq("id", institutionId);
    setSavingVisibility(false);
    setVisibilitySaved(true);
    setTimeout(() => setVisibilitySaved(false), 2500);
  };

  // Load watchlist from localStorage
  useEffect(() => {
    try {
      const tIds = JSON.parse(localStorage.getItem("agency_watchlist_teachers") || "[]");
      const jIds = JSON.parse(localStorage.getItem("xyroots_watchlist") || "[]");
      setWatchlistTeacherIds(tIds);
      setWatchlistJobIds(jIds);
    } catch { /* ignore */ }
  }, []);

  // Fetch watchlist data when tab opens
  useEffect(() => {
    if (tab !== "watchlist") return;
    const load = async () => {
      setWatchlistLoading(true);
      const [tRes, jRes] = await Promise.all([
        watchlistTeacherIds.length > 0
          ? supabase.from("teacher_profiles").select("id, title, subject, location, experience_years, professional_qualification, profiles(full_name, avatar_url)").in("id", watchlistTeacherIds.slice(0, 20))
          : Promise.resolve({ data: [] }),
        watchlistJobIds.length > 0
          ? supabase.from("jobs").select("id, title, school_name, location, employment_type, salary_min, salary_max").in("id", watchlistJobIds.slice(0, 20))
          : Promise.resolve({ data: [] }),
      ]);
      setWatchlistTeachers((tRes.data as any[]) || []);
      setWatchlistJobs((jRes.data as any[]) || []);
      setWatchlistLoading(false);
    };
    load();
  }, [tab, watchlistTeacherIds, watchlistJobIds]); // eslint-disable-line

  const removeWatchlistTeacher = (id: string) => {
    const next = watchlistTeacherIds.filter(i => i !== id);
    setWatchlistTeacherIds(next);
    setWatchlistTeachers(prev => prev.filter(t => t.id !== id));
    localStorage.setItem("agency_watchlist_teachers", JSON.stringify(next));
  };

  const removeWatchlistJob = (id: string) => {
    const next = watchlistJobIds.filter(i => i !== id);
    setWatchlistJobIds(next);
    setWatchlistJobs(prev => prev.filter(j => j.id !== id));
    localStorage.setItem("xyroots_watchlist", JSON.stringify(next));
  };

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !profile) return;
    setIsLoadingData(true);

    // Fetch jobs first (need IDs for applications query)
    const { data: jData } = await supabase
      .from("jobs")
      .select("id, title, status, location, school_name, created_at, employment_type, salary_min, salary_max")
      .eq("posted_by_profile_id", profile.id)
      .order("created_at", { ascending: false });
    if (jData) setJobs(jData);

    // Fetch applicants in parallel once we have job IDs
    if (jData && jData.length > 0) {
      const jobIds = jData.map((j: any) => j.id);
      const { data: appData } = await supabase
        .from("applications")
        .select(`
          id, status, created_at, job_id,
          jobs(title, location, school_name),
          profiles!applicant_profile_id(id, full_name,
            teacher_profiles(id, title, subject, location, experience_years, professional_qualification)
          )
        `)
        .in("job_id", jobIds)
        .order("created_at", { ascending: false });
      if (appData) setApplications(appData as any[]);
    }

    setIsLoadingData(false);
  }, [isAuthenticated, profile, supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const initials = (profile?.full_name || "S").charAt(0).toUpperCase();
  const publishedJobs = jobs.filter(j => j.status === "published");

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Clean white header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 bg-gray-200 text-gray-700 font-bold text-xl flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ borderRadius: "0.875rem" }}
                >
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                    : initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h1 className="text-lg font-bold text-gray-900">{profile?.full_name}</h1>
                    <FaShieldHalved className="w-4 h-4 text-gray-500" title="Verified Institution" />
                  </div>
                  <p className="text-sm text-gray-500">School / Institution · {profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap self-start sm:self-auto">
                <button
                  onClick={() => setShowGetVerified(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-colors"
                  style={{ borderRadius: "0.875rem" }}
                >
                  <FaShieldHalved className="w-4 h-4 text-[#00a264]" /> Get Verified
                </button>
                <button
                  onClick={() => setShowPostJob(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-bold hover:bg-black transition-colors"
                  style={{ borderRadius: "0.875rem" }}
                >
                  <FaCirclePlus className="w-4 h-4" /> Post New Vacancy
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { label: "Total Posted", value: jobs.length, color: "text-gray-900" },
                { label: "Live Now", value: publishedJobs.length, color: "text-gray-900" },
                { label: "Applicants", value: applications.length, color: "text-gray-900" },
                { label: "Shortlisted", value: applications.filter((a: any) => a.status === "shortlisted" || a.status === "interview").length, color: "text-gray-900" },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 border border-gray-200 px-4 py-3" style={{ borderRadius: "0.75rem" }}>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
            {([
              { id: "candidates", label: `Applicants (${applications.length})`, icon: FaUsers },
              { id: "vacancies", label: `Vacancies (${jobs.length})`, icon: FaRegFileLines },
              { id: "pipeline", label: "Pipeline", icon: FaChartBar },
              { id: "watchlist", label: "Watchlist", icon: FaBookmark },
              { id: "settings", label: "Settings", icon: FaGear },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all -mb-px shrink-0 ${
                  tab === t.id
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>

          {/* Applicants Tab */}
          {tab === "candidates" && (
            <div className="space-y-3">
              {applications.length === 0 ? (
                <div className="bg-white border border-gray-100 p-12 text-center" style={{ borderRadius: "1rem" }}>
                  <FaUsers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-gray-900 mb-1">No Applications Yet</h3>
                  <p className="text-gray-500 text-sm">When teachers apply to your vacancies they will appear here.</p>
                </div>
              ) : applications.map((app: any) => {
                const p = app.profiles;
                const tp = Array.isArray(p?.teacher_profiles) ? p?.teacher_profiles?.[0] : p?.teacher_profiles;
                const job = app.jobs;
                const teacherProfileId = tp?.id;
                return (
                  <div key={app.id} className="bg-white border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderRadius: "1rem" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0 overflow-hidden" style={{ borderRadius: "50%" }}>
                        {p?.avatar_url
                          ? <img src={p.avatar_url} className="w-full h-full object-cover" alt={p?.full_name} />
                          : (p?.full_name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{p?.full_name || "Unknown Applicant"}</p>
                        <p className="text-xs text-gray-500">{tp?.title || tp?.subject || "Teacher"}{tp?.location ? ` · ${tp.location}` : ""}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Applied for: <span className="font-medium text-gray-600">{job?.title || "—"}</span>
                          <span className="ml-2 text-gray-400">· {new Date(app.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-bold px-2.5 py-1 ${STATUS_COLORS[app.status] || STATUS_COLORS.pending}`} style={{ borderRadius: "0.5rem" }}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                      {teacherProfileId && (
                        <Link
                          href={`/teachers/${teacherProfileId}`}
                          className="px-3 py-1.5 text-xs font-bold border border-gray-200 text-gray-700 hover:border-gray-500 hover:text-gray-800 transition-colors"
                          style={{ borderRadius: "0.5rem" }}
                        >
                          View Profile
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Vacancies Tab */}
          {tab === "vacancies" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Active Vacancies</h2>
                <button onClick={() => setShowPostJob(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gray-900 text-white hover:bg-black transition-colors" style={{ borderRadius: "0.75rem" }}>
                  <FaCirclePlus className="w-4 h-4" /> New Vacancy
                </button>
              </div>
              {jobs.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 p-12 text-center" style={{ borderRadius: "1rem" }}>
                  <FaBuilding className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No Vacancies Posted</h3>
                  <p className="text-gray-500 text-sm mb-4">Post your first teaching vacancy to start receiving applications.</p>
                  <button onClick={() => setShowPostJob(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold" style={{ borderRadius: "0.75rem" }}>
                    Post First Vacancy <FaArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : jobs.map(job => (
                <div key={job.id} className="bg-white border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderRadius: "1rem" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-gray-900">{job.title}</h3>
                      <span className={`text-xs px-2 py-0.5 font-bold ${
                        job.status === "published" ? "bg-gray-100 text-gray-700" :
                        job.status === "draft" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-500"
                      }`} style={{ borderRadius: "0.375rem" }}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {job.subject && `${job.subject} · `}{job.board && `${job.board} · `}
                      {job.location || "India"} · Posted {new Date(job.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingJob(job)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-gray-200 text-gray-700 hover:border-gray-500 hover:text-gray-900 transition-colors shrink-0"
                    style={{ borderRadius: "0.625rem" }}
                  >
                    <FaPencil className="w-3 h-3" /> Edit / Manage
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pipeline */}
          {tab === "pipeline" && (
            <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
              <h2 className="text-lg font-bold text-gray-900 mb-5">Hiring Pipeline</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "New Applications", count: applications.filter((a: any) => a.status === "pending").length, color: "bg-blue-50 text-blue-700 border-blue-100" },
                  { label: "Shortlisted", count: applications.filter((a: any) => a.status === "shortlisted").length, color: "bg-amber-50 text-amber-700 border-amber-100" },
                  { label: "Interviews", count: applications.filter((a: any) => a.status === "interview").length, color: "bg-purple-50 text-purple-700 border-purple-100" },
                  { label: "Offered / Hired", count: applications.filter((a: any) => a.status === "offered").length, color: "bg-gray-100 text-gray-700 border-gray-200" },
                ].map(stage => (
                  <div key={stage.label} className={`p-5 border ${stage.color}`} style={{ borderRadius: "0.875rem" }}>
                    <p className="text-2xl font-bold mb-1">{stage.count}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-75">{stage.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Watchlist Tab */}
          {tab === "watchlist" && (
            <div className="space-y-6">
              {watchlistLoading ? (
                <div className="flex items-center justify-center py-12">
                  <FaSpinner className="w-6 h-6 text-[#00a264] animate-spin" />
                </div>
              ) : (
                <>
                  {/* Saved Teachers */}
                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FaUsers className="w-4 h-4 text-[#00a264]" /> Saved Teacher Profiles
                      <span className="text-xs font-medium text-gray-400 ml-1">({watchlistTeachers.length})</span>
                    </h2>
                    {watchlistTeachers.length === 0 ? (
                      <div className="bg-white border border-gray-100 p-8 text-center" style={{ borderRadius: "1rem" }}>
                        <FaUsers className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No teacher profiles saved yet.</p>
                        <p className="text-xs text-gray-400 mt-1">Browse teachers and shortlist them to track here.</p>
                        <Link href="/teachers" className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#00a264] text-white text-xs font-bold hover:bg-[#008f58] transition-colors" style={{ borderRadius: "0.625rem" }}>
                          Browse Teachers <FaArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {watchlistTeachers.map((t: any) => (
                          <div key={t.id} className="bg-white border border-gray-200 p-4 flex flex-col gap-3" style={{ borderRadius: "1rem" }}>
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 shrink-0 flex items-center justify-center font-bold text-sm overflow-hidden bg-gray-200 text-gray-600" style={{ borderRadius: "50%" }}>
                                {t.profiles?.avatar_url
                                  ? <img src={t.profiles.avatar_url} className="w-full h-full object-cover" alt={t.profiles?.full_name} style={{ borderRadius: "50%" }} />
                                  : (t.profiles?.full_name || "T").charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{t.profiles?.full_name || "Unknown"}</p>
                                <p className="text-xs text-gray-500 truncate">{t.title || t.subject || "Educator"}</p>
                                {t.location && (
                                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                    <FaLocationDot className="w-2.5 h-2.5 shrink-0" />{t.location}
                                  </p>
                                )}
                              </div>
                              <button onClick={() => removeWatchlistTeacher(t.id)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                                <FaXmark className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {t.subject && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 font-medium" style={{ borderRadius: "0.375rem" }}>{t.subject}</span>}
                              {t.experience_years != null && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 font-medium" style={{ borderRadius: "0.375rem" }}>{t.experience_years} yrs</span>}
                              {t.professional_qualification && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 font-medium" style={{ borderRadius: "0.375rem" }}>{t.professional_qualification}</span>}
                            </div>
                            <Link href={`/teachers/${t.id}`} className="w-full py-2 text-xs font-bold text-center bg-gray-900 text-white hover:bg-black transition-colors" style={{ borderRadius: "0.5rem" }}>
                              View Profile
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Saved Jobs */}
                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <FaBriefcase className="w-4 h-4 text-[#00a264]" /> Saved Job Listings
                      <span className="text-xs font-medium text-gray-400 ml-1">({watchlistJobs.length})</span>
                    </h2>
                    {watchlistJobs.length === 0 ? (
                      <div className="bg-white border border-gray-100 p-8 text-center" style={{ borderRadius: "1rem" }}>
                        <FaRegBookmark className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No jobs saved yet.</p>
                        <p className="text-xs text-gray-400 mt-1">Bookmark jobs while browsing to track them here.</p>
                        <Link href="/jobs" className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#00a264] text-white text-xs font-bold hover:bg-[#008f58] transition-colors" style={{ borderRadius: "0.625rem" }}>
                          Browse Jobs <FaArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {watchlistJobs.map((job: any) => (
                          <div key={job.id} className="bg-white border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderRadius: "1rem" }}>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900">{job.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{[job.school_name, job.location].filter(Boolean).join(" · ")}</p>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {job.employment_type && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 font-medium" style={{ borderRadius: "0.375rem" }}>{job.employment_type}</span>}
                                {(job.salary_min || job.salary_max) && (
                                  <span className="text-xs px-2 py-0.5 bg-[#e6f7ed] text-[#00a264] font-medium" style={{ borderRadius: "0.375rem" }}>
                                    ₹{job.salary_min ? `${(job.salary_min/1000).toFixed(0)}k` : "?"}–{job.salary_max ? `${(job.salary_max/1000).toFixed(0)}k` : "?"}/mo
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Link href={`/jobs/${job.id}`} className="px-3 py-1.5 text-xs font-bold bg-[#00a264] text-white hover:bg-[#008f58] transition-colors" style={{ borderRadius: "0.5rem" }}>
                                View Job
                              </Link>
                              <button onClick={() => removeWatchlistJob(job.id)} className="p-1.5 text-gray-300 hover:text-red-400 transition-colors border border-gray-200" style={{ borderRadius: "0.5rem" }}>
                                <FaXmark className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Settings */}
          {tab === "settings" && (
            <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
              <h2 className="text-lg font-bold text-gray-900 mb-5">Institution Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Contact Name</label>
                  <input defaultValue={profile?.full_name || ""} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-gray-500" style={{ borderRadius: "0.75rem" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Email Address</label>
                  <input defaultValue={profile?.email || ""} disabled className="w-full px-4 py-2.5 text-sm bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed outline-none" style={{ borderRadius: "0.75rem" }} />
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="border border-gray-200 rounded-xl p-4 mb-5 max-w-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-0.5">Institution Visibility</p>
                    <p className="text-xs text-gray-500">
                      {institutionVisible
                        ? "Your institution is publicly visible to teachers and job seekers."
                        : "Your institution is hidden — teachers cannot see your profile or job posts."}
                    </p>
                  </div>
                  <button
                    onClick={() => setInstitutionVisible(v => !v)}
                    className={`relative shrink-0 transition-colors ${institutionVisible ? 'bg-[#00a264]' : 'bg-gray-300'}`}
                    style={{ width: 44, height: 24, borderRadius: 999 }}
                  >
                    <div className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${institutionVisible ? 'left-[23px]' : 'left-[3px]'}`} />
                  </button>
                </div>
                {!institutionVisible && (
                  <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 font-medium">
                    ⚠ While hidden, your institution won't appear in search results and your job posts won't be discoverable.
                  </div>
                )}
              </div>

              <div className="flex gap-3 items-center">
                <button
                  onClick={saveVisibility}
                  disabled={savingVisibility}
                  className="px-5 py-2.5 text-sm font-semibold bg-gray-900 text-white hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-60"
                  style={{ borderRadius: "0.75rem" }}
                >
                  {savingVisibility ? <><FaSpinner className="w-3.5 h-3.5 animate-spin" /> Saving...</> : "Save Changes"}
                </button>
                <Link href="/profile" className="px-5 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors" style={{ borderRadius: "0.75rem" }}>Account Settings</Link>
                {visibilitySaved && <span className="text-sm text-[#00a264] font-semibold">✓ Saved!</span>}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <PostJobModal isOpen={showPostJob} onClose={() => setShowPostJob(false)} onSuccess={fetchData} />
      <EditJobModal isOpen={!!editingJob} onClose={() => setEditingJob(null)} job={editingJob} onSuccess={fetchData} />
      <GetVerifiedModal isOpen={showGetVerified} onClose={() => setShowGetVerified(false)} />
    </div>
  );
}
