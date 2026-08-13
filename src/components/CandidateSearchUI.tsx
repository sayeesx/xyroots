"use client";

import Link from "next/link";
import { FaMagnifyingGlass, FaLocationDot, FaShieldHalved, FaStar, FaAward, FaChevronRight, FaVideo, FaRegFileLines } from "react-icons/fa6";
import { teachers } from "@/data/teachers";

export default function CandidateSearchUI() {
  const sampleTeachers = teachers.slice(0, 3);

  return (
    <section className="section-padding bg-white relative overflow-hidden" aria-labelledby="candidate-search-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-xyroots-teal mb-4">
            Candidate Discovery
          </span>
          <h2 id="candidate-search-heading" className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-black mb-4">
            Discover Verified Talent in Seconds.
          </h2>
          <p className="text-base sm:text-lg text-xyroots-muted">
            Search qualified teachers filtered by board experience, subject specialization, and verified qualifications.
          </p>
        </div>

        {/* Mock Candidate Search Layout */}
        <div className="bg-xyroots-cream rounded-3xl p-4 sm:p-6 lg:p-8 border border-xyroots-border shadow-sm">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Filters Mock */}
            <div className="hidden lg:block bg-white rounded-2xl p-5 border border-xyroots-border h-fit space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-xyroots-border">
                <span className="text-sm font-bold text-black">Filters</span>
                <span className="text-xs text-xyroots-teal font-semibold cursor-pointer">Reset All</span>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-xyroots-muted block mb-2">Subject</label>
                <div className="space-y-1.5 text-xs text-xyroots-text">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-xyroots-teal accent-xyroots-teal" />
                    <span>Mathematics (1,240)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-xyroots-teal accent-xyroots-teal" />
                    <span>Physics (890)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-xyroots-teal accent-xyroots-teal" />
                    <span>Chemistry (740)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-xyroots-teal accent-xyroots-teal" />
                    <span>English (1,050)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-xyroots-muted block mb-2">Board</label>
                <div className="space-y-1.5 text-xs text-xyroots-text">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-xyroots-teal accent-xyroots-teal" />
                    <span>CBSE</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-xyroots-teal accent-xyroots-teal" />
                    <span>ICSE</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-xyroots-teal accent-xyroots-teal" />
                    <span>State Board</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-xyroots-teal accent-xyroots-teal" />
                    <span>IB / IGCSE</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-xyroots-muted block mb-2">Location</label>
                <div className="space-y-1.5 text-xs text-xyroots-text">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-xyroots-teal accent-xyroots-teal" />
                    <span>Kochi, Kerala</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-xyroots-teal accent-xyroots-teal" />
                    <span>Kozhikode, Kerala</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-xyroots-teal accent-xyroots-teal" />
                    <span>Thiruvananthapuram</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-3 space-y-4">
              {/* Search Bar Top */}
              <div className="bg-white rounded-2xl p-3 border border-xyroots-border flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-xyroots-muted" />
                  <input
                    type="text"
                    defaultValue="Mathematics Teacher • Kochi"
                    className="w-full pl-10 pr-4 py-2 text-sm bg-xyroots-cream rounded-xl border-0 focus:ring-2 focus:ring-xyroots-teal"
                    readOnly
                  />
                </div>
                <div className="text-xs text-xyroots-muted shrink-0">
                  Showing <span className="font-bold text-black">142</span> qualified teachers
                </div>
              </div>

              {/* Teacher Cards */}
              <div className="space-y-4">
                {sampleTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-2xl p-5 border border-xyroots-border hover:border-xyroots-teal/40 transition-all card-hover"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-xyroots-teal text-white font-bold flex items-center justify-center text-base shrink-0">
                          {teacher.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-black">{teacher.name}</h3>
                            {teacher.verified && (
                              <span title="Verified Educator"><FaShieldHalved className="w-4 h-4 text-xyroots-teal" /></span>
                            )}
                          </div>
                          <p className="text-xs text-xyroots-muted font-medium">{teacher.title}</p>
                          <div className="flex items-center gap-1.5 text-xs text-xyroots-muted mt-1">
                            <FaLocationDot className="w-3 h-3 text-xyroots-muted" />
                            {teacher.location} • {teacher.experience} Years Exp
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start sm:self-center">
                        <span className="text-xs font-bold text-xyroots-teal bg-xyroots-mint px-3 py-1.5 rounded-full">
                          {teacher.matchPercentage}% Match
                        </span>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1.5 rounded-lg border border-yellow-200">
                          <FaStar className="w-3.5 h-3.5 text-yellow-500" />
                          <span className="text-xs font-bold text-yellow-700">{teacher.rating}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-xyroots-muted line-clamp-2 mb-4 leading-relaxed">
                      {teacher.about}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-xyroots-border">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {teacher.professionalQualifications.map((q) => (
                          <span key={q} className="text-[10px] px-2.5 py-1 bg-xyroots-cream rounded-md font-medium text-black">
                            {q}
                          </span>
                        ))}
                        {teacher.hasDemo && (
                          <span className="text-[10px] px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md font-medium flex items-center gap-1">
                            <FaVideo className="w-3 h-3" /> Teaching Demo
                          </span>
                        )}
                        {teacher.hasCV && (
                          <span className="text-[10px] px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-medium flex items-center gap-1">
                            <FaRegFileLines className="w-3 h-3" /> CV Attached
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link
                          href={`/teachers/${teacher.slug}`}
                          className="flex-1 sm:flex-initial text-center px-4 py-2 text-xs font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors"
                        >
                          View Profile
                        </Link>
                        <button
                          className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-xl border border-xyroots-border hover:border-xyroots-teal text-black transition-colors"
                        >
                          Shortlist
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
