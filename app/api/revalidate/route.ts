import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// On-demand ISR revalidation, protected by ADMIN_PASSWORD (server-side header
// check — never in the URL). Busts a specific page's cache after out-of-band
// content changes that no admin save touches — e.g. warming a venue's Russian
// translations straight into content_translations, or editing the DB directly.
//
// Usage:
//   curl -X POST https://www.gotopattaya.com/api/revalidate \
//     -H "x-revalidate-key: <ADMIN_PASSWORD>" -H "content-type: application/json" \
//     -d '{"paths":["/ru/venues/some-slug","/en/venues/some-slug"]}'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-revalidate-key')
  if (!key || key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  let paths: string[] = []
  try {
    const body = await req.json()
    paths = Array.isArray(body?.paths) ? body.paths : []
  } catch { /* invalid body → empty */ }
  const done: string[] = []
  for (const p of paths) {
    if (typeof p === 'string' && p.startsWith('/')) { revalidatePath(p); done.push(p) }
  }
  return NextResponse.json({ ok: true, revalidated: done })
}
