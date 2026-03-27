import type { Metadata } from 'next'
import { AppShell } from '@/components/layouts/AppShell'
import EducationClient from './EducationClient'

export const metadata: Metadata = {
  title: '教育發展 | 育兒智多星',
  description: '語言發展、認知階段、學科能力，AI 分析學習困難，給出個性化學習建議',
}

export default function EducationPage() {
  return (
    <AppShell>
      <EducationClient />
    </AppShell>
  )
}
