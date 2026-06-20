'use client'
import { IconTrash } from './icons'

export default function RowDelete({ action, id, name }: { action: (fd: FormData) => void; id: string; name: string }) {
  return (
    <form action={action} style={{ display: 'inline' }}>
      <input type="hidden" name="id" value={id} />
      <button className="act-btn danger" aria-label="Delete"
        onClick={(e) => { if (!confirm(`Delete “${name}”? This cannot be undone.`)) e.preventDefault() }}>
        <IconTrash />
      </button>
    </form>
  )
}
