// Swap a full-size CDN venue photo for its 500px-wide derivative, which the CDN
// already generates (cdn.gotopattaya.com/Venues/<name>-500.webp). Use it for
// card/thumbnail slots so we don't ship 600-800 KB originals into ~300 px boxes
// (the homepage was 12.5 MB, ~11.7 MB of it oversized card images). Non-venue or
// non-webp URLs pass through unchanged.
export function cardImg(u: string | null | undefined): string | undefined {
  if (!u) return undefined
  return /cdn\.gotopattaya\.com\/Venues\/.+\.webp$/i.test(u) ? u.replace(/\.webp$/i, '-500.webp') : u
}
