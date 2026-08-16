import 'server-only'
import { createHash } from 'node:crypto'
import { z } from 'zod'
import { defineFactory } from '@autonoma-ai/sdk'
import { db } from '@/lib/admin/db'

// ---------------------------------------------------------------------------
// Autonoma Environment Factory — factories for the Pattaya City Guide.
//
// Each factory creates ONE row through the same data-layer path the app itself
// uses (the service-role `db` client from lib/admin/db). Where the app has a
// reusable creation function we mirror its exact insert shape and derived
// fields; where a model is only ever written by a SQL seed / inline insert we
// copy that insert here (minus the request/auth/file-upload side effects).
//
// Foreign keys arrive already resolved (the SDK replaces every `_ref` with the
// real parent id before calling `create`). Teardown deletes by primary key in
// reverse dependency order — there is no tenant scope in this single-tenant
// content site, so we delete per record.
// ---------------------------------------------------------------------------

function fail(model: string, error: { message: string } | null): never {
  throw new Error(`autonoma factory ${model}: ${error?.message ?? 'unknown error'}`)
}

// --- categories -----------------------------------------------------------
// Mirrors createCategory (app/admin/_actions/categories.ts): inserts name_en,
// slug, icon. A caller-supplied slug is used as-is (already tokenized per run).
const categories = defineFactory({
  inputSchema: z.object({
    name_en: z.string(),
    slug: z.string(),
    icon: z.string().nullable().optional(),
  }),
  refSchema: z.object({ id: z.string() }),
  create: async (data) => {
    const { data: row, error } = await db
      .from('categories')
      .insert({ name_en: data.name_en, slug: data.slug, icon: data.icon ?? null })
      .select('id')
      .single()
    if (error || !row) fail('categories', error)
    return { id: row!.id as string }
  },
  teardown: async (record) => {
    await db.from('categories').delete().eq('id', record.id)
  },
})

// --- venues ---------------------------------------------------------------
// Mirrors savePlace (app/admin/_actions/places.ts): derives is_active from
// status (published & not hidden), keeps the same column set, plus the extra
// curated columns the venue detail page reads (rating, review_count,
// venue_type, locally_verified, about[]). slug is tokenized per run.
const venues = defineFactory({
  inputSchema: z.object({
    category_id: z.string(),
    name: z.string(),
    slug: z.string(),
    venue_type: z.string().nullable().optional(),
    price_range: z.string().nullable().optional(),
    rating: z.number().nullable().optional(),
    review_count: z.number().int().nullable().optional(),
    tagline: z.string().nullable().optional(),
    neighborhood: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    locally_verified: z.boolean().optional(),
    image_url: z.string().nullable().optional(),
    about: z.array(z.string()).nullable().optional(),
    description: z.string().nullable().optional(),
    status: z.string().optional(),
  }),
  refSchema: z.object({ id: z.string(), slug: z.string() }),
  create: async (data) => {
    const status = data.status ?? 'published'
    const isActive = status === 'published'
    const row: Record<string, unknown> = {
      category_id: data.category_id,
      name: data.name,
      slug: data.slug,
      venue_type: data.venue_type ?? null,
      price_range: data.price_range ?? null,
      rating: data.rating ?? null,
      review_count: data.review_count ?? null,
      tagline: data.tagline ?? null,
      neighborhood: data.neighborhood ?? null,
      address: data.address ?? null,
      locally_verified: data.locally_verified ?? false,
      about: data.about ?? null,
      description: data.description ?? null,
      status,
      is_active: isActive,
    }
    if (data.image_url) row.image_url = data.image_url
    const { data: v, error } = await db.from('venues').insert(row).select('id, slug').single()
    if (error || !v) fail('venues', error)
    return { id: v!.id as string, slug: v!.slug as string }
  },
  teardown: async (record) => {
    // ON DELETE CASCADE removes any child rows still present.
    await db.from('venues').delete().eq('id', record.id)
  },
})

