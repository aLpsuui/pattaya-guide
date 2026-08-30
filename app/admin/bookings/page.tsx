import { db } from '@/lib/admin/db'
import Shell from '@/app/admin/_components/Shell'
import RowDelete from '@/app/admin/_components/RowDelete'
import { deleteBooking, setBookingStatus } from '@/app/admin/_actions/bookings'
import { IconChevR, IconCheck, IconPin } from '@/app/admin/_components/icons'

export const dynamic = 'force-dynamic'

type Item = { name: string; qty: number; price: string }
type Booking = {
  id: string; created_at: string; venue_slug: string | null; venue_name: string | null
  tour: string | null; items: Item[]; preferred_date: string | null; headcount: number | null
  total_baht: number | null; customer_name: string; customer_contact: string
  customer_email: string | null; note: string | null; status: string; locale: string | null
}

const STATUS_PILL: Record<string, string> = {
  new: 'pill--draft', contacted: 'pill--info', confirmed: 'pill--published', cancelled: 'pill--muted',
}
function fmt(d: string) {
  try { return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }
  catch { return d }
}

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ venue?: string }> }) {
  const { venue: venueFilter } = await searchParams

  // Every venue that has bookings — powers the filter + per-venue counts. As more
  // venues enable booking, this keeps the inbox navigable by venue.
  const { data: allRows } = await db.from('bookings').select('venue_slug, venue_name').limit(3000)
  const counts = new Map<string, { name: string; n: number }>()
  for (const r of (allRows || []) as { venue_slug: string | null; venue_name: string | null }[]) {
    if (!r.venue_slug) continue
    const e = counts.get(r.venue_slug) || { name: r.venue_name || r.venue_slug, n: 0 }
    e.n++; counts.set(r.venue_slug, e)
  }
  const venues = [...counts.entries()].map(([slug, e]) => ({ slug, name: e.name, n: e.n })).sort((a, b) => b.n - a.n)

  let query = db
    .from('bookings')
    .select('id,created_at,venue_slug,venue_name,tour,items,preferred_date,headcount,total_baht,customer_name,customer_contact,customer_email,note,status,locale')
    .order('created_at', { ascending: false })
    .limit(300)
  if (venueFilter) query = query.eq('venue_slug', venueFilter)
  const { data, error } = await query
  const rows = (data || []) as Booking[]
  const fresh = rows.filter((r) => r.status === 'new').length
  const needsSetup = !!error && /relation|does not exist|schema cache/i.test(error.message || '')

  return (
    <Shell active="bookings" crumb={<>Overview <IconChevR /> Bookings</>} title="Bookings">
      <div className="page-head">
        <div className="ph-l">
          <h2>Booking requests</h2>
          <p>{rows.length} {venueFilter ? 'for this venue' : 'total'} · <b>{fresh}</b> new{venues.length > 0 && !venueFilter ? ` · ${venues.length} venue${venues.length === 1 ? '' : 's'}` : ''}</p>
        </div>
        {venues.length > 1 && (
          <form className="ph-r" method="get" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select name="venue" defaultValue={venueFilter || ''} style={{ fontSize: 13, padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border, #dbe6ea)', maxWidth: 240 }}>
              <option value="">All venues ({(allRows || []).length})</option>
              {venues.map((v) => <option key={v.slug} value={v.slug}>{v.name} ({v.n})</option>)}
            </select>
            <button className="btn btn--secondary" type="submit" style={{ padding: '7px 14px', fontSize: 13 }}>Filter</button>
          </form>
        )}
      </div>

      {needsSetup ? (
        <section className="panel" style={{ minHeight: '62vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="empty">
          <b>Bookings not set up yet</b>
          <span>Run <code>supabase-bookings.sql</code> in the Supabase SQL editor to create the <code>bookings</code> table.</span>
        </div></section>
      ) : rows.length === 0 ? (
        <section className="panel" style={{ minHeight: '62vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="empty">
          <b>No booking requests{venueFilter ? ' for this venue' : ' yet'}</b>
          <span>Requests from a venue&apos;s booking widget will appear here.</span>
        </div></section>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3, 12px)' }}>
          {rows.map((b) => (
            <section key={b.id} className="panel" style={{ padding: 'var(--s4, 16px)', opacity: b.status === 'cancelled' ? 0.6 : 1 }}>
              {/* Prominent VENUE tag — which venue this booking is for. */}
              <a
                href={b.venue_slug ? `/en/venues/${b.venue_slug}` : undefined}
                target="_blank" rel="noopener"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 999, marginBottom: 10, textDecoration: 'none', fontSize: 12.5, fontWeight: 700, color: 'var(--blue-700, #034487)', background: 'var(--bg-sunken, #eef3f5)', border: '1px solid var(--border, #dbe6ea)' }}
              >
                <IconPin /> {b.venue_name || b.venue_slug || 'Unknown venue'}
              </a>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <b style={{ fontSize: 15 }}>{b.customer_name}</b>
                    <a href={`tel:${b.customer_contact.replace(/[^0-9+]/g, '')}`} className="list-link" style={{ fontSize: 13 }}>{b.customer_contact}</a>
                    {b.customer_email && <a href={`mailto:${b.customer_email}`} className="list-link" style={{ fontSize: 13 }}>{b.customer_email}</a>}
                    <span className={`pill ${STATUS_PILL[b.status] || 'pill--draft'}`}><span className="pdot" />{b.status}</span>
                  </div>
                  {b.tour && <div style={{ marginTop: 6, fontSize: 13.5, color: 'var(--text-muted)' }}>{b.tour}</div>}
                  <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: 'var(--text-body)', fontSize: 13.5 }}>
                    {(b.items || []).map((it, i) => <li key={i}>{it.qty}× {it.name} <span style={{ color: 'var(--text-faint)' }}>({it.price})</span></li>)}
                  </ul>
                  <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
                    {b.preferred_date && <span>📅 {b.preferred_date}</span>}
                    {b.headcount != null && <span>👤 {b.headcount}</span>}
                    {b.total_baht != null && <span><b>฿{b.total_baht.toLocaleString()}</b></span>}
                    {b.locale && <span style={{ color: 'var(--text-faint)' }}>{b.locale.toUpperCase()}</span>}
                  </div>
                  {b.note && <p style={{ marginTop: 8, whiteSpace: 'pre-wrap', color: 'var(--text-muted)', fontSize: 13.5 }}>“{b.note}”</p>}
                  <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-faint)' }}>{fmt(b.created_at)}</div>
                </div>
                <div className="row-act" style={{ flexShrink: 0, alignItems: 'center', gap: 8 }}>
                  <form action={setBookingStatus} style={{ display: 'inline-flex', gap: 4 }}>
                    <input type="hidden" name="id" value={b.id} />
                    <select name="status" defaultValue={b.status} style={{ fontSize: 12.5, padding: '5px 8px', borderRadius: 8, border: '1px solid var(--border, #dbe6ea)' }}>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="act-btn" aria-label="Save status" title="Save status"><IconCheck /></button>
                  </form>
                  <RowDelete action={deleteBooking} id={b.id} name={`booking from ${b.customer_name}`} />
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </Shell>
  )
}
