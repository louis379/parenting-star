import type { Metadata } from 'next'
import { AppShell } from '@/components/layouts/AppShell'
import PlacesClient from './PlacesClient'
import { MOCK_PLACES } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: '親子景點 | 育兒智多星',
  description: '探索台灣親子友善景點，查看家長真實評價，找到適合孩子年齡的好去處',
  openGraph: {
    title: '親子景點 | 育兒智多星',
    description: '探索台灣親子友善景點，查看家長真實評價，找到適合孩子年齡的好去處',
  },
}

export default async function PlacesPage() {
  let places: any[] = []

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('avg_rating', { ascending: false })
      .limit(50)

    if (!error && data && data.length > 0) {
      places = data
    } else {
      places = MOCK_PLACES
    }
  } catch {
    places = MOCK_PLACES
  }

  return (
    <AppShell>
      <PlacesClient initialPlaces={places} />
    </AppShell>
  )
}
