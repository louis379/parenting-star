'use client'

import { useState, useMemo } from 'react'
import { Star, CheckCircle, Circle, ChevronDown, ChevronRight, Lightbulb } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { calcAgeMonths } from '@/lib/utils'
import type { Child, Milestone } from '@/types/database'

interface Props {
  children: Child[]
  initialMilestones: Milestone[]
}

type Category = '大動作' | '小動作' | '語言' | '社交' | '認知'

interface MilestoneItem {
  key: string
  label: string
  minMonths: number
  maxMonths: number // 若超過此月齡未達成建議就醫
  activity?: string // 促進活動
}

const MILESTONE_DATA: Record<Category, MilestoneItem[]> = {
  '大動作': [
    { key: 'head_control', label: '俯臥時可抬頭 45 度', minMonths: 1, maxMonths: 4, activity: '多讓寶寶趴著玩，鍛鍊頸部肌肉' },
    { key: 'roll_over', label: '可以翻身（仰臥到俯臥）', minMonths: 4, maxMonths: 7, activity: '在旁邊放玩具吸引，輕輕引導翻身動作' },
    { key: 'sit_with_support', label: '扶坐穩定', minMonths: 4, maxMonths: 7, activity: '用枕頭圍著支撐，漸進減少輔助' },
    { key: 'sit_alone', label: '獨立坐穩', minMonths: 6, maxMonths: 9, activity: '每天讓寶寶練習坐在地墊上玩玩具' },
    { key: 'crawl', label: '爬行', minMonths: 7, maxMonths: 12, activity: '在地板上放玩具，鼓勵向前爬取' },
    { key: 'pull_to_stand', label: '扶物站立', minMonths: 8, maxMonths: 12, activity: '讓寶寶扶著沙發站立，給予鼓勵' },
    { key: 'walk_with_support', label: '扶走', minMonths: 9, maxMonths: 13, activity: '牽手練習走路，逐漸減少支撐' },
    { key: 'walk_alone', label: '獨立行走', minMonths: 11, maxMonths: 18, activity: '在安全空間讓寶寶自由練習走路' },
    { key: 'run', label: '跑步', minMonths: 18, maxMonths: 24, activity: '帶孩子到公園跑步遊戲' },
    { key: 'jump', label: '雙腳跳', minMonths: 24, maxMonths: 36, activity: '玩跳格子、青蛙跳等遊戲' },
  ],
  '小動作': [
    { key: 'grasp_reflex', label: '手握住放入的物品', minMonths: 0, maxMonths: 3, activity: '將玩具或手指放入寶寶手掌' },
    { key: 'reach_grasp', label: '主動伸手抓握', minMonths: 3, maxMonths: 6, activity: '在視線範圍內晃動玩具吸引抓握' },
    { key: 'transfer_hands', label: '兩手傳遞物品', minMonths: 5, maxMonths: 8, activity: '練習將積木從一手傳到另一手' },
    { key: 'pincer_grasp', label: '拇指食指捏取小物', minMonths: 8, maxMonths: 12, activity: '撕小紙片、撿小零食練習精細動作' },
    { key: 'scribble', label: '塗鴉握筆', minMonths: 12, maxMonths: 18, activity: '提供大蠟筆和大紙張讓孩子自由塗鴉' },
    { key: 'stack_blocks', label: '疊 2-3 個積木', minMonths: 12, maxMonths: 18, activity: '和孩子一起玩積木，示範堆疊' },
    { key: 'turn_pages', label: '翻書頁', minMonths: 15, maxMonths: 24, activity: '每天陪孩子閱讀，讓他自己翻頁' },
    { key: 'draw_circle', label: '模仿畫圓形', minMonths: 24, maxMonths: 36, activity: '在紙上畫圓讓孩子模仿' },
  ],
  '語言': [
    { key: 'coo', label: '發出咿呀聲（咕咕聲）', minMonths: 1, maxMonths: 4, activity: '模仿寶寶的發聲，進行對話互動' },
    { key: 'laugh', label: '發出笑聲', minMonths: 3, maxMonths: 5, activity: '做鬼臉、搔癢等引逗寶寶發笑' },
    { key: 'babble', label: '牙牙學語（ba、ma、da）', minMonths: 5, maxMonths: 9, activity: '反覆說簡單音節，鼓勵模仿' },
    { key: 'first_word', label: '說出第一個有意義的詞', minMonths: 8, maxMonths: 14, activity: '常指著物品說名稱，建立詞彙聯結' },
    { key: 'words_10', label: '會說 10 個以上的詞', minMonths: 12, maxMonths: 18, activity: '每天和孩子大量對話，命名周圍事物' },
    { key: 'two_word', label: '說兩個詞的組合（如：媽媽抱）', minMonths: 18, maxMonths: 24, activity: '用簡短句子說話，引導孩子組合詞語' },
    { key: 'sentence', label: '說 3-4 個詞的句子', minMonths: 24, maxMonths: 36, activity: '多讀故事書，使用完整句子對話' },
  ],
  '社交': [
    { key: 'social_smile', label: '社交性微笑（對臉孔微笑）', minMonths: 1, maxMonths: 3, activity: '對寶寶微笑和說話，促進社交互動' },
    { key: 'recognize_face', label: '認識熟悉的臉孔', minMonths: 3, maxMonths: 6, activity: '讓多位家人與寶寶互動' },
    { key: 'stranger_anxiety', label: '見生人感到緊張（正常現象）', minMonths: 6, maxMonths: 12, activity: '讓陌生人先保持距離，讓寶寶觀察後再互動' },
    { key: 'wave_bye', label: '揮手說再見', minMonths: 8, maxMonths: 12, activity: '每次離別時示範揮手，引導孩子模仿' },
    { key: 'parallel_play', label: '平行遊戲（在旁邊玩類似的遊戲）', minMonths: 18, maxMonths: 30, activity: '安排和同齡孩子在同一空間各自玩耍' },
    { key: 'cooperative_play', label: '合作遊戲', minMonths: 30, maxMonths: 48, activity: '安排結構性的合作遊戲活動' },
  ],
  '認知': [
    { key: 'track_object', label: '視線追蹤移動物品', minMonths: 0, maxMonths: 3, activity: '在寶寶視線前慢慢移動玩具' },
    { key: 'object_permanence', label: '物體恆存（知道物品存在）', minMonths: 6, maxMonths: 10, activity: '玩躲貓貓，讓玩具在視線外消失再出現' },
    { key: 'cause_effect', label: '了解因果關係（按壓有聲音）', minMonths: 6, maxMonths: 12, activity: '提供按壓有聲音或燈光的玩具' },
    { key: 'imitate_actions', label: '模仿大人動作', minMonths: 9, maxMonths: 15, activity: '示範簡單動作如拍手、搖頭讓孩子模仿' },
    { key: 'pretend_play', label: '假裝遊戲（餵布偶吃飯）', minMonths: 15, maxMonths: 24, activity: '準備廚房玩具、布偶等引發假裝遊戲' },
    { key: 'sort_shapes', label: '依形狀或顏色分類', minMonths: 24, maxMonths: 36, activity: '玩分類積木、顏色配對遊戲' },
  ],
}

