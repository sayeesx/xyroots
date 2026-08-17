'use server'

import { createClient } from '@/lib/supabase/server'
import type { ServiceResponse } from '@/lib/types'

export interface Notification {
  id: string
  recipient_profile_id: string
  type: 'profile_incomplete' | 'hiring_alert' | 'interview_scheduled' | 'application_update' | 'profile_view' | 'general'
  title: string
  body: string
  link: string | null
  is_read: boolean
  metadata: Record<string, unknown>
  created_at: string
}

/** Helper: get the current user's profile id */
async function getProfileId(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()
  return (data as { id: string } | null)?.id ?? null
}

/**
 * Get all notifications for the current user, newest first.
 */
export async function getMyNotifications(): Promise<ServiceResponse<Notification[]>> {
  const supabase = await createClient()
  const profileId = await getProfileId(supabase)
  if (!profileId) return { success: false, error: 'Not authenticated' }

  // Cast to any — notifications table uses a custom type not in the lightweight stub
  const { data, error } = await (supabase as any)
    .from('notifications')
    .select('*')
    .eq('recipient_profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return { success: false, error: 'Failed to load notifications' }
  return { success: true, data: (data || []) as Notification[] }
}

/**
 * Mark one notification as read.
 */
export async function markNotificationRead(notificationId: string): Promise<ServiceResponse> {
  const supabase = await createClient()
  const profileId = await getProfileId(supabase)
  if (!profileId) return { success: false, error: 'Not authenticated' }

  const { error } = await (supabase as any)
    .from('notifications')
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq('id', notificationId)

  if (error) return { success: false, error: 'Failed to mark as read' }
  return { success: true }
}

/**
 * Mark all notifications as read for current user.
 */
export async function markAllNotificationsRead(): Promise<ServiceResponse> {
  const supabase = await createClient()
  const profileId = await getProfileId(supabase)
  if (!profileId) return { success: false, error: 'Not authenticated' }

  const { error } = await (supabase as any)
    .from('notifications')
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq('recipient_profile_id', profileId)
    .eq('is_read', false)

  if (error) return { success: false, error: 'Failed to mark all as read' }
  return { success: true }
}

/**
 * Create a profile-incomplete notification (called server-side after profile save).
 */
export async function createProfileIncompleteNotification(
  profileId: string,
  missingFields: string[]
): Promise<void> {
  const supabase = await createClient()
  await (supabase as any).from('notifications').insert({
    recipient_profile_id: profileId,
    type: 'profile_incomplete',
    title: 'Complete Your Profile',
    body: `Your profile is missing: ${missingFields.slice(0, 3).join(', ')}${missingFields.length > 3 ? ` and ${missingFields.length - 3} more` : ''}. A complete profile gets 5× more views.`,
    link: '/dashboard/teacher',
    metadata: { missing_fields: missingFields },
  })
}
