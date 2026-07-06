import { db } from '@/lib/admin/db'
import Shell from '@/app/admin/_components/Shell'
import { IconChevR, IconCheck } from '@/app/admin/_components/icons'
import { saveDailyDeal } from '@/app/admin/_actions/daily-deal'

export const dynamic = 'force-dynamic'

type Deal = { venue_id: string | null; label: string | null; active: boolean }

export default async function DailyDealPage() {
  const [{ data: deal }, { data: vens }] = await Promise.all([
    db.from('daily_deal').select('venue_id, label, active').eq('id', true).maybeSingle(),
    db.from('venues').select('id, name').order('name', { ascending: true }).limit(2000),
  ])
  const venues = (vens || []) as { id: string; name: string }[]
  const cur = (deal || null) as Deal | null

  return (
    <Shell active="deal" crumb={<>Content <IconChevR /> Daily Deal</>} title="Daily Deal">
      <div className="page-head">
        <div className="ph-l">
          <h2>Günün mekanı</h2>
          <p>Anasayfada günde bir kez çıkan popup - mekanı ve indirimi buradan ayarla.</p>
        </div>
      </div>

      <section className="panel" style={{ padding: 20, maxWidth: 620 }}>
        <form action={saveDailyDeal} className="dd-form">
          <label className="dd-field">
            <span>Mekan</span>
            <select name="venue_id" className="input" defaultValue={cur?.venue_id ?? ''}>
              <option value="">- seç -</option>
              {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </label>

          <label className="dd-field">
            <span>İndirim yazısı</span>
            <input className="input" name="label" defaultValue={cur?.label ?? ''} placeholder="ör. Bugüne özel %20 indirim" />
            <small>Popup'ta rozet olarak görünür. Boş bırakırsan rozet çıkmaz.</small>
          </label>

          <label className="dd-check">
            <input type="checkbox" name="active" defaultChecked={cur?.active ?? false} />
            <span>Popup aktif (yayında)</span>
          </label>

          <button type="submit" className="btn btn--primary"><IconCheck /> Kaydet</button>
        </form>
      </section>
    </Shell>
  )
}
