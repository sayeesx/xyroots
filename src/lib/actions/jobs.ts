'use server'

import { createClient } from '@/lib/supabase/server'
import { createJobSchema, type CreateJobInput } from '@/lib/validations'
import type { ServiceResponse, Job, UserRole } from '@/lib/types'

// ─── Create Job ─────────────────────────────────────────────────────────────────

export async function createJob(input: CreateJobInput): Promise<ServiceResponse<Job>> {
  const supabase = await createClient()

  // 1. Verify authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be signed in to post a job.' }
  }

  // 2. Get profile and verify role
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) {
    return { success: false, error: 'Profile not found.' }
  }

  const role = profile.role as UserRole
  if (role !== 'management' && role !== 'agency') {
    return { success: false, error: 'Only management and agency accounts can post jobs.' }
  }

  // 3. Validate input
  const validation = createJobSchema.safeParse(input)
  if (!validation.success) {
    return {
      success: false,
      error: 'Please fix the form errors.',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const jobData = validation.data

  // 4. Insert job
  const { data: job, error } = await supabase
    .from('jobs')
    .insert({
      posted_by_profile_id: profile.id,
      posted_by_role: role,
      title: jobData.title,
      subject: jobData.subject,
      description: jobData.description || null,
      requirements: jobData.requirements || [],
      responsibilities: jobData.responsibilities || [],
      benefits: jobData.benefits || [],
      qualification: jobData.qualification || null,
      professional_qualification: jobData.professional_qualification || null,
      experience_min: jobData.experience_min || null,
      experience_max: jobData.experience_max || null,
      employment_type: jobData.employment_type || 'Full-time',
      board: jobData.board || null,
      level: jobData.level || null,
      location: jobData.location || null,
      salary_min: jobData.salary_min || null,
      salary_max: jobData.salary_max || null,
      application_deadline: jobData.application_deadline || null,
      institution_id: jobData.institution_id || null,
      school_name: jobData.school_name || null,
      status: jobData.status || 'draft',
    })
    .select()
    .single()

  if (error) {
    console.error('Job creation error:', error)
    return { success: false, error: 'Failed to create job. Please try again.' }
  }

  // 5. Audit log
  await supabase.from('audit_logs').insert({
    profile_id: profile.id,
    action: 'create_job',
    entity_type: 'job',
    entity_id: job.id as string,
    details: { title: jobData.title, status: jobData.status || 'draft' },
  })

  // 5b. Auto-create/update institution record so it appears in the directory
  if (role === 'management' && jobData.school_name) {
    try {
      // Check if an institution already exists for this profile
      const { data: existingInst } = await supabase
        .from('institutions')
        .select('id')
        .eq('created_by_profile_id', profile.id)
        .single()

      if (!existingInst) {
        // Create a new institution entry visible in the directory
        await supabase.from('institutions').insert({
          name: jobData.school_name,
          location: jobData.location || null,
          type: null,
          board: jobData.board ? [jobData.board] : [],
          verified: false,
          is_visible: true,
          created_by_profile_id: profile.id,
          description: null,
        } as any)
      } else {
        // Update location/board if missing
        await supabase.from('institutions').update({
          is_visible: true,
          ...(jobData.location ? { location: jobData.location } : {}),
        } as any).eq('id', existingInst.id)
      }
    } catch {
      // Non-blocking — don't fail job creation
    }
  }

  // 6. Send hiring-alert notifications to matching teachers (only for published jobs)
  if ((jobData.status || 'draft') === 'published' && jobData.subject) {
    try {
      // Find teachers with matching subject who have notifications enabled
      const { data: matchingTeachers } = await supabase
        .from('teacher_profiles')
        .select('profile_id, subject')
        .eq('subject', jobData.subject)
        .eq('is_visible', true)
        .limit(50)

      if (matchingTeachers && matchingTeachers.length > 0) {
        const locationText = jobData.location ? ` in ${jobData.location}` : ''
        const schoolText = jobData.school_name ? ` at ${jobData.school_name}` : ''
        const notifications = matchingTeachers.map((t: any) => ({
          recipient_profile_id: t.profile_id,
          type: 'hiring_alert' as const,
          title: `New ${jobData.subject} Job Alert`,
          body: `A new ${jobData.subject} position "${jobData.title}"${schoolText}${locationText} matches your profile.`,
          link: `/jobs/${job.id as string}`,
          metadata: { job_id: job.id, subject: jobData.subject },
        }))
        await supabase.from('notifications').insert(notifications as any)
      }
    } catch (notifErr) {
      // Non-blocking — don't fail the job creation
      console.error('Hiring alert notification error:', notifErr)
    }
  }

  return { success: true, data: job as unknown as Job }
}

// ─── Update Job ─────────────────────────────────────────────────────────────────

export async function updateJob(jobId: string, input: Partial<CreateJobInput>): Promise<ServiceResponse> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile || (profile.role !== 'management' && profile.role !== 'agency')) {
    return { success: false, error: 'Unauthorized.' }
  }

  // Verify ownership
  const { data: existingJob } = await supabase
    .from('jobs')
    .select('posted_by_profile_id')
    .eq('id', jobId)
    .single()

  if (!existingJob || existingJob.posted_by_profile_id !== profile.id) {
    return { success: false, error: 'You can only modify your own job listings.' }
  }

  const { error } = await supabase
    .from('jobs')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId)

  if (error) {
    return { success: false, error: 'Failed to update job.' }
  }

  return { success: true }
}

