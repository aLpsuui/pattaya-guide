import Link from 'next/link'

export const metadata = {
  title: 'Terms of Use | Go To Pattaya',
  description: 'The terms that govern your use of Go To Pattaya.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container inner">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            <span className="cur">Terms of Use</span>
          </nav>
          <div className="kicker" style={{ marginTop: 'var(--s3)' }}>Legal</div>
          <h1>Terms of Use</h1>
          <p className="lead">The rules for using Go To Pattaya.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="prose">
            <p style={{ color: 'var(--ink-400)', fontSize: 14 }}>Last updated: —</p>
            <p><strong>Placeholder — replace with your reviewed legal text.</strong></p>
            <h2>Using this site</h2>
            <p>Acceptable use, accuracy disclaimers (listings, prices and hours may change), and that content is informational.</p>
            <h2>Listings &amp; reviews</h2>
            <p>How rankings work (no pay-to-play), how venues are added/removed, and affiliate/partnership disclosure.</p>
            <h2>Intellectual property</h2>
            <p>Ownership of content, logos and photos; permitted use.</p>
            <h2>Liability</h2>
            <p>Limitation of liability and third-party links disclaimer.</p>
            <h2>Contact</h2>
            <p>Questions? <Link className="inline" href="/contact" style={{ color: 'var(--ocean)', fontWeight: 600 }}>Contact us</Link>.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
