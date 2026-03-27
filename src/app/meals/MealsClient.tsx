'use client'

import { useState, useMemo } from 'react'
import { Plus, Utensils, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { calcAgeMonths } from '@/lib/utils'
import type { Child, MealRecord } from '@/types/database'

interface Props {
  children: Child[]
  initialRecords: MealRecord[]
}

const MEAL_TYPES = [
  { value: '早餐', emoji: '🌅', color: 'bg-yellow-100 text-yellow-700' },
  { value: '午餐', emoji: '☀️', color: 'bg-[#EBF4FF] text-[#5E85A3]' },
  { value: '晚餐', emoji: '🌙', color: 'bg-indigo-100 text-indigo-700' },
  { value: '點心', emoji: '🍎', color: 'bg-green-100 text-green-700' },
]

// 副食品建議資料
const FOOD_SUGGESTIONS: Record<string, {
  title: string
  foods: { name: string; emoji: string; safe: boolean }[]
  tips: string[]
  allergyWarning: string[]
}> = {
  '0-3': {
    title: '純母乳/配方奶期',
    foods: [],
    tips: ['此階段寶寶只需要母乳或配方奶', '不要添加任何副食品', '按需哺乳，滿足寶寶需求'],
    allergyWarning: [],
  },
  '4-5': {
    title: '副食品初期（4-6個月）',
    foods: [
      { name: '十倍粥', emoji: '🍚', safe: true },
      { name: '地瓜泥', emoji: '🍠', safe: true },
      { name: '南瓜泥', emoji: '🎃', safe: true },
      { name: '胡蘿蔔泥', emoji: '🥕', safe: true },
      { name: '馬鈴薯泥', emoji: '🥔', safe: true },
      { name: '蘋果泥', emoji: '🍎', safe: true },
      { name: '香蕉泥', emoji: '🍌', safe: true },
    ],
    tips: ['每次新食材間隔 3-5 天', '質地要細滑如泥', '從一茶匙開始，逐漸增量', '觀察 3 天確認無過敏反應'],
    allergyWarning: ['蛋白', '蜂蜜（1歲前禁止）', '堅果類', '海鮮'],
  },
  '6-7': {
    title: '副食品中期（6-8個月）',
    foods: [
      { name: '蛋黃泥', emoji: '🥚', safe: true },
      { name: '豆腐', emoji: '🫘', safe: true },
      { name: '鱈魚', emoji: '🐟', safe: true },
      { name: '雞胸肉泥', emoji: '🍗', safe: true },
      { name: '五倍粥', emoji: '🍚', safe: true },
      { name: '菠菜泥', emoji: '🌿', safe: true },
      { name: '燕麥粥', emoji: '🌾', safe: true },
    ],
    tips: ['可開始嘗試蛋白質食材', '肉類要打成泥狀', '魚類去刺後再喂食', '可加入少量蔬菜混合'],
    allergyWarning: ['完整雞蛋蛋白', '堅果類', '帶殼海鮮（蝦、蟹）', '蜂蜜（1歲前禁止）'],
  },
  '8-9': {
    title: '副食品中後期（8-10個月）',
    foods: [
      { name: '軟爛米飯', emoji: '🍚', safe: true },
      { name: '手指條紅蘿蔔', emoji: '🥕', safe: true },
      { name: '香蕉條', emoji: '🍌', safe: true },
      { name: '豆腐塊', emoji: '🫘', safe: true },
      { name: '雞蛋（全蛋）', emoji: '🥚', safe: true },
      { name: '鮭魚', emoji: '🐟', safe: true },
      { name: '起司', emoji: '🧀', safe: true },
    ],
    tips: ['可嘗試手指食物，培養自主進食', '食物可切成小塊，不須完全打泥', '讓寶寶練習用拇指和食指抓取'],
    allergyWarning: ['堅果類', '帶殼海鮮', '蜂蜜（1歲前禁止）'],
  },
  '10-11': {
    title: '副食品後期（10-12個月）',
    foods: [
      { name: '軟飯', emoji: '🍚', safe: true },
      { name: '小饅頭', emoji: '🥐', safe: true },
      { name: '炒蛋', emoji: '🍳', safe: true },
      { name: '蒸魚', emoji: '🐟', safe: true },
      { name: '燙青菜', emoji: '🥦', safe: true },
      { name: '水果切塊', emoji: '🍑', safe: true },
      { name: '稀飯', emoji: '🥣', safe: true },
    ],
    tips: ['食物接近大人但少鹽少糖', '可開始練習用湯匙', '培養規律用餐時間', '每餐最多 2-3 種新食材'],
    allergyWarning: ['蜂蜜（1歲前禁止）', '堅果類（需研磨）'],
  },
  '12+': {
    title: '幼兒飲食（1歲以上）',
    foods: [
      { name: '一般米飯', emoji: '🍚', safe: true },
      { name: '各類蔬菜', emoji: '🥗', safe: true },
      { name: '各類肉類', emoji: '🍖', safe: true },
      { name: '牛奶', emoji: '🥛', safe: true },
      { name: '水果', emoji: '🍊', safe: true },
      { name: '全麥麵包', emoji: '🍞', safe: true },
      { name: '麵條', emoji: '🍜', safe: true },
    ],
    tips: ['可開始嘗試大人食物（少調味）', '避免高糖、高鹽、油炸食品', '蜂蜜 1 歲後可少量嘗試', '培養多樣化飲食習慣'],
    allergyWarning: ['堅果（確認無過敏後可嘗試）', '生食（壽司等）'],
  },
}

function getFoodSuggestion(ageMonths: number) {
  if (ageMonths < 4) return FOOD_SUGGESTIONS['0-3']
  if (ageMonths < 6) return FOOD_SUGGESTIONS['4-5']
  if (ageMonths < 8) return FOOD_SUGGESTIONS['6-7']
  if (ageMonths < 10) return FOOD_SUGGESTIONS['8-9']
  if (ageMonths < 12) return FOOD_SUGGESTIONS['10-11']
  return FOOD_SUGGESTIONS['12+']
}

export default function MealsClient({ children, initialRecords }: Props) {
  const [activeChildIdx, setActiveChildIdx] = useState(0)
  const [records, setRecords] = useState<MealRecord[]>(initialRecords)
  const [showForm, setShowForm] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'diary' | 'suggestions'>('diary')
  const [form, setForm] = useState({
    mealDate: new Date().toISOString().split('T')[0],
    mealType: '早餐',
    description: '',
  })

  const activeChild = children[activeChildIdx]
  const ageMonths = activeChild ? calcAgeMonths(activeChild.birth_date) : 0
  const suggestion = getFoodSuggestion(ageMonths)

  // 按日期分組
  const groupedRecords = useMemo(() => {
    const groups: Record<string, MealRecord[]> = {}
    records.forEach(r => {
      if (!groups[r.meal_date]) groups[r.meal_date] = []
      groups[r.meal_date].push(r)
    })
    return groups
  }, [records])

  const sortedDates = Object.keys(groupedRecords).sort((a, b) => b.localeCompare(a))

  async function handleSave() {
    if (!activeChild) return
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('meal_records')
      .insert({
        child_id: activeChild.id,
        meal_date: form.mealDate,
        meal_type: form.mealType,
        description: form.description || null,
      })
      .select()
      .single()

    if (!error && data) {
      setRecords(r => [data, ...r])
      setShowForm(false)
      setForm({
        mealDate: new Date().toISOString().split('T')[0],
        mealType: '早餐',
        description: '',
      })
    }
    setSaving(false)
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    if (dateStr === today) return '今天'
    if (dateStr === yesterday) return '昨天'
    return date.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })
  }

  return (
    <div style={{ background: '#FAFAF5' }} className="min-h-screen">
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Utensils size={22} />
            <h1 className="text-xl font-black">飲食日記</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm font-medium"
          >
            <Plus size={16} />新增記錄
          </button>
        </div>

        {/* Child selector */}
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
        {/* Tab */}
        <div className="flex bg-[#EBF4FF] rounded-2xl p-1 gap-1">
          {[
            { key: 'diary', label: '飲食日記' },
            { key: 'suggestions', label: '副食品建議' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'diary' | 'suggestions')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key ? 'bg-[#7B9EBD] text-white shadow-sm' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'diary' && (
          <>
            {sortedDates.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-3">🍽️</p>
                <p className="text-gray-500 mb-1 font-medium">還沒有飲食記錄</p>
                <p className="text-gray-400 text-sm mb-4">開始記錄寶寶每天的飲食吧！</p>
                <Button onClick={() => setShowForm(true)}>新增第一筆記錄</Button>
              </div>
            ) : (
              <div className="space-y-5">
                {sortedDates.map(date => (
                  <div key={date}>
                    <p className="text-sm font-bold text-gray-500 mb-2">{formatDate(date)}</p>
                    <div className="space-y-2">
                      {groupedRecords[date].map(record => {
                        const mealInfo = MEAL_TYPES.find(m => m.value === record.meal_type)
                        return (
                          <Card key={record.id} className="p-3">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{mealInfo?.emoji ?? '🍽️'}</span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mealInfo?.color ?? 'bg-gray-100 text-gray-600'}`}>
                                    {record.meal_type}
                                  </span>
                                </div>
                                {record.description && (
                                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">{record.description}</p>
                                )}
                                {!record.description && (
                                  <p className="text-sm text-gray-400 mt-1">未填寫內容</p>
                                )}
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'suggestions' && activeChild && (
          <div className="space-y-4">
            {/* 月齡提示 */}
            <Card className="bg-gradient-to-br from-[#EBF4FF] to-[#F5E6C8] border-[#C5D8E8]">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold text-[#3D6A8A]">{suggestion.title}</h2>
                  <span className="text-xs bg-[#C5D8E8] text-[#5E85A3] px-2 py-0.5 rounded-full">{ageMonths} 個月</span>
                </div>
              </div>
            </Card>

            {/* 適合食材 */}
            {suggestion.foods.length > 0 && (
              <Card>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-3">適合食材</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {suggestion.foods.map(food => (
                      <div key={food.name} className="bg-green-50 rounded-xl p-2.5 text-center">
                        <span className="text-2xl block mb-1">{food.emoji}</span>
                        <span className="text-xs text-gray-700 font-medium">{food.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* 注意事項 */}
            <Card>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-3">喂食小技巧</h3>
                <div className="space-y-2">
                  {suggestion.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#7B9EBD] font-bold shrink-0">{i + 1}.</span>
                      <span className="text-sm text-gray-600">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* 過敏警示 */}
            {suggestion.allergyWarning.length > 0 && (
              <Card className="border-red-100">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={18} className="text-red-500" />
                    <h3 className="font-bold text-red-700">此階段需避免或謹慎的食材</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.allergyWarning.map(item => (
                      <span key={item} className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-full font-medium">
                        ⚠️ {item}
                      </span>
                    ))}
                  </div>
                  {activeChild.allergies.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-red-100">
                      <p className="text-xs text-red-600 font-semibold mb-1">寶寶已知過敏：</p>
                      <div className="flex flex-wrap gap-1">
                        {activeChild.allergies.map(a => (
                          <span key={a} className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* 一週菜單建議 */}
            {ageMonths >= 4 && (
              <Card>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-3">本週菜單建議</h3>
                  <div className="space-y-2">
                    {['週一', '週二', '週三', '週四', '週五', '週六', '週日'].map((day, i) => {
                      const foods = suggestion.foods
                      const a = foods[i % foods.length]
                      const b = foods[(i + 1) % foods.length]
                      if (!a) return null
                      return (
                        <div key={day} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                          <span className="text-xs font-bold text-[#7B9EBD] w-8">{day}</span>
                          <span className="text-sm text-gray-600">
                            {a.emoji} {a.name}{b ? `、${b.emoji} ${b.name}` : ''}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {children.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🍼</p>
            <p className="text-gray-500 mb-4">還沒有孩子資料</p>
            <Button onClick={() => window.location.href = '/onboarding'}>新增孩子資料</Button>
          </div>
        )}
      </div>

      {/* Add record modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-gray-800 text-lg">新增飲食記錄</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">✕</button>
            </div>

            <Input
              label="日期"
              type="date"
              value={form.mealDate}
              onChange={e => setForm(f => ({ ...f, mealDate: e.target.value }))}
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">餐別</label>
              <div className="grid grid-cols-4 gap-2">
                {MEAL_TYPES.map(meal => (
                  <button
                    key={meal.value}
                    onClick={() => setForm(f => ({ ...f, mealType: meal.value }))}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                      form.mealType === meal.value
                        ? 'border-[#7B9EBD] bg-[#EBF4FF]'
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{meal.emoji}</span>
                    <span className="text-xs font-medium text-gray-700">{meal.value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">內容描述（選填）</label>
              <textarea
                rows={3}
                placeholder={`例：${ageMonths < 6 ? '十倍粥 3 湯匙、地瓜泥 1 湯匙' : ageMonths < 12 ? '五倍粥加蛋黃、胡蘿蔔泥' : '米飯、蒸魚、炒青菜'}`}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A8C5DA] resize-none"
              />
            </div>

            <Button size="lg" className="w-full" loading={saving} onClick={handleSave}>
              儲存記錄
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
