import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layouts/AppShell'
import PlacesClient from './PlacesClient'

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
