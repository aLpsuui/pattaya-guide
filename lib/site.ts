// Central site config. Single source of truth for the canonical host — every
// canonical tag, OG url, sitemap entry, robots host and JSON-LD id derives from
// SITE_URL. The site is served on the www host (apex 308-redirects to www), so
// the canonical host MUST be www to avoid "canonical says A, redirect says B".
// Override in Vercel with NEXT_PUBLIC_SITE_URL=https://www.gotopattaya.com.
const RAW = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gotopattaya.com'
export const SITE_URL = RAW.replace(/\/+$/, '')
export const SITE_NAME = 'Go To Pattaya'
export const SITE_DESCRIPTION =
  'Your complete, honest guide to Pattaya - 500+ verified places, in-depth guides, restaurants, beaches, tours, wellness and nightlife.'
// Pre-launch: stay noindex by default. Indexing is a deliberate switch that is
// decoupled from the domain, so we can serve the real canonical URLs on
// gotopattaya.com while still keeping the site out of search results. Flip on
// launch day by setting NEXT_PUBLIC_INDEXABLE=true in the Vercel project.
export const INDEXABLE = process.env.NEXT_PUBLIC_INDEXABLE === 'true'
// GA4 Measurement ID (G-XXXXXXXXXX). Set NEXT_PUBLIC_GA_ID in Vercel (Production)
// to switch analytics on. Empty => the gtag scripts are never rendered, so
// preview/dev traffic and pre-launch builds stay out of the property.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''
