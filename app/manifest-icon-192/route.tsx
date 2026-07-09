import { ImageResponse } from 'next/og'

// Branded 192×192 PWA icon (referenced from manifest.webmanifest). Fixes the
// "Add to Home Screen" showing only the tiny favicon.
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
        <svg width="118" height="118" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-5.4-7-11a7 7 0 0 1 14 0c0 5.6-7 11-7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      </div>
    ),
    { width: 192, height: 192 },
  )
}