const CATEGORY_CONFIG: Record<Category, { emoji: string; color: string; bg: string }> = {
  '大動作': { emoji: '🏃', color: 'text-blue-600', bg: 'bg-blue-50' },
  '小動作': { emoji: '✋', color: 'text-purple-600', bg: 'bg-purple-50' },
  '語言': { emoji: '💬', color: 'text-green-600', bg: 'bg-green-50' },
  '社交': { emoji: '👥', color: 'text-[#9B8BB4]', bg: 'bg-[#F0EBF8]' },
  '認知': { emoji: '🧠', color: 'text-amber-600', bg: 'bg-amber-50' },
}

export default function MilestonesClient({ children, initialMilestones }: Props) {
  const [activeChildIdx, setActiveChildIdx] = useState(0)
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)
  const [expandedCategories, setExpandedCategories] = useState<Set<Category>>(new Set(['大動作']))
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const activeChild = children[activeChildIdx]
  const ageMonths = activeChild ? calcAgeMonths(activeChild.birth_date) : 0

  const achievedKeys = useMemo(() => new Set(milestones.map(m => m.milestone_key)), [milestones])

  const categories = Object.keys(MILESTONE_DATA) as Category[]

  // 計算整體進度
  const progress = useMemo(() => {
    const relevant = categories.flatMap(cat =>
      MILESTONE_DATA[cat].filter(m => m.minMonths <= ageMonths + 2)
    )
    const achieved = relevant.filter(m => achievedKeys.has(m.key))
    return { total: relevant.length, achieved: achieved.length }
  }, [ageMonths, achievedKeys, categories])

  // 計算每個類別的進度
  function getCategoryProgress(cat: Category) {
    const items = MILESTONE_DATA[cat].filter(m => m.minMonths <= ageMonths + 2)
    const achieved = items.filter(m => achievedKeys.has(m.key))
    return { total: items.length, achieved: achieved.length }
  }

  async function toggleMilestone(item: MilestoneItem, category: Category) {
    if (!activeChild) return
    setSaving(item.key)
    const supabase = createClient()
    const isAchieved = achievedKeys.has(item.key)

    if (isAchieved) {
      // 刪除里程碑
      const milestone = milestones.find(m => m.milestone_key === item.key)
      if (milestone) {
        await supabase.from('milestones').delete().eq('id', milestone.id)
        setMilestones(prev => prev.filter(m => m.milestone_key !== item.key))
      }
    } else {
      // 新增里程碑
      const { data, error } = await supabase
        .from('milestones')
        .insert({
          child_id: activeChild.id,
          category,
          milestone_key: item.key,
          achieved_at: new Date().toISOString().split('T')[0],
        })
        .select()
        .single()
      if (!error && data) {
        setMilestones(prev => [...prev, data])
      }
    }
    setSaving(null)
  }

  function toggleCategory(cat: Category) {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const progressPct = progress.total > 0 ? Math.round((progress.achieved / progress.total) * 100) : 0

  return (
    <div style={{ background: '#FAFAF5' }} className="min-h-screen">
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <Star size={22} />
          <h1 className="text-xl font-black">發展里程碑</h1>
        </div>

        {children.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {children.map((child, i) => (
              <button
                key={child.id}
                onClick={() => setActiveChildIdx(i)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  i === activeChildIdx ? 'bg-white text-[#5E85A3]' : 'bg-white/20 text-white'
                }`}
              >
                {child.nickname}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-4 space-y-4">
        {activeChild && (
          <>
            {/* 整體進度 */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-gray-800">整體達成進度</h2>
                <span className="text-lg font-black text-[#7B9EBD]">{progressPct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-[#7B9EBD] to-[#A8C5DA] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {ageMonths} 個月寶寶應關注的 {progress.total} 個里程碑中，已達成 {progress.achieved} 個
              </p>
            </Card>

            {/* 各類別 */}
            {categories.map(cat => {
              const config = CATEGORY_CONFIG[cat]
              const catProgress = getCategoryProgress(cat)
              const isExpanded = expandedCategories.has(cat)
              const items = MILESTONE_DATA[cat].filter(m => m.minMonths <= ageMonths + 2)
              const delayedItems = items.filter(m => m.maxMonths < ageMonths && !achievedKeys.has(m.key))

              return (
                <Card key={cat}>
                  <button
                    className="w-full p-4 flex items-center justify-between"
                    onClick={() => toggleCategory(cat)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center text-xl`}>
                        {config.emoji}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-800">{cat}</p>
                        <p className="text-xs text-gray-500">
                          {catProgress.achieved}/{catProgress.total} 已達成
                          {delayedItems.length > 0 && (
                            <span className="ml-1 text-red-500">· {delayedItems.length} 項需關注</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* mini progress ring */}
                      <div className="relative w-8 h-8">
                        <svg viewBox="0 0 32 32" className="w-8 h-8 -rotate-90">
                          <circle cx="16" cy="16" r="12" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                          <circle
                            cx="16" cy="16" r="12" fill="none"
                            stroke={delayedItems.length > 0 ? '#ef4444' : '#f97316'}
                            strokeWidth="4"
                            strokeDasharray={`${catProgress.total > 0 ? (catProgress.achieved / catProgress.total) * 75.4 : 0} 75.4`}
                          />
                        </svg>
                      </div>
                      {isExpanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2 border-t border-gray-50">
                      {items.length === 0 && (
                        <p className="text-sm text-gray-400 py-3 text-center">此月齡尚無此類別里程碑</p>
                      )}
                      {items.map(item => {
                        const isAchieved = achievedKeys.has(item.key)
                        const isDelayed = item.maxMonths < ageMonths && !isAchieved
                        const isCurrentlySaving = saving === item.key

                        return (
                          <div key={item.key}>
                            <button
                              onClick={() => toggleMilestone(item, cat)}
                              disabled={isCurrentlySaving}
                              className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all ${
                                isAchieved
                                  ? 'bg-green-50'
                                  : isDelayed
                                  ? 'bg-red-50'
                                  : 'bg-gray-50 hover:bg-[#EBF4FF]'
                              }`}
                            >
                              {isAchieved ? (
                                <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" />
                              ) : (
                                <Circle size={20} className={`shrink-0 mt-0.5 ${isDelayed ? 'text-red-400' : 'text-gray-300'}`} />
                              )}
                              <div className="text-left flex-1">
                                <p className={`text-sm font-medium ${isAchieved ? 'text-green-700 line-through' : isDelayed ? 'text-red-700' : 'text-gray-700'}`}>
                                  {item.label}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {item.minMonths}-{item.maxMonths} 個月
                                  {isDelayed && ' · 建議留意'}
                                </p>
                              </div>
                              {item.activity && !isAchieved && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setExpandedActivity(expandedActivity === item.key ? null : item.key)
                                  }}
                                  className="shrink-0"
                                >
                                  <Lightbulb size={16} className="text-amber-400" />
                                </button>
                              )}
                            </button>
                            {expandedActivity === item.key && item.activity && (
                              <div className="mx-3 mb-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <p className="text-xs text-amber-800 font-semibold mb-1">促進活動建議</p>
                                <p className="text-sm text-amber-700">{item.activity}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </Card>
              )
            })}

            {/* 免責提醒 */}
            <Card className="bg-blue-50 border-blue-100">
              <div className="p-4">
                <p className="text-xs text-blue-700 leading-relaxed">
                  📌 里程碑達成時間因孩子個體差異而不同，以上僅供參考。若有疑慮，請諮詢兒科醫師或發展兒童心理師進行專業評估。
                </p>
              </div>
            </Card>
          </>
        )}

        {children.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">⭐</p>
            <p className="text-gray-500 mb-4">還沒有孩子資料</p>
            <button
              onClick={() => window.location.href = '/onboarding'}
              className="px-6 py-3 bg-[#7B9EBD] text-white rounded-2xl font-semibold"
            >
              新增孩子資料
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
