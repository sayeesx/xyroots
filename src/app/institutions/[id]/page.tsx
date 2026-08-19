"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { schools } from "@/data/schools";
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

    // First try the static schools data (numeric IDs from the directory page)
    const staticSchool = schools.find(s => s.id === id || s.slug === id);
    if (staticSchool) {
      setInstitution({
        id: staticSchool.id,
        name: staticSchool.name,
        type: staticSchool.type,
        location: staticSchool.location,
        established: staticSchool.established,
        board: staticSchool.board,
        verified: staticSchool.verified,
        description: staticSchool.description,
        website: null,
        contact_email: null,
        contact_phone: null,
      });
      setJobs([]);
      setPageLoading(false);
      return;
    }

    // Fall back to Supabase for real institution UUIDs
    supabase.from("institutions").select("*").eq("id", id).single()
      .then(async ({ data: inst, error }) => {
        if (error || !inst) { setNotFound(true); setPageLoading(false); return; }
        setInstitution(inst);

        // Query jobs by institution_id OR by the profile who owns this institution
        const [{ data: byInstId }, { data: byProfile }] = await Promise.all([
          supabase.from("jobs")
            .select("id, title, subject, level, status, created_at, qualification, experience_min, experience_max, salary_min, salary_max, location, employment_type, description")
            .eq("institution_id", id)
            .order("created_at", { ascending: false }),
          (inst as any).created_by_profile_id
            ? supabase.from("jobs")
                .select("id, title, subject, level, status, created_at, qualification, experience_min, experience_max, salary_min, salary_max, location, employment_type, description")
                .eq("posted_by_profile_id", (inst as any).created_by_profile_id)
                .order("created_at", { ascending: false })
            : Promise.resolve({ data: [] }),
        ]);

        // Merge and deduplicate by job id
        const allJobs = [...(byInstId || []), ...(byProfile || [])];
        const seen = new Set<string>();
        const merged = allJobs.filter((j: any) => {
          if (seen.has(j.id)) return false;
          seen.add(j.id);
          return true;
        });
        setJobs(merged);
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
    <div className="min-h-screen flex flex-col bg-[#f8faf9]">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* ─── Glassdoor / Indeed Clean White Header Card ───────────────────── */}
        <section className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg mb-4 transition-all"
            >
              <FaArrowLeft className="w-3 h-3" /> Back
            </button>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center font-bold text-2xl text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  {(institution.name || "I").charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {institution.verified && (
                      <span className="px-2.5 py-0.5 text-xs font-bold bg-[#e6f7ed] text-[#00a264] rounded-md border border-[#00a264]/20 flex items-center gap-1">
                        <FaShieldHalved className="w-3.5 h-3.5" /> Verified Institution
                      </span>
                    )}
                    {institution.type && (
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-md">
                        {institution.type}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                    {institution.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    {institution.location && (
                      <span className="flex items-center gap-1.5 font-bold text-gray-900">
                        <FaLocationDot className="w-3.5 h-3.5 text-[#00a264]" /> {institution.location}
                      </span>
                    )}
                    {institution.established && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1.5">
                          <FaCalendarDays className="w-3.5 h-3.5 text-gray-400" /> Est. {institution.established}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 pt-1">
                <div className="px-5 py-2.5 bg-[#e6f7ed] border border-[#00a264]/30 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-[#00a264] uppercase tracking-wider">Hiring Status</p>
                  <p className="text-base font-extrabold text-gray-900 mt-0.5">
                    {activeJobs.length} Open {activeJobs.length === 1 ? "Role" : "Roles"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Main Content ─────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Institution Bio */}
              {institution.description && (
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2.5">
                    <span className="w-2 h-6 bg-[#00a264] rounded-full" />
                    About Institution
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{institution.description}</p>
                </div>
              )}

              {/* Active Jobs */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                  <span className="w-2 h-6 bg-emerald-600 rounded-full" />
                  <FaBriefcase className="w-4 h-4 text-[#00a264]" />
                  Active Vacancies
                  {activeJobs.length > 0 && <span className="text-xs font-bold text-gray-400">({activeJobs.length})</span>}
                </h2>

                {activeJobs.length === 0 ? (
                  <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <FaBriefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-600">No active job openings right now.</p>
                    <p className="text-xs text-gray-400 mt-1">Check back later for new teaching opportunities.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeJobs.map(job => (
                      <div
                        key={job.id}
                        className="bg-white border border-gray-200/80 rounded-xl p-5 hover:border-[#00a264] hover:shadow-md transition-all group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-bold text-gray-900 group-hover:text-[#00a264] transition-colors truncate">
                                {job.title}
                              </h3>
                              {job.employment_type && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full uppercase tracking-wider">
                                  {job.employment_type}
                                </span>
                              )}
                              {job.subject && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#e6f7ed] text-[#00a264] rounded-full uppercase tracking-wider">
                                  {job.subject}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                              {job.location && (
                                <span className="flex items-center gap-1">
                                  <FaLocationDot className="w-3 h-3 text-[#00a264]" /> {job.location}
                                </span>
                              )}
                              {job.experience_min != null && (
                                <span>{job.experience_min}–{job.experience_max ?? 5} Yrs Exp</span>
                              )}
                              {job.salary_min && (
                                <span className="text-[#00a264] font-extrabold">
                                  ₹{(job.salary_min / 1000).toFixed(0)}k–{(job.salary_max / 1000).toFixed(0)}k/mo
                                </span>
                              )}
                            </div>
                          </div>

                          <Link
                            href={`/jobs/${job.id}`}
                            className="px-5 py-2.5 bg-[#00a264] hover:bg-[#007a4d] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
                          >
                            View Job <FaArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past / Closed Jobs */}
              {inactiveJobs.length > 0 && (
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-sm opacity-80">
                  <h2 className="text-base font-bold text-gray-500 mb-4 flex items-center gap-2">
                    <FaCircleXmark className="w-4 h-4 text-gray-400" />
                    Past / Closed Positions ({inactiveJobs.length})
                  </h2>
                  <div className="space-y-3">
                    {inactiveJobs.map(job => (
                      <div key={job.id} className="p-4 bg-gray-50 border border-gray-200/60 rounded-xl flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-gray-600 line-through">{job.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{job.location} • Posted {new Date(job.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                        </div>
                        <span className="text-xs font-bold text-gray-400 bg-gray-200 px-3 py-1 rounded-full uppercase tracking-wider">
                          Closed
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar: Contact & Info */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-md lg:sticky lg:top-24">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-3 border-b border-gray-100">
                  Institution Info
                </h3>

                <div className="space-y-4 text-xs sm:text-sm">
                  {institution.board?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Curriculum Boards</p>
                      <div className="flex flex-wrap gap-1.5">
                        {institution.board.map((b: string) => (
                          <span key={b} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-100">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {institution.website && (
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                        <FaGlobe className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Official Website</p>
                        <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#00a264] hover:underline truncate block">
                          {institution.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {institution.contact_email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                        <FaEnvelope className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Contact Email</p>
                        <p className="text-xs font-bold text-gray-800 truncate">{institution.contact_email}</p>
                      </div>
                    </div>
                  )}

                  {institution.contact_phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                        <FaPhone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</p>
                        <p className="text-xs font-bold text-gray-800">{institution.contact_phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
