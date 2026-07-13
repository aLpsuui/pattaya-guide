import { supabase } from '@/lib/supabase'

export type SiteSettings = { logo_url: string | null }

// Public read of the singleton site_settings row. Used by the root layout to
// feed the navbar/footer logo. Falls back to null (default logo) if the table
// isn't set up yet, so the site never breaks.
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data } = await supabase
      .from('site_settings')
      .select('logo_url')
      .eq('id', true)
      .maybeSingle()
    return { logo_url: (data?.logo_url as string) || null }
  } catch {
    return { logo_url: null }
  }
}
