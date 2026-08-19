"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CustomSelect from "@/components/ui/CustomSelect";
import Image from "next/image";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";

// ─── Data Maps ─────────────────────────────────────────────────────────────

const institutionOptions = [
  { value: "school", label: "School Teaching" },
  { value: "college", label: "College / University Faculty" },
  { value: "coaching", label: "Training / Coaching Institute" },
  { value: "tutor", label: "Tuition Teacher / Home Tutor" },
  { value: "online", label: "Online Tutor / EdTech Educator" },
  { value: "kindergarten", label: "Kindergarten / Pre-School" },
  { value: "special_ed", label: "Special Education Center" },
  { value: "vocational", label: "Vocational / Skill Trainer" },
];

const designationsMap: Record<string, { value: string; label: string }[]> = {
  default: [
    { value: "prt", label: "Primary Teacher (PRT)" },
    { value: "tgt", label: "Trained Graduate Teacher (TGT)" },
    { value: "pgt", label: "Post Graduate Teacher (PGT)" },
    { value: "assistant_prof", label: "Assistant Professor" },
    { value: "coaching_faculty", label: "Coaching Faculty" },
    { value: "principal", label: "Principal" },
  ],
  school: [
    { value: "nursery", label: "Pre-Primary / Nursery Teacher" },
    { value: "prt", label: "Primary Teacher (PRT)" },
    { value: "tgt", label: "Trained Graduate Teacher (TGT)" },
    { value: "pgt", label: "Post Graduate Teacher (PGT)" },
    { value: "physical_ed", label: "Physical Education Teacher" },
    { value: "art_music", label: "Art, Craft & Music Teacher" },
    { value: "hod", label: "Head of Department (HOD)" },
    { value: "vice_principal", label: "Vice Principal" },
    { value: "principal", label: "Principal" },
  ],
  college: [
    { value: "assistant_prof", label: "Assistant Professor" },
    { value: "associate_prof", label: "Associate Professor" },
    { value: "professor", label: "Professor" },
    { value: "hod", label: "Head of Department (HOD)" },
    { value: "guest_lecturer", label: "Guest Lecturer" },
    { value: "lab_instructor", label: "Lab Instructor / Demonstrator" },
    { value: "dean", label: "Dean / Director" },
  ],
  coaching: [
    { value: "jee_faculty", label: "JEE Main / Advanced Faculty" },
    { value: "neet_faculty", label: "NEET Medical Faculty" },
    { value: "foundation_faculty", label: "Foundation (Class 8-10) Faculty" },
    { value: "competitive_trainer", label: "UPSC / Bank Exam Trainer" },
    { value: "english_trainer", label: "IELTS / Spoken English Trainer" },
    { value: "sme", label: "Subject Matter Expert (SME)" },
  ],
  tutor: [
    { value: "home_tutor_k10", label: "Home Tutor (K-10)" },
    { value: "home_tutor_senior", label: "Senior Subject Tutor (Class 11-12)" },
    { value: "entrance_tutor", label: "Entrance Exam Home Tutor" },
    { value: "language_tutor", label: "Language Tutor" },
  ],
  online: [
    { value: "live_educator", label: "Live Session Master Educator" },
    { value: "edtech_content", label: "EdTech Content Creator" },
    { value: "doubt_solver", label: "Doubts Resolution Expert" },
    { value: "curriculum_developer", label: "Online Curriculum Developer" },
  ],
  kindergarten: [
    { value: "early_educator", label: "Early Childhood Educator" },
    { value: "nursery_teacher", label: "Nursery / Playgroup Teacher" },
    { value: "montessori", label: "Montessori Trained Educator" },
    { value: "kg_head", label: "Kindergarten Coordinator" },
  ],
  special_ed: [
    { value: "special_educator", label: "Special Education Teacher" },
    { value: "speech_therapist", label: "Speech & Language Therapist" },
    { value: "occupational_therapist", label: "Occupational Therapist" },
    { value: "child_psychologist", label: "Child Counselor / Psychologist" },
  ],
  vocational: [
    { value: "it_trainer", label: "IT & Software Trainer" },
    { value: "design_trainer", label: "Graphic Design & Multimedia Trainer" },
    { value: "hospitality_trainer", label: "Hospitality & Retail Trainer" },
    { value: "technical_instructor", label: "Technical & Mechanical Instructor" },
  ],
};

