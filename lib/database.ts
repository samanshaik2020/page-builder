import { supabase } from './supabase'
import type { LandingPage, CollectedEmail } from './supabase'
import type { ElementData } from './store'

export const databaseService = {
  // Landing Pages
  async createLandingPage(data: {
    title: string
    slug: string
    elements_data: Record<string, ElementData>
    template_id: string
    user_id: string
  }) {
    const { data: landingPage, error } = await supabase
      .from('landing_pages')
      .insert([data])
      .select()
      .single()
    
    return { landingPage, error }
  },

  async updateLandingPage(id: string, data: Partial<{
    title: string
    slug: string
    elements_data: Record<string, ElementData>
    is_published: boolean
  }>) {
    const { data: landingPage, error } = await supabase
      .from('landing_pages')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    return { landingPage, error }
  },

  async getLandingPage(id: string) {
    const { data: landingPage, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('id', id)
      .single()
    
    return { landingPage, error }
  },

  async getLandingPageBySlug(slug: string) {
    try {
      console.log('Fetching landing page by slug:', slug)
      
      const { data: landingPage, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle() // Use maybeSingle instead of single to avoid errors when no data found
      
      if (error) {
        console.error('Database error in getLandingPageBySlug:', error)
      } else if (!landingPage) {
        console.log('No published landing page found with slug:', slug)
      } else {
        console.log('Successfully fetched landing page:', landingPage.title)
      }
      
      return { landingPage, error }
    } catch (err) {
      console.error('Unexpected error in getLandingPageBySlug:', err)
      return { landingPage: null, error: { message: 'Unexpected error occurred' } }
    }
  },

  async getUserLandingPages(userId: string) {
    try {
      console.log('Fetching landing pages for user:', userId)
      
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.error('Authentication error:', authError)
        return { landingPages: null, error: { message: 'User not authenticated' } }
      }
      
      const { data: landingPages, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Database error:', error)
      } else {
        console.log('Successfully fetched landing pages:', landingPages?.length || 0)
      }
      
      return { landingPages, error }
    } catch (err) {
      console.error('Unexpected error in getUserLandingPages:', err)
      return { landingPages: null, error: { message: 'Unexpected error occurred' } }
    }
  },

  async deleteLandingPage(id: string) {
    const { error } = await supabase
      .from('landing_pages')
      .delete()
      .eq('id', id)
    
    return { error }
  },

  async publishLandingPage(id: string) {
    const { data: landingPage, error } = await supabase
      .from('landing_pages')
      .update({ is_published: true })
      .eq('id', id)
      .select()
      .single()
    
    return { landingPage, error }
  },

  async unpublishLandingPage(id: string) {
    const { data: landingPage, error } = await supabase
      .from('landing_pages')
      .update({ is_published: false })
      .eq('id', id)
      .select()
      .single()
    
    return { landingPage, error }
  },

  // Collected Emails
  async collectEmail(data: {
    landing_page_id: string
    email: string
    user_agent?: string
    ip_address?: string
  }) {
    const { data: collectedEmail, error } = await supabase
      .from('collected_emails')
      .insert([data])
      .select()
      .single()
    
    return { collectedEmail, error }
  },

  async getCollectedEmails(landingPageId: string) {
    const { data: emails, error } = await supabase
      .from('collected_emails')
      .select('*')
      .eq('landing_page_id', landingPageId)
      .order('collected_at', { ascending: false })
    
    return { emails, error }
  },

  async getUserCollectedEmails(userId: string) {
    const { data: emails, error } = await supabase
      .from('collected_emails')
      .select(`
        *,
        landing_pages!inner(
          id,
          title,
          slug,
          user_id
        )
      `)
      .eq('landing_pages.user_id', userId)
      .order('collected_at', { ascending: false })
    
    return { emails, error }
  },

  // Utility functions
  async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
    let counter = 0
    let finalSlug = slug

    while (true) {
      const { data } = await supabase
        .from('landing_pages')
        .select('id')
        .eq('slug', finalSlug)
        .single()

      if (!data) {
        return finalSlug
      }

      counter++
      finalSlug = `${slug}-${counter}`
    }
  },

  async checkSlugAvailability(slug: string): Promise<boolean> {
    const { data } = await supabase
      .from('landing_pages')
      .select('id')
      .eq('slug', slug)
      .single()

    return !data
  }
}
