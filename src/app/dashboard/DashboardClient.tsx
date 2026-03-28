'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Bell, Settings, ChevronRight, TrendingUp, MapPin, School, AlertCircle, Plus, Utensils, Star, Heart, Clock, BookOpen, Brain, Sprout } from 'lucide-react'
import { formatAge, getAgeStage, calcAgeMonths } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { useProfileStore } from '@/stores/profileStore'
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
  { href: '/growth', icon: TrendingUp, label: '記錄生長', color: 'bg-[#EBF4FF] text-[#7B9EBD]' },
  { href: '/timeline', icon: Clock, label: '成長時間軸', color: 'bg-[#F0F8FF] text-[#5E85A3]' },
  { href: '/meals', icon: Utensils, label: '飲食日記', color: 'bg-[#F5E6C8] text-[#B89A78]' },
  { href: '/milestones', icon: Star, label: '里程碑', color: 'bg-[#EBF4EB] text-[#7BA87B]' },
  { href: '/places', icon: MapPin, label: '找景點', color: 'bg-[#EBF6F2] text-[#7BB8A8]' },
  { href: '/kindergartens', icon: School, label: '幼兒園', color: 'bg-[#F0EBF8] text-[#9B8BB4]' },
  { href: '/parents', icon: Heart, label: '家長心態', color: 'bg-[#FDF0E8] text-[#D4956A]' },
  { href: '/sos', icon: AlertCircle, label: '崩潰急救', color: 'bg-red-50 text-red-400' },
]

// 階段推薦好文 — 根據月齡推薦對應文章
const STAGE_ARTICLES: Record<string, { title: string; desc: string; href: string; icon: typeof BookOpen; tag: string; tagColor: string }[]> = {
  '0-3': [
    { title: '新生兒哭泣的 6 種信號解讀', desc: '讀懂寶寶的溝通語言，減少焦慮', href: '/psychology', icon: Brain, tag: '心理', tagColor: 'bg-purple-100 text-purple-600' },
    { title: '0-3 個月餵食指南', desc: '母乳 vs 配方奶，按需哺餵的節奏', href: '/growth', icon: Sprout, tag: '生長', tagColor: 'bg-green-100 text-green-600' },
    { title: '建立安全依附：新手爸媽必讀', desc: '7:1 正向互動法則，打造情感基礎', href: '/psychology', icon: Heart, tag: '教養', tagColor: 'bg-rose-100 text-rose-600' },
  ],
  '4-6': [
    { title: '副食品啟程：何時開始？怎麼開始？', desc: '從十倍粥到根莖泥，循序漸進', href: '/growth', icon: Sprout, tag: '營養', tagColor: 'bg-green-100 text-green-600' },
    { title: '翻身期的感統遊戲', desc: '趴趴練習 + 觸覺刺激，促進大動作', href: '/education', icon: BookOpen, tag: '教育', tagColor: 'bg-blue-100 text-blue-600' },
    { title: '4-6 個月情緒發展里程碑', desc: '社交微笑、分離焦慮的正確回應', href: '/psychology', icon: Brain, tag: '心理', tagColor: 'bg-purple-100 text-purple-600' },
  ],
  '7-12': [
    { title: '爬行期安全空間設計', desc: '居家防護 + 鼓勵探索的平衡', href: '/growth', icon: Sprout, tag: '生長', tagColor: 'bg-green-100 text-green-600' },
    { title: '手指食物階段：培養自主進食', desc: 'BLW 入門 vs 傳統餵食的優缺', href: '/meals', icon: Utensils, tag: '營養', tagColor: 'bg-amber-100 text-amber-600' },
    { title: '語言啟蒙：親子共讀的神奇效果', desc: '每天 15 分鐘，詞彙量翻倍', href: '/education', icon: BookOpen, tag: '教育', tagColor: 'bg-blue-100 text-blue-600' },
  ],
  '13-24': [
    { title: '語言爆發期：如何正確引導', desc: '命名遊戲、自言自語是好事', href: '/education', icon: BookOpen, tag: '教育', tagColor: 'bg-blue-100 text-blue-600' },
    { title: '學步期情緒風暴對應指南', desc: 'Terrible Two 不可怕的 4 步心法', href: '/psychology', icon: Brain, tag: '心理', tagColor: 'bg-purple-100 text-purple-600' },
    { title: '1-2 歲大動作發展：從扶走到奔跑', desc: '每個月齡的正常發展與紅旗指標', href: '/growth', icon: Sprout, tag: '生長', tagColor: 'bg-green-100 text-green-600' },
  ],
  '25-48': [
    { title: '正向教養入門：不吼不打的界線設定', desc: '溫和而堅定，從 A-C-T 三步驟開始', href: '/psychology', icon: Brain, tag: '心理', tagColor: 'bg-purple-100 text-purple-600' },
    { title: '螢幕時間管理：不同年齡的建議', desc: '數位素養從小建立，避免成癮', href: '/education', icon: BookOpen, tag: '教育', tagColor: 'bg-blue-100 text-blue-600' },
    { title: '社交力培養：從平行遊戲到合作遊戲', desc: '讀懂孩子的社交發展階段', href: '/psychology', icon: Heart, tag: '教養', tagColor: 'bg-rose-100 text-rose-600' },
  ],
  '49+': [
    { title: '入學準備：不只是認字寫字', desc: '自理能力 + 情緒管理更重要', href: '/education', icon: BookOpen, tag: '教育', tagColor: 'bg-blue-100 text-blue-600' },
    { title: '培養閱讀習慣的 5 個關鍵', desc: '從共讀到獨立閱讀的過渡', href: '/education', icon: BookOpen, tag: '教育', tagColor: 'bg-blue-100 text-blue-600' },
    { title: '霸凌預防：教孩子表達與求助', desc: '角色扮演 + 同理心訓練', href: '/psychology', icon: Brain, tag: '心理', tagColor: 'bg-purple-100 text-purple-600' },
  ],
}

