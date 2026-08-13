"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { subjects, boards, locations, employmentTypes, experienceRanges } from "@/data/jobs";
import { createClient } from "@/lib/supabase/client";
import { formatSalary } from "@/lib/utils";
import {
  FaMagnifyingGlass, FaLocationDot, FaBookmark, FaRegBookmark, FaCircleCheck,
  FaChevronDown, FaBars, FaTableCellsLarge, FaBriefcase, FaFilter, FaIndianRupeeSign
} from "react-icons/fa6";

import { useAuth } from "@/lib/auth/AuthProvider";

export default function JobsPage() {
  const { requireTeacher, user, loading, openTeacherRegistration } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      if (typeof window !== "undefined") window.location.href = "/";
    }
  }, [loading, user, openTeacherRegistration]);
  const [searchTerm, setSearchTerm] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [dbJobs, setDbJobs] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from('jobs').select('*, institutions(verified)').then(({ data }) => {
      if (data) {
        const mappedJobs = (data as any[]).map((j: any) => ({
          ...j,
          id: j.id,
          title: j.title,
          slug: `${j.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${j.id}`,
          school: j.school_name || "Unknown School",
          schoolVerified: j.institutions?.verified || false,
          location: j.location || "Remote",
          district: "", // optional mapping
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
  const [openToRemote, setOpenToRemote] = useState(true);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState<string[]>([]);
  const [useCustomSalary, setUseCustomSalary] = useState(false);
  const [customSalaryMin, setCustomSalaryMin] = useState(10000);
  const [customSalaryMax, setCustomSalaryMax] = useState(100000);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>(["1-3 years"]);

  // Watchlist
  const [watchlist, setWatchlist] = useState<string[]>([]);
  
  useEffect(() => {
    const savedIds = localStorage.getItem('xyroots_watchlist');
    if (savedIds) {
      try {
        setWatchlist(JSON.parse(savedIds));
      } catch (e) {}
    }
  }, []);

  const toggleCheckbox = (state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setState(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  };

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
  };

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return dbJobs.filter(job => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!job.title.toLowerCase().includes(term) &&
            !job.subject.toLowerCase().includes(term) &&
            !job.school.toLowerCase().includes(term)) {
          return false;
        }
      }
      // City filter
      if (citySearch) {
        const city = citySearch.toLowerCase();
        if (!job.location.toLowerCase().includes(city) &&
            !job.district.toLowerCase().includes(city)) {
          return false;
        }
      }
      // Job Type filter
      if (selectedJobTypes.length > 0) {
        if (!selectedJobTypes.includes(job.type)) {
          return false;
        }
      }
      // Experience filter mapping (simplified check for demo)
      if (selectedExperiences.length > 0) {
        // Just checking if any selected experience string matches part of it
        const hasMatch = selectedExperiences.some(exp => job.experience.includes(exp) || exp.includes('years') && job.experience !== 'Fresher');
        if (!hasMatch) return false;
      }
      return true;
    });
  }, [searchTerm, citySearch, dbJobs, selectedJobTypes, selectedExperiences]);

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
                  placeholder="Job Title, Subject..." 
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
                  placeholder="All City" 
                  className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900 font-medium"
                />
              </div>
              <button className="bg-xyroots-teal text-white rounded-md px-8 py-2 text-sm font-semibold hover:bg-xyroots-dark transition-colors shrink-0 m-1 sm:m-0 flex items-center gap-2">
                <FaMagnifyingGlass className="w-3 h-3" /> Search
              </button>
            </div>
        </div>
        <div className="flex gap-8">
        {/* Left Sidebar Filter */}
        <aside className="hidden lg:block w-64 shrink-0 overflow-y-auto sticky top-24 h-[calc(100vh-6rem)] custom-scrollbar pr-4 pb-20 z-10">
          <div className="flex items-center justify-between mb-6 pt-2 pb-2">
            <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FaFilter className="w-3.5 h-3.5 text-xyroots-teal" />
              Filter
            </h2>
            <button onClick={clearAll} className="text-xs font-semibold text-xyroots-teal hover:text-black">Clear All</button>
          </div>

          <div className="space-y-6 text-sm text-gray-700">
            {/* Job Type */}
            <div>
              <button className="flex items-center justify-between w-full font-semibold mb-3 tracking-snug hover:text-xyroots-teal transition-colors">
                Job Type <FaChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              <div className="space-y-2.5">
                {["Contract", "Full-time", "Part-time", "Internship"].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCheckbox(selectedJobTypes, setSelectedJobTypes, type); }}>
                    <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors ${selectedJobTypes.includes(type) ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
                      {selectedJobTypes.includes(type) && <FaCircleCheck className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-gray-600 group-hover:text-gray-900 select-none">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Remote */}
            <div className="flex items-center justify-between font-semibold">
              <span className="tracking-snug">Open to remote</span>
              <button 
                onClick={() => setOpenToRemote(!openToRemote)}
                className={`w-9 h-5 rounded-full relative transition-colors ${openToRemote ? 'bg-xyroots-teal' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${openToRemote ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>

            <hr className="border-gray-200" />

            {/* Range Salary - INR based */}
            <div>
              <button className="flex items-center justify-between w-full font-semibold mb-3 tracking-snug hover:text-xyroots-teal transition-colors">
                Salary Range <FaChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              <div className="space-y-2.5 mb-4">
                {[
                  { label: "Less than ₹20,000", key: "lt20" },
                  { label: "₹20,000 - ₹40,000", key: "20-40" },
                  { label: "₹40,000 - ₹60,000", key: "40-60" },
                  { label: "More than ₹60,000", key: "gt60" },
                ].map(range => (
                  <label key={range.key} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); if (useCustomSalary) setUseCustomSalary(false); toggleCheckbox(selectedSalaryRanges, setSelectedSalaryRanges, range.key); }}>
                    <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors ${!useCustomSalary && selectedSalaryRanges.includes(range.key) ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
                      {!useCustomSalary && selectedSalaryRanges.includes(range.key) && <FaCircleCheck className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-gray-600 group-hover:text-gray-900 select-none">{range.label}</span>
                  </label>
                ))}
              </div>

              {/* Custom Salary Toggle */}
              <div className="mb-3">
                <label
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={(e) => {
                    e.preventDefault();
                    setUseCustomSalary(!useCustomSalary);
                    if (!useCustomSalary) setSelectedSalaryRanges([]);
                  }}
                >
                  <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors ${useCustomSalary ? 'bg-xyroots-teal border-xyroots-teal' : 'border-gray-300 group-hover:border-xyroots-teal/50 bg-white'}`}>
                    {useCustomSalary && <FaCircleCheck className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-gray-600 group-hover:text-gray-900 select-none font-medium">Custom Range</span>
                </label>
              </div>
              
              {/* Custom Salary Slider */}
              {useCustomSalary && (
                <div className="px-1 pb-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-gray-400 font-semibold uppercase mb-1 block">Min (₹)</label>
                      <input
                        type="number"
                        value={customSalaryMin}
                        onChange={(e) => setCustomSalaryMin(Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:border-xyroots-teal"
                        step={5000}
                        min={0}
                      />
                    </div>
                    <span className="text-gray-300 mt-4">—</span>
                    <div className="flex-1">
                      <label className="text-[10px] text-gray-400 font-semibold uppercase mb-1 block">Max (₹)</label>
                      <input
                        type="number"
                        value={customSalaryMax}
                        onChange={(e) => setCustomSalaryMax(Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:border-xyroots-teal"
                        step={5000}
                        min={0}
                      />
                    </div>
                  </div>
                  <div className="relative h-[2px] bg-gray-200 mt-2">
                    <div 
                      className="absolute h-full bg-xyroots-teal z-10" 
                      style={{ 
                        left: `${(customSalaryMin / 150000) * 100}%`, 
                        right: `${100 - (customSalaryMax / 150000) * 100}%` 
                      }} 
                    />
                  </div>
                  <div className="flex items-center justify-between text-gray-500 font-medium text-[11px]">
                    <span>₹{customSalaryMin.toLocaleString('en-IN')}</span>
                    <span>₹{customSalaryMax.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-gray-200" />

            {/* Experience */}
            <div>
              <button className="flex items-center justify-between w-full font-semibold mb-3 tracking-snug hover:text-xyroots-teal transition-colors">
                Experience <FaChevronDown className="w-3 h-3 text-gray-400" />
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

        {/* Main Content — scrollable container with search bar */}
        <div className="flex-1 w-full min-w-0 pb-16 relative overflow-y-auto">
          
          {/* Header Group for Search and Results sorting */}
          <div className="pt-4 pb-2 bg-gray-50/95 z-30 mb-4 border-b border-gray-200/50">
            

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className="text-[14px] text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredJobs.length}</span> Jobs for India
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                  Sort by
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded text-gray-800 hover:border-gray-300">
                    Relevancy <FaChevronDown className="w-2.5 h-2.5 text-gray-400" />
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

          {/* Job Grid — uses actual data with slug URLs */}
          <div className={`grid gap-3 lg:gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredJobs.map((job, i) => {
              const isSaved = watchlist.includes(job.slug);
              return (
                <div key={job.id} className="bg-white border rounded-[10px] border-gray-200 overflow-hidden hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:border-xyroots-teal/40 transition-all group flex flex-col">
                  <div className="p-3 flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-2.5">
                        {/* Logo Box */}
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 shadow-sm" style={{ backgroundColor: ['#E6F4EA', '#E3F2FD', '#FDE7E9', '#FFF3E0'][i % 4] }}>
                          <span className="font-bold text-xs" style={{ color: ['#1e8e3e', '#1976d2', '#d32f2f', '#f57c00'][i % 4] }}>
                            {job.school.charAt(0)}
                          </span>
                        </div>
                        <div>
                           <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-xyroots-teal transition-colors line-clamp-1 leading-tight mb-0.5">
                             {job.title}
                           </h3>
                           <p className="text-[11px] text-gray-500 line-clamp-1">
                             {job.school} {job.schoolVerified && <FaCircleCheck className="inline w-3 h-3 text-xyroots-teal ml-0.5" />} • {job.location}
                           </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleWatchlist(job.slug)}
                        className={`transition-colors shrink-0 ${isSaved ? 'text-xyroots-teal' : 'text-gray-300 hover:text-xyroots-teal'}`}
                        title={isSaved ? "Remove from watchlist" : "Save to watchlist"}
                      >
                        {isSaved ? <FaBookmark className="w-[14px] h-[14px]" /> : <FaRegBookmark className="w-[14px] h-[14px]" />}
                      </button>
                    </div>

                    {/* Badges / Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[#4d5c6f] text-[10px] font-semibold rounded pointer-events-none">{job.employmentType}</span>
                      <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[#4d5c6f] text-[10px] font-semibold rounded pointer-events-none">{job.board}</span>
                      <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-[#4d5c6f] text-[10px] font-semibold rounded pointer-events-none">{job.experienceMin}-{job.experienceMax} Yrs</span>
                    </div>
                    
                    <p className="text-[11px] text-gray-500 font-medium">
                      {job.applicants} Applicants
                    </p>
                  </div>

                  <div className="p-3 flex items-center justify-between border-t border-gray-100/50 mt-auto bg-gray-50/50">
                    <div className="text-[14px] font-bold text-xyroots-teal flex items-center gap-0.5">
                      <FaIndianRupeeSign className="w-3 h-3" />
                      {(job.salaryMin / 1000).toFixed(0)}k - {(job.salaryMax / 1000).toFixed(0)}k<span className="text-[10px] font-medium text-xyroots-teal/70">/mo</span>
                    </div>
                    <Link href={`/jobs/${job.slug}`} className="px-4 py-1.5 bg-xyroots-mint/30 text-black hover:bg-xyroots-teal hover:text-white rounded-md text-[11px] font-bold transition-all text-center border border-xyroots-teal/20 hover:border-xyroots-teal">
                      Apply Now
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
