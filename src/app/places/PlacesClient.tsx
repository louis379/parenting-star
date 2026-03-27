'use client'

import { useState, useMemo } from 'react'
import { MapPin, BookOpen, ClipboardList, Search, Star, Clock, MessageSquare, Send, X, Baby, Sun, CloudRain, Wind, Leaf } from 'lucide-react'
import type { Place } from '@/types/database'

type MainTab = 'knowledge' | 'records'

const CITY_FILTERS = ['全台', '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市', '宜蘭縣', '屏東縣']
const MOSQUITO_LABELS = ['', '低', '中', '高']

const seasonalTips = [
  {
    season: '春季 (3–5月)',
    icon: Leaf,
    color: '#7BA87B',
    bg: '#EBF4EB',
    tips: ['踏青好時機，戶外公園、農場都適合', '注意花粉季，過敏兒建議先查過敏原', '春雨較多，出發前確認天氣'],
    places: ['國家公園', '農場體驗', '賞花步道', '溪流戲水'],
  },
  {
    season: '夏季 (6–8月)',
    icon: Sun,
    color: '#D4956A',
    bg: '#FDF0E8',
    tips: ['室內場館優先，避免正午外出', '水上樂園、游泳池是首選', '蚊蟲多，戶外活動做好防護', '水分補充很重要'],
    places: ['水上樂園', '室內科博館', '兒童美術館', '親子餐廳'],
  },
  {
    season: '秋季 (9–11月)',
    icon: Wind,
    color: '#7B9EBD',
    bg: '#EBF4FF',
    tips: ['最舒適的戶外季節', '登山健行適合各年齡', '音樂節、文化祭活動多', '注意日夜溫差'],
    places: ['登山步道', '文化園區', '自行車道', '稻田季活動'],
  },
  {
    season: '冬季 (12–2月)',
    icon: CloudRain,
    color: '#9B8BB4',
    bg: '#F0EBF8',
    tips: ['室內活動為主，避免寒流外出', '溫泉適合 2 歲以上（注意水溫）', '天氣好時可賞冬陽', '注意保暖，層次穿衣'],
    places: ['室內遊樂場', '親子館', '溫泉區', '博物館科教館'],
  },
]

const placeTypes = [
  { type: '運動體能', icon: '🏃', desc: '體能館、攀岩、直排輪、游泳，促進大動作發展' },
  { type: '藝文創作', icon: '🎨', desc: '美術館、陶藝、手作坊，培養創造力與藝術感' },
  { type: '自然生態', icon: '🌿', desc: '農場、生態園、國家公園，培養自然觀察力' },
  { type: '科學探索', icon: '🔬', desc: '科博館、天文館、科學館，激發好奇心與邏輯思維' },
  { type: '手作體驗', icon: '🧁', desc: '烘焙、DIY 手工藝，練習精細動作與專注力' },
]

const allergyGuide = [
  { type: '花粉過敏', season: '春季高峰', caution: '賞花、草地活動', solution: '口罩、選室內場館、避開高峰期' },
  { type: '蚊蟲叮咬', season: '夏秋季節', caution: '草叢、溪邊、農場', solution: '防蚊液、穿長袖、低蚊蟲景點優先' },
  { type: '塵蟎', season: '全年', caution: '老舊室內場館', solution: '選擇通風良好、定期清潔的場所' },
]

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
  { id: 'r1', placeId: 'mock', rating: 5, comment: '非常適合小孩！空間寬敞，設備乾淨，服務人員也很親切。', childAge: '2 歲', authorName: '小明媽媽', createdAt: '2026-03-15' },
  { id: 'r2', placeId: 'mock', rating: 4, comment: '整體不錯，週末人比較多，建議平日來。', childAge: '3 歲', authorName: '小花爸爸', createdAt: '2026-03-10' },
]

const CHILD_AGE_OPTIONS = ['0-6 個月', '6-12 個月', '1 歲', '2 歲', '3 歲', '4 歲', '5 歲', '6 歲以上']

interface Props {
  initialPlaces: Place[]
}

function StarRating({ value, onChange, size = 24 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0)
  const display = hover || value
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange?.(n)} onMouseEnter={() => onChange && setHover(n)} onMouseLeave={() => onChange && setHover(0)} className={!onChange ? 'pointer-events-none' : ''}>
          <Star size={size} style={{ color: display >= n ? '#FBBF24' : '#E5E7EB', fill: display >= n ? '#FBBF24' : '#E5E7EB' }} />
        </button>
      ))}
    </div>
  )
}

