import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layouts/AppShell'
import PlacesClient from './PlacesClient'

export const metadata: Metadata = {
  title: '親子景點 | 育兒智多星',
  description: '探索台灣親子友善景點，查看家長真實評價，找到適合孩子年齡的好去處',
  openGraph: {
    title: '親子景點 | 育兒智多星',
    description: '探索台灣親子友善景點，查看家長真實評價，找到適合孩子年齡的好去處',
  },
}

export default async function PlacesPage() {
  const supabase = await createClient()

  const { data: places } = await supabase
    .from('places')
    .select('*')
    .order('avg_rating', { ascending: false })
    .limit(50)

  return (
    <AppShell>
      <PlacesClient initialPlaces={places ?? []} />
    </AppShell>
  )
}
