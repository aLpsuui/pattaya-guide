-- ============================================================================
-- Seed: RINN Spa / Massage  (slug: rinn-spa-massage)
-- ----------------------------------------------------------------------------
-- Data transcribed from the venue single page design.
-- Re-runnable: upserts the venue by slug, then replaces all of its child rows.
-- Run 0001_venue_detail_schema.sql first.
--
-- Photos live in the Supabase `venues` storage bucket:
--   https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/rinn-spa-massage/<file>
-- ============================================================================

-- 1 · Upsert the venue ------------------------------------------------------
insert into public.venues (
  name, slug, category_id, venue_type, price_range, rating, review_count,
  is_active, locally_verified,
  tagline, description,
  address, neighborhood, nearby,
  hours, hours_note, phone,
  website, website_label, facebook_url, maps_query,
  price_from, price_from_label,
  menu_intro, menu_note,
  map_road_label, map_soi_label, map_pin_label,
  gallery_more_count,
  image_url,
  about
)
values (
  'RINN Spa / Massage',
  'rinn-spa-massage',
  (select id from public.categories where slug = 'wellness-and-beauty'),
  'Massage',
  '฿',
  4.5,
  709,
  true,
  true,
  'A popular, well-reviewed neighbourhood massage shop in central Pattaya — clean, Japanese-style and professional, with some of the best-value Thai and oil massage in town.',
  'RINN Spa / Massage in central Pattaya — a popular, well-reviewed neighbourhood massage shop known for a clean, Japanese-style atmosphere and great-value Thai and oil massage. Indicative prices and directions.',
  '212/11, Bang Lamung, Chonburi 20150 (central Pattaya)',
  'Central Pattaya · Bang Lamung',
  'In central Pattaya, within easy reach of Soi Buakhao & Central Road',
  'Daily · 11:00–01:00',
  null,
  '088-970-2890',
  'https://www.facebook.com/profile.php?id=61556213113098',
  'RINN on Facebook',
  'https://www.facebook.com/profile.php?id=61556213113098',
  'RINN Spa Massage Pattaya',
  390,
  'Thai massage · from',
  'RINN has no published official price list. The figures below are the most frequently reported rates from third-party listings (Trip.com and local reviews) — treat them as indicative and confirm with the shop.',
  'No official price list is published. These are the most frequently reported rates from third-party listings — confirm the current price by phone (088-970-2890) or Facebook before your visit.',
  'Central Pattaya Rd',
  'Soi Buakhao',
  'RINN Spa · Central Pattaya',
  7,
  'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/rinn-spa-massage/rinn-spa-massage-thai-massage-room-pattaya-thailand-02.jpg',
  array[
    'RINN is a popular, well-reviewed neighbourhood massage shop in central Pattaya, known for a clean, Japanese-style atmosphere and professional, affordable service. It''s often busy, so booking ahead by phone is recommended.',
    'Guests can tell therapists which areas to focus on, and there''s parking in front of the shop. It has a strong reputation for value Thai and oil massage — frequently cited as one of Pattaya''s better value-for-money massage shops.',
    'The shop has no published menu of its own; the prices listed here are compiled from third-party sources and should be treated as approximate.'
  ]
)
on conflict (slug) do update set
  name               = excluded.name,
  category_id        = excluded.category_id,
  venue_type         = excluded.venue_type,
  price_range        = excluded.price_range,
  rating             = excluded.rating,
  review_count       = excluded.review_count,
  is_active          = excluded.is_active,
  locally_verified   = excluded.locally_verified,
  tagline            = excluded.tagline,
  description        = excluded.description,
  address            = excluded.address,
  neighborhood       = excluded.neighborhood,
  nearby             = excluded.nearby,
  hours              = excluded.hours,
  hours_note         = excluded.hours_note,
  phone              = excluded.phone,
  website            = excluded.website,
  website_label      = excluded.website_label,
  facebook_url       = excluded.facebook_url,
  maps_query         = excluded.maps_query,
  price_from         = excluded.price_from,
  price_from_label   = excluded.price_from_label,
  menu_intro         = excluded.menu_intro,
  menu_note          = excluded.menu_note,
  map_road_label     = excluded.map_road_label,
  map_soi_label      = excluded.map_soi_label,
  map_pin_label      = excluded.map_pin_label,
  gallery_more_count = excluded.gallery_more_count,
  image_url          = excluded.image_url,
  about              = excluded.about;

