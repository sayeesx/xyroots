"use client";

import { FaUserPlus, FaBullseye, FaHandshake } from "react-icons/fa6";

const steps = [
  {
    number: "01",
    icon: FaUserPlus,
    title: "CREATE YOUR PROFILE",
    description:
      "Teachers create a professional profile with qualifications, experience, subjects, preferred locations and teaching demo.",
    color: "bg-xyroots-mint text-xyroots-teal",
  },
  {
    number: "02",
    icon: FaBullseye,
    title: "MATCH & SHORTLIST",
    description:
      "Schools discover qualified teachers while teachers receive relevant job recommendations powered by intelligent matching.",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    number: "03",
    icon: FaHandshake,
    title: "INTERVIEW & HIRE",
    description:
      "Apply, shortlist, schedule interviews and move from first contact to hiring — all within a single platform.",
    color: "bg-blue-50 text-blue-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-padding bg-white relative" aria-labelledby="how-it-works-heading">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-xyroots-mint/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-xyroots-teal mb-4">
            How It Works
          </span>
          <h2 id="how-it-works-heading" className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-black mb-5">
            How Xyroots Makes{" "}
            <span className="relative inline-block">
              Hiring Simpler
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                <path d="M1 4C50 1 150 1 199 4" stroke="#f5c63c" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>.
          </h2>
          <p className="text-base sm:text-lg text-xyroots-muted leading-relaxed">
            From discovering the right opportunity to signing the right offer,
            everything happens in one place.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="group relative bg-white rounded-2xl p-8 border border-xyroots-border card-hover"
            >
              {/* Number */}
              <span className="text-6xl font-bold text-black/5 absolute top-4 right-6 font-editorial">
                {step.number}
              </span>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6`}>
                <step.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-xyroots-muted leading-relaxed">
                {step.description}
              </p>

              {/* Connector line (desktop) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-4 w-8 border-t-2 border-dashed border-xyroots-border z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
