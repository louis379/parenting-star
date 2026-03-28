import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layouts/AppShell'
import ReportsClient from './ReportsClient'

export const metadata: Metadata = {
  title: 'AI 分析報告 | 育兒智多星',
  description: 'AI 生成個性化月度育兒報告，涵蓋生長趨勢、營養缺口分析與專屬建議',
  openGraph: {
    title: 'AI 分析報告 | 育兒智多星',
    description: 'AI 生成個性化月度育兒報告，涵蓋生長趨勢、營養缺口分析與專屬建議',
  },
}

export default async function ReportsPage() {
  let firstChild: any = null
  let allChildren: any[] = []
  let growthRecords: any[] = []
  let mealRecords: any[] = []
  let milestones: any[] = []

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: memberData } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    if (memberData?.family_id) {
      const { data: children } = await supabase
        .from('children')
        .select('id, nickname, birth_date, gender, allergies')
        .eq('family_id', memberData.family_id)
        .order('birth_date', { ascending: false })

      allChildren = children ?? []
      firstChild = allChildren[0] ?? null

      if (firstChild) {
        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        const [growthRes, mealRes, milestoneRes] = await Promise.all([
          supabase
            .from('growth_records')
            .select('height_cm, weight_kg, head_circumference_cm, measured_at')
            .eq('child_id', firstChild.id)
            .gte('measured_at', thirtyDaysAgo)
            .order('measured_at', { ascending: false }),
          supabase
            .from('meal_records')
            .select('meal_type, description, meal_date, ai_analysis')
            .eq('child_id', firstChild.id)
            .gte('meal_date', thirtyDaysAgo)
            .order('meal_date', { ascending: false }),
          supabase
            .from('milestones')
            .select('category, milestone_key, achieved_at')
            .eq('child_id', firstChild.id)
            .not('achieved_at', 'is', null)
            .gte('achieved_at', thirtyDaysAgo),
        ])

        growthRecords = growthRes.data ?? []
        mealRecords = mealRes.data ?? []
        milestones = milestoneRes.data ?? []
      }
    }
  } catch {
    // DB tables may not exist yet — show empty state
  }

  return (
    <AppShell>
      <ReportsClient
        child={firstChild}
        allChildren={allChildren}
        growthRecords={growthRecords}
        mealRecords={mealRecords}
        milestones={milestones}
      />
    </AppShell>
  )
}
