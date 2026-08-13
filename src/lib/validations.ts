import { z } from 'zod'

// ─── Shared Validators ──────────────────────────────────────────────────────────

const phoneSchema = z.string()
  .regex(/^\+?[\d\s\-()]{7,15}$/, 'Please enter a valid phone number')
  .or(z.literal(''))
  .optional()
  .nullable()

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

const emailSchema = z.string().email('Please enter a valid email address').trim()

const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100).trim()

// ─── Teacher Signup ─────────────────────────────────────────────────────────────

export const teacherSignupSchema = z.object({
  fullName: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  subject: z.string().min(1, 'Please select a subject'),
  password: passwordSchema,
})

export type TeacherSignupInput = z.infer<typeof teacherSignupSchema>

// ─── Management Signup ──────────────────────────────────────────────────────────

export const managementSignupSchema = z.object({
  contactName: nameSchema,
  phone: phoneSchema,
  institutionName: z.string().min(2, 'Institution name is required').max(200).trim(),
  email: emailSchema,
  password: passwordSchema,
})

export type ManagementSignupInput = z.infer<typeof managementSignupSchema>

// ─── Agency Signup ──────────────────────────────────────────────────────────────

export const agencySignupSchema = z.object({
  contactName: nameSchema,
  phone: phoneSchema,
  agencyName: z.string().min(2, 'Agency name is required').max(200).trim(),
  email: emailSchema,
  password: passwordSchema,
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  location: z.string().optional(),
})

export type AgencySignupInput = z.infer<typeof agencySignupSchema>

// ─── Sign In ────────────────────────────────────────────────────────────────────

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export type SignInInput = z.infer<typeof signInSchema>

// ─── Password Reset ─────────────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// ─── Profile Updates ────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  full_name: nameSchema.optional(),
  phone: phoneSchema,
  avatar_url: z.string().url().optional().nullable(),
})

export const updateTeacherProfileSchema = z.object({
  subject: z.string().optional(),
  specializations: z.array(z.string()).optional(),
  bio: z.string().max(2000).optional().nullable(),
  title: z.string().max(200).optional().nullable(),
  qualification: z.string().optional().nullable(),
  professional_qualification: z.string().optional().nullable(),
  experience_years: z.number().int().min(0).max(60).optional().nullable(),
  location: z.string().optional().nullable(),
  preferred_locations: z.array(z.string()).optional(),
  availability: z.string().optional().nullable(),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  boards: z.array(z.string()).optional(),
  expected_salary_min: z.number().min(0).optional().nullable(),
  expected_salary_max: z.number().min(0).optional().nullable(),
  work_preferences: z.array(z.string()).optional(),
})

export const updateManagementProfileSchema = z.object({
  contact_name: nameSchema.optional(),
  institution_name: z.string().max(200).optional().nullable(),
  designation: z.string().max(200).optional().nullable(),
  phone: phoneSchema,
})

export const updateAgencyProfileSchema = z.object({
  agency_name: z.string().max(200).optional(),
  contact_name: nameSchema.optional(),
  phone: phoneSchema,
  email: emailSchema.optional(),
  website: z.string().url().optional().or(z.literal('')).nullable(),
  location: z.string().max(200).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
})

// ─── Job Posting ────────────────────────────────────────────────────────────────

export const createJobSchema = z.object({
  title: z.string().min(3, 'Job title is required').max(200),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().max(5000).optional().nullable(),
  requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  qualification: z.string().optional().nullable(),
  professional_qualification: z.string().optional().nullable(),
  experience_min: z.number().int().min(0).optional().nullable(),
  experience_max: z.number().int().min(0).optional().nullable(),
  employment_type: z.string().optional().nullable(),
  board: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  salary_min: z.number().min(0).optional().nullable(),
  salary_max: z.number().min(0).optional().nullable(),
  application_deadline: z.string().optional().nullable(),
  institution_id: z.string().uuid().optional().nullable(),
  school_name: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']).optional(),
})

export type CreateJobInput = z.infer<typeof createJobSchema>

// ─── Application ────────────────────────────────────────────────────────────────

export const createApplicationSchema = z.object({
  job_id: z.string().uuid('Invalid job ID'),
  cover_letter: z.string().max(3000).optional().nullable(),
})

// ─── File Upload ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export function validateFileUpload(file: File, type: 'image' | 'document'): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
  }

  const allowed = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES
  if (!allowed.includes(file.type)) {
    return `Invalid file type. Allowed: ${allowed.join(', ')}`
  }

  return null
}