-- 2 · Replace child rows ----------------------------------------------------
delete from public.venue_photos         where venue_id = (select id from public.venues where slug = 'rinn-spa-massage');
delete from public.venue_menu_items     where venue_id = (select id from public.venues where slug = 'rinn-spa-massage');
delete from public.venue_facilities     where venue_id = (select id from public.venues where slug = 'rinn-spa-massage');
delete from public.venue_quick_facts    where venue_id = (select id from public.venues where slug = 'rinn-spa-massage');
delete from public.venue_treatment_tags where venue_id = (select id from public.venues where slug = 'rinn-spa-massage');
delete from public.venue_highlights     where venue_id = (select id from public.venues where slug = 'rinn-spa-massage');
delete from public.venue_faqs           where venue_id = (select id from public.venues where slug = 'rinn-spa-massage');

-- Photos (gallery + lightbox order) -----------------------------------------
insert into public.venue_photos (venue_id, url, alt, caption, sort_order)
select v.id, x.url, x.alt, x.caption, x.sort_order
from public.venues v
cross join (values
  ('https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/rinn-spa-massage/rinn-spa-massage-thai-massage-room-pattaya-thailand-02.jpg', 'Thai massage room at RINN Spa & Massage — a spa in Pattaya, Thailand.',  'Thai massage room at RINN Spa & Massage — a spa in Pattaya, Thailand.',  0),
  ('https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/rinn-spa-massage/rinn-spa-massage-relaxation-area-pattaya-thailand-04.jpg', 'Relaxation area at RINN Spa & Massage — a spa in Pattaya, Thailand.',    'Relaxation area at RINN Spa & Massage — a spa in Pattaya, Thailand.',    1),
  ('https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/rinn-spa-massage/rinn-spa-massage-spa-reception-pattaya-thailand-05.jpg',   'Reception at RINN Spa & Massage — a spa in Pattaya, Thailand.',          'Reception at RINN Spa & Massage — a spa in Pattaya, Thailand.',          2),
  ('https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/rinn-spa-massage/rinn-spa-massage-wellness-lounge-pattaya-thailand-06.jpg', 'Lounge at RINN Spa & Massage — a spa in Pattaya, Thailand.',             'Lounge at RINN Spa & Massage — a spa in Pattaya, Thailand.',             3),
  ('https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/rinn-spa-massage/rinn-spa-massage-aromatherapy-pattaya-thailand-07.jpg',    'Aromatic oil massage at RINN Spa & Massage — a spa in Pattaya, Thailand.','Aromatic oil massage at RINN Spa & Massage — a spa in Pattaya, Thailand.',4),
  ('https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/rinn-spa-massage/rinn-spa-massage-spa-pattaya-thailand-09.jpg',             'Massage interior at RINN Spa & Massage — a spa in Pattaya, Thailand.',   'Massage interior at RINN Spa & Massage — a spa in Pattaya, Thailand.',   5),
  ('https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/rinn-spa-massage/rinn-spa-massage-treatment-room-pattaya-thailand-10.jpg',  'Treatment room at RINN Spa & Massage — a spa in Pattaya, Thailand.',     'Treatment room at RINN Spa & Massage — a spa in Pattaya, Thailand.',     6)
) as x(url, alt, caption, sort_order)
where v.slug = 'rinn-spa-massage';

