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
  FaBuilding, FaChartBar, FaGear, FaArrowRight, FaPencil
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Tab = "candidates" | "vacancies" | "pipeline" | "settings";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-blue-50 text-blue-700",
  reviewed: "bg-purple-50 text-purple-700",
  shortlisted: "bg-amber-50 text-amber-700",
  interview: "bg-green-50 text-green-700",
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
  const supabase = createClient();

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== "management")) router.push("/");
  }, [loading, isAuthenticated, role, router]);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !profile) return;
    setIsLoadingData(true);

    const { data: jData } = await supabase
      .from("jobs")
      .select("*")
      .eq("posted_by_profile_id", profile.id)
      .order("created_at", { ascending: false });
    if (jData) setJobs(jData);

    // Fetch applicants for this employer's jobs only
    if (jData && jData.length > 0) {
      const jobIds = jData.map((j: any) => j.id);
      const { data: appData } = await supabase
        .from("applications")
        .select(`
          id, status, created_at, job_id,
          jobs(title, location, school_name),
          profiles!applicant_profile_id(id, full_name, avatar_url,
            teacher_profiles(title, subject, location, experience_years, professional_qualification)
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 bg-xyroots-yellow text-xyroots-dark font-bold text-xl flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ borderRadius: "0.875rem" }}
                >
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                    : initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h1 className="text-lg font-bold text-gray-900">{profile?.full_name}</h1>
                    <FaShieldHalved className="w-4 h-4 text-xyroots-teal" title="Verified Institution" />
                  </div>
                  <p className="text-sm text-gray-500">School / Institution · {profile?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPostJob(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-xyroots-teal text-white text-sm font-bold hover:bg-xyroots-dark transition-colors self-start sm:self-auto"
                style={{ borderRadius: "0.875rem" }}
              >
                <FaCirclePlus className="w-4 h-4" /> Post New Vacancy
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { label: "Total Posted", value: jobs.length, color: "text-gray-900" },
                { label: "Live Now", value: publishedJobs.length, color: "text-xyroots-teal" },
                { label: "Applicants", value: applications.length, color: "text-gray-900" },
                { label: "Shortlisted", value: applications.filter((a: any) => a.status === "shortlisted" || a.status === "interview").length, color: "text-xyroots-teal" },
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
              { id: "settings", label: "Settings", icon: FaGear },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all -mb-px shrink-0 ${
                  tab === t.id
                    ? "text-xyroots-teal border-b-2 border-xyroots-teal"
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
                return (
                  <div key={app.id} className="bg-white border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderRadius: "1rem" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-xyroots-mint flex items-center justify-center text-xyroots-teal font-bold text-sm shrink-0 overflow-hidden" style={{ borderRadius: "50%" }}>
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
                      {p?.id && (
                        <Link
                          href={`/teachers/${p.id}`}
                          className="px-3 py-1.5 text-xs font-bold border border-gray-200 text-gray-700 hover:border-xyroots-teal hover:text-xyroots-teal transition-colors"
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
                <button onClick={() => setShowPostJob(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors" style={{ borderRadius: "0.75rem" }}>
                  <FaCirclePlus className="w-4 h-4" /> New Vacancy
                </button>
              </div>
              {jobs.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 p-12 text-center" style={{ borderRadius: "1rem" }}>
                  <FaBuilding className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No Vacancies Posted</h3>
                  <p className="text-gray-500 text-sm mb-4">Post your first teaching vacancy to start receiving applications.</p>
                  <button onClick={() => setShowPostJob(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-xyroots-teal text-white text-sm font-semibold" style={{ borderRadius: "0.75rem" }}>
                    Post First Vacancy <FaArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : jobs.map(job => (
                <div key={job.id} className="bg-white border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderRadius: "1rem" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-gray-900">{job.title}</h3>
                      <span className={`text-xs px-2 py-0.5 font-bold ${
                        job.status === "published" ? "bg-green-50 text-green-700" :
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
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-gray-200 text-gray-700 hover:border-xyroots-teal hover:text-xyroots-teal transition-colors shrink-0"
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
                  { label: "Offered / Hired", count: applications.filter((a: any) => a.status === "offered").length, color: "bg-green-50 text-green-700 border-green-100" },
                ].map(stage => (
                  <div key={stage.label} className={`p-5 border ${stage.color}`} style={{ borderRadius: "0.875rem" }}>
                    <p className="text-2xl font-bold mb-1">{stage.count}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-75">{stage.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {tab === "settings" && (
            <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
              <h2 className="text-lg font-bold text-gray-900 mb-5">Institution Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Contact Name</label>
                  <input defaultValue={profile?.full_name || ""} className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-xyroots-teal" style={{ borderRadius: "0.75rem" }} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Email Address</label>
                  <input defaultValue={profile?.email || ""} disabled className="w-full px-4 py-2.5 text-sm bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed outline-none" style={{ borderRadius: "0.75rem" }} />
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button className="px-5 py-2.5 text-sm font-semibold bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors" style={{ borderRadius: "0.75rem" }}>Save Changes</button>
                <Link href="/profile" className="px-5 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors" style={{ borderRadius: "0.75rem" }}>Account Settings</Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <PostJobModal isOpen={showPostJob} onClose={() => setShowPostJob(false)} onSuccess={fetchData} />
      <EditJobModal isOpen={!!editingJob} onClose={() => setEditingJob(null)} job={editingJob} onSuccess={fetchData} />
    </div>
  );
}
