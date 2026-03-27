import { NextRequest, NextResponse } from 'next/server'
import { MOCK_PLACES } from '@/lib/mock-data'

/**
 * GET /api/places — 查詢親子景點，支援多種篩選條件
 *
 * Query Params:
 *   city          — 縣市（完全符合）
 *   district      — 行政區（完全符合）
 *   is_indoor     — true / false
 *   place_type    — 景點類型（包含即符合，如 "科學館"）
 *   age_months    — 孩子月齡，回傳 suitable_age_min <= age_months <= suitable_age_max 的景點
 *   mosquito_max  — 蚊蟲風險上限 (1-3)
 *   trending      — true → 只回傳熱門景點
 *   limit         — 每頁筆數（預設 20，最大 50）
 *   offset        — 分頁起始位置（預設 0）
 */
export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams

  const city = params.get('city')
  const district = params.get('district')
  const isIndoor = params.get('is_indoor')
  const placeType = params.get('place_type')
  const ageMonths = params.get('age_months')
  const mosquitoMax = params.get('mosquito_max')
  const trending = params.get('trending')
  const limit = Math.min(parseInt(params.get('limit') ?? '20'), 50)
  const offset = parseInt(params.get('offset') ?? '0')

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    let query = supabase
      .from('places')
      .select('*')
      .order('avg_rating', { ascending: false })
      .range(offset, offset + limit - 1)

    if (city) query = query.eq('city', city)
    if (district) query = query.eq('district', district)
    if (isIndoor !== null) query = query.eq('is_indoor', isIndoor === 'true')
    if (placeType) query = query.contains('place_type', [placeType])
    if (ageMonths) {
      const age = parseInt(ageMonths)
      query = query.lte('suitable_age_min', age).gte('suitable_age_max', age)
    }
    if (mosquitoMax) query = query.lte('mosquito_risk_level', parseInt(mosquitoMax))
    if (trending === 'true') query = query.eq('is_trending', true)

    const { data, error, count } = await query
    if (!error && data && data.length > 0) {
      return NextResponse.json({ data, total: count, limit, offset })
    }
  } catch {
    // fall through to mock data
  }

  // Supabase 不可用或無資料時使用 mock data
  let data = [...MOCK_PLACES]
  if (city) data = data.filter(p => p.city === city)
  if (district) data = data.filter(p => p.district === district)
  if (isIndoor !== null) data = data.filter(p => p.is_indoor === (isIndoor === 'true'))
  if (placeType) data = data.filter(p => p.place_type.includes(placeType))
  if (ageMonths) {
    const age = parseInt(ageMonths)
    data = data.filter(p => p.suitable_age_min <= age && p.suitable_age_max >= age)
  }
  if (mosquitoMax) data = data.filter(p => p.mosquito_risk_level <= parseInt(mosquitoMax))
  if (trending === 'true') data = data.filter(p => p.is_trending)

  const total = data.length
  data = data.slice(offset, offset + limit)

  return NextResponse.json({ data, total, limit, offset })
}
