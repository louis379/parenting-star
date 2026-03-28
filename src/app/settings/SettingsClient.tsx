'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Settings, User, LogOut, ChevronDown, Baby, Bell,
  Shield, Users, Info, Edit2, Check, Heart, X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { Profile, Child } from '@/types/database'
import { differenceInMonths, differenceInYears, parseISO } from 'date-fns'

interface Props {
  profile: Profile | null
  email: string
  children: Child[]
  family: { id: string; name: string | null } | null
  myRole: string
}

const NOTIFICATION_OPTIONS = [
  { key: 'growth_reminder', label: '成長量測提醒', desc: '每月提醒紀錄身高體重', emoji: '📏' },
  { key: 'meal_reminder', label: '飲食紀錄提醒', desc: '每天提醒記錄孩子飲食', emoji: '🍼' },
  { key: 'milestone_alert', label: '里程碑達成通知', desc: '記錄里程碑時發送通知', emoji: '⭐' },
  { key: 'weekly_report', label: '週報摘要', desc: '每週一發送本週育兒摘要', emoji: '📊' },
]

function formatAge(birthDate: string) {
  const birth = parseISO(birthDate)
  const years = differenceInYears(new Date(), birth)
  const months = differenceInMonths(new Date(), birth) % 12
  if (years === 0) return `${months} 個月`
  if (months === 0) return `${years} 歲`
  return `${years} 歲 ${months} 個月`
}

