"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  FaMagnifyingGlass, FaLocationDot, FaShieldHalved, FaUsers, FaChevronRight,
  FaBuilding, FaGraduationCap, FaStar, FaBriefcase, FaCheck, FaArrowRight,
  FaBookOpen, FaChartSimple, FaBell, FaWandMagicSparkles, FaCircleCheck,
  FaSchool, FaRegBuilding
} from "react-icons/fa6";
import { schools, testimonials, pricingPlans } from "@/data/schools";
import { useAuth } from "@/lib/auth/AuthProvider";

const TYPE_OPTIONS = [
  { value: "All", label: "All Types" },
  { value: "International", label: "International" },
  { value: "Private", label: "Private" },
  { value: "Government", label: "Government" },
  { value: "Coaching", label: "Coaching" },
];

const LOCATION_OPTIONS = [
  { value: "All", label: "All Locations" },
  { value: "Kerala", label: "Kerala" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Delhi", label: "Delhi" },
];

const BOARD_OPTIONS = [
  { value: "All", label: "All Boards" },
  { value: "CBSE", label: "CBSE" },
  { value: "ICSE", label: "ICSE" },
  { value: "IB", label: "IB" },
  { value: "IGCSE", label: "IGCSE" },
  { value: "State Board", label: "State Board" },
];

const stats = [
  { value: "1,200+", label: "Institutions", icon: FaBuilding },
  { value: "18,000+", label: "Teachers Placed", icon: FaUsers },
  { value: "97%", label: "Satisfaction Rate", icon: FaStar },
  { value: "32", label: "States Covered", icon: FaLocationDot },
];

const features = [
  { icon: FaWandMagicSparkles, title: "AI Matching", desc: "Smart algorithm matches your vacancies with the most qualified teachers automatically." },
  { icon: FaChartSimple, title: "Hiring Analytics", desc: "Track applications, interviews, and hiring pipeline from a unified dashboard." },
  { icon: FaShieldHalved, title: "Verified Profiles", desc: "Every teacher profile is verified for qualifications and work history." },
  { icon: FaBell, title: "Job Alerts", desc: "Instantly notify matching candidates when you post a new vacancy." },
  { icon: FaBookOpen, title: "Subject Experts", desc: "Filter by subject, board, qualification, and years of experience." },
  { icon: FaBriefcase, title: "Contract & Fulltime", desc: "Hire for full-time, part-time, contract, or substitute roles seamlessly." },
];

// ─── Institution Card ──────────────────────────────────────────────────────────
function InstitutionCard({ school }: { school: typeof schools[0] }) {
  const bgColors = ["#f0fdf4", "#eff6ff", "#fdf4ff", "#fff7ed", "#f0fdf4"];
  const accentColors = ["#00a264", "#2563eb", "#9333ea", "#ea580c", "#00a264"];
  const idx = parseInt(school.id) % bgColors.length;

  return (
    <div
      className="bg-white border border-gray-200 hover:border-[#00a264]/50 hover:shadow-[0_4px_24px_rgba(0,162,100,0.10)] transition-all duration-300 flex flex-col group"
      style={{ borderRadius: "1.25rem" }}
    >
      {/* Card Header */}
      <div
        className="px-5 pt-5 pb-4 flex items-start justify-between"
        style={{ background: `linear-gradient(135deg, ${bgColors[idx]} 0%, #fff 100%)`, borderRadius: "1.25rem 1.25rem 0 0" }}
      >
        <div className="flex items-center gap-3.5">
          {/* Logo */}
          <div
            className="w-12 h-12 shrink-0 flex items-center justify-center text-white text-sm font-bold"
            style={{ borderRadius: "0.875rem", background: `linear-gradient(135deg, ${accentColors[idx]}, ${accentColors[idx]}cc)` }}
          >
            {school.logo}
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 group-hover:text-[#00a264] transition-colors leading-tight">{school.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <FaLocationDot className="w-3 h-3 text-[#00a264]" />
              {school.location}
            </p>
          </div>
        </div>
        {school.verified && (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-[#e6f7ed] text-[#00a264] shrink-0"
            style={{ borderRadius: "999px" }}
          >
            <FaShieldHalved className="w-2.5 h-2.5" /> Verified
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-5 py-3 flex-1 flex flex-col gap-3">
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{school.description}</p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-gray-50" style={{ borderRadius: "0.625rem" }}>
            <p className="text-sm font-bold text-gray-900">{school.students.toLocaleString()}</p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Students</p>
          </div>
          <div className="text-center p-2 bg-gray-50" style={{ borderRadius: "0.625rem" }}>
            <p className="text-sm font-bold text-gray-900">{school.teachers}</p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Teachers</p>
          </div>
          <div className="text-center p-2 bg-[#e6f7ed]" style={{ borderRadius: "0.625rem" }}>
            <p className="text-sm font-bold text-[#00a264]">{school.openPositions}</p>
            <p className="text-[10px] font-semibold text-[#00a264]/70 uppercase tracking-wide">Vacancies</p>
          </div>
        </div>

        {/* Board tags */}
        <div className="flex flex-wrap gap-1.5">
          {school.board.map((b) => (
            <span key={b} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 font-semibold" style={{ borderRadius: "0.375rem" }}>
              {b}
            </span>
          ))}
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 font-semibold" style={{ borderRadius: "0.375rem" }}>
            {school.type}
          </span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 font-medium" style={{ borderRadius: "0.375rem" }}>
            Est. {school.established}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between" style={{ borderRadius: "0 0 1.25rem 1.25rem" }}>
        <span className="text-xs font-bold text-[#00a264] flex items-center gap-1">
          <FaBriefcase className="w-3 h-3" />
          {school.openPositions} open {school.openPositions === 1 ? "vacancy" : "vacancies"}
        </span>
        <Link
          href={`/jobs?school=${encodeURIComponent(school.name)}`}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#00a264] hover:bg-[#007a4d] transition-all px-3 py-1.5 group-hover:scale-[1.03]"
          style={{ borderRadius: "0.5rem" }}
        >
          View Jobs <FaChevronRight className="w-2.5 h-2.5" />
        </Link>
      </div>
    </div>
  );
}

// ─── Testimonial Card ──────────────────────────────────────────────────────────
function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      className="bg-white border border-gray-100 p-5 flex flex-col gap-3 hover:border-[#00a264]/30 transition-all"
      style={{ borderRadius: "1rem" }}
    >
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="w-3 h-3 text-yellow-400" />
        ))}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed flex-1">&ldquo;{t.content}&rdquo;</p>
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <div
          className="w-9 h-9 shrink-0 flex items-center justify-center text-xs font-bold text-white bg-[#00a264]"
          style={{ borderRadius: "50%" }}
        >
          {t.avatar}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{t.name}</p>
          <p className="text-[11px] text-gray-500">{t.role}{t.organization ? ` · ${t.organization}` : ""}</p>
        </div>
        <span
          className={`ml-auto text-[10px] font-bold px-2 py-0.5 ${t.type === "school" ? "bg-[#e6f7ed] text-[#00a264]" : "bg-blue-50 text-blue-600"}`}
          style={{ borderRadius: "999px" }}
        >
          {t.type === "school" ? "Institution" : "Teacher"}
        </span>
      </div>
    </div>
  );
}

