"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import OnboardingModal from "@/components/OnboardingModal";
import GetVerifiedModal from "@/components/GetVerifiedModal";
import {
  FaBriefcase, FaBookmark, FaLocationDot, FaGraduationCap,
  FaCircleCheck, FaArrowRight, FaUser, FaSpinner, FaEnvelope,
  FaPhone, FaPencil, FaStar, FaBuilding, FaClock, FaCalendarDays,
  FaShieldHalved, FaCheck, FaCalendar, FaTriangleExclamation,
  FaGear, FaArrowRightFromBracket, FaHouse, FaMagnifyingGlass,
  FaBell, FaXmark, FaBars
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Tab = "overview" | "applications" | "saved" | "interviews" | "profile" | "settings";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-blue-50 text-blue-700",
  reviewed: "bg-purple-50 text-purple-700",
  shortlisted: "bg-amber-50 text-amber-700",
  interview: "bg-[#e6f7ed] text-[#00a264]",
  offered: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  withdrawn: "bg-gray-100 text-gray-500",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "Pending Review", reviewed: "Reviewed", shortlisted: "Shortlisted",
  interview: "Interview Scheduled", offered: "Offer Received",
  rejected: "Not Selected", withdrawn: "Withdrawn",
};
const INTERVIEW_STATUS_STYLE: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700",
  confirmed: "bg-[#e6f7ed] text-[#00a264]",
  cancelled: "bg-red-50 text-red-700",
  completed: "bg-gray-100 text-gray-600",
};

