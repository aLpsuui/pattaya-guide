import Script from 'next/script'

// Google Analytics 4. Rendered only when NEXT_PUBLIC_GA_ID is set (see GA_ID in
// lib/site.ts), so preview deployments and pre-launch builds send nothing.
// afterInteractive: loads once the page is interactive, off the critical path.
export default function Analytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  )
}
