'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, User, LogOut, ChevronRight, Baby, Bell, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Profile } from '@/types/database'

interface Props {
  profile: Profile | null
  email: string
}

export default function SettingsClient({ profile, email }: Props) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ display_name: displayName }).eq('id', user.id)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const menuItems = [
    { icon: Baby, label: '孩子資料管理', href: '/onboarding', desc: '新增或修改孩子資料' },
    { icon: Bell, label: '通知設定', href: '#', desc: '成長提醒、活動推薦' },
    { icon: Shield, label: '隱私與安全', href: '#', desc: '帳號安全、資料隱私' },
  ]

  return (
    <div style={{ background: '#fffbf5' }} className="min-h-screen">
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-8">
        <div className="flex items-center gap-2">
          <Settings size={22} />
          <h1 className="text-xl font-black">設定</h1>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Profile */}
        <div className="card-warm p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center text-white text-2xl font-bold">
              {(profile?.display_name ?? email)[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="font-bold text-gray-800">{profile?.display_name || '未設定暱稱'}</p>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
          <Input
            label="顯示名稱"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="你的暱稱"
          />
          <Button
            size="md"
            className="w-full mt-3"
            loading={saving}
            onClick={handleSave}
          >
            {saved ? '已儲存 ✓' : '儲存變更'}
          </Button>
        </div>

        {/* Menu */}
        <div className="card-warm overflow-hidden divide-y divide-orange-50">
          {menuItems.map(({ icon: Icon, label, desc, href }) => (
            <a key={label} href={href} className="flex items-center gap-3 p-4 hover:bg-orange-50 transition-colors">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </a>
          ))}
        </div>

        {/* App info */}
        <div className="card-warm p-4 text-center">
          <p className="text-xs text-gray-400">育兒智多星 v1.0.0</p>
          <p className="text-xs text-gray-400 mt-0.5">以愛打造，為每個台灣家庭</p>
        </div>

        {/* Logout */}
        <Button variant="outline" size="lg" className="w-full border-red-200 text-red-500 hover:bg-red-50" onClick={handleLogout}>
          <LogOut size={18} className="mr-2" />
          登出帳號
        </Button>
      </div>
    </div>
  )
}
