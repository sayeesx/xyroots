'use server'

import { createClient } from '@/lib/supabase/server'
import type { ServiceResponse } from '@/lib/types'

async function getProfileId(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('id').eq('auth_user_id', user.id).single()
  return (data as { id: string } | null)?.id ?? null
}

export async function getWatchlist(): Promise<ServiceResponse<{ teachers: string[]; jobs: string[] }>> {
  const supabase = await createClient()
  const profileId = await getProfileId(supabase)
  if (!profileId) return { success: true, data: { teachers: [], jobs: [] } }

  const { data, error } = await (supabase as any)
    .from('watchlist')
    .select('item_type, item_id')
    .eq('profile_id', profileId)

  if (error) return { success: false, error: 'Failed to load watchlist' }

  const teachers = (data || []).filter((r: any) => r.item_type === 'teacher').map((r: any) => r.item_id as string)
  const jobs = (data || []).filter((r: any) => r.item_type === 'job').map((r: any) => r.item_id as string)
  return { success: true, data: { teachers, jobs } }
}

export async function addToWatchlist(itemType: 'teacher' | 'job', itemId: string): Promise<ServiceResponse> {
  const supabase = await createClient()
  const profileId = await getProfileId(supabase)
  if (!profileId) return { success: false, error: 'Not authenticated' }

  const { error } = await (supabase as any)
    .from('watchlist')
    .upsert({ profile_id: profileId, item_type: itemType, item_id: itemId }, { onConflict: 'profile_id,item_type,item_id' })

  if (error) return { success: false, error: 'Failed to save' }
  return { success: true }
}

export async function removeFromWatchlist(itemType: 'teacher' | 'job', itemId: string): Promise<ServiceResponse> {
  const supabase = await createClient()
  const profileId = await getProfileId(supabase)
  if (!profileId) return { success: false, error: 'Not authenticated' }

  const { error } = await (supabase as any)
    .from('watchlist')
    .delete()
    .eq('profile_id', profileId)
    .eq('item_type', itemType)
    .eq('item_id', itemId)

  if (error) return { success: false, error: 'Failed to remove' }
  return { success: true }
}

export async function isInWatchlist(itemType: 'teacher' | 'job', itemId: string): Promise<boolean> {
  const supabase = await createClient()
  const profileId = await getProfileId(supabase)
  if (!profileId) return false

  const { data } = await (supabase as any)
    .from('watchlist')
    .select('id')
    .eq('profile_id', profileId)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .single()

  return !!data
}
