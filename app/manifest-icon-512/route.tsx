import { ImageResponse } from 'next/og'

// Branded 512×512 PWA icon (referenced from manifest.webmanifest). Also serves
// as the maskable icon for Android install / splash screens.
export const runtime = 'nodejs'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #034487 0%, #0178B4 55%, #2FBDDC 100%)',
        }}
      >
        <svg width="312" height="312" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-5.4-7-11a7 7 0 0 1 14 0c0 5.6-7 11-7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      </div>
    ),
    { width: 512, height: 512 },
  )
}
