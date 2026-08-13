"use client";

import { FaCircleCheck, FaChevronRight, FaWandMagicSparkles } from "react-icons/fa6";

const matchCriteria = [
  { label: "Qualification", met: true },
  { label: "Experience", met: true },
  { label: "Location", met: true },
  { label: "Subject", met: true },
  { label: "Salary", met: true },
];

const reasons = [
  "B.Ed qualification matches requirement",
  "4+ years experience exceeds minimum",
  "Mathematics specialization is an exact match",
  "Kochi is within your preferred locations",
  "Salary expectation aligns with the offered range",
];

export default function AIMatchingSection() {
  return (
    <section className="section-padding bg-white relative overflow-hidden" aria-labelledby="ai-matching-heading">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-80 h-80 bg-xyroots-mint/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-50/40 organic-blob-2 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Match UI */}
          <div className="order-2 lg:order-1">
            <div className="max-w-md mx-auto lg:mr-auto">
              {/* Main match card */}
              <div className="bg-white rounded-2xl dashboard-shadow border border-xyroots-border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <FaWandMagicSparkles className="w-5 h-5 text-xyroots-yellow" />
                    <span className="text-xs font-bold uppercase tracking-widest text-xyroots-muted">Match Score</span>
                  </div>

                  {/* Score circle */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative w-24 h-24 shrink-0">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="#e8f5f0" strokeWidth="8" />
                        <circle
                          cx="48" cy="48" r="40" fill="none"
                          stroke="#145c54" strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 40 * 0.94} ${2 * Math.PI * 40 * 0.06}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-black">94%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-base font-bold text-black mb-1">Mathematics Teacher</p>
                      <p className="text-sm text-xyroots-muted">Greenfield International School</p>
                      <p className="text-xs text-xyroots-muted mt-1">Kochi, Kerala</p>
                    </div>
                  </div>

                  {/* Criteria */}
                  <div className="space-y-3 mb-6">
                    {matchCriteria.map((c) => (
                      <div key={c.label} className="flex items-center justify-between">
                        <span className="text-sm text-xyroots-text">{c.label}</span>
                        <FaCircleCheck className="w-4 h-4 text-green-500" />
                      </div>
                    ))}
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors">
                    View Opportunity
                    <FaChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Why this matches */}
              <div className="mt-4 bg-xyroots-cream rounded-2xl p-5 border border-xyroots-border">
                <p className="text-xs font-semibold uppercase tracking-widest text-xyroots-muted mb-3">
                  Why this matches you
                </p>
                <ul className="space-y-2.5">
                  {reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-xyroots-text">
                      <FaCircleCheck className="w-4 h-4 text-xyroots-teal shrink-0 mt-0.5" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-xyroots-teal mb-4">
              Intelligent Matching
            </span>
            <h2 id="ai-matching-heading" className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-black mb-5 leading-tight">
              Less Searching.{" "}
              <br className="hidden sm:block" />
              More Teaching.
            </h2>
            <p className="text-base sm:text-lg text-xyroots-muted leading-relaxed mb-8 max-w-md">
              Xyroots helps teachers discover roles that fit their experience,
              qualifications, preferences and goals — so you spend less time
              scrolling and more time preparing for the classroom.
            </p>

            <div className="space-y-4">
              {[
                "Matches based on qualification, experience and subject",
                "Considers your preferred locations and salary expectations",
                "Learns from your application patterns over time",
                "Recommends roles you might not have found on your own",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-xyroots-mint flex items-center justify-center shrink-0 mt-0.5">
                    <FaCircleCheck className="w-3.5 h-3.5 text-xyroots-teal" />
                  </div>
                  <p className="text-sm text-xyroots-text">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
