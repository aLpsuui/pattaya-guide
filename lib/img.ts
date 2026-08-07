// Swap a full-size CDN venue photo for its 500px-wide derivative, which the CDN
// already generates (cdn.gotopattaya.com/Venues/<name>-500.webp). Use it for
// card/thumbnail slots so we don't ship 600-800 KB originals into ~300 px boxes
// (the homepage was 12.5 MB, ~11.7 MB of it oversized card images). Non-venue or
// non-webp URLs pass through unchanged.
export function cardImg(u: string | null | undefined): string | undefined {
  if (!u) return undefined
  // NOTE: the CDN only has -500 derivatives for SOME venue images, not all — a
  // blind `-500` swap 404'd ~60% of venue photos (broken galleries/cards). Until
  // every venue image has a real derivative, serve the original untouched. The
  // proper optimization is generating -500s + serving them from Supabase (see
  // tileImg for that pattern); do that as a batch, then re-enable the swap here.
  return u
}

// Homepage tile/card images from the Assets & Blogs folders (category/plan/
// district tiles, blog-strip heroes) ship as 200-640 KB originals into small
// boxes - the bulk of the homepage's image weight and the mobile-LCP bottleneck.
// We pre-generated 800px webp derivatives (~30-65 KB), but the CDN is a separate
// store that doesn't have them, so we serve the -800 straight from Supabase's
// public storage (already preconnected in the root layout). Only the homepage's
// fixed tile/blog set has derivatives, so apply this ONLY at those render points.
const SB_PUBLIC = 'https://hjkcmxfmismliskipedz.supabase.co/storage/v1/object/public'

// Homepage venue-card 500px derivatives. The CDN only has -500 for ~40% of
// venues (why the blind cardImg swap was reverted to a no-op), so we generated
// -500s for the homepage's fixed editor's-picks + adventure venues and serve
// them from Supabase. Apply ONLY where every venue is in that generated set
// (the homepage VenueCard); anywhere else the -500 may not exist -> 404.
export function venueCardImg(u: string | null | undefined): string | undefined {
  if (!u) return undefined
  const m = u.match(/^https:\/\/cdn\.gotopattaya\.com\/Venues\/(.+)\.webp$/i)
  if (!m) return u // only cdn Venues originals map to a derivative
  return `${SB_PUBLIC}/venues/${m[1]}-500.webp`
}

export function tileImg(u: string | null | undefined): string | undefined {
  if (!u) return undefined
  const m = u.match(/^https:\/\/cdn\.gotopattaya\.com\/(Assets|Blogs)\/(.+)\.webp$/i)
  if (!m) return u // only cdn Assets/Blogs originals map to a derivative
  const bucket = m[1].toLowerCase() === 'assets' ? 'assets' : 'blog'
  return `${SB_PUBLIC}/${bucket}/${m[2]}-800.webp`
}
