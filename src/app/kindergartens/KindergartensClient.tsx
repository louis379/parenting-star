'use client'

import { useState, useMemo } from 'react'
import {
  School, Search, MapPin, Users, DollarSign, CheckCircle,
  SlidersHorizontal, Scale, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Kindergarten } from '@/types/database'

const CITY_FILTERS = ['全台', '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市']
const TYPE_FILTERS = [
  { key: '', label: '全部' },
  { key: '公立', label: '公立' },
  { key: '私立', label: '私立' },
  { key: '非營利', label: '非營利' },
  { key: '準公共', label: '準公共' },
]

const TYPE_COLORS: Record<string, string> = {
  '公立': 'bg-blue-50 text-blue-600',
  '私立': 'bg-purple-50 text-purple-600',
  '非營利': 'bg-green-50 text-green-600',
  '準公共': 'bg-teal-50 text-teal-600',
}

const TEACHING_METHODS = ['蒙特梭利', '華德福', '雙語', '自然', '全美語', '主題探索']
const PRIORITY_OPTIONS = [
  { key: 'budget', label: '合理費用', emoji: '💰' },
  { key: 'teacher_ratio', label: '低師生比', emoji: '👩‍🏫' },
  { key: 'teaching_method', label: '特色教學法', emoji: '📚' },
  { key: 'non_profit', label: '公共化', emoji: '🏛️' },
  { key: 'extended_care', label: '延托服務', emoji: '⏰' },
]

interface Preferences {
  budgetMax: number
  teachingMethods: string[]
  priorities: string[]
  enabled: boolean
}

interface Props {
  initialData: Kindergarten[]
}

function calcMatchScore(k: Kindergarten, prefs: Preferences): number {
  let score = 0

  // Budget score (0-30)
  if (k.monthly_fee) {
    if (k.monthly_fee <= prefs.budgetMax) score += 30
    else if (k.monthly_fee <= prefs.budgetMax * 1.2) score += 15
  } else {
    score += 15
  }

  // Teaching method (0-30)
  if (prefs.teachingMethods.length > 0 && k.teaching_method) {
    const matched = prefs.teachingMethods.filter(m => k.teaching_method!.some(km => km.includes(m)))
    score += Math.round((matched.length / prefs.teachingMethods.length) * 30)
  } else if (prefs.teachingMethods.length === 0) {
    score += 30
  }

  // Priority score (0-40)
  for (const p of prefs.priorities) {
    if (p === 'budget' && k.monthly_fee && k.monthly_fee <= prefs.budgetMax) score += 10
    if (p === 'teacher_ratio' && k.student_teacher_ratio && k.student_teacher_ratio <= 8) score += 10
    if (p === 'teaching_method' && k.teaching_method && k.teaching_method.length > 0) score += 10
    if (p === 'non_profit' && (k.type === '公立' || k.type === '非營利' || k.type === '準公共')) score += 10
    if (p === 'extended_care' && k.extended_care_fee !== null) score += 10
  }

  return Math.min(100, score)
}

