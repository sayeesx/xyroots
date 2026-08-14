'use server'

import { createClient } from '@/lib/supabase/server'
import { updateTeacherProfileSchema } from '@/lib/validations'
import type { ServiceResponse } from '@/lib/types'

/**
 * Update teacher profile with comprehensive data
 * Can be called after registration to add resume-extracted data
 * or anytime to update profile information
 */
export async function updateTeacherProfile(
  profileId: string,
  formData: {
    subject?: string | null
    specializations?: string[]
    bio?: string | null
    title?: string | null
    qualification?: string | null
    professional_qualification?: string | null
    experience_years?: number | null
    experience_details?: any[]
    education?: any[]
    location?: string | null
    preferred_locations?: string[]
    availability?: string | null
    skills?: string[]
    languages?: string[]
    boards?: string[]
    expected_salary_min?: number | null
    expected_salary_max?: number | null
    work_preferences?: string[]
  }
): Promise<ServiceResponse> {
  const validation = updateTeacherProfileSchema.safeParse(formData)
  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid profile data.',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Verify the profile belongs to the current user
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, auth_user_id')
    .eq('id', profileId)
    .single()

  if (!profile || profile.auth_user_id !== user.id) {
    return { success: false, error: 'Unauthorized' }
  }

  // Update teacher profile
  const { error } = await supabase
    .from('teacher_profiles')
    .update({
      ...validation.data,
      updated_at: new Date().toISOString(),
    })
    .eq('profile_id', profileId)

  if (error) {
    console.error('Teacher profile update error:', error)
    return { success: false, error: 'Failed to update profile. Please try again.' }
  }

  return { success: true }
}

/**
 * Get teacher profile by auth user ID
 */
export async function getTeacherProfile(): Promise<ServiceResponse<any>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  if (profileError || !profile) {
    return { success: false, error: 'Profile not found' }
  }

  // Get teacher profile
  const { data: teacherProfile, error: teacherError } = await supabase
    .from('teacher_profiles')
    .select('*')
    .eq('profile_id', profile.id)
    .single()

  if (teacherError || !teacherProfile) {
    return { success: false, error: 'Teacher profile not found' }
  }

  return {
    success: true,
    data: {
      ...profile,
      teacher_profile: teacherProfile,
    },
  }
}
