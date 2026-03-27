import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layouts/AppShell'
import KindergartensClient from './KindergartensClient'

export const metadata: Metadata = {
  title: '幼兒園查詢 | 育兒智多星',
  description: '查詢台灣各地幼兒園資訊，比較評分與評論，為孩子找到最適合的學習環境',
  openGraph: {
    title: '幼兒園查詢 | 育兒智多星',
    description: '查詢台灣各地幼兒園資訊，比較評分與評論，為孩子找到最適合的學習環境',
  },
}

export default async function KindergartensPage() {
  const supabase = await createClient()

  const { data: kindergartens } = await supabase
    .from('kindergartens')
    .select('*')
    .order('name')
    .limit(50)

  return (
    <AppShell>
      <KindergartensClient initialData={kindergartens ?? []} />
    </AppShell>
  )
}
