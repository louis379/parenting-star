import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, Child } from '@/types/database'

interface ProfileStore {
  profile: Profile | null
  children: Child[]
  activeChildId: string | null
  setProfile: (profile: Profile | null) => void
  setChildren: (children: Child[]) => void
  setActiveChildId: (id: string | null) => void
  activeChild: () => Child | null
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: null,
      children: [],
      activeChildId: null,
      setProfile: (profile) => set({ profile }),
      setChildren: (children) => {
        set({ children })
        if (!get().activeChildId && children.length > 0) {
          set({ activeChildId: children[0].id })
        }
      },
      setActiveChildId: (id) => set({ activeChildId: id }),
      activeChild: () => {
        const { children, activeChildId } = get()
        return children.find((c) => c.id === activeChildId) ?? children[0] ?? null
      },
    }),
    {
      name: 'parenting-star-profile',
      partialize: (state) => ({ activeChildId: state.activeChildId }),
    }
  )
)
