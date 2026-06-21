// Single source of truth for the venue SEO checklist + score, so the Places
// list and the edit form always agree.
export type SeoCheck = { ok: boolean; label: string; sub: string }

export type VenueSeoInput = {
  seo_title?: string | null
  description?: string | null
  image_url?: string | null
  slug?: string | null
  focus_keyword?: string | null
}

export function venueChecks(v: VenueSeoInput): SeoCheck[] {
  const title = v.seo_title || ''
  const desc = v.description || ''
  const kw = (v.focus_keyword || '').trim()
  const slug = v.slug || ''
  return [
    { ok: title.length > 0 && title.length <= 60, label: 'SEO title set', sub: `${title.length} characters` },
    { ok: /^[a-z0-9-]+$/.test(slug), label: 'Slug is clean', sub: 'Lowercase, hyphenated' },
    { ok: desc.length >= 120 && desc.length <= 160, label: 'Meta description', sub: `${desc.length} / 155` },
    { ok: !!v.image_url, label: 'Cover image', sub: v.image_url ? 'Set' : 'Needed for social cards' },
    { ok: kw.length > 0, label: 'Focus keyword', sub: kw ? `“${kw}”` : 'Set a primary keyword' },
  ]
}

export function scoreOf(checks: SeoCheck[]): number {
  if (!checks.length) return 0
  return Math.round((checks.filter((c) => c.ok).length / checks.length) * 100)
}
