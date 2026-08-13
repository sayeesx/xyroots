"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import { formatSalary } from "@/lib/utils";
import {
  FaMagnifyingGlass, FaLocationDot, FaBookmark, FaRegBookmark, FaCircleCheck,
  FaChevronDown, FaBars, FaTableCellsLarge, FaBriefcase, FaFilter, FaXmark, FaIndianRupeeSign
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";

// ─── Filter Panel (shared) ───────────────────────────────────────────────────
function FilterPanel({
  selectedJobTypes, setSelectedJobTypes,
  openToRemote, setOpenToRemote,
  selectedSalaryRanges, setSelectedSalaryRanges,
  useCustomSalary, setUseCustomSalary,
  customSalaryMin, setCustomSalaryMin,
  customSalaryMax, setCustomSalaryMax,
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

      {/* Job Type */}
      <div>
        <p className="font-semibold mb-3 text-gray-800">Job Type</p>
        <div className="space-y-2.5">
          {["Contract", "Full-time", "Part-time", "Internship"].map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedJobTypes, setSelectedJobTypes, type); }}>
              <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors shrink-0 ${selectedJobTypes.includes(type) ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
                {selectedJobTypes.includes(type) && <FaCircleCheck className="w-3 h-3 text-white" />}
              </div>
              <span className="text-gray-600 group-hover:text-gray-900 select-none">{type}</span>
            </label>
          ))}
        </div>
      </div>
      <hr className="border-gray-200" />

      {/* Remote */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-800">Open to remote</span>
        <button
          onClick={() => setOpenToRemote(!openToRemote)}
          className={`w-10 h-5.5 rounded-full relative transition-colors shrink-0 ${openToRemote ? 'bg-xyroots-teal' : 'bg-gray-300'}`}
          style={{ width: 40, height: 22 }}
        >
          <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all ${openToRemote ? 'left-[20px]' : 'left-[3px]'}`} />
        </button>
      </div>
      <hr className="border-gray-200" />

      {/* Salary */}
      <div>
        <p className="font-semibold mb-3 text-gray-800">Salary Range</p>
        <div className="space-y-2.5 mb-3">
          {[
            { label: "Less than ₹20,000", key: "lt20" },
            { label: "₹20,000 – ₹40,000", key: "20-40" },
            { label: "₹40,000 – ₹60,000", key: "40-60" },
            { label: "More than ₹60,000", key: "gt60" },
          ].map(range => (
            <label key={range.key} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); if (useCustomSalary) setUseCustomSalary(false); toggleCheckbox(selectedSalaryRanges, setSelectedSalaryRanges, range.key); }}>
              <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors shrink-0 ${!useCustomSalary && selectedSalaryRanges.includes(range.key) ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
                {!useCustomSalary && selectedSalaryRanges.includes(range.key) && <FaCircleCheck className="w-3 h-3 text-white" />}
              </div>
              <span className="text-gray-600 group-hover:text-gray-900 select-none">{range.label}</span>
            </label>
          ))}
        </div>
        <label className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); setUseCustomSalary(!useCustomSalary); if (!useCustomSalary) setSelectedSalaryRanges([]); }}>
          <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors shrink-0 ${useCustomSalary ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
            {useCustomSalary && <FaCircleCheck className="w-3 h-3 text-white" />}
          </div>
          <span className="text-gray-600 group-hover:text-gray-900 select-none font-medium">Custom Range</span>
        </label>
        {useCustomSalary && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Min (₹)</label>
              <input type="number" value={customSalaryMin} onChange={(e) => setCustomSalaryMin(Number(e.target.value))} className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 outline-none focus:border-xyroots-teal" step={5000} min={0} />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Max (₹)</label>
              <input type="number" value={customSalaryMax} onChange={(e) => setCustomSalaryMax(Number(e.target.value))} className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 outline-none focus:border-xyroots-teal" step={5000} min={0} />
            </div>
          </div>
        )}
      </div>
      <hr className="border-gray-200" />

      {/* Experience */}
      <div>
        <p className="font-semibold mb-3 text-gray-800">Experience</p>
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
export default function JobsPage() {
  const { requireTeacher, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      if (typeof window !== "undefined") window.location.href = "/";
    }
  }, [loading, user]);

  const [searchTerm, setSearchTerm] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [dbJobs, setDbJobs] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('jobs').select('*, institutions(verified)').then(({ data }) => {
      if (data) {
        const mappedJobs = (data as any[]).map((j: any) => ({
          ...j,
          slug: `${j.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${j.id}`,
          school: j.school_name || "Unknown School",
          schoolVerified: j.institutions?.verified || false,
          location: j.location || "Remote",
          district: "",
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
    });
  }, []);

  // Filters
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [openToRemote, setOpenToRemote] = useState(false);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState<string[]>([]);
  const [useCustomSalary, setUseCustomSalary] = useState(false);
  const [customSalaryMin, setCustomSalaryMin] = useState(10000);
  const [customSalaryMax, setCustomSalaryMax] = useState(100000);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);

  // Watchlist
  const [watchlist, setWatchlist] = useState<string[]>([]);
  useEffect(() => {
    const savedIds = localStorage.getItem('xyroots_watchlist');
    if (savedIds) { try { setWatchlist(JSON.parse(savedIds)); } catch (e) {} }
  }, []);

  const toggleWatchlist = (slug: string) => {
    requireTeacher(() => {
      setWatchlist(prev => {
        const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
        localStorage.setItem('xyroots_watchlist', JSON.stringify(next));
        return next;
      });
    });
  };

  const clearAll = () => {
    setSelectedJobTypes([]);
    setSelectedSalaryRanges([]);
    setSelectedExperiences([]);
    setUseCustomSalary(false);
    setOpenToRemote(false);
  };

  const activeFilterCount = selectedJobTypes.length + selectedSalaryRanges.length + selectedExperiences.length + (openToRemote ? 1 : 0);

  const filteredJobs = useMemo(() => {
    return dbJobs.filter(job => {
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
        if (!(job.location ?? '').toLowerCase().includes(city) && !(job.district ?? '').toLowerCase().includes(city)) {
          return false;
        }
      }
      if (selectedJobTypes.length > 0 && !selectedJobTypes.includes(job.employmentType)) return false;
      if (selectedExperiences.length > 0) {
        const exp = job.experience ?? '';
        const hasMatch = selectedExperiences.some(e => exp.includes(e) || (e.includes('years') && exp !== 'Fresher'));
        if (!hasMatch) return false;
      }
      return true;
    });
  }, [searchTerm, citySearch, dbJobs, selectedJobTypes, selectedExperiences]);

  const filterProps = { selectedJobTypes, setSelectedJobTypes, openToRemote, setOpenToRemote, selectedSalaryRanges, setSelectedSalaryRanges, useCustomSalary, setUseCustomSalary, customSalaryMin, setCustomSalaryMin, customSalaryMax, setCustomSalaryMax, selectedExperiences, setSelectedExperiences, clearAll };

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
                Show {filteredJobs.length} Jobs
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 pt-14 lg:pt-16 pb-10">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search Bar */}
          <div className="pt-4 pb-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-1.5 flex flex-col sm:flex-row items-stretch sm:items-center">
              <div className="flex-1 flex items-center px-3 py-2.5 border-b sm:border-b-0 sm:border-r border-gray-200 min-w-0">
                <FaMagnifyingGlass className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Job Title, Subject, School..."
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
                <FaMagnifyingGlass className="w-3.5 h-3.5" /> Search
              </button>
            </div>
          </div>

          {/* Layout */}
          <div className="flex gap-6 lg:gap-8">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-60 shrink-0 sticky top-20 self-start overflow-y-auto max-h-[calc(100vh-5rem)] custom-scrollbar pb-10">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <FilterPanel {...filterProps} />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-2">
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
                    <span className="font-bold text-gray-900">{filteredJobs.length}</span> jobs found
                  </p>
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

              {/* Job Cards */}
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <p className="text-gray-500 text-sm">No jobs match your search yet. Check back soon!</p>
                </div>
              ) : (
                <div className={`grid gap-3 lg:gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredJobs.map((job, i) => {
                    const isSaved = watchlist.includes(job.slug);
                    return (
                      <div key={job.id} className="bg-white border rounded-2xl border-gray-100 overflow-hidden hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:border-xyroots-teal/30 transition-all group flex flex-col">
                        <div className="p-4 flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 shadow-sm" style={{ backgroundColor: ['#E6F4EA', '#E3F2FD', '#FDE7E9', '#FFF3E0'][i % 4] }}>
                                <span className="font-bold text-xs" style={{ color: ['#1e8e3e', '#1976d2', '#d32f2f', '#f57c00'][i % 4] }}>
                                  {(job.school || 'S').charAt(0)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-xyroots-teal transition-colors line-clamp-1 leading-tight mb-0.5">{job.title}</h3>
                                <p className="text-[11px] text-gray-500 line-clamp-1">{job.school} • {job.location}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleWatchlist(job.slug)}
                              className={`transition-colors shrink-0 ml-1 ${isSaved ? 'text-xyroots-teal' : 'text-gray-300 hover:text-xyroots-teal'}`}
                            >
                              {isSaved ? <FaBookmark className="w-3.5 h-3.5" /> : <FaRegBookmark className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mb-2">
                            <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[#4d5c6f] text-[10px] font-semibold rounded">{job.employmentType}</span>
                            {job.board && <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[#4d5c6f] text-[10px] font-semibold rounded">{job.board}</span>}
                            <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[#4d5c6f] text-[10px] font-semibold rounded">{job.experienceMin ?? 0}–{job.experienceMax ?? '?'} Yrs</span>
                          </div>
                        </div>

                        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100/60 bg-gray-50/40">
                          <div className="text-[13px] font-bold text-xyroots-teal flex items-center gap-0.5">
                            <FaIndianRupeeSign className="w-3 h-3" />
                            {job.salaryMin && job.salaryMax
                              ? `${(job.salaryMin / 1000).toFixed(0)}k–${(job.salaryMax / 1000).toFixed(0)}k`
                              : 'Negotiable'}
                            {job.salaryMin && <span className="text-[10px] font-medium text-xyroots-teal/70">/mo</span>}
                          </div>
                          <Link href={`/jobs/${job.slug}`} className="px-3 py-1.5 bg-xyroots-mint/40 text-black hover:bg-xyroots-teal hover:text-white rounded-lg text-[11px] font-bold transition-all border border-xyroots-teal/20 hover:border-xyroots-teal">
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
    </div>
  );
}