export default function KindergartensClient({ initialData }: Props) {
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('全台')
  const [typeFilter, setTypeFilter] = useState('')
  const [selected, setSelected] = useState<Kindergarten | null>(null)
  const [showPrefSheet, setShowPrefSheet] = useState(false)
  const [compareList, setCompareList] = useState<Kindergarten[]>([])
  const [showCompare, setShowCompare] = useState(false)

  const [prefs, setPrefs] = useState<Preferences>({
    budgetMax: 15000,
    teachingMethods: [],
    priorities: [],
    enabled: false,
  })
  const [tempPrefs, setTempPrefs] = useState<Preferences>(prefs)

  const filtered = useMemo(() => {
    const list = initialData.filter(k => {
      if (search && !k.name.toLowerCase().includes(search.toLowerCase()) &&
          !(k.description ?? '').toLowerCase().includes(search.toLowerCase())) return false
      if (cityFilter !== '全台' && k.city !== cityFilter) return false
      if (typeFilter && k.type !== typeFilter) return false
      return true
    })
    if (prefs.enabled) {
      return [...list].sort((a, b) => calcMatchScore(b, prefs) - calcMatchScore(a, prefs))
    }
    return list
  }, [initialData, search, cityFilter, typeFilter, prefs])

  function formatFee(fee: number | null) {
    if (!fee) return '洽詢'
    return fee >= 10000 ? `${Math.round(fee / 1000)}K` : `${fee}`
  }

  function toggleCompare(k: Kindergarten) {
    setCompareList(prev => {
      if (prev.find(x => x.id === k.id)) return prev.filter(x => x.id !== k.id)
      if (prev.length >= 3) return prev
      return [...prev, k]
    })
  }

  function applyPrefs() {
    setPrefs({ ...tempPrefs, enabled: true })
    setShowPrefSheet(false)
  }

  function clearPrefs() {
    const reset: Preferences = { budgetMax: 15000, teachingMethods: [], priorities: [], enabled: false }
    setPrefs(reset)
    setTempPrefs(reset)
  }

  const matchScore = (k: Kindergarten) => prefs.enabled ? calcMatchScore(k, prefs) : null

  return (
    <div style={{ background: '#FAFAF5' }} className="min-h-screen">
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <School size={22} />
            <h1 className="text-xl font-black">幼兒園查詢</h1>
          </div>
          <div className="flex gap-2">
            {prefs.enabled && (
              <button
                onClick={clearPrefs}
                className="px-2.5 py-1.5 rounded-xl bg-white/20 text-xs font-semibold flex items-center gap-1"
              >
                <X size={12} /> 清除
              </button>
            )}
            <button
              onClick={() => { setTempPrefs(prefs); setShowPrefSheet(true) }}
              className={cn(
                'px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1',
                prefs.enabled ? 'bg-white text-[#7B9EBD]' : 'bg-white/20 text-white'
              )}
            >
              <SlidersHorizontal size={12} /> 偏好設定
            </button>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋幼兒園名稱…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-9 pr-4 rounded-2xl bg-white text-gray-700 text-sm outline-none"
          />
        </div>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* City filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CITY_FILTERS.map(city => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                cityFilter === city ? 'bg-[#7B9EBD] text-white' : 'bg-white text-gray-600 border border-[#C5D8E8]'
              )}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TYPE_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                typeFilter === key ? 'bg-[#7B9EBD] text-white' : 'bg-white text-gray-600 border border-[#C5D8E8]'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {prefs.enabled ? '✨ 配對排序中・' : ''}找到 {filtered.length} 間幼兒園
          </p>
          {compareList.length > 0 && (
            <button
              onClick={() => setShowCompare(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7B9EBD] text-white rounded-xl text-xs font-semibold"
            >
              <Scale size={13} /> 比較 {compareList.length} 間
            </button>
          )}
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.map(k => {
            const score = matchScore(k)
            const inCompare = !!compareList.find(x => x.id === k.id)
            return (
              <div key={k.id} className="relative">
                <button onClick={() => setSelected(k)} className="w-full text-left">
                  <div className={cn('card-warm p-4 hover:shadow-md transition-shadow', inCompare && 'ring-2 ring-[#7B9EBD]')}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-800 text-sm leading-tight truncate">{k.name}</h3>
                          {score !== null && (
                            <span className={cn(
                              'shrink-0 text-xs px-1.5 py-0.5 rounded-lg font-bold',
                              score >= 80 ? 'bg-green-100 text-green-700' :
                              score >= 60 ? 'bg-[#EBF4FF] text-[#5E85A3]' : 'bg-gray-100 text-gray-500'
                            )}>
                              {score}分
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{k.city} {k.district}</span>
                        </div>
                      </div>
                      {k.type && (
                        <span className={cn('shrink-0 text-xs px-2 py-1 rounded-lg font-semibold', TYPE_COLORS[k.type] ?? 'bg-gray-50 text-gray-600')}>
                          {k.type}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {k.monthly_fee && (
                        <div className="flex items-center gap-1">
                          <DollarSign size={12} className="text-[#7B9EBD]" />
                          <span>月費 {formatFee(k.monthly_fee)}元</span>
                        </div>
                      )}
                      {k.student_teacher_ratio && (
                        <div className="flex items-center gap-1">
                          <Users size={12} className="text-[#7B9EBD]" />
                          <span>師生比 1:{k.student_teacher_ratio}</span>
                        </div>
                      )}
                    </div>

                    {k.teaching_method && k.teaching_method.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {k.teaching_method.slice(0, 3).map(m => (
                          <span key={m} className="text-xs bg-[#EBF4FF] text-[#5E85A3] px-2 py-0.5 rounded-full">{m}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>

                {/* Compare toggle button */}
                <button
                  onClick={e => { e.stopPropagation(); toggleCompare(k) }}
                  className={cn(
                    'absolute top-3 right-3 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all z-10',
                    inCompare ? 'bg-[#7B9EBD] border-[#7B9EBD] text-white' : 'bg-white border-gray-200 text-gray-400'
                  )}
                >
                  <Scale size={12} />
                </button>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🏫</p>
            <p className="text-gray-500">沒有找到符合條件的幼兒園</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelected(null)}>
          <div
            className="w-full bg-white rounded-t-3xl p-5 max-h-[88vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-black text-gray-800 text-xl">{selected.name}</h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={12} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{selected.address || `${selected.city} ${selected.district}`}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 text-xl shrink-0">✕</button>
            </div>

            {selected.type && (
              <span className={cn('inline-block text-sm px-3 py-1 rounded-lg font-semibold mb-4', TYPE_COLORS[selected.type] ?? 'bg-gray-50 text-gray-600')}>
                {selected.type}
              </span>
            )}

            {/* Fees grid */}
            <p className="text-xs font-semibold text-gray-500 mb-2">費用明細</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: '每月學費', value: selected.monthly_fee },
                { label: '報名/註冊費', value: selected.registration_fee },
                { label: '延托費', value: selected.extended_care_fee },
                { label: '教材費', value: selected.material_fee },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#EBF4FF] rounded-xl p-3">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-bold text-gray-800 text-sm">{value ? `${value.toLocaleString()} 元` : '洽詢'}</p>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
              {selected.student_teacher_ratio && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users size={15} className="text-[#7B9EBD]" />
                  師生比：1:{selected.student_teacher_ratio}
                </div>
              )}
              {selected.capacity && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <School size={15} className="text-[#7B9EBD]" />
                  核定人數：{selected.capacity} 人
                </div>
              )}
              {selected.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>📞</span>
                  <a href={`tel:${selected.phone}`} className="text-[#7B9EBD]">{selected.phone}</a>
                </div>
              )}
            </div>

            {selected.teaching_method && selected.teaching_method.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">教學方法</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.teaching_method.map(m => (
                    <span key={m} className="text-xs bg-[#EBF4FF] text-[#5E85A3] px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle size={10} /> {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selected.description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{selected.description}</p>
            )}

            <button
              onClick={() => { toggleCompare(selected); setSelected(null) }}
              className={cn(
                'w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2',
                compareList.find(x => x.id === selected.id)
                  ? 'bg-[#EBF4FF] text-[#5E85A3]'
                  : 'bg-[#7B9EBD] text-white'
              )}
            >
              <Scale size={16} />
              {compareList.find(x => x.id === selected.id) ? '從比較中移除' : '加入比較'}
            </button>
          </div>
        </div>
      )}

      {/* Preference Sheet */}
      {showPrefSheet && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowPrefSheet(false)}>
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-gray-800">偏好設定</h2>
              <button onClick={() => setShowPrefSheet(false)} className="text-gray-400">✕</button>
            </div>

            {/* Budget slider */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                月費預算上限：<span className="text-[#7B9EBD]">{tempPrefs.budgetMax.toLocaleString()} 元</span>
              </label>
              <input
                type="range" min={5000} max={40000} step={1000}
                value={tempPrefs.budgetMax}
                onChange={e => setTempPrefs(p => ({ ...p, budgetMax: Number(e.target.value) }))}
                className="w-full accent-[#7B9EBD]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5K</span><span>20K</span><span>40K</span>
              </div>
            </div>

            {/* Teaching methods */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">偏好教學法（可多選）</p>
              <div className="flex flex-wrap gap-2">
                {TEACHING_METHODS.map(m => {
                  const isSelected = tempPrefs.teachingMethods.includes(m)
                  return (
                    <button
                      key={m}
                      onClick={() => setTempPrefs(p => ({
                        ...p,
                        teachingMethods: isSelected
                          ? p.teachingMethods.filter(x => x !== m)
                          : [...p.teachingMethods, m]
                      }))}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-sm font-semibold transition-all',
                        isSelected ? 'bg-[#7B9EBD] text-white' : 'bg-[#EBF4FF] text-gray-600'
                      )}
                    >
                      {m}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Priorities */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">重視項目（可多選）</p>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITY_OPTIONS.map(({ key, label, emoji }) => {
                  const isSelected = tempPrefs.priorities.includes(key)
                  return (
                    <button
                      key={key}
                      onClick={() => setTempPrefs(p => ({
                        ...p,
                        priorities: isSelected
                          ? p.priorities.filter(x => x !== key)
                          : [...p.priorities, key]
                      }))}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-2xl border-2 text-sm font-semibold transition-all',
                        isSelected ? 'border-[#7B9EBD] bg-[#EBF4FF] text-[#5E85A3]' : 'border-gray-100 bg-white text-gray-600'
                      )}
                    >
                      <span>{emoji}</span> {label}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              onClick={applyPrefs}
              className="w-full py-3.5 bg-[#7B9EBD] text-white rounded-2xl font-bold text-base"
            >
              套用偏好・開始配對
            </button>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && compareList.length > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCompare(false)}>
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-800">幼兒園比較</h2>
              <button onClick={() => setShowCompare(false)} className="text-gray-400">✕</button>
            </div>

            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr>
                    <td className="text-xs text-gray-400 py-2 pl-1 w-20">項目</td>
                    {compareList.map(k => (
                      <td key={k.id} className="text-center py-2 px-1">
                        <p className="font-bold text-gray-800 text-xs leading-tight">{k.name}</p>
                        {k.type && (
                          <span className={cn('text-xs px-1.5 py-0.5 rounded-md', TYPE_COLORS[k.type] ?? 'bg-gray-100 text-gray-500')}>{k.type}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { label: '地區', render: (k: Kindergarten) => `${k.city ?? ''} ${k.district ?? ''}`.trim() || '-' },
                    { label: '月費', render: (k: Kindergarten) => k.monthly_fee ? `${k.monthly_fee.toLocaleString()}元` : '洽詢' },
                    { label: '報名費', render: (k: Kindergarten) => k.registration_fee ? `${k.registration_fee.toLocaleString()}元` : '洽詢' },
                    { label: '延托費', render: (k: Kindergarten) => k.extended_care_fee ? `${k.extended_care_fee.toLocaleString()}元` : '洽詢' },
                    { label: '教材費', render: (k: Kindergarten) => k.material_fee ? `${k.material_fee.toLocaleString()}元` : '洽詢' },
                    { label: '師生比', render: (k: Kindergarten) => k.student_teacher_ratio ? `1:${k.student_teacher_ratio}` : '-' },
                    { label: '核定人數', render: (k: Kindergarten) => k.capacity ? `${k.capacity}人` : '-' },
                    { label: '教學法', render: (k: Kindergarten) => k.teaching_method?.join('、') || '-' },
                  ].map(row => (
                    <tr key={row.label}>
                      <td className="text-xs text-gray-500 py-2.5 pl-1 font-medium">{row.label}</td>
                      {compareList.map(k => (
                        <td key={k.id} className="text-center py-2.5 px-1 text-xs text-gray-700">{row.render(k)}</td>
                      ))}
                    </tr>
                  ))}
                  {prefs.enabled && (
                    <tr>
                      <td className="text-xs text-gray-500 py-2.5 pl-1 font-medium">配對分數</td>
                      {compareList.map(k => {
                        const s = calcMatchScore(k, prefs)
                        return (
                          <td key={k.id} className="text-center py-2.5 px-1">
                            <span className={cn(
                              'text-xs font-bold px-2 py-1 rounded-lg',
                              s >= 80 ? 'bg-green-100 text-green-700' :
                              s >= 60 ? 'bg-[#EBF4FF] text-[#5E85A3]' : 'bg-gray-100 text-gray-500'
                            )}>{s}分</span>
                          </td>
                        )
                      })}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setCompareList([]); setShowCompare(false) }}
                className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-2xl text-sm font-semibold"
              >
                清除比較
              </button>
              <button
                onClick={() => setShowCompare(false)}
                className="flex-1 py-3 bg-[#7B9EBD] text-white rounded-2xl text-sm font-bold"
              >
                繼續瀏覽
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
