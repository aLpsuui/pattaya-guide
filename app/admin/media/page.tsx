import { db, STORAGE_BASE } from '@/lib/admin/db'
import Shell from '@/app/admin/_components/Shell'
import MediaUpload from '@/app/admin/_components/MediaUpload'
import { IconChevR, IconImage } from '@/app/admin/_components/icons'

export const dynamic = 'force-dynamic'

const BUCKETS = ['blog', 'assets', 'venues']

async function listBucket(bucket: string) {
  const PAGE = 100
  const out: { bucket: string; name: string; url: string }[] = []
  for (let offset = 0; ; offset += PAGE) {
    const { data } = await db.storage.from(bucket).list('', { limit: PAGE, offset, sortBy: { column: 'created_at', order: 'desc' } })
    const rows = data || []
    out.push(...rows.filter((o) => o.id).map((o) => ({ bucket, name: o.name, url: `${STORAGE_BASE}/${bucket}/${o.name}` })))
    if (rows.length < PAGE) break
  }
  return out
}

export default async function MediaPage() {
  const groups = await Promise.all(BUCKETS.map(listBucket))
  const items = groups.flat()

  return (
    <Shell active="media" crumb={<>Content <IconChevR /> Media</>} title="Media">
      <div className="page-head">
        <div className="ph-l"><h2>Media</h2><p>{items.length} files across {BUCKETS.length} buckets</p></div>
      </div>

      <section className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head"><div><h3>Upload</h3><div className="sub">Files go straight to Supabase storage</div></div></div>
        <MediaUpload buckets={BUCKETS} />
      </section>

      <section className="panel">
        <div className="panel-head"><div><h3>All files</h3><div className="sub">blog · assets · venues buckets</div></div></div>
        <div className="panel-body">
          {items.length === 0 ? (
            <div className="empty"><div className="e-ic"><IconImage /></div><b>No media yet</b><span>Upload an image to get started.</span></div>
          ) : (
            <div className="media-grid">
              {items.map((m) => (
                <a className="media-card" key={`${m.bucket}/${m.name}`} href={m.url} target="_blank" rel="noreferrer">
                  <div className="media-thumb">
                    <img src={m.url} alt={m.name} loading="lazy" />
                    <span className="mtag">{m.bucket}</span>
                  </div>
                  <div className="media-meta"><b>{m.name}</b><span>{m.bucket}</span></div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  )
}