const stateOptions = [
  { value: "Kerala", label: "Kerala" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Delhi", label: "Delhi" },
  { value: "Telangana", label: "Telangana" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "West Bengal", label: "West Bengal" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Rajasthan", label: "Rajasthan" },
];

const districtsMap: Record<string, { value: string; label: string }[]> = {
  Kerala: [
    { value: "Ernakulam / Kochi", label: "Ernakulam / Kochi" },
    { value: "Thiruvananthapuram", label: "Thiruvananthapuram" },
    { value: "Kozhikode", label: "Kozhikode" },
    { value: "Thrissur", label: "Thrissur" },
    { value: "Kollam", label: "Kollam" },
    { value: "Kottayam", label: "Kottayam" },
    { value: "Palakkad", label: "Palakkad" },
    { value: "Malappuram", label: "Malappuram" },
    { value: "Kannur", label: "Kannur" },
    { value: "Alappuzha", label: "Alappuzha" },
  ],
  Karnataka: [
    { value: "Bengaluru Urban", label: "Bengaluru Urban" },
    { value: "Mysuru", label: "Mysuru" },
    { value: "Mangaluru", label: "Mangaluru" },
    { value: "Hubballi-Dharwad", label: "Hubballi-Dharwad" },
    { value: "Belagavi", label: "Belagavi" },
    { value: "Shivamogga", label: "Shivamogga" },
    { value: "Udupi", label: "Udupi" },
  ],
  "Tamil Nadu": [
    { value: "Chennai", label: "Chennai" },
    { value: "Coimbatore", label: "Coimbatore" },
    { value: "Madurai", label: "Madurai" },
    { value: "Tiruchirappalli", label: "Tiruchirappalli" },
    { value: "Salem", label: "Salem" },
    { value: "Tiruppur", label: "Tiruppur" },
    { value: "Vellore", label: "Vellore" },
  ],
  Maharashtra: [
    { value: "Mumbai", label: "Mumbai" },
    { value: "Pune", label: "Pune" },
    { value: "Nagpur", label: "Nagpur" },
    { value: "Nashik", label: "Nashik" },
    { value: "Thane", label: "Thane" },
  ],
  Delhi: [
    { value: "New Delhi", label: "New Delhi" },
    { value: "South Delhi", label: "South Delhi" },
    { value: "North Delhi", label: "North Delhi" },
    { value: "East Delhi", label: "East Delhi" },
    { value: "West Delhi", label: "West Delhi" },
  ],
  Telangana: [
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Warangal", label: "Warangal" },
    { value: "Nizamabad", label: "Nizamabad" },
    { value: "Karimnagar", label: "Karimnagar" },
  ],
  "Uttar Pradesh": [
    { value: "Noida / Greater Noida", label: "Noida / Greater Noida" },
    { value: "Lucknow", label: "Lucknow" },
    { value: "Kanpur", label: "Kanpur" },
    { value: "Agra", label: "Agra" },
    { value: "Varanasi", label: "Varanasi" },
    { value: "Prayagraj", label: "Prayagraj" },
  ],
};

// ─── Filter Options from Jobs Page (Job Seeker) ───────────────────────────
const subjectOptions = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Social Science", label: "Social Science" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Commerce", label: "Commerce" },
  { value: "Economics", label: "Economics" },
  { value: "History", label: "History" },
  { value: "Geography", label: "Geography" },
  { value: "Sanskrit", label: "Sanskrit" },
  { value: "Physical Education", label: "Physical Education" },
];

const jobTypeOptions = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

const boardOptions = [
  { value: "CBSE", label: "CBSE" },
  { value: "ICSE", label: "ICSE" },
  { value: "IB", label: "IB" },
  { value: "IGCSE", label: "IGCSE" },
  { value: "State Board", label: "State Board" },
];

const jobExpOptions = [
  { value: "Less than a year", label: "Less than a year" },
  { value: "1-3 years", label: "1-3 years" },
  { value: "3-5 years", label: "3-5 years" },
  { value: "5-10 years", label: "5-10 years" },
  { value: "More than 10 years", label: "More than 10 years" },
];

const jobQualOptions = [
  { value: "B.Ed", label: "B.Ed" },
  { value: "M.Ed", label: "M.Ed" },
  { value: "M.Sc", label: "M.Sc" },
  { value: "Ph.D", label: "Ph.D" },
  { value: "Graduate", label: "Graduate" },
];

const postedDateOptions = [
  { value: "Any time", label: "Any time" },
  { value: "Past 24 hours", label: "Past 24 hours" },
  { value: "Past week", label: "Past week" },
  { value: "Past month", label: "Past month" },
];

// ─── Filter Options from Teacher Page (Management) ────────────────────────
const teacherQualOptions = [
  { value: "B.Ed", label: "B.Ed" },
  { value: "M.Ed", label: "M.Ed" },
  { value: "M.Sc", label: "M.Sc" },
  { value: "Ph.D", label: "Ph.D" },
  { value: "NET Qualified", label: "NET Qualified" },
  { value: "Graduate", label: "Graduate" },
];

