"use client";

import Image from "next/image";
import {
  FaWandMagicSparkles, FaRegFileLines, FaVideo, FaBell, FaChartSimple, FaBookmark, FaCalendar,
  FaShieldHalved, FaStar, FaLocationDot, FaBookOpen, FaAward
} from "react-icons/fa6";
import { useAuth } from "@/lib/auth/AuthProvider";

const features = [
  { icon: FaWandMagicSparkles, label: "AI-Powered Job Matching" },
  { icon: FaRegFileLines, label: "Personal Teacher Profile" },
  { icon: FaRegFileLines, label: "CV Upload" },
  { icon: FaVideo, label: "Teaching Demo Video" },
  { icon: FaBell, label: "Job Alerts" },
  { icon: FaChartSimple, label: "Application Tracking" },
  { icon: FaCalendar, label: "Interview Scheduling" },
  { icon: FaBookmark, label: "Saved Jobs" },
  { icon: FaShieldHalved, label: "Profile Visibility" },
  { icon: FaAward, label: "Verified Qualifications" },
];

export default function TeacherSection() {
  const { role } = useAuth();
  
  return (
    <section className="section-padding bg-xyroots-cream relative overflow-hidden" aria-labelledby="teacher-section-heading">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-xyroots-mint/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-xyroots-yellow/10 organic-blob blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left - Content */}
          <div>
            {role !== 'management' && (
              <h2 id="teacher-section-heading" className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-black mb-5 leading-tight">
                Dear <span className="font-serif font-normal text-xyroots-teal text-3xl sm:text-4xl lg:text-5xl tracking-normal">teachers</span>, <br className="hidden sm:block" />your next <span className="text-xyroots-teal text-stroke-sm">classroom</span> is <span className="text-xyroots-teal text-stroke-sm">closer</span> than you think.
              </h2>
            )}
            <p className="text-base sm:text-lg text-xyroots-muted leading-relaxed mb-8 max-w-md">
              Build a profile that shows schools more than just your resume. Showcase your qualifications, experience, and teaching style.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2.5 text-sm text-xyroots-text"
                >
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <f.icon className="w-4 h-4 text-xyroots-teal" />
                  </div>
                  <span className="text-sm font-medium">{f.label}</span>
                </div>
              ))}
            </div>


          </div>

          {/* Right - Teacher Profile Mockup */}
          <div className="relative">
            <div className="bg-white rounded-2xl dashboard-shadow border border-xyroots-border overflow-hidden max-w-sm mx-auto lg:ml-auto">
              {/* Cover */}
              <div className="h-40 sm:h-48 bg-[#00a264] relative overflow-hidden">
                <Image
                  src="/institution.webp"
                  alt="Institution Cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover"
                />
              </div>

              <div className="p-5 sm:p-6 relative pt-12 sm:pt-14">
                {/* Profile Picture */}
                <div className="absolute -top-10 left-5 sm:left-6 w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-xyroots-teal z-10 shadow-sm">
                  <Image
                    src="/lady-teacher.webp"
                    alt="Kavya T Profile"
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                  />
                </div>

                {/* Name and title */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-black">Kavya T</h3>
                      <FaShieldHalved className="w-4 h-4 text-xyroots-teal" />
                    </div>
                    <p className="text-sm text-xyroots-muted">Mathematics Teacher</p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-lg">
                    <FaStar className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-sm font-bold text-yellow-700">4.8</span>
                  </div>
                </div>

                {/* Info badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs px-2.5 py-1 bg-xyroots-mint rounded-full text-xyroots-teal font-medium">B.Ed</span>
                  <span className="text-xs px-2.5 py-1 bg-xyroots-mint rounded-full text-xyroots-teal font-medium">M.Sc Mathematics</span>
                  <span className="text-xs px-2.5 py-1 bg-xyroots-cream rounded-full text-xyroots-text font-medium">5 Years Experience</span>
                </div>

                {/* Boards */}
                <div className="flex items-center gap-2 mb-3">
                  <FaBookOpen className="w-3.5 h-3.5 text-xyroots-muted" />
                  <div className="flex gap-1.5">
                    {["CBSE", "ICSE", "State Board"].map((b) => (
                      <span key={b} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-xyroots-muted font-medium">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-3 text-sm text-xyroots-muted">
                  <FaLocationDot className="w-3.5 h-3.5" />
                  Kochi, Kerala
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-[10px] font-semibold text-xyroots-muted uppercase tracking-wider mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Algebra", "Calculus", "STEM", "Classroom Management", "Geometry", "Statistics"].map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 bg-xyroots-cream rounded-lg text-xyroots-text font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-xyroots-dark transition-colors">
                    View Profile
                  </button>
                  <button className="w-12 h-10 flex items-center justify-center rounded-xl border-2 border-xyroots-border text-black hover:border-xyroots-teal transition-colors">
                    <i className="bi bi-bookmark"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