// ─── Pricing Card ──────────────────────────────────────────────────────────────
function PricingCard({ plan }: { plan: typeof pricingPlans[0] }) {
  return (
    <div
      className={`flex flex-col p-6 transition-all border ${plan.highlighted ? "border-[#00a264] bg-[#f0fdf4]" : "border-gray-200 bg-white hover:border-[#00a264]/40"}`}
      style={{ borderRadius: "1.25rem" }}
    >
      {plan.highlighted && (
        <span
          className="self-start text-[10px] font-bold px-3 py-1 bg-[#00a264] text-white mb-3"
          style={{ borderRadius: "999px" }}
        >
          Most Popular
        </span>
      )}
      <h3 className="text-lg font-bold text-gray-900 mb-0.5">{plan.name}</h3>
      <p className="text-xs text-gray-500 mb-4">{plan.description}</p>
      <div className="flex items-end gap-1 mb-5">
        <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
        {plan.period && <span className="text-sm text-gray-500 mb-1">{plan.period}</span>}
      </div>
      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
            <FaCheck className="w-3 h-3 text-[#00a264] mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
          plan.highlighted
            ? "bg-[#00a264] text-white hover:bg-[#007a4d]"
            : "bg-gray-900 text-white hover:bg-black"
        }`}
        style={{ borderRadius: "0.75rem" }}
      >
        {plan.cta} <FaArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function InstitutionsPage() {
  const { openInstitutionRegistration } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedBoard, setSelectedBoard] = useState("All");

  const filtered = schools.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === "All" || s.type === selectedType;
    const matchLoc = selectedLocation === "All" || s.location.includes(selectedLocation);
    const matchBoard = selectedBoard === "All" || s.board.includes(selectedBoard);
    return matchSearch && matchType && matchLoc && matchBoard;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9f8]">
      <Navbar />

      <main className="flex-1">

        {/* ─── Hero Banner ─────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #074526 0%, #00a264 60%, #00c278 100%)" }}
        >
          {/* Decorative shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5" style={{ borderRadius: "50%" }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10" style={{ borderRadius: "50%" }} />
            <div className="absolute top-12 left-1/2 w-48 h-48 bg-white/5" style={{ borderRadius: "50%" }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <span
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70 mb-4 px-3 py-1 bg-white/10"
                style={{ borderRadius: "999px" }}
              >
                <FaSchool className="w-3 h-3" /> Partner Institutions
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-5">
                Find qualified teachers<br />
                <span className="text-[#a3e6c3]">faster than ever before</span>
              </h1>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                Xyroots connects your institution with verified, experienced educators across India. Post a vacancy, browse profiles, and hire with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => openInstitutionRegistration()}
                  className="px-6 py-3 text-sm font-bold bg-white text-[#074526] hover:bg-[#e6f7ed] transition-all inline-flex items-center gap-2"
                  style={{ borderRadius: "0.75rem" }}
                >
                  Register Your Institution <FaArrowRight className="w-3.5 h-3.5" />
                </button>
                <Link
                  href="/teachers"
                  className="px-6 py-3 text-sm font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all inline-flex items-center gap-2"
                  style={{ borderRadius: "0.75rem" }}
                >
                  Browse Teachers
                </Link>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="border-t border-white/10 bg-black/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-white/10" style={{ borderRadius: "0.5rem" }}>
                    <s.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white leading-none">{s.value}</p>
                    <p className="text-[11px] text-white/60 mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Institution Directory ────────────────────────────────── */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section heading */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#00a264] mb-2 inline-block">Directory</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Partner Education Centres</h2>
                <p className="text-sm text-gray-500 mt-1">Connect directly with verified institutions across India</p>
              </div>
              <p className="text-sm text-gray-500 shrink-0">
                <span className="font-bold text-gray-900">{filtered.length}</span> institutions found
              </p>
            </div>

            {/* Search + Filters */}
            <div className="bg-white border border-gray-200 p-3 mb-8 flex flex-col sm:flex-row gap-2" style={{ borderRadius: "0.875rem" }}>
              {/* Search */}
              <div className="flex-1 flex items-center px-3 py-2 border border-gray-200 gap-2" style={{ borderRadius: "0.625rem" }}>
                <FaMagnifyingGlass className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name, city or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-900"
                />
              </div>
              {/* Type */}
              <div className="sm:w-40">
                <CustomSelect value={selectedType} onChange={setSelectedType} options={TYPE_OPTIONS} placeholder="Type" />
              </div>
              {/* Location */}
              <div className="sm:w-44">
                <CustomSelect value={selectedLocation} onChange={setSelectedLocation} options={LOCATION_OPTIONS} placeholder="Location" searchable />
              </div>
              {/* Board */}
              <div className="sm:w-36">
                <CustomSelect value={selectedBoard} onChange={setSelectedBoard} options={BOARD_OPTIONS} placeholder="Board" />
              </div>
            </div>

            {/* Cards grid */}
            {filtered.length === 0 ? (
              <div className="bg-white border border-gray-100 p-12 text-center" style={{ borderRadius: "1rem" }}>
                <FaRegBuilding className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No institutions match your search.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {filtered.map((school) => (
                  <InstitutionCard key={school.id} school={school} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── Why Xyroots for Institutions ─────────────────────────── */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00a264] mb-2 inline-block">Why Xyroots</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Everything you need to hire great teachers</h2>
              <p className="text-sm text-gray-500">Purpose-built tools for the education sector — no generic HR software.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="p-5 border border-gray-100 bg-[#f7f9f8] hover:border-[#00a264]/30 hover:bg-[#f0fdf4] transition-all group"
                  style={{ borderRadius: "1rem" }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center bg-[#e6f7ed] mb-3 group-hover:bg-[#00a264] transition-colors"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    <f.icon className="w-4.5 h-4.5 text-[#00a264] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Testimonials ──────────────────────────────────────────── */}
        <section className="py-12 lg:py-16 bg-[#f7f9f8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00a264] mb-2 inline-block">Testimonials</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Trusted by schools and teachers</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} t={t} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Pricing ───────────────────────────────────────────────── */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00a264] mb-2 inline-block">Pricing</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Simple, transparent plans</h2>
              <p className="text-sm text-gray-500">Start free. Upgrade when you need more.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Banner ────────────────────────────────────────────── */}
        <section
          className="py-14"
          style={{ background: "linear-gradient(135deg, #074526 0%, #00a264 100%)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Ready to find your next great teacher?</h2>
              <p className="text-white/70 text-sm">Join 1,200+ institutions already hiring on Xyroots.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => openInstitutionRegistration()}
                className="px-6 py-3 text-sm font-bold bg-white text-[#074526] hover:bg-[#e6f7ed] transition-all inline-flex items-center gap-2"
                style={{ borderRadius: "0.75rem" }}
              >
                Get Started Free <FaArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link
                href="/teachers"
                className="px-6 py-3 text-sm font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all inline-flex items-center gap-2"
                style={{ borderRadius: "0.75rem" }}
              >
                Browse Teachers
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
