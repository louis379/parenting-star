import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layouts/AppShell'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [profileResult, memberResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('family_members').select('family_id').eq('user_id', user.id).limit(1).maybeSingle(),
  ])

  let children: any[] = []
  if (memberResult.data?.family_id) {
    const { data } = await supabase
      .from('children')
      .select('*')
      .eq('family_id', memberResult.data.family_id)
      .order('birth_date', { ascending: false })
    children = data ?? []
  }

  if (!memberResult.data) {
    redirect('/onboarding')
  }

  return (
    <AppShell>
      <DashboardClient
        profile={profileResult.data}
        children={children}
      />
    </AppShell>
  )
}
