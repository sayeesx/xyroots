"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import CustomSelect from "@/components/ui/CustomSelect";
import {
  FaShieldHalved, FaStar, FaLocationDot, FaBriefcase, FaGraduationCap, FaAward,
  FaVideo, FaFileLines, FaCalendarDays, FaCircleCheck, FaArrowLeft,
  FaBookmark, FaRegBookmark, FaPlay, FaSpinner, FaXmark
} from "react-icons/fa6";
import { createClient } from "@/lib/supabase/client";
import { formatSalary } from "@/lib/utils";
import { scheduleInterview } from "@/lib/actions/interviews";

const timeSlotOptions = [
  "09:00 AM - 09:45 AM","10:00 AM - 10:45 AM","11:00 AM - 11:45 AM",
  "12:00 PM - 12:45 PM","02:00 PM - 02:45 PM","03:00 PM - 03:45 PM",
  "04:00 PM - 04:45 PM","05:00 PM - 05:45 PM"
].map(t => ({ value: t, label: t }));

const interviewTypeOptions = [
  { value: "Video Call (Google Meet / Zoom)", label: "Video Call (Google Meet / Zoom)" },
  { value: "Phone Call", label: "Phone Call" },
  { value: "In-Person Campus Interview", label: "In-Person Campus Interview" },
  { value: "Demo Teaching Session", label: "Demo Teaching Session" },
];
import { useAuth } from "@/lib/auth/AuthProvider";

