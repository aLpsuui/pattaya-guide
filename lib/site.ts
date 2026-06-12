// Central site config. Set NEXT_PUBLIC_SITE_URL in Vercel to your production
// domain (e.g. https://gotopattaya.com) to make the site indexable and to
// emit correct canonical / OG / sitemap URLs. Until then it stays noindex.
const RAW = process.env.NEXT_PUBLIC_SITE_URL || 'https://pattaya-guide.vercel.app'
export const SITE_URL = RAW.replace(/\/+$/, '')
export const SITE_NAME = 'Go To Pattaya'
export const SITE_DESCRIPTION =
  'Your complete, honest guide to Pattaya — 600+ verified places, in-depth guides, restaurants, beaches, tours, wellness and nightlife.'
// Indexable only once a production domain is explicitly configured.
export const INDEXABLE = !!process.env.NEXT_PUBLIC_SITE_URL
