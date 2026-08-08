import Script from 'next/script'

// Google Analytics 4. Rendered only when NEXT_PUBLIC_GA_ID is set (see GA_ID in
// lib/site.ts), so preview deployments and pre-launch builds send nothing.
// lazyOnload: GA/GTM (~170 KB) loads during browser idle after the page has
// fully loaded, so it never competes with LCP render or hydration. Trade-off:
// analytics for the very first moments is deferred - fine for a content site.
export default function Analytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
      <Script id="ga4-init" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  )
}
