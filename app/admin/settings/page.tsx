import { db } from '@/lib/admin/db'
import Shell from '@/app/admin/_components/Shell'
import { IconChevR, IconCheck } from '@/app/admin/_components/icons'
import { saveSettings } from '@/app/admin/_actions/settings'
import LogoField from '@/app/admin/_components/LogoField'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const { data } = await db.from('site_settings').select('logo_url').eq('id', true).maybeSingle()
  const logoUrl = (data?.logo_url as string) || null

  return (
    <Shell active="settings" crumb={<>System <IconChevR /> Settings</>} title="Settings">
      <div className="page-head">
        <div className="ph-l">
          <h2>Site ayarları</h2>
          <p>Sitenin genel görünüm ayarları. Şimdilik logo değiştirme.</p>
        </div>
      </div>

      <section className="panel" style={{ padding: 20, maxWidth: 620 }}>
        <form action={saveSettings} className="dd-form">
          <div className="dd-field">
            <span>Logo</span>
            <LogoField initial={logoUrl} />
          </div>

          <button type="submit" className="btn btn--primary"><IconCheck /> Kaydet</button>
        </form>
      </section>
    </Shell>
  )
}
