"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CustomSelect from "@/components/ui/CustomSelect";
import Image from "next/image";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useRouter } from "next/navigation";

// ─── Data Maps ─────────────────────────────────────────────────────────────

const qualificationOptions = [
  { value: "bed", label: "B.Ed" },
  { value: "med", label: "M.Ed" },
  { value: "msc", label: "M.Sc / MA" },
  { value: "phd", label: "Ph.D / Doctorate" },
  { value: "net_set", label: "NET / SET Qualified" },
];

const subjectOptions = [
  { value: "maths", label: "Mathematics" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "english", label: "English Literature" },
];

const expFromOptions = [
  { value: "0", label: "Fresher" },
  { value: "1", label: "1 Year" },
  { value: "3", label: "3 Years" },
];

const managementSubjectOptions = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "English", label: "English" },
  { value: "Computer Science", label: "Computer Science" },
];

const managementQualOptions = [
  { value: "bed", label: "B.Ed" },
  { value: "med", label: "M.Ed" },
  { value: "msc", label: "Master's" },
  { value: "phd", label: "Ph.D" },
];

const managementExpOptions = [
  { value: "0", label: "Fresher (0 yrs)" },
  { value: "2", label: "2+ Years" },
  { value: "5", label: "5+ Years" },
  { value: "10", label: "10+ Years" },
];

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
    { value: "physical_ed", label: "Physical Education / Sports Teacher" },
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
];

