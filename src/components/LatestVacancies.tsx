import Link from "next/link";
import { FaBuilding, FaUsers, FaBookmark, FaArrowRight, FaLocationDot, FaPeopleGroup, FaBook, FaBriefcase, FaUser, FaEnvelope, FaCircleCheck } from "react-icons/fa6";
import { createClient } from "@/lib/supabase/server";
import AuthGuardedLink from "@/components/AuthGuardedLink";

// ─── Data types mapped to static structures for UI compatibility ───────────────

function JobCard({ job, isAuthenticated }: { job: any, isAuthenticated: boolean }) {
  return (
    <div className="flex flex-col h-full border border-gray-200 bg-white hover:border-gray-900 transition-all group shadow-sm hover:shadow-md" style={{ borderRadius: "0.75rem" }}>
      <div className="flex flex-1 flex-col">
        {/* Top header — matches TeacherCard header style, black dominant */}
        <div className="border-b border-gray-100 px-4 py-3" style={{ borderRadius: "0.75rem 0.75rem 0 0", background: "linear-gradient(to right, #f9fafb, #f3f4f6)" }}>
          <div className="flex items-start gap-3">
            {/* Institution icon */}
            <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-gray-900 text-white font-bold text-base border border-gray-800 overflow-hidden" style={{ borderRadius: "0.5rem" }}>
              <FaBuilding className="w-5 h-5 text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 mb-1 leading-tight" style={{ borderRadius: "0.25rem" }}>
                {job.type}
              </span>
              <AuthGuardedLink href={`/jobs/${job.slug}`} type="teacher" className="block text-gray-900 font-bold text-[13px] leading-snug hover:text-black transition-colors line-clamp-2 text-left">
                {job.title}
              </AuthGuardedLink>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <FaLocationDot className="inline w-2.5 h-2.5 text-gray-400" />
                {job.location}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons — black primary, green secondary */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
          <AuthGuardedLink href={`/jobs/${job.slug}`} type="teacher" className="flex-1 text-center text-xs font-bold py-1.5 bg-gray-900 text-white hover:bg-black hover:scale-[1.02] flex items-center justify-center gap-1 transition-all duration-200" style={{ borderRadius: "0.5rem" }}>
            Apply Now <FaArrowRight className="inline w-2.5 h-2.5" />
          </AuthGuardedLink>
          <AuthGuardedLink href={`/jobs/${job.slug}`} type="teacher" className="flex-1 text-center text-xs font-medium py-1.5 border border-[#00a264]/40 text-[#00a264] hover:bg-[#00a264] hover:text-white flex items-center justify-center gap-1 transition-all duration-200" style={{ borderRadius: "0.5rem" }}>
            <FaBookmark className="inline w-2.5 h-2.5" /> Save
          </AuthGuardedLink>
          <AuthGuardedLink href={`/jobs/${job.slug}`} type="teacher" className="flex-1 text-center text-xs font-medium py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 flex items-center justify-center" style={{ borderRadius: "0.5rem" }}>
            Details
          </AuthGuardedLink>
        </div>

        {/* Meta + Details */}
        <div className="px-4 py-3 flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>
              Posted: <span className="text-gray-700 font-medium">{job.postedDate}</span>
            </span>
            <span className="flex items-center gap-1">
              <FaPeopleGroup className="inline w-2.5 h-2.5 text-gray-400" />
              Openings: <span className="text-gray-700 font-medium ml-0.5">{job.openings}</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 text-xs mt-1">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Qualification</p>
              <p className="text-gray-700 leading-snug">{job.qualification}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Experience</p>
              <p className="text-gray-700 text-sm">{job.experience}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#00a264] uppercase tracking-wide mb-0.5">Salary</p>
              <p className="text-gray-900 font-bold">{job.salary}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between" style={{ borderRadius: "0 0 0.75rem 0.75rem", background: "linear-gradient(to right, #f9fafb, #f3f4f6)" }}>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <FaLocationDot className="inline w-2.5 h-2.5 text-gray-400" />
            {job.location}
          </span>
          <span className="text-[11px] font-mono text-gray-400">{job.id}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Teacher Card ──────────────────────────────────────────────────────────────

function TeacherCard({ teacher, isAuthenticated }: { teacher: any, isAuthenticated: boolean }) {
  return (
    <div className="flex flex-col h-full border border-gray-200 bg-white hover:border-gray-400 transition-all group shadow-sm" style={{ borderRadius: "0.75rem", background: "linear-gradient(135deg, #fff 80%, #f0fdf4 100%)" }}>
      {/* Top header */}
      <div className="border-b border-gray-100 px-4 py-3" style={{ borderRadius: "0.75rem 0.75rem 0 0", background: "linear-gradient(to right, #f9fafb, #f0fdf4)" }}>
        <div className="flex items-center gap-3">
          {/* Avatar — photo or initials */}
          <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-base border border-gray-200 overflow-hidden" style={{ borderRadius: "0.5rem" }}>
            {teacher.avatar_url
              ? <img src={teacher.avatar_url} alt={teacher.name} className="w-full h-full object-cover" style={{ borderRadius: "0.5rem" }} />
              : (teacher.name || "T").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 mb-1 leading-tight" style={{ borderRadius: "0.25rem" }}>
              {teacher.designation}
            </span>
            <AuthGuardedLink href={`/teachers/${teacher.slug}`} type="institution" className="block text-gray-900 font-semibold text-[13px] leading-snug hover:text-black transition-colors text-left">
              {teacher.name}
            </AuthGuardedLink>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <FaBook className="inline w-2.5 h-2.5 text-gray-400" />
              {teacher.subject}
            </p>
          </div>
          <div className="flex flex-col flex-1 items-end justify-start gap-1.5 shrink-0 pt-0.5">
            <div className="text-xs text-gray-500 text-right flex flex-col gap-1">
              <span className="flex items-center justify-end gap-1">
                <FaBriefcase className="inline w-2.5 h-2.5 text-gray-400" />
                {teacher.experience}
              </span>
              <span className="flex items-center justify-end gap-1">
                <FaLocationDot className="inline w-2.5 h-2.5 text-gray-400" />
                {teacher.location.split(',')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
        <AuthGuardedLink href={`/teachers/${teacher.slug}`} type="institution" className="flex-1 text-center text-xs font-semibold py-1.5 bg-[#00a264] text-white hover:bg-[#007a4d] hover:scale-[1.03] flex items-center justify-center gap-1 transition-all duration-200" style={{ borderRadius: "0.5rem" }}><FaUser className="inline w-2.5 h-2.5" /> View Profile</AuthGuardedLink>
        <AuthGuardedLink href={`/teachers/${teacher.slug}`} type="institution" className="flex-1 text-center text-xs font-medium py-1.5 border border-[#00a264]/40 text-[#00a264] hover:bg-[#00a264] hover:text-white flex items-center justify-center gap-1 transition-all duration-200" style={{ borderRadius: "0.5rem" }}><FaEnvelope className="inline w-2.5 h-2.5" /> Contact</AuthGuardedLink>
        <AuthGuardedLink href={`/teachers/${teacher.slug}`} type="institution" className="flex-1 text-center text-xs font-medium py-1.5 border border-[#00a264]/40 text-[#00a264] hover:bg-[#00a264] hover:text-white flex items-center justify-center gap-1 transition-all duration-200" style={{ borderRadius: "0.5rem" }}><FaBookmark className="inline w-2.5 h-2.5" /> Shortlist</AuthGuardedLink>
      </div>

      {/* Details */}
      <div className="px-4 py-3 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs mt-1">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Qualification</p>
            <p className="text-gray-700 leading-snug">{teacher.qualification}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Languages</p>
            <div className="flex flex-wrap gap-1">
              {teacher.languages?.map((lang: string) => (
                <span key={lang} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[11px] border border-gray-200" style={{ borderRadius: "0.25rem" }}>
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between" style={{ borderRadius: "0 0 0.75rem 0.75rem", background: "linear-gradient(to right, #f9fafb, #f0fdf4)" }}>
        <span className="text-[11px] font-mono text-gray-400">{teacher.id}</span>
        <span className="text-xs text-[#00a264] font-semibold flex items-center gap-1">
          <FaCircleCheck className="inline w-3 h-3" /> Verified
        </span>
      </div>
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default async function LatestVacancies() {
  const supabase = await createClient();

  // Inspect auth + fetch data in parallel
  const { data: { user } } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('auth_user_id', user.id).single();
    if (profile) role = (profile as any).role;
  }
  
  const jobLimit = 3;

  // Fetch jobs and teachers in parallel
  // Only show "verified" teachers = profile_completion >= 80, max 3
  const [{ data: rawJobs }, { data: rawTeachers }] = await Promise.all([
    supabase.from("jobs").select("id, title, level, created_at, qualification, experience_min, experience_max, salary_min, salary_max, location").eq("status", "published").limit(jobLimit).order("created_at", { ascending: false }),
    supabase.from("teacher_profiles").select("id, subject, title, location, experience_years, professional_qualification, languages, availability, profile_completion, profiles(full_name, avatar_url, status)").eq("is_visible", true).gte("profile_completion", 80).limit(3).order("profile_completion", { ascending: false }),
  ]);

  const jobCards = ((rawJobs as any[]) || []).map((j: any) => ({
    id: j.id.substring(0,8).toUpperCase(),
    title: j.title || "Untitled Job",
    type: j.level || "Educator",
    postedDate: new Date(j.created_at).toLocaleDateString(),
    openings: 1,
    qualification: j.qualification || "Graduation",
    experience: j.experience_min ? `${j.experience_min}-${j.experience_max} Years` : "Fresher",
    salary: j.salary_min ? `${(j.salary_min/1000).toFixed(0)}k-${(j.salary_max/1000).toFixed(0)}k` : "As per std",
    location: j.location || "Remote",
    slug: `${(j.title || "Untitled Job").toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${j.id}`,
  }));

  // Map all teachers - slug is just the UUID so the detail page finds it correctly
  const teacherCards = ((rawTeachers as any[]) || []).map((t: any) => {
    // profiles join can return an object or array - handle both
    const profile = Array.isArray(t.profiles) ? t.profiles[0] : t.profiles;
    const teacherName = profile?.full_name || "Educator";
    const avatarUrl = profile?.avatar_url || null;

    return {
      id: t.id.substring(0, 8).toUpperCase(),
      name: teacherName,
      avatar_url: avatarUrl,
      designation: t.title || "Subject Teacher",
      subject: t.subject || "General",
      experience: t.experience_years ? `${t.experience_years} Years` : 'Fresher',
      qualification: t.professional_qualification || "B.Ed",
      location: t.location || "India",
      languages: t.languages?.length > 0 ? t.languages : ["English"],
      availability: t.availability || "Immediate",
      slug: t.id, // Use raw UUID — detail page expects this
    };
  });

  return (
    <section className="py-12 lg:py-16 bg-[#f5f7f6]" aria-label="Latest Vacancies and Teacher Profiles">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {role === 'management' ? 'Top Profiles' : (!role || role === 'agency') ? 'Latest Vacancies and Top Teacher Profiles' : 'Latest Vacancies'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {role === 'management' ? 'Verified educators ready to join your institution' : 'Open positions from verified institutions across India'}
            </p>
          </div>
        </div>

        {/* Conditional Grid Rendering */}
        <div className={`grid ${!role ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'} gap-6 lg:gap-8 items-start`}>
          
          {/* Left: Hiring Cards (Hidden if role is management) */}
          {role !== 'management' && (
            <div className={`${role === 'teacher' ? 'md:col-span-2' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FaBuilding className="w-4 h-4 text-gray-700" />
                  Institutions Hiring
                </h3>
                <AuthGuardedLink href="/jobs" type="teacher" className="text-xs text-gray-700 hover:text-black hover:underline font-semibold">
                  Browse All →
                </AuthGuardedLink>
              </div>
              <div className={`grid gap-4 h-full ${role === 'teacher' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-rows-3'}`}>
                {jobCards.map((job) => (
                  <JobCard key={job.id} job={job} isAuthenticated={!!role} />
                ))}
              </div>
            </div>
          )}

          {/* Right: Teacher Cards (Hidden if role is teacher) */}
          {role !== 'teacher' && (
            <div className={`${role === 'management' ? 'md:col-span-2' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FaUsers className="w-4 h-4 text-gray-500" />
                  Teacher Profiles
                </h3>
                <AuthGuardedLink href="/teachers" type="institution" className="text-xs text-gray-600 hover:text-black hover:underline font-medium">
                  Browse All →
                </AuthGuardedLink>
              </div>
              <div className={`grid gap-4 h-full ${role === 'management' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-rows-3'}`}>
                {teacherCards.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} isAuthenticated={!!role} />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Bottom CTA strip */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Showing {jobCards.length} of <span className="font-semibold text-gray-700">247</span> open vacancies across India
          </p>
          <div className="flex items-center gap-3">
            {!role && (
              <>
                <AuthGuardedLink
                  href="/jobs"
                  type="teacher"
                  className="px-5 py-2 text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
                  style={{ borderRadius: "0.5rem" }}
                >
                  Post Your Profile
                </AuthGuardedLink>
                <AuthGuardedLink
                  href="/teachers"
                  type="institution"
                  className="px-5 py-2 text-sm font-semibold bg-gray-900 text-white hover:bg-black transition-colors"
                  style={{ borderRadius: "0.5rem" }}
                >
                  Post a Job
                </AuthGuardedLink>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
