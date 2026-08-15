"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  FaLocationDot, FaShieldHalved, FaBuilding, FaBriefcase, FaArrowLeft,
  FaGlobe, FaPhone, FaEnvelope, FaCalendarDays, FaUsers, FaGraduationCap,
  FaCircleXmark, FaArrowRight, FaSpinner, FaLock
} from "react-icons/fa6";

export default function InstitutionDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, loading: authLoading, openSignIn, openTeacherRegistration } = useAuth();
  const supabase = createClient();

  const [institution, setInstitution] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from("institutions").select("*").eq("id", id).single(),
      supabase.from("jobs").select("id, title, subject, level, status, created_at, qualification, experience_min, experience_max, salary_min, salary_max, location, employment_type, description").eq("institution_id", id).order("created_at", { ascending: false }),
    ]).then(([{ data: inst, error }, { data: jobsData }]) => {
      if (error || !inst) { setNotFound(true); }
      else { setInstitution(inst); setJobs(jobsData || []); }
      setPageLoading(false);
    });
  }, [id]); // eslint-disable-line

  if (pageLoading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <FaSpinner className="w-8 h-8 text-[#00a264] animate-spin" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <FaBuilding className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Institution Not Found</h2>
            <p className="text-gray-500 text-sm mb-6">This institution may not exist or has been removed.</p>
            <Link href="/institutions" className="px-5 py-2.5 bg-[#00a264] text-white font-semibold rounded-xl text-sm hover:bg-[#007a4d] transition-colors">
              Browse Institutions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-[#e6f7ed] flex items-center justify-center mx-auto mb-6">
              <FaLock className="w-7 h-7 text-[#00a264]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign in to view institution details</h2>
            <p className="text-gray-500 text-base mb-8 leading-relaxed">
              View open positions and full details of this institution.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => openSignIn()} className="px-8 py-3 bg-[#00a264] text-white font-semibold rounded-xl hover:bg-[#007a4d] transition-colors">
                Sign In
              </button>
              <button onClick={() => openTeacherRegistration()} className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors">
                Register Free
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeJobs = jobs.filter(j => j.status === "published");
  const inactiveJobs = jobs.filter(j => j.status !== "published");

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />

      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back */}
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-5 transition-colors">
            <FaArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          {/* Institution Header Card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #fff 70%)" }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#00a264] flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {(institution.name || "I").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h1 className="text-2xl font-bold text-gray-900">{institution.name}</h1>
                      {institution.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 bg-[#e6f7ed] text-[#00a264] rounded-full">
                          <FaShieldHalved className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                      {institution.location && (
                        <span className="flex items-center gap-1">
                          <FaLocationDot className="w-3.5 h-3.5 text-[#00a264]" />
                          {institution.location}
                        </span>
                      )}
                      {institution.type && (
                        <span className="flex items-center gap-1">
                          <FaBuilding className="w-3 h-3 text-gray-400" />
                          {institution.type}
                        </span>
                      )}
                      {institution.established && (
                        <span className="flex items-center gap-1">
                          <FaCalendarDays className="w-3 h-3 text-gray-400" />
                          Est. {institution.established}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-[#e6f7ed] text-[#00a264] text-sm font-bold rounded-lg">
                    {activeJobs.length} Open {activeJobs.length === 1 ? "Position" : "Positions"}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {institution.description && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <p className="text-sm text-gray-600 leading-relaxed">{institution.description}</p>
                </div>
              )}
              {institution.website && (
                <div className="flex items-center gap-2 text-sm">
                  <FaGlobe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-[#00a264] hover:underline truncate">{institution.website}</a>
                </div>
              )}
              {institution.contact_email && (
                <div className="flex items-center gap-2 text-sm">
                  <FaEnvelope className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-600 truncate">{institution.contact_email}</span>
                </div>
              )}
              {institution.contact_phone && (
                <div className="flex items-center gap-2 text-sm">
                  <FaPhone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-600">{institution.contact_phone}</span>
                </div>
              )}
              {institution.board?.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <FaGraduationCap className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {institution.board.map((b: string) => (
                      <span key={b} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded">{b}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Jobs */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FaBriefcase className="w-4 h-4 text-[#00a264]" />
              Open Positions
              {activeJobs.length > 0 && <span className="text-sm font-normal text-gray-500">({activeJobs.length})</span>}
            </h2>

            {activeJobs.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center">
                <FaBriefcase className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No open positions at this institution right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeJobs.map(job => (
                  <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#00a264]/50 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-base font-bold text-gray-900">{job.title}</h3>
                          {job.employment_type && (
                            <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-600 font-semibold rounded">{job.employment_type}</span>
                          )}
                          {job.subject && (
                            <span className="text-[11px] px-2 py-0.5 bg-[#e6f7ed] text-[#00a264] font-semibold rounded">{job.subject}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                          {job.location && <span className="flex items-center gap-1"><FaLocationDot className="w-2.5 h-2.5 text-[#00a264]" />{job.location}</span>}
                          {job.experience_min != null && <span>{job.experience_min}–{job.experience_max ?? "?"} yrs exp</span>}
                          {job.salary_min && <span className="text-[#00a264] font-semibold">₹{(job.salary_min/1000).toFixed(0)}k–{(job.salary_max/1000).toFixed(0)}k/mo</span>}
                          <span>Posted {new Date(job.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                        {job.description && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{job.description}</p>}
                      </div>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="px-4 py-2 bg-[#00a264] text-white text-sm font-bold rounded-lg hover:bg-[#007a4d] transition-colors shrink-0 flex items-center gap-1.5"
                      >
                        Apply Now <FaArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inactive / Closed Jobs */}
          {inactiveJobs.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-gray-500 mb-3 flex items-center gap-2">
                <FaCircleXmark className="w-4 h-4 text-gray-400" />
                Closed / Past Positions
                <span className="text-sm font-normal">({inactiveJobs.length})</span>
              </h2>
              <div className="space-y-3">
                {inactiveJobs.map(job => (
                  <div key={job.id} className="relative bg-white border border-gray-100 rounded-xl p-4 opacity-60 overflow-hidden pointer-events-none select-none">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <span className="text-gray-300 font-bold text-xl rotate-[-20deg] tracking-widest uppercase opacity-40 select-none">
                        No Longer Available
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-base font-bold text-gray-500 line-through">{job.title}</h3>
                          <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-400 font-semibold rounded">
                            {job.status === "closed" ? "Closed" : job.status === "archived" ? "Archived" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                          {job.location && <span className="flex items-center gap-1"><FaLocationDot className="w-2.5 h-2.5" />{job.location}</span>}
                          {job.subject && <span>{job.subject}</span>}
                          <span>Posted {new Date(job.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                      </div>
                      <span className="px-4 py-2 bg-gray-100 text-gray-400 text-sm font-bold rounded-lg cursor-not-allowed shrink-0">
                        Closed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
