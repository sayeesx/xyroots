import Link from "next/link";
import { FaBuilding, FaUsers, FaStar, FaBookmark, FaArrowRight, FaLocationDot, FaPeopleGroup, FaBook, FaBriefcase, FaUser, FaEnvelope, FaCircleCheck } from "react-icons/fa6";
import { createClient } from "@/lib/supabase/server";
import AuthGuardedLink from "@/components/AuthGuardedLink";

// ─── Data types mapped to static structures for UI compatibility ───────────────

function JobCard({ job, isAuthenticated }: { job: any, isAuthenticated: boolean }) {
  const ctaLink = isAuthenticated ? `/jobs/${job.slug}` : "/register/teacher";

  return (
    <div className="flex flex-col h-full border-2 border-[#00a264]/20 bg-white hover:border-[#00a264] hover:bg-[#f9fcfb] transition-all hover:shadow-md group rounded-xl">
      {/* Green left accent bar */}
      <div className="flex flex-1 flex-col">
        {/* Top header */}
        <div className="bg-[#f0f7f4] border-b-2 border-[#00a264]/20 px-4 py-3 rounded-t-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Institution type chip */}
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-[#00a264]/10 text-[#00a264] px-2 py-0.5 mb-1.5 rounded-sm">
                {job.type}
              </span>
              <AuthGuardedLink href={`/jobs/${job.slug}`} type="teacher" className="block text-black font-semibold text-sm leading-snug hover:text-[#00a264] transition-colors line-clamp-2 text-left">
                {job.title}
              </AuthGuardedLink>
            </div>
            {/* Rating */}
            {job.rating && (
              <span className="inline-flex items-center gap-1 bg-[#00a264] text-white text-[11px] font-bold px-1.5 py-0.5 shrink-0 rounded-sm">
                {job.rating} <FaStar className="inline w-2.5 h-2.5" />
              </span>
            )}
          </div>
        </div>

        {/* Action buttons row */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#e8f0ec]">
          <AuthGuardedLink href={`/jobs/${job.slug}`} type="teacher" className="flex-1 text-center text-xs font-medium py-1.5 border border-[#c8d8d0] text-gray-600 hover:border-[#00a264] hover:text-[#00a264] flex items-center justify-center gap-1 transition-colors rounded-lg"><FaBookmark className="inline w-2.5 h-2.5" /> Save</AuthGuardedLink>
          <AuthGuardedLink href={`/jobs/${job.slug}`} type="teacher" className="flex-1 text-center text-xs font-semibold py-1.5 bg-[#00a264] text-white hover:opacity-90 flex items-center justify-center gap-1 transition-opacity rounded-lg">Apply Now <FaArrowRight className="inline w-2.5 h-2.5" /></AuthGuardedLink>
          <AuthGuardedLink href={`/jobs/${job.slug}`} type="teacher" className="flex-1 text-center text-xs font-medium py-1.5 border border-[#c8d8d0] text-gray-600 hover:border-[#00a264] hover:text-[#00a264] transition-colors rounded-lg flex items-center justify-center">Quick Apply</AuthGuardedLink>
        </div>

        {/* Meta + Details */}
        <div className="px-4 py-3 flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>
              Posted: <span className="text-gray-700 font-medium">{job.postedDate}</span>
            </span>
            <span className="flex items-center gap-1">
              <FaPeopleGroup className="inline w-2.5 h-2.5 text-[#00a264]" />
              Openings: <span className="text-gray-700 font-medium ml-0.5">{job.openings}</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 text-xs mt-1">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Qualification</p>
              <p className="text-gray-700 leading-snug">{job.qualification}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Experience</p>
              <p className="text-gray-700 text-sm">{job.experience}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Salary</p>
              <p className="text-gray-700">{job.salary}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[#e8f0ec] bg-[#f9fcfb] flex items-center justify-between rounded-b-xl">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <FaLocationDot className="inline w-2.5 h-2.5 text-[#00a264]" />
            {job.location}
          </span>
          <span className="text-[10px] font-mono text-gray-400">{job.id}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Teacher Card ──────────────────────────────────────────────────────────────

function TeacherCard({ teacher, isAuthenticated }: { teacher: any, isAuthenticated: boolean }) {
  const ctaLink = isAuthenticated ? `/teachers/${teacher.slug}` : "/register/employer";

  return (
    <div className="flex flex-col h-full border-2 border-[#1e63c3]/20 bg-white hover:border-[#1e63c3] hover:bg-[#f6f9ff] transition-all hover:shadow-md group rounded-xl">
      {/* Top header — Blue palette for teachers */}
      <div className="bg-[#eef3fb] border-b-2 border-[#1e63c3]/20 px-4 py-3 rounded-t-xl">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-[#1e63c3]/25 flex items-center justify-center shrink-0 overflow-hidden bg-[#eef3fb]">
            <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider bg-[#1e63c3]/10 text-[#1e63c3] px-2 py-0.5 mb-1 leading-tight whitespace-nowrap overflow-hidden rounded-sm" style={{maxWidth:"100%",fontSize:"clamp(7px,1.8vw,10px)"}}>
              {teacher.designation}
            </span>
            <AuthGuardedLink href={`/teachers/${teacher.slug}`} type="institution" className="block text-black font-semibold text-sm leading-snug hover:text-[#1e63c3] transition-colors text-left">
              {teacher.name}
            </AuthGuardedLink>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <FaBook className="inline w-2.5 h-2.5 text-[#1e63c3]" />
              {teacher.subject}
            </p>
          </div>
          <div className="flex flex-col flex-1 items-end justify-start gap-1.5 shrink-0 pt-0.5">
            <div className="text-xs text-gray-500 text-right flex flex-col gap-1">
              <span className="flex items-center justify-end gap-1">
                <FaBriefcase className="inline w-2.5 h-2.5 text-[#1e63c3]" />
                {teacher.experience}
              </span>
              <span className="flex items-center justify-end gap-1">
                <FaLocationDot className="inline w-2.5 h-2.5 text-[#1e63c3]" />
                {teacher.location.split(',')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#dce7f5]">
        <AuthGuardedLink href={`/teachers/${teacher.slug}`} type="institution" className="flex-1 text-center text-xs font-semibold py-1.5 bg-[#1e63c3] text-white hover:opacity-90 flex items-center justify-center gap-1 transition-opacity rounded-lg"><FaUser className="inline w-2.5 h-2.5" /> View Profile</AuthGuardedLink>
        <AuthGuardedLink href={`/teachers/${teacher.slug}`} type="institution" className="flex-1 text-center text-xs font-medium py-1.5 border border-[#c0cfe0] text-gray-600 hover:border-[#1e63c3] hover:text-[#1e63c3] flex items-center justify-center gap-1 transition-colors rounded-lg"><FaEnvelope className="inline w-2.5 h-2.5" /> Contact</AuthGuardedLink>
        <AuthGuardedLink href={`/teachers/${teacher.slug}`} type="institution" className="flex-1 text-center text-xs font-medium py-1.5 border border-[#c0cfe0] text-gray-600 hover:border-[#1e63c3] hover:text-[#1e63c3] flex items-center justify-center gap-1 transition-colors rounded-lg"><FaBookmark className="inline w-2.5 h-2.5" /> Shortlist</AuthGuardedLink>
      </div>

      {/* Details */}
      <div className="px-4 py-3 flex-1 flex flex-col justify-center">

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs mt-1">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Qualification</p>
            <p className="text-gray-700 leading-snug">{teacher.qualification}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Languages</p>
            <div className="flex flex-wrap gap-1">
              {teacher.languages?.map((lang: string) => (
                <span key={lang} className="px-1.5 py-0.5 bg-[#eef3fb] text-[#1e63c3] text-[11px] border border-[#c0cfe0] rounded-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[#dce7f5] bg-[#f6f9ff] flex items-center justify-between rounded-b-xl">
        <span className="text-[10px] font-mono text-gray-400">{teacher.id}</span>
        <span className="text-[11px] text-[#1e63c3] font-semibold flex items-center gap-1">
          <FaCircleCheck className="inline w-3 h-3" /> Verified
        </span>
      </div>
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────

import { teachers as mockTeachers } from "@/data/teachers";

export default async function LatestVacancies() {
  const supabase = await createClient();

  // Inspect auth
  let role: string | null = null;
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('auth_user_id', user.id).single();
    if (profile) role = (profile as any).role;
  }
  
  const limit = role ? 4 : 3;

  // Fetch jobs
  const { data: rawJobs } = await supabase
    .from("jobs")
    .select("*")
    .limit(limit)
    .order("created_at", { ascending: false });

  // Fetch teachers
  const { data: rawTeachers } = await supabase
    .from("teacher_profiles")
    .select(`*, profiles(full_name, avatar_url)`)
    .limit(limit)
    .order("created_at", { ascending: false });

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
    rating: 4,
    slug: `${(j.title || "Untitled Job").toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${j.id}`,
  }));

  let teacherCards = [];
  if (!role) {
    // Show dummy teachers if not authenticated
    teacherCards = mockTeachers.slice(0, 3).map((t) => ({
      id: t.id,
      name: t.name,
      designation: t.title,
      subject: t.subjects[0],
      experience: `${t.experience} Years`,
      qualification: t.professionalQualifications[0] || "B.Ed",
      location: t.location,
      languages: t.languages,
      availability: t.availability,
      slug: t.slug,
      image: t.avatar?.startsWith("http") ? t.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${t.name}&chars=2`
    }));
  } else {
    teacherCards = ((rawTeachers as any[]) || []).map((t: any) => ({
      id: t.id.substring(0,8).toUpperCase(),
      name: t.profiles?.full_name || "Anonymous Educator",
      designation: t.title || "Subject Teacher",
      subject: t.subject || "General",
      experience: t.experience_years ? `${t.experience_years} Years` : 'Fresher',
      qualification: "B.Ed", // mock mapping
      location: t.location || t.profiles?.location || "India",
      languages: t.languages || ["English"],
      availability: t.availability || "Immediate",
      slug: `${(t.profiles?.full_name || "Anonymous").toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${t.id}`,
      image: t.profiles?.avatar_url || t.profile_image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${t.profiles?.full_name || "M"}&chars=2`
    }));
  }

  return (
    <section className="py-12 lg:py-16 bg-[#f5f7f6]" aria-label="Latest Vacancies and Teacher Profiles">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {role === 'management' ? 'Top Profiles' : 'Latest Vacancies'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Open positions from verified institutions across India</p>
          </div>
        </div>

        {/* Conditional Grid Rendering */}
        <div className={`grid ${!role ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'} gap-6 lg:gap-8 items-start`}>
          
          {/* Left: Hiring Cards (Hidden if role is management) */}
          {role !== 'management' && (
            <div className={`${role === 'teacher' ? 'md:col-span-2' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FaBuilding className="w-4 h-4 text-[#00a264]" />
                  Institutions Hiring
                </h3>
                <AuthGuardedLink href="/jobs" type="teacher" className="text-xs text-[#00a264] hover:underline font-medium">
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
                  <FaUsers className="w-4 h-4 text-[#1e63c3]" />
                  Teacher Profiles
                </h3>
                <AuthGuardedLink href="/teachers" type="institution" className="text-xs text-[#1e63c3] hover:underline font-medium">
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
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#dde5e0] pt-6">
          <p className="text-sm text-gray-500">
            Showing 3 of <span className="font-semibold text-gray-700">247</span> open vacancies across India
          </p>
          <div className="flex items-center gap-3">
            {!role && (
              <>
                <AuthGuardedLink
                  href="/jobs"
                  type="teacher"
                  className="px-5 py-2 text-sm font-semibold border border-[#1e63c3] text-[#1e63c3] hover:bg-[#1e63c3] hover:text-white transition-colors rounded-lg"
                >
                  Post Your Profile
                </AuthGuardedLink>
                <AuthGuardedLink
                  href="/teachers"
                  type="institution"
                  className="px-5 py-2 text-sm font-semibold bg-[#00a264] text-white hover:bg-[#008f58] transition-colors rounded-lg"
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
