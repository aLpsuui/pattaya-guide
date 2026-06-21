'use client'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { supabase } from '@/lib/supabase'
import { AREAS, areaCenterFor } from '@/lib/areas'

const PATTAYA: [number, number] = [12.9276, 100.8771]

interface VenuePin {
  slug: string; name: string; lat: number; lng: number
  type: string | null; price_from: number | null; neighborhood: string | null
}

type Filter = 'all' | 'venues' | 'areas'

// Per-area colours — match the /areas page legend dots.
const AREA_COLORS: Record<string, string> = {
  'Central Pattaya': '#0178B4',
  'Jomtien': '#1ba672',
  'Naklua': '#e8a33d',
  'Pratumnak Hill': '#2FBDDC',
  'Wong Amat': '#054C86',
  'Walking Street': '#ef4d63',
  'Islands': '#13a39a',
}
const areaColor = (name: string) => AREA_COLORS[name] ?? '#e0911a'
const VENUE_COLOR = '#16a06a'

const colorIcon = (color: string) =>
  L.divIcon({ className: '', html: `<span class="exm-pin" style="background:${color}"></span>`, iconSize: [22, 22], iconAnchor: [11, 11] })
const VENUE_ICON = colorIcon(VENUE_COLOR)

// Fly the map when the user clicks a list row.
function Flyer({ target }: { target: { lat: number; lng: number; zoom: number } | null }) {
  const map = useMap()
  useEffect(() => { if (target) map.flyTo([target.lat, target.lng], target.zoom, { duration: 0.6 }) }, [target, map])
  return null
}

export default function ExploreMapInner() {
  const [venues, setVenues] = useState<VenuePin[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [focus, setFocus] = useState<{ lat: number; lng: number; zoom: number } | null>(null)

  useEffect(() => {
    let on = true
    ;(async () => {
      const { data } = await supabase
        .from('venues')
        .select('slug, name, latitude, longitude, venue_type, price_from, neighborhood')
        .eq('is_active', true)
      if (!on) return
      const rows = (data as unknown as { slug: string; name: string; latitude: number | null; longitude: number | null; venue_type: string | null; price_from: number | null; neighborhood: string | null }[]) || []
      setVenues(rows.map(r => {
        const c = r.latitude != null && r.longitude != null ? { lat: r.latitude, lng: r.longitude } : areaCenterFor(r.neighborhood)
        return { slug: r.slug, name: r.name, lat: c.lat, lng: c.lng, type: r.venue_type, price_from: r.price_from, neighborhood: r.neighborhood }
      }))
    })()
    return () => { on = false }
  }, [])

  const showVenues = filter === 'all' || filter === 'venues'
  const showAreas = filter === 'all' || filter === 'areas'

  const list = useMemo(() => {
    const items: { key: string; kind: 'area' | 'ven'; name: string; meta: string; vibes?: string[]; lat: number; lng: number; href?: string }[] = []
    if (showAreas) for (const a of AREAS) items.push({ key: 'a' + a.name, kind: 'area', name: a.name, meta: 'Area', vibes: a.vibes, lat: a.lat, lng: a.lng, href: `/areas/${a.slug}` })
    if (showVenues) for (const v of venues) items.push({ key: 'v' + v.slug, kind: 'ven', name: v.name, meta: v.type ?? 'Place', lat: v.lat, lng: v.lng, href: `/venues/${v.slug}` })
    return items
  }, [showAreas, showVenues, venues])

  const vibeSlug = (v: string) => v.toLowerCase().replace(/[^a-z]/g, '')

  return (
    <div className="exmap">
      <div className="exmap-bar">
        <button className={`exm-chip${filter === 'all' ? ' on' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`exm-chip exm-chip--area${filter === 'areas' ? ' on' : ''}`} onClick={() => setFilter('areas')}>Areas <span className="ct">{AREAS.length}</span></button>
        <button className={`exm-chip exm-chip--ven${filter === 'venues' ? ' on' : ''}`} onClick={() => setFilter('venues')}>Venues <span className="ct">{venues.length}</span></button>
      </div>

      <div className="exmap-body">
        <div className="exmap-canvas">
          <MapContainer center={PATTAYA} zoom={13} scrollWheelZoom style={{ width: '100%', height: '100%' }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <Flyer target={focus} />
            {showAreas && AREAS.map(a => (
              <Marker key={'am' + a.name} position={[a.lat, a.lng]} icon={colorIcon(areaColor(a.name))}>
                <Popup><b>{a.name}</b><br /><a href={`/areas/${a.slug}`}>Explore area →</a></Popup>
              </Marker>
            ))}
            {showVenues && venues.map(v => (
              <Marker key={'vm' + v.slug} position={[v.lat, v.lng]} icon={VENUE_ICON}>
                <Popup>
                  <b>{v.name}</b><br />
                  <span style={{ color: '#5b6b7c' }}>{v.type}{v.neighborhood ? ` · ${v.neighborhood}` : ''}</span><br />
                  {v.price_from != null && <span>from ฿{v.price_from.toLocaleString()}<br /></span>}
                  <a href={`/venues/${v.slug}`}>View details →</a>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <aside className="exmap-list">
          <div className="exmap-list-head">Showing <b>{list.length}</b> {filter === 'areas' ? 'areas' : filter === 'venues' ? 'places' : 'results'}</div>
          <div className="exmap-list-scroll">
            {list.map(it => (
              <div key={it.key} className="exm-row" onClick={() => setFocus({ lat: it.lat, lng: it.lng, zoom: it.kind === 'area' ? 14 : 16 })}>
                <span className="exm-dot" style={{ background: it.kind === 'area' ? areaColor(it.name) : VENUE_COLOR }} />
                <div className="exm-row-main">
                  {it.href ? <a href={it.href} onClick={e => e.stopPropagation()}><b>{it.name}</b></a> : <b>{it.name}</b>}
                  {it.kind === 'area' && it.vibes?.length ? (
                    <div className="exm-vibes">
                      {it.vibes.map(v => <span key={v} className={`exm-vibe exm-vibe--${vibeSlug(v)}`}>{v}</span>)}
                    </div>
                  ) : (
                    <span>{it.meta}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