// ─── Publish / Close / Archive Job ──────────────────────────────────────────────

export async function updateJobStatus(jobId: string, status: 'published' | 'closed' | 'archived'): Promise<ServiceResponse> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile || (profile.role !== 'management' && profile.role !== 'agency')) {
    return { success: false, error: 'Unauthorized.' }
  }

  const { data: existingJob } = await supabase
    .from('jobs')
    .select('posted_by_profile_id')
    .eq('id', jobId)
    .single()

  if (!existingJob || existingJob.posted_by_profile_id !== profile.id) {
    return { success: false, error: 'You can only modify your own job listings.' }
  }

  const { error } = await supabase
    .from('jobs')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', jobId)

  if (error) {
    return { success: false, error: 'Failed to update job status.' }
  }

  await supabase.from('audit_logs').insert({
    profile_id: profile.id,
    action: `job_${status}`,
    entity_type: 'job',
    entity_id: jobId,
  })

  return { success: true }
}

// ─── Delete Job (soft) ──────────────────────────────────────────────────────────

export async function deleteJob(jobId: string): Promise<ServiceResponse> {
  return updateJobStatus(jobId, 'archived')
}

// ─── Get Jobs (with filters, pagination) ────────────────────────────────────────

export async function getPublishedJobs(filters?: {
  subject?: string
  location?: string
  board?: string
  employmentType?: string
  search?: string
  page?: number
  limit?: number
}): Promise<ServiceResponse<{ jobs: Job[]; total: number }>> {
  const supabase = await createClient()
  const page = filters?.page || 1
  const limit = filters?.limit || 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (filters?.subject) {
    query = query.eq('subject', filters.subject)
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  if (filters?.board) {
    query = query.eq('board', filters.board)
  }
  if (filters?.employmentType) {
    query = query.eq('employment_type', filters.employmentType)
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,school_name.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`)
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return { success: false, error: 'Failed to fetch jobs.' }
  }

  return {
    success: true,
    data: {
      jobs: (data || []) as unknown as Job[],
      total: count || 0,
    },
  }
}

// ─── Get My Jobs (for management/agency dashboard) ──────────────────────────────

export async function getMyJobs(): Promise<ServiceResponse<Job[]>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) {
    return { success: false, error: 'Profile not found.' }
  }

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('posted_by_profile_id', profile.id)
    .neq('status', 'archived')
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, error: 'Failed to fetch your jobs.' }
  }

  return { success: true, data: (data || []) as unknown as Job[] }
}

// ─── Apply to Job ───────────────────────────────────────────────────────────────

export async function applyToJob(jobId: string, coverLetter?: string): Promise<ServiceResponse> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be signed in to apply.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile || profile.role !== 'teacher') {
    return { success: false, error: 'Only teacher accounts can apply to jobs.' }
  }

  // Get teacher_profile
  const { data: teacherProfile } = await supabase
    .from('teacher_profiles')
    .select('id')
    .eq('profile_id', profile.id)
    .single()

  if (!teacherProfile) {
    return { success: false, error: 'Please complete your teacher profile first.' }
  }

  // Check for duplicate application
  const { data: existingApp } = await supabase
    .from('applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('applicant_profile_id', profile.id)
    .single()

  if (existingApp) {
    return { success: false, error: 'You have already applied to this job.' }
  }

  // Verify job is published
  const { data: job } = await supabase
    .from('jobs')
    .select('status')
    .eq('id', jobId)
    .single()

  if (!job || job.status !== 'published') {
    return { success: false, error: 'This job is no longer accepting applications.' }
  }

  const { error } = await supabase
    .from('applications')
    .insert({
      job_id: jobId,
      teacher_profile_id: (teacherProfile as Record<string, unknown>).id as string,
      applicant_profile_id: profile.id,
      cover_letter: coverLetter || null,
      status: 'pending',
    })

  if (error) {
    console.error('Application error:', error)
    return { success: false, error: 'Failed to submit application.' }
  }

  return { success: true }
}

// ─── Get Applications for My Jobs ───────────────────────────────────────────────

export async function getApplicationsForJob(jobId: string): Promise<ServiceResponse<Application[]>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) {
    return { success: false, error: 'Profile not found.' }
  }

  // Verify job ownership
  const { data: job } = await supabase
    .from('jobs')
    .select('posted_by_profile_id')
    .eq('id', jobId)
    .single()

  if (!job || job.posted_by_profile_id !== profile.id) {
    return { success: false, error: 'You can only view applications for your own jobs.' }
  }

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, error: 'Failed to fetch applications.' }
  }

  return { success: true, data: (data || []) as unknown as Application[] }
}

// ─── Get My Applications (teacher) ──────────────────────────────────────────────

export async function getMyApplications(): Promise<ServiceResponse<Application[]>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) {
    return { success: false, error: 'Profile not found.' }
  }

  const { data, error } = await supabase
    .from('applications')
    .select('*, jobs(*)')
    .eq('applicant_profile_id', profile.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, error: 'Failed to fetch applications.' }
  }

  return { success: true, data: (data || []) as unknown as Application[] }
}

// Placeholder type for import — the full type is in types/index.ts
type Application = import('@/lib/types').Application