const districtsMap: Record<string, { value: string; label: string }[]> = {
  Kerala: [
    { value: "kochi", label: "Ernakulam / Kochi" },
    { value: "tvm", label: "Thiruvananthapuram" },
    { value: "calicut", label: "Kozhikode" },
    { value: "thrissur", label: "Thrissur" },
    { value: "kollam", label: "Kollam" },
    { value: "kottayam", label: "Kottayam" },
    { value: "palakkad", label: "Palakkad" },
    { value: "malappuram", label: "Malappuram" },
    { value: "kannur", label: "Kannur" },
    { value: "alappuzha", label: "Alappuzha" },
  ],
  Karnataka: [
    { value: "bengaluru", label: "Bengaluru Urban" },
    { value: "mysuru", label: "Mysuru" },
    { value: "mangaluru", label: "Mangaluru / Dakshina Kannada" },
    { value: "hubballi", label: "Hubballi-Dharwad" },
    { value: "belagavi", label: "Belagavi" },
    { value: "shivamogga", label: "Shivamogga" },
    { value: "udupi", label: "Udupi" },
  ],
  "Tamil Nadu": [
    { value: "chennai", label: "Chennai" },
    { value: "coimbatore", label: "Coimbatore" },
    { value: "madurai", label: "Madurai" },
    { value: "tiruchirappalli", label: "Tiruchirappalli" },
    { value: "salem", label: "Salem" },
    { value: "tiruppur", label: "Tiruppur" },
    { value: "vellore", label: "Vellore" },
  ],
  Maharashtra: [
    { value: "mumbai", label: "Mumbai" },
    { value: "pune", label: "Pune" },
    { value: "nagpur", label: "Nagpur" },
    { value: "nashik", label: "Nashik" },
    { value: "thane", label: "Thane" },
    { value: "sambhajinagar", label: "Chhatrapati Sambhajinagar" },
  ],
  Delhi: [
    { value: "new_delhi", label: "New Delhi" },
    { value: "south_delhi", label: "South Delhi" },
    { value: "north_delhi", label: "North Delhi" },
    { value: "east_delhi", label: "East Delhi" },
    { value: "west_delhi", label: "West Delhi" },
  ],
  Telangana: [
    { value: "hyderabad", label: "Hyderabad" },
    { value: "warangal", label: "Warangal" },
    { value: "nizamabad", label: "Nizamabad" },
    { value: "karimnagar", label: "Karimnagar" },
  ],
  "Uttar Pradesh": [
    { value: "noida", label: "Noida / Greater Noida" },
    { value: "lucknow", label: "Lucknow" },
    { value: "kanpur", label: "Kanpur" },
    { value: "agra", label: "Agra" },
    { value: "varanasi", label: "Varanasi" },
    { value: "prayagraj", label: "Prayagraj" },
  ],
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function Hero() {
  const [heroImgSrc, setHeroImgSrc] = useState(
    "https://res.cloudinary.com/draedbypr/image/upload/v1786420720/hero-section_oanvbj.png"
  );
  const [activeTab, setActiveTab] = useState<"seeker" | "management">("seeker");
  const [jobOption, setJobOption] = useState("");
  const [stateVal, setStateVal] = useState("Kerala");
  const [designation, setDesignation] = useState("");

  // Filter pill states
  const [district, setDistrict] = useState("");
  const [qualification, setQualification] = useState("");
  const [subject, setSubject] = useState("");
  const [regLanguage, setRegLanguage] = useState("");
  const [expFrom, setExpFrom] = useState("");
  const [expTo, setExpTo] = useState("");
  const { openTeacherRegistration, openInstitutionRegistration, isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'management') setActiveTab('management');
      if (role === 'teacher') setActiveTab('seeker');
    }
  }, [isAuthenticated, role]);

  // Handle institution change -> reset designation
  const handleInstitutionChange = (val: string) => {
    setJobOption(val);
    setDesignation("");
  };

  // Handle state change -> reset district
  const handleStateChange = (val: string) => {
    setStateVal(val);
    setDistrict("");
  };

  // Available designations based on selected institution
  const availableDesignations = designationsMap[jobOption] || designationsMap.default;

  // Available districts based on selected state
  const availableDistricts = districtsMap[stateVal] || districtsMap.Kerala;

  return (
    <div className="relative w-full bg-[#f7f9f8] min-h-[520px] md:min-h-[620px] flex flex-col">
      {/* ─── Hero Background Image: shifted slightly up with -top-2 ─── */}
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
        <div className="w-full bg-white border border-xyroots-border shadow-xl px-4 sm:px-6 lg:px-7 pt-4 pb-8 mt-auto relative z-20 -mb-20 lg:-mb-24" style={{ borderRadius: "1.5rem" }}>

          {/* Tabs Row + CTA on ONE line */}
          <div className="flex items-center justify-between border-b border-xyroots-border pb-3 mb-4 gap-4">
            {/* Tabs (left) */}
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

            {/* CTA only (right) */}
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
                {/* SEEKER FILTER ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-xyroots-text mb-1.5">Where do you want the job?*</label>
                    <CustomSelect value={jobOption} onChange={handleInstitutionChange} options={institutionOptions} placeholder="Choose an option" icon={<i className="bi bi-briefcase text-sm" />} searchable />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-xyroots-text mb-1.5">State</label>
                    <CustomSelect value={stateVal} onChange={handleStateChange} options={stateOptions} placeholder="State" searchable />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-xyroots-text mb-1.5">Designation</label>
                    <CustomSelect value={designation} onChange={setDesignation} options={availableDesignations} placeholder="Select a designation" icon={<i className="bi bi-book text-sm" />} searchable />
                  </div>
                  <div>
                    {isAuthenticated ? (
                      <Link href={`/jobs?state=${stateVal}${jobOption ? `&type=${jobOption}` : ""}${designation ? `&desig=${designation}` : ""}`} className="w-full h-[42px] inline-flex items-center justify-center gap-2 bg-xyroots-teal text-white font-semibold text-sm hover:opacity-90 transition-opacity rounded-md">
                        <i className="bi bi-search text-sm" /> Search
                      </Link>
                    ) : (
                      <button onClick={() => openTeacherRegistration()} className="w-full h-[42px] inline-flex items-center justify-center gap-2 bg-xyroots-teal text-white font-semibold text-sm hover:opacity-90 transition-opacity rounded-md">
                        <i className="bi bi-search text-sm" /> Search
                      </button>
                    )}
                  </div>
                </div>
                {/* Secondary Filters */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-2 pt-3 border-t border-xyroots-border text-xs">
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="w-full sm:w-32"><CustomSelect value={district} onChange={setDistrict} options={availableDistricts} placeholder="District" searchable /></div>
                    <div className="w-full sm:w-36"><CustomSelect value={qualification} onChange={setQualification} options={qualificationOptions} placeholder="Qualification" /></div>
                    <div className="w-full sm:w-36"><CustomSelect value={subject} onChange={setSubject} options={subjectOptions} placeholder="Subject" searchable /></div>
                    <div className="w-full sm:w-36"><CustomSelect value={expFrom} onChange={setExpFrom} options={expFromOptions} placeholder="Exp From" /></div>
                  </div>
                  <div className="w-full sm:w-auto mt-1 sm:mt-0">
                    {isAuthenticated ? (
                      <button onClick={() => router.push('/jobs')} className="w-full sm:w-auto px-3 py-1.5 bg-white border border-xyroots-border text-xyroots-text font-semibold inline-flex items-center justify-center gap-1 hover:bg-xyroots-surface cursor-pointer">
                        <i className="bi bi-sliders text-xs" /> All Filter
                      </button>
                    ) : (
                      <button onClick={() => openTeacherRegistration()} className="w-full sm:w-auto px-3 py-1.5 bg-white border border-xyroots-border text-xyroots-text font-semibold inline-flex items-center justify-center gap-1 hover:bg-xyroots-surface">
                        <i className="bi bi-sliders text-xs" /> All Filter
                      </button>
                    )}
                  </div>
                </div>
             </>
          ) : (
             <>
                {/* MANAGEMENT FILTER ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-xyroots-text mb-1.5">Are you looking for?*</label>
                    <CustomSelect value={subject} onChange={setSubject} options={managementSubjectOptions} placeholder="Subject specialisation" icon={<i className="bi bi-book text-sm" />} searchable />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-xyroots-text mb-1.5">State</label>
                    <CustomSelect value={stateVal} onChange={handleStateChange} options={stateOptions} placeholder="State" searchable />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-xyroots-text mb-1.5">Qualification</label>
                    <CustomSelect value={qualification} onChange={setQualification} options={managementQualOptions} placeholder="Any Qualification" icon={<i className="bi bi-award text-sm" />} searchable />
                  </div>
                  <div>
                    {isAuthenticated ? (
                      <Link href={`/teachers?state=${stateVal}${subject ? `&subject=${subject}` : ""}`} className="w-full h-[42px] inline-flex items-center justify-center gap-2 bg-xyroots-teal text-white font-semibold text-sm hover:opacity-90 transition-opacity rounded-md">
                        <i className="bi bi-search text-sm" /> Find Teachers
                      </Link>
                    ) : (
                      <button onClick={() => openInstitutionRegistration()} className="w-full h-[42px] inline-flex items-center justify-center gap-2 bg-xyroots-teal text-white font-semibold text-sm hover:opacity-90 transition-opacity rounded-md">
                        <i className="bi bi-search text-sm" /> Find Teachers
                      </button>
                    )}
                  </div>
                </div>
                {/* Management Secondary Filters */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-2 pt-3 border-t border-xyroots-border text-xs">
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="w-full sm:w-36"><CustomSelect value={district} onChange={setDistrict} options={availableDistricts} placeholder="District Limit" searchable /></div>
                    <div className="w-full sm:w-36"><CustomSelect value={expFrom} onChange={setExpFrom} options={managementExpOptions} placeholder="Min Experience" /></div>
                  </div>
                </div>
             </>
          )}

        </div>
      </div>


    </div>
  );
}
