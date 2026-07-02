'use client'
import { useState } from 'react'
import { IconUpload } from './icons'
import { listMedia, type MediaItem } from '@/app/admin/_actions/media'

// Cover-image field for the blog editor: upload from PC, paste a URL, OR pick
// an existing file from the media library (modal).
export default function CoverImageField({ initial }: { initial: string }) {
  const [url, setUrl] = useState(initial)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<MediaItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')

  async function openPicker() {
    setOpen(true)
    if (!loaded) {
      setLoading(true)
      try { setItems(await listMedia()); setLoaded(true) } finally { setLoading(false) }
    }
  }
  const term = q.trim().toLowerCase()
  const filtered = term ? items.filter((i) => i.name.toLowerCase().includes(term)) : items

  return (
    <>
      {url && <div className="thumb" style={{ width: '100%', height: 160, borderRadius: 'var(--r-md)', backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 12 }} />}
      <label className="dropzone">
        <div className="dz-ic"><IconUpload /></div>
        <b>Drop an image or <u>browse</u></b>
        <span>JPG or WebP · uploads to the blog bucket</span>
        <input type="file" name="cover" accept="image/*" style={{ display: 'none' }} />
      </label>
      <div className="field" style={{ marginTop: 12 }}>
        <label>…or paste a URL / choose from the library</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" name="hero_image" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" style={{ flex: 1, minWidth: 0 }} />
          <button type="button" className="btn btn--ghost btn--sm" onClick={openPicker} style={{ flexShrink: 0 }}>Library</button>
        </div>
      </div>

      {open && (
        <div className="mp-backdrop" onClick={() => setOpen(false)}>
          <div className="mp-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mp-head">
              <b>Media library</b>
              <input className="input mp-search" placeholder="Search files…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
              <button type="button" className="mp-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>
            <div className="mp-body">
              {loading ? (
                <div className="mp-note">Loading media…</div>
              ) : filtered.length === 0 ? (
                <div className="mp-note">{items.length === 0 ? 'No files in the library yet.' : 'No files match.'}</div>
              ) : (
                <div className="mp-grid">
                  {filtered.map((m) => (
                    <button type="button" key={m.bucket + '/' + m.name} className={`mp-item${url === m.url ? ' on' : ''}`} onClick={() => { setUrl(m.url); setOpen(false) }} title={m.name}>
                      <img src={m.url} alt={m.name} loading="lazy" />
                      <span className="mp-tag">{m.bucket}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mp-foot">{filtered.length} file{filtered.length === 1 ? '' : 's'}</div>
          </div>
        </div>
      )}
    </>
  )
}
