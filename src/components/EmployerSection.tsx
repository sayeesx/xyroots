"use client";

import {
  FaRegFileLines, FaMagnifyingGlass, FaFilter, FaVideo, FaUsers, FaCalendar,
  FaChartSimple, FaClipboardList, FaArrowRight, FaBriefcase, FaCircleCheck
} from "react-icons/fa6";

const features = [
  { icon: FaRegFileLines, label: "Post Vacancies" },
  { icon: FaMagnifyingGlass, label: "Search Teacher Profiles" },
  { icon: FaFilter, label: "Advanced Candidate Filters" },
  { icon: FaRegFileLines, label: "Review CVs" },
  { icon: FaVideo, label: "Watch Teaching Demo Videos" },
  { icon: FaUsers, label: "Shortlist Candidates" },
  { icon: FaCalendar, label: "Schedule Interviews" },
  { icon: FaClipboardList, label: "Manage Applications" },
  { icon: FaChartSimple, label: "Track Hiring" },
];

const pipeline = [
  { label: "New", count: 86, color: "bg-gray-100 text-gray-600" },
  { label: "Reviewed", count: 52, color: "bg-blue-50 text-blue-600" },
  { label: "Shortlisted", count: 36, color: "bg-yellow-50 text-yellow-600" },
  { label: "Interview", count: 14, color: "bg-purple-50 text-purple-600" },
  { label: "Offer", count: 6, color: "bg-orange-50 text-orange-600" },
  { label: "Hired", count: 8, color: "bg-green-50 text-green-600" },
];

export default function EmployerSection() {
  return (
    <section className="section-padding bg-xyroots-dark relative overflow-hidden" aria-labelledby="employer-section-heading">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00a264]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00a264]/10 organic-blob blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-xyroots-yellow mb-4">
              For Schools & Institutions
            </span>
            <h2 id="employer-section-heading" className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white mb-5 leading-tight">
              Build Your Faculty With Confidence.
            </h2>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8 max-w-md">
              Find qualified teachers faster, review richer profiles and spend
              less time sorting through irrelevant applications.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-4 h-4 text-xyroots-yellow" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">{f.label}</span>
                </div>
              ))}
            </div>

            <a
              href="/register/employer"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl bg-xyroots-yellow text-black hover:bg-yellow-400 btn-hover transition-all"
            >
              Start Hiring
              <FaArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right - Dashboard Mockup */}
          <div>
            <div className="bg-white rounded-2xl dashboard-shadow overflow-hidden max-w-md mx-auto lg:ml-auto">
              {/* Header */}
              <div className="px-6 py-4 border-b border-xyroots-border">
                <h3 className="text-sm font-bold text-black">Hiring Overview</h3>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-px bg-xyroots-border">
                <div className="bg-white p-4 text-center">
                  <p className="text-2xl font-bold text-black">12</p>
                  <p className="text-[10px] text-xyroots-muted uppercase tracking-wider mt-1">Open Positions</p>
                </div>
                <div className="bg-white p-4 text-center">
                  <p className="text-2xl font-bold text-[#00a264]">248</p>
                  <p className="text-[10px] text-xyroots-muted uppercase tracking-wider mt-1">Applications</p>
                </div>
                <div className="bg-white p-4 text-center">
                  <p className="text-2xl font-bold text-black">8</p>
                  <p className="text-[10px] text-xyroots-muted uppercase tracking-wider mt-1">Hired</p>
                </div>
              </div>

              {/* Pipeline */}
              <div className="p-5">
                <p className="text-xs font-semibold text-xyroots-muted uppercase tracking-wider mb-4">
                  Candidate Pipeline
                </p>
                <div className="space-y-2.5">
                  {pipeline.map((stage, i) => (
                    <div key={stage.label} className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stage.color} w-24 text-center`}>
                        {stage.label}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00a264] rounded-full transition-all"
                          style={{ width: `${(stage.count / 86) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-black w-8 text-right">{stage.count}</span>
                    </div>
                  ))}
                </div>

                {/* Recent application */}
                <div className="mt-5 p-4 bg-xyroots-cream rounded-xl">
                  <p className="text-xs font-semibold text-xyroots-muted uppercase tracking-wider mb-3">Latest Application</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00a264] flex items-center justify-center text-sm font-bold text-white">
                      PM
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black">Priya Menon</p>
                      <p className="text-xs text-xyroots-muted">Mathematics • 6 yrs exp</p>
                    </div>
                    <span className="text-xs font-bold text-[#00a264] bg-xyroots-mint px-2.5 py-1 rounded-full">
                      98%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
