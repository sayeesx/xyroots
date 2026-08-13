"use client";

import Link from "next/link";
import { FaArrowRight, FaMagnifyingGlass, FaCirclePlus } from "react-icons/fa6";

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-xyroots-teal text-white relative overflow-hidden" aria-label="Call to action">
      {/* Decorative organic shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-xyroots-yellow/10 organic-blob blur-3xl pointer-events-none" />

      {/* Curved SVG divider at top */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 48" fill="none" className="w-full" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,24 C1080,48 360,48 0,24 Z" fill="white" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-xyroots-yellow mb-4">
          Join Xyroots Today
        </span>
        <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
          Ready to Find Your Next{" "}
          <span className="relative inline-block">
            Great Teacher?
            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 250 8" fill="none">
              <path d="M1 5.5C50 2 150 2 249 5.5" stroke="#f5c63c" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-10 max-w-2xl mx-auto">
          Whether you're building a career or building a faculty, Xyroots helps you get there faster.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl bg-xyroots-yellow text-black hover:bg-yellow-400 btn-hover transition-all"
          >
            <FaMagnifyingGlass className="w-5 h-5" />
            Find Teaching Jobs
          </Link>
          <Link
            href="/register/employer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
          >
            <FaCirclePlus className="w-5 h-5 text-xyroots-yellow" />
            Post a Job
          </Link>
        </div>
      </div>
    </section>
  );
}
