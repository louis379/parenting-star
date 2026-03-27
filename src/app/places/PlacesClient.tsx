'use client'

import { useState, useMemo } from 'react'
import { MapPin, Search, Star, Clock, MessageSquare, Send, X, Baby } from 'lucide-react'
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

const CHILD_AGE_OPTIONS = [
  '0-6 個月', '6-12 個月', '1 歲', '2 歲', '3 歲', '4 歲', '5 歲', '6 歲以上'
]

// Mock reviews stored in memory for demo
interface Review {
  id: string
  placeId: string
  rating: number
  comment: string
  childAge: string
  authorName: string
  createdAt: string
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1', placeId: 'mock', rating: 5,
    comment: '非常適合小孩！空間寬敞，設備乾淨，服務人員也很親切。',
    childAge: '2 歲', authorName: '小明媽媽', createdAt: '2026-03-15'
  },
  {
    id: 'r2', placeId: 'mock', rating: 4,
    comment: '整體不錯，週末人比較多，建議平日來。',
    childAge: '3 歲', authorName: '小花爸爸', createdAt: '2026-03-10'
  },
]

interface Props {
  initialPlaces: Place[]
}

function StarRating({ value, onChange, size = 24 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0)
  const display = hover || value
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          className={cn('transition-all', !onChange && 'pointer-events-none')}
        >
          <Star
            size={size}
            className={cn(display >= n ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200')}
          />
        </button>
      ))}
    </div>
  )
}

