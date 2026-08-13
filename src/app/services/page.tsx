"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaCircleCheck, FaArrowRight, FaUsers, FaBriefcase, FaMagnifyingGlass, FaBuilding } from "react-icons/fa6";

const services = [
  {
    title: "Teacher Profile & Discovery",
    tag: "Free for Teachers",
    icon: FaUsers,
    color: "#E6F4EA",
    iconColor: "#1e8e3e",
    desc: "Create a verified, beautifully presented professional profile that institutions can discover. Highlight your qualifications, experience, and teaching philosophy.",
    features: ["Verified educator badge", "AI-powered job matching", "Application tracking", "Watchlist & saved jobs"],
    cta: "Create Profile",
    href: "/register",
  },
  {
    title: "Job Posting & Hiring",
    tag: "For Institutions",
    icon: FaBriefcase,
    color: "#E3F2FD",
    iconColor: "#1565c0",
    desc: "Post your teaching vacancies and reach thousands of qualified, verified educators across India. Get applications from candidates who genuinely fit your requirements.",
    features: ["Unlimited job posts", "Candidate filtering tools", "One-click shortlisting", "Direct messaging"],
    cta: "Post a Job",
    href: "/register",
  },
  {
    title: "Advanced Candidate Search",
    tag: "Premium",
    icon: FaMagnifyingGlass,
    color: "#F3E5F5",
    iconColor: "#7b1fa2",
    desc: "Our powerful search engine lets you filter candidates by subject, experience, qualification, board, and location — finding the perfect teacher in minutes.",
    features: ["Subject & board filters", "Experience range filter", "Qualification matching", "Saved search alerts"],
    cta: "Explore Search",
    href: "/teachers",
  },
  {
    title: "Agency & Consultancy Portal",
    tag: "For Agencies",
    icon: FaBuilding,
    color: "#FFF3E0",
    iconColor: "#e65100",
    desc: "Run your staffing consultancy directly from the Xyroots platform. Manage candidate pipelines, post jobs on behalf of schools, and build your agency brand.",
    features: ["Dedicated agency dashboard", "Bulk candidate sourcing", "Pipeline management", "Branded post listings"],
    cta: "Register Agency",
    href: "/register",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#042816] via-[#074526] to-[#0a5c32] text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #00d085 0%, transparent 50%)' }} />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-editorial text-4xl sm:text-5xl text-white mb-5">Everything You Need to<br /><span className="text-[#7fffc4]">Hire or Get Hired</span></h1>
            <p className="text-green-100/80 text-lg max-w-2xl mx-auto">
              Xyroots offers a full-stack education recruitment platform — from teacher profiles to institution hiring dashboards and agency portals.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-[#f7f8fa]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.color }}>
                      <s.icon className="w-6 h-6" style={{ color: s.iconColor }} />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600 shrink-0 self-start mt-0.5">{s.tag}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">{s.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {s.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <FaCircleCheck className="w-4 h-4 text-xyroots-teal shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                  <Link href={s.href} className="inline-flex items-center gap-2 text-sm font-bold text-xyroots-teal hover:text-[#042816] transition-colors">
                    {s.cta} <FaArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-[#042816] to-[#0a5c32] text-white text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold mb-4">Start for free today</h2>
            <p className="text-green-100/80 mb-8">No credit card required. Xyroots is free for teachers, always.</p>
            <Link href="/register" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#042816] font-bold text-sm hover:bg-green-50 transition-colors shadow-lg">
              Create Free Account <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
