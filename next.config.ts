import type { NextConfig } from "next";

// Content-Security-Policy tuned to what the app actually loads:
// Supabase (images + API), Google Fonts, and inline <style>/<script>
// (the app injects page CSS and small client scripts inline).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.supabase.co https://maps.googleapis.com https://maps.gstatic.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

// Admin panel runs as a separate Vercel project (a "zone") with basePath
// /admin. Set ADMIN_ZONE_URL (e.g. https://pattaya-admin.vercel.app) in the
// main project's env to expose it at gotopattaya.com/admin via a rewrite.
const adminZone = process.env.ADMIN_ZONE_URL?.replace(/\/+$/, '')

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async rewrites() {
    if (!adminZone) return []
    return [
      { source: '/admin', destination: `${adminZone}/admin` },
      { source: '/admin/:path*', destination: `${adminZone}/admin/:path*` },
    ]
  },
}

export default nextConfig;