function getStageArticles(months: number) {
  if (months <= 3) return STAGE_ARTICLES['0-3']
  if (months <= 6) return STAGE_ARTICLES['4-6']
  if (months <= 12) return STAGE_ARTICLES['7-12']
  if (months <= 24) return STAGE_ARTICLES['13-24']
  if (months <= 48) return STAGE_ARTICLES['25-48']
  return STAGE_ARTICLES['49+']
}

// 本週發展重點
function getWeeklyFocus(months: number): { emoji: string; title: string; tips: string[] } {
  if (months < 1) return { emoji: '🍼', title: '建立哺餵節奏', tips: ['按需哺餵，不需刻意設時間表', '觀察寶寶飢餓信號：嘴巴動、轉頭找', '每天記錄哺餵次數，幫助掌握規律'] }
  if (months < 3) return { emoji: '😊', title: '安全感與互動', tips: ['多做肌膚接觸（袋鼠式照護）', '對寶寶微笑說話，建立社交連結', '保持規律的睡眠環境'] }
  if (months < 6) return { emoji: '🔄', title: '探索與翻身', tips: ['每天趴趴時間 15-20 分鐘', '準備色彩鮮豔的視覺刺激玩具', '開始留意副食品準備時機'] }
  if (months < 9) return { emoji: '🥣', title: '副食品新體驗', tips: ['嘗試新食材，保持正向用餐氣氛', '每次新食材間隔 3-5 天觀察', '讓寶寶用手抓握食物練習'] }
  if (months < 12) return { emoji: '🚶', title: '移動與探索', tips: ['提供安全爬行空間', '玩「物體恆存」的遊戲（藏找玩具）', '多說日常事物名稱，增加詞彙輸入'] }
  if (months < 18) return { emoji: '🗣️', title: '語言萌芽期', tips: ['回應寶寶的每個嘗試發音', '親子共讀，用手指指著圖片命名', '不要糾正發音，用正確發音重述'] }
  if (months < 24) return { emoji: '🧩', title: '自主與界線', tips: ['給孩子「二選一」的選擇機會', '建立簡單的日常作息規律', '用「我們做...」取代「不可以」'] }
  if (months < 36) return { emoji: '🎭', title: '假裝遊戲與社交', tips: ['加入孩子的假裝遊戲，豐富情節', '練習輪流等待與分享概念', '情緒來時先接住，再引導'] }
  return { emoji: '📚', title: '學習與獨立', tips: ['鼓勵好奇心，回答每個「為什麼」', '讓孩子參與家務，培養責任感', '每天固定親子共讀或聊天時間'] }
}

