'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import RowDelete from '@/app/admin/_components/RowDelete'
import { reorderPosts } from '@/app/admin/_actions/blog'
import { IconDoc, IconEdit, IconGrip } from '@/app/admin/_components/icons'

export interface BlogRow {
  id: string; title: string; slug: string; category: string | null; author: string | null
  st: string; stPill: string; sc: number; band: string; hero_image: string | null
}

export default function BlogReorder({ posts, deleteAction }: { posts: BlogRow[]; deleteAction: (fd: FormData) => void }) {
  const [items, setItems] = useState(posts)
  const itemsRef = useRef(items)
  itemsRef.current = items
  const drag = useRef<number | null>(null)
  const [active, setActive] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  function onDragStart(i: number) { drag.current = i; setActive(i) }
  function onDragEnter(i: number) {
    const from = drag.current
    if (from === null || from === i) return
    setItems((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(i, 0, moved)
      return next
    })
    drag.current = i
    setActive(i)
  }
  async function onDragEnd() {
    drag.current = null
    setActive(null)
    setSaving(true)
    try { await reorderPosts(itemsRef.current.map((p) => p.id)) } finally { setSaving(false) }
  }

  return (
    <section className="panel">
      <div className="reorder-hint">
        <IconGrip /> Drag a row to reorder — top is shown first on the blog. {saving && <em>Saving…</em>}
      </div>
      <div className="table-scroll">
        <table className="data">
          <thead>
            <tr>
              <th style={{ width: 38 }} aria-label="Drag" />
              <th>Post</th><th className="hide-xs">Pillar</th><th className="hide-xs">Author</th>
              <th>Status</th><th className="hide-xs">SEO</th><th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r, i) => (
              <tr
                key={r.id}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragEnter={() => onDragEnter(i)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={onDragEnd}
                className={active === i ? 'is-dragging' : undefined}
              >
                <td><span className="drag-grip" aria-label="Drag handle"><IconGrip /></span></td>
                <td>
                  <Link href={`/admin/blog/${r.id}`} draggable={false}>
                    <div className="cell-place">
                      <div className="thumb" style={r.hero_image ? { backgroundImage: `url(${r.hero_image})` } : { background: 'linear-gradient(135deg,#9277d8,#6c4cc4)' }} />
                      <div className="info"><b className="list-link">{r.title}</b><span><IconDoc />/blog/{r.slug}</span></div>
                    </div>
                  </Link>
                </td>
                <td className="hide-xs"><span className="pill pill--cat">{r.category || '—'}</span></td>
                <td className="hide-xs muted-cell">{r.author || '—'}</td>
                <td><span className={`pill ${r.stPill}`}><span className="pdot" />{r.st.charAt(0).toUpperCase() + r.st.slice(1)}</span></td>
                <td className="hide-xs"><span className={`score-badge ${r.band}`}>{r.sc}<span className="bar"><i style={{ width: `${r.sc}%` }} /></span></span></td>
                <td>
                  <div className="row-act">
                    <Link className="act-btn" href={`/admin/blog/${r.id}`} aria-label="Edit" draggable={false}><IconEdit /></Link>
                    <RowDelete action={deleteAction} id={r.id} name={r.title} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7}><div className="empty"><b>No posts yet</b><span>Write your first guide.</span></div></td></tr>}
          </tbody>
        </table>
      </div>
      <div className="table-foot"><div className="info">Showing <b>{items.length}</b> posts · order saved automatically</div></div>
    </section>
  )
}