export default function TeacherProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { profile } = useAuth();

  const [dbTeacher, setDbTeacher] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const supabase = createClient();

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const actualId = UUID_REGEX.test(slug) ? slug : slug?.split('-').pop();

  useEffect(() => {
    if (!actualId) { setNotFound(true); setPageLoading(false); return; }
    supabase
      .from('teacher_profiles')
      .select('*, profiles(full_name, email, phone, avatar_url)')
      .eq('id', actualId)
      .eq('is_visible', true)
      .single()
      .then(({ data, error }: any) => {
        if (error || !data) { setNotFound(true); setPageLoading(false); return; }
        setDbTeacher({
          id: data.id,
          name: data.profiles?.full_name || "Anonymous",
          title: data.title || "Educator",
          location: data.location || "India",
          avatar: data.profiles?.avatar_url || null,
          subjects: data.specializations?.length > 0 ? data.specializations : (data.subject ? [data.subject] : []),
          experience: data.experience_years || 0,
          verified: (data.profile_completion || 0) > 80,
          about: data.bio || "",
          education: data.education || [],
          professionalQualifications: [data.professional_qualification, data.qualification].filter(Boolean),
          teachingExperience: data.experience_details || [],
          boards: data.boards || [],
          languages: data.languages || [],
          skills: data.skills || [],
          availability: data.availability || "Immediate",
          expectedSalaryMin: data.expected_salary_min || 0,
          expectedSalaryMax: data.expected_salary_max || 0,
          preferredLocations: data.preferred_locations || [],
          workPreferences: data.work_preferences || [],
          hasDemo: data.has_demo_video || false,
          hasCV: !!data.resume_url,
          rating: null,
        });
        setPageLoading(false);
      });
  }, [actualId]); // eslint-disable-line

  const [shortlisted, setShortlisted] = useState(false);

  // Load shortlist state from localStorage on mount
  useEffect(() => {
    if (!actualId) return;
    const saved: string[] = JSON.parse(localStorage.getItem("agency_watchlist_teachers") || "[]");
    setShortlisted(saved.includes(actualId));
  }, [actualId]);

  const toggleShortlist = () => {
    if (!actualId) return;
    const saved: string[] = JSON.parse(localStorage.getItem("agency_watchlist_teachers") || "[]");
    const next = shortlisted ? saved.filter(i => i !== actualId) : [...saved, actualId];
    localStorage.setItem("agency_watchlist_teachers", JSON.stringify(next));
    setShortlisted(!shortlisted);
  };
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  // Schedule form state
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("10:00 AM - 10:45 AM");
  const [scheduleType, setScheduleType] = useState("Video Call (Google Meet / Zoom)");
  const [scheduleMessage, setScheduleMessage] = useState("");
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleResult, setScheduleResult] = useState<"idle" | "success" | "error">("idle");
  const [scheduleError, setScheduleError] = useState("");

  const handleSchedule = async () => {
    if (!scheduleDate) { setScheduleError("Please select an interview date."); return; }
    setScheduleLoading(true);
    setScheduleError("");
    const result = await scheduleInterview({
      teacherProfileId: dbTeacher!.id,
      interviewDate: scheduleDate,
      timeSlot: scheduleTime,
      interviewType: scheduleType,
      institutionName: profile?.full_name || "",
      message: scheduleMessage || undefined,
    });
    setScheduleLoading(false);
    if (result.success) {
      setScheduleResult("success");
    } else {
      setScheduleResult("error");
      setScheduleError(result.error || "Failed to schedule interview.");
    }
  };

  const resetScheduleModal = () => {
    setShowScheduleModal(false);
    setScheduleResult("idle");
    setScheduleDate("");
    setScheduleMessage("");
    setScheduleError("");
  };

  if (pageLoading) return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center"><Loader /></main>
    </div>
  );

  if (notFound || !dbTeacher) return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Teacher Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">This profile may not exist or the link is invalid.</p>
          <button onClick={() => router.push('/teachers')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00a264] text-white text-sm font-semibold" style={{ borderRadius: "0.75rem" }}>
            <FaArrowLeft className="w-3.5 h-3.5" /> Browse All Teachers
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );

  const teacher = dbTeacher;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9]">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* ─── Glassdoor / Indeed Clean Header Card ───────────────────── */}
        <section className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg mb-4 transition-all"
            >
              <FaArrowLeft className="w-3 h-3" /> Back to Profiles
            </button>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-gray-700 font-bold text-3xl shrink-0 overflow-hidden bg-white border border-gray-200 rounded-2xl">
                  {teacher.avatar ? (
                    <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                  ) : (
                    teacher.name.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{teacher.name}</h1>
                    {teacher.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 bg-[#e6f7ed] text-[#00a264] rounded-md border border-[#00a264]/20">
                        <FaShieldHalved className="w-3.5 h-3.5" /> Verified Educator
                      </span>
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 font-medium mb-2.5">{teacher.title}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5 font-bold text-gray-900">
                      <FaLocationDot className="w-3.5 h-3.5 text-[#00a264]" /> {teacher.location}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1.5">
                      <FaBriefcase className="w-3.5 h-3.5 text-gray-400" /> {teacher.experience} Years Experience
                    </span>
                    {teacher.rating && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-amber-700 font-bold text-xs">
                          <FaStar className="w-3 h-3 text-amber-500" /> {teacher.rating}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap pt-1">
                <button
                  onClick={toggleShortlist}
                  className={`px-4 py-2.5 font-bold text-xs rounded-xl border transition-all flex items-center gap-2 ${
                    shortlisted
                      ? "bg-[#e6f7ed] border-[#00a264]/40 text-[#00a264]"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {shortlisted ? <FaBookmark className="w-3.5 h-3.5" /> : <FaRegBookmark className="w-3.5 h-3.5" />}
                  {shortlisted ? "Shortlisted" : "Shortlist"}
                </button>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="px-6 py-2.5 font-extrabold text-xs bg-[#00a264] text-white hover:bg-[#008f58] rounded-xl transition-all flex items-center gap-2"
                >
                  <FaCalendarDays className="w-3.5 h-3.5" /> Schedule Interview
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Body Grid ────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              {teacher.about && (
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2.5">
                    <span className="w-2 h-6 bg-[#00a264] rounded-full" />
                    About Educator
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{teacher.about}</p>
                </div>
              )}

              {/* Teaching Demo */}
              {teacher.hasDemo && (
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                    <span className="w-2 h-6 bg-red-500 rounded-full" />
                    <FaVideo className="w-4 h-4 text-red-500" /> Teaching Demo
                  </h2>
                  <div
                    className="relative bg-gray-900 h-56 rounded-xl flex items-center justify-center overflow-hidden group cursor-pointer"
                    onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                  >
                    {isPlayingDemo ? (
                      <div className="w-full h-full flex items-center justify-center bg-[#00a264]/95 text-white flex-col gap-2">
                        <FaPlay className="w-10 h-10 animate-pulse text-white/80" />
                        <p className="font-bold text-sm">Playing Teaching Demo</p>
                      </div>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform z-10">
                          <FaPlay className="w-6 h-6 ml-1 text-white" />
                        </div>
                        <span className="absolute bottom-4 left-4 text-xs font-semibold text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                          Click to preview demo
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Teaching Experience Timeline */}
              {teacher.teachingExperience?.length > 0 && (
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7">
                  <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                    <span className="w-2 h-6 bg-blue-600 rounded-full" />
                    Teaching Experience
                  </h2>
                  <div className="space-y-6">
                    {teacher.teachingExperience.map((exp: any, i: number) => (
                      <div key={i} className="relative pl-6 border-l-2 border-[#00a264]/30">
                        <div className="absolute -left-[7px] top-1 w-3 h-3 bg-[#00a264] rounded-full ring-4 ring-white" />
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <h3 className="text-base font-bold text-gray-900">{exp.role || exp.jobTitle || "Educator"}</h3>
                          <span className="text-xs px-2.5 py-0.5 bg-gray-100 text-gray-600 font-semibold rounded-full">
                            {exp.duration || `${exp.startDate || ""}${exp.endDate ? ` – ${exp.endDate}` : ""}`}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#00a264]">{exp.school || exp.organization || ""}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education & Qualifications */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                  <span className="w-2 h-6 bg-purple-600 rounded-full" />
                  Education & Qualifications
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {teacher.education?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-3">Academic Degrees</p>
                      <div className="space-y-2.5">
                        {teacher.education.map((edu: any, i: number) => (
                          <div key={i} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl">
                            <p className="text-sm font-bold text-gray-900">{edu.degree || ""}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{edu.institution || ""}{edu.endDate ? ` · ${edu.endDate}` : ""}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {teacher.professionalQualifications?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-3">Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {teacher.professionalQualifications.map((q: any, i: number) => (
                          <span key={i} className="text-xs font-bold px-3 py-1.5 bg-[#e6f7ed] text-[#00a264] border border-[#00a264]/20 rounded-full flex items-center gap-1.5">
                            <FaAward className="w-3.5 h-3.5" /> {q}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Subjects & Skills Tag Cloud */}
              {(teacher.subjects?.length > 0 || teacher.skills?.length > 0 || teacher.boards?.length > 0) && (
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                    <span className="w-2 h-6 bg-amber-500 rounded-full" />
                    Expertise & Skills
                  </h2>
                  <div className="space-y-4">
                    {teacher.subjects?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-2">Subjects</p>
                        <div className="flex flex-wrap gap-2">
                          {teacher.subjects.map((s: string) => (
                            <span key={s} className="text-xs font-bold px-3 py-1 bg-slate-900 text-white rounded-lg">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {teacher.boards?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-2">Curriculum Boards</p>
                        <div className="flex flex-wrap gap-2">
                          {teacher.boards.map((b: string) => (
                            <span key={b} className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {teacher.skills?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-2">Technical & Soft Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {teacher.skills.map((s: string) => (
                            <span key={s} className="text-xs font-medium px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-3 border-b border-gray-100">
                  Candidate Overview
                </h3>

                <div className="space-y-3.5 text-xs sm:text-sm mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Availability</span>
                    <span className="font-bold text-[#00a264] px-2 py-0.5 bg-emerald-50 rounded-full">{teacher.availability}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Expected Salary</span>
                    <span className="font-extrabold text-gray-900">{formatSalary(teacher.expectedSalaryMin, teacher.expectedSalaryMax)}</span>
                  </div>
                  {teacher.preferredLocations?.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-500">Preferred Cities</span>
                      <span className="font-semibold text-gray-800 text-right max-w-[60%]">{teacher.preferredLocations.join(", ")}</span>
                    </div>
                  )}
                  {teacher.languages?.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Languages</span>
                      <span className="font-semibold text-gray-800">{teacher.languages.join(", ")}</span>
                    </div>
                  )}
                </div>

                {teacher.hasCV && (
                  <div className="p-3.5 bg-gray-50 border border-gray-200/80 rounded-xl flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-[#00a264]">
                      <FaFileLines className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900">Resume / CV Attached</p>
                      <p className="text-[10px] text-gray-500">PDF Document • Verified</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="w-full py-3.5 text-xs font-extrabold bg-gradient-to-r from-[#00a264] to-[#00c278] hover:from-[#007a4d] hover:to-[#00a264] text-white rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <FaCalendarDays className="w-4 h-4" /> Schedule Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden">
          <div className="bg-white max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden" style={{ borderRadius: "1.25rem" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-base font-bold text-gray-900">Schedule Interview</h3>
                <p className="text-xs text-gray-500 mt-0.5">with {teacher.name}</p>
              </div>
              <button onClick={resetScheduleModal} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors" style={{ borderRadius: "50%" }}>
                <FaXmark className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 modal-scrollbar">
              {scheduleResult === "success" ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-green-100 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: "50%" }}>
                    <FaCircleCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Interview Scheduled!</h4>
                  <p className="text-sm text-gray-500 mb-1">{teacher.name} will be notified of the interview request.</p>
                  <p className="text-xs text-gray-400">Date: {scheduleDate} · {scheduleTime}</p>
                  <button onClick={resetScheduleModal} className="mt-6 px-6 py-2.5 bg-[#00a264] text-white text-sm font-semibold" style={{ borderRadius: "0.75rem" }}>
                    Done
                  </button>
                </div>
              ) : scheduleResult === "error" ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-red-100 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: "50%" }}>
                    <FaXmark className="w-8 h-8 text-red-500" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Scheduling Failed</h4>
                  <p className="text-sm text-red-600 mb-6">{scheduleError}</p>
                  <button onClick={() => setScheduleResult("idle")} className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold" style={{ borderRadius: "0.75rem" }}>
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {scheduleError && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm" style={{ borderRadius: "0.75rem" }}>{scheduleError}</div>}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Interview Date <span className="text-red-500">*</span></label>
                    <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-[#00a264]" style={{ borderRadius: "0.75rem" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Time Slot</label>
                    <CustomSelect
                      value={scheduleTime}
                      onChange={setScheduleTime}
                      options={timeSlotOptions}
                      placeholder="Select a time slot"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Interview Type</label>
                    <CustomSelect
                      value={scheduleType}
                      onChange={setScheduleType}
                      options={interviewTypeOptions}
                      placeholder="Select interview type"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Message (Optional)</label>
                    <textarea value={scheduleMessage} onChange={e => setScheduleMessage(e.target.value)} rows={3}
                      placeholder="Add any additional details or instructions..."
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-[#00a264] resize-none" style={{ borderRadius: "0.75rem" }} />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={resetScheduleModal} className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50" style={{ borderRadius: "0.75rem" }}>Cancel</button>
                    <button onClick={handleSchedule} disabled={scheduleLoading} className="flex-[2] py-2.5 text-sm font-semibold bg-[#00a264] text-white hover:bg-[#008f58] flex items-center justify-center gap-2 disabled:opacity-70" style={{ borderRadius: "0.75rem" }}>
                      {scheduleLoading ? <><FaSpinner className="w-4 h-4 animate-spin" /> Scheduling...</> : <><FaCalendarDays className="w-4 h-4" /> Send Invite</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
