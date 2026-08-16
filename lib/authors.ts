import { SITE_URL } from '@/lib/site'

// Author registry. Blog posts store the author as a free-text name; this maps
// that name to a real, credentialed profile (bio, role, sameAs) so every article
// links to a connected Person entity instead of a bare name string — the E-E-A-T
// signal the SEO audit flagged as missing. One entry today (the founder writes
// every published post); add rows here as the byline widens.
export interface Author {
  slug: string
  name: string
  jobTitle: string
  // Short factual bio (mission/role based — no invented biographical claims).
  bio: string
  // Real, verified profiles the author operates. NOTE: these are the brand's
  // channels, which the founder runs; swap for personal profiles if provided.
  sameAs: string[]
  knowsAbout: string[]
}

export const AUTHORS: Author[] = [
  {
    slug: 'olcay-dikici',
    name: 'Olcay Dikici',
    jobTitle: 'Founder & Editor',
    bio:
      'Olcay Dikici is the founder of Go To Pattaya. He built the guide to cut through paid "top 10" lists with first-hand, regularly re-checked coverage of where to eat, unwind and go out in Pattaya. He oversees the site\'s editorial standards — every venue verified on the ground, updated weekly, with no paid placements.',
    sameAs: [
      'https://www.instagram.com/gotopattayacom',
      'https://www.facebook.com/people/Go-To-Pattaya/61591161493028/',
      'https://x.com/gotopattayacom',
      'https://www.linkedin.com/company/go-to-pattaya',
    ],
    knowsAbout: [
      'Pattaya',
      'Thailand travel',
      'Restaurants in Pattaya',
      'Nightlife in Pattaya',
      'Wellness and spas',
      'Things to do in Pattaya',
    ],
  },
]

// Deterministic name → slug (matches the registry slugs above). Author names are
// ASCII, so a simple lowercase + non-alphanumeric collapse is enough.
export function authorSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS.find((a) => a.slug === slug)
}

export function getAuthorByName(name: string | null | undefined): Author | undefined {
  if (!name) return undefined
  const s = authorSlug(name)
  return AUTHORS.find((a) => a.slug === s)
}

// The Person node id that both the author page and every article's author field
// point at, so structured data resolves to a single shared entity.
export function authorPersonId(a: Author): string {
  return `${SITE_URL}/author/${a.slug}#person`
}
