import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600 // refresh the sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static, always-present routes.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/eat-and-drinks`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/thinks-to-do`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/yoga-and-fitness`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/wellness-and-beauty`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/areas`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/plan-my-trip`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Dynamic: published blog posts.
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('slug, updated_at_post, published_at')
      .eq('is_published', true)
    blogRoutes = (data || []).map((p: { slug: string; updated_at_post: string | null; published_at: string | null }) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updated_at_post || p.published_at || now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {
    // If the DB is unreachable at build time, still return the static routes.
    blogRoutes = []
  }

  return [...staticRoutes, ...blogRoutes]
}
