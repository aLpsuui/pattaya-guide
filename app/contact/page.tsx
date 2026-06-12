import Link from 'next/link'

export const metadata = {
  title: 'Contact Us | Go To Pattaya',
  description: 'Get in touch with the Go To Pattaya team — corrections, listings and partnerships.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container inner">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            <span className="cur">Contact</span>
          </nav>
          <div className="kicker" style={{ marginTop: 'var(--s3)' }}>Get in touch</div>
          <h1>Contact us</h1>
          <p className="lead">Spotted something out of date, want your venue listed, or interested in a partnership? We&apos;d love to hear from you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="grid g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 'var(--s4)' }}>
            <div className="feature">
              <h3>General &amp; corrections</h3>
              <p><a href="mailto:hello@gotopattaya.com" style={{ color: 'var(--ocean)', fontWeight: 600 }}>hello@gotopattaya.com</a></p>
            </div>
            <div className="feature">
              <h3>List your business</h3>
              <p><a href="mailto:listings@gotopattaya.com" style={{ color: 'var(--ocean)', fontWeight: 600 }}>listings@gotopattaya.com</a></p>
            </div>
            <div className="feature">
              <h3>Partnerships</h3>
              <p><a href="mailto:partners@gotopattaya.com" style={{ color: 'var(--ocean)', fontWeight: 600 }}>partners@gotopattaya.com</a></p>
            </div>
          </div>
          <p style={{ color: 'var(--ink-400)', fontSize: 13, marginTop: 'var(--s5)' }}>
            Placeholder contact addresses — replace with your real inboxes (or wire a contact form to your backend).
          </p>
        </div>
      </section>
    </div>
  )
}
