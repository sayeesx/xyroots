"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";
import {
  FaRegFileLines, FaCalendar, FaShieldHalved, FaLocationDot, FaCircleCheck, FaStar, FaBriefcase, FaBookmark, FaGear
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FaUser } from "react-icons/fa6";

export default function TeacherDashboard() {
  const { profile, loading, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"applications" | "saved" | "profile">("applications");
  const [dbJobs, setDbJobs] = useState<any[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('xyroots_watchlist');
    if (s) {
      try {
        setSavedJobIds(JSON.parse(s));
      } catch (e) {}
    }
  }, []);

  const supabase = createClient();

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== 'teacher')) {
      router.push('/');
    }
  }, [loading, isAuthenticated, role, router]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      
      // Fetch 10 recommended jobs for now (we can join with saved jobs later)
      const { data: jData } = await supabase
        .from("jobs")
        .select("*")
        .limit(10);
        
      if (jData) setDbJobs(jData);

      // Fetch teacher specific profile details
      if (profile?.id) {
        const { data: tData } = await supabase
          .from("teacher_profiles")
          .select("*")
          .eq("profile_id", profile.id)
          .single();
          
        if (tData) setTeacherProfile(tData);
      }
      
      setIsLoadingData(false);
    };
    
    if (isAuthenticated && profile) {
      fetchData();
    }
  }, [isAuthenticated, profile, supabase]);

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
            
            {/* Teacher Welcome Banner */}
            <div className="bg-gradient-to-br from-[#0a1e3f] to-[#040e1c] text-white rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_40px_rgb(0,0,0,0.12)] mb-8 relative overflow-hidden border border-white/10">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] pointer-events-none"
              /><div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white text-blue-900 font-bold text-xl flex items-center justify-center shadow-lg uppercase relative overflow-hidden">
                     {profile?.avatar_url ? (
                         <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                         <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name?.replace(/\s+/g, '') || 'x'}&chars=2`} alt="Profile" className="w-full h-full object-cover" />
                     )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
                        Welcome back, {profile?.full_name?.split(' ')[0] || "Educator"}
                      </h1>
                      <span title="Verified Profile"><FaShieldHalved className="w-5 h-5 text-green-400" /></span>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-200 font-medium">
                      {teacherProfile?.title || teacherProfile?.subject || "Teacher"} • {teacherProfile?.location || "India"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-3 border border-white/20">
                  <div className="text-center px-4 border-r border-white/20">
                    <p className="text-2xl font-bold text-white">4</p>
                    <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Applications</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-2xl font-bold text-yellow-400">0</p>
                    <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Interviews</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-px mb-8 scrollbar-none">
              {[
                { id: "applications", label: `My Applications (4)`, icon: FaBriefcase },
                { id: "saved", label: `Saved Jobs (${savedJobIds.length})`, icon: FaBookmark },
                { id: "profile", label: "Profile & Settings", icon: FaGear },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold rounded-t-2xl border-t border-x transition-all shrink-0 ${
                    activeTab === tab.id
                      ? "bg-white text-gray-900 border-gray-200 shadow-sm -mb-px"
                      : "bg-transparent text-gray-500 border-transparent hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Recent Applications</h2>
                
                {/* Dummy applications layout for UI demonstration since we lack application tracking table natively yet */}
                <div className="p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 font-bold flex items-center justify-center text-lg border border-red-100 shrink-0">
                      S
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 leading-tight">Senior Mathematics Expert</h3>
                      <p className="text-xs text-gray-500 mb-2">Sunrise International Boardings • Bangalore</p>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                        Under Review
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                     <p className="text-xs font-semibold text-gray-400 mb-1">Applied: Aug 12, 2026</p>
                     <p className="text-sm font-bold text-gray-900">₹45k - ₹60k<span className="text-gray-400 text-xs">/mo</span></p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 font-bold flex items-center justify-center text-lg border border-green-100 shrink-0">
                      I
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 leading-tight">TGT Science Term Fill</h3>
                      <p className="text-xs text-gray-500 mb-2">ISRO Central • Trivandrum</p>
                      <span className="text-[11px] font-bold text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-md border border-yellow-100">
                        Interview Scheduled
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                     <p className="text-xs font-semibold text-gray-400 mb-1">Applied: Aug 01, 2026</p>
                     <p className="text-sm font-bold text-gray-900">₹30k - ₹40k<span className="text-gray-400 text-xs">/mo</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Tab */}
            {activeTab === "saved" && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Saved Jobs</h2>
                
                {savedJobIds.length === 0 ? (
                  <p className="text-sm text-gray-500">You haven't saved any jobs yet. Go to Find Jobs to save interesting opportunities.</p>
                ) : (
                  dbJobs.filter(j => savedJobIds.includes(j.id)).length === 0 ? (
                    <p className="text-sm text-gray-500">Loading saved jobs...</p>
                  ) : (
                    dbJobs.filter(j => savedJobIds.includes(j.id)).map((job: any) => (
                      <div key={job.id} className="p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-blue-300 transition-colors">
                        <div>
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                          <p className="text-xs text-gray-500 font-medium">{job.board || 'Any Board'} • {job.location || 'India'} • Posted {new Date(job.created_at).toLocaleDateString()}</p>
                        </div>
    
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/jobs/${job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${job.id}`}
                            className="px-5 py-2.5 text-xs font-bold rounded-lg border border-gray-200 hover:border-blue-600 hover:text-blue-600 text-gray-700 transition-colors"
                          >
                            Apply Now
                          </Link>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            )}
            
            {activeTab === "profile" && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-gray-900">Career Profile Settings</h2>
                <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">Full Name</label>
                    <input type="text" defaultValue={profile?.full_name || ""} className="w-full p-3 text-sm bg-gray-50 rounded-xl border border-gray-200 font-medium focus:bg-white transition-colors outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">Email</label>
                    <input type="text" defaultValue={profile?.email || ""} className="w-full p-3 text-sm bg-gray-100 text-gray-500 rounded-xl border border-gray-200 font-medium outline-none" disabled />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">Primary Subject</label>
                    <input type="text" defaultValue={teacherProfile?.subject || ""} className="w-full p-3 text-sm bg-gray-50 rounded-xl border border-gray-200 font-medium focus:bg-white outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">Experience (Years)</label>
                    <input type="number" defaultValue={teacherProfile?.experience_years || ""} className="w-full p-3 text-sm bg-gray-50 rounded-xl border border-gray-200 font-medium focus:bg-white outline-none focus:border-blue-400" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 mt-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Profile Visibility (For Institutions)</h3>
                    <p className="text-xs text-gray-500 mt-1">If active, institutions can discover your profile.</p>
                  </div>
                  <button 
                    onClick={() => setIsProfileVisible(!isProfileVisible)}
                    className={`w-12 h-6 rounded-full relative transition-colors shadow-inner ${isProfileVisible ? 'bg-[#00a264]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isProfileVisible ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Link href="/profile" className="inline-flex px-6 py-3 text-sm font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                    Go to Full Account Settings
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
