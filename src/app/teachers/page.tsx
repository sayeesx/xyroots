"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomSelect from "@/components/ui/CustomSelect";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRef } from "react";
import {
  FaMagnifyingGlass, FaLocationDot, FaCircleCheck,
  FaBars, FaTableCellsLarge, FaFilter, FaXmark, FaSort, FaLock, FaChevronDown, FaCheck
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";

const SUBJECTS = [
  "All", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi",
  "Social Science", "Computer Science", "Commerce", "Economics", "History",
  "Geography", "Sanskrit", "Physical Education", "Science", "Accountancy",
  "Business Studies", "Political Science", "Sociology", "Psychology",
  "Environmental Science", "Music", "Art & Craft", "French", "German",
  "Malayalam", "Tamil", "Telugu", "Kannada", "Urdu", "Home Science",
  "Information Technology", "Nursery / Pre-Primary"
];

const INDIA_STATES = [
  "All States", "Maharashtra", "Uttar Pradesh", "Tamil Nadu", "Karnataka",
  "Delhi", "West Bengal", "Telangana", "Gujarat", "Rajasthan", "Kerala",
];
const INDIA_STATES_OPTIONS = INDIA_STATES.map(s => ({ value: s, label: s }));

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "experience_desc", label: "Experience: High to Low" },
  { value: "experience_asc", label: "Experience: Low to High" },
  { value: "name_asc", label: "Name: A–Z" },
  { value: "completion_desc", label: "Profile Completeness" },
];