export default function TeacherDashboard() {
  const { profile, loading, isAuthenticated, role, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();
  const cacheRef = useRef<{ ts: number; data: any } | null>(null);
  const CACHE_TTL = 5 * 60 * 1000;

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== "teacher")) router.push("/");
  }, [loading, isAuthenticated, role, router]);

  useEffect(() => {
    if (!isAuthenticated || !profile) return;
    const load = async () => {
      if (cacheRef.current && Date.now() - cacheRef.current.ts < CACHE_TTL) {
        const c = cacheRef.current.data;
        setTeacherProfile(c.tp);
        setIsProfileVisible(c.tp?.is_visible ?? true);
        setApplications(c.apps);
        setInterviews(c.interviews);
        setSavedIds(c.savedIds);
        setIsLoadingData(false);
        return;
      }
      setIsLoadingData(true);
      const [tpRes, appsRes, intRes, watchRes] = await Promise.all([
        supabase.from("teacher_profiles").select("*").eq("profile_id", profile.id).single(),
        supabase.from("applications")
          .select("id, status, created_at, job_id, jobs(id, title, school_name, location, salary_min, salary_max)")
          .eq("applicant_profile_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase.from("teacher_profiles").select("id").eq("profile_id", profile.id).single()
          .then(async ({ data: tp }) => {
            if (!tp) return { data: [] };
            return supabase.from("interviews").select("*")
              .eq("teacher_profile_id", (tp as any).id)
              .order("interview_date", { ascending: true });
          }),
        supabase.from("watchlist")
          .select("item_id, item_type")
          .eq("profile_id", profile.id)
          .limit(100)
          .then(r => r)
          .catch(() => ({ data: [] })),
      ]);
      const tp = (tpRes as any).data;
      const apps = (appsRes as any).data || [];
      const ivs = (intRes as any).data || [];
      const watchItems = ((watchRes as any).data || []) as any[];
      const jobIds = watchItems.filter((w: any) => w.item_type === "job").map((w: any) => w.item_id);
      if (tp) { setTeacherProfile(tp); setIsProfileVisible((tp as any).is_visible ?? true); }
      setApplications(apps);
      setInterviews(ivs);
      setSavedIds(jobIds);
      cacheRef.current = { ts: Date.now(), data: { tp, apps, interviews: ivs, savedIds: jobIds } };
      setIsLoadingData(false);
    };
    load();
  }, [isAuthenticated, profile]); // eslint-disable-line

  useEffect(() => {
    if (tab !== "saved" || savedIds.length === 0) return;
    supabase.from("jobs")
      .select("id, title, school_name, board, location, employment_type, salary_min, salary_max")
      .in("id", savedIds.slice(0, 30))
      .then(({ data }) => { if (data) setSavedJobs(data); });
  }, [tab, savedIds]); // eslint-disable-line

  const avatar = profile?.avatar_url
    || `https://api.dicebear.com/7.x/initials/svg?seed=${(profile?.full_name || "X").replace(/\s+/g, "")}&chars=2`;
  const completionPct = teacherProfile?.profile_completion ?? 0;
  const activeCount = applications.filter(a => a.status === "interview" || a.status === "offered").length;
  const hasNewInterviews = interviews.some((iv: any) => iv.status === "scheduled" || iv.status === "confirmed");
  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null;

  // Profile strength — only count fields the user can actually fill in the modal
  // Required core fields (each = ~14% of 100 / 7 fields)
  const coreFields = [
    !!profile?.full_name,
    !!profile?.phone,
    !!teacherProfile?.title,
    !!teacherProfile?.subject,
    !!teacherProfile?.location,
    !!teacherProfile?.qualification,
    teacherProfile?.experience_years != null,
  ];
  const coreScore = coreFields.filter(Boolean).length;

  // Bonus fields
  const bonusFields = [
    !!teacherProfile?.professional_qualification,
    !!teacherProfile?.bio,
    !!profile?.avatar_url,
  ];
  const bonusScore = bonusFields.filter(Boolean).length;

  // Total out of 10, displayed as percentage
  const totalFields = coreFields.length + bonusFields.length; // 10
  const filledFields = coreScore + bonusScore;
  const computedCompletionPct = Math.round((filledFields / totalFields) * 100);
  // Use DB value if available and close, otherwise use computed
  const displayCompletionPct = teacherProfile ? Math.max(completionPct, computedCompletionPct) : 0;

  const missingFields: string[] = [];
  if (!profile?.phone) missingFields.push("phone number");
  if (!teacherProfile?.title) missingFields.push("professional title");
  if (!teacherProfile?.subject) missingFields.push("subject");
  if (!teacherProfile?.qualification) missingFields.push("qualification");
  if (!teacherProfile?.professional_qualification) missingFields.push("teaching qualification");
  if (teacherProfile?.experience_years == null) missingFields.push("experience years");
  if (!teacherProfile?.location) missingFields.push("location");
  if (!teacherProfile?.bio) missingFields.push("bio");
  if (!profile?.avatar_url) missingFields.push("profile photo");

  const completionSegments = [
    { label: "Basic Info", done: displayCompletionPct >= 25 },
    { label: "Professional", done: displayCompletionPct >= 50 },
    { label: "Experience", done: displayCompletionPct >= 75 },
    { label: "Complete", done: displayCompletionPct >= 100 },
  ];

  const navItems: { id: Tab; label: string; icon: React.ElementType; badge?: number; dot?: boolean }[] = [
    { id: "overview", label: "Overview", icon: FaHouse },
    { id: "applications", label: "Applications", icon: FaBriefcase, badge: applications.length },
    { id: "interviews", label: "Interviews", icon: FaCalendar, badge: interviews.length },
    { id: "saved", label: "Saved Jobs", icon: FaBookmark, badge: savedIds.length },
    { id: "profile", label: "My Profile", icon: FaUser },
    { id: "settings", label: "Settings", icon: FaGear },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // ── Skeleton ──
  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen flex bg-[#f4f5f7]">
        {/* Sidebar skeleton */}
        <div className="hidden md:flex flex-col w-56 lg:w-64 bg-white border-r border-gray-100 shrink-0 h-screen sticky top-0 animate-pulse">
          <div className="p-5 border-b border-gray-100">
            <div className="h-8 bg-gray-100 rounded w-24" />
          </div>
          <div className="p-4 space-y-2 flex-1">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-10 bg-gray-50 rounded-xl" />)}
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 p-5 sm:p-8 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <div className="h-48 bg-white rounded-2xl border border-gray-100" />
            <div className="h-48 bg-white rounded-2xl border border-gray-100" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100" />)}
          </div>
        </div>
      </div>
    );
  }

  // ── Sidebar component (shared desktop + mobile) ──
  const SidebarContent = () => (
    <>
      {/* Avatar mini */}
      <div className="px-4 py-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <img src={avatar} alt={profile?.full_name || "T"} className="w-10 h-10 rounded-full border-2 border-[#00a264]/20 object-cover shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{profile?.full_name}</p>
            <p className="text-[11px] text-gray-500 truncate">{teacherProfile?.title || "Teacher"}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => { setTab(item.id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium transition-all group`}
            style={{
              borderRadius: "0.625rem",
              backgroundColor: tab === item.id ? "#e6f7ed" : "transparent",
              color: tab === item.id ? "#00a264" : "#4b5563",
            }}
          >
            <span className="flex items-center gap-3">
              <item.icon
                className="w-4 h-4 shrink-0"
                style={{ color: tab === item.id ? "#00a264" : "#9ca3af" }}
              />
              {item.label}
            </span>
            <span className="flex items-center gap-1.5 shrink-0">
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 min-w-[18px] text-center"
                  style={{
                    borderRadius: "999px",
                    backgroundColor: tab === item.id ? "#00a264" : "#f3f4f6",
                    color: tab === item.id ? "#fff" : "#6b7280",
                  }}
                >
                  {item.badge}
                </span>
              )}
              {item.dot && <span className="w-2 h-2 rounded-full bg-red-500" />}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom: home + sign out */}
      <div className="px-3 py-3 border-t border-gray-100 shrink-0 space-y-0.5">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          style={{ borderRadius: "0.625rem" }}
        >
          <FaHouse className="w-4 h-4 text-gray-400" />
          Go to Homepage
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          style={{ borderRadius: "0.625rem" }}
        >
          <FaArrowRightFromBracket className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex bg-[#f4f5f7]" style={{ minHeight: "100vh" }}>

      {/* ── Desktop Sidebar — fixed height, never scrolls with content ── */}
      <aside className="hidden md:flex flex-col w-56 lg:w-64 bg-white border-r border-gray-100 shrink-0 sticky top-0 self-start" style={{ height: "100vh" }}>
        <SidebarContent />
      </aside>

      {/* ── Mobile: top bar + slide-in drawer ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3">
        <Link href="/"><Image src="/logo1.webp" alt="Xyroots" width={100} height={30} className="h-7 w-auto" /></Link>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
          <FaBars className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col overflow-y-auto">
            {/* Close button row — no logo (SidebarContent already has one) */}
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

      {/* ── Main Content — scrolls independently of sidebar ── */}
      <div className="flex-1 min-w-0 overflow-y-auto pt-16 md:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* ── Overview ── */}
          {tab === "overview" && (
            <div className="space-y-5">
              {/* Top 2-col row: Profile card + Stats card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Your Profile card */}
                <div className="bg-white border border-gray-200 p-6" style={{ borderRadius: "1rem" }}>
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900">Your profile</h2>
                    {joinedDate && <span className="text-xs text-gray-400">Joined {joinedDate}</span>}
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img src={avatar} alt={profile?.full_name || "T"}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00a264] text-white flex items-center justify-center hover:bg-[#007a4d] transition-colors"
                        style={{ borderRadius: "50%" }}
                      >
                        <FaPencil className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900">{profile?.full_name}</p>
                      {teacherProfile?.title && <p className="text-sm text-gray-500 mt-0.5">{teacherProfile.title}</p>}
                      {profile?.phone && <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1"><FaPhone className="w-3 h-3" />{profile.phone}</p>}
                      {profile?.email && <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 truncate"><FaEnvelope className="w-3 h-3 shrink-0" />{profile.email}</p>}
                    </div>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-200 text-gray-700 hover:border-[#00a264] hover:text-[#00a264] transition-colors"
                      style={{ borderRadius: "0.5rem" }}
                    >
                      <FaPencil className="w-3 h-3" /> Edit
                    </button>
                  </div>

                  {/* Visibility toggle */}
                  <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 border border-gray-100" style={{ borderRadius: "0.75rem" }}>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Visible to Employers</p>
                      <p className="text-[10px] text-gray-400">Allow schools to discover your profile</p>
                    </div>
                    <button
                      onClick={async () => {
                        const v = !isProfileVisible;
                        setIsProfileVisible(v);
                        if (profile?.id) {
                          await (supabase.from("teacher_profiles") as any).update({ is_visible: v }).eq("profile_id", profile.id);
                        }
                      }}
                      className={`relative shrink-0 transition-colors ${isProfileVisible ? "bg-[#00a264]" : "bg-gray-300"}`}
                      style={{ width: 38, height: 22, borderRadius: 999 }}
                    >
                      <div className="absolute top-[3px] w-4 h-4 bg-white transition-all" style={{ borderRadius: "50%", left: isProfileVisible ? 20 : 3 }} />
                    </button>
                  </div>
                </div>

                {/* Stats + Profile Strength card */}
                <div className="bg-white border border-gray-200 p-6 flex flex-col gap-4" style={{ borderRadius: "1rem" }}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900">Activity</h2>
                    <FaArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  {/* Stats 2×2 grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Applications", value: applications.length, sub: "total submitted", color: "text-gray-900", bg: "bg-gray-50", tab: "applications" as Tab },
                      { label: "Active", value: activeCount, sub: "shortlisted / offers", color: "text-[#00a264]", bg: "bg-[#f0fdf4]", tab: "applications" as Tab },
                      { label: "Saved Jobs", value: savedIds.length, sub: "bookmarked", color: "text-gray-900", bg: "bg-gray-50", tab: "saved" as Tab },
                      { label: "Interviews", value: interviews.length, sub: "scheduled", color: hasNewInterviews ? "text-blue-700" : "text-gray-900", bg: hasNewInterviews ? "bg-blue-50" : "bg-gray-50", tab: "interviews" as Tab },
                    ].map(s => (
                      <button
                        key={s.label}
                        onClick={() => setTab(s.tab)}
                        className={`${s.bg} p-3.5 text-left hover:opacity-80 transition-opacity active:scale-[0.98]`}
                        style={{ borderRadius: "0.75rem" }}
                      >
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.label}</p>
                        <p className="text-[10px] text-gray-400">{s.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profile Strength card */}
              {displayCompletionPct < 100 && (
                <div className="bg-white border border-gray-200 p-6" style={{ borderRadius: "1rem" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Profile Strength</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Complete your profile to get more interview calls</p>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{displayCompletionPct}%</span>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[25, 50, 75, 100].map(t => (
                      <div key={t} className="flex-1 h-2" style={{ borderRadius: "999px", backgroundColor: displayCompletionPct >= t ? "#00a264" : "#e5e7eb" }} />
                    ))}
                  </div>
                  <div className="flex flex-nowrap items-center gap-x-2 mb-3 overflow-hidden">
                    {completionSegments.map(s => (
                      <span key={s.label} className={`text-[9px] flex items-center gap-0.5 font-medium whitespace-nowrap ${s.done ? "text-[#00a264]" : "text-gray-400"}`}>
                        {s.done
                          ? <FaCheck className="w-3 h-3" />
                          : <div className="w-3 h-3 border border-gray-300 rounded-full" />}
                        {s.label}
                      </span>
                    ))}
                  </div>
                  {missingFields.length > 0 && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 mb-4" style={{ borderRadius: "0.5rem" }}>
                      Add your missing details: <span className="font-semibold">{missingFields.slice(0, 3).join(", ")}{missingFields.length > 3 ? ` and ${missingFields.length - 3} more` : ""}</span>
                    </p>
                  )}
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00a264] text-white text-sm font-bold hover:bg-[#007a4d] transition-colors"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    Complete Profile <FaArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Teaching Info card */}
              <div className="bg-white border border-gray-200 p-6" style={{ borderRadius: "1rem" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <FaGraduationCap className="w-4 h-4 text-[#00a264]" /> Teaching Information
                  </h2>
                  <button onClick={() => setShowEditModal(true)} className="text-xs font-semibold text-gray-400 hover:text-[#00a264] flex items-center gap-1 transition-colors">
                    <FaPencil className="w-3 h-3" /> Edit
                  </button>
                </div>
                {teacherProfile?.subject || teacherProfile?.qualification ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Subject", value: teacherProfile?.subject },
                      { label: "Qualification", value: teacherProfile?.qualification },
                      { label: "Teaching Qual.", value: teacherProfile?.professional_qualification },
                      { label: "Experience", value: teacherProfile?.experience_years != null ? `${teacherProfile.experience_years} yrs` : null },
                      { label: "Location", value: teacherProfile?.location },
                    ].filter(i => i.value).map(item => (
                      <div key={item.label} className="bg-gray-50 p-3" style={{ borderRadius: "0.625rem" }}>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">{item.label}</p>
                        <p className="text-sm font-bold text-gray-900 break-words">{item.value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No teaching information yet.{" "}
                    <button onClick={() => setShowEditModal(true)} className="text-[#00a264] underline not-italic">Add now</button>
                  </p>
                )}
              </div>

              {/* Recent Applications preview */}
              {applications.length > 0 && (
                <div className="bg-white border border-gray-200 p-6" style={{ borderRadius: "1rem" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900">Recent Applications</h2>
                    <button onClick={() => setTab("applications")} className="text-xs font-semibold text-[#00a264] hover:underline">View all →</button>
                  </div>
                  <div className="space-y-3">
                    {applications.slice(0, 3).map((app: any) => {
                      const job = app.jobs || {};
                      return (
                        <div key={app.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 hover:bg-[#f0fdf4] transition-colors" style={{ borderRadius: "0.75rem" }}>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-gray-900 truncate">{job.title || "Untitled"}</p>
                            <p className="text-xs text-gray-500 truncate">{[job.school_name, job.location].filter(Boolean).join(" · ")}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 shrink-0 ${STATUS_STYLE[app.status] || STATUS_STYLE.pending}`} style={{ borderRadius: "0.375rem" }}>
                            {STATUS_LABEL[app.status] || app.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Applications ── */}
          {tab === "applications" && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-5">My Applications</h1>
              <div className="space-y-3">
                {applications.length === 0 ? (
                  <div className="bg-white border border-gray-100 p-12 text-center" style={{ borderRadius: "1rem" }}>
                    <FaBriefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-900 mb-1">No Applications Yet</h3>
                    <p className="text-gray-500 text-sm mb-5">Start applying to teaching vacancies to track your status here.</p>
                    <Link href="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold" style={{ borderRadius: "0.75rem" }}>
                      Browse Jobs <FaArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : applications.map((app: any) => {
                  const job = app.jobs || {};
                  const jobId = job.id || app.job_id;
                  return (
                    <Link
                      key={app.id}
                      href={jobId ? `/jobs/${jobId}` : "#"}
                      className="block bg-white border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#00a264]/40 transition-all"
                      style={{ borderRadius: "1rem" }}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 shrink-0 flex items-center justify-center text-sm font-bold bg-[#f0fdf4] text-[#00a264] border border-[#00a264]/20" style={{ borderRadius: "0.75rem" }}>
                          {(job.school_name || job.title || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-gray-900 truncate">{job.title || "Untitled Position"}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-2 flex-wrap mt-0.5">
                            {job.school_name && <span className="flex items-center gap-1"><FaBuilding className="w-2.5 h-2.5" />{job.school_name}</span>}
                            {job.location && <span className="flex items-center gap-1"><FaLocationDot className="w-2.5 h-2.5" />{job.location}</span>}
                          </p>
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-bold px-2 py-0.5 ${STATUS_STYLE[app.status] || STATUS_STYLE.pending}`} style={{ borderRadius: "0.375rem" }}>
                              {STATUS_LABEL[app.status] || app.status}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <FaClock className="w-2.5 h-2.5" />
                              {new Date(app.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {(job.salary_min || job.salary_max) && (
                          <p className="text-sm font-bold text-gray-900 text-right">
                            ₹{job.salary_min ? `${(job.salary_min / 1000).toFixed(0)}k` : ""}
                            {job.salary_min && job.salary_max ? "–" : ""}
                            {job.salary_max ? `${(job.salary_max / 1000).toFixed(0)}k` : ""}
                            <span className="text-gray-400 text-xs font-normal">/mo</span>
                          </p>
                        )}
                        <FaArrowRight className="w-3.5 h-3.5 text-gray-300" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Saved Jobs ── */}
          {tab === "saved" && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-5">Saved Jobs</h1>
              <div className="space-y-3">
                {savedIds.length === 0 ? (
                  <div className="bg-white border border-gray-100 p-12 text-center" style={{ borderRadius: "1rem" }}>
                    <FaBookmark className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-900 mb-1">No Saved Jobs</h3>
                    <p className="text-gray-500 text-sm mb-5">Bookmark jobs while browsing to revisit them here.</p>
                    <Link href="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold" style={{ borderRadius: "0.75rem" }}>
                      Find Jobs <FaArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : savedJobs.length === 0 ? (
                  <div className="bg-white border border-gray-100 p-8 text-center" style={{ borderRadius: "1rem" }}>
                    <FaSpinner className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
                  </div>
                ) : savedJobs.map((job: any) => (
                  <div key={job.id} className="bg-white border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gray-200 transition-colors" style={{ borderRadius: "1rem" }}>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{job.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{[job.school_name, job.board, job.location || "India"].filter(Boolean).join(" · ")}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {job.employment_type && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 font-medium" style={{ borderRadius: "0.375rem" }}>{job.employment_type}</span>}
                        {(job.salary_min || job.salary_max) && (
                          <span className="text-xs px-2 py-0.5 bg-[#f0fdf4] text-[#00a264] font-medium" style={{ borderRadius: "0.375rem" }}>
                            ₹{job.salary_min ? `${(job.salary_min/1000).toFixed(0)}k` : "?"}–{job.salary_max ? `${(job.salary_max/1000).toFixed(0)}k` : "?"}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link href={`/jobs/${job.id}`} className="px-4 py-2 text-sm font-semibold bg-[#00a264] text-white hover:bg-[#007a4d] transition-colors shrink-0" style={{ borderRadius: "0.75rem" }}>
                      Apply Now
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Interviews ── */}
          {tab === "interviews" && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-5">Interviews</h1>
              <div className="space-y-3">
                {interviews.length === 0 ? (
                  <div className="bg-white border border-gray-100 p-12 text-center" style={{ borderRadius: "1rem" }}>
                    <FaCalendarDays className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-900 mb-1">No Interviews Scheduled</h3>
                    <p className="text-gray-500 text-sm">When a recruiter schedules an interview, it will appear here.</p>
                  </div>
                ) : interviews.map((iv: any) => {
                  const isNew = (Date.now() - new Date(iv.created_at).getTime()) < 48 * 60 * 60 * 1000;
                  const isUpcoming = iv.status === "scheduled" || iv.status === "confirmed";
                  return (
                    <div key={iv.id} className={`bg-white border p-5 ${isUpcoming ? "border-[#00a264]/30  " : "border-gray-100"}`} style={{ borderRadius: "1rem" }}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-sm font-bold text-gray-900">{iv.institution_name || iv.recruiter_name}</h3>
                            <span className={`text-xs font-bold px-2 py-0.5 ${INTERVIEW_STATUS_STYLE[iv.status] || "bg-gray-100 text-gray-500"}`} style={{ borderRadius: "0.375rem" }}>
                              {iv.status.charAt(0).toUpperCase() + iv.status.slice(1)}
                            </span>
                            {(isNew || isUpcoming) && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-red-500 text-white animate-pulse" style={{ borderRadius: "0.375rem" }}>
                                <FaTriangleExclamation className="w-2.5 h-2.5" /> Important
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{iv.interview_type}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1"><FaCalendarDays className="w-3 h-3" />{new Date(iv.interview_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
                            <span className="flex items-center gap-1"><FaClock className="w-3 h-3" />{iv.time_slot}</span>
                          </div>
                          {iv.recruiter_email && <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1"><FaEnvelope className="w-2.5 h-2.5" />{iv.recruiter_email}</p>}
                          {iv.message && <p className="text-xs text-gray-500 mt-2 italic">&ldquo;{iv.message}&rdquo;</p>}
                        </div>
                        {isUpcoming && (
                          <span className="flex items-center gap-1 text-xs font-bold text-[#00a264] bg-[#e6f7ed] px-3 py-1.5 shrink-0" style={{ borderRadius: "0.5rem" }}>
                            <FaCalendarDays className="w-3 h-3" /> Upcoming
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── My Profile ── */}
          {tab === "profile" && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-5">My Profile</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Left col */}
                <div className="space-y-5">
                  {/* Profile card — reference style */}
                  <div className="bg-white border border-gray-200 p-6" style={{ borderRadius: "1rem" }}>
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-base font-bold text-gray-900">Your profile</h2>
                      {joinedDate && <span className="text-xs text-gray-400">Joined {joinedDate}</span>}
                    </div>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative shrink-0">
                        <img src={avatar} alt={profile?.full_name || "T"} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
                        <button onClick={() => setShowEditModal(true)} className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00a264] text-white flex items-center justify-center hover:bg-[#007a4d]" style={{ borderRadius: "50%" }}>
                          <FaPencil className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900">{profile?.full_name}</p>
                        {teacherProfile?.title && <p className="text-sm text-gray-500">{teacherProfile.title}</p>}
                        {teacherProfile?.subject && <p className="text-xs text-gray-400">{teacherProfile.subject}</p>}
                      </div>
                      <button onClick={() => setShowEditModal(true)} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-200 text-gray-700 hover:border-[#00a264] hover:text-[#00a264] transition-colors" style={{ borderRadius: "0.5rem" }}>
                        <FaPencil className="w-3 h-3" /> Edit
                      </button>
                    </div>
                    <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                      {profile?.email && <div className="flex items-center gap-2 text-gray-600"><FaEnvelope className="w-3.5 h-3.5 text-gray-400 shrink-0" /><span className="truncate text-xs">{profile.email}</span></div>}
                      {profile?.phone && <div className="flex items-center gap-2 text-gray-600"><FaPhone className="w-3.5 h-3.5 text-gray-400 shrink-0" /><span className="text-xs">{profile.phone}</span></div>}
                      {teacherProfile?.location && <div className="flex items-center gap-2 text-gray-600"><FaLocationDot className="w-3.5 h-3.5 text-gray-400 shrink-0" /><span className="text-xs">{teacherProfile.location}</span></div>}
                    </div>
                  </div>

                  {/* Get Verified */}
                  <div className="bg-white border border-gray-200 p-5" style={{ borderRadius: "1rem" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Verification Status</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Get verified to stand out to employers</p>
                      </div>
                      <button onClick={() => setShowVerifiedModal(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-dashed border-[#00a264] text-[#00a264] hover:bg-[#f0fdf4] transition-colors" style={{ borderRadius: "0.5rem" }}>
                        <FaShieldHalved className="w-3.5 h-3.5" /> Get Verified
                      </button>
                    </div>
                  </div>

                  {/* Skills */}
                  {teacherProfile?.skills?.length > 0 && (
                    <div className="bg-white border border-gray-200 p-5" style={{ borderRadius: "1rem" }}>
                      <h3 className="text-sm font-bold text-gray-900 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {teacherProfile.skills.map((skill: string) => (
                          <span key={skill} className="text-xs px-2.5 py-1 bg-[#f0fdf4] text-[#00a264] font-medium border border-[#00a264]/20" style={{ borderRadius: "0.5rem" }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right col */}
                <div className="space-y-5">
                  {/* Professional Summary */}
                  <div className="bg-white border border-gray-200 p-5" style={{ borderRadius: "1rem" }}>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><FaStar className="w-4 h-4 text-[#00a264]" /> Professional Summary</h3>
                    {teacherProfile?.bio
                      ? <p className="text-sm text-gray-700 leading-relaxed">{teacherProfile.bio}</p>
                      : <p className="text-sm text-gray-400 italic">No bio added. <button onClick={() => setShowEditModal(true)} className="text-[#00a264] underline not-italic">Add one</button></p>}
                  </div>

                  {/* Teaching Info */}
                  <div className="bg-white border border-gray-200 p-5" style={{ borderRadius: "1rem" }}>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><FaGraduationCap className="w-4 h-4 text-[#00a264]" /> Teaching Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Subject", value: teacherProfile?.subject },
                        { label: "Qualification", value: teacherProfile?.qualification },
                        { label: "Teaching Qual.", value: teacherProfile?.professional_qualification },
                        { label: "Experience", value: teacherProfile?.experience_years != null ? `${teacherProfile.experience_years} yrs` : null },
                      ].filter(i => i.value).map(item => (
                        <div key={item.label} className="bg-gray-50 p-3" style={{ borderRadius: "0.625rem" }}>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">{item.label}</p>
                          <p className="text-sm font-bold text-gray-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Work Experience */}
                  {teacherProfile?.experience_details?.length > 0 && (
                    <div className="bg-white border border-gray-200 p-5" style={{ borderRadius: "1rem" }}>
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><FaBriefcase className="w-4 h-4 text-[#00a264]" /> Work Experience</h3>
                      <div className="space-y-3">
                        {teacherProfile.experience_details.map((exp: any, i: number) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-1 bg-[#00a264]/30 shrink-0 mt-1" style={{ borderRadius: "999px" }} />
                            <div>
                              <p className="text-sm font-bold text-gray-900">{exp.role || exp.jobTitle || "Teacher"}</p>
                              <p className="text-xs text-gray-500">{exp.school || exp.organization || ""}</p>
                              <p className="text-xs text-gray-400">{exp.duration || `${exp.startDate || ""}${exp.endDate ? ` – ${exp.endDate}` : ""}`}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {teacherProfile?.education?.length > 0 && (
                    <div className="bg-white border border-gray-200 p-5" style={{ borderRadius: "1rem" }}>
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><FaGraduationCap className="w-4 h-4 text-[#00a264]" /> Education</h3>
                      <div className="space-y-3">
                        {teacherProfile.education.map((edu: any, i: number) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-1 bg-[#00a264]/30 shrink-0 mt-1" style={{ borderRadius: "999px" }} />
                            <div>
                              <p className="text-sm font-bold text-gray-900">{edu.degree || ""}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</p>
                              <p className="text-xs text-gray-500">{edu.institution || ""}</p>
                              {edu.endDate && <p className="text-xs text-gray-400">{edu.endDate}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Settings ── */}
          {tab === "settings" && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-5">Settings</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Account Options */}
                <div className="bg-white border border-gray-200 p-6" style={{ borderRadius: "1rem" }}>
                  <h2 className="text-base font-bold text-gray-900 mb-4">Account Options</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Visible to Employers</p>
                        <p className="text-xs text-gray-500 mt-0.5">Let schools and institutions discover your profile</p>
                      </div>
                      <button
                        onClick={async () => {
                          const v = !isProfileVisible;
                          setIsProfileVisible(v);
                          if (profile?.id) {
                            await (supabase.from("teacher_profiles") as any).update({ is_visible: v }).eq("profile_id", profile.id);
                          }
                        }}
                        className={`relative shrink-0 transition-colors ${isProfileVisible ? "bg-[#00a264]" : "bg-gray-300"}`}
                        style={{ width: 40, height: 22, borderRadius: 999 }}
                      >
                        <div className="absolute top-[3px] w-4 h-4 bg-white transition-all" style={{ borderRadius: "50%", left: isProfileVisible ? 21 : 3 }} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Email Notifications</p>
                        <p className="text-xs text-gray-500 mt-0.5">Receive alerts for new job matches and interviews</p>
                      </div>
                      <span className="text-xs text-gray-400">Managed in Account Settings</span>
                    </div>
                  </div>
                  <Link href="/profile" className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-colors" style={{ borderRadius: "0.75rem" }}>
                    <FaGear className="w-3.5 h-3.5" /> Full Account Settings
                  </Link>
                </div>

                {/* Danger Zone */}
                <div className="bg-white border border-gray-200 p-6" style={{ borderRadius: "1rem" }}>
                  <h2 className="text-base font-bold text-gray-900 mb-4">Session</h2>
                  <p className="text-sm text-gray-500 mb-4">Signed in as <span className="font-semibold text-gray-900">{profile?.email}</span></p>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    <FaArrowRightFromBracket className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {showEditModal && (
        <OnboardingModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          role="teacher"
          onSaved={async () => {
            cacheRef.current = null; // force re-fetch next time
            if (profile) {
              // Re-fetch teacher_profile to get the fresh completion %
              const { data: tp } = await supabase
                .from("teacher_profiles")
                .select("*")
                .eq("profile_id", profile.id)
                .single();
              if (tp) {
                setTeacherProfile({ ...tp });
                setIsProfileVisible((tp as any).is_visible ?? true);
              }
            }
          }}
        />
      )}
      <GetVerifiedModal isOpen={showVerifiedModal} onClose={() => setShowVerifiedModal(false)} />
    </div>
  );
}