-- Treatment menu ------------------------------------------------------------
insert into public.venue_menu_items (venue_id, section, name, detail, duration, price, is_featured, sort_order)
select v.id, x.section, x.name, x.detail, x.duration, x.price, x.is_featured, x.sort_order
from public.venues v
cross join (values
  ('Indicative prices', 'Thai Massage',          null, '60 min', '~฿390', true,  0),
  ('Indicative prices', 'Foot + Neck/Shoulder',  null, '60 min', '~฿390', true,  1),
  ('Indicative prices', 'Aromatic Oil Massage',  null, '60 min', '~฿890', false, 2)
) as x(section, name, detail, duration, price, is_featured, sort_order)
where v.slug = 'rinn-spa-massage';

-- Quick facts ---------------------------------------------------------------
insert into public.venue_quick_facts (venue_id, icon, value, label, sort_order)
select v.id, x.icon, x.value, x.label, x.sort_order
from public.venues v
cross join (values
  ('pg-star',     '4.5 / 5',        '709 reviews',          0),
  ('pg-info',     'From ฿390',      '60-min Thai massage',  1),
  ('pg-wellness', 'Japanese-style', 'Clean & calm',         2),
  ('pg-parking',  'Parking',        'In front of the shop', 3)
) as x(icon, value, label, sort_order)
where v.slug = 'rinn-spa-massage';

-- Treatment tags (pills) ----------------------------------------------------
insert into public.venue_treatment_tags (venue_id, label, color, sort_order)
select v.id, x.label, x.color, x.sort_order
from public.venues v
cross join (values
  ('Thai massage',    'blue', 0),
  ('Foot massage',    'blue', 1),
  ('Oil massage',     'blue', 2),
  ('Neck & shoulder', 'cyan', 3),
  ('Aromatic oil',    'cyan', 4)
) as x(label, color, sort_order)
where v.slug = 'rinn-spa-massage';

-- Facilities ----------------------------------------------------------------
insert into public.venue_facilities (venue_id, icon, label, sort_order)
select v.id, x.icon, x.label, x.sort_order
from public.venues v
cross join (values
  ('pg-wellness', 'Japanese-style interior', 0),
  ('pg-parking',  'On-site parking',         1),
  ('pg-air-con',  'Air-conditioned',         2),
  ('pg-check',    'Walk-ins welcome',        3),
  ('pg-check',    'Target-area requests',    4),
  ('pg-globe',    'English-speaking staff',  5)
) as x(icon, label, sort_order)
where v.slug = 'rinn-spa-massage';

-- Highlights ("Good to know") -----------------------------------------------
insert into public.venue_highlights (venue_id, label, sort_order)
select v.id, x.label, x.sort_order
from public.venues v
cross join (values
  ('Often busy — phone ahead to reserve',        0),
  ('Clean, calm, Japanese-style atmosphere',     1),
  ('Tell therapists which areas to focus on',    2),
  ('Parking in front of the shop',               3),
  ('No official menu — prices are indicative',   4),
  ('Great value for Thai & oil massage',         5)
) as x(label, sort_order)
where v.slug = 'rinn-spa-massage';

-- FAQs ----------------------------------------------------------------------
insert into public.venue_faqs (venue_id, question, answer, sort_order)
select v.id, x.question, x.answer, x.sort_order
from public.venues v
cross join (values
  ('Are these the official prices?', 'No — RINN doesn''t publish an official price list. The figures shown are the most frequently reported third-party rates. Confirm the current price by phone or Facebook.', 0),
  ('Do I need to book?', 'It''s often fully booked, so phoning ahead (088-970-2890) is recommended.', 1),
  ('Can I ask the therapist to focus on certain areas?', 'Yes — guests can tell therapists which areas to concentrate on.', 2),
  ('Is there parking?', 'Yes, there''s parking in front of the shop.', 3)
) as x(question, answer, sort_order)
where v.slug = 'rinn-spa-massage';
