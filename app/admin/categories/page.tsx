import { db } from '@/lib/admin/db'
import Link from 'next/link'
import Shell from '@/app/admin/_components/Shell'
import RowDelete from '@/app/admin/_components/RowDelete'
import { IconChevR, IconPlus, IconTrash, IconTree, IconCheck } from '@/app/admin/_components/icons'
import { createCategory, updateCategory, deleteCategory } from '@/app/admin/_actions/categories'

export const dynamic = 'force-dynamic'

type Cat = { id: string; name_en: string; slug: string; icon: string | null }

export default async function CategoriesPage() {
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
      crumb={<>Content <IconChevR /> Categories</>}
      title="Categories"
      actions={<Link href="/admin/categories/diagram" className="btn btn--ghost btn--sm"><IconTree /> View diagram</Link>}
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

      {/* list — editable table */}
      <section className="panel" style={{ overflowX: 'auto' }}>
        <table className="data cmf-table">
          <thead>
            <tr><th>Name</th><th>Slug</th><th style={{ textAlign: 'right' }}>Venues</th><th>Icon</th><th aria-label="Actions"></th></tr>
          </thead>
          <tbody>
            {categories.map((c) => {
              const n = count(c.id)
              const fid = `catf-${c.id}`
              return (
                <tr key={c.id}>
                  <td><input className="cmf-cell" name="name_en" defaultValue={c.name_en} form={fid} required aria-label="Name" /></td>
                  <td><input className="cmf-cell cmf-cell--mono" name="slug" defaultValue={c.slug} form={fid} aria-label="Slug" /></td>
                  <td className="cmf-num">{n}</td>
                  <td><input className="cmf-cell cmf-cell--sm" name="icon" defaultValue={c.icon || ''} form={fid} placeholder="—" aria-label="Icon" /></td>
                  <td className="row-act" style={{ whiteSpace: 'nowrap' }}>
                    <button type="submit" form={fid} className="act-btn" title="Save changes" aria-label="Save"><IconCheck /></button>
                    {n > 0 ? (
                      <button className="act-btn" disabled title={`${n} venue bağlı — silmeden önce taşı/kaldır`} style={{ opacity: 0.4, cursor: 'not-allowed' }}><IconTrash /></button>
                    ) : (
                      <RowDelete action={deleteCategory} id={c.id} name={c.name_en} />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {/* hidden update forms — cells reference these via the form="" attribute */}
        {categories.map((c) => (
          <form key={'f' + c.id} id={`catf-${c.id}`} action={updateCategory} hidden><input type="hidden" name="id" value={c.id} /></form>
        ))}
      </section>
    </Shell>
  )
}
