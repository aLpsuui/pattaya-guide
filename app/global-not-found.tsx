import './globals.css'
import type { Metadata } from 'next'

// Global 404 for URLs that match no route at all (and aren't redirected into a
// locale by the proxy). Needed because the root layout is a dynamic segment
// (app/[lang]/layout.tsx), so there's no single layout to compose a 404 from.
// Must return a full HTML document and import its own global styles.
// Enabled via experimental.globalNotFound in next.config.
export const metadata: Metadata = {
  title: 'Page not found | Go To Pattaya',
  description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main id="main">
          <section className="page-hero page-hero--dark">
            <div className="container inner" style={{ textAlign: 'center' }}>
              <div className="kicker" style={{ marginTop: 'var(--s3)' }}>404</div>
              <h1>We couldn&apos;t find that page</h1>
              <p className="lead" style={{ margin: '0 auto' }}>
                The link may be broken or the page may have moved.
              </p>
              <div className="row" style={{ justifyContent: 'center', gap: 12, marginTop: 'var(--s4)', flexWrap: 'wrap' }}>
                <a href="/en" className="btn btn-primary">Back home</a>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  )
}
