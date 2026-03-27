import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layouts/AppShell'
import FamilyClient from './FamilyClient'

export const metadata: Metadata = {
  title: '家庭協作 | 育兒智多星',
  description: '邀請家人共同育兒，多代養者協作看板，分工合作讓育兒更輕鬆',
  openGraph: {
    title: '家庭協作 | 育兒智多星',
    description: '邀請家人共同育兒，多代養者協作看板，分工合作讓育兒更輕鬆',
  },
}

export default async function FamilyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: memberData } = await supabase
    .from('family_members')
    .select('family_id, role')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (!memberData) redirect('/onboarding')

  const { data: familyData } = await supabase
    .from('families')
    .select('id, name, created_by, created_at')
    .eq('id', memberData.family_id)
    .single()

  const { data: members } = await supabase
    .from('family_members')
    .select('id, user_id, role, joined_at')
    .eq('family_id', memberData.family_id)

  const { data: children } = await supabase
    .from('children')
    .select('id, nickname, birth_date, gender')
    .eq('family_id', memberData.family_id)
    .order('birth_date', { ascending: false })

  // Load profiles for each member
  const memberIds = (members ?? []).map(m => m.user_id).filter(Boolean) as string[]
  let profiles: { id: string; display_name: string | null }[] = []
  if (memberIds.length > 0) {
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', memberIds)
    profiles = data ?? []
  }

  const enrichedMembers = (members ?? []).map(m => ({
    ...m,
    display_name: profiles.find(p => p.id === m.user_id)?.display_name ?? null,
    isMe: m.user_id === user.id,
  }))

  return (
    <AppShell>
      <FamilyClient
        family={familyData}
        members={enrichedMembers}
        children={children ?? []}
        myRole={memberData.role}
        userId={user.id}
      />
    </AppShell>
  )
}
