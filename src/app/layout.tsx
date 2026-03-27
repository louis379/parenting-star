import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'

export const metadata: Metadata = {
  title: '育兒智多星 — AI 育兒夥伴',
  description: '台灣每個家庭的 AI 育兒管家，個性化育兒建議、生長追蹤、親子景點、幼兒園查詢一站搞定',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '育兒智多星',
  },
}

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className="h-full">
      <body className="min-h-full antialiased">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  )
}
