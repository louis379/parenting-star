import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layouts/AppShell'
import MilestonesClient from './MilestonesClient'

export default async function MilestonesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (!member) redirect('/onboarding')

  let children: any[] = []
  let milestones: any[] = []

  if (member.family_id) {
    const { data: childrenData } = await supabase
      .from('children')
      .select('*')
      .eq('family_id', member.family_id)
      .order('birth_date', { ascending: false })
    children = childrenData ?? []

    if (children.length > 0) {
      const { data: milestonesData } = await supabase
        .from('milestones')
        .select('*')
        .eq('child_id', children[0].id)
      milestones = milestonesData ?? []
    }
  }

  return (
    <AppShell>
      <MilestonesClient children={children} initialMilestones={milestones} />
    </AppShell>
  )
}
