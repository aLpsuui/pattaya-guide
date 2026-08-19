import { db } from '@/lib/admin/db'

// Reads the AI SEO recommendation reports produced by scripts/seo-analysis.mjs
// (stored in public.seo_recommendations, service-role only). The admin analytics
// page renders the latest report; history powers the "geçmiş" dropdown.

export type SeoItem = {
  priority: number
  kind: 'improve' | 'gap'
  page_path: string | null
  page_type: string
  target: string
  issue: string
  impressions?: number
  clicks?: number
  ctr?: number
  position?: number
  action: string
}
export type SeoReport = {
  id: string
  created_at: string
  period_start: string | null
  period_end: string | null
  model: string | null
  summary: string
  items: SeoItem[]
  meta: Record<string, number>
}

export async function getLatestSeoReport(): Promise<SeoReport | null> {
  try {
    const { data } = await db
      .from('seo_recommendations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
    return data && data[0] ? (data[0] as SeoReport) : null
  } catch {
    return null // table not created yet, or no service-role access — page degrades gracefully
  }
}
