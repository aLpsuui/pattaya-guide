import { db } from '@/lib/admin/db'
import Shell from '@/app/admin/_components/Shell'
import RowDelete from '@/app/admin/_components/RowDelete'
import { deleteMessage, toggleHandled } from '@/app/admin/_actions/messages'
import { IconChevR, IconMail, IconCheck } from '@/app/admin/_components/icons'

export const dynamic = 'force-dynamic'

type Msg = {
  id: string; name: string; email: string; subject: string | null
  message: string; handled: boolean; created_at: string
}

function fmt(d: string) {
  try { return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
  catch { return d }
}

export default async function MessagesPage() {
  const { data, error } = await db
    .from('contact_messages')
    .select('id,name,email,subject,message,handled,created_at')
    .order('created_at', { ascending: false })
    .limit(300)
  const rows = (data || []) as Msg[]
  const unhandled = rows.filter((r) => !r.handled).length
  // The table may not exist yet (run supabase-contact-table.sql).
  const needsSetup = !!error && /relation|does not exist|schema cache/i.test(error.message || '')

  return (
    <Shell active="messages" crumb={<>Overview <IconChevR /> Messages</>} title="Messages">
      <div className="page-head">
        <div className="ph-l"><h2>Contact messages</h2><p>{rows.length} total · <b>{unhandled}</b> unread</p></div>
      </div>

      {needsSetup ? (
        <section className="panel"><div className="empty">
          <b>Inbox not set up yet</b>
          <span>Run <code>supabase-contact-table.sql</code> in the Supabase SQL editor to create the <code>contact_messages</code> table.</span>
        </div></section>
      ) : rows.length === 0 ? (
        <section className="panel"><div className="empty">
          <IconMail />
          <b>No messages yet</b>
          <span>Submissions from the /contact form will appear here.</span>
        </div></section>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3, 12px)' }}>
          {rows.map((m) => (
            <section key={m.id} className="panel" style={{ padding: 'var(--s4, 16px)', opacity: m.handled ? 0.72 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <b style={{ fontSize: 15 }}>{m.name}</b>
                    <a href={`mailto:${m.email}`} className="list-link" style={{ fontSize: 13 }}>{m.email}</a>
                    {m.handled
                      ? <span className="pill pill--published"><span className="pdot" />Handled</span>
                      : <span className="pill pill--draft"><span className="pdot" />New</span>}
                  </div>
                  {m.subject && <div style={{ fontWeight: 600, marginTop: 6 }}>{m.subject}</div>}
                  <p style={{ marginTop: 6, whiteSpace: 'pre-wrap', color: 'var(--text-body)' }}>{m.message}</p>
                  <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-faint)' }}>{fmt(m.created_at)}</div>
                </div>
                <div className="row-act" style={{ flexShrink: 0 }}>
                  <a className="act-btn" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subject || 'Your message to Go To Pattaya'))}`} aria-label="Reply"><IconMail /></a>
                  <form action={toggleHandled} style={{ display: 'inline' }}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="handled" value={String(m.handled)} />
                    <button className="act-btn" aria-label={m.handled ? 'Mark as new' : 'Mark handled'} title={m.handled ? 'Mark as new' : 'Mark handled'}><IconCheck /></button>
                  </form>
                  <RowDelete action={deleteMessage} id={m.id} name={`message from ${m.name}`} />
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </Shell>
  )
}
