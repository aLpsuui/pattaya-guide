import { ImageResponse } from 'next/og'

export const alt = 'Go To Pattaya - your complete, honest guide to Pattaya, Thailand'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Branded default social-share card for every route (overridable per page).
// Minimal dark editorial style. Pure vector so it renders reliably in Satori.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: '#0a1622',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: '54px 64px',
        }}
      >
        {/* soft glow behind the brand mark */}
        <div style={{ position: 'absolute', display: 'flex', top: 40, right: 30, width: 520, height: 520, borderRadius: 520, background: 'radial-gradient(circle, rgba(47,189,220,0.20) 0%, rgba(10,22,34,0) 70%)' }} />

        {/* brand mark on the right (echoes the reference photo position) */}
        <svg width="360" height="392" viewBox="0 0 220 240" style={{ position: 'absolute', right: 62, top: 128, opacity: 0.92 }}>
          <path fill="#ffffff" d="M110 8C56 8 14 49 14 102c0 70 78 122 92 128 3 1 5 1 8 0 14-6 92-58 92-128C206 49 164 8 110 8Z" />
          <circle cx="110" cy="98" r="74" fill="#0a1622" />
          <circle cx="110" cy="80" r="20" fill="#2FBDDC" />
          <path fill="#EAF6FB" d="M44 120c14-10 24-10 38 0s24 10 38 0 24-10 38 0 24 10 38 0v22c-14 10-24 10-38 0s-24-10-38 0-24 10-38 0-24-10-38 0Z" />
        </svg>

        {/* top-center wordmark */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', fontSize: 30, fontWeight: 700, letterSpacing: -0.3 }}>
          <span style={{ color: '#ffffff' }}>Go To</span>
          <span style={{ color: '#2FBDDC', marginLeft: 10 }}>Pattaya</span>
        </div>

        {/* giant headline, vertically centred, stacked so it clears the mark */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 122, fontWeight: 800, letterSpacing: -4, lineHeight: 0.92 }}>
            <div style={{ display: 'flex' }}>Go to</div>
            <div style={{ display: 'flex' }}>Pattaya<span style={{ color: '#2FBDDC' }}>.</span></div>
          </div>
          <div style={{ display: 'flex', fontSize: 29, marginTop: 32, color: 'rgba(255,255,255,0.62)', maxWidth: 600 }}>
            The honest local guide - 500+ verified places, real prices, no sponsored rankings.
          </div>
        </div>

        {/* bottom info row with divider */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: '100%', height: 1, background: 'rgba(255,255,255,0.14)', marginBottom: 22 }} />
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', fontSize: 24 }}>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>gotopattaya.com</span>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>Pattaya, Thailand</span>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>Eat · Do · Stay · Nightlife</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
