'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// Instant ("synthetic") search: a tiny index of categories + venues is loaded
// once, then filtered on every keystroke entirely client-side, so the dropdown
// updates with no per-letter network round-trip. Results are grouped by type
// (Categories · Sub-categories · Places), each colour-coded.

interface Cat { name: string; slug: string }
interface Ven { slug: string; name: string; type: string | null; catSlug: string | null }
interface Sub { label: string; catSlug: string; catName: string }

type Result = { kind: 'cat' | 'sub' | 'area' | 'ven'; name: string; meta: string; href: string }

// Curated Pattaya areas/districts — all link to the Areas page.
const AREAS = [
  'Central Pattaya', 'Jomtien', 'Naklua', 'Pratumnak Hill', 'Wong Amat',
  'Walking Street', 'Islands', 'Koh Larn', 'Soi Buakhao', 'Thappraya',
  'Phra Tamnak', 'North Pattaya', 'South Pattaya',
]

function highlight(text: string, term: string) {
  if (!term) return text
  const i = text.toLowerCase().indexOf(term)
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}<b>{text.slice(i, i + term.length)}</b>{text.slice(i + term.length)}
    </>
  )
}

export default function HeroSearch() {
  const router = useRouter()
  const [cats, setCats] = useState<Cat[]>([])
  const [vens, setVens] = useState<Ven[]>([])
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)

  // Load the search index once.
  useEffect(() => {
    let on = true
    ;(async () => {
      const [{ data: c }, { data: v }] = await Promise.all([
        supabase.from('categories').select('name_en, slug'),
        supabase.from('venues').select('slug, name, venue_type, categories(slug)').eq('is_active', true),
      ])
      if (!on) return
      setCats(((c as unknown as { name_en: string; slug: string }[]) || []).map(x => ({ name: x.name_en, slug: x.slug })))
      setVens(((v as unknown as { slug: string; name: string; venue_type: string | null; categories: { slug: string } | null }[]) || [])
        .map(x => ({ slug: x.slug, name: x.name, type: x.venue_type, catSlug: x.categories?.slug ?? null })))
    })()
    return () => { on = false }
  }, [])

  // Close on outside click.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  // Distinct sub-categories derived from venue_type.
  const subs = useMemo<Sub[]>(() => {
    const m = new Map<string, Sub>()
    for (const v of vens) {
      if (v.type && v.catSlug && !m.has(v.type.toLowerCase())) {
        m.set(v.type.toLowerCase(), { label: v.type, catSlug: v.catSlug, catName: cats.find(c => c.slug === v.catSlug)?.name ?? '' })
      }
    }
    return [...m.values()]
  }, [vens, cats])

  const term = q.trim().toLowerCase()
  const groups = useMemo(() => {
    if (!term) return { cat: [] as Cat[], sub: [] as Sub[], area: [] as string[], ven: [] as Ven[] }
    return {
      cat: cats.filter(c => c.name.toLowerCase().includes(term)).slice(0, 5),
      sub: subs.filter(s => s.label.toLowerCase().includes(term)).slice(0, 5),
      area: AREAS.filter(a => a.toLowerCase().includes(term)).slice(0, 5),
      ven: vens.filter(v => v.name.toLowerCase().includes(term)).slice(0, 8),
    }
  }, [term, cats, subs, vens])

  // Flat ordered list for keyboard nav.
  const flat = useMemo<Result[]>(() => [
    ...groups.cat.map(c => ({ kind: 'cat' as const, name: c.name, meta: 'Category', href: `/${c.slug}` })),
    ...groups.sub.map(s => ({ kind: 'sub' as const, name: s.label, meta: s.catName, href: `/${s.catSlug}` })),
    ...groups.area.map(a => ({ kind: 'area' as const, name: a, meta: 'Area', href: '/areas' })),
    ...groups.ven.map(v => ({ kind: 'ven' as const, name: v.name, meta: v.type ?? 'Place', href: `/venues/${v.slug}` })),
  ], [groups])

  useEffect(() => { setActive(0) }, [term])

  const show = open && term.length > 0
  const go = (href: string) => { setOpen(false); router.push(href) }

  function onKey(e: React.KeyboardEvent) {
    if (!show) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, flat.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (flat[active]) go(flat[active].href) }
    else if (e.key === 'Escape') { setOpen(false) }
  }

  let idx = -1
  const Item = ({ r }: { r: Result }) => {
    idx += 1
    const i = idx
    return (
      <a href={r.href} className={`hs-item${i === active ? ' is-active' : ''}`}
        onMouseEnter={() => setActive(i)}
        onClick={(e) => { e.preventDefault(); go(r.href) }}>
        <span className="hs-name">{highlight(r.name, term)}</span>
        <span className="hs-meta">{r.meta}</span>
      </a>
    )
  }

  return (
    <div className="hero-search-wrap" ref={boxRef}>
      <div className="hero-search" role="search">
        <label className="hsr" htmlFor="heroInput">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input id="heroInput" type="search" placeholder="Search places, areas, or guides..." autoComplete="off"
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true) }}
            onFocus={() => { if (q.trim()) setOpen(true) }}
            onKeyDown={onKey}
            role="combobox" aria-expanded={show} aria-controls="hs-panel" aria-autocomplete="list" />
        </label>
        <button type="button" className="go" aria-label="Search"
          onClick={() => { if (flat[0]) go(flat[0].href) }}>
          <span>Search</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>

      {show && (
        <div className="hs-panel" id="hs-panel" role="listbox">
          {flat.length === 0 && <div className="hs-empty">No matches for “{q}”.</div>}

          {groups.cat.length > 0 && (
            <div className="hs-group">
              <div className="hs-label hs-cat"><span className="hsdot" /> Categories</div>
              {groups.cat.map(c => <Item key={'c' + c.slug} r={{ kind: 'cat', name: c.name, meta: 'Category', href: `/${c.slug}` }} />)}
            </div>
          )}
          {groups.sub.length > 0 && (
            <div className="hs-group">
              <div className="hs-label hs-sub"><span className="hsdot" /> Sub-categories</div>
              {groups.sub.map(s => <Item key={'s' + s.label} r={{ kind: 'sub', name: s.label, meta: s.catName, href: `/${s.catSlug}` }} />)}
            </div>
          )}
          {groups.area.length > 0 && (
            <div className="hs-group">
              <div className="hs-label hs-area"><span className="hsdot" /> Areas</div>
              {groups.area.map(a => <Item key={'a' + a} r={{ kind: 'area', name: a, meta: 'Area', href: '/areas' }} />)}
            </div>
          )}
          {groups.ven.length > 0 && (
            <div className="hs-group">
              <div className="hs-label hs-ven"><span className="hsdot" /> Places</div>
              {groups.ven.map(v => <Item key={'v' + v.slug} r={{ kind: 'ven', name: v.name, meta: v.type ?? 'Place', href: `/venues/${v.slug}` }} />)}
            </div>
          )}

          {flat.length > 0 && (
            <div className="hs-foot"><span>↑↓ to navigate · ↵ to open</span><span>{flat.length} result{flat.length > 1 ? 's' : ''}</span></div>
          )}
        </div>
      )}
    </div>
  )
}
