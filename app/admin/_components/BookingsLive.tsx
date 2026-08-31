'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// Live admin bookings: soft-refresh the server list on an interval (pulls new
// rows without a manual reload) and alert when the total count rises — an in-page
// toast, a tab-title flash, a soft beep, and (if allowed) a desktop notification.
// No websockets / RLS changes: it re-runs the same server query router.refresh()
// already caches per request.
const INTERVAL_MS = 30000

export default function BookingsLive({ count }: { count: number }) {
  const router = useRouter()
  const seen = useRef(count)
  const [toast, setToast] = useState(0)
  const [beat, setBeat] = useState(false)
  const [notify, setNotify] = useState<'off' | 'on'>('off')

  useEffect(() => {
    try { if (typeof Notification !== 'undefined' && Notification.permission === 'granted') setNotify('on') } catch { /* unsupported */ }
  }, [])

  // React to the server-render count bump after each refresh.
  useEffect(() => {
    if (count <= seen.current) { seen.current = count; return }
    const delta = count - seen.current
    seen.current = count
    setToast(delta)
    try { document.title = `(${delta}) ${document.title.replace(/^\(\d+\)\s*/, '')}` } catch { /* noop */ }
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AC(); const o = ctx.createOscillator(); const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination); o.frequency.value = 880; g.gain.value = 0.05
      o.start(); o.stop(ctx.currentTime + 0.16)
    } catch { /* autoplay blocked */ }
    try {
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(`${delta} new booking${delta > 1 ? 's' : ''}`, { body: 'Go To Pattaya · admin', tag: 'pg-booking' })
      }
    } catch { /* noop */ }
    const tm = setTimeout(() => setToast(0), 9000)
    return () => clearTimeout(tm)
  }, [count])

  // Poll: soft refresh on an interval; pause while the tab is hidden.
  useEffect(() => {
    const tick = () => { if (!document.hidden) { router.refresh(); setBeat((b) => !b) } }
    const id = setInterval(tick, INTERVAL_MS)
    return () => clearInterval(id)
  }, [router])

  const enableAlerts = useCallback(async () => {
    try {
      if (typeof Notification === 'undefined') return
      const p = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission
      setNotify(p === 'granted' ? 'on' : 'off')
    } catch { /* noop */ }
  }, [])

  return (
    <div className="bk-live">
      <span className="bk-live__badge" title={`Auto-refreshing every ${INTERVAL_MS / 1000}s`}>
        <span className={`bk-live__dot${beat ? ' beat' : ''}`} /> Live
      </span>
      <button type="button" className="bk-live__alerts" onClick={enableAlerts} title="Desktop alerts for new bookings">
        {notify === 'on' ? '🔔 Alerts on' : '🔕 Enable alerts'}
      </button>
      {toast > 0 && (
        <div className="bk-toast" role="status" onClick={() => { setToast(0); router.refresh() }}>
          🔔 {toast} new booking{toast > 1 ? 's' : ''} — tap to view
        </div>
      )}
    </div>
  )
}
