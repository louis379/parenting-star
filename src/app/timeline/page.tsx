import type { Metadata } from 'next'
import { AppShell } from '@/components/layouts/AppShell'
import TimelineClient from './TimelineClient'

export const metadata: Metadata = {
  title: '成長時間軸 | 育兒智多星',
  description: '用照片記錄寶貝每個成長階段，自動分類、AI 分析，打造專屬的成長故事',
}

export default function TimelinePage() {
  return (
    <AppShell>
      <TimelineClient />
    </AppShell>
  )
}
