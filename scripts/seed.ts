import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { jobs } from "../src/data/jobs";
import { schools } from "../src/data/schools";
import { teachers } from "../src/data/teachers";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding started...");

  // First, we need a profile to act as creator for these items.
  const { data: profiles, error: profileError } = await supabase.from('profiles').select('id, role');
  if (profileError || !profiles || profiles.length === 0) {
    console.error("No profiles found. Seed some users first via app registration.");
    return;
  }
  
  const managementProfile = profiles.find(p => p.role === 'management') || profiles[0];
  const teacherProfileRef = profiles.find(p => p.role === 'teacher') || profiles[0];

  // Seed Institutions
  console.log("Seeding institutions...");
  for (const s of schools) {
    const { error } = await supabase.from('institutions').upsert({
      name: s.name,
      type: s.type,
      location: s.location,
      established: s.established,
      board: s.board,
      verified: s.verified,
      description: s.description,
      logo_url: s.logo,
      created_by_profile_id: managementProfile.id
    }, { onConflict: 'name' });
    if (error) console.error("Error seeding institution:", error);
  }

  // Get mapped institutions
  const { data: insts } = await supabase.from('institutions').select('id, name');

  // Seed Jobs
  console.log("Seeding jobs...");
  for (const j of jobs) {
    const inst = insts?.find(i => j.school.includes(i.name) || i.name.includes(j.school));
    const instId = inst ? inst.id : null;
    
    // Check if job exists
    const { data: existingJobs } = await supabase.from('jobs').select('id').eq('title', j.title).eq('school_name', j.school);
    if (existingJobs && existingJobs.length > 0) continue;

    const { error } = await supabase.from('jobs').insert({
      posted_by_profile_id: managementProfile.id,
      posted_by_role: 'management',
      institution_id: instId,
      title: j.title,
      subject: j.subject,
      description: j.description,
      requirements: j.requirements,
      responsibilities: j.responsibilities,
      benefits: j.benefits,
      qualification: j.qualification,
      professional_qualification: j.professionalQualification,
      experience_min: j.experienceMin,
      experience_max: j.experienceMax,
      employment_type: j.employmentType,
      board: j.board,
      level: j.level,
      location: j.location,
      salary_min: j.salaryMin,
      salary_max: j.salaryMax,
      status: 'published',
      school_name: j.school
    });
    if (error) console.error("Error seeding job:", error);
  }

  // Seed Teacher Profiles
  console.log("Seeding teachers...");
  for (const t of teachers) {
    // Check if exists
    const { data: existingT } = await supabase.from('teacher_profiles').select('id').eq('title', t.title).eq('bio', t.about);
    if (existingT && existingT.length > 0) continue;
    
    const { error } = await supabase.from('teacher_profiles').insert({
      profile_id: teacherProfileRef.id, // all pointing to one user for demo
      subject: t.subjects[0] || "",
      specializations: t.subjects,
      bio: t.about,
      title: t.title,
      experience_years: t.experience,
      experience_details: t.teachingExperience,
      education: t.education,
      location: t.location,
      preferred_locations: t.preferredLocations,
      availability: t.availability,
      skills: t.skills,
      languages: t.languages,
      boards: t.boards,
      work_preferences: t.workPreferences,
      expected_salary_min: t.expectedSalaryMin,
      expected_salary_max: t.expectedSalaryMax,
      has_demo_video: t.hasDemo,
      profile_image_url: t.avatar
    });
    if (error) console.error("Error seeding teacher:", error);
  }

  console.log("Seeding complete!");
}

seed();
