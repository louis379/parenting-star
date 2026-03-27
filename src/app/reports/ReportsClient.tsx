'use client'

import { useState, useMemo } from 'react'
import { BarChart3, TrendingUp, Utensils, Star, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { differenceInMonths, differenceInYears, parseISO, format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

interface GrowthRecord {
  height_cm: number | null
  weight_kg: number | null
  head_circumference_cm: number | null
  measured_at: string
}

interface MealRecord {
  meal_type: string
  description: string | null
  meal_date: string
  ai_analysis: any
}

interface Milestone {
  category: string
  milestone_key: string
  achieved_at: string | null
}

interface Child {
  id: string
  nickname: string
  birth_date: string
  gender: string | null
  allergies: string[]
}

interface Props {
  child: Child | null
  allChildren: Child[]
  growthRecords: GrowthRecord[]
  mealRecords: MealRecord[]
  milestones: Milestone[]
}

// --- Analysis logic (template-based) ---

const MEAL_TYPES_ZH: Record<string, string> = {
  breakfast: '早餐', lunch: '午餐', dinner: '晚餐',
  snack: '點心', breastfeed: '母乳', formula: '配方奶',
}

const NUTRITION_KEYWORDS: Record<string, string[]> = {
  蛋白質: ['蛋', '肉', '魚', '雞', '豬', '牛', '豆腐', '起司', '奶', '豆漿'],
  蔬菜: ['菜', '蔬', '青', '紅蘿蔔', '南瓜', '花椰菜', '菠菜', '番茄'],
  水果: ['果', '蘋果', '香蕉', '橘', '葡萄', '草莓', '芒果', '奇異果'],
  穀類: ['飯', '麵', '粥', '麥', '米', '土司', '饅頭', '麵包'],
  鈣質: ['奶', '起司', '優格', '豆腐', '芝麻'],
}

function analyzeNutrition(meals: MealRecord[]) {
  const covered = new Set<string>()
  for (const meal of meals) {
    const text = (meal.description ?? '').toLowerCase()
    for (const [nutrient, keywords] of Object.entries(NUTRITION_KEYWORDS)) {
      if (keywords.some(kw => text.includes(kw))) covered.add(nutrient)
    }
  }
  return {
    covered: [...covered],
    missing: Object.keys(NUTRITION_KEYWORDS).filter(n => !covered.has(n)),
    totalMeals: meals.length,
  }
}

function analyzeGrowth(records: GrowthRecord[], birthDate: string) {
  if (records.length === 0) return null
  const latest = records[0]
  const ageMonths = differenceInMonths(new Date(), parseISO(birthDate))

  // Very rough WHO reference (simplified for demo)
  let heightStatus = '正常'
  let weightStatus = '正常'
  if (latest.weight_kg && latest.height_cm) {
    const bmi = latest.weight_kg / ((latest.height_cm / 100) ** 2)
    if (bmi > 20) weightStatus = '偏重'
    else if (bmi < 14) weightStatus = '偏輕'
  }

  return {
    latest,
    ageMonths,
    heightStatus,
    weightStatus,
    recordCount: records.length,
  }
}

function generateRecommendations(
  nutrition: ReturnType<typeof analyzeNutrition>,
  growth: ReturnType<typeof analyzeGrowth>,
  milestones: Milestone[],
  ageMonths: number,
) {
  const recs: { type: 'nutrition' | 'growth' | 'development' | 'general'; text: string; priority: 'high' | 'medium' | 'low' }[] = []

  // Nutrition recs
  if (nutrition.missing.includes('蔬菜')) {
    recs.push({ type: 'nutrition', text: '近期蔬菜攝取較少，可試著將蔬菜切碎混入粥或麵條中', priority: 'high' })
  }
  if (nutrition.missing.includes('蛋白質')) {
    recs.push({ type: 'nutrition', text: '蛋白質攝取不足，建議每天提供一份蛋或豆腐', priority: 'high' })
  }
  if (nutrition.missing.includes('水果')) {
    recs.push({ type: 'nutrition', text: '可增加水果攝取，1 歲以上每天約 1-2 份新鮮水果', priority: 'medium' })
  }
  if (nutrition.missing.includes('鈣質')) {
    recs.push({ type: 'nutrition', text: '鈣質來源可從乳製品或豆腐補充，有助骨骼發育', priority: 'medium' })
  }
  if (nutrition.totalMeals < 10) {
    recs.push({ type: 'nutrition', text: '本月飲食紀錄較少，增加記錄頻率有助了解孩子營養狀況', priority: 'low' })
  }

  // Growth recs
  if (growth?.weightStatus === '偏重') {
    recs.push({ type: 'growth', text: '孩子體重偏重，建議增加戶外活動並減少高糖零食', priority: 'medium' })
  }
  if (growth?.weightStatus === '偏輕') {
    recs.push({ type: 'growth', text: '孩子體重偏輕，建議增加熱量密度高的食物，如蛋、堅果', priority: 'high' })
  }
  if (!growth || growth.recordCount === 0) {
    recs.push({ type: 'growth', text: '本月沒有成長紀錄，建議定期量身高體重追蹤生長曲線', priority: 'medium' })
  }

  // Development recs
  if (ageMonths >= 6 && ageMonths < 12 && milestones.length === 0) {
    recs.push({ type: 'development', text: '6-12 個月是重要發展期，建議記錄翻身、坐立等大動作里程碑', priority: 'medium' })
  }
  if (ageMonths >= 12 && milestones.length < 3) {
    recs.push({ type: 'development', text: '建議觀察並記錄語言發展里程碑（如叫爸媽、模仿聲音）', priority: 'low' })
  }

  // General
  if (recs.length === 0) {
    recs.push({ type: 'general', text: '目前各項數據正常，繼續保持規律記錄！', priority: 'low' })
  }

  return recs
}

const PRIORITY_COLORS = {
  high: 'bg-red-50 text-red-700 border-red-100',
  medium: 'bg-[#EBF4FF] text-[#5E85A3] border-[#C5D8E8]',
  low: 'bg-green-50 text-green-700 border-green-100',
}
const PRIORITY_LABELS = { high: '需注意', medium: '建議', low: '良好' }
const TYPE_ICONS = {
  nutrition: '🥗',
  growth: '📏',
  development: '⭐',
  general: '✅',
}

export default function ReportsClient({ child, allChildren, growthRecords, mealRecords, milestones }: Props) {
  const [expandSection, setExpandSection] = useState<string | null>('growth')

  const ageMonths = child ? differenceInMonths(new Date(), parseISO(child.birth_date)) : 0
  const ageYears = child ? differenceInYears(new Date(), parseISO(child.birth_date)) : 0
  const ageLabel = ageYears > 0 ? `${ageYears} 歲 ${ageMonths % 12} 個月` : `${ageMonths} 個月`

  const nutrition = useMemo(() => analyzeNutrition(mealRecords), [mealRecords])
  const growth = useMemo(() => child ? analyzeGrowth(growthRecords, child.birth_date) : null, [growthRecords, child])
  const recommendations = useMemo(
    () => child ? generateRecommendations(nutrition, growth, milestones, ageMonths) : [],
    [nutrition, growth, milestones, ageMonths, child]
  )

  const monthLabel = format(new Date(), 'yyyy 年 M 月', { locale: zhTW })

  if (!child) {
    return (
      <div style={{ background: '#FAFAF5' }} className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <p className="text-5xl mb-4">📊</p>
        <p className="font-bold text-gray-700 mb-2">尚無孩子資料</p>
        <p className="text-sm text-gray-500">請先完成 onboarding 建立孩子資料</p>
      </div>
    )
  }

  const toggle = (key: string) => setExpandSection(prev => prev === key ? null : key)

  return (
    <div style={{ background: '#FAFAF5' }} className="min-h-screen">
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={22} />
          <h1 className="text-xl font-black">AI 分析報告</h1>
        </div>
        <p className="text-white/80 text-sm">{monthLabel}・{child.nickname}（{ageLabel}）</p>

        {/* Summary badges */}
        <div className="flex gap-2 mt-4">
          <div className="bg-white/20 rounded-2xl px-3 py-2 text-center">
            <p className="text-xl font-black">{mealRecords.length}</p>
            <p className="text-xs text-white/80">飲食紀錄</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-3 py-2 text-center">
            <p className="text-xl font-black">{growthRecords.length}</p>
            <p className="text-xs text-white/80">成長紀錄</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-3 py-2 text-center">
            <p className="text-xl font-black">{milestones.length}</p>
            <p className="text-xs text-white/80">新里程碑</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-3 py-2 text-center">
            <p className="text-xl font-black">{recommendations.filter(r => r.priority === 'high').length}</p>
            <p className="text-xs text-white/80">需注意</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* Growth section */}
        <div className="card-warm overflow-hidden">
          <button
            onClick={() => toggle('growth')}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#7B9EBD]" />
              <span className="font-bold text-gray-800">成長報告</span>
            </div>
            {expandSection === 'growth' ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>
          {expandSection === 'growth' && (
            <div className="px-4 pb-4 space-y-3">
              {growth ? (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: '身高', value: growth.latest.height_cm ? `${growth.latest.height_cm} cm` : '-', status: growth.heightStatus },
                      { label: '體重', value: growth.latest.weight_kg ? `${growth.latest.weight_kg} kg` : '-', status: growth.weightStatus },
                      { label: '頭圍', value: growth.latest.head_circumference_cm ? `${growth.latest.head_circumference_cm} cm` : '-', status: '正常' },
                    ].map(({ label, value, status }) => (
                      <div key={label} className="bg-[#EBF4FF] rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="font-black text-gray-800 text-sm">{value}</p>
                        <span className={cn(
                          'text-xs px-1.5 py-0.5 rounded-full',
                          status === '正常' ? 'bg-green-100 text-green-700' :
                          status === '偏重' ? 'bg-[#EBF4FF] text-[#5E85A3]' : 'bg-red-100 text-red-700'
                        )}>{status}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    最近量測：{format(parseISO(growth.latest.measured_at), 'M/d', { locale: zhTW })}・本月共 {growth.recordCount} 筆紀錄
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">本月無成長紀錄</p>
                  <p className="text-xs text-gray-400 mt-1">建議每月至少量測一次</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nutrition section */}
        <div className="card-warm overflow-hidden">
          <button
            onClick={() => toggle('nutrition')}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Utensils size={18} className="text-[#7B9EBD]" />
              <span className="font-bold text-gray-800">營養缺口分析</span>
            </div>
            {expandSection === 'nutrition' ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>
          {expandSection === 'nutrition' && (
            <div className="px-4 pb-4 space-y-3">
              <p className="text-xs text-gray-500">本月 {nutrition.totalMeals} 筆飲食紀錄分析</p>
              <div className="space-y-2">
                {Object.keys(NUTRITION_KEYWORDS).map(nutrient => {
                  const hasCovered = nutrition.covered.includes(nutrient)
                  return (
                    <div key={nutrient} className="flex items-center gap-3 py-1">
                      <div className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                        hasCovered ? 'bg-green-500' : 'bg-gray-200'
                      )}>
                        {hasCovered
                          ? <CheckCircle2 size={13} className="text-white" />
                          : <span className="text-gray-400 text-xs">✕</span>
                        }
                      </div>
                      <p className={cn('text-sm font-semibold', hasCovered ? 'text-gray-700' : 'text-gray-400')}>{nutrient}</p>
                      {!hasCovered && (
                        <span className="ml-auto text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">補充中</span>
                      )}
                    </div>
                  )
                })}
              </div>
              {nutrition.missing.length > 0 && (
                <div className="bg-[#EBF4FF] rounded-xl p-3">
                  <p className="text-xs font-semibold text-[#5E85A3] mb-1">
                    ⚠️ 近期缺乏：{nutrition.missing.join('、')}
                  </p>
                  <p className="text-xs text-[#5E85A3]">根據您記錄的飲食內容分析，建議增加相關食物</p>
                </div>
              )}
              {nutrition.totalMeals === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">尚無飲食紀錄，請在飲食頁面新增</p>
              )}
            </div>
          )}
        </div>

        {/* Milestones section */}
        <div className="card-warm overflow-hidden">
          <button
            onClick={() => toggle('milestones')}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Star size={18} className="text-[#7B9EBD]" />
              <span className="font-bold text-gray-800">本月里程碑</span>
              {milestones.length > 0 && (
                <span className="bg-[#7B9EBD] text-white text-xs px-1.5 py-0.5 rounded-full">{milestones.length}</span>
              )}
            </div>
            {expandSection === 'milestones' ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>
          {expandSection === 'milestones' && (
            <div className="px-4 pb-4">
              {milestones.length > 0 ? (
                <div className="space-y-2">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 py-1">
                      <span className="text-lg">🌟</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700">{m.milestone_key}</p>
                        <p className="text-xs text-gray-400">{m.category}</p>
                      </div>
                      {m.achieved_at && (
                        <span className="text-xs text-gray-400 shrink-0">
                          {format(parseISO(m.achieved_at), 'M/d', { locale: zhTW })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">本月尚無新里程碑紀錄</p>
              )}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
            <AlertCircle size={15} className="text-[#7B9EBD]" />
            本月建議清單
          </h3>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className={cn('rounded-2xl p-3.5 border', PRIORITY_COLORS[rec.priority])}>
                <div className="flex items-start gap-2.5">
                  <span className="text-lg shrink-0 mt-0.5">{TYPE_ICONS[rec.type]}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded-full',
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                        rec.priority === 'medium' ? 'bg-[#EBF4FF] text-[#5E85A3]' : 'bg-green-100 text-green-700'
                      )}>{PRIORITY_LABELS[rec.priority]}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{rec.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 rounded-2xl p-3.5">
          <p className="text-xs text-blue-600 leading-relaxed">
            📋 本報告根據您記錄的資料自動分析，僅供參考。如有健康疑慮，請諮詢兒科醫師或營養師。
          </p>
        </div>
      </div>
    </div>
  )
}
