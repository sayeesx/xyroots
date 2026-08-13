"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";
import {
  FaUsers, FaRegFileLines, FaCalendar, FaCirclePlus, FaMagnifyingGlass, FaFilter, FaShieldHalved,
  FaStar, FaLocationDot, FaVideo, FaCircleCheck, FaChevronRight, FaXmark, FaWandMagicSparkles, FaGraduationCap, FaUser
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EmployerDashboard() {
  const { profile, loading, isAuthenticated, role } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"candidates" | "vacancies" | "pipeline" | "settings">("candidates");
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [dbTeachers, setDbTeachers] = useState<any[]>([]);
  const [dbJobs, setDbJobs] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== 'management')) {
      router.push('/');
    }
  }, [loading, isAuthenticated, role, router]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      
      // Fetch 10 recommended teachers
      const { data: tData } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          avatar_url,
          teacher_profiles (
            id, subject, title, location, experience_years, profile_completion, professional_qualification
          )
        `)
        .eq("role", "teacher")
        .limit(10);
        
      if (tData) setDbTeachers(tData);

      // Fetch own jobs
      if (profile?.id) {
        const { data: jData } = await supabase
          .from("jobs")
          .select("*")
          .eq("posted_by_profile_id", profile.id)
          .order("created_at", { ascending: false });
          
        if (jData) setDbJobs(jData);
      }
      
      setIsLoadingData(false);
    };
    
    if (isAuthenticated && profile) {
      fetchData();
    }
  }, [isAuthenticated, profile, supabase]);

  const filteredCandidates = dbTeachers.filter((t: any) => {
    const tp = t.teacher_profiles;
    if (!tp) return false;
    const s = searchTerm.toLowerCase();
    return (
      t.full_name?.toLowerCase().includes(s) ||
      tp.title?.toLowerCase().includes(s) ||
      tp.subject?.toLowerCase().includes(s) ||
      tp.location?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />

      <main className="flex-1 pt-16 lg:pt-20 pb-20">
        {loading || isLoadingData ? (
          <div className="flex h-64 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Institution Welcome Banner */}
            <div className="bg-gradient-to-br from-[#074526] to-[#042816] text-white rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_40px_rgb(0,0,0,0.12)] mb-8 relative overflow-hidden border border-white/10">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-xyroots-teal/30 rounded-full blur-[100px] pointer-events-none"
              /><div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-xyroots-yellow text-black font-bold text-xl flex items-center justify-center shadow-lg uppercase">
                    {profile?.full_name?.charAt(0) || "G"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="font-editorial text-2xl sm:text-3xl text-white">
                        {profile?.full_name || "Institution Name"}
                      </h1>
                      <span title="Verified School"><FaShieldHalved className="w-5 h-5 text-xyroots-yellow" /></span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {role === 'management' ? 'School / Institution' : 'SaaS Account'} • {profile?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowPostJobModal(true)}
                    className="px-5 py-3 rounded-xl font-semibold text-xs bg-xyroots-yellow text-black hover:bg-yellow-400 transition-all flex items-center gap-2 btn-hover"
                  >
                    <FaCirclePlus className="w-4 h-4" />
                    Post New Teaching Vacancy
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto gap-2 border-b border-xyroots-border pb-px mb-8 scrollbar-none">
              {[
                { id: "candidates", label: `Candidate Search (${dbTeachers.length})`, icon: FaUsers },
                { id: "vacancies", label: `Active Vacancies (${dbJobs.length})`, icon: FaRegFileLines },
                { id: "pipeline", label: "Hiring Pipeline", icon: FaCalendar },
                { id: "settings", label: "School Settings", icon: FaShieldHalved },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold rounded-t-2xl border-t border-x transition-all shrink-0 ${
                    activeTab === tab.id
                      ? "bg-white text-black border-xyroots-border shadow-sm -mb-px"
                      : "bg-transparent text-xyroots-muted border-transparent hover:text-black"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Candidates Tab */}
            {activeTab === "candidates" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-3 border border-xyroots-border shadow-sm flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-xyroots-muted" />
                    <input
                      type="text"
                      placeholder="Search candidate by subject, qualification or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-xyroots-cream/60 rounded-xl border-0 outline-none focus:ring-2 focus:ring-xyroots-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCandidates.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500">No candidates match your search.</div>
                  ) : filteredCandidates.map((teacher: any) => {
                    const tp = teacher.teacher_profiles;
                    return (
                      <div key={teacher.id} className="bg-white rounded-2xl p-5 border border-xyroots-border hover:border-xyroots-teal/40 transition-all group flex flex-col">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                            {teacher.avatar_url ? (
                               <img src={teacher.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                               <FaUser className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <Link href={`/teachers/${(teacher.full_name || "teacher").toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${teacher.id}`} className="px-3 py-1.5 text-[11px] font-bold rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200">
                             View Profile
                          </Link>
                        </div>
                        
                        <div className="mb-4 text-left border-b border-gray-100 pb-4">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{teacher.full_name}</h3>
                          <p className="text-[13px] text-gray-600 font-medium line-clamp-1">{tp.title || tp.subject || "Teacher"}</p>
                          <p className="text-[12px] text-gray-400 line-clamp-1 mt-0.5"><FaLocationDot className="w-3 h-3 inline mr-1" />{tp.location || 'India'}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-left mb-2">
                          <span className="px-2 py-1 bg-[#f4f6f8] text-[#4d5c6f] text-[11px] font-semibold rounded"><FaGraduationCap className="w-3 h-3 inline mr-1" />{tp.professional_qualification || 'B.Ed'}</span>
                          <span className="px-2 py-1 bg-[#f4f6f8] text-[#4d5c6f] text-[11px] font-semibold rounded">{tp.experience_years ? tp.experience_years + ' Years' : 'Fresher'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Vacancies Tab */}
            {activeTab === "vacancies" && (
              <div className="bg-white rounded-3xl p-6 border border-xyroots-border shadow-sm space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-black">Active Job Listings</h2>
                  <button
                    onClick={() => setShowPostJobModal(true)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-xyroots-yellow text-black hover:bg-yellow-400"
                  >
                    + Post Vacancy
                  </button>
                </div>

                {dbJobs.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <p className="text-gray-500 mb-2">You haven't posted any jobs yet.</p>
                    <button onClick={() => setShowPostJobModal(true)} className="text-blue-600 font-semibold hover:underline">Create your first vacancy</button>
                  </div>
                ) : dbJobs.map((job: any) => (
                  <div key={job.id} className="p-4 rounded-2xl border border-xyroots-border bg-xyroots-cream/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-black">{job.title}</h3>
                      <p className="text-xs text-xyroots-muted">{job.board || 'Any Board'} • {job.location || 'India'} • Posted {new Date(job.created_at).toLocaleDateString()}</p>
                    </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-xyroots-teal bg-white px-3 py-1 rounded-lg border border-xyroots-border">
                          0 Applicants
                        </span>
                        <Link
                          href={`/jobs/${(job.title || "job").toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${job.id}`}
                          className="px-4 py-2 text-xs font-semibold rounded-xl border border-xyroots-border hover:border-xyroots-teal text-black"
                        >
                          Manage Vacancy
                        </Link>
                      </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pipeline & Settings omitted for brevity, keeping default */}
            {activeTab === "pipeline" && (
              <div className="bg-white rounded-3xl p-6 border border-xyroots-border shadow-sm">
                <h2 className="text-lg font-bold text-black mb-6">Candidate Hiring Pipeline</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border">
                    <p className="text-xs font-bold uppercase text-gray-500 mb-1">New Applications</p>
                    <p className="text-2xl font-bold text-black">0</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
                    <p className="text-xs font-bold uppercase text-yellow-700 mb-1">Shortlisted</p>
                    <p className="text-2xl font-bold text-yellow-800">0</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                    <p className="text-xs font-bold uppercase text-purple-700 mb-1">Interviews</p>
                    <p className="text-2xl font-bold text-purple-800">0</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
                    <p className="text-xs font-bold uppercase text-green-700 mb-1">Hired</p>
                    <p className="text-2xl font-bold text-green-800">0</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "settings" && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-xyroots-border shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-black">Account Profile Settings</h2>
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="text-xs font-bold text-black block mb-1">Name / Institution</label>
                    <input type="text" defaultValue={profile?.full_name || ""} className="w-full p-3 text-sm bg-xyroots-cream rounded-xl border border-xyroots-border" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-black block mb-1">Contact Email</label>
                    <input type="text" defaultValue={profile?.email || ""} className="w-full p-3 text-sm bg-gray-100 rounded-xl border border-gray-200" disabled />
                  </div>
                  <button className="px-6 py-3 text-xs font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-xyroots-dark">
                    Save Updates
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      
      {/* Post Job Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-modal-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-black">Post a Teaching Vacancy</h2>
                <p className="text-sm text-gray-500 mt-1">Fill in the details to find the best educators.</p>
              </div>
              <button 
                onClick={() => setShowPostJobModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Close"
              >
                <FaXmark className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wide">Job Title *</label>
                <input type="text" placeholder="e.g. Senior Post Graduate Biology Teacher" className="w-full p-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-xyroots-teal outline-none transition-all" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wide">Subject *</label>
                  <select className="w-full p-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-xyroots-teal outline-none transition-all">
                    <option>Select subject</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Biology</option>
                    <option>Chemistry</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wide">Employment Type</label>
                  <select className="w-full p-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-xyroots-teal outline-none transition-all">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wide">Minimum Qualifications</label>
                <input type="text" placeholder="e.g. B.Ed, M.Sc" className="w-full p-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-xyroots-teal outline-none transition-all" />
              </div>

              <div className="pt-4 flex gap-3">
                <button onClick={() => setShowPostJobModal(false)} className="px-6 py-3.5 text-sm font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1">
                  Cancel
                </button>
                <button onClick={() => setShowPostJobModal(false)} className="px-6 py-3.5 text-sm font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-[#068050] transition-colors flex-[2] flex justify-center items-center gap-2">
                  <FaCircleCheck className="w-4 h-4" /> Post Vacancy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      </main>
      <Footer />
    </div>
  );
}
