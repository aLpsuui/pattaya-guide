'use client'
import { useEffect, useState } from 'react'
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
const PATTAYA = { lat: 12.9276, lng: 100.8771 } // city centre fallback

type Pos = { lat: number; lng: number }

// When no stored coordinates exist, resolve the venue's maps query to a point
// once (client-side) and recentre the map on it.
function GeocodeCenter({ query, onResolve }: { query: string; onResolve: (p: Pos) => void }) {
  const geocodingLib = useMapsLibrary('geocoding')
  const map = useMap()
  useEffect(() => {
    if (!geocodingLib || !map) return
    const geocoder = new geocodingLib.Geocoder()
    geocoder.geocode({ address: query }, (res, status) => {
      if (status === 'OK' && res && res[0]) {
        const l = res[0].geometry.location
        const p = { lat: l.lat(), lng: l.lng() }
        onResolve(p)
        map.setCenter(p)
        map.setZoom(15)
      }
    })
  }, [geocodingLib, map, query, onResolve])
  return null
}

export default function VenueMap({
  lat, lng, query, label,
}: { lat?: number | null; lng?: number | null; query: string; label: string }) {
  const initial = lat != null && lng != null ? { lat, lng } : null
  const [pos, setPos] = useState<Pos | null>(initial)

  if (!KEY) return null // page falls back to the schematic map when no key is set

  return (
    <APIProvider apiKey={KEY}>
      <Map
        defaultCenter={pos ?? PATTAYA}
        defaultZoom={pos ? 15 : 12}
        gestureHandling="cooperative"
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={true}
        style={{ width: '100%', height: '100%' }}
      >
        {pos && <Marker position={pos} title={label} />}
        {!initial && <GeocodeCenter query={query} onResolve={setPos} />}
      </Map>
    </APIProvider>
  )
}
