import { NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://parenting-star.zeabur.app'

const PUBLIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/places', priority: '0.8', changefreq: 'daily' },
  { url: '/kindergartens', priority: '0.8', changefreq: 'daily' },
  { url: '/sos', priority: '0.7', changefreq: 'monthly' },
]

export function GET() {
  const urls = PUBLIC_PAGES.map(
    ({ url, priority, changefreq }) => `
  <url>
    <loc>${BASE_URL}${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  ).join('')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new NextResponse(body, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
