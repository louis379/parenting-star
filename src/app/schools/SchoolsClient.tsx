'use client'

import { useState, useMemo } from 'react'
import { School, BookOpen, ClipboardList, Search, MapPin, Users, DollarSign, CheckCircle, SlidersHorizontal, Scale, X, Info } from 'lucide-react'
import type { Kindergarten } from '@/types/database'

type MainTab = 'knowledge' | 'records'

const CITY_FILTERS = ['全台', '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市']
const TEACHING_METHODS = ['蒙特梭利', '華德福', '雙語', '自然', '全美語', '主題探索']

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  '公立': { bg: '#EBF4FF', color: '#5E85A3' },
  '私立': { bg: '#F0EBF8', color: '#7A6A96' },
  '非營利': { bg: '#EBF4EB', color: '#5A8A5A' },
  '準公共': { bg: '#FDF0E8', color: '#B07548' },
}

const educationTypes = [
  {
    name: '蒙特梭利 Montessori',
    age: '3–6 歲',
    core: '以兒童為主體，讓孩子在有準備的環境中自主學習',
    traits: ['自由選擇工作', '混齡班級（3–6歲）', '豐富教具操作', '老師作觀察者非主導者'],
    suitable: '獨立性強、喜歡動手探索的孩子',
    caution: '部分家長擔心結構不足，需觀察孩子適應',
    color: '#7B9EBD',
    bg: '#EBF4FF',
  },
  {
    name: '華德福 Waldorf',
    age: '0–18 歲',
    core: '注重節奏、藝術、自然，讓身心靈均衡發展',
    traits: ['大量藝術活動（繪畫、音樂、戲劇）', '無電子螢幕', '季節節慶儀式', '不強調早期學術'],
    suitable: '藝術氣質、情感豐富的孩子',
    caution: '幼兒期刻意延遲學術，需家長認同理念',
    color: '#D4956A',
    bg: '#FDF0E8',
  },
  {
    name: '角落教學 Corner-based',
    age: '3–6 歲',
    core: '教室設不同主題角落，孩子自由選擇活動',
    traits: ['主題式角落（閱讀角、積木角、藝術角）', '同儕合作遊戲', '老師引導討論', '課程彈性'],
    suitable: '社交型、喜歡多元活動的孩子',
    caution: '需老師有能力引導各角落，品質差異大',
    color: '#7BA87B',
    bg: '#EBF4EB',
  },
  {
    name: '主題探索 Project-based',
    age: '3–6 歲',
    core: '圍繞一個主題（如「水」「昆蟲」）深入探究 4–6 週',
    traits: ['深度學習', '跨領域整合', '真實問題解決', '成果發表'],
    suitable: '好奇心強、善於深入研究的孩子',
    caution: '主題轉換期可能有適應問題',
    color: '#9B8BB4',
    bg: '#F0EBF8',
  },
]

interface Preferences {
  budgetMax: number
  teachingMethods: string[]
  enabled: boolean
}

interface Props {
  initialData: Kindergarten[]
}

function calcMatchScore(k: Kindergarten, prefs: Preferences): number {
  let score = 0
  if (k.monthly_fee) {
    if (k.monthly_fee <= prefs.budgetMax) score += 50
    else if (k.monthly_fee <= prefs.budgetMax * 1.2) score += 25
  } else {
    score += 25
  }
  if (prefs.teachingMethods.length > 0 && k.teaching_method) {
    const matched = prefs.teachingMethods.filter(m => k.teaching_method!.some(km => km.includes(m)))
    score += Math.round((matched.length / prefs.teachingMethods.length) * 50)
  } else if (prefs.teachingMethods.length === 0) {
    score += 50
  }
  return Math.min(100, score)
}

