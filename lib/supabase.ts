import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      landing_pages: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          elements_data: Record<string, any>
          is_published: boolean
          created_at: string
          updated_at: string
          template_id: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          slug: string
          elements_data: Record<string, any>
          is_published?: boolean
          created_at?: string
          updated_at?: string
          template_id: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          slug?: string
          elements_data?: Record<string, any>
          is_published?: boolean
          created_at?: string
          updated_at?: string
          template_id?: string
        }
      }
      collected_emails: {
        Row: {
          id: string
          landing_page_id: string
          email: string
          collected_at: string
          user_agent: string | null
          ip_address: string | null
        }
        Insert: {
          id?: string
          landing_page_id: string
          email: string
          collected_at?: string
          user_agent?: string | null
          ip_address?: string | null
        }
        Update: {
          id?: string
          landing_page_id?: string
          email?: string
          collected_at?: string
          user_agent?: string | null
          ip_address?: string | null
        }
      }
    }
  }
}

export type LandingPage = Database['public']['Tables']['landing_pages']['Row']
export type CollectedEmail = Database['public']['Tables']['collected_emails']['Row']
