"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OnboardingModal from "@/components/OnboardingModal";
import GetVerifiedModal from "@/components/GetVerifiedModal";
import {
  FaBriefcase, FaBookmark, FaLocationDot, FaGraduationCap,
  FaCircleCheck, FaArrowRight, FaUser, FaSpinner, FaEnvelope,
  FaPhone, FaPencil, FaStar, FaBuilding, FaClock, FaCalendarDays,
  FaShieldHalved, FaCheckDouble, FaCalendar
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getMyApplications } from "@/lib/actions/jobs";
import { getMyInterviews } from "@/lib/actions/interviews";

type Tab = "applications" | "saved" | "interviews" | "profile";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-blue-50 text-blue-700",
  reviewed: "bg-purple-50 text-purple-700",
  shortlisted: "bg-amber-50 text-amber-700",
  interview: "bg-green-50 text-green-700",
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
  confirmed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  completed: "bg-gray-100 text-gray-600",
};

// ─── Modern profile completion bar ───────────────────────────────────────────
function ProfileCompletionBanner({ pct, onEdit }: { pct: number; onEdit: () => void }) {
  if (pct >= 100) return null;
  const segments = [
    { label: "Basic Info", done: pct >= 25 },
    { label: "Professional", done: pct >= 50 },
    { label: "Experience", done: pct >= 75 },
    { label: "Complete", done: pct >= 100 },
  ];
  return (
    <div className="bg-white border border-gray-100 p-5 mb-6" style={{ borderRadius: "1rem" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-gray-900">Profile Strength</p>
          <p className="text-xs text-gray-500 mt-0.5">Complete your profile to get more interview calls</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-xyroots-teal">{pct}%</span>
        </div>
      </div>
      {/* Segmented bar */}
      <div className="flex gap-1 mb-3">
        {[25, 50, 75, 100].map(threshold => (
          <div key={threshold} className="flex-1 h-1.5 transition-all" style={{
            borderRadius: "999px",
            backgroundColor: pct >= threshold ? "#00a264" : "#e5e7eb"
          }} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {segments.map(s => (
            <div key={s.label} className="flex items-center gap-1">
              {s.done
                ? <FaCheckDouble className="w-3 h-3 text-xyroots-teal" />
                : <div className="w-3 h-3 border border-gray-300" style={{ borderRadius: "50%" }} />}
              <span className={`text-[10px] font-medium ${s.done ? "text-xyroots-teal" : "text-gray-400"}`}>{s.label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onEdit}
          className="text-xs font-semibold text-xyroots-teal hover:underline flex items-center gap-1"
        >
          Complete now <FaArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { profile, loading, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("applications");
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== "teacher")) router.push("/");
  }, [loading, isAuthenticated, role, router]);

  // Load saved IDs from localStorage
  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem("xyroots_watchlist") || "[]");
      setSavedIds(ids);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !profile) return;
    const load = async () => {
      setIsLoadingData(true);

      // Teacher profile
      const { data: tp } = await supabase
        .from("teacher_profiles").select("*").eq("profile_id", profile.id).single();
      if (tp) { setTeacherProfile(tp); setIsProfileVisible((tp as any).is_visible ?? true); }

      // Real applications
      const appsResult = await getMyApplications();
      if (appsResult.success && appsResult.data) setApplications(appsResult.data as any[]);

      // Interviews scheduled by recruiters
      const intResult = await getMyInterviews();
      if (intResult.success && intResult.data) setInterviews(intResult.data);

      setIsLoadingData(false);
    };
    load();
  }, [isAuthenticated, profile]); // eslint-disable-line

  // Load saved jobs when tab switches to saved
  useEffect(() => {
    if (tab !== "saved" || savedIds.length === 0) return;
    supabase.from("jobs").select("*").in("id", savedIds.slice(0, 30))
      .then(({ data }) => { if (data) setSavedJobs(data); });
  }, [tab, savedIds]); // eslint-disable-line

  const avatar = profile?.avatar_url
    || `https://api.dicebear.com/7.x/initials/svg?seed=${(profile?.full_name || "X").replace(/\s+/g, "")}&chars=2`;
  const completionPct = teacherProfile?.profile_completion ?? 0;
  const activeCount = applications.filter(a => a.status === "interview" || a.status === "offered").length;

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <FaSpinner className="w-8 h-8 text-xyroots-teal animate-spin" />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "applications", label: "Applied", count: applications.length, icon: FaBriefcase },
    { id: "saved", label: "Saved", count: savedIds.length, icon: FaBookmark },
    { id: "interviews", label: "Interviews", count: interviews.length, icon: FaCalendar },
    { id: "profile", label: "Profile", count: null, icon: FaUser },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Clean header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img src={avatar} alt={profile?.full_name || "Teacher"}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover border-2 border-gray-200"
                  style={{ borderRadius: "50%" }} />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-xyroots-teal flex items-center justify-center" style={{ borderRadius: "50%" }}>
                  <FaCircleCheck className="w-2.5 h-2.5 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">{profile?.full_name}</h1>
                  {/* Not verified by default — show Get Verified */}
                  <button
                    onClick={() => setShowVerifiedModal(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold border border-dashed border-gray-300 text-gray-500 hover:border-xyroots-teal hover:text-xyroots-teal transition-colors"
                    style={{ borderRadius: "0.5rem" }}
                  >
                    <FaShieldHalved className="w-3 h-3" /> Get Verified
                  </button>
                </div>
                <p className="text-gray-500 text-sm mb-2">
                  {teacherProfile?.title || teacherProfile?.subject || "Teacher"}
                  {teacherProfile?.location ? ` · ${teacherProfile.location}` : ""}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {teacherProfile?.qualification && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium" style={{ borderRadius: "0.375rem" }}>
                      <FaGraduationCap className="w-2.5 h-2.5" /> {teacherProfile.qualification}
                    </span>
                  )}
                  {teacherProfile?.experience_years != null && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium" style={{ borderRadius: "0.375rem" }}>
                      <FaBriefcase className="w-2.5 h-2.5" /> {teacherProfile.experience_years} yrs
                    </span>
                  )}
                </div>
              </div>

              {/* Stats — compact on mobile */}
              <div className="flex gap-2 sm:gap-3 shrink-0">
                {[
                  { label: "Applied", value: applications.length, accent: false },
                  { label: "Active", value: activeCount, accent: true },
                  { label: "Saved", value: savedIds.length, accent: false },
                ].map(s => (
                  <div key={s.label} className={`text-center px-2.5 sm:px-4 py-1.5 sm:py-2 border ${s.accent ? "bg-xyroots-mint border-xyroots-teal/20" : "bg-gray-50 border-gray-200"}`} style={{ borderRadius: "0.75rem" }}>
                    <p className={`text-lg sm:text-2xl font-bold ${s.accent ? "text-xyroots-teal" : "text-gray-900"}`}>{s.value}</p>
                    <p className={`text-[10px] sm:text-xs font-medium ${s.accent ? "text-xyroots-teal" : "text-gray-500"}`}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">
          {/* Profile completion */}
          <ProfileCompletionBanner pct={completionPct} onEdit={() => setShowEditModal(true)} />

          {/* Tabs — scrollable on mobile, smaller text */}
          <div className="flex gap-0.5 sm:gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id as Tab)}
                className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all -mb-px whitespace-nowrap shrink-0 ${
                  tab === t.id
                    ? "text-xyroots-teal border-b-2 border-xyroots-teal"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <t.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                {t.label}
                {t.count !== null && t.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 font-bold ${
                    tab === t.id ? "bg-xyroots-mint text-xyroots-teal" : "bg-gray-100 text-gray-500"
                  }`} style={{ borderRadius: "999px" }}>{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Applications ── */}
          {tab === "applications" && (
            <div className="space-y-3">
              {applications.length === 0 ? (
                <div className="bg-white border border-gray-100 p-10 text-center" style={{ borderRadius: "1rem" }}>
                  <FaBriefcase className="w-9 h-9 text-gray-200 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-gray-900 mb-1">No Applications Yet</h3>
                  <p className="text-gray-500 text-sm mb-5">Start applying to teaching vacancies to see your status here.</p>
                  <Link href="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-xyroots-teal text-white text-sm font-semibold" style={{ borderRadius: "0.75rem" }}>
                    Browse Jobs <FaArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : applications.map((app: any) => {
                const job = app.jobs || {};
                return (
                  <div key={app.id} className="bg-white border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderRadius: "1rem" }}>
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-10 shrink-0 flex items-center justify-center text-sm font-bold" style={{ borderRadius: "0.75rem", backgroundColor: "#e6f7ed", color: "#00a264" }}>
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
                    {(job.salary_min || job.salary_max) && (
                      <p className="text-sm font-bold text-gray-900 shrink-0 text-right">
                        ₹{job.salary_min ? `${(job.salary_min/1000).toFixed(0)}k` : ""}
                        {job.salary_min && job.salary_max ? "–" : ""}
                        {job.salary_max ? `${(job.salary_max/1000).toFixed(0)}k` : ""}
                        <span className="text-gray-400 text-xs font-normal">/mo</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Saved Jobs ── */}
          {tab === "saved" && (
            <div className="space-y-3">
              {savedIds.length === 0 ? (
                <div className="bg-white border border-gray-100 p-10 text-center" style={{ borderRadius: "1rem" }}>
                  <FaBookmark className="w-9 h-9 text-gray-200 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-gray-900 mb-1">No Saved Jobs</h3>
                  <p className="text-gray-500 text-sm mb-5">Bookmark jobs while browsing to revisit them here.</p>
                  <Link href="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-xyroots-teal text-white text-sm font-semibold" style={{ borderRadius: "0.75rem" }}>
                    Find Jobs <FaArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : savedJobs.length === 0 ? (
                <div className="bg-white border border-gray-100 p-8 text-center" style={{ borderRadius: "1rem" }}>
                  <FaSpinner className="w-6 h-6 text-xyroots-teal animate-spin mx-auto" />
                </div>
              ) : savedJobs.map((job: any) => (
                <div key={job.id} className="bg-white border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderRadius: "1rem" }}>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {[job.school_name, job.board, job.location || "India"].filter(Boolean).join(" · ")}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {job.employment_type && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 font-medium" style={{ borderRadius: "0.375rem" }}>{job.employment_type}</span>}
                      {(job.salary_min || job.salary_max) && (
                        <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 font-medium" style={{ borderRadius: "0.375rem" }}>
                          ₹{job.salary_min ? `${(job.salary_min/1000).toFixed(0)}k` : "?"}–{job.salary_max ? `${(job.salary_max/1000).toFixed(0)}k` : "?"}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href={`/jobs/${job.id}`} className="px-4 py-2 text-sm font-semibold bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors shrink-0" style={{ borderRadius: "0.75rem" }}>
                    Apply
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* ── Interviews ── */}
          {tab === "interviews" && (
            <div className="space-y-3">
              {interviews.length === 0 ? (
                <div className="bg-white border border-gray-100 p-10 text-center" style={{ borderRadius: "1rem" }}>
                  <FaCalendarDays className="w-9 h-9 text-gray-200 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-gray-900 mb-1">No Interviews Scheduled</h3>
                  <p className="text-gray-500 text-sm">When a recruiter schedules an interview with you, it will appear here.</p>
                </div>
              ) : interviews.map((iv: any) => (
                <div key={iv.id} className="bg-white border border-gray-100 p-4 sm:p-5" style={{ borderRadius: "1rem" }}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-gray-900">{iv.institution_name || iv.recruiter_name}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 ${INTERVIEW_STATUS_STYLE[iv.status] || "bg-gray-100 text-gray-500"}`} style={{ borderRadius: "0.375rem" }}>
                          {iv.status.charAt(0).toUpperCase() + iv.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{iv.interview_type}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><FaCalendarDays className="w-3 h-3 text-xyroots-teal" />
                          {new Date(iv.interview_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1"><FaClock className="w-3 h-3 text-xyroots-teal" />{iv.time_slot}</span>
                      </div>
                      {iv.message && <p className="text-xs text-gray-500 mt-2 italic">&ldquo;{iv.message}&rdquo;</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Profile ── */}
          {tab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <div className="text-center mb-5">
                    <img src={avatar} alt={profile?.full_name || "Teacher"} className="w-20 h-20 mx-auto object-cover mb-3" style={{ borderRadius: "50%" }} />
                    <h2 className="font-bold text-gray-900 text-lg">{profile?.full_name}</h2>
                    <p className="text-sm text-gray-500">{teacherProfile?.title || "Teacher"}</p>
                  </div>

                  <div className="space-y-2.5 text-sm">
                    {profile?.email && <div className="flex items-center gap-2 text-gray-600"><FaEnvelope className="w-3.5 h-3.5 text-gray-400 shrink-0" /><span className="truncate text-xs">{profile.email}</span></div>}
                    {profile?.phone && <div className="flex items-center gap-2 text-gray-600"><FaPhone className="w-3.5 h-3.5 text-gray-400 shrink-0" /><span className="text-xs">{profile.phone}</span></div>}
                    {teacherProfile?.location && <div className="flex items-center gap-2 text-gray-600"><FaLocationDot className="w-3.5 h-3.5 text-gray-400 shrink-0" /><span className="text-xs">{teacherProfile.location}</span></div>}
                  </div>

                  {/* Visibility */}
                  <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 border border-gray-100" style={{ borderRadius: "0.75rem" }}>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Visible to Employers</p>
                      <p className="text-[10px] text-gray-400">Allow schools to find your profile</p>
                    </div>
                    <button
                      onClick={async () => {
                        const v = !isProfileVisible;
                        setIsProfileVisible(v);
                        await supabase.from("teacher_profiles").update({ is_visible: v }).eq("profile_id", profile?.id);
                      }}
                      className={`relative shrink-0 transition-colors ${isProfileVisible ? "bg-xyroots-teal" : "bg-gray-300"}`}
                      style={{ width: 38, height: 20, borderRadius: 999 }}
                    >
                      <div className="absolute top-[2px] w-4 h-4 bg-white shadow transition-all" style={{ borderRadius: "50%", left: isProfileVisible ? 18 : 2 }} />
                    </button>
                  </div>

                  {/* Get Verified */}
                  <button
                    onClick={() => setShowVerifiedModal(true)}
                    className="w-full mt-3 py-2.5 text-sm font-semibold border border-dashed border-gray-300 text-gray-600 hover:border-xyroots-teal hover:text-xyroots-teal transition-colors flex items-center justify-center gap-2"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    <FaShieldHalved className="w-3.5 h-3.5" /> Get Verified
                  </button>

                  <button onClick={() => setShowEditModal(true)} className="w-full mt-2 py-2.5 text-sm font-semibold bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors flex items-center justify-center gap-2" style={{ borderRadius: "0.75rem" }}>
                    <FaPencil className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                  <Link href="/profile" className="block w-full mt-2 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-center" style={{ borderRadius: "0.75rem" }}>
                    Account Settings
                  </Link>
                </div>

                {teacherProfile?.skills?.length > 0 && (
                  <div className="bg-white border border-gray-100 p-5" style={{ borderRadius: "1rem" }}>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {teacherProfile.skills.map((skill: string) => (
                        <span key={skill} className="text-xs px-2.5 py-1 bg-xyroots-mint text-xyroots-teal font-medium" style={{ borderRadius: "0.5rem" }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><FaStar className="w-4 h-4 text-xyroots-teal" /> Professional Summary</h3>
                  {teacherProfile?.bio
                    ? <p className="text-sm text-gray-700 leading-relaxed">{teacherProfile.bio}</p>
                    : <p className="text-sm text-gray-400 italic">No bio added yet.</p>}
                </div>

                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><FaGraduationCap className="w-4 h-4 text-xyroots-teal" /> Teaching Information</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Subject", value: teacherProfile?.subject },
                      { label: "Qualification", value: teacherProfile?.qualification },
                      { label: "Teaching Qual.", value: teacherProfile?.professional_qualification },
                      { label: "Experience", value: teacherProfile?.experience_years != null ? `${teacherProfile.experience_years} yrs` : null },
                      { label: "Location", value: teacherProfile?.location },
                    ].filter(i => i.value).map(item => (
                      <div key={item.label}>
                        <p className="text-[11px] text-gray-400 font-medium mb-0.5">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {!teacherProfile?.subject && <p className="text-sm text-gray-400 italic">No teaching information yet.</p>}
                </div>

                {teacherProfile?.experience_details?.length > 0 && (
                  <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><FaBriefcase className="w-4 h-4 text-xyroots-teal" /> Work Experience</h3>
                    <div className="space-y-4">
                      {teacherProfile.experience_details.map((exp: any, i: number) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-1 bg-xyroots-mint shrink-0 mt-1" style={{ borderRadius: "999px" }} />
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

                {teacherProfile?.education?.length > 0 && (
                  <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><FaGraduationCap className="w-4 h-4 text-xyroots-teal" /> Education</h3>
                    <div className="space-y-3">
                      {teacherProfile.education.map((edu: any, i: number) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-1 bg-xyroots-mint shrink-0 mt-1" style={{ borderRadius: "999px" }} />
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
          )}
        </div>
      </main>

      <Footer />

      {showEditModal && <OnboardingModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} role="teacher" />}
      <GetVerifiedModal isOpen={showVerifiedModal} onClose={() => setShowVerifiedModal(false)} />
    </div>
  );
}
