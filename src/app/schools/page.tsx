import type { Metadata } from 'next'
import { AppShell } from '@/components/layouts/AppShell'
import SchoolsClient from './SchoolsClient'
import { MOCK_KINDERGARTENS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: '教育環境 | 育兒智多星',
  description: '全台幼兒園/學校資料庫，教學方式比較，找到最適合孩子的教育環境',
}

export default async function SchoolsPage() {
  let schools: any[] = []

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('kindergartens')
      .select('*')
      .order('name')
      .limit(50)

    if (!error && data && data.length > 0) {
      schools = data
    } else {
      schools = MOCK_KINDERGARTENS
    }
  } catch {
    schools = MOCK_KINDERGARTENS
  }

  return (
    <AppShell>
      <SchoolsClient initialData={schools} />
    </AppShell>
  )
}