const teacherExpOptions = [
  { value: "Less than a year", label: "Less than a year" },
  { value: "1–3 years", label: "1–3 years" },
  { value: "3–5 years", label: "3–5 years" },
  { value: "5–10 years", label: "5–10 years" },
  { value: "10+ years", label: "10+ years" },
];

const teacherLevelOptions = [
  { value: "Primary (1-5)", label: "Primary (1-5)" },
  { value: "Middle School (6-8)", label: "Middle School (6-8)" },
  { value: "High School (9-10)", label: "High School (9-10)" },
  { value: "Senior Secondary (11-12)", label: "Senior Secondary (11-12)" },
];

const teacherModeOptions = [
  { value: "On-site / Offline", label: "On-site / Offline" },
  { value: "Online", label: "Online" },
  { value: "Hybrid", label: "Hybrid" },
];

const teacherVerificationOptions = [
  { value: "Verified Only", label: "Verified Only" },
  { value: "Profile > 80%", label: "Profile > 80%" },
];

const teacherNoticeOptions = [
  { value: "Immediate Joiner", label: "Immediate Joiner" },
  { value: "Within 15 Days", label: "Within 15 Days" },
  { value: "1 Month", label: "1 Month" },
  { value: "2 Months", label: "2 Months" },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function Hero() {
  const [heroImgSrc, setHeroImgSrc] = useState(
    "https://res.cloudinary.com/draedbypr/image/upload/v1786420720/hero-section_oanvbj.png"
  );
  const [activeTab, setActiveTab] = useState<"seeker" | "management">("seeker");

  // Shared Filters
  const [stateVal, setStateVal] = useState("Kerala");
  const [district, setDistrict] = useState("");
  const [subject, setSubject] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [board, setBoard] = useState("");

  // Job Seeker Specific Filters
  const [jobOption, setJobOption] = useState("");
  const [designation, setDesignation] = useState("");
  const [jobType, setJobType] = useState("");
  const [postedDate, setPostedDate] = useState("");

  // Management Specific Filters
  const [teachingLevel, setTeachingLevel] = useState("");
  const [preferredMode, setPreferredMode] = useState("");
  const [verification, setVerification] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");

  const { openTeacherRegistration, openInstitutionRegistration, isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'management') setActiveTab('management');
      if (role === 'teacher') setActiveTab('seeker');
    }
  }, [isAuthenticated, role]);

  const handleInstitutionChange = (val: string) => {
    setJobOption(val);
    setDesignation("");
  };

  const handleStateChange = (val: string) => {
    setStateVal(val);
    setDistrict("");
  };

  const clearSeekerFilters = () => {
    setJobOption("");
    setStateVal("Kerala");
    setDistrict("");
    setDesignation("");
    setSubject("");
    setQualification("");
    setJobType("");
    setBoard("");
    setExperience("");
    setPostedDate("");
  };

  const clearManagementFilters = () => {
    setSubject("");
    setStateVal("Kerala");
    setDistrict("");
    setQualification("");
    setExperience("");
    setBoard("");
    setTeachingLevel("");
    setPreferredMode("");
    setVerification("");
    setNoticePeriod("");
  };

  const handleSeekerSearch = () => {
    if (!isAuthenticated) {
      openTeacherRegistration();
      return;
    }
    const params = new URLSearchParams();
    if (jobOption) params.set("type", jobOption);
    if (stateVal && stateVal !== "All States") params.set("state", stateVal);
    if (district) params.set("district", district);
    if (designation) params.set("desig", designation);
    if (qualification) params.set("qual", qualification);
    if (subject) params.set("subject", subject);
    if (jobType) params.set("jobType", jobType);
    if (board) params.set("board", board);
    if (experience) params.set("exp", experience);
    if (postedDate && postedDate !== "Any time") params.set("posted", postedDate);

    router.push(`/jobs?${params.toString()}`);
  };

  const handleManagementSearch = () => {
    if (!isAuthenticated) {
      openInstitutionRegistration();
      return;
    }
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (stateVal && stateVal !== "All States") params.set("state", stateVal);
    if (district) params.set("district", district);
    if (qualification) params.set("qual", qualification);
    if (experience) params.set("exp", experience);
    if (board) params.set("board", board);
    if (teachingLevel) params.set("level", teachingLevel);
    if (preferredMode) params.set("mode", preferredMode);
    if (verification) params.set("verified", verification);
    if (noticePeriod) params.set("notice", noticePeriod);

    router.push(`/teachers?${params.toString()}`);
  };

  const availableDesignations = designationsMap[jobOption] || designationsMap.default;
  const availableDistricts = districtsMap[stateVal] || districtsMap.Kerala;

  return (
    <div className="relative w-full bg-[#f7f9f8] min-h-[520px] md:min-h-[620px] flex flex-col">
      {/* ─── Hero Background Image ─── */}
      <div className="hidden md:block absolute inset-x-0 -top-2 bottom-0 z-0 overflow-hidden">
        <Image
          src={heroImgSrc}
          alt="Teachers and schools connecting"
          fill
          unoptimized
          quality={100}
          className="object-cover object-[center_top]"
          priority
          onError={() => setHeroImgSrc("/hero.webp")}
        />
      </div>

      {/* ─── Foreground Content Container ─── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1 pt-8 sm:pt-12 md:pt-[6%] pb-0">

        <div className="max-w-4xl text-left mb-4 sm:mb-5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-xyroots-text leading-[1.15] tracking-tight">
            Finding the right<br />
            <span className="text-xyroots-teal font-serif font-normal text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-normal">teaching job</span> is just a click away
          </h1>
        </div>

        {/* Subtitle */}
        <div className="max-w-3xl mb-5">
          <p className="text-sm sm:text-base md:text-lg text-xyroots-muted leading-relaxed">
            Xyroots connects talented teachers with schools looking for<br className="hidden sm:block" />
            educators who make a real difference in classrooms.
          </p>
        </div>

        {/* Search Component */}
        <div className="w-full bg-white border border-xyroots-border px-4 sm:px-6 lg:px-7 pt-4 pb-7 mt-auto relative z-20 -mb-20 lg:-mb-24 rounded-3xl">

          {/* Tabs Row + CTA */}
          <div className="flex items-center justify-between border-b border-xyroots-border pb-3 mb-5 gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-6 shrink-0">
              {(!isAuthenticated || role !== 'management') && (
                <button
                  onClick={() => setActiveTab("seeker")}
                  className={`relative text-sm sm:text-base font-semibold pb-3 -mb-[14px] transition-colors ${
                      activeTab === "seeker"
                      ? "text-xyroots-teal"
                      : "text-xyroots-muted hover:text-xyroots-text"
                    }`}
                >
                  Job Seeker
                  <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-xyroots-teal transition-transform duration-300 origin-left ${activeTab === 'seeker' ? 'scale-x-100' : 'scale-x-0'}`} />
                </button>
              )}
              {(!isAuthenticated || role !== 'teacher') && (
                <button
                  onClick={() => setActiveTab("management")}
                  className={`relative text-sm sm:text-base font-semibold pb-3 -mb-[14px] transition-colors ${
                      activeTab === "management"
                      ? "text-xyroots-teal"
                      : "text-xyroots-muted hover:text-xyroots-text"
                    }`}
                >
                  Management
                  <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-xyroots-teal transition-transform duration-300 origin-left ${activeTab === 'management' ? 'scale-x-100' : 'scale-x-0'}`} />
                </button>
              )}
            </div>

            {/* CTA */}
            {!isAuthenticated && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden md:inline text-xs sm:text-sm text-xyroots-muted">
                  {activeTab === "seeker" ? "Are you a teacher?" : "Looking to hire a teacher?"}
                </span>
                <button
                  onClick={() => {
                    if (activeTab === "seeker") {
                      openTeacherRegistration();
                    } else {
                      openInstitutionRegistration();
                    }
                  }}
                  className="text-xs sm:text-sm font-semibold text-xyroots-teal hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  {activeTab === "seeker" ? "Register Profile →" : "Register School →"}
                </button>
              </div>
            )}
          </div>

          {activeTab === "seeker" ? (
             <>
                {/* SEEKER PRIMARY ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end">
                  <div>
                    <label className="block text-xs font-bold text-xyroots-text mb-1.5 uppercase tracking-wide">Where do you want the job?*</label>
                    <CustomSelect value={jobOption} onChange={handleInstitutionChange} options={institutionOptions} placeholder="Institution Type" icon={<i className="bi bi-briefcase text-sm" />} searchable />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-xyroots-text mb-1.5 uppercase tracking-wide">State</label>
                    <CustomSelect value={stateVal} onChange={handleStateChange} options={stateOptions} placeholder="Select State" searchable />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-xyroots-text mb-1.5 uppercase tracking-wide">Designation</label>
                    <CustomSelect value={designation} onChange={setDesignation} options={availableDesignations} placeholder="Select Designation" icon={<i className="bi bi-person-badge text-sm" />} searchable />
                  </div>
                  <div>
                    <button onClick={handleSeekerSearch} className="w-full h-[42px] inline-flex items-center justify-center gap-2 bg-xyroots-teal text-white font-semibold text-sm hover:opacity-90 transition-opacity rounded-xl cursor-pointer">
                      <i className="bi bi-search text-sm" /> Search Jobs
                    </button>
                  </div>
                </div>

                {/* SEEKER SECONDARY DROPDOWN FILTER OPTIONS (Matches Jobs Page Filter) */}
                <div className="pt-3.5 border-t border-xyroots-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <i className="bi bi-funnel text-xyroots-teal" /> Filter Options (Jobs Page)
                    </span>
                    <button onClick={clearSeekerFilters} className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors">
                      Clear Filters
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
                    <div>
                      <CustomSelect value={district} onChange={setDistrict} options={availableDistricts} placeholder="District" searchable />
                    </div>
                    <div>
                      <CustomSelect value={subject} onChange={setSubject} options={subjectOptions} placeholder="Subject" searchable />
                    </div>
                    <div>
                      <CustomSelect value={jobType} onChange={setJobType} options={jobTypeOptions} placeholder="Job Type" />
                    </div>
                    <div>
                      <CustomSelect value={board} onChange={setBoard} options={boardOptions} placeholder="Board" />
                    </div>
                    <div>
                      <CustomSelect value={qualification} onChange={setQualification} options={jobQualOptions} placeholder="Qualification" />
                    </div>
                    <div>
                      <CustomSelect value={experience} onChange={setExperience} options={jobExpOptions} placeholder="Experience" />
                    </div>
                    <div>
                      <CustomSelect value={postedDate} onChange={setPostedDate} options={postedDateOptions} placeholder="Date Posted" />
                    </div>
                  </div>
                </div>
             </>
          ) : (
             <>
                {/* MANAGEMENT PRIMARY ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end">
                  <div>
                    <label className="block text-xs font-bold text-xyroots-text mb-1.5 uppercase tracking-wide">Subject Specialisation*</label>
                    <CustomSelect value={subject} onChange={setSubject} options={subjectOptions} placeholder="Choose Subject" icon={<i className="bi bi-book text-sm" />} searchable />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-xyroots-text mb-1.5 uppercase tracking-wide">State</label>
                    <CustomSelect value={stateVal} onChange={handleStateChange} options={stateOptions} placeholder="Select State" searchable />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-xyroots-text mb-1.5 uppercase tracking-wide">Qualification</label>
                    <CustomSelect value={qualification} onChange={setQualification} options={teacherQualOptions} placeholder="Qualification" icon={<i className="bi bi-award text-sm" />} searchable />
                  </div>
                  <div>
                    <button onClick={handleManagementSearch} className="w-full h-[42px] inline-flex items-center justify-center gap-2 bg-xyroots-teal text-white font-semibold text-sm hover:opacity-90 transition-opacity rounded-xl cursor-pointer">
                      <i className="bi bi-search text-sm" /> Find Teachers
                    </button>
                  </div>
                </div>

                {/* MANAGEMENT SECONDARY DROPDOWN FILTER OPTIONS (Matches Teacher Page Filter) */}
                <div className="pt-3.5 border-t border-xyroots-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <i className="bi bi-funnel text-xyroots-teal" /> Filter Options (Teacher Page)
                    </span>
                    <button onClick={clearManagementFilters} className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors">
                      Clear Filters
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
                    <div>
                      <CustomSelect value={district} onChange={setDistrict} options={availableDistricts} placeholder="District" searchable />
                    </div>
                    <div>
                      <CustomSelect value={experience} onChange={setExperience} options={teacherExpOptions} placeholder="Experience" />
                    </div>
                    <div>
                      <CustomSelect value={board} onChange={setBoard} options={boardOptions} placeholder="Board Exp" />
                    </div>
                    <div>
                      <CustomSelect value={teachingLevel} onChange={setTeachingLevel} options={teacherLevelOptions} placeholder="Teaching Level" />
                    </div>
                    <div>
                      <CustomSelect value={preferredMode} onChange={setPreferredMode} options={teacherModeOptions} placeholder="Preferred Mode" />
                    </div>
                    <div>
                      <CustomSelect value={verification} onChange={setVerification} options={teacherVerificationOptions} placeholder="Status / Verification" />
                    </div>
                    <div>
                      <CustomSelect value={noticePeriod} onChange={setNoticePeriod} options={teacherNoticeOptions} placeholder="Availability" />
                    </div>
                  </div>
                </div>
             </>
          )}

        </div>
      </div>
    </div>
  );
}