export default function SchoolsClient({ initialData }: Props) {
  const [mainTab, setMainTab] = useState<MainTab>('knowledge')
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('全台')
  const [typeFilter, setTypeFilter] = useState('')
  const [selected, setSelected] = useState<Kindergarten | null>(null)
  const [showPrefSheet, setShowPrefSheet] = useState(false)
  const [compareList, setCompareList] = useState<Kindergarten[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [prefs, setPrefs] = useState<Preferences>({ budgetMax: 15000, teachingMethods: [], enabled: false })
  const [tempPrefs, setTempPrefs] = useState<Preferences>(prefs)

  const filtered = useMemo(() => {
    const list = initialData.filter(k => {
      if (search && !k.name.toLowerCase().includes(search.toLowerCase())) return false
      if (cityFilter !== '全台' && k.city !== cityFilter) return false
      if (typeFilter && k.type !== typeFilter) return false
      return true
    })
    if (prefs.enabled) {
      return [...list].sort((a, b) => calcMatchScore(b, prefs) - calcMatchScore(a, prefs))
    }
    return list
  }, [initialData, search, cityFilter, typeFilter, prefs])

  function toggleCompare(k: Kindergarten) {
    setCompareList(prev => {
      if (prev.find(x => x.id === k.id)) return prev.filter(x => x.id !== k.id)
      if (prev.length >= 3) return prev
      return [...prev, k]
    })
  }

  const typeColor = (type: string | null) => type ? TYPE_COLORS[type] : null

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg, #E8C5A8 0%, #D4956A 45%, #B07548 100%)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white">
            <School size={22} strokeWidth={2.5} />
            <h1 className="text-xl font-black">教育環境</h1>
          </div>
          {mainTab === 'records' && (
            <div className="flex gap-2">
              {prefs.enabled && (
                <button
                  onClick={() => setPrefs(p => ({ ...p, enabled: false }))}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white"
                  style={{ background: 'rgba(255,255,255,0.25)' }}
                >
                  <X size={12} /> 清除
                </button>
              )}
              <button
                onClick={() => { setTempPrefs(prefs); setShowPrefSheet(true) }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background: prefs.enabled ? 'white' : 'rgba(255,255,255,0.2)', color: prefs.enabled ? '#B07548' : 'white' }}
              >
                <SlidersHorizontal size={12} /> 偏好
              </button>
            </div>
          )}
        </div>

        {/* Main tab switcher */}
        <div className="flex rounded-2xl p-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <button
            onClick={() => setMainTab('knowledge')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: mainTab === 'knowledge' ? 'white' : 'transparent', color: mainTab === 'knowledge' ? '#B07548' : 'rgba(255,255,255,0.85)' }}
          >
            <BookOpen size={15} /> 教育類別
          </button>
          <button
            onClick={() => setMainTab('records')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: mainTab === 'records' ? 'white' : 'transparent', color: mainTab === 'records' ? '#B07548' : 'rgba(255,255,255,0.85)' }}
          >
            <ClipboardList size={15} /> 學校查詢
          </button>
        </div>
      </div>

      {/* === 教育類別介紹 === */}
      {mainTab === 'knowledge' && (
        <div className="px-5 py-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>教育理念比較</h2>
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B7B8D' }}>
            不同教育理念各有優缺，選擇前最重要的是了解孩子的氣質，再尋找匹配的教育環境。
          </p>
          {educationTypes.map((t) => (
            <div key={t.name} className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold mb-1" style={{ background: t.bg, color: t.color }}>
                    {t.age}
                  </span>
                  <h3 className="font-bold text-sm" style={{ color: '#2D3436' }}>{t.name}</h3>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: '#6B7B8D' }}>{t.core}</p>
              <div className="space-y-1 mb-2">
                {t.traits.map((tr, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <CheckCircle size={11} className="shrink-0 mt-0.5" style={{ color: t.color }} />
                    <span className="text-xs" style={{ color: '#2D3436' }}>{tr}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl mb-2" style={{ background: t.bg }}>
                <p className="text-xs font-bold mb-0.5" style={{ color: t.color }}>適合</p>
                <p className="text-xs" style={{ color: '#2D3436' }}>{t.suitable}</p>
              </div>
              <div className="flex items-start gap-1.5 p-2 rounded-xl" style={{ background: '#FFF8F0' }}>
                <Info size={12} className="shrink-0 mt-0.5" style={{ color: '#B07548' }} />
                <p className="text-xs" style={{ color: '#B07548' }}>{t.caution}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === 學校查詢 === */}
      {mainTab === 'records' && (
        <>
          <div className="px-5 py-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8E9EAD' }} />
              <input
                type="text"
                placeholder="搜尋學校名稱…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-11 pl-9 pr-4 rounded-2xl text-sm outline-none border"
                style={{ background: 'white', borderColor: '#E8E0D5', color: '#2D3436' }}
              />
            </div>

            {/* City filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CITY_FILTERS.map(city => (
                <button
                  key={city}
                  onClick={() => setCityFilter(city)}
                  className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: cityFilter === city ? '#D4956A' : 'white',
                    color: cityFilter === city ? 'white' : '#6B7B8D',
                    border: `1px solid ${cityFilter === city ? '#D4956A' : '#E8E0D5'}`,
                  }}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Type filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[{ key: '', label: '全部' }, { key: '公立', label: '公立' }, { key: '私立', label: '私立' }, { key: '非營利', label: '非營利' }, { key: '準公共', label: '準公共' }].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTypeFilter(key)}
                  className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: typeFilter === key ? '#D4956A' : 'white',
                    color: typeFilter === key ? 'white' : '#6B7B8D',
                    border: `1px solid ${typeFilter === key ? '#D4956A' : '#E8E0D5'}`,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: '#8E9EAD' }}>
                {prefs.enabled ? '✨ 配對排序・' : ''}共 {filtered.length} 間
              </p>
              {compareList.length > 0 && (
                <button
                  onClick={() => setShowCompare(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                  style={{ background: '#D4956A' }}
                >
                  <Scale size={13} /> 比較 {compareList.length} 間
                </button>
              )}
            </div>

            {/* List */}
            <div className="space-y-3">
              {filtered.map(k => {
                const tc = typeColor(k.type)
                const score = prefs.enabled ? calcMatchScore(k, prefs) : null
                const inCompare = !!compareList.find(x => x.id === k.id)
                return (
                  <div key={k.id} className="relative">
                    <button onClick={() => setSelected(k)} className="w-full text-left">
                      <div
                        className="p-4 rounded-2xl border transition-shadow hover:shadow-md"
                        style={{ background: inCompare ? '#FDF0E8' : 'white', borderColor: inCompare ? '#D4956A' : '#E8E0D5' }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm leading-tight truncate" style={{ color: '#2D3436' }}>{k.name}</h3>
                              {score !== null && (
                                <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-lg font-bold"
                                  style={{ background: score >= 80 ? '#EBF4EB' : score >= 60 ? '#FDF0E8' : '#F0F0F0', color: score >= 80 ? '#5A8A5A' : score >= 60 ? '#B07548' : '#8E9EAD' }}>
                                  {score}分
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin size={11} style={{ color: '#8E9EAD' }} />
                              <span className="text-xs" style={{ color: '#8E9EAD' }}>{k.city} {k.district}</span>
                            </div>
                          </div>
                          {tc && (
                            <span className="shrink-0 text-xs px-2 py-1 rounded-lg font-semibold" style={{ background: tc.bg, color: tc.color }}>
                              {k.type}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs" style={{ color: '#8E9EAD' }}>
                          {k.monthly_fee && (
                            <div className="flex items-center gap-1">
                              <DollarSign size={12} style={{ color: '#D4956A' }} />
                              月費 {k.monthly_fee >= 10000 ? `${Math.round(k.monthly_fee / 1000)}K` : k.monthly_fee}元
                            </div>
                          )}
                          {k.student_teacher_ratio && (
                            <div className="flex items-center gap-1">
                              <Users size={12} style={{ color: '#D4956A' }} />
                              師生比 1:{k.student_teacher_ratio}
                            </div>
                          )}
                        </div>
                        {k.teaching_method && k.teaching_method.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {k.teaching_method.slice(0, 3).map(m => (
                              <span key={m} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#FDF0E8', color: '#B07548' }}>{m}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); toggleCompare(k) }}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all z-10"
                      style={{ background: inCompare ? '#D4956A' : 'white', borderColor: inCompare ? '#D4956A' : '#E8E0D5', color: inCompare ? 'white' : '#8E9EAD' }}
                    >
                      <Scale size={12} />
                    </button>
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">🏫</p>
                  <p style={{ color: '#8E9EAD' }}>沒有找到符合條件的學校</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSelected(null)}>
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-black text-xl" style={{ color: '#2D3436' }}>{selected.name}</h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={12} style={{ color: '#8E9EAD' }} />
                  <span className="text-sm" style={{ color: '#8E9EAD' }}>{selected.address || `${selected.city} ${selected.district}`}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-xl shrink-0" style={{ color: '#8E9EAD' }}>✕</button>
            </div>
            {selected.type && (() => { const tc = typeColor(selected.type); return tc ? <span className="inline-block text-sm px-3 py-1 rounded-lg font-semibold mb-4" style={{ background: tc.bg, color: tc.color }}>{selected.type}</span> : null })()}
            <p className="text-xs font-semibold mb-2" style={{ color: '#6B7B8D' }}>費用明細</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: '每月學費', value: selected.monthly_fee },
                { label: '報名費', value: selected.registration_fee },
                { label: '延托費', value: selected.extended_care_fee },
                { label: '教材費', value: selected.material_fee },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl p-3" style={{ background: '#FDF0E8' }}>
                  <p className="text-xs" style={{ color: '#8E9EAD' }}>{label}</p>
                  <p className="font-bold text-sm" style={{ color: '#2D3436' }}>{value ? `${value.toLocaleString()} 元` : '洽詢'}</p>
                </div>
              ))}
            </div>
            {selected.teaching_method && selected.teaching_method.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: '#6B7B8D' }}>教學方法</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.teaching_method.map(m => (
                    <span key={m} className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: '#FDF0E8', color: '#B07548' }}>
                      <CheckCircle size={10} /> {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {selected.description && <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7B8D' }}>{selected.description}</p>}
            <button
              onClick={() => { toggleCompare(selected); setSelected(null) }}
              className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 text-white"
              style={{ background: compareList.find(x => x.id === selected.id) ? '#8E9EAD' : '#D4956A' }}
            >
              <Scale size={16} />
              {compareList.find(x => x.id === selected.id) ? '從比較中移除' : '加入比較'}
            </button>
          </div>
        </div>
      )}

      {/* Preference Sheet */}
      {showPrefSheet && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowPrefSheet(false)}>
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black" style={{ color: '#2D3436' }}>偏好設定</h2>
              <button onClick={() => setShowPrefSheet(false)} style={{ color: '#8E9EAD' }}>✕</button>
            </div>
            <div className="mb-5">
              <label className="text-sm font-semibold mb-2 block" style={{ color: '#2D3436' }}>
                月費預算上限：<span style={{ color: '#D4956A' }}>{tempPrefs.budgetMax.toLocaleString()} 元</span>
              </label>
              <input
                type="range" min={5000} max={40000} step={1000}
                value={tempPrefs.budgetMax}
                onChange={e => setTempPrefs(p => ({ ...p, budgetMax: Number(e.target.value) }))}
                className="w-full accent-orange-400"
              />
            </div>
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2" style={{ color: '#2D3436' }}>偏好教學法</p>
              <div className="flex flex-wrap gap-2">
                {TEACHING_METHODS.map(m => {
                  const isSelected = tempPrefs.teachingMethods.includes(m)
                  return (
                    <button
                      key={m}
                      onClick={() => setTempPrefs(p => ({ ...p, teachingMethods: isSelected ? p.teachingMethods.filter(x => x !== m) : [...p.teachingMethods, m] }))}
                      className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: isSelected ? '#D4956A' : '#FDF0E8', color: isSelected ? 'white' : '#B07548' }}
                    >
                      {m}
                    </button>
                  )
                })}
              </div>
            </div>
            <button
              onClick={() => { setPrefs({ ...tempPrefs, enabled: true }); setShowPrefSheet(false) }}
              className="w-full py-3.5 rounded-2xl font-bold text-base text-white"
              style={{ background: 'linear-gradient(135deg, #D4956A, #B07548)' }}
            >
              套用偏好・開始配對
            </button>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && compareList.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowCompare(false)}>
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black" style={{ color: '#2D3436' }}>學校比較</h2>
              <button onClick={() => setShowCompare(false)} style={{ color: '#8E9EAD' }}>✕</button>
            </div>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr>
                    <td className="text-xs py-2 pl-1 w-20" style={{ color: '#8E9EAD' }}>項目</td>
                    {compareList.map(k => (
                      <td key={k.id} className="text-center py-2 px-1">
                        <p className="font-bold text-xs leading-tight" style={{ color: '#2D3436' }}>{k.name}</p>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: '地區', render: (k: Kindergarten) => `${k.city ?? ''} ${k.district ?? ''}`.trim() || '-' },
                    { label: '月費', render: (k: Kindergarten) => k.monthly_fee ? `${k.monthly_fee.toLocaleString()}元` : '洽詢' },
                    { label: '師生比', render: (k: Kindergarten) => k.student_teacher_ratio ? `1:${k.student_teacher_ratio}` : '-' },
                    { label: '教學法', render: (k: Kindergarten) => k.teaching_method?.join('、') || '-' },
                  ].map(row => (
                    <tr key={row.label} style={{ borderTop: '1px solid #F0EDE8' }}>
                      <td className="text-xs py-2.5 pl-1 font-medium" style={{ color: '#6B7B8D' }}>{row.label}</td>
                      {compareList.map(k => (
                        <td key={k.id} className="text-center py-2.5 px-1 text-xs" style={{ color: '#2D3436' }}>{row.render(k)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setCompareList([]); setShowCompare(false) }} className="flex-1 py-3 rounded-2xl text-sm font-semibold border" style={{ borderColor: '#E8E0D5', color: '#6B7B8D' }}>清除比較</button>
              <button onClick={() => setShowCompare(false)} className="flex-1 py-3 rounded-2xl text-sm font-bold text-white" style={{ background: '#D4956A' }}>繼續瀏覽</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
