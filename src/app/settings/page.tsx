import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layouts/AppShell'
import SettingsClient from './SettingsClient'

export const metadata: Metadata = {
  title: '設定 | 育兒智多星',
  description: '管理帳號、孩子資料、家庭成員、通知偏好與隱私設定',
  openGraph: {
    title: '設定 | 育兒智多星',
    description: '管理帳號、孩子資料、家庭成員、通知偏好與隱私設定',
  },
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const { data: memberData } = await supabase
    .from('family_members')
    .select('family_id, role')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  let children: any[] = []
  let family: any = null

  if (memberData?.family_id) {
    const [childrenRes, familyRes] = await Promise.all([
      supabase.from('children').select('*').eq('family_id', memberData.family_id).order('birth_date', { ascending: false }),
      supabase.from('families').select('*').eq('id', memberData.family_id).single(),
    ])
    children = childrenRes.data ?? []
    family = familyRes.data
  }

  return (
    <AppShell>
      <SettingsClient
        profile={profile}
        email={user.email ?? ''}
        children={children}
        family={family}
        myRole={memberData?.role ?? ''}
      />
    </AppShell>
  )
}
