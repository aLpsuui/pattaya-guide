import Link from 'next/link'

// 404 for unmatched /en/* and /ru/* routes. Rendered inside the [lang] root
// layout, so it already has <html>, chrome and the <main> wrapper - no <main>
// here (it would nest).
export const metadata = {
  title: 'Page not found | Go To Pattaya',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <section className="page-hero page-hero--dark">
      <div className="container inner" style={{ textAlign: 'center' }}>
        <div className="kicker" style={{ marginTop: 'var(--s3)' }}>404</div>
        <h1>We couldn&apos;t find that page</h1>
        <p className="lead" style={{ margin: '0 auto' }}>
          The link may be broken or the page may have moved. Let&apos;s get you back on track.
        </p>
        <div className="row" style={{ justifyContent: 'center', gap: 12, marginTop: 'var(--s4)', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">Back home</Link>
          <Link href="/blog" className="btn btn-secondary">Read the blog</Link>
          <Link href="/things-to-do" className="btn btn-secondary">Things to do</Link>
        </div>
      </div>
    </section>
  )
}
