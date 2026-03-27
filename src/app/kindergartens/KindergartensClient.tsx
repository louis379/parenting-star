'use client'

import { useState, useMemo } from 'react'
import { School, Search, MapPin, Users, DollarSign, CheckCircle } from 'lucide-react'
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
const METHOD_FILTERS = ['蒙特梭利', '華德福', '雙語', '自然']

const TYPE_COLORS: Record<string, string> = {
  '公立': 'bg-blue-50 text-blue-600',
  '私立': 'bg-purple-50 text-purple-600',
  '非營利': 'bg-green-50 text-green-600',
  '準公共': 'bg-teal-50 text-teal-600',
}

interface Props {
  initialData: Kindergarten[]
}

export default function KindergartensClient({ initialData }: Props) {
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('全台')
  const [typeFilter, setTypeFilter] = useState('')
  const [methodFilter, setMethodFilter] = useState('')
  const [selected, setSelected] = useState<Kindergarten | null>(null)

  const filtered = useMemo(() => {
    return initialData.filter(k => {
      if (search && !k.name.toLowerCase().includes(search.toLowerCase()) &&
          !(k.description ?? '').toLowerCase().includes(search.toLowerCase())) return false
      if (cityFilter !== '全台' && k.city !== cityFilter) return false
      if (typeFilter && k.type !== typeFilter) return false
      if (methodFilter && !k.teaching_method?.some(m => m.includes(methodFilter))) return false
      return true
    })
  }, [initialData, search, cityFilter, typeFilter, methodFilter])

  function formatFee(fee: number | null) {
    if (!fee) return '洽詢'
    return fee >= 10000 ? `${Math.round(fee / 1000)}K` : `${fee}`
  }

  return (
    <div style={{ background: '#fffbf5' }} className="min-h-screen">
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <School size={22} />
          <h1 className="text-xl font-black">幼兒園查詢</h1>
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
                cityFilter === city ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-orange-100'
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
                typeFilter === key ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-orange-100'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Teaching method quick filter */}
        <div className="flex gap-2">
          <span className="text-xs text-gray-500 self-center shrink-0">教學法：</span>
          {METHOD_FILTERS.map(m => (
            <button
              key={m}
              onClick={() => setMethodFilter(methodFilter === m ? '' : m)}
              className={cn(
                'shrink-0 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all',
                methodFilter === m ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-orange-100'
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500">找到 {filtered.length} 間幼兒園</p>

        {/* List */}
        <div className="space-y-3">
          {filtered.map(k => (
            <button key={k.id} onClick={() => setSelected(k)} className="w-full text-left">
              <div className="card-warm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm leading-tight">{k.name}</h3>
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
                      <DollarSign size={12} className="text-orange-400" />
                      <span>月費 {formatFee(k.monthly_fee)}元</span>
                    </div>
                  )}
                  {k.student_teacher_ratio && (
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-orange-400" />
                      <span>師生比 1:{k.student_teacher_ratio}</span>
                    </div>
                  )}
                </div>

                {k.teaching_method && k.teaching_method.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {k.teaching_method.slice(0, 3).map(m => (
                      <span key={m} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))}
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

            {/* Type badge */}
            {selected.type && (
              <span className={cn('inline-block text-sm px-3 py-1 rounded-lg font-semibold mb-4', TYPE_COLORS[selected.type] ?? 'bg-gray-50 text-gray-600')}>
                {selected.type}
              </span>
            )}

            {/* Fees grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: '每月學費', value: selected.monthly_fee },
                { label: '報名費', value: selected.registration_fee },
                { label: '延托費', value: selected.extended_care_fee },
                { label: '教材費', value: selected.material_fee },
              ].filter(item => item.value).map(({ label, value }) => (
                <div key={label} className="bg-orange-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-bold text-gray-800 text-sm">{value?.toLocaleString()} 元</p>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
              {selected.student_teacher_ratio && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users size={15} className="text-orange-400" />
                  師生比：1:{selected.student_teacher_ratio}
                </div>
              )}
              {selected.capacity && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <School size={15} className="text-orange-400" />
                  核定人數：{selected.capacity} 人
                </div>
              )}
              {selected.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>📞</span>
                  <a href={`tel:${selected.phone}`} className="text-orange-500">{selected.phone}</a>
                </div>
              )}
            </div>

            {/* Teaching methods */}
            {selected.teaching_method && selected.teaching_method.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">教學方法</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.teaching_method.map(m => (
                    <span key={m} className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle size={10} />
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selected.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{selected.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
