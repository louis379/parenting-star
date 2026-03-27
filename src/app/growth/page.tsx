import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layouts/AppShell'
import GrowthClient from './GrowthClient'

export default async function GrowthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  let children: any[] = []
  let growthRecords: any[] = []

  if (member?.family_id) {
    const { data: childrenData } = await supabase
      .from('children')
      .select('*')
      .eq('family_id', member.family_id)
      .order('birth_date', { ascending: false })
    children = childrenData ?? []

    if (children.length > 0) {
      const { data: records } = await supabase
        .from('growth_records')
        .select('*')
        .eq('child_id', children[0].id)
        .order('measured_at', { ascending: true })
        .limit(20)
      growthRecords = records ?? []
    }
  }

  return (
    <AppShell>
      <GrowthClient children={children} initialRecords={growthRecords} />
    </AppShell>
  )
}
