import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Go To Pattaya',
  description: 'How Go To Pattaya collects, uses and protects your data.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container inner">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            <span className="cur">Privacy Policy</span>
          </nav>
          <div className="kicker" style={{ marginTop: 'var(--s3)' }}>Legal</div>
          <h1>Privacy Policy</h1>
          <p className="lead">How we handle your information when you use Go To Pattaya.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="prose">
            <p style={{ color: 'var(--ink-400)', fontSize: 14 }}>Last updated: —</p>
            <p><strong>Placeholder — replace with your reviewed legal text.</strong> This page exists so the link resolves and search engines/ad networks can verify a privacy policy is present.</p>
            <h2>What we collect</h2>
            <p>Describe analytics, cookies, newsletter email collection, and any third-party services (e.g. Supabase, Vercel Analytics).</p>
            <h2>How we use it</h2>
            <p>Explain the purposes (site functionality, communication, improvement).</p>
            <h2>Cookies</h2>
            <p>List cookies/local storage used and how to opt out.</p>
            <h2>Your rights</h2>
            <p>GDPR / PDPA (Thailand) rights and how to exercise them.</p>
            <h2>Contact</h2>
            <p>Questions about privacy? <Link className="inline" href="/contact" style={{ color: 'var(--ocean)', fontWeight: 600 }}>Contact us</Link>.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
