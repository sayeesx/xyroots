"use client";

import Link from "next/link";
import { FaLocationDot, FaClock, FaRegBookmark, FaChevronRight, FaShieldHalved } from "react-icons/fa6";
import { jobs } from "@/data/jobs";

export default function JobDiscoverySection() {
  const displayJobs = jobs.slice(0, 6);

  return (
    <section className="section-padding bg-xyroots-cream relative" aria-labelledby="job-discovery-heading">
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,30 C1080,60 360,60 0,30 Z" fill="white" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-xyroots-teal mb-4">
              Featured Opportunities
            </span>
            <h2 id="job-discovery-heading" className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-black">
              Teaching Opportunities That Fit.
            </h2>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-sm font-semibold text-xyroots-teal hover:text-black transition-colors shrink-0"
          >
            View all jobs
            <FaChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayJobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.slug}`}
              className="group bg-white rounded-2xl p-6 border border-xyroots-border card-hover block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-xyroots-mint flex items-center justify-center text-xs font-bold text-xyroots-teal">
                    {job.school.split(" ").map(w => w[0]).join("").slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-medium text-xyroots-muted">{job.school}</p>
                      {job.schoolVerified && <FaShieldHalved className="w-3 h-3 text-xyroots-teal" />}
                    </div>
                  </div>
                </div>
                <button
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-xyroots-cream transition-colors"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Save job"
                >
                  <FaRegBookmark className="w-4 h-4 text-xyroots-muted" />
                </button>
              </div>

              <h3 className="text-base font-bold text-black mb-2 group-hover:text-xyroots-teal transition-colors">
                {job.title}
              </h3>

              <div className="flex items-center gap-1.5 text-sm text-xyroots-muted mb-3">
                <FaLocationDot className="w-3.5 h-3.5" />
                {job.location}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] px-2 py-0.5 bg-xyroots-cream rounded font-medium text-xyroots-text">
                  ₹{(job.salaryMin / 1000).toFixed(0)}K - ₹{(job.salaryMax / 1000).toFixed(0)}K
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-xyroots-cream rounded font-medium text-xyroots-text">
                  {job.experienceMin}-{job.experienceMax} yrs
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-xyroots-cream rounded font-medium text-xyroots-text">
                  {job.board}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-xyroots-cream rounded font-medium text-xyroots-text">
                  {job.employmentType}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-xyroots-border">
                <div className="flex items-center gap-1.5 text-xs text-xyroots-muted">
                  <FaClock className="w-3 h-3" />
                  {getDaysAgo(job.postedDate)}
                </div>
                <span className="text-xs font-bold text-xyroots-teal bg-xyroots-mint px-2.5 py-1 rounded-full">
                  {job.matchPercentage}% Match
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function getDaysAgo(dateStr: string): string {
  const now = new Date();
  const past = new Date(dateStr);
  const days = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}
