'use client'

import { useEffect } from 'react'
import { useProfileStore } from '@/stores/profileStore'
import { createClient } from '@/lib/supabase/client'

export function useProfile() {
  const { profile, children, setProfile, setChildren, activeChild, activeChildId, setActiveChildId } =
    useProfileStore()

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [profileResult, familyResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
          .from('family_members')
          .select('family_id')
          .eq('user_id', user.id)
          .limit(1)
          .single(),
      ])

      if (profileResult.data) setProfile(profileResult.data)

      if (familyResult.data?.family_id) {
        const { data: childrenData } = await supabase
          .from('children')
          .select('*')
          .eq('family_id', familyResult.data.family_id)
          .order('birth_date', { ascending: false })

        if (childrenData) setChildren(childrenData)
      }
    }

    load()
  }, [setProfile, setChildren])

  return { profile, children, activeChild: activeChild(), activeChildId, setActiveChildId }
}
