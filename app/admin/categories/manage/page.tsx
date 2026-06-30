import { db } from '@/lib/admin/db'
import Link from 'next/link'
import Shell from '@/app/admin/_components/Shell'
import RowDelete from '@/app/admin/_components/RowDelete'
import { IconChevR, IconPlus, IconTrash, IconTree } from '@/app/admin/_components/icons'
import { createCategory, updateCategory, deleteCategory } from '@/app/admin/_actions/categories'

export const dynamic = 'force-dynamic'

type Cat = { id: string; name_en: string; slug: string; icon: string | null }

export default async function ManageCategoriesPage() {
  const [{ data: cats }, { data: vens }] = await Promise.all([
    db.from('categories').select('id,name_en,slug,icon').order('name_en', { ascending: true }),
    db.from('venues').select('category_id').limit(2000),
  ])
  const categories = (cats || []) as Cat[]
  const venues = (vens || []) as { category_id: string | null }[]
  const count = (id: string) => venues.filter((v) => v.category_id === id).length

  return (
    <Shell
      active="categories"
      crumb={<>Content <IconChevR /> Categories <IconChevR /> Manage</>}
      title="Manage categories"
      actions={<Link href="/admin/categories" className="btn btn--ghost btn--sm"><IconTree /> Diagram view</Link>}
    >
      <div className="page-head">
        <div className="ph-l"><h2>Categories</h2><p>{categories.length} total · create, rename and remove</p></div>
      </div>

      {/* add */}
      <section className="panel" style={{ padding: 16, marginBottom: 16 }}>
        <form action={createCategory} className="cmf-row">
          <input name="name_en" className="cmf-input" placeholder="New category name" required />
          <input name="slug" className="cmf-input" placeholder="slug (auto if blank)" />
          <input name="icon" className="cmf-input cmf-input--sm" placeholder="icon (e.g. eat)" />
          <button type="submit" className="btn btn--primary"><IconPlus /> Add</button>
        </form>
        <p className="cmf-hint">Slug, URL'de kullanılır (ör. <code>/eat-and-drinks</code>). Boş bırakırsan addan otomatik üretilir.</p>
      </section>

      {/* list */}
      <div className="cmf-list">
        {categories.map((c) => {
          const n = count(c.id)
          return (
            <section className="panel cmf-item" key={c.id}>
              <div className="cmf-head">
                <div className="cmf-meta">
                  <b>{c.name_en}</b>
                  <span><code>{c.slug}</code> · {n} venue{n === 1 ? '' : 's'} · icon: {c.icon || '—'}</span>
                </div>
                <div className="row-act">
                  {n > 0 ? (
                    <button className="act-btn" disabled title={`${n} venue bağlı — silmeden önce taşı/kaldır`} style={{ opacity: 0.4, cursor: 'not-allowed' }}><IconTrash /></button>
                  ) : (
                    <RowDelete action={deleteCategory} id={c.id} name={c.name_en} />
                  )}
                </div>
              </div>

              <details className="cmf-edit">
                <summary>Edit</summary>
                <form action={updateCategory} className="cmf-row">
                  <input type="hidden" name="id" value={c.id} />
                  <input name="name_en" className="cmf-input" defaultValue={c.name_en} placeholder="Name" required />
                  <input name="slug" className="cmf-input" defaultValue={c.slug} placeholder="slug" />
                  <input name="icon" className="cmf-input cmf-input--sm" defaultValue={c.icon || ''} placeholder="icon" />
                  <button type="submit" className="btn btn--primary btn--sm">Save</button>
                </form>
              </details>
            </section>
          )
        })}
      </div>
    </Shell>
  )
}
