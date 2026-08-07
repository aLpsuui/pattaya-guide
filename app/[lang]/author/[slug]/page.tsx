import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from '@/app/components/LocaleLink'
import { supabase } from '@/lib/supabase'
import { SITE_URL } from '@/lib/site'
import { hasLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getTranslated } from '@/lib/i18n/translateContent'
import { localeAlternates, clampDescription, pageTitle, ogDefaultImages } from '@/lib/seo'
import { cardImg } from '@/lib/img'
import { AUTHORS, getAuthorBySlug, authorPersonId, type Author } from '@/lib/authors'

export const revalidate = 3600

// One static page per known author (both locales handled by the [lang] segment;
// only English is pre-rendered here, Russian generates on demand like the rest).
export function generateStaticParams() {
  return AUTHORS.map((a) => ({ lang: 'en', slug: a.slug }))
}

interface PostRow {
  id: string
  slug: string
  title: string
  description: string | null
  category: string | null
  hero_image: string | null
  published_at: string | null
}

async function getPosts(name: string): Promise<PostRow[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, description, category, hero_image, published_at')
    .eq('is_published', true)
    .eq('author', name)
    .order('published_at', { ascending: false })
  return (data as PostRow[]) || []
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) return { title: 'Not Found', robots: { index: false } }
  const locale = hasLocale(lang) ? lang : 'en'
  const dict = await getDictionary(locale)
  const t = (s: string) => dict?.[s] ?? s
  const title = pageTitle(`${author.name} - ${t(author.jobTitle)}`)
  const description = clampDescription(t(author.bio))
  return {
    title,
    description,
    alternates: localeAlternates(locale, `/author/${author.slug}`),
    openGraph: { type: 'profile', title, description, url: `${SITE_URL}/${locale}/author/${author.slug}`, images: ogDefaultImages },
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const author: Author | undefined = getAuthorBySlug(slug)
  if (!author) notFound()
  const locale = hasLocale(lang) ? lang : 'en'
  const [dict, posts] = await Promise.all([getDictionary(locale), getPosts(author.name)])
  const t = (s: string) => dict?.[s] ?? s

  // Article titles are translated (matches how they render everywhere else).
  const titles = await Promise.all(
    posts.map((p) => getTranslated('blog_posts', p.id, 'title', p.title, locale)),
  )

  const pageUrl = `${SITE_URL}/${locale}/author/${author.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${pageUrl}#profilepage`,
        url: pageUrl,
        name: `${author.name} - ${t(author.jobTitle)}`,
        inLanguage: locale,
        mainEntity: { '@id': authorPersonId(author) },
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@type': 'Person',
        '@id': authorPersonId(author),
        name: author.name,
        url: pageUrl,
        jobTitle: author.jobTitle,
        description: t(author.bio),
        worksFor: { '@id': `${SITE_URL}/#organization` },
        knowsAbout: author.knowsAbout,
        sameAs: author.sameAs,
        mainEntityOfPage: { '@id': `${pageUrl}#profilepage` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('Home'), item: `${SITE_URL}/${locale}` },
          { '@type': 'ListItem', position: 2, name: author.name, item: pageUrl },
        ],
      },
    ],
  }

  return (
    <div className="about-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO / PROFILE */}
      <section className="page-hero">
        <div className="container inner">
          <nav className="crumb" aria-label={t('Breadcrumb')}>
            <Link href="/">{t('Home')}</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            <span className="cur">{author.name}</span>
          </nav>
          <div className="author" style={{ marginTop: 'var(--s4)', alignItems: 'center' }}>
            <div className="ava" style={{ width: 64, height: 64, fontSize: '1.4rem' }}>{initials(author.name)}</div>
            <div className="who">
              <h1 style={{ margin: 0 }}>{author.name}</h1>
              <span className="role">{t(author.jobTitle)} · {t('Go To Pattaya')}</span>
            </div>
          </div>
          <p className="lead" style={{ marginTop: 'var(--s4)' }}>{t(author.bio)}</p>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">{t('The editors')}</div>
              <h2>{t('Articles by')} {author.name}</h2>
            </div>
          </div>
          {posts.length > 0 ? (
            <div className="grid g3">
              {posts.map((p, i) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="feature" style={{ display: 'block', overflow: 'hidden', padding: 0 }}>
                  {p.hero_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cardImg(p.hero_image) || p.hero_image} alt={titles[i]} loading="lazy" width={560} height={320}
                      style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                  )}
                  <div style={{ padding: 'var(--s4)' }}>
                    {p.category && <div className="kicker">{t(p.category)}</div>}
                    <h3 style={{ marginTop: 'var(--s2)' }}>{titles[i]}</h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>{t('No articles yet.')}</p>
          )}
        </div>
      </section>
    </div>
  )
}
