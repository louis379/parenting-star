import type { Metadata } from 'next'
import { AppShell } from '@/components/layouts/AppShell'
import SOSClient from './SOSClient'

export const metadata: Metadata = {
  title: 'SOS 緊急救助 | 育兒智多星',
  description: '緊急求助資源整合，兒科急診、毒物諮詢、兒童保護專線，一鍵快速撥打',
  openGraph: {
    title: 'SOS 緊急救助 | 育兒智多星',
    description: '緊急求助資源整合，兒科急診、毒物諮詢、兒童保護專線，一鍵快速撥打',
  },
}

export default function SOSPage() {
  return (
    <AppShell>
      <SOSClient />
    </AppShell>
  )
}
