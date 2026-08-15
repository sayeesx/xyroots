'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import {
  teacherSignupSchema,
  managementSignupSchema,
  agencySignupSchema,
  signInSchema,
  forgotPasswordSchema,
} from '@/lib/validations'
import type { ServiceResponse, UserRole, Profile } from '@/lib/types'

// ─── Helper: Create profile after auth signup ───────────────────────────────────

// Helper to bypass RLS during signup initialization
function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

async function createProfileForUser(
  authUserId: string,
  role: UserRole,
  data: {
    fullName: string
    email: string
    phone?: string | null
  }
): Promise<ServiceResponse<Profile>> {
  const supabase = getAdminClient()

  // Check for existing profile (idempotent)
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single()

  if (existing) {
    return { success: true, data: existing as unknown as Profile }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      auth_user_id: authUserId,
      role,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone || null,
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    console.error('Profile creation error:', error)
    return { success: false, error: 'Failed to create profile. Please try again.' }
  }

  return { success: true, data: profile as unknown as Profile }
}

// ─── Teacher Signup ─────────────────────────────────────────────────────────────

export async function signUpTeacher(formData: {
  fullName: string
  phone: string
  email: string
  subject?: string | null
  password: string
  confirmPassword: string
}): Promise<ServiceResponse> {
  const validation = teacherSignupSchema.safeParse(formData)
  if (!validation.success) {
    return {
      success: false,
      error: 'Please fix the form errors.',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { email, password, fullName, phone, subject } = validation.data
  const supabase = await createClient()

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'teacher',
      },
    },
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' }
    }
    return { success: false, error: authError.message }
  }

  if (!authData.user) {
    return { success: false, error: 'Failed to create account. Please try again.' }
  }

  // Sign out immediately — browser must sign in manually via modal
  await supabase.auth.signOut()

  // Create profile
  const profileResult = await createProfileForUser(authData.user.id, 'teacher', {
    fullName,
    email,
    phone,
  })

  if (!profileResult.success || !profileResult.data) {
    return { success: false, error: profileResult.error || 'Profile creation failed.' }
  }

  // Create teacher-specific profile
  const adminClient = getAdminClient()
  const { error: teacherError } = await adminClient
    .from('teacher_profiles')
    .insert({
      profile_id: profileResult.data.id,
      subject: subject || null,
      specializations: [],
      skills: [],
      languages: [],
      boards: [],
      preferred_locations: [],
      work_preferences: [],
      experience_details: [],
      education: [],
      has_demo_video: false,
      profile_completion: 20,
    } as any)

  if (teacherError) {
    console.error('Teacher profile creation error:', teacherError)
  }

  // Log audit
  await adminClient.from('audit_logs').insert({
    profile_id: profileResult.data.id,
    action: 'signup',
    entity_type: 'profile',
    entity_id: profileResult.data.id,
    details: { role: 'teacher', subject: subject || null },
  } as any)

  return { success: true }
}

// ─── Management Signup ──────────────────────────────────────────────────────────

export async function signUpManagement(formData: {
  contactName: string
  phone: string
  institutionName: string
  email: string
  password: string
}): Promise<ServiceResponse> {
  const validation = managementSignupSchema.safeParse(formData)
  if (!validation.success) {
    return {
      success: false,
      error: 'Please fix the form errors.',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { email, password, contactName, phone, institutionName } = validation.data
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: contactName,
        role: 'management',
      },
    },
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' }
    }
    return { success: false, error: authError.message }
  }

  if (!authData.user) {
    return { success: false, error: 'Failed to create account. Please try again.' }
  }

  // Sign out immediately — browser must sign in manually via modal
  await supabase.auth.signOut()

  const profileResult = await createProfileForUser(authData.user.id, 'management', {
    fullName: contactName,
    email,
    phone,
  })

  if (!profileResult.success || !profileResult.data) {
    return { success: false, error: profileResult.error || 'Profile creation failed.' }
  }

  // Create management-specific profile
  const adminClient = getAdminClient()
  const { error: mgmtError } = await adminClient
    .from('management_profiles')
    .insert({
      profile_id: profileResult.data.id,
      contact_name: contactName,
      institution_name: institutionName,
      phone,
    } as any)

  if (mgmtError) {
    console.error('Management profile creation error:', mgmtError)
  }

  // Create institution record
  const { error: instError } = await adminClient
    .from('institutions')
    .insert({
      name: institutionName,
      country: 'India',
      created_by_profile_id: profileResult.data.id,
    } as any)

  if (instError) {
    console.error('Institution creation error:', instError)
  }

  await adminClient.from('audit_logs').insert({
    profile_id: profileResult.data.id,
    action: 'signup',
    entity_type: 'profile',
    entity_id: profileResult.data.id,
    details: { role: 'management', institution: institutionName },
  } as any)

  return { success: true }
}

// ─── Agency Signup ──────────────────────────────────────────────────────────────

