'use client'

import { useState, useMemo } from 'react'
import { MapPin, Search, Star, Clock, Thermometer } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Place } from '@/types/database'

const CITY_FILTERS = ['全台', '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市', '宜蘭縣', '屏東縣']
const CATEGORY_FILTERS = [
  { key: '', label: '全部' },
  { key: 'indoor', label: '室內' },
  { key: 'outdoor', label: '戶外' },
  { key: 'low_mosquito', label: '低蚊蟲' },
  { key: 'trending', label: '熱門' },
]

const MOSQUITO_LABELS = ['', '低', '中', '高']
const MOSQUITO_COLORS = ['', 'text-green-600 bg-green-50', 'text-yellow-600 bg-yellow-50', 'text-red-600 bg-red-50']

interface Props {
  initialPlaces: Place[]
}

export default function PlacesClient({ initialPlaces }: Props) {
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('全台')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  const filtered = useMemo(() => {
    return initialPlaces.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !(p.description ?? '').toLowerCase().includes(search.toLowerCase())) return false
      if (cityFilter !== '全台' && p.city !== cityFilter) return false
      if (categoryFilter === 'indoor' && !p.is_indoor) return false
      if (categoryFilter === 'outdoor' && p.is_indoor) return false
      if (categoryFilter === 'low_mosquito' && p.mosquito_risk_level > 1) return false
      if (categoryFilter === 'trending' && !p.is_trending) return false
      return true
    })
  }, [initialPlaces, search, cityFilter, categoryFilter])

  return (
    <div style={{ background: '#fffbf5' }} className="min-h-screen">
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={22} />
          <h1 className="text-xl font-black">親子景點</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋景點名稱…"
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
                cityFilter === city
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 border border-orange-100'
              )}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2">
          {CATEGORY_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategoryFilter(key)}
              className={cn(
                'flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all',
                categoryFilter === key
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 border border-orange-100'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="text-xs text-gray-500">找到 {filtered.length} 個景點</p>

        {/* Places list */}
        <div className="space-y-3">
          {filtered.map(place => (
            <button
              key={place.id}
              onClick={() => setSelectedPlace(place)}
              className="w-full text-left"
            >
              <div className="card-warm p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-3">
                  {/* Emoji placeholder for image */}
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-3xl shrink-0">
                    {place.is_indoor ? '🏛️' : '🌳'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
                        {place.name}
                      </h3>
                      {place.is_trending && (
                        <span className="shrink-0 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-lg font-medium">
                          熱門
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={11} className="text-gray-400" />
                      <span className="text-xs text-gray-500">{place.city} {place.district}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      {/* Rating */}
                      <div className="flex items-center gap-0.5">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-gray-700">
                          {place.avg_rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">({place.review_count})</span>
                      </div>
                      {/* Indoor/outdoor */}
                      <span className={`text-xs px-1.5 py-0.5 rounded-lg ${place.is_indoor ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                        {place.is_indoor ? '室內' : '戶外'}
                      </span>
                      {/* Mosquito */}
                      <span className={`text-xs px-1.5 py-0.5 rounded-lg ${MOSQUITO_COLORS[place.mosquito_risk_level]}`}>
                        🦟 {MOSQUITO_LABELS[place.mosquito_risk_level]}
                      </span>
                    </div>
                    {/* Stay time */}
                    {place.avg_stay_minutes && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={11} className="text-gray-400" />
                        <span className="text-xs text-gray-500">建議停留 {place.avg_stay_minutes} 分鐘</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Features */}
                {place.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {place.features.slice(0, 4).map(f => (
                      <span key={f} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">
                        {f}
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
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500">沒有找到符合條件的景點</p>
          </div>
        )}
      </div>

      {/* Place detail modal */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelectedPlace(null)}>
          <div
            className="w-full bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-black text-gray-800 text-xl leading-tight">{selectedPlace.name}</h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={12} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{selectedPlace.address || `${selectedPlace.city} ${selectedPlace.district}`}</span>
                </div>
              </div>
              <button onClick={() => setSelectedPlace(null)} className="text-gray-400 text-xl shrink-0">✕</button>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="font-bold text-gray-800">{selectedPlace.avg_rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({selectedPlace.review_count} 評論)</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg ${selectedPlace.is_indoor ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {selectedPlace.is_indoor ? '🏠 室內' : '🌳 戶外'}
              </span>
              <span className={`text-xs px-2 py-1 rounded-lg ${MOSQUITO_COLORS[selectedPlace.mosquito_risk_level]}`}>
                🦟 蚊蟲 {MOSQUITO_LABELS[selectedPlace.mosquito_risk_level]}
              </span>
            </div>

            {selectedPlace.description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{selectedPlace.description}</p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-orange-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">適合年齡</p>
                <p className="font-bold text-gray-800 text-sm">
                  {selectedPlace.suitable_age_min < 12
                    ? `${selectedPlace.suitable_age_min}個月`
                    : `${Math.floor(selectedPlace.suitable_age_min / 12)}歲`}
                  {' ~ '}
                  {selectedPlace.suitable_age_max >= 144 ? '12歲以上' : `${Math.floor(selectedPlace.suitable_age_max / 12)}歲`}
                </p>
              </div>
              {selectedPlace.avg_stay_minutes && (
                <div className="bg-orange-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">建議停留</p>
                  <p className="font-bold text-gray-800 text-sm">{selectedPlace.avg_stay_minutes} 分鐘</p>
                </div>
              )}
            </div>

            {selectedPlace.features.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">設施特色</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlace.features.map(f => (
                    <span key={f} className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
