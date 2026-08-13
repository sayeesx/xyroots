"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import {
  FaMagnifyingGlass, FaLocationDot, FaBookmark, FaRegBookmark, FaCircleCheck,
  FaChevronDown, FaBars, FaTableCellsLarge, FaGraduationCap, FaFilter
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function TeachersPage() {
  const { user, loading, openInstitutionRegistration } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      if (typeof window !== "undefined") window.location.href = "/";
    }
  }, [loading, user, openInstitutionRegistration]);
  const [searchTerm, setSearchTerm] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [dbTeachers, setDbTeachers] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('teacher_profiles').select('*, profiles(full_name, avatar_url)').then(({ data }) => {
      if (data) {
        const mappedTeachers = (data as any[]).map((t: any) => ({
          ...t,
          id: t.id,
          name: t.profiles?.full_name || "Anonymous",
          slug: `${(t.profiles?.full_name || "Anonymous").toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${t.id}`,
          title: t.title || "Educator",
          location: t.location || t.profiles?.location || "India",
          avatar: t.profiles?.avatar_url || t.profile_image_url || null,
          subjects: t.specializations || [t.subject],
          experience: t.experience_years || 0,
          verified: t.profile_completion > 80, // mock rule
          is_visible: t.is_visible !== false,
        }));
        setDbTeachers(mappedTeachers);
      }
    });
  }, []);

  // Filters
  const [selectedVerification, setSelectedVerification] = useState<string[]>([]);
  const [selectedQuals, setSelectedQuals] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);

  // Watchlist
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const toggleCheckbox = (state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setState(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  };

  const toggleWatchlist = (slug: string) => {
    setWatchlist(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const clearAll = () => {
    setSelectedVerification([]);
    setSelectedQuals([]);
    setSelectedSubjects([]);
    setSelectedExperiences([]);
  };

  // Filter teachers
  const filteredTeachers = useMemo(() => {
    return dbTeachers.filter(t => {
      if (!t.is_visible) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!t.name.toLowerCase().includes(term) &&
            !t.title.toLowerCase().includes(term) &&
            !t.subjects.some((s: string) => s.toLowerCase().includes(term))) {
          return false;
        }
      }
      if (citySearch) {
        if (!t.location.toLowerCase().includes(citySearch.toLowerCase())) return false;
      }
      return true;
    });
  }, [searchTerm, citySearch, dbTeachers]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="w-full mb-6 z-30">
          {/* Top Search Bar */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-1.5 focus-within:ring-2 focus-within:ring-xyroots-mint focus-within:border-xyroots-teal transition-all flex flex-col sm:flex-row mb-3">
              <div className="flex-1 flex items-center px-4 py-2 border-b sm:border-b-0 sm:border-r border-gray-200">
                <FaMagnifyingGlass className="w-[14px] h-[14px] text-gray-400 mr-2 shrink-0" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search teacher by name or subject..." 
                  className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900 font-medium"
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-2 border-b sm:border-b-0 sm:border-r border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group">
                <span className="w-full text-sm outline-none bg-transparent text-gray-900 font-medium line-clamp-1">India</span>
                <FaChevronDown className="w-[12px] h-[12px] text-gray-400 shrink-0 group-hover:text-xyroots-teal" />
              </div>
              <div className="flex-1 flex items-center px-4 py-2 mr-2">
                <FaLocationDot className="w-[14px] h-[14px] text-gray-400 mr-2 shrink-0" />
                <input 
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Any City" 
                  className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900 font-medium"
                />
              </div>
              <button className="bg-xyroots-teal text-white rounded-md px-8 py-2 text-sm font-semibold hover:bg-xyroots-dark transition-colors shrink-0 m-1 sm:m-0 flex items-center gap-2">
                <FaMagnifyingGlass className="w-3 h-3" /> Find
              </button>
            </div>
        </div>
        <div className="flex gap-8">
        {/* Left Sidebar Filter */}
        <aside className="hidden lg:block w-64 shrink-0 overflow-y-auto sticky top-24 h-[calc(100vh-6rem)] custom-scrollbar pr-4 pb-20 z-10">
          <div className="flex items-center justify-between mb-6 pt-2 pb-2">
            <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FaFilter className="w-3.5 h-3.5 text-xyroots-teal" />
              Filter Focus
            </h2>
            <button onClick={clearAll} className="text-xs font-semibold text-xyroots-teal hover:text-black">Clear All</button>
          </div>

          <div className="space-y-6 text-sm text-gray-700">
            {/* Status */}
            <div>
              <button className="flex items-center justify-between w-full font-semibold mb-3 tracking-snug hover:text-xyroots-teal transition-colors">
                Status <FaChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              <div className="space-y-2.5">
                {["Verified Only", "Profile > 80%"].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedVerification, setSelectedVerification, type); }}>
                    <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors ${selectedVerification.includes(type) ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
                      {selectedVerification.includes(type) && <FaCircleCheck className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-gray-600 group-hover:text-gray-900 select-none">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Subject Specialization */}
            <div>
              <button className="flex items-center justify-between w-full font-semibold mb-3 tracking-snug hover:text-xyroots-teal transition-colors">
                Subject Focus <FaChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto custom-scrollbar">
                {["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Computer Science"].map(subj => (
                  <label key={subj} className="flex items-center gap-3 cursor-pointer group mb-2.5" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedSubjects, setSelectedSubjects, subj); }}>
                    <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors ${selectedSubjects.includes(subj) ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
                      {selectedSubjects.includes(subj) && <FaCircleCheck className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-gray-600 group-hover:text-gray-900 select-none">{subj}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Qualifications */}
            <div>
              <button className="flex items-center justify-between w-full font-semibold mb-3 tracking-snug hover:text-xyroots-teal transition-colors">
                Qualification <FaChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              <div className="space-y-2.5">
                {["B.Ed", "M.Ed", "M.Sc", "Ph.D", "NET Qualified"].map(q => (
                  <label key={q} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedQuals, setSelectedQuals, q); }}>
                    <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors ${selectedQuals.includes(q) ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
                      {selectedQuals.includes(q) && <FaCircleCheck className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-gray-600 group-hover:text-gray-900 select-none">{q}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Experience */}
            <div>
              <button className="flex items-center justify-between w-full font-semibold mb-3 tracking-snug hover:text-xyroots-teal transition-colors">
                Teaching Experience <FaChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              <div className="space-y-2.5">
                {["Less than a year", "1-3 years", "3-5 years", "5-10 years", "More than 10 years"].map(exp => (
                  <label key={exp} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedExperiences, setSelectedExperiences, exp); }}>
                    <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors ${selectedExperiences.includes(exp) ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
                      {selectedExperiences.includes(exp) && <FaCircleCheck className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-gray-600 group-hover:text-gray-900 select-none">{exp}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content — scrollable */}
        <div className="flex-1 w-full min-w-0 pb-16 relative overflow-y-auto">
          
          {/* Sticky Header Group for Search and Results sorting */}
          <div className="sticky top-14 pt-4 pb-2 bg-gray-50/95 z-30 mb-4 border-b border-gray-200/50">
            

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className="text-[14px] text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredTeachers.length}</span> Teachers in India
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                  Sort by
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded text-gray-800 hover:border-gray-300">
                    Profile Match <FaChevronDown className="w-2.5 h-2.5 text-gray-400" />
                  </button>
                </div>
                <div className="flex items-center bg-white rounded-md p-0.5 border border-gray-200 shadow-sm">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    <FaTableCellsLarge className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-sm transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    <FaBars className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Teacher Grid — uses slug URLs */}
          <div className={`grid gap-3 lg:gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredTeachers.map((teacher, i) => {
              const isSaved = watchlist.includes(teacher.slug);
              return (
                <div key={teacher.id} className="bg-white border rounded-[10px] border-gray-200 overflow-hidden hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:border-xyroots-teal/40 transition-all group flex flex-col">
                  <div className="p-3.5 flex-1 relative">
                    
                    {/* Bookmark */}
                    <button 
                      onClick={() => toggleWatchlist(teacher.slug)}
                      className={`absolute top-3.5 right-3.5 transition-colors ${isSaved ? 'text-xyroots-teal' : 'text-gray-300 hover:text-xyroots-teal'}`}
                      title={isSaved ? "Remove from watchlist" : "Save to watchlist"}
                    >
                      {isSaved ? <FaBookmark className="w-[14px] h-[14px]" /> : <FaRegBookmark className="w-[14px] h-[14px]" />}
                    </button>

                    <div className="flex flex-col items-center mb-2 text-center mt-1">
                      {/* Avatar */}
                      <div className="w-[64px] h-[64px] rounded-full border-4 border-white shadow-sm overflow-hidden bg-xyroots-teal relative mb-2 flex items-center justify-center text-white font-bold text-lg">
                        {teacher.avatar}
                        {teacher.verified && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <FaCircleCheck className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                           <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-xyroots-teal transition-colors leading-tight mb-0.5 flex items-center justify-center gap-1.5">
                             {teacher.name}
                             {teacher.verified && <FaCircleCheck className="w-3.5 h-3.5 text-xyroots-teal" />}
                           </h3>
                           <p className="text-[11px] text-gray-500 line-clamp-1 font-medium">
                             {teacher.title}
                           </p>
                      </div>
                    </div>

                    {/* Badges / Pills */}
                    <div className="flex flex-wrap gap-1.5 justify-center mb-1 text-center">
                      <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[#4d5c6f] text-[10px] font-semibold rounded"><FaGraduationCap className="w-2.5 h-2.5 inline mr-1 -mt-0.5" />{teacher.education[0]?.degree || "B.Ed"}</span>
                      <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[#4d5c6f] text-[10px] font-semibold rounded">{teacher.experience}+ Years</span>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between border-t border-gray-100/50 mt-auto bg-gray-50/50">
                    <div className="text-[12px] font-semibold text-gray-500">
                      <FaLocationDot className="w-3 h-3 inline mr-1 text-gray-400" />
                      {teacher.location.split(",")[0]}
                    </div>
                    <Link href={`/teachers/${teacher.slug}`} className="px-4 py-1.5 bg-xyroots-mint/30 text-black hover:bg-xyroots-teal hover:text-white rounded-md text-[11px] font-bold transition-all text-center border border-xyroots-teal/20 hover:border-xyroots-teal">
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
