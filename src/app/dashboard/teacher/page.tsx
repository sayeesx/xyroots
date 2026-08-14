"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContinueProfileButton from "@/components/ContinueProfileButton";
import OnboardingModal from "@/components/OnboardingModal";
import {
  FaBriefcase, FaBookmark, FaGear, FaLocationDot, FaGraduationCap,
  FaCircleCheck, FaArrowRight, FaUser, FaSpinner, FaEnvelope,
  FaPhone, FaPencil, FaStar, FaBuilding, FaClock
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getMyApplications } from "@/lib/actions/jobs";

type Tab = "applications" | "saved" | "profile";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-blue-50 text-blue-700 border-blue-200",
  reviewed: "bg-purple-50 text-purple-700 border-purple-200",
  shortlisted: "bg-amber-50 text-amber-700 border-amber-200",
  interview: "bg-green-50 text-green-700 border-green-200",
  offered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  withdrawn: "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending Review",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  interview: "Interview Scheduled",
  offered: "Offer Received",
  rejected: "Not Selected",
  withdrawn: "Withdrawn",
};

export default function TeacherDashboard() {
  const { profile, loading, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("applications");
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== "teacher")) router.push("/");
  }, [loading, isAuthenticated, role, router]);

  useEffect(() => {
    const ids = localStorage.getItem("xyroots_watchlist");
    if (ids) {
      try { setSavedIds(JSON.parse(ids)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !profile) return;
    const load = async () => {
      setIsLoadingData(true);

      // Load teacher profile
      const { data: tp } = await supabase
        .from("teacher_profiles")
        .select("*")
        .eq("profile_id", profile.id)
        .single();
      if (tp) {
        setTeacherProfile(tp);
        setIsProfileVisible(tp.is_visible ?? true);
      }

      // Load real applications
      const appsResult = await getMyApplications();
      if (appsResult.success && appsResult.data) {
        setApplications(appsResult.data);
      }

      // Load saved jobs
      if (savedIds.length > 0) {
        const { data: sj } = await supabase
          .from("jobs")
          .select("*")
          .in("id", savedIds.slice(0, 20));
        if (sj) setSavedJobs(sj);
      }

      setIsLoadingData(false);
    };
    load();
  }, [isAuthenticated, profile]); // eslint-disable-line

  const avatar = profile?.avatar_url
    || `https://api.dicebear.com/7.x/initials/svg?seed=${(profile?.full_name || "X").replace(/\s+/g, "")}&chars=2`;

  const completionPct = teacherProfile?.profile_completion ?? 0;

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

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Clean white header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={avatar}
                  alt={profile?.full_name || "Teacher"}
                  className="w-16 h-16 object-cover border-2 border-gray-200"
                  style={{ borderRadius: "50%" }}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-xyroots-teal flex items-center justify-center" style={{ borderRadius: "50%" }}>
                  <FaCircleCheck className="w-2.5 h-2.5 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-xl font-bold text-gray-900">{profile?.full_name}</h1>
                  <span className="px-2 py-0.5 text-xs font-bold bg-xyroots-mint text-xyroots-teal border border-xyroots-teal/20" style={{ borderRadius: "0.5rem" }}>
                    Verified Educator
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-2">
                  {teacherProfile?.title || teacherProfile?.subject || "Teacher"}
                  {teacherProfile?.location ? ` · ${teacherProfile.location}` : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {teacherProfile?.qualification && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium" style={{ borderRadius: "0.5rem" }}>
                      <FaGraduationCap className="w-3 h-3" /> {teacherProfile.qualification}
                    </span>
                  )}
                  {teacherProfile?.experience_years !== null && teacherProfile?.experience_years !== undefined && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium" style={{ borderRadius: "0.5rem" }}>
                      <FaBriefcase className="w-3 h-3" /> {teacherProfile.experience_years} yrs exp.
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 shrink-0">
                <div className="text-center px-4 py-2 bg-gray-50 border border-gray-200" style={{ borderRadius: "0.75rem" }}>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                  <p className="text-xs text-gray-500 font-medium">Applied</p>
                </div>
                <div className="text-center px-4 py-2 bg-xyroots-mint border border-xyroots-teal/20" style={{ borderRadius: "0.75rem" }}>
                  <p className="text-2xl font-bold text-xyroots-teal">
                    {applications.filter(a => a.status === "interview" || a.status === "offered").length}
                  </p>
                  <p className="text-xs text-xyroots-teal font-medium">Active</p>
                </div>
                <div className="text-center px-4 py-2 bg-gray-50 border border-gray-200" style={{ borderRadius: "0.75rem" }}>
                  <p className="text-2xl font-bold text-gray-900">{savedIds.length}</p>
                  <p className="text-xs text-gray-500 font-medium">Saved</p>
                </div>
              </div>
            </div>

            {/* Profile Completion Bar */}
            {completionPct < 100 && (
              <div className="mt-5 bg-xyroots-mint/30 border border-xyroots-teal/20 p-4" style={{ borderRadius: "0.875rem" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">Profile Completion</span>
                  <span className="text-sm font-bold text-xyroots-teal">{completionPct}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200" style={{ borderRadius: "999px" }}>
                  <div className="h-full bg-xyroots-teal transition-all" style={{ width: `${completionPct}%`, borderRadius: "999px" }} />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Complete your profile to appear in more search results.{" "}
                  <button onClick={() => setShowEditModal(true)} className="text-xyroots-teal underline font-medium">Complete now →</button>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Continue Profile Banner */}
          <ContinueProfileButton />

          {/* Tabs */}
          <div className="flex gap-1 mt-6 mb-6 border-b border-gray-200">
            {([
              { id: "applications", label: `Applications (${applications.length})`, icon: FaBriefcase },
              { id: "saved", label: `Saved Jobs (${savedIds.length})`, icon: FaBookmark },
              { id: "profile", label: "My Profile", icon: FaUser },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all -mb-px ${
                  tab === t.id
                    ? "text-xyroots-teal border-b-2 border-xyroots-teal"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Applications Tab ── */}
          {tab === "applications" && (
            <div className="space-y-3">
              {applications.length === 0 ? (
                <div className="bg-white border border-gray-100 p-12 text-center" style={{ borderRadius: "1rem" }}>
                  <FaBriefcase className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No Applications Yet</h3>
                  <p className="text-gray-500 text-sm mb-5">Start applying to teaching vacancies to track your progress here.</p>
                  <Link href="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-xyroots-teal text-white text-sm font-semibold" style={{ borderRadius: "0.75rem" }}>
                    Browse Jobs <FaArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : applications.map((app: any) => {
                const job = app.jobs || {};
                return (
                  <div key={app.id} className="bg-white border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderRadius: "1rem" }}>
                    <div className="flex items-start gap-4">
                      <div
                        className="w-11 h-11 flex items-center justify-center text-lg font-bold shrink-0"
                        style={{
                          borderRadius: "0.75rem",
                          backgroundColor: "#e6f7ed",
                          color: "#00a264",
                        }}
                      >
                        {(job.school_name || job.title || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 mb-0.5">{job.title || "Untitled Position"}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
                          {job.school_name && <><FaBuilding className="w-3 h-3" /> {job.school_name}</>}
                          {job.location && <><FaLocationDot className="w-3 h-3 ml-1" /> {job.location}</>}
                        </p>
                        <div className="mt-2">
                          <span className={`text-xs font-bold px-2.5 py-1 border ${STATUS_STYLE[app.status] || STATUS_STYLE.pending}`} style={{ borderRadius: "0.5rem" }}>
                            {STATUS_LABEL[app.status] || app.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400 flex items-center gap-1 justify-end mb-1">
                        <FaClock className="w-3 h-3" />
                        {new Date(app.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      {(job.salary_min || job.salary_max) && (
                        <p className="text-sm font-bold text-gray-900">
                          {job.salary_min && `₹${(job.salary_min / 1000).toFixed(0)}k`}
                          {job.salary_min && job.salary_max && " – "}
                          {job.salary_max && `₹${(job.salary_max / 1000).toFixed(0)}k`}
                          <span className="text-gray-400 text-xs font-normal"> /mo</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Saved Jobs Tab ── */}
          {tab === "saved" && (
            <div className="space-y-3">
              {savedIds.length === 0 ? (
                <div className="bg-white border border-gray-100 p-12 text-center" style={{ borderRadius: "1rem" }}>
                  <FaBookmark className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No Saved Jobs</h3>
                  <p className="text-gray-500 text-sm mb-5">Save jobs while browsing to revisit and apply later.</p>
                  <Link href="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-xyroots-teal text-white text-sm font-semibold" style={{ borderRadius: "0.75rem" }}>
                    Find Jobs <FaArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : savedJobs.length === 0 ? (
                <div className="bg-white border border-gray-100 p-8 text-center" style={{ borderRadius: "1rem" }}>
                  <FaSpinner className="w-6 h-6 text-xyroots-teal animate-spin mx-auto" />
                </div>
              ) : savedJobs.map((job: any) => (
                <div key={job.id} className="bg-white border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-xyroots-teal/30 transition-colors" style={{ borderRadius: "1rem" }}>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {job.school_name && `${job.school_name} · `}
                      {job.board && `${job.board} · `}
                      {job.location || "India"}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.employment_type && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 font-medium" style={{ borderRadius: "0.375rem" }}>
                          {job.employment_type}
                        </span>
                      )}
                      {(job.salary_min || job.salary_max) && (
                        <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 font-medium" style={{ borderRadius: "0.375rem" }}>
                          ₹{job.salary_min ? `${(job.salary_min/1000).toFixed(0)}k` : "?"}–{job.salary_max ? `${(job.salary_max/1000).toFixed(0)}k` : "?"}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/jobs/${job.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${job.id}`}
                    className="px-5 py-2.5 text-sm font-semibold bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors shrink-0"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    Apply Now
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* ── Profile Tab ── */}
          {tab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Profile Card */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <div className="text-center mb-5">
                    <img
                      src={avatar}
                      alt={profile?.full_name || "Teacher"}
                      className="w-20 h-20 mx-auto object-cover mb-3"
                      style={{ borderRadius: "50%" }}
                    />
                    <h2 className="font-bold text-gray-900 text-lg">{profile?.full_name}</h2>
                    <p className="text-sm text-gray-500">{teacherProfile?.title || "Teacher"}</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    {profile?.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaEnvelope className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">{profile.email}</span>
                      </div>
                    )}
                    {profile?.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaPhone className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {teacherProfile?.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaLocationDot className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{teacherProfile.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Profile Visibility Toggle */}
                  <div className="mt-5 flex items-center justify-between p-3 bg-gray-50 border border-gray-100" style={{ borderRadius: "0.75rem" }}>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Profile Visible</p>
                      <p className="text-[11px] text-gray-400">Show your profile to employers</p>
                    </div>
                    <button
                      onClick={async () => {
                        const newVal = !isProfileVisible;
                        setIsProfileVisible(newVal);
                        await supabase
                          .from("teacher_profiles")
                          .update({ is_visible: newVal })
                          .eq("profile_id", profile?.id);
                      }}
                      className={`relative shrink-0 transition-colors ${isProfileVisible ? "bg-xyroots-teal" : "bg-gray-300"}`}
                      style={{ width: 40, height: 22, borderRadius: 999 }}
                    >
                      <div
                        className="absolute top-[3px] w-4 h-4 bg-white shadow transition-all"
                        style={{ borderRadius: "50%", left: isProfileVisible ? 20 : 3 }}
                      />
                    </button>
                  </div>

                  <button
                    onClick={() => setShowEditModal(true)}
                    className="w-full mt-3 py-2.5 text-sm font-semibold bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors flex items-center justify-center gap-2"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    <FaPencil className="w-3.5 h-3.5" /> Edit Profile
                  </button>

                  <Link
                    href="/profile"
                    className="block w-full mt-2 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-center"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    Account Settings
                  </Link>
                </div>

                {/* Skills */}
                {teacherProfile?.skills?.length > 0 && (
                  <div className="bg-white border border-gray-100 p-5" style={{ borderRadius: "1rem" }}>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {teacherProfile.skills.map((skill: string) => (
                        <span key={skill} className="text-xs px-2.5 py-1 bg-xyroots-mint text-xyroots-teal font-medium" style={{ borderRadius: "0.5rem" }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Detail Sections */}
              <div className="lg:col-span-2 space-y-4">
                {/* Professional Summary */}
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaStar className="w-4 h-4 text-xyroots-teal" /> Professional Summary
                  </h3>
                  {teacherProfile?.bio ? (
                    <p className="text-sm text-gray-700 leading-relaxed">{teacherProfile.bio}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No bio added yet. Click Edit Profile to add one.</p>
                  )}
                </div>

                {/* Teaching Info */}
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaGraduationCap className="w-4 h-4 text-xyroots-teal" /> Teaching Information
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Primary Subject", value: teacherProfile?.subject },
                      { label: "Qualification", value: teacherProfile?.qualification },
                      { label: "Teaching Qual.", value: teacherProfile?.professional_qualification },
                      { label: "Experience", value: teacherProfile?.experience_years != null ? `${teacherProfile.experience_years} years` : null },
                      { label: "Availability", value: teacherProfile?.availability },
                      { label: "Location", value: teacherProfile?.location },
                    ].filter(i => i.value).map(item => (
                      <div key={item.label}>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {!teacherProfile?.subject && !teacherProfile?.qualification && (
                    <p className="text-sm text-gray-400 italic">No teaching information added yet.</p>
                  )}
                </div>

                {/* Experience */}
                {teacherProfile?.experience_details?.length > 0 && (
                  <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaBriefcase className="w-4 h-4 text-xyroots-teal" /> Work Experience
                    </h3>
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

                {/* Education */}
                {teacherProfile?.education?.length > 0 && (
                  <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaGraduationCap className="w-4 h-4 text-xyroots-teal" /> Education
                    </h3>
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <OnboardingModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          role="teacher"
        />
      )}
    </div>
  );
}
