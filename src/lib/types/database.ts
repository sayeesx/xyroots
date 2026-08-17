// Lightweight Database type for Supabase client generics.
// This keeps TS happy without requiring full codegen.
// If you later run `supabase gen types typescript`, replace this file.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          auth_user_id: string
          role: string
          full_name: string
          email: string
          phone: string | null
          avatar_url: string | null
          status: string
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          auth_user_id: string
          role: string
          full_name: string
          email: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      teacher_profiles: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      management_profiles: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      agency_profiles: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      institutions: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      jobs: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      applications: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      audit_logs: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      notifications: {
        Row: {
          id: string
          recipient_profile_id: string
          type: string
          title: string
          body: string
          link: string | null
          is_read: boolean
          metadata: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          recipient_profile_id: string
          type: string
          title: string
          body: string
          link?: string | null
          is_read?: boolean
          metadata?: Record<string, unknown>
        }
        Update: {
          is_read?: boolean
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: 'teacher' | 'management' | 'agency'
      account_status: 'active' | 'suspended' | 'deleted'
      job_status: 'draft' | 'published' | 'closed' | 'archived'
      application_status: 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'offered' | 'rejected' | 'withdrawn'
    }
  }
}
