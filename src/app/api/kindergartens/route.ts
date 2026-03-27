import { NextRequest, NextResponse } from 'next/server'
import { MOCK_KINDERGARTENS } from '@/lib/mock-data'

/**
 * GET /api/kindergartens — 查詢幼兒園，支援多種篩選條件
 *
 * Query Params:
 *   city              — 縣市（完全符合）
 *   district          — 行政區（完全符合）
 *   type              — 幼兒園類型（"公立" / "私立" / "非營利" / "準公共"）
 *   teaching_method   — 教學方法（包含即符合，如 "蒙特梭利"）
 *   monthly_fee_max   — 月費上限（整數，單位：元）
 *   monthly_fee_min   — 月費下限（整數）
 *   ratio_max         — 師生比上限（如 8 代表 1:8）
 *   limit             — 每頁筆數（預設 20，最大 50）
 *   offset            — 分頁起始位置（預設 0）
 */
export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams

  const city = params.get('city')
  const district = params.get('district')
  const type = params.get('type')
  const teachingMethod = params.get('teaching_method')
  const monthlyFeeMax = params.get('monthly_fee_max')
  const monthlyFeeMin = params.get('monthly_fee_min')
  const ratioMax = params.get('ratio_max')
  const limit = Math.min(parseInt(params.get('limit') ?? '20'), 50)
  const offset = parseInt(params.get('offset') ?? '0')

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    let query = supabase
      .from('kindergartens')
      .select('*')
      .order('monthly_fee', { ascending: true })
      .range(offset, offset + limit - 1)

    if (city) query = query.eq('city', city)
    if (district) query = query.eq('district', district)
    if (type) query = query.eq('type', type)
    if (teachingMethod) query = query.contains('teaching_method', [teachingMethod])
    if (monthlyFeeMax) query = query.lte('monthly_fee', parseInt(monthlyFeeMax))
    if (monthlyFeeMin) query = query.gte('monthly_fee', parseInt(monthlyFeeMin))
    if (ratioMax) query = query.lte('student_teacher_ratio', parseFloat(ratioMax))

    const { data, error, count } = await query
    if (!error && data && data.length > 0) {
      return NextResponse.json({ data, total: count, limit, offset })
    }
  } catch {
    // fall through to mock data
  }

  // Supabase 不可用或無資料時使用 mock data
  let data = [...MOCK_KINDERGARTENS]
  if (city) data = data.filter(k => k.city === city)
  if (district) data = data.filter(k => k.district === district)
  if (type) data = data.filter(k => k.type === type)
  if (teachingMethod) data = data.filter(k => k.teaching_method.includes(teachingMethod))
  if (monthlyFeeMax) data = data.filter(k => k.monthly_fee <= parseInt(monthlyFeeMax))
  if (monthlyFeeMin) data = data.filter(k => k.monthly_fee >= parseInt(monthlyFeeMin))
  if (ratioMax) data = data.filter(k => k.student_teacher_ratio <= parseFloat(ratioMax))

  data.sort((a, b) => a.monthly_fee - b.monthly_fee)
  const total = data.length
  data = data.slice(offset, offset + limit)

  return NextResponse.json({ data, total, limit, offset })
}
