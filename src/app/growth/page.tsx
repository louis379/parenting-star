import type { Metadata } from 'next'
import { AppShell } from '@/components/layouts/AppShell'
import GrowthClient from './GrowthClient'

export const metadata: Metadata = {
  title: '生長發展 | 育兒智多星',
  description: '追蹤孩子身高體重發育曲線，對照 WHO 標準，掌握每個成長里程碑',
}

export default function GrowthPage() {
  return (
    <AppShell>
      <GrowthClient />
    </AppShell>
  )
}