// --- venue_photos ---------------------------------------------------------
// Mirrors the insert inside addVenuePhotos (places.ts). The recipe supplies the
// final storage URL, so the file-upload side effect is dropped.
const venue_photos = defineFactory({
  inputSchema: z.object({
    venue_id: z.string(),
    url: z.string(),
    alt: z.string().nullable().optional(),
    caption: z.string().nullable().optional(),
    sort_order: z.number().int().optional(),
  }),
  refSchema: z.object({ id: z.string() }),
  create: async (data) => {
    const { data: row, error } = await db
      .from('venue_photos')
      .insert({
        venue_id: data.venue_id,
        url: data.url,
        alt: data.alt ?? null,
        caption: data.caption ?? null,
        sort_order: data.sort_order ?? 0,
      })
      .select('id')
      .single()
    if (error || !row) fail('venue_photos', error)
    return { id: row!.id as string }
  },
  teardown: async (record) => {
    await db.from('venue_photos').delete().eq('id', record.id)
  },
})

// --- venue_menu_items -----------------------------------------------------
// No reusable creation function; copied from the SQL seed insert shape
// (supabase/seed/rinn-spa-massage.sql).
const venue_menu_items = defineFactory({
  inputSchema: z.object({
    venue_id: z.string(),
    section: z.string().nullable().optional(),
    name: z.string(),
    detail: z.string().nullable().optional(),
    duration: z.string().nullable().optional(),
    price: z.string().nullable().optional(),
    is_featured: z.boolean().optional(),
    sort_order: z.number().int().optional(),
  }),
  refSchema: z.object({ id: z.string() }),
  create: async (data) => {
    const { data: row, error } = await db
      .from('venue_menu_items')
      .insert({
        venue_id: data.venue_id,
        section: data.section ?? null,
        name: data.name,
        detail: data.detail ?? null,
        duration: data.duration ?? null,
        price: data.price ?? null,
        is_featured: data.is_featured ?? false,
        sort_order: data.sort_order ?? 0,
      })
      .select('id')
      .single()
    if (error || !row) fail('venue_menu_items', error)
    return { id: row!.id as string }
  },
  teardown: async (record) => {
    await db.from('venue_menu_items').delete().eq('id', record.id)
  },
})

// --- venue_facilities -----------------------------------------------------
const venue_facilities = defineFactory({
  inputSchema: z.object({
    venue_id: z.string(),
    icon: z.string().optional(),
    label: z.string(),
    sort_order: z.number().int().optional(),
  }),
  refSchema: z.object({ id: z.string() }),
  create: async (data) => {
    const { data: row, error } = await db
      .from('venue_facilities')
      .insert({
        venue_id: data.venue_id,
        icon: data.icon ?? 'pg-check',
        label: data.label,
        sort_order: data.sort_order ?? 0,
      })
      .select('id')
      .single()
    if (error || !row) fail('venue_facilities', error)
    return { id: row!.id as string }
  },
  teardown: async (record) => {
    await db.from('venue_facilities').delete().eq('id', record.id)
  },
})

// --- venue_quick_facts ----------------------------------------------------
const venue_quick_facts = defineFactory({
  inputSchema: z.object({
    venue_id: z.string(),
    icon: z.string().optional(),
    value: z.string(),
    label: z.string(),
    sort_order: z.number().int().optional(),
  }),
  refSchema: z.object({ id: z.string() }),
  create: async (data) => {
    const { data: row, error } = await db
      .from('venue_quick_facts')
      .insert({
        venue_id: data.venue_id,
        icon: data.icon ?? 'pg-info',
        value: data.value,
        label: data.label,
        sort_order: data.sort_order ?? 0,
      })
      .select('id')
      .single()
    if (error || !row) fail('venue_quick_facts', error)
    return { id: row!.id as string }
  },
  teardown: async (record) => {
    await db.from('venue_quick_facts').delete().eq('id', record.id)
  },
})

