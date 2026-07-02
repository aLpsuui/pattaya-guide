import { ImageResponse } from 'next/og'
import { SITE_NAME } from '@/lib/site'

export const alt = 'Go To Pattaya — your complete guide to Pattaya'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Default social share image for every route (overridable per page).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #034487 0%, #0178B4 55%, #2FBDDC 100%)',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 6, textTransform: 'uppercase', opacity: 0.85 }}>
          Honest local guide · Thailand
        </div>
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, marginTop: 16, lineHeight: 1.05 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 36, marginTop: 24, maxWidth: 900, opacity: 0.92 }}>
          600+ verified places · in-depth guides · restaurants, beaches, tours, wellness &amp; nightlife
        </div>
      </div>
    ),
    { ...size },
  )
}
