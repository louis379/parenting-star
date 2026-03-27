import type { Metadata } from 'next'
import { AppShell } from '@/components/layouts/AppShell'
import DashboardClient from './DashboardClient'

export const metadata: Metadata = {
  title: '首頁總覽 | 育兒智多星',
  description: '一鍵掌握孩子今日飲食、生長紀錄、最新里程碑與家庭動態',
  openGraph: {
    title: '首頁總覽 | 育兒智多星',
    description: '一鍵掌握孩子今日飲食、生長紀錄、最新里程碑與家庭動態',
  },
}

export default async function DashboardPage() {
  let profile = null
  let children: any[] = []
  let recentMeal = null
  let latestGrowth = null
  let achievedMilestones = 0

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const [profileResult, memberResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('family_members').select('family_id').eq('user_id', user.id).limit(1).maybeSingle(),
      ])

      profile = profileResult.data

      if (memberResult.data?.family_id) {
        const { data } = await supabase
          .from('children')
          .select('*')
          .eq('family_id', memberResult.data.family_id)
          .order('birth_date', { ascending: false })
        children = data ?? []

        if (children.length > 0) {
          const childId = children[0].id
          const [mealResult, growthResult, milestonesResult] = await Promise.all([
            supabase
              .from('meal_records')
              .select('meal_type, description, meal_date')
              .eq('child_id', childId)
              .order('meal_date', { ascending: false })
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle(),
            supabase
              .from('growth_records')
              .select('height_cm, weight_kg, measured_at')
              .eq('child_id', childId)
              .order('measured_at', { ascending: false })
              .limit(1)
              .maybeSingle(),
            supabase
              .from('milestones')
              .select('id')
              .eq('child_id', childId),
          ])
          recentMeal = mealResult.data
          latestGrowth = growthResult.data
          achievedMilestones = milestonesResult.data?.length ?? 0
        }
      }
    }
  } catch {
    // Supabase 不可用，使用空資料顯示引導畫面
  }

  return (
    <AppShell>
      <DashboardClient
        profile={profile}
        children={children}
        recentMeal={recentMeal}
        latestGrowth={latestGrowth}
        achievedMilestones={achievedMilestones}
      />
    </AppShell>
  )
}
