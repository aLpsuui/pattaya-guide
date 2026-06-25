import { supabase } from '@/lib/supabase'
import { unstable_cache } from 'next/cache'
import { AREAS } from '@/lib/areas'

const ASSETS = 'https://cdn.gotopattaya.com/Assets'

// Per nav category: top active venues (with an image) + the latest published
// guide for that pillar. Cached and revalidated so it doesn't run per request.

export type MegaVenue = {
  slug: string; name: string; image_url: string | null; rating: number | null
  review_count: number | null; price_from: number | null; neighborhood: string | null
  categories: { slug: string; name_en: string } | null; href: string
}
export type MegaGuide = { slug: string; title: string; description: string | null; read_time: number | null; author: string | null; hero_image: string | null }
export type MegaEntry = { venues: MegaVenue[]; guide: MegaGuide | null }
export type MegaData = Record<string, MegaEntry>

const NAV = [
  { slug: 'eat-and-drinks', pillar: 'Eat & Drink' },
  { slug: 'thinks-to-do', pillar: 'Things to Do' },
  { slug: 'yoga-and-fitness', pillar: 'Yoga & Fitness' },
  { slug: 'wellness-and-beauty', pillar: 'Wellness & Beauty' },
  { slug: 'areas', pillar: 'Areas & Neighbourhoods' },
]

export const getMegaData = unstable_cache(
  async (): Promise<MegaData> => {
    const out: MegaData = {}
    for (const n of NAV) {
      const [{ data: venues }, { data: guide }] = await Promise.all([
        supabase
          .from('venues')
          .select('slug,name,image_url,rating,review_count,price_from,neighborhood,categories!inner(slug,name_en)')
          .eq('categories.slug', n.slug)
          .eq('is_active', true)
          .not('image_url', 'is', null)
          .order('rating', { ascending: false })
          .order('review_count', { ascending: false })
          .limit(5),
        supabase
          .from('blog_posts')
          .select('slug,title,description,read_time,author,hero_image')
          .eq('is_published', true)
          .eq('category', n.pillar)
          .order('published_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])
      // Areas has no DB venues — show the curated area cards in the bento instead.
      const list: MegaVenue[] = n.slug === 'areas'
        ? AREAS.filter((a) => a.slug !== 'islands').slice(0, 6).map((a) => ({
            slug: a.slug, name: a.name, image_url: `${ASSETS}/${a.image}`, rating: null,
            review_count: null, price_from: null, neighborhood: a.vibes.join(' · '),
            categories: { slug: 'areas', name_en: 'Area' }, href: `/areas/${a.slug}`,
          }))
        : ((venues || []) as unknown as Omit<MegaVenue, 'href'>[]).map((v) => ({ ...v, href: `/venues/${v.slug}` }))
      out[n.slug] = { venues: list, guide: (guide || null) as MegaGuide | null }
    }
    return out
  },
  ['mega-nav-v3'],
  { revalidate: 600, tags: ['mega-nav'] },
)