export async function signUpAgency(formData: {
  contactName: string
  phone: string
  agencyName: string
  email: string
  password: string
  website?: string
  location?: string
}): Promise<ServiceResponse> {
  const validation = agencySignupSchema.safeParse(formData)
  if (!validation.success) {
    return {
      success: false,
      error: 'Please fix the form errors.',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { email, password, contactName, phone, agencyName, website, location } = validation.data
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: contactName,
        role: 'agency',
      },
    },
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' }
    }
    return { success: false, error: authError.message }
  }

  if (!authData.user) {
    return { success: false, error: 'Failed to create account. Please try again.' }
  }

  // Sign out immediately — browser must sign in manually via modal
  await supabase.auth.signOut()

  const profileResult = await createProfileForUser(authData.user.id, 'agency', {
    fullName: contactName,
    email,
    phone,
  })

  if (!profileResult.success || !profileResult.data) {
    return { success: false, error: profileResult.error || 'Profile creation failed.' }
  }

  const adminClient = getAdminClient()
  const { error: agencyError } = await adminClient
    .from('agency_profiles')
    .insert({
      profile_id: profileResult.data.id,
      contact_name: contactName,
      agency_name: agencyName,
      phone,
    } as any)

  if (agencyError) {
    console.error('Agency profile creation error:', agencyError)
  }

  await adminClient.from('audit_logs').insert({
    profile_id: profileResult.data.id,
    action: 'signup',
    entity_type: 'profile',
    entity_id: profileResult.data.id,
    details: { role: 'agency', agency: agencyName },
  } as any)

  return { success: true }
}

// ─── Sign In ────────────────────────────────────────────────────────────────────

export async function signIn(formData: {
  email: string
  password: string
}): Promise<ServiceResponse<{ role: UserRole }>> {
  const validation = signInSchema.safeParse(formData)
  if (!validation.success) {
    return {
      success: false,
      error: 'Please enter valid credentials.',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { email, password } = validation.data
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: 'Invalid email or password. Please try again.' }
  }

  if (!data.user) {
    return { success: false, error: 'Authentication failed. Please try again.' }
  }

  // Fetch profile to get role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, last_login_at')
    .eq('auth_user_id', data.user.id)
    .single()

  // Update last_login_at
  if (profile) {
    await supabase
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() } as any)
      .eq('auth_user_id', data.user.id)
  }

  const role = (profile?.role as UserRole) || 'teacher'

  return { success: true, data: { role } }
}

// ─── Sign Out ───────────────────────────────────────────────────────────────────

export async function signOut(): Promise<ServiceResponse> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error: 'Failed to sign out. Please try again.' }
  }

  return { success: true }
}

// ─── Google OAuth (initiate) ────────────────────────────────────────────────────

export async function signInWithGoogle(): Promise<ServiceResponse<{ url: string }>> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? '' : ''}${typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: 'Failed to initiate Google login. Please try again.' }
  }

  if (!data.url) {
    return { success: false, error: 'Failed to generate login URL.' }
  }

  return { success: true, data: { url: data.url } }
}

// ─── Forgot Password ───────────────────────────────────────────────────────────

export async function forgotPassword(formData: {
  email: string
}): Promise<ServiceResponse> {
  const validation = forgotPasswordSchema.safeParse(formData)
  if (!validation.success) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(validation.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
  })

  if (error) {
    // Don't reveal if email exists or not for security
    console.error('Password reset error:', error)
  }

  // Always return success to prevent email enumeration
  return { success: true }
}

// ─── Reset Password ─────────────────────────────────────────────────────────────

export async function resetPassword(formData: {
  password: string
}): Promise<ServiceResponse> {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: formData.password,
  })

  if (error) {
    return { success: false, error: 'Failed to reset password. Please try again.' }
  }

  return { success: true }
}

// ─── Get Current User & Profile ─────────────────────────────────────────────────

export async function getCurrentProfile(): Promise<ServiceResponse<Profile>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  if (error || !profile) {
    return { success: false, error: 'Profile not found' }
  }

  return { success: true, data: profile as unknown as Profile }
}

// ─── Ensure Profile Exists (for OAuth) ──────────────────────────────────────────

export async function ensureProfileExists(role?: UserRole): Promise<ServiceResponse<Profile>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Check if profile already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  if (existing) {
    return { success: true, data: existing as unknown as Profile }
  }

  // Need to create profile for OAuth user
  const effectiveRole = role || 'teacher'
  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  const profileResult = await createProfileForUser(user.id, effectiveRole, {
    fullName,
    email: user.email || '',
    phone: user.user_metadata?.phone || null,
  })

  if (!profileResult.success || !profileResult.data) {
    return profileResult
  }

  // Create role-specific profile
  if (effectiveRole === 'teacher') {
    await supabase.from('teacher_profiles').insert({
      profile_id: profileResult.data.id,
      specializations: [],
      skills: [],
      languages: [],
      boards: [],
      preferred_locations: [],
      work_preferences: [],
      experience_details: [],
      education: [],
      has_demo_video: false,
      profile_completion: 10,
    })
  } else if (effectiveRole === 'management') {
    await supabase.from('management_profiles').insert({
      profile_id: profileResult.data.id,
      contact_name: fullName,
    })
  } else if (effectiveRole === 'agency') {
    await supabase.from('agency_profiles').insert({
      profile_id: profileResult.data.id,
      agency_name: '',
      contact_name: fullName,
    })
  }

  return profileResult
}