// ─── Custom Sort Dropdown Component ──────────────────────────────────────────
function CustomSortDropdown({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 transition-all cursor-pointer"
      >
        <FaSort className="w-3 h-3 text-[#00a264]" />
        <span>{selectedOption.label}</span>
        <FaChevronDown className={`w-2.5 h-2.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 bg-white border border-gray-200 rounded-xl py-1.5 z-50 animate-in fade-in duration-100">
          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Sort By
          </div>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                value === opt.value
                  ? "bg-[#e6f7ed] text-[#00a264] font-bold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{opt.label}</span>
              {value === opt.value && <FaCheck className="w-3 h-3 text-[#00a264]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────
function FilterPanel({
  selectedVerification, setSelectedVerification,
  selectedQuals, setSelectedQuals,
  selectedExperiences, setSelectedExperiences,
  selectedBoards, setSelectedBoards,
  selectedLevels, setSelectedLevels,
  selectedModes, setSelectedModes,
  selectedNotice, setSelectedNotice,
  clearAll
}: any) {
  const toggle = (arr: string[], setArr: any, val: string) =>
    setArr((p: string[]) => p.includes(val) ? p.filter((i: string) => i !== val) : [...p, val]);
  const CB = ({ arr, setArr, val }: any) => (
    <label className="flex items-center gap-2.5 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggle(arr, setArr, val); }}>
      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${arr.includes(val) ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover:border-gray-500 bg-white'}`}>
        {arr.includes(val) && <FaCircleCheck className="w-2.5 h-2.5 text-white" />}
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 select-none">{val}</span>
    </label>
  );

  return (
    <div className="flex flex-col h-full text-sm text-gray-700">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 shrink-0">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
          <FaFilter className="w-3.5 h-3.5 text-[#00a264]" /> Filters
        </h2>
        <button onClick={clearAll} className="text-xs font-semibold text-gray-400 hover:text-black transition-colors">Clear All</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
        {/* Status */}
        <div>
          <p className="text-sm font-bold mb-2.5 text-gray-900 uppercase tracking-wide">Status</p>
          <div className="space-y-2">
            {["Verified Only", "Profile > 80%"].map(v => <CB key={v} arr={selectedVerification} setArr={setSelectedVerification} val={v} />)}
          </div>
        </div>
        <hr className="border-gray-100" />

        {/* Qualification */}
        <div>
          <p className="text-sm font-bold mb-2.5 text-gray-900 uppercase tracking-wide">Qualification</p>
          <div className="space-y-2">
            {["B.Ed", "M.Ed", "M.Sc", "Ph.D", "NET Qualified", "Graduate"].map(q => <CB key={q} arr={selectedQuals} setArr={setSelectedQuals} val={q} />)}
          </div>
        </div>
        <hr className="border-gray-100" />

        {/* Experience */}
        <div>
          <p className="text-sm font-bold mb-2.5 text-gray-900 uppercase tracking-wide">Experience</p>
          <div className="space-y-2">
            {["Less than a year", "1–3 years", "3–5 years", "5–10 years", "10+ years"].map(e => <CB key={e} arr={selectedExperiences} setArr={setSelectedExperiences} val={e} />)}
          </div>
        </div>
        <hr className="border-gray-100" />

        {/* Board Experience */}
        <div>
          <p className="text-xs font-bold mb-2.5 text-gray-700 uppercase tracking-wide">Board Experience</p>
          <div className="space-y-2">
            {["CBSE", "ICSE", "IB", "IGCSE", "State Board"].map(b => <CB key={b} arr={selectedBoards} setArr={setSelectedBoards} val={b} />)}
          </div>
        </div>
        <hr className="border-gray-100" />

        {/* Teaching Level */}
        <div>
          <p className="text-xs font-bold mb-2.5 text-gray-700 uppercase tracking-wide">Teaching Level</p>
          <div className="space-y-2">
            {["Primary (1-5)", "Middle School (6-8)", "High School (9-10)", "Senior Secondary (11-12)"].map(l => <CB key={l} arr={selectedLevels} setArr={setSelectedLevels} val={l} />)}
          </div>
        </div>
        <hr className="border-gray-100" />

        {/* Preferred Mode */}
        <div>
          <p className="text-xs font-bold mb-2.5 text-gray-700 uppercase tracking-wide">Preferred Mode</p>
          <div className="space-y-2">
            {["On-site / Offline", "Online", "Hybrid"].map(m => <CB key={m} arr={selectedModes} setArr={setSelectedModes} val={m} />)}
          </div>
        </div>
        <hr className="border-gray-100" />

        {/* Notice Period */}
        <div>
          <p className="text-xs font-bold mb-2.5 text-gray-700 uppercase tracking-wide">Availability</p>
          <div className="space-y-2">
            {["Immediate Joiner", "Within 15 Days", "1 Month", "2 Months"].map(n => <CB key={n} arr={selectedNotice} setArr={setSelectedNotice} val={n} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl animate-pulse p-5">
      <div className="flex gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="flex gap-2 mt-3">
          <div className="h-5 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-100 rounded-full w-12" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <div className="h-3 bg-gray-100 rounded w-20" />
        <div className="h-8 bg-gray-100 rounded-lg w-24" />
      </div>
    </div>
  );
}

// ─── Auth Gate ─────────────────────────────────────────────────────────────────
function AuthGate({ onSignIn, onRegister }: { onSignIn: () => void; onRegister: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#e6f7ed] flex items-center justify-center mx-auto mb-6">
          <FaLock className="w-7 h-7 text-[#00a264]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign in to view teacher profiles</h2>
        <p className="text-gray-500 text-base mb-8 leading-relaxed">
          Browse verified educators across India. Sign in or create a free account to access all teacher profiles.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onSignIn}
            className="px-8 py-3 bg-[#00a264] text-white font-semibold rounded-xl hover:bg-[#007a4d] transition-colors text-base"
          >
            Sign In
          </button>
          <button
            onClick={onRegister}
            className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors text-base"
          >
            Register Free
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Inner ────────────────────────────────────────────────────────────────────
function TeachersPageInner() {
  const searchParams = useSearchParams();
  const { user, loading, role, openSignIn, openInstitutionRegistration } = useAuth();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [citySearch, setCitySearch] = useState(searchParams.get("location") || searchParams.get("district") || "");
  const [activeSubject, setActiveSubject] = useState(searchParams.get("subject") || "All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [dbTeachers, setDbTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<string[]>(() => {
    const v = searchParams.get("verified");
    return v ? [v] : [];
  });
  const [selectedQuals, setSelectedQuals] = useState<string[]>(() => {
    const q = searchParams.get("qual");
    return q ? [q] : [];
  });
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>(() => {
    const e = searchParams.get("exp");
    return e ? [e] : [];
  });
  const [selectedBoards, setSelectedBoards] = useState<string[]>(() => {
    const b = searchParams.get("board");
    return b ? [b] : [];
  });
  const [selectedLevels, setSelectedLevels] = useState<string[]>(() => {
    const l = searchParams.get("level");
    return l ? [l] : [];
  });
  const [selectedModes, setSelectedModes] = useState<string[]>(() => {
    const m = searchParams.get("mode");
    return m ? [m] : [];
  });
  const [selectedNotice, setSelectedNotice] = useState<string[]>(() => {
    const n = searchParams.get("notice");
    return n ? [n] : [];
  });
  const [selectedState, setSelectedState] = useState(() => searchParams.get("state") || "All States");
  const [sortBy, setSortBy] = useState("default");
  const supabase = createClient();

  const isAuthed = !!user && !!role && role !== 'teacher';

  useEffect(() => {
    if (!isAuthed) return;
    setIsLoading(true);
    supabase
      .from('teacher_profiles')
      .select('id, subject, title, location, experience_years, professional_qualification, profile_completion, expected_salary_min, expected_salary_max, created_at, profiles!inner(full_name, avatar_url)')
      .eq('is_visible', true)
      .limit(50)
      .then(({ data }) => {
        if (data) {
          setDbTeachers((data as any[]).map((t: any) => ({
            id: t.id,
            created_at: t.created_at,
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
          })));
        }
        setIsLoading(false);
      });
  }, [isAuthed]); // eslint-disable-line

  const clearAll = () => {
    setSelectedVerification([]); setSelectedQuals([]);
    setSelectedExperiences([]); setSelectedBoards([]); setSelectedLevels([]);
    setSelectedModes([]); setSelectedNotice([]); setSelectedState("All States"); setSortBy("default");
  };
  const activeFilterCount = selectedVerification.length + selectedQuals.length + selectedExperiences.length + selectedBoards.length + selectedLevels.length + selectedModes.length + selectedNotice.length;

  const filteredTeachers = useMemo(() => {
    let r = dbTeachers.filter(t => {
      if (activeSubject !== "All" && !(t.subject || "").toLowerCase().includes(activeSubject.toLowerCase())) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (!t.name.toLowerCase().includes(q) && !t.title.toLowerCase().includes(q) && !(t.subject || "").toLowerCase().includes(q)) return false;
      }
      if (citySearch && !t.location.toLowerCase().includes(citySearch.toLowerCase())) return false;
      if (selectedState !== "All States" && !t.location.toLowerCase().includes(selectedState.toLowerCase())) return false;
      if (selectedVerification.includes("Verified Only") && !t.verified) return false;
      if (selectedVerification.includes("Profile > 80%") && t.profile_completion <= 80) return false;
      if (selectedQuals.length > 0 && !selectedQuals.some(q => (t.professional_qualification || "").toLowerCase().includes(q.toLowerCase()))) return false;
      if (selectedBoards.length > 0 && !selectedBoards.some(b => (t.title || t.subject || "").toLowerCase().includes(b.toLowerCase()))) return false;
      if (selectedLevels.length > 0 && !selectedLevels.some(l => (t.title || t.subject || "").toLowerCase().includes(l.toLowerCase()))) return false;
      if (selectedExperiences.length > 0) {
        const exp = t.experience_years || 0;
        if (!selectedExperiences.some(e => {
          if (e === "Less than a year") return exp === 0;
          if (e === "1–3 years") return exp >= 1 && exp <= 3;
          if (e === "3–5 years") return exp >= 3 && exp <= 5;
          if (e === "5–10 years") return exp >= 5 && exp <= 10;
          if (e === "10+ years") return exp > 10;
          return false;
        })) return false;
      }
      return true;
    });
    if (sortBy === "experience_desc") r = [...r].sort((a, b) => b.experience_years - a.experience_years);
    else if (sortBy === "experience_asc") r = [...r].sort((a, b) => a.experience_years - b.experience_years);
    else if (sortBy === "name_asc") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "completion_desc") r = [...r].sort((a, b) => b.profile_completion - a.profile_completion);
    else if (sortBy === "default" || sortBy === "newest") r = [...r].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    return r;
  }, [searchTerm, citySearch, activeSubject, dbTeachers, selectedVerification, selectedQuals, selectedExperiences, selectedBoards, selectedLevels, selectedModes, selectedNotice, selectedState, sortBy]);

  const filterProps = { selectedVerification, setSelectedVerification, selectedQuals, setSelectedQuals, selectedExperiences, setSelectedExperiences, selectedBoards, setSelectedBoards, selectedLevels, setSelectedLevels, selectedModes, setSelectedModes, selectedNotice, setSelectedNotice, clearAll };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative ml-auto w-[85vw] max-w-sm h-full bg-white flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <span className="font-bold text-gray-900 text-base">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <FaXmark className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6"><FilterPanel {...filterProps} /></div>
            <div className="p-4 border-t border-gray-100">
              <button onClick={() => setMobileFilterOpen(false)} className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm">
                Show {filteredTeachers.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !isAuthed ? (
        <AuthGate onSignIn={() => openSignIn()} onRegister={() => openInstitutionRegistration()} />
      ) : (
        <main className="flex-1 pb-6">
          <div className="max-w-[1700px] w-full mx-auto px-3 sm:px-4 lg:px-6 pt-2 lg:pt-3">
            <div className="flex gap-5 lg:gap-6 mt-1">

              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-14 bg-white rounded-2xl border border-gray-200 p-4.5 h-[calc(100vh-4.5rem)] overflow-hidden flex flex-col">
                  <FilterPanel {...filterProps} />
                </div>
              </aside>

              {/* Main */}
              <div className="flex-1 min-w-0">

                {/* Search Bar + Subject Dropdown row */}
                <div className="mb-2.5">
                  <div className="bg-white border border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center" style={{ borderRadius: "10px" }}>
                    <div className="flex-1 flex items-center px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-0">
                      <FaMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 mr-2.5 shrink-0" />
                      <input
                        type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by name, subject or title..."
                        className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900 font-medium search-input"
                      />
                    </div>
                    <div className="flex-1 flex items-center px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-0">
                      <FaLocationDot className="w-3.5 h-3.5 text-gray-400 mr-2.5 shrink-0" />
                      <input
                        type="text" value={citySearch} onChange={e => setCitySearch(e.target.value)}
                        placeholder="City or district..."
                        className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900 font-medium search-input"
                      />
                    </div>
                    {/* Subject dropdown */}
                    <div className="flex items-center px-2 py-1.5 border-b sm:border-b-0 sm:border-r border-gray-200 w-full sm:w-40">
                      <CustomSelect
                        value={activeSubject === "All" ? "" : activeSubject}
                        onChange={v => setActiveSubject(v || "All")}
                        options={SUBJECTS.filter(s => s !== "All").map(s => ({ value: s, label: s }))}
                        placeholder="All Subjects"
                        searchable
                      />
                    </div>
                    {/* State dropdown */}
                    <div className="hidden sm:flex items-center px-2 py-1.5 sm:border-r border-gray-200 w-36">
                      <CustomSelect value={selectedState} onChange={setSelectedState} options={INDIA_STATES_OPTIONS} placeholder="All States" searchable />
                    </div>
                    <button className="bg-[#00a264] text-white px-4 py-2 font-semibold hover:bg-[#008f58] transition-colors shrink-0 flex items-center justify-center gap-2 m-1 text-sm" style={{ borderRadius: "8px" }}>
                      <FaMagnifyingGlass className="w-3.5 h-3.5" /> Find
                    </button>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setMobileFilterOpen(true)}
                      className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-400">
                      <FaFilter className="w-3 h-3 text-gray-500" />
                      Filters
                      {activeFilterCount > 0 && <span className="w-4 h-4 rounded-full bg-gray-900 text-white text-[9px] font-bold flex items-center justify-center">{activeFilterCount}</span>}
                    </button>
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      <span className="font-bold text-gray-900">{isLoading ? "…" : filteredTeachers.length}</span> teachers found
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Sort — custom dropdown */}
                    <CustomSortDropdown value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
                    <div className="hidden sm:flex items-center bg-white rounded-lg p-0.5 border border-gray-200">
                      <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                        <FaTableCellsLarge className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                        <FaBars className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cards */}
                {isLoading ? (
                  <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'grid-cols-1'}`}>
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : filteredTeachers.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <p className="text-gray-400 text-sm">No teachers match your search criteria.</p>
                    <button onClick={clearAll} className="mt-3 text-[#00a264] text-sm font-semibold hover:underline">Clear all filters</button>
                  </div>
                ) : (
                  <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'grid-cols-1'}`}>
                    {filteredTeachers.map(tp => (
                      <div key={tp.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#00a264]/60 transition-all group flex flex-col">
                        <div className="p-3.5 flex-1">
                          {/* Header */}
                          <div className="flex items-center gap-2.5 mb-3">
                            <div className="shrink-0 flex items-center justify-center text-sm font-bold overflow-hidden rounded-full bg-gray-100 text-gray-600" style={{ width: 40, height: 40 }}>
                              {tp.avatar_url
                                ? <img src={tp.avatar_url} alt={tp.name} className="w-full h-full object-cover rounded-full" />
                                : tp.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 mb-0.5">
                                <h3 className="text-sm font-bold text-gray-900 truncate leading-tight group-hover:text-black">{tp.name}</h3>
                                {tp.verified && <FaCircleCheck className="w-3 h-3 text-[#00a264] shrink-0" />}
                              </div>
                              <p className="text-xs text-gray-500 truncate">{tp.title}</p>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2.5">
                            <FaLocationDot className="w-2.5 h-2.5 shrink-0 text-[#00a264]" />
                            <span className="truncate">{tp.location}</span>
                          </div>

                          {/* Details — 2 col compact */}
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
                            <div>
                              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Exp</p>
                              <p className="text-gray-800 font-semibold">{tp.experience_years ? `${tp.experience_years} yrs` : "Fresher"}</p>
                            </div>
                            {tp.subject && (
                              <div>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Subject</p>
                                <p className="text-gray-800 font-semibold truncate">{tp.subject}</p>
                              </div>
                            )}
                            {tp.professional_qualification && (
                              <div className="col-span-2">
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Qual</p>
                                <p className="text-gray-800 font-semibold truncate">{tp.professional_qualification}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-3.5 py-2.5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between mb-1">
                              <span className="text-[10px] text-gray-400 font-medium">Profile</span>
                              <span className="text-[10px] font-bold text-gray-600">{tp.profile_completion}%</span>
                            </div>
                            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#00a264] rounded-full" style={{ width: `${tp.profile_completion}%` }} />
                            </div>
                          </div>
                          <Link href={`/teachers/${tp.id}`} className="px-3 py-1.5 text-xs font-bold text-white bg-[#00a264] hover:bg-[#007a4d] transition-all shrink-0 rounded-lg">
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}

export default function TeachersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">Loading...</div>
        </main>
      </div>
    }>
      <TeachersPageInner />
    </Suspense>
  );
}
