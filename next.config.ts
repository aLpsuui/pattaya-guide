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
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  // 2-year HSTS with includeSubDomains + preload so browsers upgrade http→https
  // for the apex on the very first visit (kills the http-apex extra redirect hop)
  // and qualify for the HSTS preload list. Safe: every subdomain (www, cdn) is https.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    // Old misspelled URL → corrected /things-to-do (keep existing links/SEO).
    return [
      { source: '/thinks-to-do', destination: '/things-to-do', permanent: true },
      { source: '/thinks-to-do/:path*', destination: '/things-to-do/:path*', permanent: true },
    ]
  },
}

export default nextConfig;