export default function PlacesClient({ initialPlaces }: Props) {
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('全台')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [showReviewSheet, setShowReviewSheet] = useState(false)
  const [localReviews, setLocalReviews] = useState<Review[]>([])

  // Review form state
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewChildAge, setReviewChildAge] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  // Local ratings (override avg_rating for places that have been rated)
  const [localRatings, setLocalRatings] = useState<Record<string, { sum: number; count: number }>>({})

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

  function getDisplayRating(place: Place) {
    const local = localRatings[place.id]
    if (!local) return { avg: place.avg_rating, count: place.review_count }
    const totalSum = place.avg_rating * place.review_count + local.sum
    const totalCount = place.review_count + local.count
    return { avg: totalCount > 0 ? totalSum / totalCount : 0, count: totalCount }
  }

  function getPlaceReviews(placeId: string) {
    return [...MOCK_REVIEWS.filter(r => r.placeId === placeId || r.placeId === 'mock'), ...localReviews.filter(r => r.placeId === placeId)]
  }

  function submitReview() {
    if (!selectedPlace || reviewRating === 0 || !reviewChildAge) return
    const newReview: Review = {
      id: `r${Date.now()}`,
      placeId: selectedPlace.id,
      rating: reviewRating,
      comment: reviewComment,
      childAge: reviewChildAge,
      authorName: '我',
      createdAt: new Date().toISOString().split('T')[0],
    }
    setLocalReviews(prev => [...prev, newReview])
    setLocalRatings(prev => {
      const cur = prev[selectedPlace.id] ?? { sum: 0, count: 0 }
      return { ...prev, [selectedPlace.id]: { sum: cur.sum + reviewRating, count: cur.count + 1 } }
    })
    setReviewSubmitted(true)
    setShowReviewSheet(false)
    setReviewRating(0)
    setReviewComment('')
    setReviewChildAge('')
    setTimeout(() => setReviewSubmitted(false), 3000)
  }

  return (
    <div style={{ background: '#fffbf5' }} className="min-h-screen">
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={22} />
          <h1 className="text-xl font-black">親子景點</h1>
        </div>
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
                cityFilter === city ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-orange-100'
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
                categoryFilter === key ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-orange-100'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500">找到 {filtered.length} 個景點</p>

        {/* Places list */}
        <div className="space-y-3">
          {filtered.map(place => {
            const { avg, count } = getDisplayRating(place)
            return (
              <button key={place.id} onClick={() => setSelectedPlace(place)} className="w-full text-left">
                <div className="card-warm p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-3xl shrink-0">
                      {place.is_indoor ? '🏛️' : '🌳'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">{place.name}</h3>
                        {place.is_trending && (
                          <span className="shrink-0 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-lg font-medium">熱門</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={11} className="text-gray-400" />
                        <span className="text-xs text-gray-500">{place.city} {place.district}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-0.5">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs font-semibold text-gray-700">{avg.toFixed(1)}</span>
                          <span className="text-xs text-gray-400">({count})</span>
                        </div>
                        <span className={`text-xs px-1.5 py-0.5 rounded-lg ${place.is_indoor ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                          {place.is_indoor ? '室內' : '戶外'}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-lg ${MOSQUITO_COLORS[place.mosquito_risk_level]}`}>
                          🦟 {MOSQUITO_LABELS[place.mosquito_risk_level]}
                        </span>
                      </div>
                      {place.avg_stay_minutes && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={11} className="text-gray-400" />
                          <span className="text-xs text-gray-500">建議停留 {place.avg_stay_minutes} 分鐘</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {place.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {place.features.slice(0, 4).map(f => (
                        <span key={f} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
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
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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

            {/* Rating display */}
            {(() => {
              const { avg, count } = getDisplayRating(selectedPlace)
              return (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <StarRating value={Math.round(avg)} size={18} />
                    <span className="font-black text-gray-800 text-lg">{avg.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-400">({count} 則評論)</span>
                  <span className={`text-xs px-2 py-1 rounded-lg ml-auto ${selectedPlace.is_indoor ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    {selectedPlace.is_indoor ? '🏠 室內' : '🌳 戶外'}
                  </span>
                </div>
              )
            })()}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-orange-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">適合年齡</p>
                <p className="font-bold text-gray-800 text-sm">
                  {selectedPlace.suitable_age_min < 12
                    ? `${selectedPlace.suitable_age_min}個月`
                    : `${Math.floor(selectedPlace.suitable_age_min / 12)}歲`}
                  {' ~ '}
                  {selectedPlace.suitable_age_max >= 144 ? '12歲+' : `${Math.floor(selectedPlace.suitable_age_max / 12)}歲`}
                </p>
              </div>
              {selectedPlace.avg_stay_minutes && (
                <div className="bg-orange-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">建議停留</p>
                  <p className="font-bold text-gray-800 text-sm">{selectedPlace.avg_stay_minutes} 分鐘</p>
                </div>
              )}
            </div>

            {selectedPlace.description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{selectedPlace.description}</p>
            )}

            {selectedPlace.features.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">設施特色</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlace.features.map(f => (
                    <span key={f} className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Write review button */}
            <button
              onClick={() => setShowReviewSheet(true)}
              className="w-full py-3 bg-orange-500 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 mb-4"
            >
              <Star size={16} /> 寫評價
            </button>

            {/* Reviews section */}
            {(() => {
              const reviews = getPlaceReviews(selectedPlace.id)
              return reviews.length > 0 ? (
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                    <MessageSquare size={15} className="text-orange-500" />
                    用戶評論
                  </p>
                  <div className="space-y-3">
                    {reviews.map(review => (
                      <div key={review.id} className="bg-gray-50 rounded-2xl p-3.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full gradient-hero flex items-center justify-center text-white text-xs font-bold">
                              {review.authorName[0]}
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{review.authorName}</span>
                          </div>
                          <StarRating value={review.rating} size={13} />
                        </div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Baby size={12} className="text-orange-400" />
                          <span className="text-xs text-orange-600 font-medium">帶 {review.childAge} 小孩</span>
                          <span className="text-xs text-gray-400 ml-auto">{review.createdAt}</span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            })()}
          </div>
        </div>
      )}

      {/* Review form sheet */}
      {showReviewSheet && selectedPlace && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end" onClick={() => setShowReviewSheet(false)}>
          <div className="w-full bg-white rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-800">寫評價</h3>
              <button onClick={() => setShowReviewSheet(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <p className="text-sm text-gray-600 mb-4 font-medium">{selectedPlace.name}</p>

            {/* Star rating input */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">整體評分 *</p>
              <StarRating value={reviewRating} onChange={setReviewRating} size={32} />
            </div>

            {/* Child age */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">帶幾歲的小孩 *</p>
              <div className="flex flex-wrap gap-2">
                {CHILD_AGE_OPTIONS.map(age => (
                  <button
                    key={age}
                    onClick={() => setReviewChildAge(age)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                      reviewChildAge === age ? 'bg-orange-500 text-white' : 'bg-orange-50 text-gray-600'
                    )}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">留言（選填）</p>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="分享你的遊玩體驗…"
                rows={3}
                className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-gray-700 outline-none resize-none"
              />
            </div>

            <button
              onClick={submitReview}
              disabled={reviewRating === 0 || !reviewChildAge}
              className={cn(
                'w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all',
                reviewRating > 0 && reviewChildAge
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-400'
              )}
            >
              <Send size={16} /> 送出評價
            </button>
          </div>
        </div>
      )}

      {/* Success toast */}
      {reviewSubmitted && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-lg z-50 flex items-center gap-2">
          ✅ 評價已送出，謝謝！
        </div>
      )}
    </div>
  )
}
