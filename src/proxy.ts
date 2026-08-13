import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { canAccess, getRouteFeature } from '@/lib/auth/permissions'
import type { UserRole } from '@/lib/types'

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Skip auth routes, API routes, and static files
  if (
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico')
  ) {
    return supabaseResponse
  }

  // Protected routes that require authentication
  const protectedPrefixes = ['/dashboard', '/profile']
  const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix))

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Role-based route protection
  // We need the user's role from their profile — but we can't query the DB in middleware efficiently.
  // Instead, we store the role in the user's app_metadata during signup.
  // For now, we rely on the profile role stored in user_metadata.
  if (user) {
    const role = (user.user_metadata?.role as UserRole) || null
    const feature = getRouteFeature(pathname)

    if (feature && role && !canAccess(feature, role)) {
      // Redirect to access-denied page with info
      const url = request.nextUrl.clone()
      url.pathname = '/access-denied'
      url.searchParams.set('from', pathname)
      url.searchParams.set('role', role)
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
