'use server'

import { createClient } from '@/lib/supabase/server'
import type { ServiceResponse } from '@/lib/types'

export async function scheduleInterview(data: {
  teacherProfileId: string
  interviewDate: string
  timeSlot: string
  interviewType: string
  institutionName?: string
  message?: string
}): Promise<ServiceResponse<{ id: string }>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, full_name, email')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return { success: false, error: 'Profile not found.' }
  if (profile.role !== 'management' && profile.role !== 'agency') {
    return { success: false, error: 'Only management and agency accounts can schedule interviews.' }
  }

  if (!data.interviewDate || !data.timeSlot) {
    return { success: false, error: 'Interview date and time slot are required.' }
  }

  const { data: interview, error } = await supabase
    .from('interviews')
    .insert({
      teacher_profile_id: data.teacherProfileId,
      recruiter_profile_id: profile.id,
      recruiter_name: profile.full_name,
      recruiter_email: profile.email,
      institution_name: data.institutionName || null,
      interview_date: data.interviewDate,
      time_slot: data.timeSlot,
      interview_type: data.interviewType,
      message: data.message || null,
      status: 'scheduled',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Interview scheduling error:', error)
    return { success: false, error: 'Failed to schedule interview. Please try again.' }
  }

  return { success: true, data: { id: (interview as any).id } }
}

export async function getMyInterviews(): Promise<ServiceResponse<any[]>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!profile) return { success: false, error: 'Profile not found.' }

  if (profile.role === 'teacher') {
    // Teacher: get interviews for their teacher_profile
    const { data: tp } = await supabase
      .from('teacher_profiles')
      .select('id')
      .eq('profile_id', profile.id)
      .single()

    if (!tp) return { success: false, error: 'Teacher profile not found.' }

    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('teacher_profile_id', (tp as any).id)
      .order('interview_date', { ascending: true })

    if (error) return { success: false, error: 'Failed to load interviews.' }
    return { success: true, data: data || [] }
  }

  // Recruiter: get interviews they scheduled
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('recruiter_profile_id', profile.id)
    .order('interview_date', { ascending: true })

  if (error) return { success: false, error: 'Failed to load interviews.' }
  return { success: true, data: data || [] }
}
