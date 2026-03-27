'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Settings, ChevronRight, TrendingUp, MapPin, School, AlertCircle, Plus, Utensils, Star, Heart } from 'lucide-react'
import { formatAge, getAgeStage, calcAgeMonths } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import type { Profile, Child } from '@/types/database'

interface Props {
  profile: Profile | null
  children: Child[]
  recentMeal?: { meal_type: string; description: string | null; meal_date: string } | null
  latestGrowth?: { height_cm: number | null; weight_kg: number | null; measured_at: string } | null
  achievedMilestones?: number
}

// 副食品月齡建議（簡版，用於 Dashboard）
function getDietTip(ageMonths: number): string {
  if (ageMonths < 4) return '此階段純母乳或配方奶哺育，不需添加副食品。'
  if (ageMonths < 6) return '可準備開始嘗試副食品，從十倍粥或根莖類泥開始，每次新食材間隔 3-5 天。'
  if (ageMonths < 8) return '可開始嘗試蛋白質食材（蛋黃、豆腐、魚肉），每次從少量開始。'
  if (ageMonths < 10) return '軟質手指食物階段，可讓寶寶練習自主進食，培養手眼協調。'
  if (ageMonths < 12) return '食物可接近大人，少鹽少糖，蜂蜜 1 歲前禁止。'
  if (ageMonths < 24) return '1-2 歲語言爆發期，多說話、唱歌、閱讀促進語言發展。'
  return '可參與簡單家務，培養責任感和自信心。正向鼓勵比獎懲更有效。'
}

const MILESTONES_BY_AGE: Record<string, string[]> = {
  '0-3': ['追視移動物體', '對聲音有反應', '社交性微笑'],
  '4-6': ['翻身', '坐立支撐', '抓握玩具', '咿呀發聲'],
  '7-9': ['扶站', '爬行', '說「媽」「爸」', '捏取小物'],
  '10-12': ['扶走', '揮手再見', '理解簡單指令'],
  '13-18': ['獨立行走', '說單詞', '疊積木', '指認圖片'],
  '19-24': ['說詞組', '雙腳跳', '自己用湯匙'],
  '25-36': ['說短句', '如廁訓練', '參與假裝遊戲'],
}

function getMilestones(ageMonths: number): string[] {
  if (ageMonths <= 3) return MILESTONES_BY_AGE['0-3']
  if (ageMonths <= 6) return MILESTONES_BY_AGE['4-6']
  if (ageMonths <= 9) return MILESTONES_BY_AGE['7-9']
  if (ageMonths <= 12) return MILESTONES_BY_AGE['10-12']
  if (ageMonths <= 18) return MILESTONES_BY_AGE['13-18']
  if (ageMonths <= 24) return MILESTONES_BY_AGE['19-24']
  return MILESTONES_BY_AGE['25-36']
}

const quickActions = [
  { href: '/growth', icon: TrendingUp, label: '記錄生長', color: 'bg-green-100 text-green-600' },
  { href: '/meals', icon: Utensils, label: '飲食日記', color: 'bg-orange-100 text-orange-600' },
  { href: '/milestones', icon: Star, label: '里程碑', color: 'bg-yellow-100 text-yellow-600' },
  { href: '/places', icon: MapPin, label: '找景點', color: 'bg-blue-100 text-blue-600' },
  { href: '/kindergartens', icon: School, label: '幼兒園', color: 'bg-purple-100 text-purple-600' },
  { href: '/parents', icon: Heart, label: '家長心態', color: 'bg-pink-100 text-pink-600' },
  { href: '/sos', icon: AlertCircle, label: '崩潰急救', color: 'bg-red-100 text-red-600' },
]

export default function DashboardClient({ profile, children, recentMeal, latestGrowth, achievedMilestones }: Props) {
  const [activeChildIdx, setActiveChildIdx] = useState(0)
  const activeChild = children[activeChildIdx]
  const ageMonths = activeChild ? calcAgeMonths(activeChild.birth_date) : 0
  const milestones = getMilestones(ageMonths)
  const displayName = profile?.display_name || '爸媽'
  const greeting = new Date().getHours() < 12 ? '早安' : new Date().getHours() < 18 ? '午安' : '晚安'
  const dietTip = getDietTip(ageMonths)

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

          {/* 生長記錄摘要 */}
          {activeChild && latestGrowth && (
            <Link href="/growth">
              <Card className="p-4 border-green-100 bg-green-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-green-600" />
                    <span className="font-bold text-green-800 text-sm">最近生長紀錄</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(latestGrowth.measured_at).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex gap-4 mt-2">
                  {latestGrowth.height_cm && (
                    <div>
                      <p className="text-lg font-black text-gray-800">{latestGrowth.height_cm} <span className="text-xs font-normal text-gray-500">cm</span></p>
                      <p className="text-xs text-gray-500">身高</p>
                    </div>
                  )}
                  {latestGrowth.weight_kg && (
                    <div>
                      <p className="text-lg font-black text-gray-800">{latestGrowth.weight_kg} <span className="text-xs font-normal text-gray-500">kg</span></p>
                      <p className="text-xs text-gray-500">體重</p>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
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
                  <span className="text-xs text-gray-600 font-medium text-center leading-tight">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 今日飲食建議 */}
          {activeChild && (
            <Link href="/meals">
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🍽️</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-amber-800 mb-1">今日飲食建議</h3>
                        <ChevronRight size={16} className="text-amber-500" />
                      </div>
                      <p className="text-sm text-amber-700 leading-relaxed">{dietTip}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* 近期里程碑 */}
          {activeChild && milestones.length > 0 && (
            <Link href="/milestones">
              <Card>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-gray-800">本月發展里程碑</h2>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-orange-500 font-medium">{ageMonths} 個月</span>
                      <ChevronRight size={14} className="text-orange-400" />
                    </div>
                  </div>
                  {achievedMilestones !== undefined && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-orange-400 h-2 rounded-full"
                          style={{ width: `${milestones.length > 0 ? Math.min((achievedMilestones / milestones.length) * 100, 100) : 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{achievedMilestones}/{milestones.length}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    {milestones.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </div>
                    ))}
                    {milestones.length > 3 && (
                      <p className="text-xs text-orange-500 text-center pt-1">查看全部 {milestones.length} 項</p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* 今日育兒小知識 */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-bold text-blue-800 mb-1">今日育兒小知識</h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    {ageMonths < 6
                      ? '寶寶哭泣是正常溝通，及時回應有助建立安全依附。被及時回應的寶寶長大後反而更獨立。'
                      : ageMonths < 12
                      ? '副食品添加要循序漸進，每次新食材間隔 3-5 天，觀察有無過敏反應。'
                      : ageMonths < 24
                      ? '1-2 歲是語言爆發期，多和孩子說話、唱歌、閱讀，比看螢幕更有效。'
                      : '這個年齡的孩子喜歡「幫忙」，讓他們參與簡單家務，有助培養責任感和自信心。'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* 景點預覽 */}
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
