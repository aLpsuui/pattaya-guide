import { NextResponse } from 'next/server'
import { getMegaData } from '@/lib/megaNav'

// Mega-menu content, fetched by the Navbar on first hover instead of being
// embedded in every page's RSC payload (P-03). getMegaData is itself cached.
export const revalidate = 600

export async function GET() {
  const data = await getMegaData()
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600' },
  })
}
