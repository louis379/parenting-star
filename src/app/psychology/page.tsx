import type { Metadata } from 'next'
import { AppShell } from '@/components/layouts/AppShell'
import PsychologyClient from './PsychologyClient'

export const metadata: Metadata = {
  title: '心理培養 | 育兒智多星',
  description: '情緒發展、依附關係、社交力、專注力，全面支持孩子心理健康成長',
}

export default function PsychologyPage() {
  return (
    <AppShell>
      <PsychologyClient />
    </AppShell>
  )
}
