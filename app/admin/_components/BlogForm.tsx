'use client'
import { useActionState, useRef, useState } from 'react'
import Link from 'next/link'
import { saveBlog } from '@/app/admin/_actions/blog'
import { BLOG_PILLARS, BLOG_AUTHORS, slugify } from '@/lib/admin/options'
import RTE from './RTE'
import { IconUpload, IconCheck, IconCross } from './icons'

export type Post = {
  id: string; title: string; slug: string; description: string | null; page_html: string | null
  hero_image: string | null; category: string | null; author: string | null; tags: string[] | null
  seo_title: string | null; meta_description: string | null; focus_keyword: string | null
  noindex: boolean | null; status: string | null; is_published: boolean | null
}

const ring = 194.8

export default function BlogForm({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(saveBlog, { error: '' })
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!post)
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? '')
  const [meta, setMeta] = useState(post?.meta_description ?? '')
  const [keyword, setKeyword] = useState(post?.focus_keyword ?? '')
  const [author, setAuthor] = useState(post?.author ?? BLOG_AUTHORS[0])
  const [status, setStatus] = useState(post?.status ?? 'draft')
  const [body, setBody] = useState(post?.page_html ?? '')

  function onTitle(v: string) { setTitle(v); if (!slugTouched) setSlug(slugify(v)) }

  const checks = [
    { ok: (seoTitle || title).length > 0 && (seoTitle || title).length <= 60, label: 'Title length good', sub: `${(seoTitle || title).length} characters` },
    { ok: meta.length >= 120 && meta.length <= 160, label: 'Meta description set', sub: `${meta.length} / 155` },
    { ok: keyword.trim().length > 0 && (seoTitle || title).toLowerCase().includes(keyword.toLowerCase()), label: 'Focus keyword in title', sub: keyword ? `“${keyword}”` : 'Set a keyword' },
    { ok: !!author, label: 'Author assigned', sub: author || 'Pick an author' },
    { ok: body.replace(/<[^>]+>/g, '').trim().length > 200, label: 'Body has content', sub: 'At least a few paragraphs' },
  ]
  const passed = checks.filter((c) => c.ok).length
  const score = Math.round((passed / checks.length) * 100)
  const tone = score >= 80 ? 'var(--green-500)' : score >= 50 ? 'var(--amber-500)' : 'var(--red-500)'

  const serpTitle = seoTitle || title || 'Post title'
  const serpDesc = meta || 'Meta description preview…'
  const serpUrl = `pattayaguide.com › blog › ${slug || '…'}`

  function submitWith(s: string) { if (statusRef.current) statusRef.current.value = s; setStatus(s); formRef.current?.requestSubmit() }

  return (
    <form ref={formRef} action={action}>
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="status" ref={statusRef} defaultValue={status} />
      <input type="hidden" name="page_html" value={body} readOnly />

      <div className="page-head">
        <div className="ph-l"><h2>{post ? 'Edit post' : 'New post'}</h2><p>Write a guide and tune its search snippet.</p></div>
        <div className="ph-r">
          <Link className="btn btn--ghost btn--sm" href="/admin/blog">Cancel</Link>
          <button type="button" className="btn btn--secondary btn--sm" disabled={pending} onClick={() => submitWith('draft')}>Save draft</button>
          <button type="button" className="btn btn--primary btn--sm" disabled={pending} onClick={() => submitWith('published')}>Publish</button>
        </div>
      </div>

      {state.error && <div className="flash err"><IconCross />{state.error}</div>}

      <div className="split">
        <div>
          <section className="panel">
            <div className="panel-head"><div><h3>Content</h3></div></div>
            <div className="panel-body">
              <div className="form-grid">
                <div className="field col-2">
                  <label>Title <span className="req">*</span></label>
                  <input className="input" name="title" value={title} onChange={(e) => onTitle(e.target.value)} placeholder="e.g. Best Massage in Pattaya: 12 Trusted Spas" />
                </div>
                <div className="field col-2">
                  <label>Excerpt</label>
                  <textarea className="textarea" name="description" defaultValue={post?.description ?? ''} placeholder="A short standfirst shown on the blog index…" />
                </div>
                <div className="field col-2">
                  <label>Body</label>
                  <RTE initialHTML={post?.page_html ?? ''} onChange={setBody} />
                  <span className="hint">Format with the toolbar or switch to <b>HTML</b>. Saved to the post’s page HTML.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head"><div><h3>Cover image</h3><div className="sub">Hero &amp; social sharing image</div></div></div>
            <div className="panel-body">
              {post?.hero_image && <div className="thumb" style={{ width: '100%', height: 160, borderRadius: 'var(--r-md)', backgroundImage: `url(${post.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 12 }} />}
              <label className="dropzone">
                <div className="dz-ic"><IconUpload /></div>
                <b>Drop an image or <u>browse</u></b>
                <span>JPG or WebP · uploads to the blog bucket</span>
                <input type="file" name="cover" accept="image/*" style={{ display: 'none' }} />
              </label>
              <div className="field" style={{ marginTop: 12 }}>
                <label>…or paste an image URL</label>
                <input className="input" name="hero_image" defaultValue={post?.hero_image ?? ''} placeholder="https://…/storage/v1/object/public/blog/…" />
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div><h3>Search &amp; SEO</h3><div className="sub">How this post appears in Google &amp; on social</div></div>
              <div className="ph-actions"><span className="pill pill--cat">Article schema</span></div>
            </div>
            <div className="panel-body">
              <div className="form-grid">
                <div className="field col-2">
                  <label>URL slug</label>
                  <div className="input-group">
                    <span className="prefix">/blog/</span>
                    <input name="slug" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true) }} placeholder="best-massage-pattaya" />
                  </div>
                </div>
                <div className="field col-2">
                  <div className="field-row"><label>SEO title</label><Counter n={seoTitle.length} max={60} warn={50} /></div>
                  <input className="input" name="seo_title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Best Massage in Pattaya: 12 Trusted Spas (2026)" />
                  <span className="hint">If empty, the post title is used.</span>
                </div>
                <div className="field col-2">
                  <div className="field-row"><label>Meta description</label><Counter n={meta.length} max={155} warn={140} /></div>
                  <textarea className="textarea" name="meta_description" value={meta} onChange={(e) => setMeta(e.target.value)} placeholder="Where to get the best massage in Pattaya — 12 trusted spas by area, prices and what to book." />
                </div>
                <div className="field">
                  <label>Focus keyword</label>
                  <input className="input" name="focus_keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="best massage pattaya" />
                </div>
                <div className="field">
                  <label>Tags</label>
                  <input className="input" name="tags" defaultValue={(post?.tags || []).join(', ')} placeholder="massage, spa, wellness" />
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
                  <input type="checkbox" name="index" defaultChecked={!post?.noindex} />
                  <span className="track" />
                  <span className="tlabel">Allow search engines to index this post<small>Off = noindex.</small></span>
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
                <label>Pillar</label>
                <select className="select" name="category" defaultValue={post?.category ?? BLOG_PILLARS[0]}>
                  {BLOG_PILLARS.map((p) => <option key={p}>{p}</option>)}
                  {post?.category && !BLOG_PILLARS.includes(post.category) && <option>{post.category}</option>}
                </select>
              </div>
              <div className="field">
                <label>Author <span className="hint" style={{ fontWeight: 500 }}>(E-E-A-T)</span></label>
                <select className="select" name="author" value={author} onChange={(e) => setAuthor(e.target.value)}>
                  {BLOG_AUTHORS.map((a) => <option key={a}>{a}</option>)}
                  {post?.author && !BLOG_AUTHORS.includes(post.author) && <option>{post.author}</option>}
                </select>
              </div>
              <button type="submit" className="btn btn--primary btn--block" disabled={pending}>{pending ? 'Saving…' : post ? 'Save changes' : 'Create post'}</button>
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
