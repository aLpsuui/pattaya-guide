import { db } from '@/lib/admin/db'
import Shell from '@/app/admin/_components/Shell'
import { deleteBooking, setBookingStatus } from '@/app/admin/_actions/bookings'
import RowDelete from '@/app/admin/_components/RowDelete'
import { IconChevR, IconCheck } from '@/app/admin/_components/icons'

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
const fmtDate = (d: string | null) => {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) } catch { return d }
}
const fmtWhen = (d: string) => {
  try { return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) } catch { return d }
}

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ venue?: string }> }) {
  const { venue: venueFilter } = await searchParams

  // Every venue with bookings — powers the filter + counts (scales as more venues opt in).
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
    .limit(500)
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
          <p>{rows.length} {venueFilter ? 'for this venue' : 'total'} · <b>{fresh}</b> new{!venueFilter && venues.length > 0 ? ` · ${venues.length} venue${venues.length === 1 ? '' : 's'}` : ''}</p>
        </div>
        {venues.length > 1 && (
          <form className="ph-r" method="get" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select name="venue" defaultValue={venueFilter || ''} style={{ fontSize: 13, padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-body)', maxWidth: 240 }}>
              <option value="">All venues ({(allRows || []).length})</option>
              {venues.map((v) => <option key={v.slug} value={v.slug}>{v.name} ({v.n})</option>)}
            </select>
            <button className="btn btn--secondary" type="submit" style={{ padding: '7px 14px', fontSize: 13 }}>Filter</button>
          </form>
        )}
      </div>

      {needsSetup ? (
        <section className="panel" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="empty">
          <b>Bookings not set up yet</b>
          <span>Run <code>supabase-bookings.sql</code> in the Supabase SQL editor to create the <code>bookings</code> table.</span>
        </div></section>
      ) : rows.length === 0 ? (
        <section className="panel" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="empty">
          <b>No booking requests{venueFilter ? ' for this venue' : ' yet'}</b>
          <span>Requests from a venue&apos;s booking widget will appear here.</span>
        </div></section>
      ) : (
        <section className="panel bk-tablewrap">
          <table className="bk-table">
            <thead>
              <tr>
                <th>Venue</th><th>Customer</th><th>Package</th><th>Date</th><th className="num">Total</th><th>Status</th><th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className={b.status === 'cancelled' ? 'is-cancelled' : b.status === 'new' ? 'is-new' : ''}>
                  <td>
                    {b.venue_slug
                      ? <a className="bk-venue" href={`/en/venues/${b.venue_slug}`} target="_blank" rel="noopener">{b.venue_name || b.venue_slug}</a>
                      : <span className="bk-venue">{b.venue_name || '—'}</span>}
                  </td>
                  <td>
                    <div className="bk-cust">{b.customer_name}</div>
                    <a className="bk-sub" href={`tel:${b.customer_contact.replace(/[^0-9+]/g, '')}`}>{b.customer_contact}</a>
                    {b.customer_email && <><br /><a className="bk-sub" href={`mailto:${b.customer_email}`}>{b.customer_email}</a></>}
                    {b.note && <div className="bk-note" title={b.note}>“{b.note}”</div>}
                  </td>
                  <td>
                    {b.tour && <div className="bk-tour">{b.tour}</div>}
                    <div className="bk-items">
                      {(b.items || []).map((it, i) => (
                        <span key={i} className="bk-chip">{it.qty}× {it.name}</span>
                      ))}
                    </div>
                  </td>
                  <td className="bk-nowrap">
                    {fmtDate(b.preferred_date)}
                    {b.headcount != null && <div className="bk-sub">👤 {b.headcount}</div>}
                  </td>
                  <td className="num bk-total">{b.total_baht != null ? `฿${b.total_baht.toLocaleString()}` : '—'}</td>
                  <td>
                    <span className={`pill ${STATUS_PILL[b.status] || 'pill--draft'}`}><span className="pdot" />{b.status}</span>
                    <form action={setBookingStatus} className="bk-statusform">
                      <input type="hidden" name="id" value={b.id} />
                      <select name="status" defaultValue={b.status}>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button className="act-btn" aria-label="Save status" title="Save status"><IconCheck /></button>
                    </form>
                    <div className="bk-when">{fmtWhen(b.created_at)}</div>
                  </td>
                  <td><RowDelete action={deleteBooking} id={b.id} name={`booking from ${b.customer_name}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </Shell>
  )
}
