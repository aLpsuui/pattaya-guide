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
            <p style={{ color: 'var(--ink-400)', fontSize: 14 }}>Last updated: 24 June 2026</p>
            <p>By using Go To Pattaya you agree to these terms. If you do not agree, please do not use the site. These terms may change over time; continued use after an update means you accept the revised terms.</p>

            <h2>Using this site</h2>
            <p>Go To Pattaya is an independent travel guide provided for general information only. We work hard to keep details accurate, but <strong>listings, prices, opening hours and availability change frequently and may be out of date</strong> — always confirm directly with a venue or operator before relying on anything here. You agree to use the site lawfully and not to disrupt it, scrape it at scale, or misuse its content.</p>

            <h2>Listings &amp; reviews</h2>
            <p>Our rankings and recommendations are editorial. <strong>We do not accept payment for a higher position</strong> — paying for a listing never moves a venue up the order. We add, update and remove venues at our discretion based on our own research and reader feedback. Where a link is an affiliate or a partnership is in place, we aim to disclose it; such arrangements do not change our editorial judgement.</p>

            <h2>Intellectual property</h2>
            <p>The site&rsquo;s text, design, logo and original photography are owned by Go To Pattaya or used under licence, and are protected by applicable law. You may share links and brief quotations with attribution, but you may not republish, copy or use our content commercially without written permission. Third-party trademarks and images remain the property of their owners.</p>

            <h2>Liability</h2>
            <p>The site is provided &ldquo;as is&rdquo; without warranties of any kind. To the fullest extent permitted by law, we are not liable for any loss or damage arising from your use of the site or reliance on its content, or from third-party websites we link to (which we do not control or endorse).</p>

            <h2>Governing law</h2>
            <p>These terms are governed by the laws of Thailand, without regard to conflict-of-law rules.</p>

            <h2>Contact</h2>
            <p>Questions? <Link className="inline" href="/contact" style={{ color: 'var(--ocean)', fontWeight: 600 }}>Contact us</Link>.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
