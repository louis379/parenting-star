'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Settings, ChevronRight, TrendingUp, MapPin, School, AlertCircle, Plus } from 'lucide-react'
import { formatAge, getAgeStage, calcAgeMonths } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import type { Profile, Child } from '@/types/database'

interface Props {
  profile: Profile | null
  children: Child[]
}

const quickActions = [
  { href: '/growth', icon: TrendingUp, label: '記錄生長', color: 'bg-green-100 text-green-600' },
  { href: '/places', icon: MapPin, label: '找景點', color: 'bg-blue-100 text-blue-600' },
  { href: '/kindergartens', icon: School, label: '查幼兒園', color: 'bg-purple-100 text-purple-600' },
  { href: '/sos', icon: AlertCircle, label: '崩潰急救', color: 'bg-red-100 text-red-600' },
]

const MILESTONES: Record<string, { range: [number, number]; items: string[] }[]> = {
  '0-3m': [{ range: [0, 3], items: ['追視移動物體', '對聲音有反應', '社交性微笑'] }],
  '4-6m': [{ range: [4, 6], items: ['翻身', '坐立支撐', '抓握玩具', '咿呀發聲'] }],
  '7-12m': [{ range: [7, 12], items: ['扶站', '爬行', '說第一個詞', '捏取小物'] }],
  '13-24m': [{ range: [13, 24], items: ['獨立行走', '說詞組', '疊積木', '指認圖片'] }],
  '25-36m': [{ range: [25, 36], items: ['雙腳跳', '說短句', '自己吃飯', '如廁訓練'] }],
}

function getMilestones(ageMonths: number): string[] {
  for (const [, stages] of Object.entries(MILESTONES)) {
    for (const { range, items } of stages) {
      if (ageMonths >= range[0] && ageMonths <= range[1]) return items
    }
  }
  return []
}

export default function DashboardClient({ profile, children }: Props) {
  const [activeChildIdx, setActiveChildIdx] = useState(0)
  const activeChild = children[activeChildIdx]
  const ageMonths = activeChild ? calcAgeMonths(activeChild.birth_date) : 0
  const milestones = getMilestones(ageMonths)
  const displayName = profile?.display_name || '爸媽'
  const greeting = new Date().getHours() < 12 ? '早安' : new Date().getHours() < 18 ? '午安' : '晚安'

  return (
    <div className="min-h-screen" style={{ background: '#fffbf5' }}>
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-20 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            <p className="text-orange-100 text-sm">{greeting}，</p>
            <h1 className="text-2xl font-black">{displayName} 👋</h1>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Bell size={18} />
            </button>
            <Link href="/settings" className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Settings size={18} />
            </Link>
          </div>
        </div>

        {/* Child selector */}
        {children.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-1 relative z-10">
            {children.map((child, i) => (
              <button
                key={child.id}
                onClick={() => setActiveChildIdx(i)}
                className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  i === activeChildIdx
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'bg-white/20 text-white'
                }`}
              >
                <span>{child.gender === '男生' ? '👦' : child.gender === '女生' ? '👧' : '🧒'}</span>
                <span>{child.nickname}</span>
              </button>
            ))}
          </div>
        ) : (
          <Link href="/onboarding" className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-sm relative z-10">
            <Plus size={16} />
            <span>新增孩子資料</span>
          </Link>
        )}
      </div>

      {/* Wave + Content */}
      <div className="relative -mt-12">
        <svg viewBox="0 0 390 50" className="w-full" preserveAspectRatio="none">
          <path d="M0,25 C130,50 260,0 390,25 L390,50 L0,50 Z" fill="#fffbf5" />
        </svg>

        <div className="px-5 -mt-6 space-y-4 pb-6">
          {/* Active child card */}
          {activeChild && (
            <Card className="p-4 border-orange-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center text-2xl">
                  {activeChild.gender === '男生' ? '👦' : activeChild.gender === '女生' ? '👧' : '🧒'}
                </div>
                <div className="flex-1">
                  <h2 className="font-black text-gray-800 text-lg">{activeChild.nickname}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-orange-500 font-semibold">{formatAge(activeChild.birth_date)}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500 bg-orange-50 px-2 py-0.5 rounded-full">
                      {getAgeStage(ageMonths)}
                    </span>
                  </div>
                  {activeChild.allergies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {activeChild.allergies.slice(0, 3).map(a => (
                        <span key={a} className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                          ⚠️ {a}過敏
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Link href="/growth" className="text-orange-400">
                  <ChevronRight size={20} />
                </Link>
              </div>
            </Card>
          )}

          {/* Quick actions */}
          <div>
            <h2 className="font-bold text-gray-700 mb-3">快速功能</h2>
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map(({ href, icon: Icon, label, color }) => (
                <Link key={href} href={href} className="flex flex-col items-center gap-1.5">
                  <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Milestones */}
          {milestones.length > 0 && (
            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-gray-800">本月發展里程碑</h2>
                  <span className="text-xs text-orange-500 font-medium">{ageMonths} 個月</span>
                </div>
                <div className="space-y-2">
                  {milestones.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Tips */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-bold text-amber-800 mb-1">今日育兒小知識</h3>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    {ageMonths < 6
                      ? '6個月前的寶寶消化系統尚未成熟，建議純母乳或配方奶哺育，等滿6個月後再開始添加副食品。'
                      : ageMonths < 12
                      ? '這個階段可以開始嘗試多種食材的副食品，每次新食材之間間隔3-5天，觀察有無過敏反應。'
                      : ageMonths < 24
                      ? '1-2歲是語言爆發期，多和孩子說話、唱歌、閱讀，能有效促進語言發展。'
                      : '這個年齡的孩子喜歡模仿大人，讓他們參與簡單的家務，有助培養責任感和自信心。'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Trending places preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-700">熱門親子景點</h2>
              <Link href="/places" className="text-orange-500 text-sm font-medium">看全部</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[
                { name: '國立海洋生物博物館', city: '屏東', emoji: '🐋' },
                { name: '奇美博物館', city: '台南', emoji: '🏛️' },
                { name: '兒童新樂園', city: '台北', emoji: '🎠' },
                { name: '日月潭', city: '南投', emoji: '🌊' },
              ].map(place => (
                <Link key={place.name} href="/places" className="shrink-0 w-32">
                  <div className="h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-3xl mb-1.5">
                    {place.emoji}
                  </div>
                  <p className="text-xs font-medium text-gray-700 line-clamp-1">{place.name}</p>
                  <p className="text-xs text-gray-400">{place.city}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
