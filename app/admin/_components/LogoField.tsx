'use client'
import { useState } from 'react'
import { IconUpload } from './icons'
import BrandLogo from '@/app/components/BrandLogo'

// Logo picker for the settings page: upload from PC (logo_file) or paste a URL
// (logo_url). A file wins server-side; clearing both reverts to the default
// mark. The preview uses a checkerboard so transparent PNGs read clearly.
export default function LogoField({ initial }: { initial: string | null }) {
  const [url, setUrl] = useState(initial || '')
  const [preview, setPreview] = useState(initial || '')
  const [fileName, setFileName] = useState('')

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFileName(f.name)
    setPreview(URL.createObjectURL(f))
    setUrl('') // file wins; don't submit a stale URL
  }

  function onUrl(e: React.ChangeEvent<HTMLInputElement>) {
    setUrl(e.target.value)
    setPreview(e.target.value)
    setFileName('')
  }

  function reset() {
    setUrl(''); setPreview(''); setFileName('')
  }

  const checker =
    'linear-gradient(45deg,#e2e8f0 25%,transparent 25%),linear-gradient(-45deg,#e2e8f0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e2e8f0 75%),linear-gradient(-45deg,transparent 75%,#e2e8f0 75%)'

  return (
    <>
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '100%', height: 120, borderRadius: 'var(--r-md)', marginBottom: 12,
          background: preview ? `${checker}` : 'var(--surface-2, #f1f5f9)',
          backgroundSize: '18px 18px', backgroundPosition: '0 0,0 9px,9px -9px,-9px 0',
          border: '1px solid var(--line, #e2e8f0)',
        }}
      >
        {preview
          ? <img src={preview} alt="Logo önizleme" style={{ maxHeight: 80, maxWidth: '80%', objectFit: 'contain' }} />
          : <BrandLogo h={44} />}
      </div>
      <small style={{ display: 'block', color: 'var(--muted, #64748b)', marginTop: -6, marginBottom: 12 }}>
        {preview ? 'Yüklü/seçili logo — sitede bu görünür.' : 'Şu an sitedeki mevcut (varsayılan) logo. Değiştirmek için aşağıdan yükle.'}
      </small>

      <label className="dropzone">
        <div className="dz-ic"><IconUpload /></div>
        <b>{fileName || <>Logo yükle veya <u>seç</u></>}</b>
        <span>PNG, SVG veya WebP · assets bucket&apos;ına yüklenir</span>
        <input type="file" name="logo_file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />
      </label>

      <div className="field" style={{ marginTop: 12 }}>
        <label>…veya bir URL yapıştır</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" name="logo_url" value={url} onChange={onUrl} placeholder="https://…" style={{ flex: 1, minWidth: 0 }} />
          {preview && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={reset} style={{ flexShrink: 0 }}>Kaldır</button>
          )}
        </div>
        <small>Boş bırakıp kaydedersen varsayılan logoya döner.</small>
      </div>
    </>
  )
}
