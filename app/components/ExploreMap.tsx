'use client'
import dynamic from 'next/dynamic'

// Leaflet needs the browser, so load the map only on the client. dict/locale are
// threaded through so the (client-side) map UI can be localized.
const Inner = dynamic(() => import('./ExploreMapInner'), {
  ssr: false,
  loading: () => <div className="exmap-loading">Loading map…</div>,
})

export default function ExploreMap({ dict, locale = 'en' }: { dict?: Record<string, string>; locale?: string } = {}) {
  return <Inner dict={dict} locale={locale} />
}
