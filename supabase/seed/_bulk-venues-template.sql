-- ============================================================================
-- BULK venues seed/update — copy-paste template
-- ----------------------------------------------------------------------------
-- Pattern for inserting/updating MANY venues (and their child rows) at once.
-- Run 0001_venue_detail_schema.sql first.
--
-- How it works:
--   1. One `insert ... values (...) , (...) , ...` upserts every venue by slug.
--   2. Child rows never hard-code a venue UUID. Each child VALUES row starts
--      with the parent's `venue_slug`; we `join public.venues on slug` to
--      resolve the id. So the same block scales from 2 to 200 venues.
--   3. Re-runnable: a scoped delete clears child rows for exactly the slugs in
--      this file before re-inserting them. The venue upsert uses ON CONFLICT.
--
-- To add a venue: add one row to the venues VALUES list, then add that venue's
-- slug to each child VALUES list you need. Leave columns you don't have as null.
-- ============================================================================

-- 1 · UPSERT VENUES ---------------------------------------------------------
insert into public.venues (
  slug, name, category_id, venue_type, price_range, rating, review_count,
  is_active, locally_verified, tagline, description, address, neighborhood,
  nearby, hours, phone, website, website_label, maps_query,
  price_from, price_from_label, image_url, about
)
values
  (
    'makkha-health-spa',
    'Makkha Health & Spa',
    (select id from public.categories where slug = 'wellness-and-beauty'),
    'Spa', '฿฿', 4.9, 661, true, true,
    'A boutique Thai day spa in North Pattaya with cave-themed treatment rooms and natural therapies.',
    'Makkha Health & Spa — a boutique Thai day spa in North Pattaya known for cave-themed rooms, herbal treatments and calm, attentive service.',
    'North Pattaya, Bang Lamung, Chonburi 20150',
    'North Pattaya · Bang Lamung',
    'Near North Pattaya Beach and Central Festival',
    'Daily · 10:00–22:00',
    null, null, null,
    'Makkha Health Spa Pattaya',
    850, 'boutique Thai spa',
    'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/makkha-health-spa-pattaya-again-north-pattaya/makkha-health-spa-pattaya-again-north-pattaya-marble-statue-bust-thailand-01.jpg',
    array[
      'Makkha Health & Spa is a boutique day spa in North Pattaya, offering Thai massage, herbal treatments and signature packages in a calm, cave-themed setting.',
      'It has a strong local reputation for attentive service and natural products.'
    ]
  ),
  (
    'the-sea-spa-pattaya',
    'The Sea.Spa Pattaya',
    (select id from public.categories where slug = 'wellness-and-beauty'),
    'Spa', '฿', 4.7, 619, true, true,
    'A Thai garden spa in Wongamat with flower-bath rituals and couples treatments.',
    'The Sea.Spa Pattaya — a Thai garden spa in Wongamat offering flower-bath rituals, aroma oil and couples treatments a short walk from the beach.',
    'Wongamat, Naklua, Bang Lamung, Chonburi 20150',
    'Wongamat · Naklua',
    'In Wongamat, near the North Pattaya / Naklua beachfront',
    'Daily · 10:00–22:00',
    null, null, null,
    'The Sea Spa Pattaya Wongamat',
    350, 'Thai garden spa',
    'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/the-sea-spa-pattaya/the-sea-spa-pattaya-rose-petal-bath-thailand-02.jpg',
    array[
      'The Sea.Spa is a Thai garden spa in the Wongamat area, known for flower-bath rituals, aroma oil massage and couples rooms.',
      'A quiet, green setting a short walk from the beachfront.'
    ]
  )
  -- , ( 'another-slug', 'Another Venue', ... )   <-- add more venues here
on conflict (slug) do update set
  name             = excluded.name,
  category_id      = excluded.category_id,
  venue_type       = excluded.venue_type,
  price_range      = excluded.price_range,
  rating           = excluded.rating,
  review_count     = excluded.review_count,
  is_active        = excluded.is_active,
  locally_verified = excluded.locally_verified,
  tagline          = excluded.tagline,
  description      = excluded.description,
  address          = excluded.address,
  neighborhood     = excluded.neighborhood,
  nearby           = excluded.nearby,
  hours            = excluded.hours,
  phone            = excluded.phone,
  website          = excluded.website,
  website_label    = excluded.website_label,
  maps_query       = excluded.maps_query,
  price_from       = excluded.price_from,
  price_from_label = excluded.price_from_label,
  image_url        = excluded.image_url,
  about            = excluded.about;

-- 2 · CLEAR CHILD ROWS for the slugs in this file (so re-runs are clean) -----
-- Keep this slug list in sync with the venues above.
delete from public.venue_photos         where venue_id in (select id from public.venues where slug in ('makkha-health-spa','the-sea-spa-pattaya'));
delete from public.venue_menu_items     where venue_id in (select id from public.venues where slug in ('makkha-health-spa','the-sea-spa-pattaya'));
delete from public.venue_facilities     where venue_id in (select id from public.venues where slug in ('makkha-health-spa','the-sea-spa-pattaya'));
delete from public.venue_quick_facts    where venue_id in (select id from public.venues where slug in ('makkha-health-spa','the-sea-spa-pattaya'));
delete from public.venue_treatment_tags where venue_id in (select id from public.venues where slug in ('makkha-health-spa','the-sea-spa-pattaya'));
delete from public.venue_highlights     where venue_id in (select id from public.venues where slug in ('makkha-health-spa','the-sea-spa-pattaya'));
delete from public.venue_faqs           where venue_id in (select id from public.venues where slug in ('makkha-health-spa','the-sea-spa-pattaya'));

