"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaMagnifyingGlass, FaLocationDot, FaBuilding, FaShieldHalved, FaUsers, FaGraduationCap, FaChevronRight } from "react-icons/fa6";
import { schools } from "@/data/schools";

export default function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSchools = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-xyroots-cream/30">
      <Navbar />

      <main className="flex-1 pt-6 lg:pt-10 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-8">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-xyroots-teal mb-3">
              Partner Institutions
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-black mb-4">
              Find Education Centres
            </h1>
            <p className="text-base sm:text-lg text-xyroots-muted">
              Connect directly with verified educational institutions looking for passionate teachers across South India.
            </p>
          </div>

          {/* Search bar */}
          <div className="bg-white rounded-2xl p-3 border border-xyroots-border shadow-sm mb-10 max-w-xl">
            <div className="relative">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-xyroots-muted" />
              <input
                type="text"
                placeholder="Search education centre by name, city or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-xyroots-cream/60 rounded-xl border-0 outline-none focus:ring-2 focus:ring-xyroots-teal"
              />
            </div>
          </div>

          {/* School Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <div
                key={school.id}
                className="bg-white rounded-3xl p-6 border border-xyroots-border hover:border-xyroots-teal/40 transition-all card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-xyroots-teal text-white font-bold flex items-center justify-center text-sm">
                      {school.logo}
                    </div>
                    {school.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-xyroots-mint text-xyroots-teal rounded-full">
                        <FaShieldHalved className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-black mb-1">{school.name}</h2>
                  <p className="text-xs text-xyroots-muted flex items-center gap-1 mb-3">
                    <FaLocationDot className="w-3.5 h-3.5 text-xyroots-teal" />
                    {school.location} • Est. {school.established}
                  </p>

                  <p className="text-xs text-xyroots-muted line-clamp-2 mb-4 leading-relaxed">
                    {school.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {school.board.map((b) => (
                      <span key={b} className="text-[10px] px-2.5 py-0.5 bg-xyroots-cream text-black rounded-md font-semibold">
                        {b} Board
                      </span>
                    ))}
                    <span className="text-[10px] px-2.5 py-0.5 bg-xyroots-cream text-black rounded-md font-semibold">
                      {school.type}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-xyroots-border flex items-center justify-between">
                  <span className="text-xs font-bold text-xyroots-teal">
                    {school.openPositions} Open Vacancies
                  </span>
                  <Link
                    href={`/jobs?school=${encodeURIComponent(school.name)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-black hover:text-xyroots-teal transition-colors"
                  >
                    View Jobs
                    <FaChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
