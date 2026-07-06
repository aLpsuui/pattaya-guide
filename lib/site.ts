// Central site config. Set NEXT_PUBLIC_SITE_URL in Vercel to your production
// domain (e.g. https://gotopattaya.com) to make the site indexable and to
// emit correct canonical / OG / sitemap URLs. Until then it stays noindex.
const RAW = process.env.NEXT_PUBLIC_SITE_URL || 'https://gotopattaya.com'
export const SITE_URL = RAW.replace(/\/+$/, '')
export const SITE_NAME = 'Go To Pattaya'
export const SITE_DESCRIPTION =
  'Your complete, honest guide to Pattaya - 600+ verified places, in-depth guides, restaurants, beaches, tours, wellness and nightlife.'
// Pre-launch: stay noindex by default. Indexing is a deliberate switch that is
// decoupled from the domain, so we can serve the real canonical URLs on
// gotopattaya.com while still keeping the site out of search results. Flip on
// launch day by setting NEXT_PUBLIC_INDEXABLE=true in the Vercel project.
export const INDEXABLE = process.env.NEXT_PUBLIC_INDEXABLE === 'true'
