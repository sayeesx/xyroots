'use server'

import { createClient } from '@/lib/supabase/server'
import { updateTeacherProfileSchema } from '@/lib/validations'
import { calculateTeacherProfileCompletion } from '@/lib/utils/profile-completion'
import type { ServiceResponse } from '@/lib/types'

/**
 * Update teacher profile with comprehensive data.
 * Also recalculates and persists profile_completion after update.
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // profiles table has proper types — cast result
  const { data: profileRow } = await supabase
    .from('profiles')
    .select('id, auth_user_id, full_name, email, phone')
    .eq('id', profileId)
    .single()

  const profile = profileRow as { id: string; auth_user_id: string; full_name: string; email: string; phone: string | null } | null

  if (!profile || profile.auth_user_id !== user.id) {
    return { success: false, error: 'Unauthorized' }
  }

  // Update teacher profile — cast to any because db stub uses Record<string,unknown>
  const { error: updateError } = await (supabase as any)
    .from('teacher_profiles')
    .update({
      ...validation.data,
      updated_at: new Date().toISOString(),
    })
    .eq('profile_id', profileId)

  if (updateError) {
    console.error('Teacher profile update error:', updateError)
    return { success: false, error: 'Failed to update profile. Please try again.' }
  }

  // Recalculate and persist profile_completion
  const { data: teacherProfileRow } = await (supabase as any)
    .from('teacher_profiles')
    .select('*')
    .eq('profile_id', profileId)
    .single()

  const teacherProfile = teacherProfileRow as Record<string, unknown> | null

  if (teacherProfile) {
    const completion = calculateTeacherProfileCompletion(profile, teacherProfile)
    await (supabase as any)
      .from('teacher_profiles')
      .update({
        profile_completion: completion.percentage,
        updated_at: new Date().toISOString(),
      })
      .eq('profile_id', profileId)
  }

  return { success: true }
}

/**
 * Get teacher profile by auth user ID
 */
export async function getTeacherProfile(): Promise<ServiceResponse<any>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: profileRow, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  const profile = profileRow as { id: string; [key: string]: unknown } | null

  if (profileError || !profile) {
    return { success: false, error: 'Profile not found' }
  }

  const { data: teacherProfileRow, error: teacherError } = await (supabase as any)
    .from('teacher_profiles')
    .select('*')
    .eq('profile_id', profile.id)
    .single()

  const teacherProfile = teacherProfileRow as Record<string, unknown> | null

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
