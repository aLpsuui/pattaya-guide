-- ============================================================================
-- Seed: 19 Wellness & Beauty (spa / massage) venues
-- ----------------------------------------------------------------------------
-- Transcribed from the 20 spa detail HTML pages (rinn-spa-massage is seeded
-- separately; spa_template.html duplicates the-one-massage-pattaya).
-- Run 0001_venue_detail_schema.sql first. Re-runnable.
--
-- Photo paths: 'venues/<slug>/<file>' live in the Supabase `venues` bucket;
-- a few pages reuse generic images from the `assets` bucket ('assets/<file>').
-- Both are prefixed with the public storage base below.
-- Multi-duration menus are flattened to one row (e.g. '60/90/120 min').
-- ============================================================================

-- 1 · UPSERT VENUES ---------------------------------------------------------
insert into public.venues (
  slug, name, category_id, venue_type, price_range, rating, review_count,
  is_active, locally_verified, tagline, description, address, neighborhood,
  hours, website, website_label, maps_query, price_from, price_from_label, image_url
)
values
  ('7-spa-luxury-pattaya','7 Spa Luxury Pattaya',(select id from public.categories where slug='wellness-and-beauty'),'Spa','฿฿฿',4.7,544,true,true,
   'An authentic teak luxury spa since 2007 — an outdoor sea-salt jacuzzi and herbal sauna, with 17+ signature ritual programmes from four-hand royal massage to ginseng facials.',
   '7SPA Luxury Pattaya — an authentic teak luxury spa (est. 2007) with an outdoor sea-salt jacuzzi and herbal sauna, 17+ signature ritual programmes.',
   '7 Moo 12, Thappraya Soi 10, Pattaya, Chonburi','Thappraya Soi 10 · Pattaya','Open daily · book ahead',
   'https://www.7spaluxury.com/','7spaluxury.com','7 Spa Luxury Pattaya Thappraya',1100,'1-hour ritual · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/7-spa-luxury-pattaya/7-spa-luxury-pattaya-illuminated-spa-exterior-thailand-01.jpg'),

  ('88-massage-and-spa','88 Massage and Spa',(select id from public.categories where slug='wellness-and-beauty'),'Massage','฿',4.6,497,true,true,
   'A locally run Thai massage salon on Soi Chalermphrakiat with a strong Korean following — traditional, hands-on massage over big-facility frills.',
   '88 Massage and Spa in central Pattaya — a locally run Thai massage salon with a strong Korean following. Traditional hands-on massage. Indicative prices.',
   '249, Soi Chalermphrakiat 6, Pattaya City, Chon Buri 20150','Soi Chalermphrakiat · Pattaya City','Daily · approx. 10:00–24:00',
   'https://www.facebook.com/p/88-massage-spa-100067152081015/','88 Massage on Facebook','88 Massage and Spa Pattaya Chalermphrakiat',200,'Thai massage · approx.',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-massage-1.jpeg'),

  ('grace-spa','Grace Spa',(select id from public.categories where slug='wellness-and-beauty'),'Spa','฿฿',4.8,1401,true,true,
   'A luxury Thai spa built entirely from teak — private treatment villas, expert multilingual therapists and a true Thai experience.',
   'Grace Spa Pattaya — a luxury teak-built Thai spa with private treatment villas, expert therapists and a wide range of couples and signature packages.',
   '202/266 Moo 9, Bang Lamung, Chon Buri 20150','Central Pattaya · Bang Lamung','Daily · 10:00–23:30',
   'https://www.facebook.com/GraceSpaPattaya/','facebook.com/GraceSpaPattaya','Grace Spa Pattaya',1000,'Thai massage · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/grace-spa/grace-spa-spa-entrance-sign-pattaya-thailand-01.jpg'),

  ('health-land-north-pattaya','Health Land North Pattaya (Pattaya Nua)',(select id from public.categories where slug='wellness-and-beauty'),'Day Spa','฿฿',4.2,1590,true,true,
   'The Naklua / North Pattaya branch of Thailand''s trusted day-spa chain — affordable, professional Thai massage plus rare Vichy Shower treatments.',
   'Health Land North Pattaya (Pattaya Nua) — affordable, professional Thai massage and spa with Vichy Shower treatments and couples spa-jacuzzi packages.',
   '159/555 Moo 5, Pattaya Nua Rd., Naklua, Bang Lamung','Pattaya Nua Road · Naklua','Daily · 10:00–23:00',
   'https://www.healthlandspa.com/en/location/pattaya/pattaya-nua','healthlandspa.com','Health Land Spa Pattaya Nua North',400,'foot massage · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/health-land-north-pattaya/health-land-north-pattaya-resort-pool-loungers-thailand-02.jpg'),

  ('health-land-pattaya-sukhumvit-road','Health Land Pattaya Sukhumvit Road',(select id from public.categories where slug='wellness-and-beauty'),'Day Spa','฿฿',4.5,1606,true,true,
   'Thailand''s trusted day-spa chain — professional, affordable traditional Thai massage and Ayurveda, with couples spa-jacuzzi suites on Sukhumvit Road.',
   'Health Land Pattaya Sukhumvit Road — one of Thailand''s best-known day-spa chains. Traditional Thai massage, Ayurveda, couples spa-jacuzzi packages.',
   '111/555 Moo 11, Nong Prue, Chonburi 20150','Sukhumvit Road · Nong Prue','Daily · 10:00–23:00',
   'https://www.healthlandspa.com/en/location/pattaya/sukumvit-rd','healthlandspa.com','Health Land Spa Pattaya Sukhumvit',400,'foot massage · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/health-land-pattaya-sukhumvit-road/health-land-pattaya-sukhumvit-road-illuminated-spa-building-thailand-01.jpg'),

  ('i-siamland-massage-spa-pattaya','I.Siamland Massage & Spa Pattaya',(select id from public.categories where slug='wellness-and-beauty'),'Health Spa','฿',4.8,428,true,true,
   'A highly rated, spotless health spa in Phra Tamnak — signature herbal-compress massage, deep-tissue oil work and private couples spa rooms.',
   'I.Siamland Massage & Spa in Phra Tamnak — a highly rated (4.8), spotless wellness spa with signature herbal-compress massage and deep-tissue oil work.',
   '338 Moo 12 / 118 Phra Tamnak, Nong Prue, Chon Buri 20150','Phra Tamnak · Nong Prue','Daily · 11:00–23:00',
   'https://buzzinpattaya.com/i-siamland-massage-spa-pattaya/','I.Siamland info','I.Siamland Massage Spa Pattaya Phra Tamnak',300,'Thai massage · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/i-siamland-massage-spa-pattaya/i-siamland-massage-spa-pattaya-spa-therapists-towels-thailand-02.jpg'),

  ('let-s-relax-onsen-and-spa-pattaya','Let''s Relax Onsen and Spa Pattaya',(select id from public.categories where slug='wellness-and-beauty'),'Onsen & Spa','฿฿',4.6,776,true,true,
   'Thailand''s first sea-view Japanese onsen — a 3,000 m² flagship on the 7th floor of Grande Centre Point, with authentic Gero hot-spring water and the full Let''s Relax menu.',
   'Let''s Relax Onsen and Spa Pattaya — Thailand''s first sea-view Japanese onsen on the 7th floor of Grande Centre Point Space Pattaya. Onsen ฿750.',
   '7F, Grande Centre Point Space Pattaya, Naklua, Chonburi 20150','Grande Centre Point · Naklua','Daily · 10:00–24:00',
   'https://letsrelaxspa.com/branches/pattaya-onsen-and-spa/','letsrelaxspa.com · Onsen and Spa','Lets Relax Onsen and Spa Pattaya Grande Centre Point',750,'onsen bath · entry',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/let-s-relax-onsen-and-spa-pattaya/let-s-relax-onsen-and-spa-pattaya-courtyard-stone-fountain-thailand-02.jpg'),

  ('let-s-relax-spa-north-pattaya','Let''s Relax Spa North Pattaya',(select id from public.categories where slug='wellness-and-beauty'),'Spa','฿฿',4.3,822,true,true,
   'Thailand''s leading day-spa chain in a tropical garden — a quiet escape from the city, blending Thai, Chinese and Indian healing, open until midnight.',
   'Let''s Relax Spa North Pattaya — Thailand''s leading day-spa chain in a tropical garden setting. World-class Thai massage, hot stone, Dr. Spiller facials.',
   '240/9 Moo 5, Na Kluea, Bang Lamung, Chonburi 20150','Pattaya North Road · Naklua','Daily · 10:00–24:00',
   'https://letsrelaxspa.com/branches/pattaya-north/','letsrelaxspa.com/pattaya-north','Lets Relax Spa North Pattaya',350,'back & shoulder · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-courtyard-stone-fountain-thailand-01.jpg'),

  ('let-s-relax-spa-pattaya-beach-front','Let''s Relax Spa - Pattaya Beach Front',(select id from public.categories where slug='wellness-and-beauty'),'Spa','฿฿',4.6,658,true,true,
   'Thailand''s leading premium spa chain, right on Pattaya Beach Road — wave-and-beach-inspired decor and world-class Thai massage, some with a sea view.',
   'Let''s Relax Spa Pattaya Beach Front — Thailand''s leading premium spa chain on Beach Road (Soi 12), with world-class Thai massage and spa rituals.',
   '224/27-28 Beach Road, Soi 12, Nong Prue, Chonburi 20150','Beach Road · Soi 12','Daily · 10:00–24:00',
   'https://letsrelaxspa.com/','letsrelaxspa.com','Lets Relax Spa Pattaya Beach Front Soi 12',350,'back & shoulder · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/let-s-relax-spa-pattaya-beach-front/let-s-relax-spa-pattaya-beach-front-seaview-massage-lounge-thailand-02.jpg'),

  ('let-s-relax-spa-terminal-21-pattaya','Let''s Relax Spa - Terminal 21 Pattaya',(select id from public.categories where slug='wellness-and-beauty'),'Spa','฿฿',4.5,444,true,true,
   'Thailand''s leading boutique day-spa chain inside the airport-themed Terminal 21 mall — world-class Thai massage with the convenience of a major mall.',
   'Let''s Relax Spa Terminal 21 Pattaya — Thailand''s leading boutique day-spa chain inside Terminal 21, with Thai massage, four-hand and Dr. Spiller facials.',
   '1st Floor, Terminal 21 Pattaya, Na Kluea, Chonburi 20150','Terminal 21 · Naklua','Daily · 10:00–24:00',
   'https://letsrelaxspa.com/','letsrelaxspa.com','Lets Relax Spa Terminal 21 Pattaya',350,'back & shoulder · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-massage-bed-room-thailand-02.jpg'),

  ('makkha-health-spa-pattaya-again-north-pattaya','Makkha Health & Spa Pattaya',(select id from public.categories where slug='wellness-and-beauty'),'Spa','฿฿',4.9,661,true,true,
   'A boutique ''Cave of Deep Peace'' — Makkha blends traditional Thai healing with modern luxury in cave-inspired architecture opposite Terminal 21.',
   'Makkha Health & Spa at Again North Pattaya — a boutique cave-themed Thai spa opposite Terminal 21, with welcome treats and a free Pattaya shuttle.',
   'Again Pattaya, 179/40 Moo 5, opposite Terminal 21','Again North Pattaya · opp. Terminal 21','Open daily · walk-in based',
   'https://book.makkhahealthandspa.com/','book.makkhahealthandspa.com','Makkha Health and Spa Again North Pattaya',850,'Thai massage · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/makkha-health-spa-pattaya-again-north-pattaya/makkha-health-spa-pattaya-again-north-pattaya-marble-statue-bust-thailand-01.jpg'),

  ('oasis-spa-pattaya-jomtien','Oasis Spa Pattaya (Jomtien)',(select id from public.categories where slug='wellness-and-beauty'),'Day Spa','฿฿฿',4.8,1330,true,true,
   'A luxury garden day spa near the Big Buddha Hill — private villas, jacuzzi and steam, signature Lanna and Thai rituals, and free hotel transfers.',
   'Oasis Spa Pattaya, Jomtien — a luxury garden day spa with private villas, Lanna and Thai signature packages, hydrotherapy and free Pattaya transfers.',
   '322 Thappraya Road, Jomtien, Chon Buri','Thappraya Road · Jomtien','Daily · 10:00–22:00',
   'https://www.oasisspa.net/','oasisspa.net','Oasis Spa Pattaya Thappraya',1222,'aroma hot-oil · promo',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/oasis-spa-pattaya-jomtien/oasis-spa-pattaya-jomtien-candlelit-spa-entrance-thailand-01.jpg'),

  ('pattaya-spa','Pattaya SPA',(select id from public.categories where slug='wellness-and-beauty'),'Spa','฿฿',4.6,474,true,true,
   'A Thai-style spa salon of authentic massage, spa rituals and body, face and hair care — with an on-site restaurant, oriented to the Russian-speaking market.',
   'Pattaya SPA — a Thai-style spa salon of authentic Thai massage, spa rituals, body/face/hair care and an on-site restaurant, for the Russian-speaking market.',
   'Pattaya — Russian-market spa salon (confirm address)','Pattaya · Russian-market spa','Hours on request',
   'https://pattayaspa.kz/','pattayaspa.kz','Pattaya SPA pattayaspa.kz',null,'ritual menu · prices in ₸',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-wellness-1.jpeg'),

  ('poo-na-health-massage','Poo Na Health Massage',(select id from public.categories where slug='wellness-and-beauty'),'Massage','฿',4.4,961,true,true,
   'A small, newly renovated neighbourhood massage shop on Soi Buakhao — ''your escape to a magical sanctuary'', with genuinely budget-friendly local prices.',
   'Poo Na Health Massage on Soi Buakhao — a small, newly renovated neighbourhood massage shop with very low local prices. Thai, oil and aroma massage.',
   '62/36 Moo 9, Soi Buakhao, Nong Prue, Pattaya 20150','Soi Buakhao · Nong Prue','Daily · 10:00–22:00',
   'https://kenf2525.wixsite.com/poonahealthmassage','poonahealthmassage (web)','Poo Na Health Massage Soi Buakhao Pattaya',150,'Thai massage · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/poo-na-health-massage/poo-na-health-massage-foot-massage-session-pattaya-thailand-01.jpg'),

  ('siladon-spa-pattaya','Siladon Spa Pattaya',(select id from public.categories where slug='wellness-and-beauty'),'Day Spa','฿',4.9,902,true,true,
   'A professional Naklua day spa — clean, warm and couple- and family-friendly, using natural local Thai products, with tiered 2-to-5-hour packages at flash-sale prices.',
   'Siladon Spa Pattaya in Naklua — a professional, couple- and family-friendly day spa using natural local products, with tiered 2–5 hour signature packages.',
   '285/52 Moo 5, Naklua 16, Naklua, Chon Buri 20150','Naklua · Bang Lamung','Open daily · check ahead',
   'https://www.siladonspas.com/pattaya','siladonspas.com/pattaya','Siladon Spa Pattaya Naklua',450,'promo foot massage · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/siladon-spa-pattaya/siladon-spa-pattaya-spa-reception-lounge-thailand-01.jpg'),

  ('the-one-massage-pattaya','The One Massage Pattaya',(select id from public.categories where slug='wellness-and-beauty'),'Massage & Spa','฿฿',4.9,5364,true,true,
   'Pattaya''s highest-rated Thai massage — a calm, all-white retreat in the heart of Walking Street, with signature aroma-oil and herbal-compress treatments.',
   'The One Massage on Walking Street — Pattaya''s top-rated Thai massage spa (4.9, 5,000+ reviews). Aroma oil, herbal compress and signature packages.',
   '95 Walking Street, Pattaya City, Chon Buri 20150','Walking Street · Pattaya City','Open daily · afternoon to late',
   'https://orbitframe.net/','orbitframe.net','The One Massage Walking Street Pattaya',450,'foot massage · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/the-one-massage-pattaya/the-one-massage-pattaya-outdoor-thai-massage-thailand-02.jpg'),

  ('the-sea-spa-pattaya','The Sea.Spa Pattaya',(select id from public.categories where slug='wellness-and-beauty'),'Spa','฿',4.7,619,true,true,
   'A luxury Thai-style house in a tranquil garden near Wongamat Beach — certified in-house therapists, private and couples rooms, and genuinely affordable authentic massage.',
   'The Sea.Spa Pattaya near Wongamat Beach (Soi 18, Naklua) — a luxury Thai-style house in a tranquil garden, with certified therapists and great-value massage.',
   '157/168-170 Soi 18, Naklua, Pattaya','Soi 18 · Naklua (Wongamat)','Daily · 10:00–22:00',
   'https://www.theseaspapattaya.com/','theseaspapattaya.com','The Sea Spa Pattaya Naklua Soi 18',350,'Thai massage · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/the-sea-spa-pattaya/the-sea-spa-pattaya-rose-petal-bath-thailand-02.jpg'),

  ('tea-tree-spa-pattaya','Tea Tree Spa Pattaya',(select id from public.categories where slug='wellness-and-beauty'),'Hotel Spa','฿฿฿',5.0,804,true,true,
   'The signature ocean-view spa of Holiday Inn Pattaya — a serene, beautifully renovated retreat with Dermalogica facials, Himalayan hot stone and signature packages.',
   'Tea Tree Spa at Holiday Inn Pattaya — a perfect-rated ocean-view luxury spa with Dermalogica facials, Himalayan hot stone, signature packages and a kids'' menu.',
   'Level 5, Bay Tower, Holiday Inn Pattaya, Beach Road','Holiday Inn · Pattaya Beach','Daily · 11:00–20:00',
   'https://pattaya.holidayinn.com/facilities/tea-tree-spa','pattaya.holidayinn.com · Tea Tree Spa','Tea Tree Spa Holiday Inn Pattaya',600,'foot massage · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/tea-tree-spa-pattaya/tea-tree-spa-pattaya-oceanview-spa-relaxation-thailand-02.jpg'),

  ('yunomori-onsen-spa-pattaya','Yunomori Onsen & Spa Pattaya',(select id from public.categories where slug='wellness-and-beauty'),'Onsen & Spa','฿฿',4.5,1910,true,true,
   'Japanese-style natural hot-spring onsen baths paired with a full Thai spa — soak, steam and unwind, then a massage, scrub or facial on Thepprasit Road.',
   'Yunomori Onsen & Spa Pattaya blends Japanese natural hot-spring onsen baths with a full Thai spa on Thepprasit Road. Onsen day passes, massage and facials.',
   '300/59 Thepprasit Road, Nong Prue, Chonburi 20150','Thepprasit Road · Nong Prue','Open daily · from 10:00',
   'https://www.yunomorionsen.com/pattaya/','yunomorionsen.com/pattaya','Yunomori Onsen and Spa Pattaya Thepprasit',650,'onsen day pass · from',
   'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/venues/yunomori-onsen-spa-pattaya/yunomori-onsen-spa-pattaya-japanese-soaking-bath-thailand-02.jpg')
on conflict (slug) do update set
  name=excluded.name, category_id=excluded.category_id, venue_type=excluded.venue_type,
  price_range=excluded.price_range, rating=excluded.rating, review_count=excluded.review_count,
  is_active=excluded.is_active, locally_verified=excluded.locally_verified, tagline=excluded.tagline,
  description=excluded.description, address=excluded.address, neighborhood=excluded.neighborhood,
  hours=excluded.hours, website=excluded.website, website_label=excluded.website_label,
  maps_query=excluded.maps_query, price_from=excluded.price_from, price_from_label=excluded.price_from_label,
  image_url=excluded.image_url;

-- 2 · CLEAR CHILD ROWS for these slugs --------------------------------------
do $$
declare slugs text[] := array[
  '7-spa-luxury-pattaya','88-massage-and-spa','grace-spa','health-land-north-pattaya',
  'health-land-pattaya-sukhumvit-road','i-siamland-massage-spa-pattaya','let-s-relax-onsen-and-spa-pattaya',
  'let-s-relax-spa-north-pattaya','let-s-relax-spa-pattaya-beach-front','let-s-relax-spa-terminal-21-pattaya',
  'makkha-health-spa-pattaya-again-north-pattaya','oasis-spa-pattaya-jomtien','pattaya-spa',
  'poo-na-health-massage','siladon-spa-pattaya','the-one-massage-pattaya','the-sea-spa-pattaya',
  'tea-tree-spa-pattaya','yunomori-onsen-spa-pattaya'];
  vids uuid[];
begin
  select array_agg(id) into vids from public.venues where slug = any(slugs);
  delete from public.venue_photos          where venue_id = any(vids);
  delete from public.venue_menu_items      where venue_id = any(vids);
  delete from public.venue_facilities      where venue_id = any(vids);
  delete from public.venue_quick_facts     where venue_id = any(vids);
  delete from public.venue_treatment_tags  where venue_id = any(vids);
  delete from public.venue_highlights      where venue_id = any(vids);
  delete from public.venue_faqs            where venue_id = any(vids);
end $$;

-- 3 · PHOTOS (url = storage base || path) -----------------------------------
insert into public.venue_photos (venue_id, url, alt, sort_order)
select v.id, b.u || x.path, x.alt, x.so
from (values
  -- 7 Spa Luxury
  ('7-spa-luxury-pattaya','venues/7-spa-luxury-pattaya/7-spa-luxury-pattaya-illuminated-spa-exterior-thailand-01.jpg','Illuminated teak spa exterior at 7 Spa Luxury Pattaya',0),
  ('7-spa-luxury-pattaya','venues/7-spa-luxury-pattaya/7-spa-luxury-pattaya-relaxation-area-thailand-04.jpg','Relaxation area at 7 Spa Luxury Pattaya',1),
  ('7-spa-luxury-pattaya','venues/7-spa-luxury-pattaya/7-spa-luxury-pattaya-spa-reception-thailand-05.jpg','Spa reception at 7 Spa Luxury Pattaya',2),
  ('7-spa-luxury-pattaya','venues/7-spa-luxury-pattaya/7-spa-luxury-pattaya-wellness-lounge-thailand-06.jpg','Wellness lounge at 7 Spa Luxury Pattaya',3),
  ('7-spa-luxury-pattaya','venues/7-spa-luxury-pattaya/7-spa-luxury-pattaya-aromatherapy-thailand-07.jpg','Aromatherapy ritual at 7 Spa Luxury Pattaya',4),
  ('7-spa-luxury-pattaya','venues/7-spa-luxury-pattaya/7-spa-luxury-pattaya-spa-thailand-09.jpg','Spa interior at 7 Spa Luxury Pattaya',5),
  ('7-spa-luxury-pattaya','venues/7-spa-luxury-pattaya/7-spa-luxury-pattaya-herbal-compress-massage-thailand-02.jpg','Herbal compress massage at 7 Spa Luxury Pattaya',6),
  -- 88 Massage (assets)
  ('88-massage-and-spa','assets/pattaya-massage-1.jpeg','Traditional Thai massage at 88 Massage and Spa',0),
  ('88-massage-and-spa','assets/pattaya-massage-2.jpg','Oil massage session at 88 Massage and Spa',1),
  ('88-massage-and-spa','assets/pattaya-massage-4.png','Foot massage treatment at 88 Massage and Spa',2),
  ('88-massage-and-spa','assets/pattaya-wellness-1.jpeg','Massage room at 88 Massage and Spa',3),
  ('88-massage-and-spa','assets/pattaya-wellnes-2.jpg','Relaxation lounge at 88 Massage and Spa',4),
  -- Grace Spa
  ('grace-spa','venues/grace-spa/grace-spa-spa-entrance-sign-pattaya-thailand-01.jpg','Teak-built spa entrance at Grace Spa',0),
  ('grace-spa','venues/grace-spa/grace-spa-relaxation-area-pattaya-thailand-04.jpg','Relaxation area at Grace Spa',1),
  ('grace-spa','venues/grace-spa/grace-spa-spa-reception-pattaya-thailand-05.jpg','Spa reception at Grace Spa',2),
  ('grace-spa','venues/grace-spa/grace-spa-wellness-lounge-pattaya-thailand-06.jpg','Wellness lounge at Grace Spa',3),
  ('grace-spa','venues/grace-spa/grace-spa-aromatherapy-pattaya-thailand-07.jpg','Aromatherapy treatment at Grace Spa',4),
  ('grace-spa','venues/grace-spa/grace-spa-spa-pattaya-thailand-09.jpg','Spa interior at Grace Spa',5),
  ('grace-spa','venues/grace-spa/grace-spa-treatment-room-pattaya-thailand-10.jpg','Private treatment villa at Grace Spa',6),
  -- Health Land North
  ('health-land-north-pattaya','venues/health-land-north-pattaya/health-land-north-pattaya-resort-pool-loungers-thailand-02.jpg','Resort pool loungers at Health Land North Pattaya',0),
  ('health-land-north-pattaya','venues/health-land-north-pattaya/health-land-north-pattaya-relaxation-area-thailand-04.jpg','Relaxation area at Health Land North Pattaya',1),
  ('health-land-north-pattaya','venues/health-land-north-pattaya/health-land-north-pattaya-spa-reception-thailand-05.jpg','Spa reception at Health Land North Pattaya',2),
  ('health-land-north-pattaya','venues/health-land-north-pattaya/health-land-north-pattaya-wellness-lounge-thailand-06.jpg','Wellness lounge at Health Land North Pattaya',3),
  ('health-land-north-pattaya','venues/health-land-north-pattaya/health-land-north-pattaya-aromatherapy-thailand-07.jpg','Aromatherapy treatment at Health Land North Pattaya',4),
  ('health-land-north-pattaya','venues/health-land-north-pattaya/health-land-north-pattaya-spa-thailand-09.jpg','Spa interior at Health Land North Pattaya',5),
  ('health-land-north-pattaya','venues/health-land-north-pattaya/health-land-north-pattaya-treatment-room-thailand-10.jpg','Treatment room at Health Land North Pattaya',6),
  -- Health Land Sukhumvit
  ('health-land-pattaya-sukhumvit-road','venues/health-land-pattaya-sukhumvit-road/health-land-pattaya-sukhumvit-road-illuminated-spa-building-thailand-01.jpg','Illuminated spa building at Health Land Pattaya Sukhumvit Road',0),
  ('health-land-pattaya-sukhumvit-road','venues/health-land-pattaya-sukhumvit-road/health-land-pattaya-sukhumvit-road-relaxation-area-thailand-04.jpg','Relaxation area at Health Land Pattaya Sukhumvit Road',1),
  ('health-land-pattaya-sukhumvit-road','venues/health-land-pattaya-sukhumvit-road/health-land-pattaya-sukhumvit-road-spa-reception-thailand-05.jpg','Spa reception at Health Land Pattaya Sukhumvit Road',2),
  ('health-land-pattaya-sukhumvit-road','venues/health-land-pattaya-sukhumvit-road/health-land-pattaya-sukhumvit-road-wellness-lounge-thailand-06.jpg','Wellness lounge at Health Land Pattaya Sukhumvit Road',3),
  ('health-land-pattaya-sukhumvit-road','venues/health-land-pattaya-sukhumvit-road/health-land-pattaya-sukhumvit-road-aromatherapy-thailand-07.jpg','Aromatherapy treatment at Health Land Pattaya Sukhumvit Road',4),
  ('health-land-pattaya-sukhumvit-road','venues/health-land-pattaya-sukhumvit-road/health-land-pattaya-sukhumvit-road-spa-thailand-09.jpg','Spa interior at Health Land Pattaya Sukhumvit Road',5),
  ('health-land-pattaya-sukhumvit-road','venues/health-land-pattaya-sukhumvit-road/health-land-pattaya-sukhumvit-road-treatment-room-thailand-10.jpg','Treatment room at Health Land Pattaya Sukhumvit Road',6),
  -- I.Siamland
  ('i-siamland-massage-spa-pattaya','venues/i-siamland-massage-spa-pattaya/i-siamland-massage-spa-pattaya-spa-therapists-towels-thailand-02.jpg','Spa therapists and fresh towels at I.Siamland Massage & Spa',0),
  ('i-siamland-massage-spa-pattaya','venues/i-siamland-massage-spa-pattaya/i-siamland-massage-spa-pattaya-relaxation-area-thailand-04.jpg','Relaxation area at I.Siamland Massage & Spa',1),
  ('i-siamland-massage-spa-pattaya','venues/i-siamland-massage-spa-pattaya/i-siamland-massage-spa-pattaya-spa-reception-thailand-05.jpg','Spa reception at I.Siamland Massage & Spa',2),
  ('i-siamland-massage-spa-pattaya','venues/i-siamland-massage-spa-pattaya/i-siamland-massage-spa-pattaya-wellness-lounge-thailand-06.jpg','Wellness lounge at I.Siamland Massage & Spa',3),
  ('i-siamland-massage-spa-pattaya','venues/i-siamland-massage-spa-pattaya/i-siamland-massage-spa-pattaya-aromatherapy-thailand-07.jpg','Aromatherapy massage at I.Siamland Massage & Spa',4),
  ('i-siamland-massage-spa-pattaya','venues/i-siamland-massage-spa-pattaya/i-siamland-massage-spa-pattaya-spa-thailand-09.jpg','Spa interior at I.Siamland Massage & Spa',5),
  ('i-siamland-massage-spa-pattaya','venues/i-siamland-massage-spa-pattaya/i-siamland-massage-spa-pattaya-treatment-room-thailand-10.jpg','Couples treatment room at I.Siamland Massage & Spa',6),
  -- Let's Relax Onsen
  ('let-s-relax-onsen-and-spa-pattaya','venues/let-s-relax-onsen-and-spa-pattaya/let-s-relax-onsen-and-spa-pattaya-courtyard-stone-fountain-thailand-02.jpg','Courtyard stone fountain at Let''s Relax Onsen & Spa Pattaya',0),
  ('let-s-relax-onsen-and-spa-pattaya','venues/let-s-relax-onsen-and-spa-pattaya/let-s-relax-onsen-and-spa-pattaya-relaxation-area-thailand-04.jpg','Relaxation area at Let''s Relax Onsen & Spa Pattaya',1),
  ('let-s-relax-onsen-and-spa-pattaya','venues/let-s-relax-onsen-and-spa-pattaya/let-s-relax-onsen-and-spa-pattaya-spa-reception-thailand-05.jpg','Spa reception at Let''s Relax Onsen & Spa Pattaya',2),
  ('let-s-relax-onsen-and-spa-pattaya','venues/let-s-relax-onsen-and-spa-pattaya/let-s-relax-onsen-and-spa-pattaya-wellness-lounge-thailand-06.jpg','Wellness lounge at Let''s Relax Onsen & Spa Pattaya',3),
  ('let-s-relax-onsen-and-spa-pattaya','venues/let-s-relax-onsen-and-spa-pattaya/let-s-relax-onsen-and-spa-pattaya-aromatherapy-thailand-07.jpg','Aromatherapy treatment at Let''s Relax Onsen & Spa Pattaya',4),
  ('let-s-relax-onsen-and-spa-pattaya','venues/let-s-relax-onsen-and-spa-pattaya/let-s-relax-onsen-and-spa-pattaya-spa-thailand-09.jpg','Spa interior at Let''s Relax Onsen & Spa Pattaya',5),
  ('let-s-relax-onsen-and-spa-pattaya','venues/let-s-relax-onsen-and-spa-pattaya/let-s-relax-onsen-and-spa-pattaya-treatment-room-thailand-10.jpg','Treatment room at Let''s Relax Onsen & Spa Pattaya',6),
  -- Let's Relax North (reuses Terminal 21 photos)
  ('let-s-relax-spa-north-pattaya','venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-courtyard-stone-fountain-thailand-01.jpg','Tropical garden courtyard at Let''s Relax Spa, Pattaya',0),
  ('let-s-relax-spa-north-pattaya','venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-massage-bed-room-thailand-02.jpg','Massage room at Let''s Relax Spa, Pattaya',1),
  ('let-s-relax-spa-north-pattaya','venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-relaxation-area-thailand-04.jpg','Relaxation area at Let''s Relax Spa, Pattaya',2),
  ('let-s-relax-spa-north-pattaya','venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-spa-reception-thailand-05.jpg','Spa reception at Let''s Relax Spa, Pattaya',3),
  ('let-s-relax-spa-north-pattaya','venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-aromatherapy-thailand-07.jpg','Aromatherapy treatment at Let''s Relax Spa, Pattaya',4),
  -- Let's Relax Beach Front
  ('let-s-relax-spa-pattaya-beach-front','venues/let-s-relax-spa-pattaya-beach-front/let-s-relax-spa-pattaya-beach-front-seaview-massage-lounge-thailand-02.jpg','Sea-view massage lounge at Let''s Relax Spa Pattaya Beach Front',0),
  ('let-s-relax-spa-pattaya-beach-front','venues/let-s-relax-spa-pattaya-beach-front/let-s-relax-spa-pattaya-beach-front-relaxation-area-thailand-04.jpg','Relaxation area at Let''s Relax Spa Pattaya Beach Front',1),
  ('let-s-relax-spa-pattaya-beach-front','venues/let-s-relax-spa-pattaya-beach-front/let-s-relax-spa-pattaya-beach-front-spa-reception-thailand-05.jpg','Spa reception at Let''s Relax Spa Pattaya Beach Front',2),
  ('let-s-relax-spa-pattaya-beach-front','venues/let-s-relax-spa-pattaya-beach-front/let-s-relax-spa-pattaya-beach-front-wellness-lounge-thailand-06.jpg','Wellness lounge at Let''s Relax Spa Pattaya Beach Front',3),
  ('let-s-relax-spa-pattaya-beach-front','venues/let-s-relax-spa-pattaya-beach-front/let-s-relax-spa-pattaya-beach-front-aromatherapy-thailand-07.jpg','Aromatherapy treatment at Let''s Relax Spa Pattaya Beach Front',4),
  ('let-s-relax-spa-pattaya-beach-front','venues/let-s-relax-spa-pattaya-beach-front/let-s-relax-spa-pattaya-beach-front-spa-thailand-09.jpg','Spa interior at Let''s Relax Spa Pattaya Beach Front',5),
  ('let-s-relax-spa-pattaya-beach-front','venues/let-s-relax-spa-pattaya-beach-front/let-s-relax-spa-pattaya-beach-front-treatment-room-thailand-10.jpg','Treatment room at Let''s Relax Spa Pattaya Beach Front',6),
  -- Let's Relax Terminal 21
  ('let-s-relax-spa-terminal-21-pattaya','venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-massage-bed-room-thailand-02.jpg','Massage room at Let''s Relax Spa Terminal 21 Pattaya',0),
  ('let-s-relax-spa-terminal-21-pattaya','venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-relaxation-area-thailand-04.jpg','Relaxation area at Let''s Relax Spa Terminal 21 Pattaya',1),
  ('let-s-relax-spa-terminal-21-pattaya','venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-spa-reception-thailand-05.jpg','Spa reception at Let''s Relax Spa Terminal 21 Pattaya',2),
  ('let-s-relax-spa-terminal-21-pattaya','venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-wellness-lounge-thailand-06.jpg','Wellness lounge at Let''s Relax Spa Terminal 21 Pattaya',3),
  ('let-s-relax-spa-terminal-21-pattaya','venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-aromatherapy-thailand-07.jpg','Aromatherapy treatment at Let''s Relax Spa Terminal 21 Pattaya',4),
  ('let-s-relax-spa-terminal-21-pattaya','venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-spa-thailand-09.jpg','Spa interior at Let''s Relax Spa Terminal 21 Pattaya',5),
  ('let-s-relax-spa-terminal-21-pattaya','venues/let-s-relax-spa-terminal-21-pattaya/let-s-relax-spa-terminal-21-pattaya-treatment-room-thailand-10.jpg','Treatment room at Let''s Relax Spa Terminal 21 Pattaya',6),
  -- Makkha (hero venues bucket, rest assets)
  ('makkha-health-spa-pattaya-again-north-pattaya','venues/makkha-health-spa-pattaya-again-north-pattaya/makkha-health-spa-pattaya-again-north-pattaya-marble-statue-bust-thailand-01.jpg','Cave-themed marble statue at Makkha Health & Spa',0),
  ('makkha-health-spa-pattaya-again-north-pattaya','assets/pattaya-massage-1.jpeg','Traditional Thai massage at Makkha Health & Spa',1),
  ('makkha-health-spa-pattaya-again-north-pattaya','assets/pattaya-wellness-1.jpeg','Wellness treatment room at Makkha Health & Spa',2),
  ('makkha-health-spa-pattaya-again-north-pattaya','assets/pattaya-wellnes-2.jpg','Spa relaxation lounge at Makkha Health & Spa',3),
  ('makkha-health-spa-pattaya-again-north-pattaya','assets/pattaya-massage-4.png','Aromatherapy oil massage at Makkha Health & Spa',4),
  ('makkha-health-spa-pattaya-again-north-pattaya','assets/pattaya-massage-2.jpg','Herbal compress therapy at Makkha Health & Spa',5),
  -- Oasis Spa
  ('oasis-spa-pattaya-jomtien','venues/oasis-spa-pattaya-jomtien/oasis-spa-pattaya-jomtien-candlelit-spa-entrance-thailand-01.jpg','Candlelit garden entrance at Oasis Spa Pattaya',0),
  ('oasis-spa-pattaya-jomtien','venues/oasis-spa-pattaya-jomtien/oasis-spa-pattaya-jomtien-relaxation-area-thailand-04.jpg','Relaxation area at Oasis Spa Pattaya',1),
  ('oasis-spa-pattaya-jomtien','venues/oasis-spa-pattaya-jomtien/oasis-spa-pattaya-jomtien-spa-reception-thailand-05.jpg','Spa reception at Oasis Spa Pattaya',2),
  ('oasis-spa-pattaya-jomtien','venues/oasis-spa-pattaya-jomtien/oasis-spa-pattaya-jomtien-wellness-lounge-thailand-06.jpg','Wellness lounge at Oasis Spa Pattaya',3),
  ('oasis-spa-pattaya-jomtien','venues/oasis-spa-pattaya-jomtien/oasis-spa-pattaya-jomtien-aromatherapy-thailand-07.jpg','Aromatherapy treatment at Oasis Spa Pattaya',4),
  ('oasis-spa-pattaya-jomtien','venues/oasis-spa-pattaya-jomtien/oasis-spa-pattaya-jomtien-spa-thailand-09.jpg','Spa villa interior at Oasis Spa Pattaya',5),
  ('oasis-spa-pattaya-jomtien','venues/oasis-spa-pattaya-jomtien/oasis-spa-pattaya-jomtien-twin-massage-room-thailand-02.jpg','Twin massage villa at Oasis Spa Pattaya',6),
  -- Pattaya SPA (assets)
  ('pattaya-spa','assets/pattaya-wellness-1.jpeg','Thai spa ritual room at Pattaya SPA',0),
  ('pattaya-spa','assets/pattaya-massage-1.jpeg','Traditional Thai massage at Pattaya SPA',1),
  ('pattaya-spa','assets/pattaya-wellnes-2.jpg','Spa relaxation lounge at Pattaya SPA',2),
  ('pattaya-spa','assets/pattaya-massage-4.png','Aroma oil massage at Pattaya SPA',3),
  ('pattaya-spa','assets/pattaya-massage-2.jpg','Couples treatment at Pattaya SPA',4),
  -- Poo Na
  ('poo-na-health-massage','venues/poo-na-health-massage/poo-na-health-massage-foot-massage-session-pattaya-thailand-01.jpg','Foot massage session at Poo Na Health Massage',0),
  ('poo-na-health-massage','venues/poo-na-health-massage/poo-na-health-massage-relaxation-area-pattaya-thailand-04.jpg','Relaxation area at Poo Na Health Massage',1),
  ('poo-na-health-massage','venues/poo-na-health-massage/poo-na-health-massage-spa-reception-pattaya-thailand-05.jpg','Reception at Poo Na Health Massage',2),
  ('poo-na-health-massage','venues/poo-na-health-massage/poo-na-health-massage-wellness-lounge-pattaya-thailand-06.jpg','Lounge at Poo Na Health Massage',3),
  ('poo-na-health-massage','venues/poo-na-health-massage/poo-na-health-massage-aromatherapy-pattaya-thailand-07.jpg','Aromatherapy massage at Poo Na Health Massage',4),
  ('poo-na-health-massage','venues/poo-na-health-massage/poo-na-health-massage-spa-pattaya-thailand-09.jpg','Massage interior at Poo Na Health Massage',5),
  ('poo-na-health-massage','venues/poo-na-health-massage/poo-na-health-massage-treatment-room-pattaya-thailand-10.jpg','Treatment room at Poo Na Health Massage',6),
  -- Siladon
  ('siladon-spa-pattaya','venues/siladon-spa-pattaya/siladon-spa-pattaya-spa-reception-lounge-thailand-01.jpg','Reception lounge at Siladon Spa Pattaya',0),
  ('siladon-spa-pattaya','venues/siladon-spa-pattaya/siladon-spa-pattaya-relaxation-area-thailand-04.jpg','Relaxation area at Siladon Spa Pattaya',1),
  ('siladon-spa-pattaya','venues/siladon-spa-pattaya/siladon-spa-pattaya-spa-reception-thailand-05.jpg','Spa reception at Siladon Spa Pattaya',2),
  ('siladon-spa-pattaya','venues/siladon-spa-pattaya/siladon-spa-pattaya-wellness-lounge-thailand-06.jpg','Wellness lounge at Siladon Spa Pattaya',3),
  ('siladon-spa-pattaya','venues/siladon-spa-pattaya/siladon-spa-pattaya-aromatherapy-thailand-07.jpg','Aromatherapy treatment at Siladon Spa Pattaya',4),
  ('siladon-spa-pattaya','venues/siladon-spa-pattaya/siladon-spa-pattaya-spa-thailand-09.jpg','Spa interior at Siladon Spa Pattaya',5),
  ('siladon-spa-pattaya','venues/siladon-spa-pattaya/siladon-spa-pattaya-treatment-room-thailand-10.jpg','Couples treatment room at Siladon Spa Pattaya',6),
  -- The One
  ('the-one-massage-pattaya','venues/the-one-massage-pattaya/the-one-massage-pattaya-outdoor-thai-massage-thailand-02.jpg','Outdoor Thai massage pavilion at The One Massage Pattaya',0),
  ('the-one-massage-pattaya','venues/the-one-massage-pattaya/the-one-massage-pattaya-relaxation-area-thailand-04.jpg','Relaxation area at The One Massage Pattaya',1),
  ('the-one-massage-pattaya','venues/the-one-massage-pattaya/the-one-massage-pattaya-spa-reception-thailand-05.jpg','Spa reception at The One Massage Pattaya',2),
  ('the-one-massage-pattaya','venues/the-one-massage-pattaya/the-one-massage-pattaya-wellness-lounge-thailand-06.jpg','Wellness lounge at The One Massage Pattaya',3),
  ('the-one-massage-pattaya','venues/the-one-massage-pattaya/the-one-massage-pattaya-aromatherapy-thailand-07.jpg','Aromatherapy treatment at The One Massage Pattaya',4),
  ('the-one-massage-pattaya','venues/the-one-massage-pattaya/the-one-massage-pattaya-spa-thailand-09.jpg','Spa interior at The One Massage Pattaya',5),
  ('the-one-massage-pattaya','venues/the-one-massage-pattaya/the-one-massage-pattaya-treatment-room-thailand-10.jpg','Treatment room at The One Massage Pattaya',6),
  -- The Sea.Spa
  ('the-sea-spa-pattaya','venues/the-sea-spa-pattaya/the-sea-spa-pattaya-rose-petal-bath-thailand-02.jpg','Rose-petal bath at The Sea.Spa Pattaya',0),
  ('the-sea-spa-pattaya','venues/the-sea-spa-pattaya/the-sea-spa-pattaya-relaxation-area-thailand-04.jpg','Relaxation area at The Sea.Spa Pattaya',1),
  ('the-sea-spa-pattaya','venues/the-sea-spa-pattaya/the-sea-spa-pattaya-spa-reception-thailand-05.jpg','Spa reception at The Sea.Spa Pattaya',2),
  ('the-sea-spa-pattaya','venues/the-sea-spa-pattaya/the-sea-spa-pattaya-wellness-lounge-thailand-06.jpg','Wellness lounge at The Sea.Spa Pattaya',3),
  ('the-sea-spa-pattaya','venues/the-sea-spa-pattaya/the-sea-spa-pattaya-aromatherapy-thailand-07.jpg','Aromatherapy treatment at The Sea.Spa Pattaya',4),
  ('the-sea-spa-pattaya','venues/the-sea-spa-pattaya/the-sea-spa-pattaya-spa-thailand-09.jpg','Thai garden spa house at The Sea.Spa Pattaya',5),
  ('the-sea-spa-pattaya','venues/the-sea-spa-pattaya/the-sea-spa-pattaya-treatment-room-thailand-10.jpg','Treatment room at The Sea.Spa Pattaya',6),
  -- Tea Tree
  ('tea-tree-spa-pattaya','venues/tea-tree-spa-pattaya/tea-tree-spa-pattaya-oceanview-spa-relaxation-thailand-02.jpg','Ocean-view relaxation lounge at Tea Tree Spa Pattaya',0),
  ('tea-tree-spa-pattaya','venues/tea-tree-spa-pattaya/tea-tree-spa-pattaya-relaxation-area-thailand-04.jpg','Relaxation area at Tea Tree Spa Pattaya',1),
  ('tea-tree-spa-pattaya','venues/tea-tree-spa-pattaya/tea-tree-spa-pattaya-spa-reception-thailand-05.jpg','Spa reception at Tea Tree Spa Pattaya',2),
  ('tea-tree-spa-pattaya','venues/tea-tree-spa-pattaya/tea-tree-spa-pattaya-wellness-lounge-thailand-06.jpg','Wellness lounge at Tea Tree Spa Pattaya',3),
  ('tea-tree-spa-pattaya','venues/tea-tree-spa-pattaya/tea-tree-spa-pattaya-aromatherapy-thailand-07.jpg','Aromatherapy treatment at Tea Tree Spa Pattaya',4),
  ('tea-tree-spa-pattaya','venues/tea-tree-spa-pattaya/tea-tree-spa-pattaya-spa-thailand-09.jpg','Spa interior at Tea Tree Spa Pattaya',5),
  ('tea-tree-spa-pattaya','venues/tea-tree-spa-pattaya/tea-tree-spa-pattaya-treatment-room-thailand-10.jpg','Treatment room at Tea Tree Spa Pattaya',6),
  -- Yunomori
  ('yunomori-onsen-spa-pattaya','venues/yunomori-onsen-spa-pattaya/yunomori-onsen-spa-pattaya-japanese-soaking-bath-thailand-02.jpg','Japanese soaking bath at Yunomori Onsen & Spa Pattaya',0),
  ('yunomori-onsen-spa-pattaya','venues/yunomori-onsen-spa-pattaya/yunomori-onsen-spa-pattaya-relaxation-area-thailand-04.jpg','Relaxation area at Yunomori Onsen & Spa Pattaya',1),
  ('yunomori-onsen-spa-pattaya','venues/yunomori-onsen-spa-pattaya/yunomori-onsen-spa-pattaya-spa-reception-thailand-05.jpg','Spa reception at Yunomori Onsen & Spa Pattaya',2),
  ('yunomori-onsen-spa-pattaya','venues/yunomori-onsen-spa-pattaya/yunomori-onsen-spa-pattaya-wellness-lounge-thailand-06.jpg','Wellness lounge at Yunomori Onsen & Spa Pattaya',3),
  ('yunomori-onsen-spa-pattaya','venues/yunomori-onsen-spa-pattaya/yunomori-onsen-spa-pattaya-aromatherapy-thailand-07.jpg','Aromatherapy treatment at Yunomori Onsen & Spa Pattaya',4),
  ('yunomori-onsen-spa-pattaya','venues/yunomori-onsen-spa-pattaya/yunomori-onsen-spa-pattaya-spa-thailand-09.jpg','Spa interior at Yunomori Onsen & Spa Pattaya',5),
  ('yunomori-onsen-spa-pattaya','venues/yunomori-onsen-spa-pattaya/yunomori-onsen-spa-pattaya-treatment-room-thailand-10.jpg','Treatment room at Yunomori Onsen & Spa Pattaya',6)
) as x(venue_slug, path, alt, so)
join public.venues v on v.slug = x.venue_slug
cross join (select 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/' as u) b;

-- 4 · TREATMENT MENU (multi-duration flattened) -----------------------------
insert into public.venue_menu_items (venue_id, section, name, detail, duration, price, is_featured, sort_order)
select v.id, x.section, x.name, x.detail, x.duration, x.price, x.feat, x.so
from (values
  -- 7 Spa Luxury
  ('7-spa-luxury-pattaya','Signature rituals','Jungle Rain',null,'1 h','฿1,100',true,0),
  ('7-spa-luxury-pattaya','Signature rituals','Elixir of Youth',null,'1.5 h','฿2,310',false,1),
  ('7-spa-luxury-pattaya','Signature rituals','Healing Bliss',null,'2 h','฿2,750',true,2),
  ('7-spa-luxury-pattaya','Signature rituals','Oriental Princess',null,'2 h','฿3,300',false,3),
  ('7-spa-luxury-pattaya','Signature rituals','Oriental Pleasure',null,'3 h','฿3,850',true,4),
  ('7-spa-luxury-pattaya','Signature rituals','Royal Massage Four Hands',null,'3 h','฿4,900',true,5),
  ('7-spa-luxury-pattaya','Signature rituals','Mysterious Splendors of Siam',null,'4 h','฿15,000',true,6),
  ('7-spa-luxury-pattaya','Face & body','Ideal Face',null,'1.5 h','฿2,970',false,7),
  ('7-spa-luxury-pattaya','Face & body','Slim Express',null,'1.5 h','฿3,190',false,8),
  -- 88 Massage
  ('88-massage-and-spa','Indicative local rates','Thai Massage',null,'60 min','~฿200',true,0),
  ('88-massage-and-spa','Indicative local rates','Foot Massage',null,'60 min','~฿200',false,1),
  ('88-massage-and-spa','Indicative local rates','Oil Massage',null,'60 min','~฿300',false,2),
  ('88-massage-and-spa','Indicative local rates','Head & Shoulder Massage',null,'60 min','~฿300',false,3),
  ('88-massage-and-spa','Indicative local rates','2-hour sessions',null,'120 min','~1.5× hourly',false,4),
  -- Grace Spa
  ('grace-spa','Treatments','Thai Massage',null,'1/1.5/2 h','฿1,000–1,300',true,0),
  ('grace-spa','Treatments','Aromatherapy Massage',null,'1/1.5/2 h','฿1,200–1,960',true,1),
  ('grace-spa','Treatments','Swedish Massage',null,'1.5/2 h','฿1,900–2,400',false,2),
  ('grace-spa','Treatments','Hot Stone Massage',null,'1.5/2 h','฿2,500–3,500',false,3),
  ('grace-spa','Treatments','Foot Massage',null,'1 h','฿1,000',false,4),
  ('grace-spa','Signature packages','Touch of Grace',null,'2 h','฿2,300',true,5),
  ('grace-spa','Signature packages','King of Grace',null,'2.5 h','฿2,700',true,6),
  ('grace-spa','Signature packages','Amazing Grace',null,'3.5 h','฿4,700',true,7),
  ('grace-spa','Long programme','Healing Therapy','— 5 sessions (2h each)','5× 2 h','฿30,000',true,8),
  -- Health Land North
  ('health-land-north-pattaya','Spa massage','Traditional Thai Massage',null,'120 min','฿700',true,0),
  ('health-land-north-pattaya','Spa massage','Foot Massage',null,'60 min','฿400',false,1),
  ('health-land-north-pattaya','Spa massage','Aromatherapy Body Massage A',null,'120 min','฿1,500',false,2),
  ('health-land-north-pattaya','Vichy Shower · Pattaya Nua only','Option 1 — scrub + aroma + Vichy',null,'120 min','฿3,800',true,3),
  ('health-land-north-pattaya','Vichy Shower · Pattaya Nua only','Option 2 — aroma + Vichy',null,'90 min','฿2,700',true,4),
  ('health-land-north-pattaya','Ayurvedic & packages','Four Hands Massage',null,'120 min','฿4,000',true,5),
  ('health-land-north-pattaya','Ayurvedic & packages','Body Mind & Spirit package',null,'180 min','฿4,000',true,6),
  ('health-land-north-pattaya','Spa Jacuzzi · couples','Natural Reviver',null,'240 min','฿9,400',true,7),
  ('health-land-north-pattaya','Spa Jacuzzi · couples','Perfect Harmony',null,'210 min','฿6,900',false,8),
  -- Health Land Sukhumvit
  ('health-land-pattaya-sukhumvit-road','Spa massage','Traditional Thai Massage',null,'120 min','฿700',true,0),
  ('health-land-pattaya-sukhumvit-road','Spa massage','Foot Massage',null,'60 min','฿400',false,1),
  ('health-land-pattaya-sukhumvit-road','Spa massage','Aromatherapy Body Massage A',null,'120 min','฿1,500',false,2),
  ('health-land-pattaya-sukhumvit-road','Ayurvedic','Four Hands Massage',null,'120 min','฿4,000',true,3),
  ('health-land-pattaya-sukhumvit-road','Ayurvedic','Shirodhara',null,'60 min','฿2,000',false,4),
  ('health-land-pattaya-sukhumvit-road','Ayurvedic packages','Body Mind & Spirit',null,'180 min','฿4,000',true,5),
  ('health-land-pattaya-sukhumvit-road','Spa Jacuzzi · couples','Natural Reviver',null,'240 min','฿9,400',true,6),
  ('health-land-pattaya-sukhumvit-road','Spa Jacuzzi · couples','Perfect Harmony',null,'210 min','฿6,900',false,7),
  -- I.Siamland (60/90/120)
  ('i-siamland-massage-spa-pattaya','Body massage','Traditional Thai Massage',null,'60/90/120 min','฿300/450/600',true,0),
  ('i-siamland-massage-spa-pattaya','Body massage','Oil Massage',null,'60/90/120 min','฿450/650/850',true,1),
  ('i-siamland-massage-spa-pattaya','Body massage','Deep Tissue Oil Massage',null,'60/90/120 min','฿500/750/950',true,2),
  ('i-siamland-massage-spa-pattaya','Body massage','Aromatherapy Full Body',null,'60/90/120 min','฿550/800/1,000',false,3),
  ('i-siamland-massage-spa-pattaya','Body massage','Thai with Herbal Compression',null,'90/120 min','฿950/1,250',false,4),
  ('i-siamland-massage-spa-pattaya','Foot massage','Foot Massage',null,'60/90 min','฿300/450',true,5),
  ('i-siamland-massage-spa-pattaya','Spa & packages','Hot Stone Massage + free 30-min foot',null,'120 min','฿1,850',true,6),
  ('i-siamland-massage-spa-pattaya','Spa & packages','Candle Massage Therapy + free 30-min foot',null,'120 min','฿1,650',true,7),
  ('i-siamland-massage-spa-pattaya','Spa & packages','Beauty Spa Set — scrub + oil + facial',null,'120 min','฿1,450',false,8),
  -- Let's Relax Onsen
  ('let-s-relax-onsen-and-spa-pattaya','Onsen & bath','Onsen — hot-spring bath, Gero powder',null,'—','฿750',true,0),
  ('let-s-relax-onsen-and-spa-pattaya','Onsen & bath','Akasuri — Japanese peeling',null,'45 min','฿1,000',false,1),
  ('let-s-relax-onsen-and-spa-pattaya','Massages','Thai Massage',null,'120 min','฿1,200',true,2),
  ('let-s-relax-onsen-and-spa-pattaya','Massages','Four-Hands Thai Massage',null,'60/120 min','฿1,400/2,200',true,3),
  ('let-s-relax-onsen-and-spa-pattaya','Massages','Aromatherapy Oil Massage',null,'60/120 min','฿1,300/2,600',false,4),
  ('let-s-relax-onsen-and-spa-pattaya','Massages','Aromatic Hot Stone Massage',null,'90 min','฿2,300',false,5),
  ('let-s-relax-onsen-and-spa-pattaya','Spa packages','Dream Package',null,'90 min','฿1,100',true,6),
  ('let-s-relax-onsen-and-spa-pattaya','Spa packages','Body & Soul',null,'120 min','฿2,500',true,7),
  ('let-s-relax-onsen-and-spa-pattaya','Spa packages','Spa Experience',null,'210 min','฿4,900',true,8),
  -- Let's Relax North
  ('let-s-relax-spa-north-pattaya','Massages','Thai Massage',null,'120 min','฿1,200',true,0),
  ('let-s-relax-spa-north-pattaya','Massages','Four-Hands Thai Massage',null,'60/120 min','฿1,400/2,200',true,1),
  ('let-s-relax-spa-north-pattaya','Massages','Aromatherapy Oil Massage',null,'60/120 min','฿1,300/2,600',false,2),
  ('let-s-relax-spa-north-pattaya','Massages','Aromatic Hot Stone Massage',null,'90 min','฿2,300',false,3),
  ('let-s-relax-spa-north-pattaya','Spa packages','Dream Package',null,'90 min','฿1,100',true,4),
  ('let-s-relax-spa-north-pattaya','Spa packages','Body & Soul',null,'120 min','฿2,500',true,5),
  ('let-s-relax-spa-north-pattaya','Spa packages','Spa Experience',null,'210 min','฿4,900',true,6),
  -- Let's Relax Beach Front
  ('let-s-relax-spa-pattaya-beach-front','Massages','Thai Massage',null,'120 min','฿1,200',true,0),
  ('let-s-relax-spa-pattaya-beach-front','Massages','Four-Hands Thai Massage',null,'60/120 min','฿1,400/2,200',true,1),
  ('let-s-relax-spa-pattaya-beach-front','Massages','Aromatherapy Oil Massage',null,'60/120 min','฿1,300/2,600',false,2),
  ('let-s-relax-spa-pattaya-beach-front','Spa packages','Dream Package',null,'90 min','฿1,100',true,3),
  ('let-s-relax-spa-pattaya-beach-front','Spa packages','Body & Soul',null,'120 min','฿2,500',true,4),
  ('let-s-relax-spa-pattaya-beach-front','Spa packages','Spa Experience',null,'210 min','฿4,900',true,5),
  -- Let's Relax Terminal 21
  ('let-s-relax-spa-terminal-21-pattaya','Massages','Thai Massage',null,'120 min','฿1,200',true,0),
  ('let-s-relax-spa-terminal-21-pattaya','Massages','Four-Hands Thai Massage',null,'60/120 min','฿1,400/2,200',true,1),
  ('let-s-relax-spa-terminal-21-pattaya','Massages','Aromatherapy Oil Massage',null,'60/120 min','฿1,300/2,600',false,2),
  ('let-s-relax-spa-terminal-21-pattaya','Spa packages','Dream Package',null,'90 min','฿1,100',true,3),
  ('let-s-relax-spa-terminal-21-pattaya','Spa packages','Body & Soul',null,'120 min','฿2,500',true,4),
  ('let-s-relax-spa-terminal-21-pattaya','Spa packages','Spa Experience',null,'210 min','฿4,900',true,5),
  -- Makkha
  ('makkha-health-spa-pattaya-again-north-pattaya','Massages','Thai Massage',null,'60 min','฿850',true,0),
  ('makkha-health-spa-pattaya-again-north-pattaya','Massages','Foot Massage',null,'60 min','฿850',true,1),
  ('makkha-health-spa-pattaya-again-north-pattaya','Massages','Aroma Oil Massage',null,'60 min','฿1,390',true,2),
  ('makkha-health-spa-pattaya-again-north-pattaya','Massages','Thai Herbal Ball Massage',null,'60 min','฿1,390',false,3),
  ('makkha-health-spa-pattaya-again-north-pattaya','Massages','4-Hand Aroma Oil Massage',null,'60 min','฿1,990',false,4),
  ('makkha-health-spa-pattaya-again-north-pattaya','Massages','Hot Stone Massage',null,'90 min','฿2,290',true,5),
  ('makkha-health-spa-pattaya-again-north-pattaya','Body & beauty','Body Salt Scrub',null,'60 min','฿1,390',false,6),
  ('makkha-health-spa-pattaya-again-north-pattaya','Body & beauty','Thai Facial Treatment',null,'60 min','฿1,590',false,7),
  -- Oasis (++)
  ('oasis-spa-pattaya-jomtien','Signature packages','Wonderful Oasis',null,'150 min','฿3,500++',true,0),
  ('oasis-spa-pattaya-jomtien','Signature packages','Exotic Oasis',null,'150 min','฿4,600++',false,1),
  ('oasis-spa-pattaya-jomtien','Signature packages','Sabai Stone Massage',null,'120 min','฿4,900++',true,2),
  ('oasis-spa-pattaya-jomtien','Signature packages','Lanna Explorer',null,'240 min','฿6,500++',false,3),
  ('oasis-spa-pattaya-jomtien','Signature packages','Seaside Sensation',null,'300 min','฿7,500++',true,4),
  ('oasis-spa-pattaya-jomtien','À la carte','Aromatherapy Hot Oil Massage (promo)',null,'—','฿1,222',true,5),
  ('oasis-spa-pattaya-jomtien','À la carte','Traditional Thai · Foot · Four-Hand',null,'—','~฿1,200–3,500',false,6),
  -- Pattaya SPA (in ₸)
  ('pattaya-spa','Signature rituals (prices in ₸)','Recovery and Enjoyment · single',null,'180 min','₸40,000',true,0),
  ('pattaya-spa','Signature rituals (prices in ₸)','Sea Energy · single',null,'180 min','₸40,000',true,1),
  ('pattaya-spa','Signature rituals (prices in ₸)','Sabay-Sabay · single',null,'120 min','₸30,000',false,2),
  ('pattaya-spa','Signature rituals (prices in ₸)','Healing Nirvana · couple',null,'120 min','₸50,000',true,3),
  ('pattaya-spa','Signature rituals (prices in ₸)','Royal Pleasure · single',null,'270 min','₸60,000',true,4),
  ('pattaya-spa','Also offered (price on request)','Thai massages / face / body / hair care',null,'—','ask',false,5),
  -- Poo Na
  ('poo-na-health-massage','Massage','Thai Massage',null,'60 min','฿150',true,0),
  ('poo-na-health-massage','Massage','Foot Massage',null,'60 min','฿150',true,1),
  ('poo-na-health-massage','Massage','Head, Neck & Shoulders',null,'60 min','฿200',false,2),
  ('poo-na-health-massage','Massage','Oil Massage',null,'60 min','฿250',false,3),
  ('poo-na-health-massage','Massage','Aroma Therapy Massage',null,'60 min','฿400',false,4),
  -- Siladon (promo (normal))
  ('siladon-spa-pattaya','À la carte (1 hour)','Foot Massage',null,'1 h','฿450 (800)',true,0),
  ('siladon-spa-pattaya','À la carte (1 hour)','Thai Massage',null,'1 h','฿550 (800)',true,1),
  ('siladon-spa-pattaya','À la carte (1 hour)','Aroma Oil Massage',null,'1 h','฿650 (1,600)',false,2),
  ('siladon-spa-pattaya','À la carte (1 hour)','Spa Facial',null,'1 h','฿900 (2,000)',false,3),
  ('siladon-spa-pattaya','Packages · 2 hours','Siladon Harmony','— foot + aroma oil','2 h','฿1,100 (2,300)',true,4),
  ('siladon-spa-pattaya','Packages · 2 hours','Siladon Unwind','— herbal ball + aroma oil','2 h','฿1,200 (2,500)',true,5),
  ('siladon-spa-pattaya','Packages · 3–4 hours','Siladon Indulge','— foot + herbal ball + aroma oil','3 h','฿1,700 (3,300)',true,6),
  ('siladon-spa-pattaya','Packages · 3–4 hours','Siladon Royal','— foot + scrub + oil + facial','4 h','฿2,400 (4,700)',false,7),
  ('siladon-spa-pattaya','Package · 5 hours','Siladon Bliss','— foot + scrub + ball + oil + facial','5 h','฿2,800 (5,500)',true,8),
  -- The One (60/90/120)
  ('the-one-massage-pattaya','Massages','Foot Massage',null,'60/90/120 min','฿450/650/900',true,0),
  ('the-one-massage-pattaya','Massages','Royal Thai Body Massage',null,'60/90/120 min','฿650/950/1,200',true,1),
  ('the-one-massage-pattaya','Massages','Aroma Oil Massage',null,'60/90/120 min','฿1,150/1,550/1,900',true,2),
  ('the-one-massage-pattaya','Massages','Hot Stone Massage',null,'90/120 min','฿2,250/2,650',true,3),
  ('the-one-massage-pattaya','Signature packages','The One Signature — aroma oil + herbal compress',null,'120 min','฿2,450',true,4),
  ('the-one-massage-pattaya','Signature packages','The One Ultimate — scrub + aroma oil + compress',null,'150 min','฿3,150',true,5),
  -- The Sea.Spa (60/90/120)
  ('the-sea-spa-pattaya','Massages','Thai Massage',null,'60/90/120 min','฿350/500/700',true,0),
  ('the-sea-spa-pattaya','Massages','Oil Massage',null,'60/90/120 min','฿400/600/800',true,1),
  ('the-sea-spa-pattaya','Massages','Aroma Massage',null,'60/90/120 min','฿500/750/1,000',false,2),
  ('the-sea-spa-pattaya','Massages','Hot Aroma Massage',null,'60/90/120 min','฿700/1,050/1,400',true,3),
  ('the-sea-spa-pattaya','Signature & spa','Hot Stone Massage',null,'90/120 min','฿1,800/2,400',true,4),
  ('the-sea-spa-pattaya','Signature & spa','Day Dream — body scrub + oil massage',null,'90/120 min','฿1,300/1,700',false,5),
  -- Tea Tree (incl. tax)
  ('tea-tree-spa-pattaya','Delight · massages','Traditional Thai Massage',null,'60/90/120 min','฿1,500–2,200',true,0),
  ('tea-tree-spa-pattaya','Delight · massages','Aromatherapy Signature Massage',null,'60/90/120 min','฿1,900–2,800',true,1),
  ('tea-tree-spa-pattaya','Delight · massages','Himalayan Hot Stone Massage',null,'90/120 min','฿2,200/2,600',false,2),
  ('tea-tree-spa-pattaya','Delight · massages','Foot Massage',null,'30/60 min','฿600/1,000',false,3),
  ('tea-tree-spa-pattaya','Indulge · signature','Tea Tree Signature Experience',null,'150 min','฿3,500',true,4),
  ('tea-tree-spa-pattaya','Pamper · packages','Couple''s Retreat',null,'120 min','฿6,000 (per couple)',true,5),
  ('tea-tree-spa-pattaya','Dermalogica facials','Intense Hydrating Facial',null,'60 min','฿2,000',false,6),
  ('tea-tree-spa-pattaya','Kids'' menu · 6–11 yrs','Little Tropical Spa',null,'60 min','฿1,000',false,7),
  -- Yunomori (incl. VAT)
  ('yunomori-onsen-spa-pattaya','Truly Authentic · Thai','Traditional Balance — Thai massage',null,'60/90/120 min','฿1,250/1,450/1,700',true,0),
  ('yunomori-onsen-spa-pattaya','Truly Authentic · Thai','Tense Release — Thai + herbal compress',null,'90 min','฿1,950',true,1),
  ('yunomori-onsen-spa-pattaya','Wellness Collection','Muscle Relief — deep tissue',null,'90 min','฿2,500',true,2),
  ('yunomori-onsen-spa-pattaya','Relax & Balance','Pure Relaxation — aromatherapy',null,'90 min','฿2,475',true,3),
  ('yunomori-onsen-spa-pattaya','Relax & Balance','Soft Skin — body scrub',null,'60 min','฿3,475',false,4),
  ('yunomori-onsen-spa-pattaya','Beauty & Herbs','Nurture Your Beauty — facial',null,'60 min','฿2,600',false,5),
  ('yunomori-onsen-spa-pattaya','À la carte highlights','Thai massage',null,'60 min','฿650',true,6),
  ('yunomori-onsen-spa-pattaya','À la carte highlights','Korean scrub',null,'30 min','฿750',false,7)
) as x(venue_slug, section, name, detail, duration, price, feat, so)
join public.venues v on v.slug = x.venue_slug;

-- 5 · QUICK FACTS (4 per venue) ---------------------------------------------
insert into public.venue_quick_facts (venue_id, icon, value, label, sort_order)
select v.id, x.icon, x.value, x.label, x.so
from (values
  ('7-spa-luxury-pattaya','pg-star','4.7 / 5','544 reviews',0),('7-spa-luxury-pattaya','pg-info','From ฿1,100','1-hour ritual',1),('7-spa-luxury-pattaya','pg-wellness','Sea-salt jacuzzi','Outdoor + herbal sauna',2),('7-spa-luxury-pattaya','pg-massage','17+ programmes','1.5–4 hour rituals',3),
  ('88-massage-and-spa','pg-star','4.6 / 5','497 reviews',0),('88-massage-and-spa','pg-info','~฿200','60-min Thai massage',1),('88-massage-and-spa','pg-globe','Korean favourite','Big YouTube / TikTok',2),('88-massage-and-spa','pg-massage','Hands-on','Traditional massage',3),
  ('grace-spa','pg-star','4.8 / 5','1,401 reviews',0),('grace-spa','pg-info','From ฿1,000','60-min Thai massage',1),('grace-spa','pg-wellness','100% teak resort','Private villas',2),('grace-spa','pg-globe','Thai · EN · KR','Multilingual staff',3),
  ('health-land-north-pattaya','pg-star','4.2 / 5','1,590 reviews',0),('health-land-north-pattaya','pg-info','From ฿400','60-min foot massage',1),('health-land-north-pattaya','pg-wellness','Vichy Shower','Rare in Pattaya',2),('health-land-north-pattaya','pg-massage','Spa Jacuzzi','Couples suites',3),
  ('health-land-pattaya-sukhumvit-road','pg-star','4.5 / 5','1,606 reviews',0),('health-land-pattaya-sukhumvit-road','pg-info','From ฿400','60-min foot massage',1),('health-land-pattaya-sukhumvit-road','pg-wellness','Ayurveda','Shirodhara · Abhyanga',2),('health-land-pattaya-sukhumvit-road','pg-massage','Spa Jacuzzi','Couples suites here',3),
  ('i-siamland-massage-spa-pattaya','pg-star','4.8 / 5','428 reviews',0),('i-siamland-massage-spa-pattaya','pg-info','From ฿300','60-min Thai massage',1),('i-siamland-massage-spa-pattaya','pg-wellness','Herbal compress','Signature treatment',2),('i-siamland-massage-spa-pattaya','pg-massage','Couples rooms','Two locations',3),
  ('let-s-relax-onsen-and-spa-pattaya','pg-wellness','Sea-view onsen','Thailand''s first',0),('let-s-relax-onsen-and-spa-pattaya','pg-info','฿750','Onsen · Gero powder',1),('let-s-relax-onsen-and-spa-pattaya','pg-massage','Full spa menu','Thai · aroma · facial',2),('let-s-relax-onsen-and-spa-pattaya','pg-clock','3,000 m²','Open till midnight',3),
  ('let-s-relax-spa-north-pattaya','pg-star','4.3 / 5','822 reviews',0),('let-s-relax-spa-north-pattaya','pg-info','From ฿350','Back & shoulder',1),('let-s-relax-spa-north-pattaya','pg-wellness','Onsen on site','Hot-spring bath ฿750',2),('let-s-relax-spa-north-pattaya','pg-clock','Open till midnight','Late-night spa',3),
  ('let-s-relax-spa-pattaya-beach-front','pg-star','4.6 / 5','658 reviews',0),('let-s-relax-spa-pattaya-beach-front','pg-info','From ฿350','Back & shoulder',1),('let-s-relax-spa-pattaya-beach-front','pg-wellness','Seaside setting','On Beach Road',2),('let-s-relax-spa-pattaya-beach-front','pg-clock','Till midnight','Late spa hours',3),
  ('let-s-relax-spa-terminal-21-pattaya','pg-star','4.5 / 5','444 reviews',0),('let-s-relax-spa-terminal-21-pattaya','pg-info','From ฿350','Back & shoulder',1),('let-s-relax-spa-terminal-21-pattaya','pg-pin','Inside the mall','Italy Street Zone',2),('let-s-relax-spa-terminal-21-pattaya','pg-wellness','Dr. Spiller','Facial series',3),
  ('makkha-health-spa-pattaya-again-north-pattaya','pg-star','4.9 / 5','661 reviews',0),('makkha-health-spa-pattaya-again-north-pattaya','pg-info','From ฿850','60-min Thai massage',1),('makkha-health-spa-pattaya-again-north-pattaya','pg-wellness','Cave-themed','Boutique chain',2),('makkha-health-spa-pattaya-again-north-pattaya','pg-directions','Free shuttle','Min. ฿1,000 order',3),
  ('oasis-spa-pattaya-jomtien','pg-star','4.8 / 5','1,330 reviews',0),('oasis-spa-pattaya-jomtien','pg-info','From ฿1,222','Aroma hot-oil promo',1),('oasis-spa-pattaya-jomtien','pg-wellness','Private villas','Jacuzzi · steam',2),('oasis-spa-pattaya-jomtien','pg-directions','Free transfer','Within Pattaya',3),
  ('pattaya-spa','pg-star','4.6 / 5','474 reviews',0),('pattaya-spa','pg-wellness','Spa rituals','Single & couples',1),('pattaya-spa','pg-sun','On-site restaurant','Dine after your ritual',2),('pattaya-spa','pg-info','Prices in ₸','Quoted in Kazakh Tenge',3),
  ('poo-na-health-massage','pg-star','4.4 / 5','961 reviews',0),('poo-na-health-massage','pg-info','From ฿150','60-min Thai massage',1),('poo-na-health-massage','pg-pin','Soi Buakhao','Central, near Central Rd',2),('poo-na-health-massage','pg-check','Walk-in','Newly renovated',3),
  ('siladon-spa-pattaya','pg-star','4.9 / 5','902 reviews',0),('siladon-spa-pattaya','pg-info','From ฿450','Promo foot massage',1),('siladon-spa-pattaya','pg-massage','2–5 h packages','Tiered signatures',2),('siladon-spa-pattaya','pg-check','Family-friendly','Couples & kids',3),
  ('the-one-massage-pattaya','pg-star','4.9 / 5','5,364 reviews',0),('the-one-massage-pattaya','pg-info','From ฿450','60-min foot massage',1),('the-one-massage-pattaya','pg-massage','Signature packages','Up to 150 min',2),('the-one-massage-pattaya','pg-check','Refreshments','Mango sticky rice / tea',3),
  ('the-sea-spa-pattaya','pg-star','4.7 / 5','619 reviews',0),('the-sea-spa-pattaya','pg-info','From ฿350','60-min Thai massage',1),('the-sea-spa-pattaya','pg-wellness','Thai garden house','Tranquil setting',2),('the-sea-spa-pattaya','pg-parking','Private parking','Certified therapists',3),
  ('tea-tree-spa-pattaya','pg-star','5.0 / 5','804 reviews',0),('tea-tree-spa-pattaya','pg-info','From ฿600','30-min foot massage',1),('tea-tree-spa-pattaya','pg-wellness','Dermalogica','Facials',2),('tea-tree-spa-pattaya','pg-card','Incl. 10% + 7%','Service & VAT included',3),
  ('yunomori-onsen-spa-pattaya','pg-wellness','Japanese onsen','Natural hot-spring baths',0),('yunomori-onsen-spa-pattaya','pg-info','From ฿650','Onsen day pass',1),('yunomori-onsen-spa-pattaya','pg-massage','20+ treatments','Massage · scrub · facial',2),('yunomori-onsen-spa-pattaya','pg-card','Card accepted','7% VAT included',3)
) as x(venue_slug, icon, value, label, so)
join public.venues v on v.slug = x.venue_slug;

-- 6 · TREATMENT TAGS --------------------------------------------------------
insert into public.venue_treatment_tags (venue_id, label, color, sort_order)
select v.id, x.label, x.color, x.so
from (values
  ('7-spa-luxury-pattaya','Four-hand royal','blue',0),('7-spa-luxury-pattaya','Aromatherapy','blue',1),('7-spa-luxury-pattaya','Ginseng facial','blue',2),('7-spa-luxury-pattaya','Sea-salt jacuzzi','cyan',3),('7-spa-luxury-pattaya','Herbal sauna','cyan',4),
  ('88-massage-and-spa','Thai massage','blue',0),('88-massage-and-spa','Oil massage','blue',1),('88-massage-and-spa','Foot massage','blue',2),('88-massage-and-spa','Head & shoulder','cyan',3),
  ('grace-spa','Thai massage','blue',0),('grace-spa','Aromatherapy','blue',1),('grace-spa','Hot stone','blue',2),('grace-spa','Swedish','cyan',3),('grace-spa','Couples packages','cyan',4),
  ('health-land-north-pattaya','Traditional Thai','blue',0),('health-land-north-pattaya','Vichy Shower','blue',1),('health-land-north-pattaya','Ayurveda','cyan',2),('health-land-north-pattaya','Couples suites','cyan',3),
  ('health-land-pattaya-sukhumvit-road','Traditional Thai','blue',0),('health-land-pattaya-sukhumvit-road','Foot reflexology','blue',1),('health-land-pattaya-sukhumvit-road','Ayurveda','cyan',2),('health-land-pattaya-sukhumvit-road','Couples suites','cyan',3),
  ('i-siamland-massage-spa-pattaya','Thai massage','blue',0),('i-siamland-massage-spa-pattaya','Deep tissue oil','blue',1),('i-siamland-massage-spa-pattaya','Herbal compress','blue',2),('i-siamland-massage-spa-pattaya','Couples spa','cyan',3),
  ('let-s-relax-onsen-and-spa-pattaya','Onsen bathing','blue',0),('let-s-relax-onsen-and-spa-pattaya','Four-hand','blue',1),('let-s-relax-onsen-and-spa-pattaya','Akasuri peeling','cyan',2),('let-s-relax-onsen-and-spa-pattaya','Hot stone','cyan',3),
  ('let-s-relax-spa-north-pattaya','Thai massage','blue',0),('let-s-relax-spa-north-pattaya','Four-hand','blue',1),('let-s-relax-spa-north-pattaya','Dr. Spiller facials','cyan',2),('let-s-relax-spa-north-pattaya','Onsen','cyan',3),
  ('let-s-relax-spa-pattaya-beach-front','Thai massage','blue',0),('let-s-relax-spa-pattaya-beach-front','Four-hand','blue',1),('let-s-relax-spa-pattaya-beach-front','Hot stone','blue',2),('let-s-relax-spa-pattaya-beach-front','Dr. Spiller facials','cyan',3),
  ('let-s-relax-spa-terminal-21-pattaya','Thai massage','blue',0),('let-s-relax-spa-terminal-21-pattaya','Four-hand','blue',1),('let-s-relax-spa-terminal-21-pattaya','Dr. Spiller facials','cyan',2),('let-s-relax-spa-terminal-21-pattaya','Aromatherapy','cyan',3),
  ('makkha-health-spa-pattaya-again-north-pattaya','Thai massage','blue',0),('makkha-health-spa-pattaya-again-north-pattaya','Aroma oil','blue',1),('makkha-health-spa-pattaya-again-north-pattaya','Herbal ball','blue',2),('makkha-health-spa-pattaya-again-north-pattaya','Hot stone','cyan',3),
  ('oasis-spa-pattaya-jomtien','Lanna rituals','blue',0),('oasis-spa-pattaya-jomtien','Aromatherapy','blue',1),('oasis-spa-pattaya-jomtien','Hydrotherapy','blue',2),('oasis-spa-pattaya-jomtien','Four-hand','cyan',3),
  ('pattaya-spa','Thai massage','blue',0),('pattaya-spa','Spa rituals','blue',1),('pattaya-spa','Couples treatments','blue',2),('pattaya-spa','Body care','cyan',3),
  ('poo-na-health-massage','Thai massage','blue',0),('poo-na-health-massage','Foot massage','blue',1),('poo-na-health-massage','Oil massage','blue',2),('poo-na-health-massage','Aromatherapy','cyan',3),
  ('siladon-spa-pattaya','Thai massage','blue',0),('siladon-spa-pattaya','Aroma oil','blue',1),('siladon-spa-pattaya','Herbal ball','blue',2),('siladon-spa-pattaya','Spa facial','cyan',3),('siladon-spa-pattaya','Couples room','cyan',4),
  ('the-one-massage-pattaya','Thai massage','blue',0),('the-one-massage-pattaya','Aroma oil','blue',1),('the-one-massage-pattaya','Herbal compress','blue',2),('the-one-massage-pattaya','Hot stone','cyan',3),('the-one-massage-pattaya','Body scrub','cyan',4),
  ('the-sea-spa-pattaya','Thai massage','blue',0),('the-sea-spa-pattaya','Oil massage','blue',1),('the-sea-spa-pattaya','Aromatherapy','blue',2),('the-sea-spa-pattaya','Hot stone','cyan',3),('the-sea-spa-pattaya','Herbal ball','cyan',4),
  ('tea-tree-spa-pattaya','Thai massage','blue',0),('tea-tree-spa-pattaya','Aromatherapy','blue',1),('tea-tree-spa-pattaya','Himalayan hot stone','blue',2),('tea-tree-spa-pattaya','Dermalogica facials','cyan',3),('tea-tree-spa-pattaya','Kids'' menu','cyan',4),
  ('yunomori-onsen-spa-pattaya','Onsen bathing','blue',0),('yunomori-onsen-spa-pattaya','Thai massage','blue',1),('yunomori-onsen-spa-pattaya','Deep tissue','cyan',2),('yunomori-onsen-spa-pattaya','Facials','cyan',3)
) as x(venue_slug, label, color, so)
join public.venues v on v.slug = x.venue_slug;

-- 7 · FACILITIES ------------------------------------------------------------
insert into public.venue_facilities (venue_id, icon, label, sort_order)
select v.id, x.icon, x.label, x.so
from (values
  ('7-spa-luxury-pattaya','pg-wellness','Outdoor sea-salt jacuzzi',0),('7-spa-luxury-pattaya','pg-sun','Herbal sauna',1),('7-spa-luxury-pattaya','pg-check','Certified therapists',2),('7-spa-luxury-pattaya','pg-massage','Couples rooms',3),('7-spa-luxury-pattaya','pg-globe','Multilingual (CN · KR)',4),('7-spa-luxury-pattaya','pg-parking','On-site parking',5),
  ('88-massage-and-spa','pg-check','Walk-ins welcome',0),('88-massage-and-spa','pg-air-con','Air-conditioned',1),('88-massage-and-spa','pg-globe','Korean-friendly',2),('88-massage-and-spa','pg-massage','Traditional hands-on massage',3),
  ('grace-spa','pg-wellness','Private teak villas',0),('grace-spa','pg-massage','Couples rooms',1),('grace-spa','pg-globe','Thai · English · Korean',2),('grace-spa','pg-card','Card accepted',3),('grace-spa','pg-parking','On-site parking',4),('grace-spa','pg-wellness','Herbal compress',5),
  ('health-land-north-pattaya','pg-wellness','Vichy Shower room',0),('health-land-north-pattaya','pg-wellness','Spa Jacuzzi suites',1),('health-land-north-pattaya','pg-massage','Couples rooms',2),('health-land-north-pattaya','pg-air-con','Air-conditioned',3),('health-land-north-pattaya','pg-parking','On-site parking',4),('health-land-north-pattaya','pg-card','Card accepted',5),
  ('health-land-pattaya-sukhumvit-road','pg-massage','Private treatment rooms',0),('health-land-pattaya-sukhumvit-road','pg-wellness','Spa Jacuzzi suites',1),('health-land-pattaya-sukhumvit-road','pg-massage','Couples rooms',2),('health-land-pattaya-sukhumvit-road','pg-air-con','Air-conditioned',3),('health-land-pattaya-sukhumvit-road','pg-parking','On-site parking',4),('health-land-pattaya-sukhumvit-road','pg-card','Card accepted',5),
  ('i-siamland-massage-spa-pattaya','pg-massage','Private treatment rooms',0),('i-siamland-massage-spa-pattaya','pg-massage','Couples rooms',1),('i-siamland-massage-spa-pattaya','pg-check','Spotlessly clean',2),('i-siamland-massage-spa-pattaya','pg-wellness','Herbal compress',3),('i-siamland-massage-spa-pattaya','pg-air-con','Air-conditioned',4),('i-siamland-massage-spa-pattaya','pg-globe','English-speaking staff',5),
  ('let-s-relax-onsen-and-spa-pattaya','pg-wellness','Sea-view Japanese onsen',0),('let-s-relax-onsen-and-spa-pattaya','pg-sun','Sauna & steam rooms',1),('let-s-relax-onsen-and-spa-pattaya','pg-massage','Couples rooms',2),('let-s-relax-onsen-and-spa-pattaya','pg-air-con','Air-conditioned',3),('let-s-relax-onsen-and-spa-pattaya','pg-parking','On-site parking',4),('let-s-relax-onsen-and-spa-pattaya','pg-card','Card accepted',5),
  ('let-s-relax-spa-north-pattaya','pg-wellness','Onsen hot-spring bath',0),('let-s-relax-spa-north-pattaya','pg-massage','Couples rooms',1),('let-s-relax-spa-north-pattaya','pg-air-con','Air-conditioned',2),('let-s-relax-spa-north-pattaya','pg-sun','Tropical garden setting',3),('let-s-relax-spa-north-pattaya','pg-parking','On-site parking',4),('let-s-relax-spa-north-pattaya','pg-card','Card accepted',5),
  ('let-s-relax-spa-pattaya-beach-front','pg-wellness','Seaside / sea-view rooms',0),('let-s-relax-spa-pattaya-beach-front','pg-massage','Couples rooms',1),('let-s-relax-spa-pattaya-beach-front','pg-air-con','Air-conditioned',2),('let-s-relax-spa-pattaya-beach-front','pg-globe','On Beach Road',3),('let-s-relax-spa-pattaya-beach-front','pg-card','Card accepted',4),('let-s-relax-spa-pattaya-beach-front','pg-check','Walk-ins welcome',5),
  ('let-s-relax-spa-terminal-21-pattaya','pg-pin','Inside Terminal 21 mall',0),('let-s-relax-spa-terminal-21-pattaya','pg-massage','Couples rooms',1),('let-s-relax-spa-terminal-21-pattaya','pg-air-con','Air-conditioned',2),('let-s-relax-spa-terminal-21-pattaya','pg-card','Card accepted',3),('let-s-relax-spa-terminal-21-pattaya','pg-parking','On-site parking',4),('let-s-relax-spa-terminal-21-pattaya','pg-check','Walk-ins welcome',5),
  ('makkha-health-spa-pattaya-again-north-pattaya','pg-wellness','Cave-inspired design',0),('makkha-health-spa-pattaya-again-north-pattaya','pg-massage','Couples rooms',1),('makkha-health-spa-pattaya-again-north-pattaya','pg-directions','Free Pattaya shuttle',2),('makkha-health-spa-pattaya-again-north-pattaya','pg-sun','Post-massage refreshments',3),('makkha-health-spa-pattaya-again-north-pattaya','pg-parking','On-site parking',4),('makkha-health-spa-pattaya-again-north-pattaya','pg-air-con','Air-conditioned',5),
  ('oasis-spa-pattaya-jomtien','pg-wellness','Private garden villas',0),('oasis-spa-pattaya-jomtien','pg-wellness','Jacuzzi & steam room',1),('oasis-spa-pattaya-jomtien','pg-massage','Couples rooms',2),('oasis-spa-pattaya-jomtien','pg-directions','Free Pattaya transfer',3),('oasis-spa-pattaya-jomtien','pg-globe','Multilingual (incl. JP)',4),('oasis-spa-pattaya-jomtien','pg-card','Card accepted',5),
  ('pattaya-spa','pg-wellness','Spa rituals',0),('pattaya-spa','pg-massage','Couples rooms',1),('pattaya-spa','pg-sun','On-site restaurant',2),('pattaya-spa','pg-globe','Russian-speaking staff',3),('pattaya-spa','pg-air-con','Air-conditioned',4),('pattaya-spa','pg-card','Card accepted',5),
  ('poo-na-health-massage','pg-check','Walk-ins welcome',0),('poo-na-health-massage','pg-air-con','Air-conditioned',1),('poo-na-health-massage','pg-check','Newly renovated',2),('poo-na-health-massage','pg-globe','English-speaking staff',3),('poo-na-health-massage','pg-sun','Post-massage refreshments',4),('poo-na-health-massage','pg-pin','Central Soi Buakhao',5),
  ('siladon-spa-pattaya','pg-massage','Couples rooms',0),('siladon-spa-pattaya','pg-check','Child-friendly',1),('siladon-spa-pattaya','pg-wellness','Natural local products',2),('siladon-spa-pattaya','pg-air-con','Air-conditioned',3),('siladon-spa-pattaya','pg-check','Walk-ins welcome',4),('siladon-spa-pattaya','pg-globe','English-speaking staff',5),
  ('the-one-massage-pattaya','pg-massage','Private treatment rooms',0),('the-one-massage-pattaya','pg-air-con','Air-conditioned',1),('the-one-massage-pattaya','pg-globe','English-speaking staff',2),('the-one-massage-pattaya','pg-sun','Post-massage refreshments',3),('the-one-massage-pattaya','pg-wellness','Herbal compress',4),('the-one-massage-pattaya','pg-check','Walk-ins welcome',5),
  ('the-sea-spa-pattaya','pg-wellness','Thai garden house',0),('the-sea-spa-pattaya','pg-massage','Couples rooms',1),('the-sea-spa-pattaya','pg-check','Certified in-house therapists',2),('the-sea-spa-pattaya','pg-parking','On-site parking',3),('the-sea-spa-pattaya','pg-air-con','Air-conditioned',4),('the-sea-spa-pattaya','pg-sun','Post-massage refreshments',5),
  ('tea-tree-spa-pattaya','pg-wellness','Ocean-view spa',0),('tea-tree-spa-pattaya','pg-massage','Couples rooms',1),('tea-tree-spa-pattaya','pg-star','Dermalogica products',2),('tea-tree-spa-pattaya','pg-check','Kids'' menu',3),('tea-tree-spa-pattaya','pg-card','Card accepted',4),('tea-tree-spa-pattaya','pg-globe','Inside Holiday Inn',5),
  ('yunomori-onsen-spa-pattaya','pg-wellness','Japanese onsen baths',0),('yunomori-onsen-spa-pattaya','pg-check','Towels & yukata provided',1),('yunomori-onsen-spa-pattaya','pg-sun','On-site café',2),('yunomori-onsen-spa-pattaya','pg-star','Beauty clinic',3),('yunomori-onsen-spa-pattaya','pg-parking','On-site parking',4),('yunomori-onsen-spa-pattaya','pg-globe','English · Thai · Japanese',5)
) as x(venue_slug, icon, label, so)
join public.venues v on v.slug = x.venue_slug;

-- 8 · HIGHLIGHTS (Good to know) ---------------------------------------------
insert into public.venue_highlights (venue_id, label, sort_order)
select v.id, x.label, x.so
from (values
  ('7-spa-luxury-pattaya','Outdoor sea-salt jacuzzi & herbal sauna on site',0),('7-spa-luxury-pattaya','Ministry of Health-certified therapists',1),('7-spa-luxury-pattaya','Long ''ritual''-style programmes (1.5–4 hours)',2),('7-spa-luxury-pattaya','Strong international focus (Chinese, Korean support)',3),('7-spa-luxury-pattaya','Established 2007 — a teak luxury sanctuary',4),
  ('88-massage-and-spa','Strong Korean following (YouTube / TikTok)',0),('88-massage-and-spa','Traditional, hands-on massage — no big-facility frills',1),('88-massage-and-spa','Hours aren''t published — confirm before visiting',2),('88-massage-and-spa','Prices shown are area reference rates, not confirmed',3),('88-massage-and-spa','Central Pattaya, Soi Chalermphrakiat 6',4),
  ('grace-spa','Built entirely from teak as a resort of private villas',0),('grace-spa','Multilingual staff — Thai, English & Korean',1),('grace-spa','Credit cards accepted',2),('grace-spa','Wide couples & signature package range',3),('grace-spa','Booking recommended for villas & packages',4),
  ('health-land-north-pattaya','One of only two Health Land branches with Vichy Shower',0),('health-land-north-pattaya','Couples Spa-Jacuzzi suites available',1),('health-land-north-pattaya','Walk-ins accepted; book ahead on weekends',2),('health-land-north-pattaya','Serves the North Pattaya / Naklua side',3),('health-land-north-pattaya','Gift vouchers available',4),
  ('health-land-pattaya-sukhumvit-road','Walk-ins accepted; book ahead on weekends',0),('health-land-pattaya-sukhumvit-road','Spa-Jacuzzi couples suites offered here',1),('health-land-pattaya-sukhumvit-road','Vichy Shower is only at the Pattaya Nua branch',2),('health-land-pattaya-sukhumvit-road','Close to Jomtien, Floating Market & Thepprasit Market',3),('health-land-pattaya-sukhumvit-road','Gift vouchers available',4),
  ('i-siamland-massage-spa-pattaya','Consistently praised as spotlessly clean & professional',0),('i-siamland-massage-spa-pattaya','Signature herbal-compress massage',1),('i-siamland-massage-spa-pattaya','Private rooms & dedicated couples spa rooms',2),('i-siamland-massage-spa-pattaya','Several packages include a free 30-min foot massage',3),('i-siamland-massage-spa-pattaya','Two locations (Phra Tamnak)',4),
  ('let-s-relax-onsen-and-spa-pattaya','Thailand''s first sea-view Japanese onsen (7th floor)',0),('let-s-relax-onsen-and-spa-pattaya','Onsen uses hot-spring powder from Gero, Japan',1),('let-s-relax-onsen-and-spa-pattaya','Onsen bathing areas are gender-separated',2),('let-s-relax-onsen-and-spa-pattaya','Open until midnight — late soaks welcome',3),('let-s-relax-onsen-and-spa-pattaya','Full Let''s Relax spa menu alongside the onsen',4),
  ('let-s-relax-spa-north-pattaya','Open until midnight — a rare late-night premium spa',0),('let-s-relax-spa-north-pattaya','Onsen hot-spring bath available (฿750)',1),('let-s-relax-spa-north-pattaya','Parking is at the Sunshine Garden Hotel',2),('let-s-relax-spa-north-pattaya','Dr. Spiller products used for facials',3),('let-s-relax-spa-north-pattaya','Booking recommended on weekends',4),
  ('let-s-relax-spa-pattaya-beach-front','Right on Beach Road (Soi 12), seaside setting',0),('let-s-relax-spa-pattaya-beach-front','Some treatment rooms have a sea view',1),('let-s-relax-spa-pattaya-beach-front','Open until midnight',2),('let-s-relax-spa-pattaya-beach-front','Onsen is at the separate Grande Centre Point branch',3),('let-s-relax-spa-pattaya-beach-front','Bookable via Klook, Trip.com, Traveloka',4),
  ('let-s-relax-spa-terminal-21-pattaya','Inside Terminal 21 mall, Italy Street Zone, 1st floor',0),('let-s-relax-spa-terminal-21-pattaya','Connected to Grande Centre Point Pattaya',1),('let-s-relax-spa-terminal-21-pattaya','Dr. Spiller facial series',2),('let-s-relax-spa-terminal-21-pattaya','The onsen is at the separate Grande Centre Point branch',3),('let-s-relax-spa-terminal-21-pattaya','Booking recommended; arrive 20 minutes early',4),
  ('makkha-health-spa-pattaya-again-north-pattaya','Free Pattaya-wide shuttle (min. ฿1,000 order)',0),('makkha-health-spa-pattaya-again-north-pattaya','Welcome & post-massage refreshments included',1),('makkha-health-spa-pattaya-again-north-pattaya','Cave-themed ''Deep Peace'' design, opposite Terminal 21',2),('makkha-health-spa-pattaya-again-north-pattaya','Massages recommended for ages 12 and over',3),('makkha-health-spa-pattaya-again-north-pattaya','Online booking via book.makkhahealthandspa.com',4),
  ('oasis-spa-pattaya-jomtien','Free round-trip transfer within Pattaya for spa guests',0),('oasis-spa-pattaya-jomtien','Prices are quoted ++ (service charge & tax extra)',1),('oasis-spa-pattaya-jomtien','Premium, package-led — most experiences are multi-hour',2),('oasis-spa-pattaya-jomtien','Private garden villas with jacuzzi & steam',3),('oasis-spa-pattaya-jomtien','Multilingual service, including Japanese',4),
  ('pattaya-spa','Oriented to the Russian-speaking / CIS market',0),('pattaya-spa','Published prices are in Kazakh Tenge (₸), not THB',1),('pattaya-spa','On-site restaurant — dine after your ritual',2),('pattaya-spa','Single & couples ritual packages',3),('pattaya-spa','Full menu & 3D tour on pattayaspa.kz',4),
  ('poo-na-health-massage','Budget local pricing — among the cheapest on this list',0),('poo-na-health-massage','Central Soi Buakhao location, near Central Road',1),('poo-na-health-massage','Newly renovated, walk-in friendly',2),('poo-na-health-massage','Published prices may be shop entry rates — confirm on arrival',3),('poo-na-health-massage','Cash is the easiest payment',4),
  ('siladon-spa-pattaya','Payment is cash or bank transfer only',0),('siladon-spa-pattaya','Promo prices apply to direct advance bookings',1),('siladon-spa-pattaya','Twin-bed couples room and child-friendly options',2),('siladon-spa-pattaya','Mostly natural, locally sourced Thai products',3),('siladon-spa-pattaya','Confirm opening hours before visiting',4),
  ('the-one-massage-pattaya','Book ahead online via GoWabi for discounts and cashback',0),('the-one-massage-pattaya','All therapists are experienced and professionally trained',1),('the-one-massage-pattaya','A post-massage treat (mango sticky rice / tea) is included',2),('the-one-massage-pattaya','Family-friendly — a genuinely professional spa',3),('the-one-massage-pattaya','Right on Walking Street, easy to combine with an evening out',4),
  ('the-sea-spa-pattaya','Tranquil Thai garden house near Wongamat Beach',0),('the-sea-spa-pattaya','Certified, experienced in-house therapists',1),('the-sea-spa-pattaya','Separate rooms for individuals and couples',2),('the-sea-spa-pattaya','Private parking on site',3),('the-sea-spa-pattaya','Budget-friendly yet authentic',4),
  ('tea-tree-spa-pattaya','All prices include 10% service charge + 7% VAT',0),('tea-tree-spa-pattaya','Booking one day ahead is required',1),('tea-tree-spa-pattaya','Ocean-view setting on Level 5 of the Bay Tower',2),('tea-tree-spa-pattaya','Dermalogica facials & Himalayan hot stone',3),('tea-tree-spa-pattaya','Dedicated kids'' menu (ages 6–11)',4),
  ('yunomori-onsen-spa-pattaya','Rinse and shower before entering the onsen pools',0),('yunomori-onsen-spa-pattaya','Onsen bathing areas are gender-separated',1),('yunomori-onsen-spa-pattaya','Towels, yukata & basic toiletries are provided',2),('yunomori-onsen-spa-pattaya','Open daily from 10:00; arrive 15 minutes early',3),('yunomori-onsen-spa-pattaya','All listed prices already include 7% VAT',4)
) as x(venue_slug, label, so)
join public.venues v on v.slug = x.venue_slug;

-- 9 · FAQs ------------------------------------------------------------------
insert into public.venue_faqs (venue_id, question, answer, sort_order)
select v.id, x.q, x.a, x.so
from (values
  ('7-spa-luxury-pattaya','What''s special about the facilities?','7 Spa Luxury has an outdoor sea-salt jacuzzi and a herbal sauna, set in a teak sanctuary, with Ministry of Health-certified therapists.',0),
  ('7-spa-luxury-pattaya','How long are the treatments?','Most are long ''ritual''-style programmes running 1.5–4 hours, across 17+ signature options.',1),
  ('7-spa-luxury-pattaya','Do I need to book?','Yes — hours aren''t published online, so confirm and book by phone or the booking page.',2),
  ('88-massage-and-spa','Are these the real prices?','No — there''s no official published price list. The figures shown are neighbourhood reference rates only. Confirm directly with the shop.',0),
  ('88-massage-and-spa','Why is it popular with Korean visitors?','It has a strong Korean following, with most of its YouTube and TikTok content in Korean, and a solid 4.6 rating.',1),
  ('88-massage-and-spa','What are the opening hours?','Hours aren''t published; typical Pattaya massage shops run roughly 10:00–24:00. Check Facebook or Google Maps before visiting.',2),
  ('grace-spa','What style is the spa?','Grace Spa is built in traditional Thai style entirely from teak, arranged as a resort of standalone treatment villas.',0),
  ('grace-spa','Do staff speak English and Korean?','Yes — the team is multilingual (Thai, English and Korean).',1),
  ('grace-spa','Can I pay by card?','Yes, credit cards are accepted.',2),
  ('health-land-north-pattaya','What makes this branch special?','It''s one of only two Health Land locations offering the Vichy Shower treatment, and it has couples Spa-Jacuzzi suites.',0),
  ('health-land-north-pattaya','Do I need to book ahead?','Walk-ins are accepted, but booking is recommended on weekends and holidays.',1),
  ('health-land-north-pattaya','Are gift vouchers available?','Yes — Health Land gift vouchers can be used across the chain.',2),
  ('health-land-pattaya-sukhumvit-road','Do I need to book ahead?','Walk-ins are accepted, but on weekends and public holidays booking is recommended.',0),
  ('health-land-pattaya-sukhumvit-road','Does this branch have the Spa Jacuzzi?','Yes — couples Spa-Jacuzzi packages are available at the Sukhumvit branch. Vichy Shower is only at Pattaya Nua and Sathorn.',1),
  ('health-land-pattaya-sukhumvit-road','Are gift vouchers available?','Yes — Health Land offers gift vouchers that can be used across the chain.',2),
  ('i-siamland-massage-spa-pattaya','Is it really that clean?','Yes — guests consistently describe I.Siamland as spotlessly clean, professional and a ''safe space'' for all visitors.',0),
  ('i-siamland-massage-spa-pattaya','What''s the signature treatment?','The signature herbal-compress massage, alongside deep-tissue oil work, is what I.Siamland is best known for.',1),
  ('i-siamland-massage-spa-pattaya','Do packages include extras?','Several deluxe packages include a complimentary 30-minute foot massage on top of the main treatment.',2),
  ('let-s-relax-onsen-and-spa-pattaya','What makes this onsen special?','It''s billed as Thailand''s first sea-view Japanese onsen — 3,000 m² on the 7th floor, using authentic hot-spring powder from Gero, Japan.',0),
  ('let-s-relax-onsen-and-spa-pattaya','Is the onsen gender-separated?','Yes, in the traditional Japanese style. Rinse and shower before entering the pools.',1),
  ('let-s-relax-onsen-and-spa-pattaya','How much is the onsen?','Onsen entry is ฿750, with sauna, steam rooms and rest areas included.',2),
  ('let-s-relax-spa-north-pattaya','Is there really an onsen here?','Yes — this branch offers an onsen hot-spring bath (฿750) alongside the full Let''s Relax treatment menu.',0),
  ('let-s-relax-spa-north-pattaya','How late is it open?','Open daily from 10:00 until midnight, so it suits a late-evening treatment.',1),
  ('let-s-relax-spa-north-pattaya','Where do I park?','Parking is at the Sunshine Garden Hotel, across from the spa.',2),
  ('let-s-relax-spa-pattaya-beach-front','Do the rooms have a sea view?','Some treatment rooms have a sea view, in keeping with the beachfront location on Beach Road.',0),
  ('let-s-relax-spa-pattaya-beach-front','Is there an onsen here?','The onsen is at the separate Let''s Relax Onsen and Spa branch at Grande Centre Point, not at this Beach Front location.',1),
  ('let-s-relax-spa-pattaya-beach-front','How can I book?','Directly, or via partners like Klook, Trip.com and Traveloka.',2),
  ('let-s-relax-spa-terminal-21-pattaya','Is this the onsen branch?','No — the onsen is at the separate Grande Centre Point branch. This is the Terminal 21 day-spa branch.',0),
  ('let-s-relax-spa-terminal-21-pattaya','Do I need to book?','Booking is recommended, and it''s best to arrive about 20 minutes early. The last treatment is around 22:00.',1),
  ('let-s-relax-spa-terminal-21-pattaya','Where is it in the mall?','On the 1st floor of Terminal 21 Pattaya, in the Italy Street Zone, connected to Grande Centre Point.',2),
  ('makkha-health-spa-pattaya-again-north-pattaya','Is there a free shuttle?','Yes — a free Pattaya-wide shuttle is offered with a minimum ฿1,000 order. Arrange it when you book.',0),
  ('makkha-health-spa-pattaya-again-north-pattaya','What''s included with a treatment?','Welcome treats (bael juice, rice crackers) and post-massage refreshments (bael juice and mango sticky rice) are included.',1),
  ('makkha-health-spa-pattaya-again-north-pattaya','Is there an age limit?','Massages are recommended for guests aged 12 and over.',2),
  ('oasis-spa-pattaya-jomtien','Is there a free transfer?','Yes — Oasis offers a free round-trip transfer within Pattaya for spa guests. Arrange it when you book.',0),
  ('oasis-spa-pattaya-jomtien','Why do prices show ++?','The ++ means service charge and government tax are added on top of the listed price, as is standard at premium spas.',1),
  ('oasis-spa-pattaya-jomtien','Do you handle Japanese guests?','Yes — the spa caters to Japanese guests and handles Japanese-language bookings.',2),
  ('pattaya-spa','Why are prices in Tenge?','Pattaya SPA is oriented to the Russian-speaking / CIS market; its pricing is in Kazakh Tenge (₸). Confirm Baht pricing with the venue.',0),
  ('pattaya-spa','Is there an on-site restaurant?','Yes — Pattaya SPA has an on-site restaurant, so you can dine after your treatment.',1),
  ('pattaya-spa','Where can I see the full menu?','The full multi-page ritual menu and a 3D virtual tour are on pattayaspa.kz/en/rituals.',2),
  ('poo-na-health-massage','Why are the prices so low?','Poo Na''s published prices are unusually low for Pattaya and may be shop entry rates. Confirm at the shop or by phone before you visit.',0),
  ('poo-na-health-massage','Do I need to book?','It''s a walk-in neighbourhood shop, but calling ahead on busy evenings (084-468 7138) is a good idea.',1),
  ('poo-na-health-massage','Is it a professional massage shop?','Yes — it''s a small, newly renovated neighbourhood shop focused on relaxation and rest at budget prices.',2),
  ('siladon-spa-pattaya','How do I pay?','Payment is cash or bank transfer only. The promo prices apply to direct advance bookings.',0),
  ('siladon-spa-pattaya','Is it suitable for couples and families?','Yes — there''s a twin-bed couples room and child-friendly arrangements, in a clean, warm setting.',1),
  ('siladon-spa-pattaya','What products are used?','Mostly natural, locally sourced Thai products.',2),
  ('the-one-massage-pattaya','Is this a legitimate, professional massage?','Yes — The One is an upscale, professional Thai massage spa with trained therapists and no improper services.',0),
  ('the-one-massage-pattaya','Do I need to book ahead?','Walk-ins are welcome, but online booking via GoWabi often comes with discounts and cashback.',1),
  ('the-one-massage-pattaya','What is the signature treatment?','The One Signature — a 120-minute aroma-oil massage with a warm herbal compress — is the house favourite.',2),
  ('the-sea-spa-pattaya','Where exactly is it?','On Soi 18 in Naklua, in a Thai garden near Wongamat Beach — a quieter setting than the central beach.',0),
  ('the-sea-spa-pattaya','Are the therapists certified?','Yes — treatments are delivered by certified, experienced in-house therapists.',1),
  ('the-sea-spa-pattaya','How do I book?','By phone or via GoWabi. Confirm current prices when you book.',2),
  ('tea-tree-spa-pattaya','Are taxes and service charge extra?','No — all listed prices already include the 10% service charge and 7% government tax.',0),
  ('tea-tree-spa-pattaya','Do I need to book ahead?','Yes, booking one day in advance is required. The spa is open daily 11:00–20:00.',1),
  ('tea-tree-spa-pattaya','Is there a kids'' menu?','Yes — there''s a dedicated kids'' menu for ages 6–11, including a foot massage and a Little Tropical Spa.',2),
  ('yunomori-onsen-spa-pattaya','Do I need to book ahead?','Onsen day passes are walk-in friendly. For massages and busy weekends, booking is recommended.',0),
  ('yunomori-onsen-spa-pattaya','Are towels and yukata provided?','Yes — towels, a yukata and basic toiletries are included with your onsen pass.',1),
  ('yunomori-onsen-spa-pattaya','Is VAT included in the prices?','Yes — all listed prices already include 7% VAT. E-voucher packages expire one year after purchase.',2)
) as x(venue_slug, q, a, so)
join public.venues v on v.slug = x.venue_slug;
