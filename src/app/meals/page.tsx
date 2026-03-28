import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layouts/AppShell'
import MealsClient from './MealsClient'

export const metadata: Metadata = {
  title: '飲食日記 | 育兒智多星',
  description: '記錄孩子每日飲食與副食品添加進度，掌握營養均衡狀況',
  openGraph: {
    title: '飲食日記 | 育兒智多星',
    description: '記錄孩子每日飲食與副食品添加進度，掌握營養均衡狀況',
  },
}

export default async function MealsPage() {
  let children: any[] = []
  let mealRecords: any[] = []

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
  } catch {
    // DB tables may not exist yet — show empty state
  }

  return (
    <AppShell>
      <MealsClient children={children} initialRecords={mealRecords} />
    </AppShell>
  )
}
