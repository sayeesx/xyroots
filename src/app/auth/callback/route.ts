import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('auth_user_id', data.user.id)
        .single()

      if (!existingProfile) {
        // First-time Google user — redirect to role selection
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        const baseUrl = isLocalEnv ? origin : `https://${forwardedHost || new URL(request.url).host}`
        return NextResponse.redirect(`${baseUrl}/auth/select-role`)
      }

      // Existing user — redirect to dashboard based on role
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      const baseUrl = isLocalEnv ? origin : `https://${forwardedHost || new URL(request.url).host}`

      const role = (existingProfile as any)?.role as string | null
      let dashboardPath = '/'
      if (role === 'teacher') dashboardPath = '/dashboard/teacher'
      else if (role === 'management') dashboardPath = '/dashboard/employer'
      else if (role === 'agency') dashboardPath = '/dashboard/agency'

      return NextResponse.redirect(`${baseUrl}${dashboardPath}`)
    }
  }

  // Auth flow failed — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
