import type { Metadata } from 'next'
import { AppShell } from '@/components/layouts/AppShell'
import KindergartensClient from './KindergartensClient'
import { MOCK_KINDERGARTENS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: '幼兒園查詢 | 育兒智多星',
  description: '查詢台灣各地幼兒園資訊，比較評分與評論，為孩子找到最適合的學習環境',
  openGraph: {
    title: '幼兒園查詢 | 育兒智多星',
    description: '查詢台灣各地幼兒園資訊，比較評分與評論，為孩子找到最適合的學習環境',
  },
}

export default async function KindergartensPage() {
  let kindergartens: any[] = []

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('kindergartens')
      .select('*')
      .order('name')
      .limit(50)

    if (!error && data && data.length > 0) {
      kindergartens = data
    } else {
      kindergartens = MOCK_KINDERGARTENS
    }
  } catch {
    kindergartens = MOCK_KINDERGARTENS
  }

  return (
    <AppShell>
      <KindergartensClient initialData={kindergartens} />
    </AppShell>
  )
}
