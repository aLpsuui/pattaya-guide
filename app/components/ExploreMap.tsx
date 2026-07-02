'use client'
import dynamic from 'next/dynamic'

// Leaflet needs the browser, so load the map only on the client.
const Inner = dynamic(() => import('./ExploreMapInner'), {
  ssr: false,
  loading: () => <div className="exmap-loading">Loading map…</div>,
})

export default function ExploreMap() {
  return <Inner />
}
