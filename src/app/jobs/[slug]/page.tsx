"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import {
  FaShieldHalved, FaLocationDot, FaClock, FaBookmark, FaRegBookmark,
  FaShareNodes, FaCircleCheck, FaBuilding, FaWandMagicSparkles,
  FaArrowLeft, FaIndianRupeeSign, FaGraduationCap, FaBriefcase, FaCalendarDays
} from "react-icons/fa6";
import { createClient } from "@/lib/supabase/client";
import { formatSalary } from "@/lib/utils";
import { jobs } from "@/data/jobs";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { user } = useAuth();

  const [dbJob, setDbJob] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const supabase = createClient();

  const actualId = slug?.includes('-') && slug.length > 36 ? slug.split('-').pop() : slug;
  const fallbackJob = jobs.find((j) => j.id === actualId || j.slug === slug) || jobs[0];

  useEffect(() => {
    if (!actualId) return;
    supabase.from('jobs').select('*, institutions(verified)').eq('id', actualId).single().then(({ data }: any) => {
      if (data) {
        setDbJob({
          ...data,
          slug,
          school: data.school_name || "Unknown School",
          schoolVerified: data.institutions?.verified || false,
          location: data.location || "Remote",
          board: data.board,
          salaryMin: data.salary_min,
          salaryMax: data.salary_max,
          experienceMin: data.experience_min,
          experienceMax: data.experience_max,
          qualification: data.qualification,
          professionalQualification: data.professional_qualification,
          subject: data.subject,
          employmentType: data.employment_type || "Full-time",
          level: data.level,
          description: data.description,
          responsibilities: data.responsibilities || [],
          requirements: data.requirements || [],
          benefits: data.benefits || [],
          postedDate: new Date(data.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        });
      }
      setPageLoading(false);
    });
  }, [actualId, slug]);

  const job = dbJob || fallbackJob;

  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />

      <main className="flex-1 pt-14 lg:pt-16 pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-xyroots-teal mb-5 mt-4 transition-colors group"
          >
            <FaArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            Back to Vacancies
          </button>

          {/* Hero Header Card */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-6 sm:p-8 mb-5">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] font-bold px-3 py-1 bg-xyroots-mint text-xyroots-teal rounded-full uppercase tracking-wider">
                {job.board || 'CBSE'} Board
              </span>
              {job.level && <span className="text-[11px] font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{job.level}</span>}
              <span className="text-[11px] font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{job.employmentType}</span>
              <span className="ml-auto text-[11px] text-gray-400 font-medium flex items-center gap-1">
                <FaCalendarDays className="w-3 h-3" /> Posted {job.postedDate}
              </span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-tight mb-4">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <FaBuilding className="w-3.5 h-3.5 text-xyroots-teal shrink-0" />
                <span className="font-semibold text-gray-800">{job.school}</span>
                {job.schoolVerified && <FaShieldHalved className="w-3.5 h-3.5 text-xyroots-teal" title="Verified" />}
              </div>
              <div className="flex items-center gap-1.5">
                <FaLocationDot className="w-3.5 h-3.5 shrink-0" />
                {job.location}
              </div>
              {job.deadline && (
                <div className="flex items-center gap-1.5">
                  <FaClock className="w-3.5 h-3.5 shrink-0" />
                  Deadline: {job.deadline}
                </div>
              )}
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              <div className="bg-gray-50 rounded-2xl p-3.5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Monthly Salary</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-0.5">
                  <FaIndianRupeeSign className="w-3 h-3" />
                  {job.salaryMin && job.salaryMax ? `${(job.salaryMin/1000).toFixed(0)}k – ${(job.salaryMax/1000).toFixed(0)}k` : formatSalary(job.salaryMin, job.salaryMax)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-3.5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Experience</p>
                <p className="text-sm font-bold text-gray-900">{job.experienceMin ?? 0}–{job.experienceMax ?? 5} Years</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-3.5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Qualification</p>
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{job.qualification || 'B.Ed'}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-3.5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Subject</p>
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{job.subject || 'General'}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-5">
              {/* About the Role */}
              {job.description && (
                <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 sm:p-8">
                  <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-xyroots-mint flex items-center justify-center">
                      <FaBuilding className="w-3 h-3 text-xyroots-teal" />
                    </span>
                    About the Role
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities?.length > 0 && (
                <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 sm:p-8">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center">
                      <FaBriefcase className="w-3 h-3 text-blue-600" />
                    </span>
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((resp: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <FaCircleCheck className="w-4 h-4 text-xyroots-teal shrink-0 mt-0.5" />
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements?.length > 0 && (
                <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 sm:p-8">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-purple-50 flex items-center justify-center">
                      <FaGraduationCap className="w-3 h-3 text-purple-600" />
                    </span>
                    Requirements & Qualifications
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <FaCircleCheck className="w-4 h-4 text-xyroots-teal shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits?.length > 0 && (
                <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 sm:p-8">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-yellow-50 flex items-center justify-center">
                      <FaWandMagicSparkles className="w-3 h-3 text-yellow-500" />
                    </span>
                    Perks & Benefits
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {job.benefits.map((b: string, i: number) => (
                      <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-xyroots-mint/50 text-sm text-xyroots-teal font-medium border border-xyroots-teal/10">
                        <FaCircleCheck className="w-3.5 h-3.5 shrink-0" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* Apply Card — sticky on desktop */}
              <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 lg:sticky lg:top-24">
                {/* Match Score */}
                {job.matchPercentage && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-xyroots-mint to-green-50 rounded-xl mb-5 border border-xyroots-teal/10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-xyroots-teal rounded-lg flex items-center justify-center">
                        <FaWandMagicSparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-xyroots-teal uppercase tracking-wider">AI Match</p>
                        <p className="text-xl font-bold text-gray-900">{job.matchPercentage}%</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">High Fit</span>
                  </div>
                )}

                <div className="space-y-2.5 mb-5">
                  <button
                    onClick={() => setApplied(true)}
                    disabled={applied}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      applied
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-xyroots-teal text-white hover:bg-[#068050] shadow-[0_4px_12px_rgba(0,162,100,0.3)]"
                    }`}
                  >
                    {applied ? "Application Submitted ✓" : "Apply Now"}
                  </button>

                  <button
                    onClick={() => setSaved(!saved)}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-sm border transition-all flex items-center justify-center gap-2 ${
                      saved
                        ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                        : "border-gray-200 text-gray-700 hover:border-xyroots-teal hover:text-xyroots-teal bg-gray-50"
                    }`}
                  >
                    {saved ? <FaBookmark className="w-4 h-4 text-yellow-500" /> : <FaRegBookmark className="w-4 h-4" />}
                    {saved ? "Saved" : "Save to Watchlist"}
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="w-full py-3 px-6 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <FaShareNodes className="w-3.5 h-3.5" />
                    Share
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-2">
                  {job.applicants && (
                    <p className="flex justify-between">
                      <span>Applicants</span>
                      <span className="font-bold text-gray-800">{job.applicants} applied</span>
                    </p>
                  )}
                  <p className="flex justify-between">
                    <span>Posted</span>
                    <span className="font-medium text-gray-800">{job.postedDate}</span>
                  </p>
                </div>
              </div>

              {/* School Card */}
              <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">About the Institution</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-xyroots-mint flex items-center justify-center font-bold text-xyroots-teal text-sm border border-xyroots-teal/10">
                    {(job.school || 'S').charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                      {job.school}
                      {job.schoolVerified && <FaShieldHalved className="w-3.5 h-3.5 text-xyroots-teal" />}
                    </p>
                    <p className="text-xs text-gray-500">{job.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Mobile Apply Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg lg:hidden z-40 flex items-center justify-between gap-3">
        <div>
          {job.salaryMin && <p className="text-xs font-bold text-xyroots-teal">₹{(job.salaryMin/1000).toFixed(0)}k–{(job.salaryMax/1000).toFixed(0)}k/mo</p>}
          <p className="text-[10px] text-gray-400">{job.location}</p>
        </div>
        <button
          onClick={() => setApplied(true)}
          disabled={applied}
          className={`flex-1 max-w-[200px] py-3 px-6 rounded-xl font-bold text-sm transition-all ${
            applied ? "bg-green-100 text-green-700" : "bg-xyroots-teal text-white shadow-[0_4px_12px_rgba(0,162,100,0.3)]"
          }`}
        >
          {applied ? "Applied ✓" : "Apply Now"}
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share this Vacancy</h3>
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 font-mono break-all mb-4">
              {typeof window !== 'undefined' ? window.location.href : ''}
            </div>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); setShowShareModal(false); }}
              className="w-full py-3 rounded-xl bg-xyroots-teal text-white font-bold text-sm hover:bg-[#068050] transition-colors"
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
