import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaCircleCheck, FaUsers, FaBriefcase, FaMagnifyingGlass, FaBuilding, FaArrowRight } from "react-icons/fa6";
import Link from "next/link";

const services = [
  {
    tag: "Free for Teachers",
    icon: FaUsers,
    title: "Teacher Profile & Discovery",
    desc: "Build a verified professional profile. Showcase your qualifications, teaching experience, and style to institutions that are actively hiring.",
    features: ["Verified educator badge", "AI-powered job matching", "Application tracking", "Saved jobs & watchlist"],
    accentColor: "#00a264",
    bgLight: "#f0fdf4",
  },
  {
    tag: "For Institutions",
    icon: FaBriefcase,
    title: "Job Posting & Hiring",
    desc: "Post teaching vacancies and connect with thousands of qualified, verified educators across India. Filter by subject, board, qualification, and more.",
    features: ["Unlimited job posts", "Candidate filtering tools", "One-click shortlisting", "Direct candidate contact"],
    accentColor: "#1565c0",
    bgLight: "#eff6ff",
  },
  {
    tag: "Premium",
    icon: FaMagnifyingGlass,
    title: "Advanced Candidate Search",
    desc: "Search our entire teacher database by subject, experience, qualification, curriculum board, and location. Find the perfect educator in minutes.",
    features: ["Subject & board filters", "Experience range filter", "Qualification matching", "Saved search alerts"],
    accentColor: "#7b1fa2",
    bgLight: "#faf5ff",
  },
  {
    tag: "For Agencies",
    icon: FaBuilding,
    title: "Agency & Consultancy Portal",
    desc: "Run your staffing consultancy from Xyroots. Manage pipelines, post on behalf of schools, and grow your agency brand on a verified platform.",
    features: ["Dedicated agency dashboard", "Bulk candidate sourcing", "Pipeline management", "Branded listings"],
    accentColor: "#c2410c",
    bgLight: "#fff7ed",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero — clean, minimal */}
        <section className="bg-[#f7f8fa] border-b border-gray-100 py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-xyroots-teal bg-xyroots-mint px-3 py-1 mb-5" style={{ borderRadius: "999px" }}>
              Platform
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-gray-900 mb-5 leading-tight">
              Everything You Need to<br /><span className="text-xyroots-teal">Hire or Get Hired</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              A full-stack education recruitment platform built for teachers, schools, and staffing agencies across India.
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((s) => (
              <div key={s.title} className="border border-gray-100 p-7 hover:border-gray-200 transition-all" style={{ borderRadius: "1.25rem" }}>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div
                    className="w-11 h-11 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: s.bgLight, borderRadius: "0.75rem" }}
                  >
                    <s.icon className="w-5 h-5" style={{ color: s.accentColor }} />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 bg-gray-100 text-gray-500 shrink-0 self-start" style={{ borderRadius: "999px" }}>
                    {s.tag}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{s.desc}</p>
                <ul className="space-y-2.5">
                  {s.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <FaCircleCheck className="w-3.5 h-3.5 shrink-0" style={{ color: s.accentColor }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA — clean white */}
        <section className="py-16 px-4 bg-[#f7f8fa] border-t border-gray-100">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Ready to get started?</h2>
            <p className="text-gray-500 text-sm mb-8">No credit card required. Xyroots is always free for teachers.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register/teacher" className="inline-flex items-center gap-2 px-6 py-3 bg-xyroots-teal text-white font-semibold text-sm hover:bg-xyroots-dark transition-colors" style={{ borderRadius: "0.75rem" }}>
                Register as Teacher <FaArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/jobs" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:border-gray-300 transition-colors" style={{ borderRadius: "0.75rem" }}>
                Browse Jobs
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