// --- venue_treatment_tags -------------------------------------------------
const venue_treatment_tags = defineFactory({
  inputSchema: z.object({
    venue_id: z.string(),
    label: z.string(),
    color: z.string().optional(),
    sort_order: z.number().int().optional(),
  }),
  refSchema: z.object({ id: z.string() }),
  create: async (data) => {
    const { data: row, error } = await db
      .from('venue_treatment_tags')
      .insert({
        venue_id: data.venue_id,
        label: data.label,
        color: data.color ?? 'blue',
        sort_order: data.sort_order ?? 0,
      })
      .select('id')
      .single()
    if (error || !row) fail('venue_treatment_tags', error)
    return { id: row!.id as string }
  },
  teardown: async (record) => {
    await db.from('venue_treatment_tags').delete().eq('id', record.id)
  },
})

// --- venue_highlights -----------------------------------------------------
const venue_highlights = defineFactory({
  inputSchema: z.object({
    venue_id: z.string(),
    label: z.string(),
    sort_order: z.number().int().optional(),
  }),
  refSchema: z.object({ id: z.string() }),
  create: async (data) => {
    const { data: row, error } = await db
      .from('venue_highlights')
      .insert({ venue_id: data.venue_id, label: data.label, sort_order: data.sort_order ?? 0 })
      .select('id')
      .single()
    if (error || !row) fail('venue_highlights', error)
    return { id: row!.id as string }
  },
  teardown: async (record) => {
    await db.from('venue_highlights').delete().eq('id', record.id)
  },
})

// --- venue_faqs -----------------------------------------------------------
const venue_faqs = defineFactory({
  inputSchema: z.object({
    venue_id: z.string(),
    question: z.string(),
    answer: z.string(),
    sort_order: z.number().int().optional(),
  }),
  refSchema: z.object({ id: z.string() }),
  create: async (data) => {
    const { data: row, error } = await db
      .from('venue_faqs')
      .insert({
        venue_id: data.venue_id,
        question: data.question,
        answer: data.answer,
        sort_order: data.sort_order ?? 0,
      })
      .select('id')
      .single()
    if (error || !row) fail('venue_faqs', error)
    return { id: row!.id as string }
  },
  teardown: async (record) => {
    await db.from('venue_faqs').delete().eq('id', record.id)
  },
})

// --- blog_posts -----------------------------------------------------------
// Mirrors saveBlog (app/admin/_actions/blog.ts): is_published derived from
// status; published_at set only when published. published_at is derived from an
// OFFSET (publishedMinutesAgo) at seed time so published posts stay recent and
// correctly ordered on the blog list / homepage (which order by published_at
// desc). slug is tokenized per run.
const blog_posts = defineFactory({
  inputSchema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    author: z.string().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    hero_image: z.string().nullable().optional(),
    status: z.string().optional(),
    publishedMinutesAgo: z.number().optional(),
  }),
  refSchema: z.object({ id: z.string(), slug: z.string() }),
  create: async (data) => {
    const status = data.status ?? 'draft'
    const isPublished = status === 'published'
    const row: Record<string, unknown> = {
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      page_html: data.content ?? null,
      category: data.category ?? null,
      author: data.author ?? null,
      tags: data.tags ?? null,
      noindex: false,
      status,
      is_published: isPublished,
    }
    if (data.hero_image) row.hero_image = data.hero_image
    if (isPublished) {
      const mins = data.publishedMinutesAgo ?? 0
      row.published_at = new Date(Date.now() - mins * 60_000).toISOString()
    }
    const { data: b, error } = await db.from('blog_posts').insert(row).select('id, slug').single()
    if (error || !b) fail('blog_posts', error)
    return { id: b!.id as string, slug: b!.slug as string }
  },
  teardown: async (record) => {
    await db.from('blog_posts').delete().eq('id', record.id)
  },
})

