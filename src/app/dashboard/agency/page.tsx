"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import PostJobModal from "@/components/PostJobModal";
import PostTeacherProfileModal from "@/components/PostTeacherProfileModal";
import EditJobModal from "@/components/EditJobModal";
import {
  FaUsers, FaRegFileLines, FaCirclePlus, FaShieldHalved,
  FaSpinner, FaBriefcase, FaBuilding, FaChartBar, FaGear,
  FaArrowRight, FaUserPlus, FaPencil, FaBookmark, FaRegBookmark,
  FaLocationDot, FaXmark, FaHouse, FaArrowRightFromBracket, FaBars
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist";

type Tab = "overview" | "candidates" | "vacancies" | "pipeline" | "watchlist" | "settings";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-blue-50 text-blue-700",
  reviewed: "bg-purple-50 text-purple-700",
  shortlisted: "bg-amber-50 text-amber-700",
  interview: "bg-[#e6f7ed] text-[#00a264]",
  offered: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  withdrawn: "bg-gray-100 text-gray-500",
};

export default function AgencyDashboard() {
  const { profile, loading, isAuthenticated, role, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("overview");
  const [showPostJob, setShowPostJob] = useState(false);
  const [showPostTeacher, setShowPostTeacher] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  const [watchlistTeacherIds, setWatchlistTeacherIds] = useState<string[]>([]);
  const [watchlistJobIds, setWatchlistJobIds] = useState<string[]>([]);
  const [watchlistTeachers, setWatchlistTeachers] = useState<any[]>([]);
  const [watchlistJobs, setWatchlistJobs] = useState<any[]>([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    if (searchParams?.get("action") === "post-job") setShowPostJob(true);
    if (searchParams?.get("action") === "post-teacher") setShowPostTeacher(true);
  }, [searchParams]);

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== "agency")) router.push("/");
  }, [loading, isAuthenticated, role, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getWatchlist().then(res => {
      if (res.success && res.data) {
        setWatchlistTeacherIds(res.data.teachers);
        setWatchlistJobIds(res.data.jobs);
      }
    });
  }, [isAuthenticated]);

  useEffect(() => {
    if (tab !== "watchlist") return;
    setWatchlistLoading(true);
    Promise.all([
      watchlistTeacherIds.length > 0
        ? supabase.from("teacher_profiles").select("id, title, subject, location, experience_years, profiles(full_name, avatar_url)").in("id", watchlistTeacherIds.slice(0, 20))
        : Promise.resolve({ data: [] }),
      watchlistJobIds.length > 0
        ? supabase.from("jobs").select("id, title, school_name, location, employment_type, salary_min, salary_max").in("id", watchlistJobIds.slice(0, 20))
        : Promise.resolve({ data: [] }),
    ]).then(([tRes, jRes]) => {
      setWatchlistTeachers((tRes.data as any[]) || []);
      setWatchlistJobs((jRes.data as any[]) || []);
      setWatchlistLoading(false);
    });
  }, [tab, watchlistTeacherIds, watchlistJobIds]); // eslint-disable-line

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !profile) return;
    setIsLoadingData(true);
    const { data: jData } = await supabase.from("jobs").select("*").eq("posted_by_profile_id", profile.id).order("created_at", { ascending: false });
    if (jData) setJobs(jData);
    if (jData && jData.length > 0) {
      const { data: appData } = await supabase.from("applications")
        .select(`id, status, created_at, job_id, jobs(title, location, school_name), profiles!applicant_profile_id(id, full_name, avatar_url, teacher_profiles(id, title, subject, location))`)
        .in("job_id", jData.map((j: any) => j.id)).order("created_at", { ascending: false });
      if (appData) setApplications(appData as any[]);
    }
    setIsLoadingData(false);
  }, [isAuthenticated, profile, supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSignOut = async () => { await signOut(); router.push("/"); };

  const avatar = profile?.avatar_url
    || `https://api.dicebear.com/7.x/initials/svg?seed=${(profile?.full_name || "A").replace(/\s+/g, "")}&chars=2`;
  const publishedJobs = jobs.filter(j => j.status === "published");
  const draftJobs = jobs.filter(j => j.status === "draft");
  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;

  const navItems: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: FaHouse },
    { id: "candidates", label: "Applicants", icon: FaUsers, badge: applications.length },
    { id: "vacancies", label: "Vacancies", icon: FaRegFileLines, badge: jobs.length },
    { id: "pipeline", label: "Pipeline", icon: FaChartBar },
    { id: "watchlist", label: "Watchlist", icon: FaBookmark },
    { id: "settings", label: "Settings", icon: FaGear },
  ];

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen flex bg-[#f4f5f7] animate-pulse">
        <div className="hidden md:block w-64 bg-white border-r border-gray-100 shrink-0">
          <div className="p-5 border-b border-gray-100"><div className="h-8 bg-gray-100 rounded w-24" /></div>
          <div className="p-4 space-y-2">{[1,2,3,4,5,6].map(i => <div key={i} className="h-10 bg-gray-50 rounded-xl" />)}</div>
        </div>
        <div className="flex-1 p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-2xl" />)}</div>
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-xl" />)}</div>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      <div className="px-4 py-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <img src={avatar} alt={profile?.full_name || "A"} className="w-10 h-10 rounded-full border-2 border-[#00a264]/20 object-cover shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{profile?.full_name}</p>
            <p className="text-[11px] text-gray-500">Consultancy / Agency</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map(item => (
          <button key={item.id} onClick={() => { setTab(item.id); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium transition-all"
            style={{ borderRadius: "0.625rem", backgroundColor: tab === item.id ? "#e6f7ed" : "transparent", color: tab === item.id ? "#00a264" : "#4b5563" }}
          >
            <span className="flex items-center gap-3">
              <item.icon className="w-4 h-4 shrink-0" style={{ color: tab === item.id ? "#00a264" : "#9ca3af" }} />
              {item.label}
            </span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center" style={{ borderRadius: "999px", backgroundColor: tab === item.id ? "#00a264" : "#f3f4f6", color: tab === item.id ? "#fff" : "#6b7280" }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="px-3 py-3 border-t border-gray-100 shrink-0 space-y-0.5">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          style={{ borderRadius: "0.625rem" }}
        >
          <FaHouse className="w-4 h-4 text-gray-400" /> Go to Homepage
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors" style={{ borderRadius: "0.625rem" }}>
          <FaArrowRightFromBracket className="w-4 h-4" /> Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex bg-[#f4f5f7]" style={{ minHeight: "100vh" }}>
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 shrink-0 sticky top-0 self-start" style={{ height: "100vh" }}>
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3">
        <Link href="/"><Image src="/logo1.webp" alt="Xyroots" width={100} height={30} className="h-7 w-auto" /></Link>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg"><FaBars className="w-5 h-5 text-gray-700" /></button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col overflow-y-auto">
            <div className="flex items-center justify-end px-4 py-3 border-b border-gray-100 shrink-0">
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-full" aria-label="Close menu">
                <FaXmark className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 flex flex-col">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 overflow-y-auto pt-16 md:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          <div className="hidden md:flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900 capitalize">{tab === "candidates" ? "Applicants" : tab.charAt(0).toUpperCase() + tab.slice(1)}</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowPostTeacher(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-colors" style={{ borderRadius: "0.75rem" }}>
                <FaUserPlus className="w-4 h-4" /> Post Teacher
              </button>
              <button onClick={() => setShowPostJob(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-bold hover:bg-black transition-colors" style={{ borderRadius: "0.75rem" }}>
                <FaCirclePlus className="w-4 h-4" /> Post Vacancy
              </button>
            </div>
          </div>

          {/* ── Overview ── */}
          {tab === "overview" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white border border-gray-200 p-6" style={{ borderRadius: "1rem" }}>
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900">Agency Profile</h2>
                    {joinedDate && <span className="text-xs text-gray-400">Joined {joinedDate}</span>}
                  </div>
                  <div className="flex items-start gap-4">
                    <img src={avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900">{profile?.full_name}</p>
                      <p className="text-sm text-gray-500 mt-0.5">Consultancy / Agency</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{profile?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-6" style={{ borderRadius: "1rem" }}>
                  <h2 className="text-base font-bold text-gray-900 mb-4">Activity</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Total Vacancies", value: jobs.length, bg: "bg-gray-50", color: "text-gray-900" },
                      { label: "Live", value: publishedJobs.length, bg: "bg-[#f0fdf4]", color: "text-[#00a264]" },
                      { label: "Drafts", value: draftJobs.length, bg: "bg-gray-50", color: "text-gray-900" },
                      { label: "Applicants", value: applications.length, bg: "bg-gray-50", color: "text-gray-900" },
                    ].map(s => (
                      <div key={s.label} className={`${s.bg} p-3.5`} style={{ borderRadius: "0.75rem" }}>
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {applications.length > 0 && (
                <div className="bg-white border border-gray-200 p-6" style={{ borderRadius: "1rem" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900">Recent Applicants</h2>
                    <button onClick={() => setTab("candidates")} className="text-xs font-semibold text-[#00a264] hover:underline">View all →</button>
                  </div>
                  <div className="space-y-3">
                    {applications.slice(0, 3).map((app: any) => {
                      const p = app.profiles; const job = app.jobs;
                      return (
                        <div key={app.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 hover:bg-[#f0fdf4] transition-colors" style={{ borderRadius: "0.75rem" }}>
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                              {p?.avatar_url ? <img src={p.avatar_url} className="w-full h-full object-cover" alt="" /> : (p?.full_name || "?").charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{p?.full_name || "Applicant"}</p>
                              <p className="text-xs text-gray-500 truncate">For: {job?.title || "—"}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 shrink-0 ${STATUS_COLORS[app.status] || STATUS_COLORS.pending}`} style={{ borderRadius: "0.375rem" }}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Applicants ── */}
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
                return (
                  <div key={app.id} className="bg-white border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderRadius: "1rem" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0 overflow-hidden" style={{ borderRadius: "50%" }}>
                        {p?.avatar_url ? <img src={p.avatar_url} className="w-full h-full object-cover" alt="" /> : (p?.full_name || "?").charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{p?.full_name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{tp?.title || tp?.subject || "Teacher"}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Applied for: <span className="font-medium text-gray-600">{job?.title || "—"}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-bold px-2.5 py-1 ${STATUS_COLORS[app.status] || STATUS_COLORS.pending}`} style={{ borderRadius: "0.5rem" }}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                      {tp?.id && <Link href={`/teachers/${tp.id}`} className="px-3 py-1.5 text-xs font-bold border border-gray-200 text-gray-700 hover:border-[#00a264] hover:text-[#00a264] transition-colors" style={{ borderRadius: "0.5rem" }}>View Profile</Link>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Vacancies ── */}
          {tab === "vacancies" && (
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 p-12 text-center" style={{ borderRadius: "1rem" }}>
                  <FaBuilding className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No Vacancies Yet</h3>
                  <p className="text-gray-500 text-sm mb-4">Post your first teaching vacancy.</p>
                  <button onClick={() => setShowPostJob(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00a264] text-white text-sm font-semibold" style={{ borderRadius: "0.75rem" }}>
                    Post First Vacancy <FaArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : jobs.map(job => (
                <div key={job.id} className="bg-white border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderRadius: "1rem" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{job.title}</h3>
                      <span className={`text-xs px-2 py-0.5 font-bold ${job.status === "published" ? "bg-[#e6f7ed] text-[#00a264]" : job.status === "draft" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-500"}`} style={{ borderRadius: "0.375rem" }}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{job.location || "India"} · Posted {new Date(job.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </div>
                  <button onClick={() => setEditingJob(job)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-gray-200 text-gray-700 hover:border-[#00a264] hover:text-[#00a264] transition-colors shrink-0" style={{ borderRadius: "0.625rem" }}>
                    <FaPencil className="w-3 h-3" /> Edit
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Pipeline ── */}
          {tab === "pipeline" && (
            <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
              <h2 className="text-lg font-bold text-gray-900 mb-5">Hiring Pipeline</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "New", count: applications.filter((a: any) => a.status === "pending").length, color: "bg-blue-50 text-blue-700 border-blue-100" },
                  { label: "Shortlisted", count: applications.filter((a: any) => a.status === "shortlisted").length, color: "bg-amber-50 text-amber-700 border-amber-100" },
                  { label: "Interviews", count: applications.filter((a: any) => a.status === "interview").length, color: "bg-purple-50 text-purple-700 border-purple-100" },
                  { label: "Offered", count: applications.filter((a: any) => a.status === "offered").length, color: "bg-[#e6f7ed] text-[#00a264] border-[#00a264]/20" },
                ].map(stage => (
                  <div key={stage.label} className={`p-5 border ${stage.color}`} style={{ borderRadius: "0.875rem" }}>
                    <p className="text-2xl font-bold mb-1">{stage.count}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-75">{stage.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Watchlist ── */}
          {tab === "watchlist" && (
            <div className="space-y-6">
              {watchlistLoading ? (
                <div className="flex items-center justify-center py-12"><FaSpinner className="w-6 h-6 text-[#00a264] animate-spin" /></div>
              ) : (
                <>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2"><FaUsers className="w-4 h-4 text-[#00a264]" /> Saved Teachers <span className="text-xs text-gray-400">({watchlistTeachers.length})</span></h2>
                    {watchlistTeachers.length === 0 ? (
                      <div className="bg-white border border-gray-100 p-8 text-center" style={{ borderRadius: "1rem" }}>
                        <FaUsers className="w-8 h-8 text-gray-200 mx-auto mb-2" /><p className="text-sm text-gray-500">No teachers saved yet.</p>
                        <Link href="/teachers" className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#00a264] text-white text-xs font-bold" style={{ borderRadius: "0.625rem" }}>Browse Teachers <FaArrowRight className="w-3 h-3" /></Link>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {watchlistTeachers.map((t: any) => (
                          <div key={t.id} className="bg-white border border-gray-200 p-4 flex flex-col gap-3" style={{ borderRadius: "1rem" }}>
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 shrink-0 bg-gray-200 text-gray-600 font-bold text-sm flex items-center justify-center overflow-hidden" style={{ borderRadius: "50%" }}>
                                {t.profiles?.avatar_url ? <img src={t.profiles.avatar_url} className="w-full h-full object-cover" alt="" style={{ borderRadius: "50%" }} /> : (t.profiles?.full_name || "T").charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{t.profiles?.full_name || "Unknown"}</p>
                                <p className="text-xs text-gray-500 truncate">{t.title || t.subject || "Educator"}</p>
                                {t.location && <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><FaLocationDot className="w-2.5 h-2.5" />{t.location}</p>}
                              </div>
                              <button onClick={() => { setWatchlistTeacherIds(p => p.filter(i => i !== t.id)); setWatchlistTeachers(p => p.filter(x => x.id !== t.id)); removeFromWatchlist("teacher", t.id); }} className="text-gray-300 hover:text-red-400 shrink-0"><FaXmark className="w-3.5 h-3.5" /></button>
                            </div>
                            <Link href={`/teachers/${t.id}`} className="w-full py-2 text-xs font-bold text-center bg-gray-900 text-white hover:bg-black" style={{ borderRadius: "0.5rem" }}>View Profile</Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2"><FaRegBookmark className="w-4 h-4 text-[#00a264]" /> Saved Jobs <span className="text-xs text-gray-400">({watchlistJobs.length})</span></h2>
                    {watchlistJobs.length === 0 ? (
                      <div className="bg-white border border-gray-100 p-8 text-center" style={{ borderRadius: "1rem" }}>
                        <FaRegBookmark className="w-8 h-8 text-gray-200 mx-auto mb-2" /><p className="text-sm text-gray-500">No jobs saved yet.</p>
                        <Link href="/jobs" className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#00a264] text-white text-xs font-bold" style={{ borderRadius: "0.625rem" }}>Browse Jobs <FaArrowRight className="w-3 h-3" /></Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {watchlistJobs.map((job: any) => (
                          <div key={job.id} className="bg-white border border-gray-200 p-4 flex items-center justify-between gap-3" style={{ borderRadius: "1rem" }}>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900">{job.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{[job.school_name, job.location].filter(Boolean).join(" · ")}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Link href={`/jobs/${job.id}`} className="px-3 py-1.5 text-xs font-bold bg-[#00a264] text-white hover:bg-[#008f58]" style={{ borderRadius: "0.5rem" }}>View</Link>
                              <button onClick={() => { setWatchlistJobIds(p => p.filter(i => i !== job.id)); setWatchlistJobs(p => p.filter(j => j.id !== job.id)); removeFromWatchlist("job", job.id); }} className="p-1.5 text-gray-300 hover:text-red-400 border border-gray-200" style={{ borderRadius: "0.5rem" }}><FaXmark className="w-3.5 h-3.5" /></button>
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

          {/* ── Settings ── */}
          {tab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white border border-gray-200 p-6" style={{ borderRadius: "1rem" }}>
                <h2 className="text-base font-bold text-gray-900 mb-4">Agency Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Agency / Contact Name</label>
                    <input defaultValue={profile?.full_name || ""} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-[#00a264]" style={{ borderRadius: "0.75rem" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Email Address</label>
                    <input defaultValue={profile?.email || ""} disabled className="w-full px-4 py-2.5 text-sm bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed" style={{ borderRadius: "0.75rem" }} />
                  </div>
                  <button className="px-5 py-2.5 text-sm font-semibold bg-[#00a264] text-white hover:bg-[#008f58] transition-colors" style={{ borderRadius: "0.75rem" }}>Save Changes</button>
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-6" style={{ borderRadius: "1rem" }}>
                <h2 className="text-base font-bold text-gray-900 mb-4">Session</h2>
                <p className="text-sm text-gray-500 mb-4">Signed in as <span className="font-semibold text-gray-900">{profile?.email}</span></p>
                <Link href="/profile" className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 mb-3" style={{ borderRadius: "0.75rem" }}>
                  <FaGear className="w-3.5 h-3.5" /> Account Settings
                </Link>
                <br />
                <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50" style={{ borderRadius: "0.75rem" }}>
                  <FaArrowRightFromBracket className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <PostJobModal isOpen={showPostJob} onClose={() => setShowPostJob(false)} onSuccess={fetchData} />
      <PostTeacherProfileModal isOpen={showPostTeacher} onClose={() => setShowPostTeacher(false)} onSuccess={fetchData} />
      <EditJobModal isOpen={!!editingJob} onClose={() => setEditingJob(null)} job={editingJob} onSuccess={fetchData} />
    </div>
  );
}
