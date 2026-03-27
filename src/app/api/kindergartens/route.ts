import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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
  const supabase = await createClient()
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
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data, total: count, limit, offset })
}
