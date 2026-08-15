"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CustomSelect from "@/components/ui/CustomSelect";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatSalary } from "@/lib/utils";
import {
  FaMagnifyingGlass, FaLocationDot, FaBookmark, FaRegBookmark, FaCircleCheck,
  FaBars, FaTableCellsLarge, FaBriefcase, FaFilter, FaXmark, FaIndianRupeeSign, FaSort, FaLock, FaChevronDown, FaCheck
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
  { value: "default", label: "Newest First" },
  { value: "salary_desc", label: "Salary: High to Low" },
  { value: "salary_asc", label: "Salary: Low to High" },
  { value: "title_asc", label: "Title: A–Z" },
];

const SALARY_MIN = 15000;
const SALARY_MAX = 150000;

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
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:border-gray-400 transition-all shadow-sm cursor-pointer"
      >
        <FaSort className="w-3 h-3 text-[#00a264]" />
        <span>{selectedOption.label}</span>
        <FaChevronDown className={`w-2.5 h-2.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in duration-100">
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
  selectedJobTypes, setSelectedJobTypes,
  openToRemote, setOpenToRemote,
  salaryRange, setSalaryRange,
  selectedExperiences, setSelectedExperiences,
  selectedBoards, setSelectedBoards,
  selectedInstTypes, setSelectedInstTypes,
  selectedQuals, setSelectedQuals,
  postedDate, setPostedDate,
  clearAll,
}: any) {
  const toggleCheckbox = (state: string[], setState: any, val: string) => {
    setState((prev: string[]) => prev.includes(val) ? prev.filter((i: string) => i !== val) : [...prev, val]);
  };

  const formatSalaryLabel = (val: number) => {
    if (val >= SALARY_MAX) return "₹1,50,000+";
    return `₹${(val / 1000).toFixed(0)},000`;
  };

  return (
    <div className="flex flex-col h-full text-sm text-gray-700">
      <div className="flex items-center justify-between mb-4 shrink-0 pb-2 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
          <FaFilter className="w-3.5 h-3.5 text-[#00a264]" /> Filters
        </h2>
        <button onClick={clearAll} className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">Clear All</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
        {/* Job Type */}
        <div>
          <p className="text-xs font-bold mb-2.5 text-gray-700 uppercase tracking-wide">Job Type</p>
          <div className="space-y-2">
            {["Contract", "Full-time", "Part-time", "Internship"].map(type => (
              <label key={type} className="flex items-center gap-2.5 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedJobTypes, setSelectedJobTypes, type); }}>
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${selectedJobTypes.includes(type) ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover:border-gray-500 bg-white'}`}>
                  {selectedJobTypes.includes(type) && <FaCircleCheck className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 select-none">{type}</span>
              </label>
            ))}
          </div>
        </div>
        <hr className="border-gray-100" />

        {/* Remote */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">Open to remote</span>
          <button
            onClick={() => setOpenToRemote(!openToRemote)}
            className={`relative transition-colors shrink-0 ${openToRemote ? 'bg-[#00a264]' : 'bg-gray-300'}`}
            style={{ width: 36, height: 20, borderRadius: 999 }}
          >
            <div className={`absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-all ${openToRemote ? 'left-[18px]' : 'left-[2px]'}`} />
          </button>
        </div>
        <hr className="border-gray-100" />

        {/* Board / Curriculum */}
        <div>
          <p className="text-xs font-bold mb-2.5 text-gray-700 uppercase tracking-wide">Board / Curriculum</p>
          <div className="space-y-2">
            {["CBSE", "ICSE", "IB", "IGCSE", "State Board"].map(board => (
              <label key={board} className="flex items-center gap-2.5 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedBoards, setSelectedBoards, board); }}>
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${selectedBoards.includes(board) ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover:border-gray-500 bg-white'}`}>
                  {selectedBoards.includes(board) && <FaCircleCheck className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 select-none">{board}</span>
              </label>
            ))}
          </div>
        </div>
        <hr className="border-gray-100" />

        {/* Salary Range Slider */}
        <div>
          <p className="text-xs font-bold mb-2.5 text-gray-700 uppercase tracking-wide">Salary Range</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>{formatSalaryLabel(salaryRange[0])}</span>
              <span>{formatSalaryLabel(salaryRange[1])}</span>
            </div>
            <div className="relative h-5 flex items-center">
              <div className="absolute left-0 right-0 h-1.5 bg-gray-200" style={{ borderRadius: "999px" }} />
              <div
                className="absolute h-1.5 bg-[#00a264] transition-all duration-150"
                style={{
                  left: `${((salaryRange[0] - SALARY_MIN) / (SALARY_MAX - SALARY_MIN)) * 100}%`,
                  right: `${100 - ((salaryRange[1] - SALARY_MIN) / (SALARY_MAX - SALARY_MIN)) * 100}%`,
                  borderRadius: "999px"
                }}
              />
              <input type="range" min={SALARY_MIN} max={SALARY_MAX} step={5000} value={salaryRange[0]}
                onChange={(e) => { const val = Math.min(Number(e.target.value), salaryRange[1] - 5000); setSalaryRange([val, salaryRange[1]]); }}
                className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer salary-slider-thumb"
                style={{ zIndex: salaryRange[0] > SALARY_MAX - 5000 ? 5 : 3 }}
              />
              <input type="range" min={SALARY_MIN} max={SALARY_MAX} step={5000} value={salaryRange[1]}
                onChange={(e) => { const val = Math.max(Number(e.target.value), salaryRange[0] + 5000); setSalaryRange([salaryRange[0], val]); }}
                className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer salary-slider-thumb"
                style={{ zIndex: 4 }}
              />
            </div>
          </div>
        </div>
        <hr className="border-gray-100" />

        {/* Experience */}
        <div>
          <p className="text-xs font-bold mb-2.5 text-gray-700 uppercase tracking-wide">Experience</p>
          <div className="space-y-2">
            {["Less than a year", "1-3 years", "3-5 years", "5-10 years", "More than 10 years"].map(exp => (
              <label key={exp} className="flex items-center gap-2.5 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedExperiences, setSelectedExperiences, exp); }}>
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${selectedExperiences.includes(exp) ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover:border-gray-500 bg-white'}`}>
                  {selectedExperiences.includes(exp) && <FaCircleCheck className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 select-none">{exp}</span>
              </label>
            ))}
          </div>
        </div>
        <hr className="border-gray-100" />

        {/* Institution Type */}
        <div>
          <p className="text-xs font-bold mb-2.5 text-gray-700 uppercase tracking-wide">Institution Type</p>
          <div className="space-y-2">
            {["International School", "Private School", "Government", "Coaching Institute"].map(inst => (
              <label key={inst} className="flex items-center gap-2.5 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedInstTypes, setSelectedInstTypes, inst); }}>
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${selectedInstTypes.includes(inst) ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover:border-gray-500 bg-white'}`}>
                  {selectedInstTypes.includes(inst) && <FaCircleCheck className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 select-none">{inst}</span>
              </label>
            ))}
          </div>
        </div>
        <hr className="border-gray-100" />

        {/* Qualification Required */}
        <div>
          <p className="text-xs font-bold mb-2.5 text-gray-700 uppercase tracking-wide">Qualification</p>
          <div className="space-y-2">
            {["B.Ed", "M.Ed", "M.Sc", "Ph.D", "Graduate"].map(qual => (
              <label key={qual} className="flex items-center gap-2.5 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedQuals, setSelectedQuals, qual); }}>
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${selectedQuals.includes(qual) ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover:border-gray-500 bg-white'}`}>
                  {selectedQuals.includes(qual) && <FaCircleCheck className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 select-none">{qual}</span>
              </label>
            ))}
          </div>
        </div>
        <hr className="border-gray-100" />

        {/* Posted Date */}
        <div>
          <p className="text-xs font-bold mb-2.5 text-gray-700 uppercase tracking-wide">Date Posted</p>
          <div className="space-y-2">
            {["Any time", "Past 24 hours", "Past week", "Past month"].map(period => (
              <label key={period} className="flex items-center gap-2.5 cursor-pointer group" onClick={(e) => { e.preventDefault(); setPostedDate(period); }}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors shrink-0 ${postedDate === period ? 'border-[#00a264] bg-[#00a264]' : 'border-gray-300 group-hover:border-gray-500 bg-white'}`}>
                  {postedDate === period && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 select-none">{period}</span>
              </label>
            ))}
          </div>
        </div>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign in to view job listings</h2>
        <p className="text-gray-500 text-base mb-8 leading-relaxed">
          Browse hundreds of verified teaching vacancies across India. Sign in or create a free account to apply.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onSignIn} className="px-8 py-3 bg-[#00a264] text-white font-semibold rounded-xl hover:bg-[#007a4d] transition-colors text-base">
            Sign In
          </button>
          <button onClick={onRegister} className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors text-base">
            Register Free
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 animate-pulse" style={{ borderRadius: "1rem" }}>
      <div className="p-4">
        <div className="flex gap-3 mb-3">
          <div className="w-9 h-9 bg-gray-200" style={{ borderRadius: "0.75rem" }} />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
        <div className="flex gap-2 mb-2">
          <div className="h-5 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-100 rounded-full w-12" />
        </div>
      </div>
      <div className="px-4 py-3 border-t border-gray-100 flex justify-between">
        <div className="h-4 bg-gray-100 rounded w-20" />
        <div className="h-7 bg-gray-100 rounded-lg w-20" />
      </div>
    </div>
  );
}

// ─── Inner page (uses useSearchParams) ───────────────────────────────────────
function JobsPageInner() {
  const searchParams = useSearchParams();
  const { requireTeacher, user, loading, openSignIn, openTeacherRegistration } = useAuth();

  const isAuthed = !!user;

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [citySearch, setCitySearch] = useState(searchParams.get("location") || "");
  const [activeSubject, setActiveSubject] = useState(searchParams.get("subject") || "All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [dbJobs, setDbJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    setIsLoading(true);
    supabase
      .from('jobs')
      .select('*, institutions(verified)')
      .eq('status', 'published')
      .then(({ data }) => {
        if (data) {
          const mappedJobs = (data as any[]).map((j: any) => ({
            ...j,
            school: j.school_name || "Unknown School",
            schoolVerified: j.institutions?.verified || false,
            location: j.location || "Remote",
            salaryMin: j.salary_min,
            salaryMax: j.salary_max,
            experienceMin: j.experience_min,
            experienceMax: j.experience_max,
            subject: j.subject,
            employmentType: j.employment_type || "Full-time",
            postedDate: new Date(j.created_at).toLocaleDateString(),
          }));
          setDbJobs(mappedJobs);
        }
        setIsLoading(false);
      });
  }, []); // eslint-disable-line

  // Filters
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [openToRemote, setOpenToRemote] = useState(false);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([SALARY_MIN, SALARY_MAX]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [selectedInstTypes, setSelectedInstTypes] = useState<string[]>([]);
  const [selectedQuals, setSelectedQuals] = useState<string[]>([]);
  const [postedDate, setPostedDate] = useState<string>("Any time");
  const [selectedState, setSelectedState] = useState("All States");
  const [sortBy, setSortBy] = useState("default");

  // Watchlist — stores actual job UUIDs
  const [watchlist, setWatchlist] = useState<string[]>([]);
  useEffect(() => {
    const savedIds = localStorage.getItem('xyroots_watchlist');
    if (savedIds) { try { setWatchlist(JSON.parse(savedIds)); } catch (e) {} }
  }, []);

  const toggleWatchlist = (jobId: string) => {
    if (!user) {
      openSignIn();
      return;
    }
    setWatchlist(prev => {
      const next = prev.includes(jobId) ? prev.filter(s => s !== jobId) : [...prev, jobId];
      localStorage.setItem('xyroots_watchlist', JSON.stringify(next));
      return next;
    });
  };

  const clearAll = () => {
    setSelectedJobTypes([]);
    setSalaryRange([SALARY_MIN, SALARY_MAX]);
    setSelectedExperiences([]);
    setSelectedBoards([]);
    setSelectedInstTypes([]);
    setSelectedQuals([]);
    setPostedDate("Any time");
    setSelectedState("All States");
    setOpenToRemote(false);
    setSortBy("default");
  };

  const activeFilterCount = selectedJobTypes.length + selectedExperiences.length + selectedBoards.length + selectedInstTypes.length + selectedQuals.length + (postedDate !== "Any time" ? 1 : 0) + (openToRemote ? 1 : 0) + (salaryRange[0] > SALARY_MIN || salaryRange[1] < SALARY_MAX ? 1 : 0);

  const filteredJobs = useMemo(() => {
    let result = dbJobs.filter(job => {
      if (activeSubject && activeSubject !== "All") {
        const jobSubject = (job.subject || "").toLowerCase();
        if (!jobSubject.includes(activeSubject.toLowerCase())) return false;
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!job.title?.toLowerCase().includes(term) &&
            !(job.subject ?? '').toLowerCase().includes(term) &&
            !(job.school ?? '').toLowerCase().includes(term)) {
          return false;
        }
      }
      if (citySearch) {
        const city = citySearch.toLowerCase();
        if (!(job.location ?? '').toLowerCase().includes(city)) {
          return false;
        }
      }
      if (selectedState && selectedState !== "All States") {
        if (!(job.location ?? '').toLowerCase().includes(selectedState.toLowerCase())) return false;
      }
      if (selectedJobTypes.length > 0 && !selectedJobTypes.includes(job.employmentType)) return false;

      if (selectedBoards.length > 0 && !selectedBoards.some(b => (job.board || "").toLowerCase().includes(b.toLowerCase()))) return false;
      if (selectedInstTypes.length > 0 && !selectedInstTypes.some(t => (job.school || "").toLowerCase().includes(t.toLowerCase()))) return false;
      if (selectedQuals.length > 0 && !selectedQuals.some(q => (job.qualification || "").toLowerCase().includes(q.toLowerCase()))) return false;

      // Salary range filter
      if (salaryRange[0] > SALARY_MIN || salaryRange[1] < SALARY_MAX) {
        const jobMin = job.salaryMin ?? 0;
        const jobMax = job.salaryMax ?? job.salaryMin ?? 0;
        if (jobMin > 0 || jobMax > 0) {
          if (jobMax < salaryRange[0] || jobMin > salaryRange[1]) return false;
        }
      }

      if (selectedExperiences.length > 0) {
        const expMin = job.experienceMin ?? 0;
        const hasMatch = selectedExperiences.some(e => {
          if (e === "Less than a year") return expMin === 0;
          if (e === "1-3 years") return expMin >= 1 && expMin <= 3;
          if (e === "3-5 years") return expMin >= 3 && expMin <= 5;
          if (e === "5-10 years") return expMin >= 5 && expMin <= 10;
          if (e === "More than 10 years") return expMin > 10;
          return false;
        });
        if (!hasMatch) return false;
      }
      return true;
    });

    if (sortBy === "salary_desc") result = [...result].sort((a, b) => (b.salaryMax ?? b.salaryMin ?? 0) - (a.salaryMax ?? a.salaryMin ?? 0));
    else if (sortBy === "salary_asc") result = [...result].sort((a, b) => (a.salaryMin ?? 0) - (b.salaryMin ?? 0));
    else if (sortBy === "title_asc") result = [...result].sort((a, b) => (a.title || "").localeCompare(b.title || ""));

    return result;
  }, [searchTerm, citySearch, activeSubject, dbJobs, selectedJobTypes, selectedExperiences, selectedBoards, selectedInstTypes, selectedQuals, postedDate, selectedState, salaryRange, sortBy]);

  const filterProps = { selectedJobTypes, setSelectedJobTypes, openToRemote, setOpenToRemote, salaryRange, setSalaryRange, selectedExperiences, setSelectedExperiences, selectedBoards, setSelectedBoards, selectedInstTypes, setSelectedInstTypes, selectedQuals, setSelectedQuals, postedDate, setPostedDate, clearAll };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />

      {!loading && !isAuthed ? (
        <>
          <AuthGate onSignIn={() => openSignIn()} onRegister={() => openTeacherRegistration()} />
        </>
      ) : (
      <>
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
                Show {filteredJobs.length} Jobs
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 pb-6">
        <div className="max-w-[1700px] w-full mx-auto px-3 sm:px-4 lg:px-6 pt-2 lg:pt-3">

          {/* Layout */}
          <div className="flex gap-5 lg:gap-6 mt-1">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-14 bg-white rounded-2xl border border-gray-200 shadow-sm p-4.5 h-[calc(100vh-4.5rem)] overflow-hidden flex flex-col">
                <FilterPanel {...filterProps} />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">

              {/* Search Bar */}
              <div className="pb-2">
                <div className="bg-white border border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-0" style={{ borderRadius: "1.5rem", height: "auto" }}>
                  <div className="flex-1 flex items-center px-3 py-2 sm:py-1.5 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-0">
                    <FaMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Job Title, Subject, School..."
                      className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900 font-medium min-w-0 search-input"
                    />
                  </div>
                  <div className="flex-1 flex items-center px-3 py-2 sm:py-1.5 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-0">
                    <FaLocationDot className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      placeholder="Any City"
                      className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900 font-medium min-w-0 search-input"
                    />
                  </div>
                  {/* State Dropdown - hidden on mobile, merged with city */}
                  <div className="hidden sm:flex items-center px-2 py-1.5 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-0 w-full sm:w-40">
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
                  <button className="bg-[#00a264] text-white px-4 py-2 sm:py-1.5 text-sm font-semibold hover:bg-[#008f58] transition-colors shrink-0 flex items-center justify-center gap-1.5 m-1" style={{ borderRadius: "0.375rem" }}>
                    <FaMagnifyingGlass className="w-3 h-3" /> Search
                  </button>
                </div>
              </div>

              {/* Subject Bubble Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                {SUBJECTS.map(subject => (
                  <button
                    key={subject}
                    onClick={() => setActiveSubject(subject)}
                    className={`px-4 py-1 flex items-center justify-center text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
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

              {/* Toolbar */}
              <div className="flex items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 shadow-sm hover:border-gray-400 transition-colors"
                  >
                    <FaFilter className="w-3 h-3 text-gray-600" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-gray-900 text-white text-[9px] font-bold flex items-center justify-center">{activeFilterCount}</span>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    <span className="font-bold text-gray-900">{isLoading ? "..." : filteredJobs.length}</span> jobs found
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Sort — custom dropdown */}
                  <CustomSortDropdown value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
                  <div className="hidden sm:flex items-center bg-white rounded-lg p-0.5 border border-gray-200 shadow-sm">
                    <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                      <FaTableCellsLarge className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}>
                      <FaBars className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Skeleton or Job Cards */}
              {isLoading ? (
                <div className={`grid gap-3 lg:gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <p className="text-gray-500 text-sm">No jobs match your search yet. Check back soon!</p>
                </div>
              ) : (
                <div className={`grid gap-3 lg:gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {filteredJobs.map((job, i) => {
                    const isSaved = watchlist.includes(job.id);
                    return (
                      <div key={job.id} className="bg-white border border-gray-200 overflow-hidden hover:border-[#00a264]/50 hover:shadow-[0_2px_12px_rgba(0,162,100,0.08)] transition-all group flex flex-col" style={{ borderRadius: "1rem" }}>
                        <div className="p-4 flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-1 leading-tight mb-0.5">{job.title}</h3>
                              <p className="text-xs text-gray-500 line-clamp-1">{job.school} • {job.location}</p>
                            </div>
                            <button
                              onClick={() => toggleWatchlist(job.id)}
                              className={`transition-colors shrink-0 ml-2 ${isSaved ? 'text-[#00a264]' : 'text-gray-300 hover:text-[#00a264]'}`}
                            >
                              {isSaved ? <FaBookmark className="w-3.5 h-3.5" /> : <FaRegBookmark className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* Tags row */}
                          <div className="flex flex-wrap gap-1 mb-2.5">
                            <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 text-[11px] font-semibold" style={{ borderRadius: "0.25rem" }}>{job.employmentType}</span>
                            {job.board && <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 text-[11px] font-semibold" style={{ borderRadius: "0.25rem" }}>{job.board}</span>}
                            {job.subject && <span className="px-2 py-0.5 bg-[#e6f7ed] border border-[#00a264]/20 text-[#00a264] text-[11px] font-semibold" style={{ borderRadius: "0.25rem" }}>{job.subject}</span>}
                          </div>

                          {/* Details grid */}
                          <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-[11px]">
                            <div>
                              <p className="font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Experience</p>
                              <p className="text-gray-700 font-medium">{job.experienceMin ?? 0}–{job.experienceMax ?? '?'} yrs</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Posted</p>
                              <p className="text-gray-700 font-medium">{job.postedDate}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Salary</p>
                              <p className="text-[#00a264] font-semibold">
                                {job.salaryMin && job.salaryMax
                                  ? `₹${(job.salaryMin/1000).toFixed(0)}k–${(job.salaryMax/1000).toFixed(0)}k`
                                  : 'Negotiable'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 py-2.5 flex items-center justify-between border-t border-gray-100 bg-gray-50/60">
                          <div className="text-[13px] font-bold text-gray-700 flex items-center gap-0.5">
                            <FaIndianRupeeSign className="w-2.5 h-2.5" />
                            {job.salaryMin && job.salaryMax
                              ? `${(job.salaryMin / 1000).toFixed(0)}k–${(job.salaryMax / 1000).toFixed(0)}k`
                              : 'Negotiable'}
                            {job.salaryMin && <span className="text-[11px] font-medium text-gray-400 ml-0.5">/mo</span>}
                          </div>
                          <Link
                            href={`/jobs/${job.id}`}
                            className="px-3 py-1.5 bg-[#00a264] text-white hover:bg-[#007a4d] text-[11px] font-bold transition-all"
                            style={{ borderRadius: "0.5rem" }}
                          >
                            Apply Now
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
      </>
      )}
    </div>
  );
}

// ─── Default export wraps inner in Suspense (required for useSearchParams) ───
export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400 text-sm">Loading...</div>
        </main>
      </div>
    }>
      <JobsPageInner />
    </Suspense>
  );
}

