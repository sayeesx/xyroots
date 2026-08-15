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
      .then(({ data }: any) => {
        if (data) {
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
        } else { setNotFound(true); }
        setPageLoading(false);
      })
      .catch(() => { setNotFound(true); setPageLoading(false); });
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
    <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
      <Navbar />

      <main className="flex-1 pt-6 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#00a264] mb-6 transition-colors group">
            <FaArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>

          {/* Header */}
          <div className="bg-white border border-gray-100 p-6 sm:p-8 mb-6" style={{ borderRadius: "1.25rem" }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shrink-0 overflow-hidden" style={{ borderRadius: "1.25rem", backgroundColor: "#374151" }}>
                  {teacher.avatar
                    ? <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                    : teacher.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{teacher.name}</h1>
                    {teacher.verified && <span title="Verified Educator"><FaShieldHalved className="w-5 h-5 text-[#00a264]" /></span>}
                  </div>
                  <p className="text-base text-gray-500 mb-2">{teacher.title}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><FaLocationDot className="w-3.5 h-3.5 text-[#00a264]" />{teacher.location}</span>
                    <span className="flex items-center gap-1.5"><FaBriefcase className="w-3.5 h-3.5 text-[#00a264]" />{teacher.experience} Years Exp.</span>
                    {teacher.rating && (
                      <span className="flex items-center gap-1 bg-yellow-50 px-2.5 py-0.5 border border-yellow-200 text-yellow-700 font-bold" style={{ borderRadius: "0.5rem" }}>
                        <FaStar className="w-3 h-3 text-yellow-500" />{teacher.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={toggleShortlist}
                  className={`px-5 py-2.5 font-semibold text-sm border transition-all flex items-center gap-2 ${shortlisted ? "bg-[#e6f7ed] border-[#00a264]/30 text-[#00a264]" : "border-gray-200 text-gray-700 hover:border-[#00a264] hover:text-[#00a264]"}`}
                  style={{ borderRadius: "0.75rem" }}
                >
                  {shortlisted ? <FaBookmark className="w-4 h-4" /> : <FaRegBookmark className="w-4 h-4" />}
                  {shortlisted ? "Shortlisted" : "Shortlist"}
                </button>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="px-6 py-2.5 font-semibold text-sm bg-[#00a264] text-white hover:bg-[#008f58] transition-all flex items-center gap-2"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <FaCalendarDays className="w-4 h-4" /> Schedule Interview
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main */}
            <div className="lg:col-span-2 space-y-5">
              {teacher.about && (
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <h2 className="text-base font-bold text-gray-900 mb-3">About Educator</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{teacher.about}</p>
                </div>
              )}

              {teacher.hasDemo && (
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2"><FaVideo className="w-4 h-4 text-[#00a264]" /> Teaching Demo</h2>
                  </div>
                  <div className="relative bg-gray-900 h-52 flex items-center justify-center overflow-hidden group cursor-pointer" style={{ borderRadius: "0.75rem" }} onClick={() => setIsPlayingDemo(!isPlayingDemo)}>
                    {isPlayingDemo ? (
                      <div className="w-full h-full flex items-center justify-center bg-[#00a264]/90 text-white flex-col gap-2">
                        <FaPlay className="w-10 h-10 animate-pulse text-white/80" />
                        <p className="font-bold text-sm">Playing Demo</p>
                      </div>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="w-14 h-14 bg-gray-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform z-10" style={{ borderRadius: "50%" }}>
                          <FaPlay className="w-5 h-5 ml-1" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {teacher.teachingExperience?.length > 0 && (
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><FaBriefcase className="w-4 h-4 text-[#00a264]" /> Experience</h2>
                  <div className="space-y-5">
                    {teacher.teachingExperience.map((exp: any, i: number) => (
                      <div key={i} className="relative pl-5 border-l-2 border-[#00a264]/20">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-[#00a264]" style={{ borderRadius: "50%" }} />
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-0.5">
                          <h3 className="text-sm font-bold text-gray-900">{exp.role || exp.jobTitle || "Teacher"}</h3>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 font-medium" style={{ borderRadius: "0.375rem" }}>
                            {exp.duration || `${exp.startDate || ""}${exp.endDate ? ` – ${exp.endDate}` : ""}`}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#00a264]">{exp.school || exp.organization || ""}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><FaGraduationCap className="w-4 h-4 text-[#00a264]" /> Education & Qualifications</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {teacher.education?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Degrees</p>
                      <div className="space-y-2">
                        {teacher.education.map((edu: any, i: number) => (
                          <div key={i} className="p-3 bg-gray-50 border border-gray-100" style={{ borderRadius: "0.625rem" }}>
                            <p className="text-sm font-bold text-gray-900">{edu.degree || ""}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</p>
                            <p className="text-xs text-gray-500">{edu.institution || ""}{edu.endDate ? ` · ${edu.endDate}` : ""}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {teacher.professionalQualifications?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Prof. Qualifications</p>
                      <div className="flex flex-wrap gap-1.5">
                        {teacher.professionalQualifications.map((q: any, i: number) => (
                          <span key={i} className="text-xs font-semibold px-3 py-1.5 bg-[#e6f7ed] text-[#00a264] flex items-center gap-1.5" style={{ borderRadius: "999px" }}>
                            <FaAward className="w-3 h-3" />{q}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {(teacher.subjects?.length > 0 || teacher.skills?.length > 0 || teacher.boards?.length > 0) && (
                <div className="bg-white border border-gray-100 p-6" style={{ borderRadius: "1rem" }}>
                  <h2 className="text-base font-bold text-gray-900 mb-4">Subjects & Skills</h2>
                  <div className="space-y-3">
                    {teacher.subjects?.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Subjects</p>
                        <div className="flex flex-wrap gap-1.5">
                          {teacher.subjects.map((s: string) => <span key={s} className="text-xs font-bold px-3 py-1 bg-gray-900 text-white" style={{ borderRadius: "0.5rem" }}>{s}</span>)}
                        </div>
                      </div>
                    )}
                    {teacher.boards?.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Boards</p>
                        <div className="flex flex-wrap gap-1.5">
                          {teacher.boards.map((b: string) => <span key={b} className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700" style={{ borderRadius: "0.5rem" }}>{b}</span>)}
                        </div>
                      </div>
                    )}
                    {teacher.skills?.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {teacher.skills.map((s: string) => <span key={s} className="text-xs font-medium px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600" style={{ borderRadius: "0.5rem" }}>{s}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-white border border-gray-100 p-5 lg:sticky lg:top-24" style={{ borderRadius: "1rem" }}>
                <h3 className="text-sm font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">Candidate Overview</h3>
                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between"><span className="text-gray-500">Availability</span><span className="font-bold text-[#00a264]">{teacher.availability}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Expected Salary</span><span className="font-bold text-gray-900">{formatSalary(teacher.expectedSalaryMin, teacher.expectedSalaryMax)}</span></div>
                  {teacher.preferredLocations?.length > 0 && <div className="flex justify-between"><span className="text-gray-500">Preferred Cities</span><span className="font-semibold text-gray-900 text-right max-w-[60%]">{teacher.preferredLocations.join(", ")}</span></div>}
                  {teacher.languages?.length > 0 && <div className="flex justify-between"><span className="text-gray-500">Languages</span><span className="font-semibold text-gray-900">{teacher.languages.join(", ")}</span></div>}
                </div>

                {teacher.hasCV && (
                  <div className="p-3 bg-gray-50 border border-gray-100 flex items-center gap-3 mb-4" style={{ borderRadius: "0.75rem" }}>
                    <FaFileLines className="w-4 h-4 text-[#00a264]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900">Resume / CV</p>
                      <p className="text-[10px] text-gray-400">PDF • Verified</p>
                    </div>
                  </div>
                )}

                <button onClick={() => setShowScheduleModal(true)} className="w-full py-3 text-sm font-semibold bg-[#00a264] text-white hover:bg-[#008f58] transition-all" style={{ borderRadius: "0.75rem" }}>
                  Schedule Interview
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
