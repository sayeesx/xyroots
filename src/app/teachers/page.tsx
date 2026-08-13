"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import {
  FaMagnifyingGlass, FaLocationDot, FaBookmark, FaRegBookmark, FaCircleCheck,
  FaChevronDown, FaBars, FaTableCellsLarge, FaGraduationCap, FaFilter, FaXmark
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";

// ─── Filter Panel Content (shared between sidebar & drawer) ─────────────────
function FilterPanel({
  selectedVerification, setSelectedVerification,
  selectedSubjects, setSelectedSubjects,
  selectedQuals, setSelectedQuals,
  selectedExperiences, setSelectedExperiences,
  clearAll,
}: any) {
  const toggleCheckbox = (state: string[], setState: any, val: string) => {
    setState((prev: string[]) => prev.includes(val) ? prev.filter((i: string) => i !== val) : [...prev, val]);
  };
  return (
    <div className="space-y-5 text-sm text-gray-700">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <FaFilter className="w-3.5 h-3.5 text-xyroots-teal" /> Filters
        </h2>
        <button onClick={clearAll} className="text-xs font-semibold text-xyroots-teal hover:text-black">Clear All</button>
      </div>

      {/* Status */}
      <div>
        <p className="font-semibold mb-3 text-gray-800">Status</p>
        <div className="space-y-2.5">
          {["Verified Only", "Profile > 80%"].map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedVerification, setSelectedVerification, type); }}>
              <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors shrink-0 ${selectedVerification.includes(type) ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
                {selectedVerification.includes(type) && <FaCircleCheck className="w-3 h-3 text-white" />}
              </div>
              <span className="text-gray-600 group-hover:text-gray-900 select-none">{type}</span>
            </label>
          ))}
        </div>
      </div>
      <hr className="border-gray-200" />

      {/* Subject */}
      <div>
        <p className="font-semibold mb-3 text-gray-800">Subject Focus</p>
        <div className="space-y-2.5">
          {["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Computer Science"].map(subj => (
            <label key={subj} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedSubjects, setSelectedSubjects, subj); }}>
              <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors shrink-0 ${selectedSubjects.includes(subj) ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
                {selectedSubjects.includes(subj) && <FaCircleCheck className="w-3 h-3 text-white" />}
              </div>
              <span className="text-gray-600 group-hover:text-gray-900 select-none">{subj}</span>
            </label>
          ))}
        </div>
      </div>
      <hr className="border-gray-200" />

      {/* Qualification */}
      <div>
        <p className="font-semibold mb-3 text-gray-800">Qualification</p>
        <div className="space-y-2.5">
          {["B.Ed", "M.Ed", "M.Sc", "Ph.D", "NET Qualified"].map(q => (
            <label key={q} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedQuals, setSelectedQuals, q); }}>
              <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors shrink-0 ${selectedQuals.includes(q) ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
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
        <p className="font-semibold mb-3 text-gray-800">Teaching Experience</p>
        <div className="space-y-2.5">
          {["Less than a year", "1-3 years", "3-5 years", "5-10 years", "More than 10 years"].map(exp => (
            <label key={exp} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedExperiences, setSelectedExperiences, exp); }}>
              <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors shrink-0 ${selectedExperiences.includes(exp) ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
                {selectedExperiences.includes(exp) && <FaCircleCheck className="w-3 h-3 text-white" />}
              </div>
              <span className="text-gray-600 group-hover:text-gray-900 select-none">{exp}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function TeachersPage() {
  const { user, loading, openInstitutionRegistration } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      if (typeof window !== "undefined") window.location.href = "/";
    }
  }, [loading, user]);

  const [searchTerm, setSearchTerm] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
          avatar: t.profiles?.avatar_url || null,
          subjects: t.specializations || [t.subject],
          experience: t.experience_years || 0,
          verified: t.profile_completion > 80,
          education: t.education || [],
          is_visible: t.is_visible !== false,
        }));
        setDbTeachers(mappedTeachers);
      }
    });
  }, []);

  const [selectedVerification, setSelectedVerification] = useState<string[]>([]);
  const [selectedQuals, setSelectedQuals] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const toggleWatchlist = (slug: string) => {
    setWatchlist(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  const clearAll = () => {
    setSelectedVerification([]);
    setSelectedQuals([]);
    setSelectedSubjects([]);
    setSelectedExperiences([]);
  };

  const activeFilterCount = selectedVerification.length + selectedQuals.length + selectedSubjects.length + selectedExperiences.length;

  const filteredTeachers = useMemo(() => {
    return dbTeachers.filter(t => {
      if (!t.is_visible) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!t.name.toLowerCase().includes(term) &&
            !t.title.toLowerCase().includes(term) &&
            !(t.subjects || []).some((s: string) => s?.toLowerCase().includes(term))) {
          return false;
        }
      }
      if (citySearch) {
        if (!t.location.toLowerCase().includes(citySearch.toLowerCase())) return false;
      }
      return true;
    });
  }, [searchTerm, citySearch, dbTeachers]);

  const filterProps = { selectedVerification, setSelectedVerification, selectedSubjects, setSelectedSubjects, selectedQuals, setSelectedQuals, selectedExperiences, setSelectedExperiences, clearAll };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative ml-auto w-[85vw] max-w-sm h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <FaXmark className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanel {...filterProps} />
            </div>
            <div className="p-4 border-t border-gray-100">
              <button onClick={() => setMobileFilterOpen(false)} className="w-full py-3 rounded-xl bg-xyroots-teal text-white font-bold text-sm">
                Show {filteredTeachers.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 pt-14 lg:pt-16 pb-10">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search Bar */}
          <div className="pt-4 pb-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-0">
              <div className="flex-1 flex items-center px-3 py-2.5 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-0">
                <FaMagnifyingGlass className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search teacher by name or subject..."
                  className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900 font-medium min-w-0"
                />
              </div>
              <div className="flex-1 flex items-center px-3 py-2.5 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-0">
                <FaLocationDot className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Any City"
                  className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900 font-medium min-w-0"
                />
              </div>
              <button className="bg-xyroots-teal text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-[#068050] transition-colors shrink-0 flex items-center justify-center gap-2 m-1">
                <FaMagnifyingGlass className="w-3.5 h-3.5" /> Find
              </button>
            </div>
          </div>

          {/* Layout: sidebar + content */}
          <div className="flex gap-6 lg:gap-8">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-60 shrink-0 sticky top-20 self-start overflow-y-auto max-h-[calc(100vh-5rem)] custom-scrollbar pb-10">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <FilterPanel {...filterProps} />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar row */}
              <div className="flex items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-2">
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 shadow-sm hover:border-xyroots-teal transition-colors"
                  >
                    <FaFilter className="w-3.5 h-3.5 text-xyroots-teal" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-xyroots-teal text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
                    )}
                  </button>
                  <p className="text-[13px] text-gray-500">
                    <span className="font-bold text-gray-900">{filteredTeachers.length}</span> teachers found
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white rounded-lg p-0.5 border border-gray-200 shadow-sm">
                    <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                      <FaTableCellsLarge className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                      <FaBars className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Teacher Grid */}
              {filteredTeachers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <p className="text-gray-500 text-sm">No teachers match your search.</p>
                </div>
              ) : (
                <div className={`grid gap-3 lg:gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {filteredTeachers.map((teacher) => {
                    const isSaved = watchlist.includes(teacher.slug);
                    return (
                      <div key={teacher.id} className="bg-white border rounded-2xl border-gray-100 overflow-hidden hover:shadow-[0_4px_20px_rgb(0,0,0,0.07)] hover:border-xyroots-teal/30 transition-all group flex flex-col">
                        <div className="p-4 flex-1 relative">
                          <button
                            onClick={() => toggleWatchlist(teacher.slug)}
                            className={`absolute top-3 right-3 transition-colors ${isSaved ? 'text-xyroots-teal' : 'text-gray-300 hover:text-xyroots-teal'}`}
                          >
                            {isSaved ? <FaBookmark className="w-3.5 h-3.5" /> : <FaRegBookmark className="w-3.5 h-3.5" />}
                          </button>

                          <div className="flex flex-col items-center text-center mb-3 mt-1">
                            <div className="w-14 h-14 rounded-full border-2 border-gray-100 shadow-sm overflow-hidden bg-xyroots-teal mb-2 flex items-center justify-center text-white font-bold text-lg">
                              {teacher.avatar ? (
                                <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>{teacher.name?.charAt(0) || '?'}</span>
                              )}
                            </div>
                            <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-xyroots-teal transition-colors leading-tight mb-0.5 flex items-center gap-1">
                              {teacher.name}
                              {teacher.verified && <FaCircleCheck className="w-3 h-3 text-xyroots-teal shrink-0" />}
                            </h3>
                            <p className="text-[11px] text-gray-500 line-clamp-1 font-medium">{teacher.title}</p>
                          </div>

                          <div className="flex flex-wrap gap-1.5 justify-center">
                            <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[#4d5c6f] text-[10px] font-semibold rounded">
                              <FaGraduationCap className="w-2.5 h-2.5 inline mr-0.5 -mt-0.5" />{teacher.education?.[0]?.degree || "B.Ed"}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[#4d5c6f] text-[10px] font-semibold rounded">{teacher.experience}+ Yrs</span>
                          </div>
                        </div>

                        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100/60 bg-gray-50/40">
                          <div className="text-[11px] font-semibold text-gray-500 truncate mr-2">
                            <FaLocationDot className="w-3 h-3 inline mr-0.5 text-gray-400" />
                            {teacher.location?.split(",")[0]}
                          </div>
                          <Link href={`/teachers/${teacher.slug}`} className="px-3 py-1.5 bg-xyroots-mint/40 text-black hover:bg-xyroots-teal hover:text-white rounded-lg text-[11px] font-bold transition-all border border-xyroots-teal/20 hover:border-xyroots-teal shrink-0">
                            View
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
