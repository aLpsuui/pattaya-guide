import { ImageResponse } from 'next/og'
import { OG_BG, OG_LOGO } from './og-bg-data'

export const alt = 'Go To Pattaya - your complete, honest guide to Pattaya, Thailand'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Branded default social-share card for every route (overridable per page).
// Pattaya bay aerial photo under a brand-blue gradient, new logo lockup + headline.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* full-bleed Pattaya aerial background */}
        <img
          src={OG_BG}
          width={1200}
          height={630}
          alt=""
          style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover' }}
        />

        {/* brand-blue diagonal wash for legibility + colour identity */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: 'flex',
            background:
              'linear-gradient(100deg, rgba(2,32,66,0.94) 0%, rgba(2,58,130,0.66) 44%, rgba(3,96,158,0.22) 80%, rgba(4,120,193,0.08) 100%)',
          }}
        />
        {/* bottom darkening so the footer row stays readable */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: 'flex',
            background: 'linear-gradient(to top, rgba(4,18,36,0.90) 0%, rgba(4,18,36,0) 44%)',
          }}
        />

        {/* content */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: 'flex',
            flexDirection: 'column',
            padding: '52px 64px',
            color: '#ffffff',
          }}
        >
          {/* new white logo lockup, top-left */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={OG_LOGO} width={300} height={82} alt="Go To Pattaya" />
          </div>

          {/* headline + subtitle, vertically centred */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: 120, fontWeight: 800, letterSpacing: -4, lineHeight: 0.92 }}>
              <div style={{ display: 'flex' }}>Go to</div>
              <div style={{ display: 'flex' }}>
                Pattaya<span style={{ color: '#25C3EC' }}>.</span>
              </div>
            </div>
            <div style={{ display: 'flex', fontSize: 28, marginTop: 30, color: 'rgba(255,255,255,0.82)', maxWidth: 640, lineHeight: 1.3 }}>
              The honest local guide - 500+ verified places, real prices, no sponsored rankings.
            </div>
          </div>

          {/* bottom info row */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', width: '100%', height: 1, background: 'rgba(255,255,255,0.22)', marginBottom: 20 }} />
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', fontSize: 23 }}>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>gotopattaya.com</span>
              <span style={{ color: 'rgba(255,255,255,0.72)' }}>Pattaya, Thailand</span>
              <span style={{ color: 'rgba(255,255,255,0.72)' }}>Eat · Do · Stay · Nightlife</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
