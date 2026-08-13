import type { UserRole } from '@/lib/types'

// ─── Role Access Matrix ─────────────────────────────────────────────────────────
// Central definition of which roles can access which features.
// Used by both frontend (hide/show UI) and backend (enforce in middleware/actions).

type Feature =
  | 'find_jobs'
  | 'find_institution'
  | 'find_teacher'
  | 'create_teacher_profile'
  | 'manage_own_teacher_profile'
  | 'post_job'
  | 'manage_own_jobs'
  | 'manage_institution'
  | 'apply_to_jobs'
  | 'view_teacher_profiles'
  | 'manage_own_account'

const accessMatrix: Record<Feature, Record<UserRole | 'guest', boolean>> = {
  find_jobs:                { guest: true,  teacher: true,  management: false, agency: true  },
  find_institution:         { guest: true,  teacher: true,  management: false, agency: true  },
  find_teacher:             { guest: true,  teacher: false, management: true,  agency: true  },
  create_teacher_profile:   { guest: false, teacher: true,  management: false, agency: false },
  manage_own_teacher_profile: { guest: false, teacher: true, management: false, agency: false },
  post_job:                 { guest: false, teacher: false, management: true,  agency: true  },
  manage_own_jobs:          { guest: false, teacher: false, management: true,  agency: true  },
  manage_institution:       { guest: false, teacher: false, management: true,  agency: false },
  apply_to_jobs:            { guest: false, teacher: true,  management: false, agency: false },
  view_teacher_profiles:    { guest: false, teacher: false, management: true,  agency: true  },
  manage_own_account:       { guest: false, teacher: true,  management: true,  agency: true  },
}

export function canAccess(feature: Feature, role: UserRole | 'guest' | null): boolean {
  const effectiveRole = role ?? 'guest'
  return accessMatrix[feature]?.[effectiveRole] ?? false
}

// ─── Route → Feature Mapping ────────────────────────────────────────────────────
// Maps URL paths to the feature they represent for authorization checks.

const routeFeatureMap: { pattern: RegExp; feature: Feature }[] = [
  { pattern: /^\/jobs(\/|$)/, feature: 'find_jobs' },
  { pattern: /^\/schools(\/|$)/, feature: 'find_institution' },
  { pattern: /^\/teachers(\/|$)/, feature: 'find_teacher' },
  { pattern: /^\/dashboard\/teacher(\/|$)/, feature: 'manage_own_teacher_profile' },
  { pattern: /^\/dashboard\/employer(\/|$)/, feature: 'manage_own_jobs' },
  { pattern: /^\/dashboard\/agency(\/|$)/, feature: 'manage_own_jobs' },
  { pattern: /^\/profile(\/|$)/, feature: 'manage_own_account' },
]

export function getRouteFeature(pathname: string): Feature | null {
  for (const { pattern, feature } of routeFeatureMap) {
    if (pattern.test(pathname)) {
      return feature
    }
  }
  return null
}

// ─── Navbar Visibility ──────────────────────────────────────────────────────────

export interface NavItems {
  findJobs: boolean
  findInstitution: boolean
  findTeacher: boolean
  signIn: boolean
  registerTeacher: boolean
  postJob: boolean
  profileDropdown: boolean
}

export function getNavVisibility(role: UserRole | null): NavItems {
  if (!role) {
    return {
      findJobs: true,
      findInstitution: true,
      findTeacher: true,
      signIn: true,
      registerTeacher: true,
      postJob: true,
      profileDropdown: false,
    }
  }

  return {
    findJobs: canAccess('find_jobs', role),
    findInstitution: canAccess('find_institution', role),
    findTeacher: canAccess('find_teacher', role),
    signIn: false,
    registerTeacher: false,
    postJob: canAccess('post_job', role),
    profileDropdown: true,
  }
}
