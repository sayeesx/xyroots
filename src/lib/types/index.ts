// ─── User Roles ─────────────────────────────────────────────────────────────────
export type UserRole = 'teacher' | 'management' | 'agency'

export const USER_ROLES: readonly UserRole[] = ['teacher', 'management', 'agency'] as const

// ─── Account Status ─────────────────────────────────────────────────────────────
export type AccountStatus = 'active' | 'suspended' | 'deleted'

// ─── Job Status ─────────────────────────────────────────────────────────────────
export type JobStatus = 'draft' | 'published' | 'closed' | 'archived'

// ─── Application Status ─────────────────────────────────────────────────────────
export type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'offered' | 'rejected' | 'withdrawn'

// ─── Profile ────────────────────────────────────────────────────────────────────
export interface Profile {
  id: string
  auth_user_id: string
  role: UserRole
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  status: AccountStatus
  created_at: string
  updated_at: string
  last_login_at: string | null
}

// ─── Teacher Profile ────────────────────────────────────────────────────────────
export interface TeacherProfile {
  id: string
  profile_id: string
  subject: string | null
  specializations: string[]
  bio: string | null
  title: string | null
  qualification: string | null
  professional_qualification: string | null
  experience_years: number | null
  experience_details: ExperienceDetail[]
  education: EducationDetail[]
  location: string | null
  preferred_locations: string[]
  availability: string | null
  resume_url: string | null
  profile_image_url: string | null
  skills: string[]
  languages: string[]
  boards: string[]
  expected_salary_min: number | null
  expected_salary_max: number | null
  work_preferences: string[]
  has_demo_video: boolean
  demo_video_url: string | null
  profile_completion: number
  created_at: string
  updated_at: string
}

export interface ExperienceDetail {
  role: string
  school: string
  duration: string
  current: boolean
}

export interface EducationDetail {
  degree: string
  institution: string
  year: number
}

// ─── Management Profile ─────────────────────────────────────────────────────────
export interface ManagementProfile {
  id: string
  profile_id: string
  contact_name: string
  institution_id: string | null
  institution_name: string | null
  designation: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

// ─── Agency Profile ─────────────────────────────────────────────────────────────
export interface AgencyProfile {
  id: string
  profile_id: string
  agency_name: string
  contact_name: string
  phone: string | null
  email: string | null
  website: string | null
  location: string | null
  description: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

// ─── Institution ────────────────────────────────────────────────────────────────
export interface Institution {
  id: string
  name: string
  type: string | null
  description: string | null
  logo_url: string | null
  cover_image_url: string | null
  location: string | null
  city: string | null
  state: string | null
  country: string
  website: string | null
  contact_email: string | null
  contact_phone: string | null
  board: string[]
  established: number | null
  verified: boolean
  created_by_profile_id: string | null
  created_at: string
  updated_at: string
}

// ─── Job ────────────────────────────────────────────────────────────────────────
export interface Job {
  id: string
  posted_by_profile_id: string
  posted_by_role: UserRole
  institution_id: string | null
  title: string
  subject: string
  description: string | null
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  qualification: string | null
  professional_qualification: string | null
  experience_min: number | null
  experience_max: number | null
  employment_type: string | null
  board: string | null
  level: string | null
  location: string | null
  salary_min: number | null
  salary_max: number | null
  application_deadline: string | null
  status: JobStatus
  school_name: string | null
  created_at: string
  updated_at: string
}

// ─── Application ────────────────────────────────────────────────────────────────
export interface Application {
  id: string
  job_id: string
  teacher_profile_id: string
  applicant_profile_id: string
  cover_letter: string | null
  resume_url: string | null
  status: ApplicationStatus
  notes: string | null
  created_at: string
  updated_at: string
}

// ─── Audit Log ──────────────────────────────────────────────────────────────────
export interface AuditLog {
  id: string
  profile_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

// ─── Auth State ─────────────────────────────────────────────────────────────────
export interface AuthState {
  user: import('@supabase/supabase-js').User | null
  profile: Profile | null
  role: UserRole | null
  isAuthenticated: boolean
  loading: boolean
}

// ─── Service Response ───────────────────────────────────────────────────────────
export interface ServiceResponse<T = void> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
}
