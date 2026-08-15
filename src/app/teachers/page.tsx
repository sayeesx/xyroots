"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomSelect from "@/components/ui/CustomSelect";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  FaMagnifyingGlass, FaLocationDot, FaCircleCheck,
  FaBars, FaTableCellsLarge, FaFilter, FaXmark, FaSort
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";

const SUBJECTS = [
  "All", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi",
  "Social Science", "Computer Science", "Commerce", "Economics", "History",
  "Geography", "Sanskrit", "Physical Education"
];

const INDIA_STATES = [
  "All States",
  "Maharashtra",
  "Uttar Pradesh",
  "Tamil Nadu",
  "Karnataka",
  "Delhi",
  "West Bengal",
  "Telangana",
  "Gujarat",
  "Rajasthan",
  "Kerala",
];

const INDIA_STATES_OPTIONS = INDIA_STATES.map(s => ({ value: s, label: s }));

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "experience_desc", label: "Experience: High to Low" },
  { value: "experience_asc", label: "Experience: Low to High" },
  { value: "name_asc", label: "Name: A–Z" },
  { value: "completion_desc", label: "Profile Completeness" },
];

// ─── Filter Panel ─────────────────────────────────────────────────────────────
function FilterPanel({
  selectedVerification, setSelectedVerification,
  selectedQuals, setSelectedQuals,
  selectedExperiences, setSelectedExperiences,
  clearAll,
}: any) {
  const toggleCheckbox = (state: string[], setState: any, val: string) => {
    setState((prev: string[]) => prev.includes(val) ? prev.filter((i: string) => i !== val) : [...prev, val]);
  };
  return (
    <div className="flex flex-col h-full text-sm text-gray-700 overflow-hidden">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h2 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
          <FaFilter className="w-3 h-3 text-gray-600" /> Filters
        </h2>
        <button onClick={clearAll} className="text-[11px] font-semibold text-gray-500 hover:text-black">Clear All</button>
      </div>

      {/* Status */}
      <div className="mb-3 shrink-0">
        <p className="text-[11px] font-bold mb-2 text-gray-700 uppercase tracking-wide">Status</p>
        <div className="space-y-1.5">
          {["Verified Only", "Profile > 80%"].map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedVerification, setSelectedVerification, type); }}>
              <div className={`w-[15px] h-[15px] rounded flex items-center justify-center border transition-colors shrink-0 ${selectedVerification.includes(type) ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover:border-gray-500 bg-white'}`}>
                {selectedVerification.includes(type) && <FaCircleCheck className="w-2.5 h-2.5 text-white" />}
              </div>
              <span className="text-xs text-gray-600 group-hover:text-gray-900 select-none">{type}</span>
            </label>
          ))}
        </div>
      </div>
      <hr className="border-gray-100 mb-3 shrink-0" />

      {/* Qualification */}
      <div className="mb-3 shrink-0">
        <p className="text-[11px] font-bold mb-2 text-gray-700 uppercase tracking-wide">Qualification</p>
        <div className="space-y-1.5">
          {["B.Ed", "M.Ed", "M.Sc", "Ph.D", "NET Qualified"].map(q => (
            <label key={q} className="flex items-center gap-2 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedQuals, setSelectedQuals, q); }}>
              <div className={`w-[15px] h-[15px] rounded flex items-center justify-center border transition-colors shrink-0 ${selectedQuals.includes(q) ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover:border-gray-500 bg-white'}`}>
                {selectedQuals.includes(q) && <FaCircleCheck className="w-2.5 h-2.5 text-white" />}
              </div>
              <span className="text-xs text-gray-600 group-hover:text-gray-900 select-none">{q}</span>
            </label>
          ))}
        </div>
      </div>
      <hr className="border-gray-100 mb-3 shrink-0" />

      {/* Experience */}
      <div className="shrink-0">
        <p className="text-[11px] font-bold mb-2 text-gray-700 uppercase tracking-wide">Teaching Experience</p>
        <div className="space-y-1.5">
          {["Less than a year", "1-3 years", "3-5 years", "5-10 years", "More than 10 years"].map(exp => (
            <label key={exp} className="flex items-center gap-2 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedExperiences, setSelectedExperiences, exp); }}>
              <div className={`w-[15px] h-[15px] rounded flex items-center justify-center border transition-colors shrink-0 ${selectedExperiences.includes(exp) ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover:border-gray-500 bg-white'}`}>
                {selectedExperiences.includes(exp) && <FaCircleCheck className="w-2.5 h-2.5 text-white" />}
              </div>
              <span className="text-xs text-gray-600 group-hover:text-gray-900 select-none">{exp}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonTeacherCard() {
  return (
    <div className="bg-white border border-gray-100 animate-pulse" style={{ borderRadius: "1rem" }}>
      <div className="p-4">
        <div className="flex gap-3 mb-3">
          <div className="w-11 h-11 bg-gray-200" style={{ borderRadius: "50%" }} />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
        <div className="h-3 bg-gray-100 rounded w-2/3 mb-3" />
        <div className="flex gap-2">
          <div className="h-5 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-100 rounded-full w-12" />
          <div className="h-5 bg-gray-100 rounded-full w-14" />
        </div>
      </div>
      <div className="px-4 py-3 border-t border-gray-100 flex justify-between">
        <div className="h-4 bg-gray-100 rounded w-20" />
        <div className="h-7 bg-gray-100 rounded-lg w-16" />
      </div>
    </div>
  );
}

// ─── Inner page (uses useSearchParams) ───────────────────────────────────────
function TeachersPageInner() {
  const searchParams = useSearchParams();
  const { user, loading, role } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        if (typeof window !== "undefined") window.location.href = "/";
      } else if (role === 'teacher') {
        if (typeof window !== "undefined") window.location.href = "/dashboard/teacher";
      }
    }
  }, [loading, user, role]);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [citySearch, setCitySearch] = useState(searchParams.get("location") || "");
  const [activeSubject, setActiveSubject] = useState(searchParams.get("subject") || "All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [dbTeachers, setDbTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    setIsLoading(true);
    supabase
      .from('teacher_profiles')
      .select('id, subject, title, location, experience_years, professional_qualification, profile_completion, expected_salary_min, expected_salary_max, profiles!inner(full_name, avatar_url)')
      .eq('is_visible', true)
      .limit(50)
      .then(({ data }) => {
        if (data) {
          const mapped = (data as any[]).map((t: any) => ({
            id: t.id,
            name: t.profiles?.full_name || "Anonymous",
            avatar_url: t.profiles?.avatar_url || null,
            title: t.title || "Educator",
            location: t.location || "India",
            subject: t.subject || "",
            experience_years: t.experience_years || 0,
            professional_qualification: t.professional_qualification || "",
            profile_completion: t.profile_completion || 0,
            verified: (t.profile_completion || 0) > 80,
            expected_salary_min: t.expected_salary_min || 0,
            expected_salary_max: t.expected_salary_max || 0,
          }));
          setDbTeachers(mapped);
        }
        setIsLoading(false);
      });
  }, []); // eslint-disable-line

  const [selectedVerification, setSelectedVerification] = useState<string[]>([]);
  const [selectedQuals, setSelectedQuals] = useState<string[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("All States");
  const [sortBy, setSortBy] = useState("default");

  const clearAll = () => {
    setSelectedVerification([]);
    setSelectedQuals([]);
    setSelectedExperiences([]);
    setSelectedState("All States");
    setSortBy("default");
  };

  const activeFilterCount = selectedVerification.length + selectedQuals.length + selectedExperiences.length;

  const filteredTeachers = useMemo(() => {
    let result = dbTeachers.filter(t => {
      if (activeSubject && activeSubject !== "All") {
        const teacherSubject = (t.subject || "").toLowerCase();
        if (!teacherSubject.includes(activeSubject.toLowerCase())) return false;
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!t.name.toLowerCase().includes(term) &&
            !t.title.toLowerCase().includes(term) &&
            !(t.subject || "").toLowerCase().includes(term)) {
          return false;
        }
      }
      if (citySearch) {
        if (!t.location.toLowerCase().includes(citySearch.toLowerCase())) return false;
      }

      if (selectedState && selectedState !== "All States") {
        if (!t.location.toLowerCase().includes(selectedState.toLowerCase())) return false;
      }

      if (selectedVerification.includes("Verified Only") && !t.verified) return false;
      if (selectedVerification.includes("Profile > 80%") && t.profile_completion <= 80) return false;

      if (selectedQuals.length > 0) {
        const teacherQual = (t.professional_qualification || "").toLowerCase();
        const hasQualMatch = selectedQuals.some(q => teacherQual.includes(q.toLowerCase()));
        if (!hasQualMatch) return false;
      }

      if (selectedExperiences.length > 0) {
        const exp = t.experience_years || 0;
        const hasExpMatch = selectedExperiences.some(e => {
          if (e === "Less than a year") return exp === 0;
          if (e === "1-3 years") return exp >= 1 && exp <= 3;
          if (e === "3-5 years") return exp >= 3 && exp <= 5;
          if (e === "5-10 years") return exp >= 5 && exp <= 10;
          if (e === "More than 10 years") return exp > 10;
          return false;
        });
        if (!hasExpMatch) return false;
      }

      return true;
    });

    // Sort
    if (sortBy === "experience_desc") result = [...result].sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0));
    else if (sortBy === "experience_asc") result = [...result].sort((a, b) => (a.experience_years || 0) - (b.experience_years || 0));
    else if (sortBy === "name_asc") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "completion_desc") result = [...result].sort((a, b) => (b.profile_completion || 0) - (a.profile_completion || 0));

    return result;
  }, [searchTerm, citySearch, activeSubject, dbTeachers, selectedVerification, selectedQuals, selectedExperiences, selectedState, sortBy]);

  const filterProps = { selectedVerification, setSelectedVerification, selectedQuals, setSelectedQuals, selectedExperiences, setSelectedExperiences, clearAll };

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
              <button onClick={() => setMobileFilterOpen(false)} className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm">
                Show {filteredTeachers.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 pt-4 pb-10">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search Bar */}
          <div className="pt-3 pb-2">
            <div className="bg-white border border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-0" style={{ borderRadius: "0.625rem" }}>
              <div className="flex-1 flex items-center px-3 py-2.5 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-0">
                <FaMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search teacher by name or subject..."
                  className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900 font-medium min-w-0 search-input"
                />
              </div>
              <div className="flex-1 flex items-center px-3 py-2.5 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-0">
                <FaLocationDot className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Any City"
                  className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900 font-medium min-w-0 search-input"
                />
              </div>
              {/* State Dropdown */}
              <div className="flex items-center px-2 py-2 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-0 w-full sm:w-40">
                <FaLocationDot className="w-3 h-3 text-gray-400 mr-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <CustomSelect
                    value={selectedState}
                    onChange={setSelectedState}
                    options={INDIA_STATES_OPTIONS}
                    placeholder="All States"
                    searchable
                  />
                </div>
              </div>
              <button className="bg-[#00a264] text-white px-5 py-2 text-sm font-semibold hover:bg-[#008f58] transition-colors shrink-0 flex items-center justify-center gap-1.5 m-1" style={{ borderRadius: "0.375rem" }}>
                <FaMagnifyingGlass className="w-3 h-3" /> Find
              </button>
            </div>
          </div>

          {/* Subject Bubble Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2" style={{ scrollbarWidth: "none" }}>
            {SUBJECTS.map(subject => (
              <button
                key={subject}
                onClick={() => setActiveSubject(subject)}
                className={`px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  activeSubject === subject
                    ? "bg-[#00a264] text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-[#00a264]"
                }`}
                style={{ borderRadius: "999px" }}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Layout: sidebar + content */}
          <div className="flex gap-6 lg:gap-8">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-56 shrink-0 sticky top-20 self-start overflow-y-auto max-h-[calc(100vh-5rem)] pb-10 custom-scrollbar">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <FilterPanel {...filterProps} />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar row */}
              <div className="flex items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 shadow-sm hover:border-gray-400 transition-colors"
                  >
                    <FaFilter className="w-3.5 h-3.5 text-gray-600" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
                    )}
                  </button>
                  <p className="text-[13px] text-gray-500">
                    <span className="font-bold text-gray-900">{isLoading ? "..." : filteredTeachers.length}</span> teachers found
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Sort select — always visible */}
                  <div className="flex items-center gap-1.5">
                    <FaSort className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <div className="w-44">
                      <CustomSelect
                        value={sortBy}
                        onChange={setSortBy}
                        options={SORT_OPTIONS}
                        placeholder="Sort By"
                      />
                    </div>
                  </div>
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

              {/* Skeleton or Teacher Cards */}
              {isLoading ? (
                <div className={`grid gap-3 lg:gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonTeacherCard key={i} />)}
                </div>
              ) : filteredTeachers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <p className="text-gray-500 text-sm">No teachers match your search.</p>
                </div>
              ) : (
                <div className={`grid gap-3 lg:gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {filteredTeachers.map((tp) => {
                    const name = tp.name;
                    return (
                      <div
                        key={tp.id}
                        className="bg-white border border-gray-200 overflow-hidden hover:border-[#00a264]/50 hover:shadow-[0_2px_12px_rgba(0,162,100,0.08)] transition-all group flex flex-col"
                        style={{ borderRadius: "1rem" }}
                      >
                        <div className="p-3 flex-1">
                          {/* Top row: avatar + name/title */}
                          <div className="flex items-start gap-2.5 mb-2">
                            <div
                              className="w-11 h-11 shrink-0 flex items-center justify-center text-sm font-bold overflow-hidden"
                              style={{ borderRadius: "50%", backgroundColor: tp.avatar_url ? "transparent" : "#e5e7eb", color: "#4b5563" }}
                            >
                              {tp.avatar_url ? (
                                <img src={tp.avatar_url} alt={name} className="w-full h-full object-cover" style={{ borderRadius: "50%" }} />
                              ) : (
                                name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <h3 className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors truncate leading-tight">
                                  {name}
                                </h3>
                                {tp.verified && <FaCircleCheck className="w-3 h-3 text-[#00a264] shrink-0" />}
                              </div>
                              <p className="text-xs text-gray-500 truncate leading-tight mt-0.5">{tp.title}</p>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1.5">
                            <FaLocationDot className="w-2.5 h-2.5 shrink-0 text-[#00a264]" />
                            <span className="truncate">{tp.location}</span>
                          </div>

                          {/* Key details grid */}
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                            <div>
                              <p className="font-semibold text-gray-400 uppercase tracking-wide leading-none mb-0.5" style={{ fontSize: "10px" }}>Experience</p>
                              <p className="text-gray-700 font-medium">{tp.experience_years ? `${tp.experience_years} yrs` : "Fresher"}</p>
                            </div>
                            {tp.professional_qualification && (
                              <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wide leading-none mb-0.5" style={{ fontSize: "10px" }}>Qualification</p>
                                <p className="text-gray-700 font-medium truncate">{tp.professional_qualification}</p>
                              </div>
                            )}
                            {tp.subject && (
                              <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wide leading-none mb-0.5" style={{ fontSize: "10px" }}>Subject</p>
                                <p className="text-gray-700 font-medium truncate">{tp.subject}</p>
                              </div>
                            )}
                            {(tp.expected_salary_min > 0 || tp.expected_salary_max > 0) && (
                              <div>
                                <p className="font-semibold text-gray-400 uppercase tracking-wide leading-none mb-0.5" style={{ fontSize: "10px" }}>Salary</p>
                                <p className="text-[#00a264] font-semibold">
                                  ₹{tp.expected_salary_min ? `${(tp.expected_salary_min/1000).toFixed(0)}k` : '?'}
                                  {tp.expected_salary_max ? `–${(tp.expected_salary_max/1000).toFixed(0)}k` : '+'}/mo
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer — profile bar left, View Profile right */}
                        <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between gap-3 bg-gray-50/60">
                          {/* Profile completion */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">Profile</span>
                              <span className="text-[9px] font-bold text-gray-600">{tp.profile_completion}%</span>
                            </div>
                            <div className="w-full h-1 bg-gray-100 overflow-hidden" style={{ borderRadius: "999px" }}>
                              <div
                                className="h-full bg-[#00a264] transition-all"
                                style={{ width: `${tp.profile_completion}%`, borderRadius: "999px" }}
                              />
                            </div>
                          </div>
                          <Link
                            href={`/teachers/${tp.id}`}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-[#00a264] hover:bg-[#007a4d] transition-all shrink-0"
                            style={{ borderRadius: "0.375rem" }}
                          >
                            View Profile
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
      <Footer />
    </div>
  );
}

// ─── Default export wraps in Suspense for useSearchParams ─────────────────────
export default function TeachersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400 text-sm">Loading...</div>
        </main>
      </div>
    }>
      <TeachersPageInner />
    </Suspense>
  );
}