export default function PlacesClient({ initialPlaces }: Props) {
  const [mainTab, setMainTab] = useState<MainTab>('knowledge')
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('全台')
  const [indoorFilter, setIndoorFilter] = useState<'all' | 'indoor' | 'outdoor'>('all')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [showReviewSheet, setShowReviewSheet] = useState(false)
  const [localReviews, setLocalReviews] = useState<Review[]>([])
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewChildAge, setReviewChildAge] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [localRatings, setLocalRatings] = useState<Record<string, { sum: number; count: number }>>({})

  const filtered = useMemo(() => {
    return initialPlaces.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (cityFilter !== '全台' && p.city !== cityFilter) return false
      if (indoorFilter === 'indoor' && !p.is_indoor) return false
      if (indoorFilter === 'outdoor' && p.is_indoor) return false
      return true
    })
  }, [initialPlaces, search, cityFilter, indoorFilter])

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
    const newReview: Review = { id: `r${Date.now()}`, placeId: selectedPlace.id, rating: reviewRating, comment: reviewComment, childAge: reviewChildAge, authorName: '我', createdAt: new Date().toISOString().split('T')[0] }
    setLocalReviews(prev => [...prev, newReview])
    setLocalRatings(prev => { const cur = prev[selectedPlace.id] ?? { sum: 0, count: 0 }; return { ...prev, [selectedPlace.id]: { sum: cur.sum + reviewRating, count: cur.count + 1 } } })
    setReviewSubmitted(true)
    setShowReviewSheet(false)
    setReviewRating(0); setReviewComment(''); setReviewChildAge('')
    setTimeout(() => setReviewSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: 'linear-gradient(160deg, #A8D8C8 0%, #7BB8A8 45%, #5A9888 100%)' }}>
        <div className="flex items-center gap-2 text-white mb-4">
          <MapPin size={22} strokeWidth={2.5} />
          <h1 className="text-xl font-black">親子景點</h1>
        </div>

        {/* Main tab switcher */}
        <div className="flex rounded-2xl p-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <button
            onClick={() => setMainTab('knowledge')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: mainTab === 'knowledge' ? 'white' : 'transparent', color: mainTab === 'knowledge' ? '#5A9888' : 'rgba(255,255,255,0.85)' }}
          >
            <BookOpen size={15} /> 景點知識
          </button>
          <button
            onClick={() => setMainTab('records')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: mainTab === 'records' ? 'white' : 'transparent', color: mainTab === 'records' ? '#5A9888' : 'rgba(255,255,255,0.85)' }}
          >
            <ClipboardList size={15} /> 景點搜尋
          </button>
        </div>
      </div>

      {/* === 景點知識 Tab === */}
      {mainTab === 'knowledge' && (
        <div className="px-5 py-5 space-y-6">
          {/* 季節推薦 */}
          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: '#2D3436' }}>季節出遊建議</h2>
            <div className="space-y-3">
              {seasonalTips.map((s) => (
                <div key={s.season} className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                      <s.icon size={16} style={{ color: s.color }} />
                    </div>
                    <h3 className="font-bold text-sm" style={{ color: '#2D3436' }}>{s.season}</h3>
                  </div>
                  <div className="space-y-1 mb-2">
                    {s.tips.map((tip, i) => (
                      <p key={i} className="text-xs leading-relaxed" style={{ color: '#6B7B8D' }}>• {tip}</p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {s.places.map(p => (
                      <span key={p} className="text-xs px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 景點類型 */}
          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: '#2D3436' }}>景點類型與效益</h2>
            <div className="space-y-2">
              {placeTypes.map((t) => (
                <div key={t.type} className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                  <span className="text-xl shrink-0">{t.icon}</span>
                  <div>
                    <p className="font-bold text-sm mb-0.5" style={{ color: '#2D3436' }}>{t.type}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#6B7B8D' }}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 過敏篩選指南 */}
          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: '#2D3436' }}>過敏兒出遊指南</h2>
            <div className="space-y-2">
              {allergyGuide.map((a) => (
                <div key={a.type} className="p-3 rounded-xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm" style={{ color: '#2D3436' }}>{a.type}</span>
                    <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: '#EBF6F2', color: '#5A9888' }}>{a.season}</span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: '#8E9EAD' }}>
                    <span style={{ color: '#B07548' }}>注意：</span>{a.caution}
                  </p>
                  <p className="text-xs" style={{ color: '#6B7B8D' }}>
                    <span style={{ color: '#5A9888' }}>建議：</span>{a.solution}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* === 景點搜尋 Tab === */}
      {mainTab === 'records' && (
        <div className="px-5 py-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8E9EAD' }} />
            <input
              type="text"
              placeholder="搜尋景點名稱…"
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
                style={{ background: cityFilter === city ? '#7BB8A8' : 'white', color: cityFilter === city ? 'white' : '#6B7B8D', border: `1px solid ${cityFilter === city ? '#7BB8A8' : '#E8E0D5'}` }}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Indoor/outdoor filter */}
          <div className="flex gap-2">
            {[{ key: 'all', label: '全部' }, { key: 'indoor', label: '🏠 室內' }, { key: 'outdoor', label: '🌳 戶外' }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setIndoorFilter(key as any)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: indoorFilter === key ? '#7BB8A8' : 'white', color: indoorFilter === key ? 'white' : '#6B7B8D', border: `1px solid ${indoorFilter === key ? '#7BB8A8' : '#E8E0D5'}` }}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="text-xs" style={{ color: '#8E9EAD' }}>共 {filtered.length} 個景點</p>

          {/* Places list */}
          <div className="space-y-3">
            {filtered.map(place => {
              const { avg, count } = getDisplayRating(place)
              return (
                <button key={place.id} onClick={() => setSelectedPlace(place)} className="w-full text-left">
                  <div className="p-4 rounded-2xl border transition-shadow hover:shadow-md" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: '#EBF6F2' }}>
                        {place.is_indoor ? '🏛️' : '🌳'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-sm leading-tight line-clamp-1" style={{ color: '#2D3436' }}>{place.name}</h3>
                          {place.is_trending && (
                            <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-lg font-medium" style={{ background: '#EBF6F2', color: '#5A9888' }}>熱門</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={11} style={{ color: '#8E9EAD' }} />
                          <span className="text-xs" style={{ color: '#8E9EAD' }}>{place.city} {place.district}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-0.5">
                            <Star size={12} style={{ color: '#FBBF24', fill: '#FBBF24' }} />
                            <span className="text-xs font-semibold" style={{ color: '#2D3436' }}>{avg.toFixed(1)}</span>
                            <span className="text-xs" style={{ color: '#8E9EAD' }}>({count})</span>
                          </div>
                          <span className="text-xs px-1.5 py-0.5 rounded-lg" style={{ background: place.is_indoor ? '#EBF4FF' : '#EBF4EB', color: place.is_indoor ? '#5E85A3' : '#5A8A5A' }}>
                            {place.is_indoor ? '室內' : '戶外'}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded-lg" style={{
                            background: place.mosquito_risk_level === 1 ? '#EBF4EB' : place.mosquito_risk_level === 2 ? '#FFF8E8' : '#FFF0F0',
                            color: place.mosquito_risk_level === 1 ? '#5A8A5A' : place.mosquito_risk_level === 2 ? '#B07548' : '#C45A5A',
                          }}>
                            🦟 {MOSQUITO_LABELS[place.mosquito_risk_level]}
                          </span>
                        </div>
                        {place.avg_stay_minutes && (
                          <div className="flex items-center gap-1 mt-1">
                            <Clock size={11} style={{ color: '#8E9EAD' }} />
                            <span className="text-xs" style={{ color: '#8E9EAD' }}>建議停留 {place.avg_stay_minutes} 分鐘</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {place.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {place.features.slice(0, 4).map(f => (
                          <span key={f} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EBF6F2', color: '#5A9888' }}>{f}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🔍</p>
                <p style={{ color: '#8E9EAD' }}>沒有找到符合條件的景點</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Place detail modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedPlace(null)}>
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-black text-xl leading-tight" style={{ color: '#2D3436' }}>{selectedPlace.name}</h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={12} style={{ color: '#8E9EAD' }} />
                  <span className="text-sm" style={{ color: '#8E9EAD' }}>{selectedPlace.address || `${selectedPlace.city} ${selectedPlace.district}`}</span>
                </div>
              </div>
              <button onClick={() => setSelectedPlace(null)} className="text-xl shrink-0" style={{ color: '#8E9EAD' }}>✕</button>
            </div>

            {(() => {
              const { avg, count } = getDisplayRating(selectedPlace)
              return (
                <div className="flex items-center gap-3 mb-4">
                  <StarRating value={Math.round(avg)} size={18} />
                  <span className="font-black text-lg" style={{ color: '#2D3436' }}>{avg.toFixed(1)}</span>
                  <span className="text-sm" style={{ color: '#8E9EAD' }}>({count} 則)</span>
                  <span className="text-xs px-2 py-1 rounded-lg ml-auto" style={{ background: selectedPlace.is_indoor ? '#EBF4FF' : '#EBF4EB', color: selectedPlace.is_indoor ? '#5E85A3' : '#5A8A5A' }}>
                    {selectedPlace.is_indoor ? '🏠 室內' : '🌳 戶外'}
                  </span>
                </div>
              )
            })()}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl p-3" style={{ background: '#EBF6F2' }}>
                <p className="text-xs mb-1" style={{ color: '#8E9EAD' }}>適合年齡</p>
                <p className="font-bold text-sm" style={{ color: '#2D3436' }}>
                  {selectedPlace.suitable_age_min < 12 ? `${selectedPlace.suitable_age_min}個月` : `${Math.floor(selectedPlace.suitable_age_min / 12)}歲`}
                  {' ~ '}
                  {selectedPlace.suitable_age_max >= 144 ? '12歲+' : `${Math.floor(selectedPlace.suitable_age_max / 12)}歲`}
                </p>
              </div>
              {selectedPlace.avg_stay_minutes && (
                <div className="rounded-xl p-3" style={{ background: '#EBF6F2' }}>
                  <p className="text-xs mb-1" style={{ color: '#8E9EAD' }}>建議停留</p>
                  <p className="font-bold text-sm" style={{ color: '#2D3436' }}>{selectedPlace.avg_stay_minutes} 分鐘</p>
                </div>
              )}
            </div>

            {selectedPlace.description && (
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7B8D' }}>{selectedPlace.description}</p>
            )}

            {selectedPlace.features.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: '#6B7B8D' }}>設施特色</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlace.features.map(f => (
                    <span key={f} className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#EBF6F2', color: '#5A9888' }}>{f}</span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowReviewSheet(true)}
              className="w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 text-white mb-4"
              style={{ background: 'linear-gradient(135deg, #7BB8A8, #5A9888)' }}
            >
              <Star size={16} /> 寫評價
            </button>

            {(() => {
              const reviews = getPlaceReviews(selectedPlace.id)
              return reviews.length > 0 ? (
                <div>
                  <p className="text-sm font-bold mb-3 flex items-center gap-1.5" style={{ color: '#2D3436' }}>
                    <MessageSquare size={15} style={{ color: '#7BB8A8' }} />
                    用戶評論
                  </p>
                  <div className="space-y-3">
                    {reviews.map(review => (
                      <div key={review.id} className="rounded-2xl p-3.5" style={{ background: '#F5FAFA' }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#7BB8A8' }}>
                              {review.authorName[0]}
                            </div>
                            <span className="text-xs font-semibold" style={{ color: '#2D3436' }}>{review.authorName}</span>
                          </div>
                          <StarRating value={review.rating} size={13} />
                        </div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Baby size={12} style={{ color: '#7BB8A8' }} />
                          <span className="text-xs font-medium" style={{ color: '#5A9888' }}>帶 {review.childAge} 小孩</span>
                          <span className="text-xs ml-auto" style={{ color: '#8E9EAD' }}>{review.createdAt}</span>
                        </div>
                        {review.comment && <p className="text-sm leading-relaxed" style={{ color: '#6B7B8D' }}>{review.comment}</p>}
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
        <div className="fixed inset-0 z-[60] flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowReviewSheet(false)}>
          <div className="w-full bg-white rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black" style={{ color: '#2D3436' }}>寫評價</h3>
              <button onClick={() => setShowReviewSheet(false)} style={{ color: '#8E9EAD' }}><X size={20} /></button>
            </div>
            <p className="text-sm font-medium mb-4" style={{ color: '#6B7B8D' }}>{selectedPlace.name}</p>
            <div className="mb-4">
              <p className="text-sm font-semibold mb-2" style={{ color: '#2D3436' }}>整體評分 *</p>
              <StarRating value={reviewRating} onChange={setReviewRating} size={32} />
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold mb-2" style={{ color: '#2D3436' }}>帶幾歲的小孩 *</p>
              <div className="flex flex-wrap gap-2">
                {CHILD_AGE_OPTIONS.map(age => (
                  <button key={age} onClick={() => setReviewChildAge(age)} className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: reviewChildAge === age ? '#7BB8A8' : '#EBF6F2', color: reviewChildAge === age ? 'white' : '#5A9888' }}>
                    {age}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold mb-2" style={{ color: '#2D3436' }}>留言（選填）</p>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="分享你的遊玩體驗…"
                rows={3}
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none border"
                style={{ background: '#F5FAFA', borderColor: '#C5E8E0', color: '#2D3436' }}
              />
            </div>
            <button
              onClick={submitReview}
              disabled={reviewRating === 0 || !reviewChildAge}
              className="w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all text-white"
              style={{ background: reviewRating > 0 && reviewChildAge ? 'linear-gradient(135deg, #7BB8A8, #5A9888)' : '#E8E0D5' }}
            >
              <Send size={16} /> 送出評價
            </button>
          </div>
        </div>
      )}

      {/* Success toast */}
      {reviewSubmitted && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-lg z-50 flex items-center gap-2 text-white" style={{ background: '#7BB8A8' }}>
          ✅ 評價已送出，謝謝！
        </div>
      )}
    </div>
  )
}
