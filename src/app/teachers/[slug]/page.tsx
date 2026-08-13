"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FaShieldHalved, FaStar, FaLocationDot, FaBriefcase, FaGraduationCap, FaAward,
  FaVideo, FaFileLines, FaCalendarDays, FaCircleCheck, FaArrowLeft, FaEnvelope,
  FaPhone, FaBookmark, FaRegBookmark, FaPlay
} from "react-icons/fa6";
import { createClient } from "@/lib/supabase/client";
import { teachers } from "@/data/teachers";
import { formatSalary } from "@/lib/utils";


const verificationOptions = [
  { value: "all", label: "All Teachers" },
  { value: "verified", label: "Verified Only" },
];
const qualificationOptions = [
  { value: "", label: "Any Qualification" },
  { value: "bed", label: "B.Ed" },
  { value: "med", label: "M.Ed" },
  { value: "msc", label: "Master's" },
  { value: "phd", label: "Ph.D" },
];

export default function TeacherProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [dbTeacher, setDbTeacher] = useState<any>(null);
  const supabase = createClient();

  const actualId = slug.includes('-') && slug.length > 36 ? slug.split('-').pop() : slug;
  const fallbackTeacher = teachers.find((t) => t.id === actualId || t.slug === slug) || teachers[0];

  import("react").then((React) => {
    React.useEffect(() => {
      if (actualId) {
        supabase.from('teacher_profiles').select('*, profiles(full_name, location, avatar_url)').eq('id', actualId).single().then(({ data }: any) => {
          if (data) {
            setDbTeacher({
              ...data,
              id: data.id,
              slug: slug,
              name: data.profiles?.full_name || "Anonymous",
              title: data.title || "Educator",
              location: data.location || data.profiles?.location || "India",
              avatar: data.profiles?.avatar_url || data.profile_image_url || null,
              subjects: data.specializations || [data.subject],
              experience: data.experience_years || 0,
              verified: data.profile_completion > 80,
              about: data.bio || "No description provided.",
              education: data.education || [],
              professionalQualifications: [data.qualification],
              teachingExperience: data.experience_details || [],
              boards: data.boards || [],
              languages: data.languages || ["English"],
              skills: data.skills || [],
              availability: data.availability || "Immediate",
              expectedSalaryMin: data.expected_salary_min || 0,
              expectedSalaryMax: data.expected_salary_max || 0,
              preferredLocations: data.preferred_locations || [],
              workPreferences: data.work_preferences || [],
              hasDemo: data.has_demo_video || false,
              hasCV: !!data.resume_url,
            });
          }
        });
      }
    }, [actualId, slug, supabase]);
  });
  
  const teacher = dbTeacher || fallbackTeacher;

  const [shortlisted, setShortlisted] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-xyroots-cream/30">
      <Navbar />

      <main className="flex-1 pt-14 lg:pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-xyroots-muted hover:text-xyroots-teal mb-6 transition-colors"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
            Back to Candidates
          </button>

          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-xyroots-border shadow-sm mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-xyroots-teal text-white font-bold text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-lg">
                  {teacher.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-black">
                      {teacher.name}
                    </h1>
                    {teacher.verified && (
                      <span title="Verified Educator"><FaShieldHalved className="w-5 h-5 text-xyroots-teal" /></span>
                    )}
                  </div>
                  <p className="text-base text-xyroots-muted font-medium mb-2">{teacher.title}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-xyroots-muted">
                    <span className="flex items-center gap-1">
                      <FaLocationDot className="w-3.5 h-3.5 text-xyroots-teal" />
                      {teacher.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaBriefcase className="w-3.5 h-3.5 text-xyroots-teal" />
                      {teacher.experience} Years Experience
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 bg-yellow-50 px-2.5 py-0.5 rounded-lg border border-yellow-200 text-yellow-700 font-bold">
                      <FaStar className="w-3 h-3 text-yellow-500" />
                      {teacher.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShortlisted(!shortlisted)}
                  className={`px-5 py-3 rounded-xl font-semibold text-sm border transition-all flex items-center gap-2 ${
                    shortlisted
                      ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                      : "border-xyroots-border text-black hover:border-xyroots-teal"
                  }`}
                >
                  {shortlisted ? <FaBookmark className="w-4 h-4 text-yellow-500" /> : <FaRegBookmark className="w-4 h-4" />}
                  {shortlisted ? "Shortlisted" : "Shortlist"}
                </button>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="px-6 py-3 rounded-xl font-semibold text-sm bg-xyroots-teal text-white hover:bg-xyroots-dark transition-all btn-hover flex items-center gap-2"
                >
                  <FaCalendarDays className="w-4 h-4" />
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Profile Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-xyroots-border shadow-sm">
                <h2 className="text-lg font-bold text-black mb-4">About Educator</h2>
                <p className="text-sm sm:text-base text-xyroots-muted leading-relaxed">
                  {teacher.about}
                </p>
              </div>

              {/* Teaching Demo Video Showcase */}
              {teacher.hasDemo && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-xyroots-border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-black flex items-center gap-2">
                      <FaVideo className="w-5 h-5 text-xyroots-teal" />
                      Teaching Demo Video
                    </h2>
                    <span className="text-xs font-semibold text-xyroots-teal bg-xyroots-mint px-3 py-1 rounded-full">
                      Classroom Sample • 3:45 mins
                    </span>
                  </div>

                  <div className="relative rounded-2xl bg-xyroots-dark h-56 sm:h-72 flex items-center justify-center overflow-hidden group cursor-pointer"
                    onClick={() => setIsPlayingDemo(!isPlayingDemo)}>
                    {isPlayingDemo ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white bg-xyroots-teal/90 p-6 text-center">
                        <FaPlay className="w-12 h-12 mb-3 animate-pulse text-xyroots-yellow" />
                        <p className="font-bold text-lg">Playing Mathematics Demo Lecture</p>
                        <p className="text-xs text-white/80 mt-1">Topic: Quadratic Equations & Real-world Applications</p>
                      </div>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="w-16 h-16 rounded-full bg-xyroots-yellow text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform z-10">
                          <FaPlay className="w-6 h-6 ml-1" />
                        </div>
                        <div className="absolute bottom-4 left-4 z-10 text-white">
                          <p className="font-bold text-sm">Classroom Teaching Methodology Sample</p>
                          <p className="text-xs text-gray-300">Recorded for Grade 10 CBSE Algebra</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Teaching Experience */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-xyroots-border shadow-sm">
                <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
                  <FaBriefcase className="w-5 h-5 text-xyroots-teal" />
                  Teaching Experience
                </h2>
                <div className="space-y-6">
                  {teacher.teachingExperience.map((exp: any, idx: any) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-xyroots-teal/30">
                      <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-xyroots-teal" />
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h3 className="text-base font-bold text-black">{exp.role}</h3>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-xyroots-cream text-xyroots-muted">
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-xyroots-teal mb-2">{exp.school}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Qualifications */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-xyroots-border shadow-sm">
                <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
                  <FaGraduationCap className="w-5 h-5 text-xyroots-teal" />
                  Education & Certifications
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-xyroots-muted mb-3">Degrees</p>
                    <div className="space-y-3">
                      {teacher.education.map((edu: any, i: any) => (
                        <div key={i} className="p-3 bg-xyroots-cream rounded-xl">
                          <p className="text-sm font-bold text-black">{edu.degree}</p>
                          <p className="text-xs text-xyroots-muted">{edu.institution} • {edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-xyroots-muted mb-3">Professional Qualifications</p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.professionalQualifications.map((q: any, i: any) => (
                        <span key={i} className="text-xs font-semibold px-3 py-1.5 bg-xyroots-mint text-xyroots-teal rounded-xl flex items-center gap-1.5">
                          <FaAward className="w-3.5 h-3.5" />
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects & Skills */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-xyroots-border shadow-sm">
                <h2 className="text-lg font-bold text-black mb-4">Subjects & Pedagogical Skills</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-xyroots-muted mb-2">Subjects Taught</p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects.map((sub: any) => (
                        <span key={sub} className="text-xs font-bold px-3 py-1 bg-xyroots-dark text-white rounded-lg">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-xyroots-muted mb-2">Education Boards</p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.boards.map((b: any) => (
                        <span key={b} className="text-xs font-semibold px-3 py-1 bg-xyroots-cream text-black rounded-lg">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-xyroots-muted mb-2">Skills & Specializations</p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.skills.map((skill: any) => (
                        <span key={skill} className="text-xs font-medium px-3 py-1 bg-gray-100 text-xyroots-text rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Right */}
            <div className="space-y-6">
              {/* Hiring Overview Box */}
              <div className="bg-white rounded-3xl p-6 border border-xyroots-border shadow-sm sticky top-28 space-y-6">
                <h3 className="text-base font-bold text-black pb-3 border-b border-xyroots-border">
                  Candidate Overview
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-xyroots-muted">Notice / Availability:</span>
                    <span className="font-bold text-xyroots-teal">{teacher.availability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xyroots-muted">Expected Salary:</span>
                    <span className="font-bold text-black">
                      {formatSalary(teacher.expectedSalaryMin, teacher.expectedSalaryMax)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xyroots-muted">Preferred Cities:</span>
                    <span className="font-semibold text-black">{teacher.preferredLocations.join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xyroots-muted">Languages:</span>
                    <span className="font-semibold text-black">{teacher.languages.join(", ")}</span>
                  </div>
                </div>

                {/* Resume Download Box */}
                {teacher.hasCV && (
                  <div className="p-4 bg-xyroots-cream rounded-2xl border border-xyroots-border">
                    <div className="flex items-center gap-3 mb-3">
                      <FaFileLines className="w-5 h-5 text-xyroots-teal" />
                      <div>
                        <p className="text-xs font-bold text-black">Resume / Curriculum Vitae</p>
                        <p className="text-[10px] text-xyroots-muted">PDF • Verified Document</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert("Downloading verified candidate CV...")}
                      className="w-full py-2.5 text-xs font-semibold rounded-xl bg-white border border-xyroots-border hover:border-xyroots-teal text-black transition-colors text-center"
                    >
                      Download Resume
                    </button>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-xyroots-teal text-white hover:bg-xyroots-dark transition-all text-center"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => alert(`Contact request sent to ${teacher.name}`)}
                    className="w-full py-3 px-6 rounded-xl font-semibold text-sm border border-xyroots-border hover:bg-xyroots-cream text-black transition-all text-center"
                  >
                    Contact Candidate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-xyroots-border">
            <h3 className="text-xl font-bold text-black mb-2">Schedule Interview</h3>
            <p className="text-xs text-xyroots-muted mb-6">Set up a demo or preliminary interview with {teacher.name}.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-black block mb-1">Interview Date</label>
                <input type="date" defaultValue="2026-08-15" className="w-full p-3 text-sm bg-xyroots-cream rounded-xl border border-xyroots-border" />
              </div>
              <div>
                <label className="text-xs font-bold text-black block mb-1">Time Slot</label>
                <select className="w-full p-3 text-sm bg-xyroots-cream rounded-xl border border-xyroots-border">
                  <option>10:00 AM - 10:45 AM</option>
                  <option>02:00 PM - 02:45 PM</option>
                  <option>04:00 PM - 04:45 PM</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-black block mb-1">Interview Type</label>
                <select className="w-full p-3 text-sm bg-xyroots-cream rounded-xl border border-xyroots-border">
                  <option>Video Call (Google Meet / Zoom)</option>
                  <option>In-Person Campus Interview</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-3 text-sm font-semibold rounded-xl border border-xyroots-border text-black"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Interview invitation sent successfully!");
                  setShowScheduleModal(false);
                }}
                className="flex-1 py-3 text-sm font-semibold rounded-xl bg-xyroots-teal text-white hover:bg-xyroots-dark"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
