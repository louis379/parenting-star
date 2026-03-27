import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layouts/AppShell'
import KindergartensClient from './KindergartensClient'

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
