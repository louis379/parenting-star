import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layouts/AppShell'
import MealsClient from './MealsClient'

export default async function MealsPage() {
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
  let mealRecords: any[] = []

  if (member.family_id) {
    const { data: childrenData } = await supabase
      .from('children')
      .select('*')
      .eq('family_id', member.family_id)
      .order('birth_date', { ascending: false })
    children = childrenData ?? []

    if (children.length > 0) {
      // 取最近 7 天的紀錄
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { data: records } = await supabase
        .from('meal_records')
        .select('*')
        .eq('child_id', children[0].id)
        .gte('meal_date', sevenDaysAgo.toISOString().split('T')[0])
        .order('meal_date', { ascending: false })
        .order('created_at', { ascending: false })
      mealRecords = records ?? []
    }
  }

  return (
    <AppShell>
      <MealsClient children={children} initialRecords={mealRecords} />
    </AppShell>
  )
}
