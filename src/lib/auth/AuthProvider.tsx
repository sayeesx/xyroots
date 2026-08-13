'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile, UserRole, AuthState } from '@/lib/types'
import {
  signIn as signInAction,
  signOut as signOutAction,
  signUpTeacher,
  signUpManagement,
  signUpAgency,
  forgotPassword,
  signInWithGoogle as signInWithGoogleAction,
} from '@/lib/actions/auth'
import type { ServiceResponse } from '@/lib/types'
import AuthModal from '@/components/AuthModal'
import { useRouter } from 'next/navigation'

type AuthMode = "signin" | "signup_select" | "signup_teacher" | "signup_employer" | "signup_agency";

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<ServiceResponse<{ role: UserRole }>>
  signOut: () => Promise<void>
  signUpTeacher: typeof signUpTeacher
  signUpManagement: typeof signUpManagement
  signUpAgency: typeof signUpAgency
  signInWithGoogle: () => Promise<void>
  forgotPassword: typeof forgotPassword
  refreshProfile: () => Promise<void>
  openSignIn: (onSuccess?: () => void) => void
  openTeacherRegistration: (onSuccess?: () => void) => void
  openInstitutionRegistration: (onSuccess?: () => void) => void
  closeAuthModal: () => void
  requireAuth: (callback: () => void) => void
  requireTeacher: (callback: () => void) => void
  requireInstitution: (callback: () => void) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Centralized Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<AuthMode>("signin")
  const [onAuthSuccess, setOnAuthSuccess] = useState<(() => void) | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const handleAuthCallback = useCallback((currentUser: User | null, currentProfile: Profile | null) => {
    if (currentUser && currentProfile && onAuthSuccess) {
      const callback = onAuthSuccess
      setOnAuthSuccess(null)
      // Close modal just in case it wasn't closed by AuthModal itself yet
      setModalOpen(false)
      // Execute the preserved intended action
      callback()
    }
  }, [onAuthSuccess])

  // Fetch profile from profiles table
  const fetchProfile = useCallback(async (authUser: User) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single()

      if (data) {
        setProfile(data as unknown as Profile)
        return data as unknown as Profile
      } else {
        setProfile(null)
        return null
      }
    } catch {
      setProfile(null)
      return null
    }
  }, [supabase])

  // Initialize: check current session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user)
        }
      } catch (err) {
        console.error('Auth init error:', err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          const currentProfile = await fetchProfile(session.user)
          setLoading(false)
          handleAuthCallback(session.user, currentProfile)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setLoading(false)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user)
        } else if (event === 'USER_UPDATED' && session?.user) {
          setUser(session.user)
          await fetchProfile(session.user)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile, handleAuthCallback])

  // Sign in handler
  const handleSignIn = useCallback(async (email: string, password: string) => {
    const result = await signInAction({ email, password })
    if (result.success) {
      // The onAuthStateChange listener will pick up the session, but we also manually handle here
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const prf = await fetchProfile(session.user)
        handleAuthCallback(session.user, prf)
      }
    }
    return result
  }, [supabase, fetchProfile, handleAuthCallback])

  // Sign out handler
  const handleSignOut = useCallback(async () => {
    await signOutAction()
    setUser(null)
    setProfile(null)
    await supabase.auth.signOut()
    router.refresh()
  }, [supabase, router])

  // Google OAuth
  const handleGoogleSignIn = useCallback(async () => {
    const result = await signInWithGoogleAction()
    if (result.success && result.data?.url) {
      window.location.href = result.data.url
    }
  }, [])

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user)
    }
  }, [user, fetchProfile])

  // Modal Handlers
  const openSignIn = useCallback((cb?: () => void) => {
    if (cb) setOnAuthSuccess(() => cb)
    setModalMode('signin')
    setModalOpen(true)
  }, [])

  const openTeacherRegistration = useCallback((cb?: () => void) => {
    if (cb) setOnAuthSuccess(() => cb)
    setModalMode('signup_teacher')
    setModalOpen(true)
  }, [])

  const openInstitutionRegistration = useCallback((cb?: () => void) => {
    if (cb) setOnAuthSuccess(() => cb)
    setModalMode('signup_employer')
    setModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setModalOpen(false)
    setOnAuthSuccess(null)
  }, [])

  // Protections
  const requireAuth = useCallback((callback: () => void) => {
    if (user && profile) callback()
    else openSignIn(callback)
  }, [user, profile, openSignIn])

  const requireTeacher = useCallback((callback: () => void) => {
    if (user && profile?.role === 'teacher') callback()
    else if (user && profile?.role !== 'teacher') {
      alert("This action requires a teacher account.")
    } else {
      openTeacherRegistration(callback)
    }
  }, [user, profile, openTeacherRegistration])

  const requireInstitution = useCallback((callback: () => void) => {
    if (user && (profile?.role === 'management' || profile?.role === 'agency')) callback()
    else if (user && profile?.role === 'teacher') {
      alert("This action requires an institution account.")
    } else {
      openInstitutionRegistration(callback)
    }
  }, [user, profile, openInstitutionRegistration])

  const value: AuthContextType = {
    user,
    profile,
    role: profile?.role as UserRole | null ?? null,
    isAuthenticated: !!user && !!profile,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    signUpTeacher,
    signUpManagement,
    signUpAgency,
    signInWithGoogle: handleGoogleSignIn,
    forgotPassword,
    refreshProfile,
    openSignIn,
    openTeacherRegistration,
    openInstitutionRegistration,
    closeAuthModal,
    requireAuth,
    requireTeacher,
    requireInstitution,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} // We don't nullify onAuthSuccess on manual close, just close modal
        initialMode={modalMode} 
      />
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
