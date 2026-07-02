'use client'
import { useActionState, useRef } from 'react'
import { uploadMedia } from '@/app/admin/_actions/media'
import { IconUpload } from './icons'

export default function MediaUpload({ buckets }: { buckets: string[] }) {
  const [state, action, pending] = useActionState(uploadMedia, { error: '' })
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <form action={action} className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="toolbar" style={{ padding: 0, border: 'none', gap: 12 }}>
        <select className="select" name="bucket" style={{ maxWidth: 200 }} defaultValue="blog">
          {buckets.map((b) => <option key={b}>{b}</option>)}
        </select>
        <label className="dropzone" style={{ flex: 1, padding: 16, flexDirection: 'row', gap: 12 }}>
          <div className="dz-ic" style={{ marginBottom: 0 }}><IconUpload /></div>
          <b>Choose an image to upload</b>
          <input ref={fileRef} type="file" name="file" accept="image/*" style={{ display: 'none' }} onChange={() => fileRef.current?.form?.requestSubmit()} />
        </label>
        <button className="btn btn--primary btn--sm" disabled={pending}>{pending ? 'Uploading…' : 'Upload'}</button>
      </div>
      {state.error && <div className="flash err">{state.error}</div>}
      {state.ok && <div className="flash ok">{state.ok}</div>}
    </form>
  )
}
