import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layouts/AppShell'
import MilestonesClient from './MilestonesClient'

export const metadata: Metadata = {
  title: '里程碑追蹤 | 育兒智多星',
  description: '記錄孩子重要發展里程碑，從第一次翻身到開口說話，一一珍藏',
  openGraph: {
    title: '里程碑追蹤 | 育兒智多星',
    description: '記錄孩子重要發展里程碑，從第一次翻身到開口說話，一一珍藏',
  },
}

export default async function MilestonesPage() {
  let children: any[] = []
  let milestones: any[] = []

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: member } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    if (member?.family_id) {
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
  } catch {
    // DB tables may not exist yet — show empty state
  }

  return (
    <AppShell>
      <MilestonesClient children={children} initialMilestones={milestones} />
    </AppShell>
  )
}