-- 3 · CHILD ROWS — each row's first column is the parent venue_slug ----------

-- Photos
insert into public.venue_photos (venue_id, url, alt, caption, sort_order)
select v.id, x.url, x.alt, x.caption, x.sort_order
from (values
  ('makkha-health-spa',   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/makkha-health-spa-pattaya-again-north-pattaya/makkha-health-spa-pattaya-again-north-pattaya-marble-statue-bust-thailand-01.jpg', 'Cave-themed marble statue at Makkha Health & Spa — a spa in Pattaya, Thailand.', 'Cave-themed marble statue at Makkha Health & Spa.', 0),
  ('the-sea-spa-pattaya', 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/the-sea-spa-pattaya/the-sea-spa-pattaya-rose-petal-bath-thailand-02.jpg', 'Rose-petal bath at The Sea.Spa Pattaya — a spa in Pattaya, Thailand.', 'Rose-petal bath at The Sea.Spa Pattaya.', 0)
) as x(venue_slug, url, alt, caption, sort_order)
join public.venues v on v.slug = x.venue_slug;

-- Menu / treatments
insert into public.venue_menu_items (venue_id, section, name, detail, duration, price, is_featured, sort_order)
select v.id, x.section, x.name, x.detail, x.duration, x.price, x.is_featured, x.sort_order
from (values
  ('makkha-health-spa',   'À la carte', 'Thai Massage',     null, '60 min', '฿850',   true,  0),
  ('makkha-health-spa',   'À la carte', 'Aroma Oil Massage', null, '60 min', '฿1,200', false, 1),
  ('the-sea-spa-pattaya', 'À la carte', 'Thai Massage',     null, '60 min', '฿350',   true,  0),
  ('the-sea-spa-pattaya', 'Packages',   'Flower Bath Ritual', null, '120 min', '฿1,500', true, 1)
) as x(venue_slug, section, name, detail, duration, price, is_featured, sort_order)
join public.venues v on v.slug = x.venue_slug;

-- Quick facts
insert into public.venue_quick_facts (venue_id, icon, value, label, sort_order)
select v.id, x.icon, x.value, x.label, x.sort_order
from (values
  ('makkha-health-spa',   'pg-star', '4.9 / 5',  '661 reviews',     0),
  ('makkha-health-spa',   'pg-info', 'From ฿850','60-min Thai',     1),
  ('the-sea-spa-pattaya', 'pg-star', '4.7 / 5',  '619 reviews',     0),
  ('the-sea-spa-pattaya', 'pg-info', 'From ฿350','60-min Thai',     1)
) as x(venue_slug, icon, value, label, sort_order)
join public.venues v on v.slug = x.venue_slug;

-- Treatment tags
insert into public.venue_treatment_tags (venue_id, label, color, sort_order)
select v.id, x.label, x.color, x.sort_order
from (values
  ('makkha-health-spa',   'Thai massage', 'blue', 0),
  ('makkha-health-spa',   'Herbal ball',  'cyan', 1),
  ('the-sea-spa-pattaya', 'Flower bath',  'blue', 0),
  ('the-sea-spa-pattaya', 'Aroma oil',    'cyan', 1)
) as x(venue_slug, label, color, sort_order)
join public.venues v on v.slug = x.venue_slug;

-- Facilities
insert into public.venue_facilities (venue_id, icon, label, sort_order)
select v.id, x.icon, x.label, x.sort_order
from (values
  ('makkha-health-spa',   'pg-air-con', 'Air-conditioned', 0),
  ('makkha-health-spa',   'pg-parking', 'On-site parking', 1),
  ('the-sea-spa-pattaya', 'pg-air-con', 'Air-conditioned', 0),
  ('the-sea-spa-pattaya', 'pg-wellness','Couples rooms',   1)
) as x(venue_slug, icon, label, sort_order)
join public.venues v on v.slug = x.venue_slug;

-- Highlights ("Good to know")
insert into public.venue_highlights (venue_id, label, sort_order)
select v.id, x.label, x.sort_order
from (values
  ('makkha-health-spa',   'Booking ahead recommended at weekends', 0),
  ('the-sea-spa-pattaya', 'Couples and flower-bath rooms available', 0)
) as x(venue_slug, label, sort_order)
join public.venues v on v.slug = x.venue_slug;

-- FAQs
insert into public.venue_faqs (venue_id, question, answer, sort_order)
select v.id, x.question, x.answer, x.sort_order
from (values
  ('makkha-health-spa',   'Do I need to book?', 'Walk-ins are welcome but booking ahead is recommended at busy times.', 0),
  ('the-sea-spa-pattaya', 'Is it suitable for couples?', 'Yes — there are couples rooms and flower-bath rituals.', 0)
) as x(venue_slug, question, answer, sort_order)
join public.venues v on v.slug = x.venue_slug;
