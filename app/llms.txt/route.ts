import { SITE_URL } from '@/lib/site'

// llms.txt — a concise, machine-readable guide for AI answer engines.
// See https://llmstxt.org/. Served as static text.
export const dynamic = 'force-static'

export function GET() {
  const body = `# Go To Pattaya

> Honest, independent guide to Pattaya, Thailand - 500+ in-person-verified places, in-depth guides, restaurants, beaches, tours, wellness and nightlife. No sponsored rankings.

## Guides
- [Blog & guides](${SITE_URL}/blog): In-depth, locally written Pattaya guides and travel tips
- [Plan my trip](${SITE_URL}/plan-my-trip): Free day-by-day Pattaya itinerary planner

## Explore
- [Things to do](${SITE_URL}/things-to-do): Attractions, tours and activities
- [Eat & drinks](${SITE_URL}/eat-and-drinks): Restaurants, cafes and bars
- [Nightlife](${SITE_URL}/nightlife): Clubs, bars and shows
- [Wellness & beauty](${SITE_URL}/wellness-and-beauty): Spa, massage and wellness
- [Yoga & fitness](${SITE_URL}/yoga-and-fitness): Gyms, Muay Thai and yoga
- [Areas](${SITE_URL}/areas): Pattaya neighbourhoods and districts

## About
- [About](${SITE_URL}/about): Who we are and how we verify places
- [Contact](${SITE_URL}/contact): Get in touch

## Full index
- [Sitemap](${SITE_URL}/sitemap.xml): Every page on the site
`
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
