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
            <p style={{ color: 'var(--ink-400)', fontSize: 14 }}>Last updated: 24 June 2026</p>
            <p>Go To Pattaya (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates this travel guide. This policy explains what information we collect when you use the site, how we use it, and the choices you have. We keep data collection to the minimum needed to run the service.</p>

            <h2>What we collect</h2>
            <p>We do not require an account to browse. We collect information in three ways:</p>
            <ul>
              <li><strong>Messages you send us.</strong> If you use our contact form, we store the name, email address and message you provide so we can reply and keep a record of the request.</li>
              <li><strong>Usage data.</strong> Like most websites, our hosting and analytics providers automatically receive standard technical data — IP address, browser type, device, pages visited and referring page — used in aggregate to understand traffic and improve the site.</li>
              <li><strong>Cookies and local storage.</strong> Small files used for essential functionality and anonymous analytics (see <em>Cookies</em> below).</li>
            </ul>

            <h2>How we use it</h2>
            <p>We use your information to operate and secure the site, respond to your enquiries and corrections, understand which content is useful, and improve the guide. We do <strong>not</strong> sell your personal data, and we do not use it for third-party advertising profiling.</p>

            <h2>Service providers</h2>
            <p>We rely on a small number of processors who handle data on our behalf under their own security and privacy commitments: <strong>Supabase</strong> (database and storage for site content and contact messages) and <strong>Vercel</strong> (hosting and privacy-friendly analytics). Data may be processed on servers outside Thailand.</p>

            <h2>Cookies</h2>
            <p>We use essential cookies/local storage required for the site to function, and anonymous analytics to measure traffic. You can block or delete cookies in your browser settings; essential functionality may be affected if you do.</p>

            <h2>Data retention</h2>
            <p>Contact messages are kept only as long as needed to handle your request and for a reasonable period afterwards, then deleted. Aggregated analytics are retained in non-identifying form.</p>

            <h2>Your rights</h2>
            <p>Depending on where you live (including under the EU/UK GDPR and Thailand&rsquo;s PDPA), you may have the right to access, correct, or delete the personal data we hold about you, and to object to or restrict certain processing. To exercise any of these, <Link className="inline" href="/contact" style={{ color: 'var(--ocean)', fontWeight: 600 }}>contact us</Link> and we will respond within a reasonable time.</p>

            <h2>Children</h2>
            <p>This site is intended for adults planning travel and is not directed at children under 16. We do not knowingly collect data from children.</p>

            <h2>Changes</h2>
            <p>We may update this policy as the site evolves; material changes will be reflected by the &ldquo;last updated&rdquo; date above.</p>

            <h2>Contact</h2>
            <p>Questions about privacy? <Link className="inline" href="/contact" style={{ color: 'var(--ocean)', fontWeight: 600 }}>Contact us</Link>.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
