'use client'

import { useState } from 'react'
import {
  Users, UserPlus, Copy, Check, Crown, User,
  Baby, ChevronRight, ClipboardList, Heart, Shield, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { differenceInMonths, differenceInYears, parseISO } from 'date-fns'

interface Member {
  id: string
  user_id: string | null
  role: string
  joined_at: string
  display_name: string | null
  isMe: boolean
}

interface Child {
  id: string
  nickname: string
  birth_date: string
  gender: string | null
}

interface Family {
  id: string
  name: string | null
  created_by: string | null
  created_at: string
}

interface Props {
  family: Family | null
  members: Member[]
  children: Child[]
  myRole: string
  userId: string
}

const ROLE_LABELS: Record<string, string> = {
  primary: '主要照顧者',
  co_caregiver: '協作照顧者',
  viewer: '觀看者',
}

const ROLE_COLORS: Record<string, string> = {
  primary: 'bg-[#EBF4FF] text-[#5E85A3]',
  co_caregiver: 'bg-blue-100 text-blue-700',
  viewer: 'bg-gray-100 text-gray-600',
}

const ROLE_ICONS: Record<string, React.ElementType> = {
  primary: Crown,
  co_caregiver: User,
  viewer: Shield,
}

// Shared parenting tasks template
const PARENTING_TASKS = [
  { id: '1', category: '日常照護', title: '今日飲食紀錄', emoji: '🍼', assignee: '主要照顧者', done: false },
  { id: '2', category: '健康', title: '預防注射追蹤', emoji: '💉', assignee: '任何人', done: false },
  { id: '3', category: '發展', title: '里程碑觀察', emoji: '⭐', assignee: '任何人', done: false },
  { id: '4', category: '教育', title: '閱讀時間 15 分鐘', emoji: '📖', assignee: '協作照顧者', done: false },
  { id: '5', category: '生活', title: '洗澡', emoji: '🛁', assignee: '任何人', done: true },
  { id: '6', category: '戶外', title: '散步/戶外活動', emoji: '🌳', assignee: '任何人', done: false },
]

function formatAge(birthDate: string) {
  const birth = parseISO(birthDate)
  const years = differenceInYears(new Date(), birth)
  const months = differenceInMonths(new Date(), birth) % 12
  if (years === 0) return `${months} 個月`
  if (months === 0) return `${years} 歲`
  return `${years} 歲 ${months} 個月`
}

function generateInviteCode(familyId: string) {
  // Simple base64-like encoding for invite link (not real security, just for demo)
  return btoa(familyId).replace(/=/g, '').slice(0, 12).toUpperCase()
}

export default function FamilyClient({ family, members, children, myRole, userId }: Props) {
  const [activeTab, setActiveTab] = useState<'members' | 'tasks'>('members')
  const [copiedInvite, setCopiedInvite] = useState(false)
  const [showInviteSheet, setShowInviteSheet] = useState(false)
  const [tasks, setTasks] = useState(PARENTING_TASKS)
  const [showRoleSheet, setShowRoleSheet] = useState<Member | null>(null)

  const inviteCode = family ? generateInviteCode(family.id) : ''
  const inviteLink = `parenting-star.app/join?code=${inviteCode}`

  function copyInvite() {
    navigator.clipboard.writeText(inviteLink).catch(() => {})
    setCopiedInvite(true)
    setTimeout(() => setCopiedInvite(false), 2500)
  }

  function toggleTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const doneCount = tasks.filter(t => t.done).length
  const isPrimary = myRole === 'primary'

  const grouped = tasks.reduce<Record<string, typeof tasks>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  }, {})

  return (
    <div style={{ background: '#FAFAF5' }} className="min-h-screen">
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Users size={22} />
          <h1 className="text-xl font-black">家庭協作</h1>
        </div>
        <p className="text-white/80 text-sm">{family?.name ?? '我的家庭'}</p>

        {/* Children summary */}
        {children.length > 0 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {children.map(child => (
              <div key={child.id} className="shrink-0 bg-white/20 rounded-2xl px-3 py-2 flex items-center gap-2">
                <span className="text-lg">{child.gender === 'male' ? '👦' : child.gender === 'female' ? '👧' : '🧒'}</span>
                <div>
                  <p className="text-xs font-bold leading-tight">{child.nickname}</p>
                  <p className="text-xs text-white/70">{formatAge(child.birth_date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-[#C5D8E8] sticky top-0 z-30">
        {(['members', 'tasks'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-3 text-sm font-semibold transition-all',
              activeTab === tab ? 'text-[#7B9EBD] border-b-2 border-[#7B9EBD]' : 'text-gray-400'
            )}
          >
            {tab === 'members' ? '👥 成員管理' : '📋 育兒計畫'}
          </button>
        ))}
      </div>

      <div className="px-5 py-4">
        {activeTab === 'members' && (
          <div className="space-y-4">
            {/* My role card */}
            <div className="card-warm p-4">
              <p className="text-xs text-gray-500 mb-1">我的角色</p>
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = ROLE_ICONS[myRole] ?? User
                  return <Icon size={18} className="text-[#7B9EBD]" />
                })()}
                <span className="font-bold text-gray-800">{ROLE_LABELS[myRole] ?? myRole}</span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full ml-auto', ROLE_COLORS[myRole] ?? 'bg-gray-100 text-gray-600')}>
                  {ROLE_LABELS[myRole] ?? myRole}
                </span>
              </div>
            </div>

            {/* Members list */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">家庭成員（{members.length} 人）</h3>
              <div className="space-y-2">
                {members.map(m => {
                  const Icon = ROLE_ICONS[m.role] ?? User
                  return (
                    <div key={m.id} className="card-warm p-3.5 flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center text-white text-sm font-bold gradient-hero')}>
                        {(m.display_name ?? '?')[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-gray-800 text-sm truncate">
                            {m.display_name ?? '未設定暱稱'}
                          </p>
                          {m.isMe && <span className="text-xs bg-[#EBF4FF] text-[#7B9EBD] px-1.5 py-0.5 rounded-full shrink-0">我</span>}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Icon size={11} className="text-gray-400" />
                          <p className="text-xs text-gray-500">{ROLE_LABELS[m.role] ?? m.role}</p>
                        </div>
                      </div>
                      {isPrimary && !m.isMe && (
                        <button
                          onClick={() => setShowRoleSheet(m)}
                          className="text-xs text-gray-400 hover:text-[#7B9EBD] shrink-0"
                        >
                          <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Invite */}
            <div className="card-warm p-4">
              <div className="flex items-center gap-2 mb-3">
                <UserPlus size={16} className="text-[#7B9EBD]" />
                <p className="font-bold text-gray-800 text-sm">邀請家人加入</p>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                分享以下連結給家人，他們可以加入並協助育兒紀錄。
              </p>
              <div className="bg-[#EBF4FF] rounded-2xl p-3 flex items-center gap-2">
                <p className="flex-1 text-xs text-gray-600 truncate font-mono">{inviteLink}</p>
                <button
                  onClick={copyInvite}
                  className={cn(
                    'shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                    copiedInvite ? 'bg-green-500 text-white' : 'bg-[#7B9EBD] text-white'
                  )}
                >
                  {copiedInvite ? <><Check size={12} /> 已複製</> : <><Copy size={12} /> 複製</>}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">連結有效期：7 天</p>
            </div>

            {/* Role explanation */}
            <div className="card-warm p-4">
              <p className="text-sm font-bold text-gray-700 mb-3">角色說明</p>
              <div className="space-y-2.5">
                {[
                  { role: 'primary', desc: '可編輯所有資料、管理成員角色', Icon: Crown },
                  { role: 'co_caregiver', desc: '可新增/編輯育兒紀錄', Icon: User },
                  { role: 'viewer', desc: '只能查看，不能編輯', Icon: Shield },
                ].map(({ role, desc, Icon }) => (
                  <div key={role} className="flex items-start gap-3">
                    <div className={cn('mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0', ROLE_COLORS[role])}>
                      <Icon size={13} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{ROLE_LABELS[role]}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            {/* Progress */}
            <div className="card-warm p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-gray-700">今日進度</p>
                <p className="text-sm font-bold text-[#7B9EBD]">{doneCount}/{tasks.length}</p>
              </div>
              <div className="h-2.5 bg-[#EBF4FF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7B9EBD] rounded-full transition-all duration-500"
                  style={{ width: `${(doneCount / tasks.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                {doneCount === tasks.length ? '🎉 今日任務全部完成！' : `還有 ${tasks.length - doneCount} 個任務待完成`}
              </p>
            </div>

            {/* Task groups */}
            {Object.entries(grouped).map(([category, catTasks]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-500 mb-2">{category}</h3>
                <div className="space-y-2">
                  {catTasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="w-full text-left"
                    >
                      <div className={cn(
                        'card-warm p-3.5 flex items-center gap-3 transition-all',
                        task.done && 'opacity-60'
                      )}>
                        <div className={cn(
                          'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                          task.done ? 'bg-[#7B9EBD] border-[#7B9EBD]' : 'border-gray-300'
                        )}>
                          {task.done && <Check size={13} className="text-white" />}
                        </div>
                        <span className="text-xl shrink-0">{task.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm font-semibold text-gray-800', task.done && 'line-through text-gray-400')}>
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-400">{task.assignee}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Info note */}
            <div className="bg-blue-50 rounded-2xl p-3.5 flex gap-2.5">
              <ClipboardList size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-600 leading-relaxed">
                育兒計畫讓全家人同步今日任務。完成任務後點擊打勾，其他成員也能即時看到進度。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Role change sheet */}
      {showRoleSheet && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowRoleSheet(null)}>
          <div className="w-full bg-white rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-gray-800">更改角色</h3>
                <p className="text-sm text-gray-500">{showRoleSheet.display_name ?? '未設定暱稱'}</p>
              </div>
              <button onClick={() => setShowRoleSheet(null)} className="text-gray-400"><X size={20} /></button>
            </div>
            <div className="space-y-2 mb-4">
              {(['co_caregiver', 'viewer'] as const).map(role => {
                const Icon = ROLE_ICONS[role]
                const isCurrentRole = showRoleSheet.role === role
                return (
                  <button
                    key={role}
                    onClick={() => setShowRoleSheet(null)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all',
                      isCurrentRole ? 'border-[#7B9EBD] bg-[#EBF4FF]' : 'border-gray-100 bg-white'
                    )}
                  >
                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', ROLE_COLORS[role])}>
                      <Icon size={16} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm text-gray-800">{ROLE_LABELS[role]}</p>
                      <p className="text-xs text-gray-500">
                        {role === 'co_caregiver' ? '可新增/編輯育兒紀錄' : '只能查看，不能編輯'}
                      </p>
                    </div>
                    {isCurrentRole && <Check size={16} className="text-[#7B9EBD] ml-auto" />}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 text-center">角色更改功能需要後端支援，目前為展示模式</p>
          </div>
        </div>
      )}
    </div>
  )
}
