'use client'
import { useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addVenuePhotos, deleteVenuePhoto } from '@/app/admin/_actions/places'
import { IconUpload, IconCross } from './icons'

export type GalleryPhoto = { id: string; url: string; alt: string | null }

// Lives inside the PlaceForm <form>, so it must NOT render its own <form>.
// Server actions are invoked directly (not via form submit) to avoid nesting.
export default function VenueGallery({ venueId, slug, photos }: { venueId: string; slug: string; photos: GalleryPhoto[] }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || !files.length) return
    const fd = new FormData()
    fd.set('venue_id', venueId)
    fd.set('slug', slug)
    Array.from(files).forEach((f) => fd.append('photos', f))
    start(async () => {
      await addVenuePhotos(fd)
      if (fileRef.current) fileRef.current.value = ''
      router.refresh()
    })
  }

  function onDelete(id: string) {
    if (!confirm('Remove this photo?')) return
    const fd = new FormData()
    fd.set('id', id)
    fd.set('venue_id', venueId)
    start(async () => { await deleteVenuePhoto(fd); router.refresh() })
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <div><h3>Gallery</h3><div className="sub">Photos shown in the venue gallery ({photos.length})</div></div>
      </div>
      <div className="panel-body">
        {photos.length > 0 && (
          <div className="gal-grid" style={{ marginBottom: 14, opacity: pending ? 0.6 : 1 }}>
            {photos.map((p) => (
              <div key={p.id} className="gal-item" style={{ backgroundImage: `url(${p.url})` }}>
                <button type="button" className="gal-del" aria-label="Remove photo" onClick={() => onDelete(p.id)}><IconCross /></button>
              </div>
            ))}
          </div>
        )}
        <label className="dropzone">
          <div className="dz-ic"><IconUpload /></div>
          <b>{pending ? 'Uploading…' : <>Add photos — <u>browse</u></>}</b>
          <span>Select one or more · uploads to the venues bucket</span>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={onUpload} disabled={pending} />
        </label>
      </div>
    </section>
  )
}
