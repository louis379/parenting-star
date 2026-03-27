import { NextResponse } from 'next/server'

export function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /growth
Disallow: /meals
Disallow: /milestones
Disallow: /reports
Disallow: /family
Disallow: /settings
Disallow: /(auth)
Disallow: /(onboarding)

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://parenting-star.zeabur.app'}/sitemap.xml
`
  return new NextResponse(body, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