export default function DashboardClient({ profile, children, recentMeal, latestGrowth, achievedMilestones }: Props) {
  const { setProfile, setChildren, activeChildId, setActiveChildId, activeChild: getActiveChild } = useProfileStore()

  useEffect(() => {
    setProfile(profile)
    setChildren(children)
  }, [profile, children, setProfile, setChildren])

  const activeChild = getActiveChild()
  function setActiveChildIdx(idx: number) {
    setActiveChildId(children[idx]?.id ?? null)
  }
  const activeChildIdx = children.findIndex(c => c.id === activeChildId)
  const ageMonths = activeChild ? calcAgeMonths(activeChild.birth_date) : 0
  const milestones = getMilestones(ageMonths)
  const displayName = profile?.display_name || '爸媽'
  const greeting = new Date().getHours() < 12 ? '早安' : new Date().getHours() < 18 ? '午安' : '晚安'
  const dietTip = getDietTip(ageMonths)

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-20 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            <p className="text-white/70 text-sm">{greeting}，</p>
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
                    ? 'bg-white text-[#5E85A3] shadow-sm'
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
          <path d="M0,25 C130,50 260,0 390,25 L390,50 L0,50 Z" fill="#FAFAF5" />
        </svg>

        <div className="px-5 -mt-6 space-y-4 pb-6">
          {/* Active child card */}
          {activeChild && (
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center text-2xl">
                  {activeChild.gender === '男生' ? '👦' : activeChild.gender === '女生' ? '👧' : '🧒'}
                </div>
                <div className="flex-1">
                  <h2 className="font-black text-gray-800 text-lg">{activeChild.nickname}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-[#7B9EBD] font-semibold">{formatAge(activeChild.birth_date)}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500 bg-[#EBF4FF] px-2 py-0.5 rounded-full">
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
                <Link href="/growth" className="text-[#7B9EBD]">
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
              <Card style={{ background: 'linear-gradient(135deg, #FAFAF5 0%, #F5E6C8 100%)', borderColor: '#E8D5B7' }}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🍽️</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[#8B6A3E] mb-1">今日飲食建議</h3>
                        <ChevronRight size={16} className="text-[#D4B896]" />
                      </div>
                      <p className="text-sm text-[#6B5030] leading-relaxed">{dietTip}</p>
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
                      <span className="text-xs text-[#7B9EBD] font-medium">{ageMonths} 個月</span>
                      <ChevronRight size={14} className="text-[#7B9EBD]" />
                    </div>
                  </div>
                  {achievedMilestones !== undefined && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-[#7B9EBD] h-2 rounded-full"
                          style={{ width: `${milestones.length > 0 ? Math.min((achievedMilestones / milestones.length) * 100, 100) : 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{achievedMilestones}/{milestones.length}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    {milestones.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7B9EBD] shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </div>
                    ))}
                    {milestones.length > 3 && (
                      <p className="text-xs text-[#7B9EBD] text-center pt-1">查看全部 {milestones.length} 項</p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* 本週發展重點 */}
          {activeChild && (() => {
            const focus = getWeeklyFocus(ageMonths)
            return (
              <Card className="bg-gradient-to-br from-[#EBF4FF] to-[#F0F8FF] border-[#C5D8E8]">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{focus.emoji}</span>
                    <h3 className="font-bold text-[#3D6A8A]">本週發展重點：{focus.title}</h3>
                  </div>
                  <div className="space-y-2">
                    {focus.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-xs font-bold text-[#7B9EBD] mt-0.5">{['①', '②', '③'][i]}</span>
                        <p className="text-sm text-[#4A5568] leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })()}

          {/* 階段推薦好文 */}
          {activeChild && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-700">推薦閱讀</h2>
                <span className="text-xs text-[#7B9EBD] bg-[#EBF4FF] px-2 py-0.5 rounded-full">{getAgeStage(ageMonths)}</span>
              </div>
              <div className="space-y-2">
                {getStageArticles(ageMonths).map((article, i) => {
                  const Icon = article.icon
                  return (
                    <Link key={i} href={article.href}>
                      <Card className="p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#EBF4FF] flex items-center justify-center shrink-0">
                            <Icon size={18} className="text-[#7B9EBD]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${article.tagColor}`}>{article.tag}</span>
                              <p className="font-semibold text-gray-800 text-sm truncate">{article.title}</p>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">{article.desc}</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-300 shrink-0 mt-2" />
                        </div>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
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
              <Link href="/places" className="text-[#7B9EBD] text-sm font-medium">看全部</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[
                { name: '國立海洋生物博物館', city: '屏東', emoji: '🐋' },
                { name: '台北市立動物園', city: '台北', emoji: '🐼' },
                { name: '奇美博物館', city: '台南', emoji: '🏛️' },
                { name: 'Xpark 水族館', city: '桃園', emoji: '🐠' },
                { name: '溪頭自然園區', city: '南投', emoji: '🌲' },
                { name: '駁二藝術特區', city: '高雄', emoji: '🎨' },
              ].map(place => (
                <Link key={place.name} href="/places" className="shrink-0 w-32">
                  <div className="h-20 rounded-2xl bg-gradient-to-br from-[#EBF4FF] to-[#F5E6C8] flex items-center justify-center text-3xl mb-1.5">
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