export default function SettingsClient({ profile, email, children, family, myRole }: Props) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    growth_reminder: true,
    meal_reminder: false,
    milestone_alert: true,
    weekly_report: false,
  })

  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [editForm, setEditForm] = useState({ nickname: '', birth_date: '', gender: '' })
  const [childSaving, setChildSaving] = useState(false)
  const [childSaved, setChildSaved] = useState(false)
  const [error, setError] = useState('')

  const [showAddChild, setShowAddChild] = useState(false)
  const [addChildForm, setAddChildForm] = useState({ nickname: '', birth_date: '', gender: '' })
  const [addingChild, setAddingChild] = useState(false)
  const [addedChild, setAddedChild] = useState(false)
  const [localChildren, setLocalChildren] = useState(children)

  async function handleSaveProfile() {
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

  async function handleSaveChild() {
    if (!editingChild || !editForm.nickname.trim()) return
    setChildSaving(true)
    setError('')
    try {
      const res = await fetch('/api/children', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingChild.id,
          nickname: editForm.nickname.trim(),
          birth_date: editForm.birth_date,
          gender: editForm.gender || null,
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        setLocalChildren(prev => prev.map(c => c.id === updated.id ? updated : c))
        setChildSaved(true)
        setTimeout(() => { setChildSaved(false); setEditingChild(null) }, 1500)
      } else {
        const err = await res.json()
        setError(err.error || '儲存失敗，請稍後再試')
      }
    } catch {
      setError('網路錯誤，請稍後再試')
    }
    setChildSaving(false)
  }

  async function handleAddChild() {
    if (!addChildForm.nickname.trim() || !addChildForm.birth_date) return
    if (!family?.id) {
      setError('尚未建立家庭，請先完成 Onboarding 設定')
      return
    }
    setAddingChild(true)
    setError('')
    try {
      const res = await fetch('/api/children', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          family_id: family.id,
          nickname: addChildForm.nickname.trim(),
          birth_date: addChildForm.birth_date,
          gender: addChildForm.gender || null,
        }),
      })
      if (res.ok) {
        const newChild = await res.json()
        setLocalChildren(prev => [...prev, newChild])
        setAddedChild(true)
        setAddChildForm({ nickname: '', birth_date: '', gender: '' })
        setTimeout(() => { setAddedChild(false); setShowAddChild(false) }, 1500)
      } else {
        const err = await res.json()
        setError(err.error || '新增失敗，請稍後再試')
      }
    } catch {
      setError('網路錯誤，請稍後再試')
    }
    setAddingChild(false)
  }

  async function handleDeleteChild(childId: string) {
    if (!confirm('確定要刪除這位小朋友的資料嗎？此操作無法復原。')) return
    const res = await fetch(`/api/children?id=${childId}`, { method: 'DELETE' })
    if (res.ok) {
      setLocalChildren(prev => prev.filter(c => c.id !== childId))
    }
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function toggle(key: string) {
    setActiveSection(activeSection === key ? null : key)
  }

  const sectionDefs = [
    { key: 'profile', icon: User, label: '個人資料', desc: '編輯暱稱與顯示資訊' },
    { key: 'children', icon: Baby, label: '孩子資料', desc: `${localChildren.length} 位孩子`, badge: localChildren.length > 0 ? localChildren.length : undefined },
    { key: 'family', icon: Users, label: '家庭設定', desc: family?.name ?? '我的家庭' },
    { key: 'notifications', icon: Bell, label: '通知偏好', desc: '成長提醒與報告通知' },
    { key: 'privacy', icon: Shield, label: '隱私與安全', desc: '帳號安全、資料隱私' },
    { key: 'about', icon: Info, label: '關於我們', desc: '版本資訊、聯繫方式' },
  ]

  // Render section content inline
  function renderContent(key: string) {
    switch (key) {
      case 'profile':
        return (
          <div className="p-4 space-y-3 bg-[#FAFAF5]">
            <Input label="顯示名稱" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="你的暱稱" />
            <Input label="電子郵件" value={email} disabled />
            <Button size="md" className="w-full" loading={saving} onClick={handleSaveProfile}>
              {saved ? '已儲存 ✓' : '儲存變更'}
            </Button>
          </div>
        )
      case 'children':
        return (
          <div className="p-4 space-y-3 bg-[#FAFAF5]">
            {localChildren.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-3">尚未新增孩子資料</p>
            ) : (
              <div className="space-y-2">
                {error && <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
                {localChildren.map(child => (
                  <div key={child.id}>
                    {editingChild?.id === child.id ? (
                      <div className="bg-[#EBF4FF] rounded-2xl p-3 space-y-2">
                        <Input label="暱稱" value={editForm.nickname} onChange={e => setEditForm(prev => ({ ...prev, nickname: e.target.value }))} placeholder="孩子暱稱" />
                        <Input label="出生日期" type="date" value={editForm.birth_date} onChange={e => setEditForm(prev => ({ ...prev, birth_date: e.target.value }))} />
                        <div>
                          <label className="text-xs font-semibold text-gray-500 mb-1 block">性別</label>
                          <div className="flex gap-2">
                            {[{ value: 'male', label: '👦 男' }, { value: 'female', label: '👧 女' }, { value: '', label: '🧒 不指定' }].map(opt => (
                              <button key={opt.value} onClick={() => setEditForm(prev => ({ ...prev, gender: opt.value }))}
                                className="flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all"
                                style={{ background: editForm.gender === opt.value ? '#7B9EBD' : 'white', color: editForm.gender === opt.value ? 'white' : '#5E85A3', border: `1.5px solid ${editForm.gender === opt.value ? '#7B9EBD' : '#C5D8E8'}` }}>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleSaveChild} disabled={childSaving || !editForm.nickname.trim() || !editForm.birth_date}
                            className="flex-1 py-2 bg-[#7B9EBD] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-1 disabled:opacity-50">
                            {childSaved ? <><Check size={14} /> 已儲存</> : childSaving ? '儲存中...' : '儲存'}
                          </button>
                          <button onClick={() => { setEditingChild(null); setError('') }} className="flex-1 py-2 bg-gray-100 text-gray-500 rounded-xl text-sm font-semibold">取消</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-[#EBF4FF] rounded-2xl">
                        <span className="text-2xl">{child.gender === 'male' ? '👦' : child.gender === 'female' ? '👧' : '🧒'}</span>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-sm">{child.nickname}</p>
                          <p className="text-xs text-gray-500">{formatAge(child.birth_date)}</p>
                        </div>
                        <button onClick={() => { setEditingChild(child); setEditForm({ nickname: child.nickname, birth_date: child.birth_date, gender: child.gender ?? '' }); setError('') }} className="p-1.5 text-[#7B9EBD]"><Edit2 size={15} /></button>
                        <button onClick={() => handleDeleteChild(child.id)} className="p-1.5 text-red-300 hover:text-red-500"><X size={15} /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {!localChildren.length && error && <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
            {showAddChild ? (
              <div className="bg-[#F0F7FF] rounded-2xl p-4 space-y-3 border border-[#C5D8E8]">
                <p className="text-sm font-bold" style={{ color: '#5E85A3' }}>新增小朋友</p>
                <Input label="暱稱 *" value={addChildForm.nickname} onChange={e => setAddChildForm(prev => ({ ...prev, nickname: e.target.value }))} placeholder="例：小明" />
                <Input label="出生日期 *" type="date" value={addChildForm.birth_date} onChange={e => setAddChildForm(prev => ({ ...prev, birth_date: e.target.value }))} />
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">性別</label>
                  <div className="flex gap-2">
                    {[{ value: 'male', label: '👦 男生' }, { value: 'female', label: '👧 女生' }, { value: '', label: '🧒 不指定' }].map(opt => (
                      <button key={opt.value} onClick={() => setAddChildForm(prev => ({ ...prev, gender: opt.value }))}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={{ background: addChildForm.gender === opt.value ? '#7B9EBD' : 'white', color: addChildForm.gender === opt.value ? 'white' : '#5E85A3', border: `1.5px solid ${addChildForm.gender === opt.value ? '#7B9EBD' : '#C5D8E8'}` }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddChild} disabled={addingChild || !addChildForm.nickname.trim() || !addChildForm.birth_date}
                    className="flex-1 py-2.5 bg-[#7B9EBD] text-white rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-1">
                    {addedChild ? <><Check size={14} /> 已新增</> : addingChild ? '新增中...' : '確認新增'}
                  </button>
                  <button onClick={() => setShowAddChild(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-sm font-semibold">取消</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddChild(true)} className="block w-full py-2.5 border-2 border-dashed border-[#C5D8E8] text-[#7B9EBD] rounded-2xl text-sm font-semibold text-center">
                + 新增孩子
              </button>
            )}
          </div>
        )
      case 'family':
        return (
          <div className="p-4 space-y-3 bg-[#FAFAF5]">
            <div className="bg-[#EBF4FF] rounded-2xl p-3">
              <p className="text-xs text-gray-500 mb-1">家庭名稱</p>
              <p className="font-bold text-gray-800">{family?.name ?? '未命名家庭'}</p>
            </div>
            <a href="/family" className="flex items-center justify-between p-3 bg-[#EBF4FF] rounded-2xl">
              <div className="flex items-center gap-2"><Users size={15} className="text-[#7B9EBD]" /><p className="text-sm font-semibold text-gray-700">管理家庭成員</p></div>
              <ChevronDown size={15} className="text-gray-400 -rotate-90" />
            </a>
          </div>
        )
      case 'notifications':
        return (
          <div className="p-4 space-y-2 bg-[#FAFAF5]">
            {NOTIFICATION_OPTIONS.map(({ key, label, desc, emoji }) => (
              <div key={key} className="flex items-center gap-3 p-3 bg-[#EBF4FF] rounded-2xl">
                <span className="text-xl">{emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <button onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                  className={cn('w-12 h-6 rounded-full transition-all relative shrink-0', notifications[key] ? 'bg-[#7B9EBD]' : 'bg-gray-200')}>
                  <span className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all', notifications[key] ? 'left-6' : 'left-0.5')} />
                </button>
              </div>
            ))}
            <p className="text-xs text-gray-400 pt-1">通知設定會在下次登入後生效</p>
          </div>
        )
      case 'privacy':
        return (
          <div className="p-4 space-y-3 bg-[#FAFAF5]">
            {[
              { label: '資料加密保護', desc: '所有個人資料均經過加密儲存' },
              { label: '不分享給第三方', desc: '您的資料不會分享給任何第三方' },
              { label: '可申請刪除帳號', desc: '隨時可申請完全刪除所有資料' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-3 bg-[#EBF4FF] rounded-2xl">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5"><Check size={13} className="text-green-600" /></div>
                <div><p className="text-sm font-semibold text-gray-700">{label}</p><p className="text-xs text-gray-500">{desc}</p></div>
              </div>
            ))}
            <div className="bg-[#EBF4FF] rounded-2xl p-3">
              <p className="text-xs text-[#5E85A3]">如需申請刪除帳號或有隱私相關問題，請聯絡 support@parenting-star.app</p>
            </div>
          </div>
        )
      case 'about':
        return (
          <div className="p-5 text-center space-y-3 bg-[#FAFAF5]">
            <div className="w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center text-3xl mx-auto">⭐</div>
            <div><p className="font-black text-gray-800 text-lg">育兒智多星</p><p className="text-xs text-gray-500 mt-0.5">版本 1.0.0 (Phase 4)</p></div>
            <p className="text-sm text-gray-500 leading-relaxed">專為台灣家庭設計的智慧育兒助手，整合成長追蹤、飲食日記、景點推薦、幼兒園查詢等功能，陪伴每個家庭育兒旅程。</p>
            <div className="flex items-center justify-center gap-1 text-sm text-[#7B9EBD]"><Heart size={14} className="fill-[#7B9EBD]" /><span>以愛打造，為每個台灣家庭</span></div>
            <div className="text-xs text-gray-400 space-y-1"><p>聯繫我們：support@parenting-star.app</p><p>© 2026 育兒智多星 版權所有</p></div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div style={{ background: '#FAFAF5' }} className="min-h-screen">
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={22} />
          <h1 className="text-xl font-black">設定</h1>
        </div>
        <div className="flex items-center gap-3 bg-white/15 rounded-2xl p-3">
          <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center text-white text-xl font-black">
            {(profile?.display_name ?? email)[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="font-bold text-sm">{profile?.display_name || '未設定暱稱'}</p>
            <p className="text-white/70 text-xs">{email}</p>
          </div>
          <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-lg">
            {myRole === 'primary' ? '主要照顧者' : myRole === 'co_caregiver' ? '協作照顧者' : myRole || '成員'}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* Accordion menu — content appears inline below each section */}
        <div className="card-blue overflow-hidden">
          {sectionDefs.map(({ key, icon: Icon, label, desc, badge }, idx) => {
            const isOpen = activeSection === key
            return (
              <div key={key}>
                {idx > 0 && <div className="border-t" style={{ borderColor: '#E8E0D5' }} />}
                <button
                  onClick={() => toggle(key)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-[#EBF4FF] transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-[#EBF4FF] rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#7B9EBD]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  {badge !== undefined && (
                    <span className="bg-[#7B9EBD] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0">{badge}</span>
                  )}
                  <ChevronDown size={16} className={cn('text-gray-400 transition-transform', isOpen && 'rotate-180')} />
                </button>
                {isOpen && (
                  <div style={{ borderTop: '1px solid #E8E0D5' }}>
                    {renderContent(key)}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Logout */}
        <Button variant="outline" size="lg" className="w-full border-red-200 text-red-500 hover:bg-red-50" onClick={handleLogout}>
          <LogOut size={18} className="mr-2" /> 登出帳號
        </Button>
      </div>
    </div>
  )
}