// --- contact_messages -----------------------------------------------------
// Mirrors the insert inside submitContact (app/[lang]/contact/actions.ts).
// created_at is left to the DB default (now()) exactly as the real path does;
// nothing branches on it being before/after now.
const contact_messages = defineFactory({
  inputSchema: z.object({
    name: z.string(),
    email: z.string(),
    subject: z.string().nullable().optional(),
    message: z.string(),
  }),
  refSchema: z.object({ id: z.string() }),
  create: async (data) => {
    const { data: row, error } = await db
      .from('contact_messages')
      .insert({
        name: data.name,
        email: data.email,
        subject: data.subject ?? null,
        message: data.message,
      })
      .select('id')
      .single()
    if (error || !row) fail('contact_messages', error)
    return { id: row!.id as string }
  },
  teardown: async (record) => {
    await db.from('contact_messages').delete().eq('id', record.id)
  },
})

// --- content_translations -------------------------------------------------
// Mirrors the upsert inside getTranslated (lib/i18n/translateContent.ts):
// source_hash = sha256(source_text) so the cache legitimately hits at render
// time. The table has no surrogate id — the composite (source_table, source_id,
// field, locale) is the PK, so we synthesise an `id` for the SDK's bookkeeping
// and tear down by the composite key. source_id arrives as the real per-run
// parent id (via _ref), which makes the PK unique per run without a token.
const content_translations = defineFactory({
  inputSchema: z.object({
    source_table: z.string(),
    source_id: z.string(),
    field: z.string(),
    locale: z.string(),
    value: z.string(),
    source_text: z.string(),
  }),
  refSchema: z.object({
    id: z.string(),
    source_table: z.string(),
    source_id: z.string(),
    field: z.string(),
    locale: z.string(),
  }),
  create: async (data) => {
    const source_hash = createHash('sha256').update(data.source_text).digest('hex')
    const { error } = await db.from('content_translations').upsert(
      {
        source_table: data.source_table,
        source_id: data.source_id,
        field: data.field,
        locale: data.locale,
        source_hash,
        value: data.value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'source_table,source_id,field,locale' },
    )
    if (error) fail('content_translations', error)
    return {
      id: `${data.source_table}:${data.source_id}:${data.field}:${data.locale}`,
      source_table: data.source_table,
      source_id: data.source_id,
      field: data.field,
      locale: data.locale,
    }
  },
  teardown: async (record) => {
    await db
      .from('content_translations')
      .delete()
      .eq('source_table', record.source_table)
      .eq('source_id', record.source_id)
      .eq('field', record.field)
      .eq('locale', record.locale)
  },
})

// --- site_settings --------------------------------------------------------
// Mirrors saveSettings (app/admin/_actions/settings.ts): upserts the single
// (id = true) row. This is a GLOBAL SINGLETON (id boolean primary key,
// check id = true) — it cannot be made per-run. The factory captures the prior
// logo_url and teardown RESTORES it (rather than deleting the shared row, which
// would remove non-test data). Upsert never violates a unique constraint, so
// this does not block the concurrent-instances proof.
const site_settings = defineFactory({
  inputSchema: z.object({
    logo_url: z.string().nullable().optional(),
  }),
  refSchema: z.object({ id: z.string(), previousLogoUrl: z.string().nullable() }),
  create: async (data) => {
    const { data: prev } = await db
      .from('site_settings')
      .select('logo_url')
      .eq('id', true)
      .maybeSingle()
    const { error } = await db
      .from('site_settings')
      .upsert({ id: true, logo_url: data.logo_url ?? null, updated_at: new Date().toISOString() })
    if (error) fail('site_settings', error)
    return { id: 'site_settings', previousLogoUrl: (prev?.logo_url as string | null) ?? null }
  },
  teardown: async (record) => {
    await db
      .from('site_settings')
      .upsert({ id: true, logo_url: record.previousLogoUrl ?? null, updated_at: new Date().toISOString() })
  },
})

// The registry key MUST match the model name used in the recipe `create` map.
export const factories = {
  categories,
  venues,
  venue_photos,
  venue_menu_items,
  venue_facilities,
  venue_quick_facts,
  venue_treatment_tags,
  venue_highlights,
  venue_faqs,
  blog_posts,
  contact_messages,
  content_translations,
  site_settings,
}
