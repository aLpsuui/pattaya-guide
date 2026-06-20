'use client'
import { useActionState, useRef, useState } from 'react'
import Link from 'next/link'
import { savePlace } from '@/app/admin/_actions/places'
import { AREAS, PRICE_RANGES, slugify } from '@/lib/admin/options'
import { IconUpload, IconCheck, IconCross } from './icons'
import VenueGallery, { type GalleryPhoto } from './VenueGallery'

export type Category = { id: string; name_en: string }
export type Place = {
  id: string; name: string; slug: string; category_id: string | null; neighborhood: string | null
  tagline: string | null; address: string | null; price_range: string | null; image_url: string | null
  seo_title: string | null; description: string | null; focus_keyword: string | null
  canonical_url: string | null; noindex: boolean | null; status: string | null; is_active: boolean | null
}

const ring = 194.8

export default function PlaceForm({ categories, place, photos = [] }: { categories: Category[]; place?: Place; photos?: GalleryPhoto[] }) {
  const [state, action, pending] = useActionState(savePlace, { error: '' })
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(place?.name ?? '')
  const [slug, setSlug] = useState(place?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!place)
  const [seoTitle, setSeoTitle] = useState(place?.seo_title ?? '')
  const [meta, setMeta] = useState(place?.description ?? '')
  const [keyword, setKeyword] = useState(place?.focus_keyword ?? '')
  const [status, setStatus] = useState(place?.status ?? 'draft')
  const hasImage = !!place?.image_url

  function onName(v: string) { setName(v); if (!slugTouched) setSlug(slugify(v)) }

  const checks = [
    { ok: seoTitle.length > 0 && seoTitle.length <= 60, label: 'SEO title set', sub: `${seoTitle.length} characters` },
    { ok: /^[a-z0-9-]+$/.test(slug), label: 'Slug is clean', sub: 'Lowercase, hyphenated' },
    { ok: meta.length >= 120 && meta.length <= 160, label: 'Meta description', sub: `${meta.length} / 155` },
    { ok: hasImage, label: 'Cover image', sub: hasImage ? 'Set' : 'Needed for social cards' },
    { ok: keyword.trim().length > 0, label: 'Focus keyword', sub: keyword ? `“${keyword}”` : 'Set a primary keyword' },
  ]
  const passed = checks.filter((c) => c.ok).length
  const score = Math.round((passed / checks.length) * 100)
  const tone = score >= 80 ? 'var(--green-500)' : score >= 50 ? 'var(--amber-500)' : 'var(--red-500)'

  const serpTitle = seoTitle || name || 'Venue name — Pattaya'
  const serpDesc = meta || 'Short summary of this venue shown in Google search results.'
  const serpUrl = `pattayaguide.com › places › ${slug || '…'}`

  function submitWith(s: string) { if (statusRef.current) statusRef.current.value = s; setStatus(s); formRef.current?.requestSubmit() }

  return (
    <form ref={formRef} action={action}>
      {place && <input type="hidden" name="id" value={place.id} />}
      <input type="hidden" name="status" ref={statusRef} defaultValue={status} />

      <div className="page-head">
        <div className="ph-l"><h2>{place ? 'Edit place' : 'Add place'}</h2><p>Core details and search metadata for the venue.</p></div>
        <div className="ph-r">
          <Link className="btn btn--ghost btn--sm" href="/admin/places">Cancel</Link>
          <button type="button" className="btn btn--secondary btn--sm" disabled={pending} onClick={() => submitWith('draft')}>Save draft</button>
          <button type="button" className="btn btn--primary btn--sm" disabled={pending} onClick={() => submitWith('published')}>Publish</button>
        </div>
      </div>

      {state.error && <div className="flash err"><IconCross />{state.error}</div>}

      <div className="split">
        <div>
          <section className="panel">
            <div className="panel-head"><div><h3>Details</h3><div className="sub">The essentials shown on the venue page</div></div></div>
            <div className="panel-body">
              <div className="form-grid">
                <div className="field col-2">
                  <label>Venue name <span className="req">*</span></label>
                  <input className="input" name="name" value={name} onChange={(e) => onName(e.target.value)} placeholder="e.g. Health Land North Pattaya" />
                </div>
                <div className="field">
                  <label>Category</label>
                  <select className="select" name="category_id" defaultValue={place?.category_id ?? ''}>
                    <option value="">— Select —</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Area / district</label>
                  <select className="select" name="neighborhood" defaultValue={place?.neighborhood ?? ''}>
                    <option value="">— Select —</option>
                    {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                    {place?.neighborhood && !AREAS.includes(place.neighborhood) && <option value={place.neighborhood}>{place.neighborhood}</option>}
                  </select>
                </div>
                <div className="field col-2">
                  <label>Short description</label>
                  <textarea className="textarea" name="tagline" defaultValue={place?.tagline ?? ''} placeholder="One or two lines that summarise the venue…" />
                  <span className="hint">Shown on listing cards. Stored as the venue tagline.</span>
                </div>
                <div className="field">
                  <label>Address</label>
                  <input className="input" name="address" defaultValue={place?.address ?? ''} placeholder="Street, area, Pattaya" />
                </div>
                <div className="field">
                  <label>Price range</label>
                  <select className="select" name="price_range" defaultValue={place?.price_range ?? ''}>
                    <option value="">— Select —</option>
                    {PRICE_RANGES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head"><div><h3>Cover image</h3><div className="sub">Used on cards, the venue header &amp; social sharing</div></div></div>
            <div className="panel-body">
              {hasImage && <div className="thumb" style={{ width: '100%', height: 160, borderRadius: 'var(--r-md)', backgroundImage: `url(${place!.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 12 }} />}
              <label className="dropzone">
                <div className="dz-ic"><IconUpload /></div>
                <b>Drop an image or <u>browse</u></b>
                <span>JPG or WebP · uploads to the venues bucket</span>
                <input type="file" name="cover" accept="image/*" style={{ display: 'none' }} />
              </label>
              <div className="field" style={{ marginTop: 12 }}>
                <label>…or paste an image URL</label>
                <input className="input" name="image_url" defaultValue={place?.image_url ?? ''} placeholder="https://…/storage/v1/object/public/venues/…" />
              </div>
            </div>
          </section>

          {place && <VenueGallery venueId={place.id} slug={place.slug} photos={photos} />}

          <section className="panel">
            <div className="panel-head">
              <div><h3>Search &amp; SEO</h3><div className="sub">How this place appears in Google &amp; on social</div></div>
              <div className="ph-actions"><span className="pill pill--cat">LocalBusiness schema</span></div>
            </div>
            <div className="panel-body">
              <div className="form-grid">
                <div className="field col-2">
                  <label>URL slug</label>
                  <div className="input-group">
                    <span className="prefix">/places/</span>
                    <input name="slug" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true) }} placeholder="health-land-north-pattaya" />
                  </div>
                  <span className="hint">Lowercase, hyphenated. Auto-filled from the name.</span>
                </div>
                <div className="field col-2">
                  <div className="field-row"><label>SEO title</label><Counter n={seoTitle.length} max={60} warn={50} /></div>
                  <input className="input" name="seo_title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Health Land North Pattaya — Spa &amp; Massage" />
                  <span className="hint">Aim for under 60 characters.</span>
                </div>
                <div className="field col-2">
                  <div className="field-row"><label>Meta description</label><Counter n={meta.length} max={155} warn={140} /></div>
                  <textarea className="textarea" name="description" value={meta} onChange={(e) => setMeta(e.target.value)} placeholder="Traditional Thai massage and spa packages in North Pattaya…" />
                  <span className="hint">Aim for 140–155 characters. Stored as the venue description.</span>
                </div>
                <div className="field">
                  <label>Focus keyword</label>
                  <input className="input" name="focus_keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="spa north pattaya" />
                </div>
                <div className="field">
                  <label>Canonical URL <span className="hint" style={{ fontWeight: 500 }}>(optional)</span></label>
                  <input className="input" name="canonical_url" defaultValue={place?.canonical_url ?? ''} placeholder="Leave blank to use the page URL" />
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <div className="field-row" style={{ marginBottom: 8 }}><label style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--text-strong)' }}>Google preview</label></div>
                <div className="serp">
                  <div className="serp-url"><span className="fav" />{serpUrl}</div>
                  <div className="serp-title">{serpTitle}</div>
                  <div className="serp-desc">{serpDesc}</div>
                </div>
              </div>

              <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-soft)' }}>
                <label className="toggle">
                  <input type="checkbox" name="index" defaultChecked={!place?.noindex} />
                  <span className="track" />
                  <span className="tlabel">Allow search engines to index this page<small>Off = noindex.</small></span>
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="aside">
          <section className="panel">
            <div className="panel-head"><div><h3>Publish</h3></div></div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field">
                <label>Status</label>
                <div className="seg" style={{ width: '100%' }}>
                  {['draft', 'pending', 'published'].map((s) => (
                    <button type="button" key={s} className={status === s ? 'on' : ''} style={{ flex: 1, textTransform: 'capitalize' }}
                      onClick={() => { setStatus(s); if (statusRef.current) statusRef.current.value = s }}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>Visibility</label>
                <select className="select" name="visibility" defaultValue={place?.is_active === false ? 'Hidden' : 'Public'}>
                  <option>Public</option><option>Hidden</option>
                </select>
              </div>
              <button type="submit" className="btn btn--primary btn--block" disabled={pending}>{pending ? 'Saving…' : place ? 'Save changes' : 'Create place'}</button>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head"><div><h3>SEO score</h3></div></div>
            <div className="panel-body">
              <div className="score" style={{ marginBottom: 14 }}>
                <div className="ring">
                  <svg viewBox="0 0 74 74"><circle cx="37" cy="37" r="31" fill="none" stroke="var(--bg-sunken)" strokeWidth="8" /><circle cx="37" cy="37" r="31" fill="none" stroke={tone} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(score / 100) * ring} ${ring}`} /></svg>
                  <b>{score}</b>
                </div>
                <div className="sc-info"><b>{score >= 80 ? 'Healthy' : score >= 50 ? 'Needs work' : 'Weak'}</b><span>{passed} of {checks.length} checks passing</span></div>
              </div>
              <div className="checklist">
                {checks.map((c) => (
                  <div className="check-item" key={c.label}>
                    <span className={`check-ic ${c.ok ? 'ok' : 'bad'}`}>{c.ok ? <IconCheck /> : <IconCross />}</span>
                    <div className="ct"><b>{c.label}</b><span>{c.sub}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  )
}

function Counter({ n, max, warn }: { n: number; max: number; warn: number }) {
  const cls = n > max ? 'over' : n > warn ? 'warn' : ''
  return <span className={`counter ${cls}`}>{n} / {max}</span>
}
