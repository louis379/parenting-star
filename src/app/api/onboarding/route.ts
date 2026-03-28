import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/onboarding — 完成 onboarding 後建立 family + family_member + child
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { child, family: familyData } = body

  if (!child?.nickname || !child?.birthDate) {
    return NextResponse.json({ error: '缺少必要欄位：孩子暱稱和出生日期' }, { status: 400 })
  }

  // 檢查是否已有 family_member（避免重複建立）
  const { data: existingMember } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  let familyId: string

  if (existingMember?.family_id) {
    // 已有家庭，直接使用
    familyId = existingMember.family_id
  } else {
    // 建立家庭
    const { data: newFamily, error: familyError } = await supabase
      .from('families')
      .insert({
        name: familyData?.name || `${child.nickname}的家`,
        created_by: user.id,
      })
      .select()
      .single()

    if (familyError || !newFamily) {
      return NextResponse.json({ error: familyError?.message || '建立家庭失敗' }, { status: 500 })
    }

    familyId = newFamily.id

    // 建立 family_member
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        family_id: familyId,
        user_id: user.id,
        role: 'primary',
      })

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 })
    }
  }

  // 將性別轉換為 DB 格式
  const genderMap: Record<string, string> = { '男生': 'male', '女生': 'female', '不透露': 'other' }

  // 建立孩子
  const { data: newChild, error: childError } = await supabase
    .from('children')
    .insert({
      family_id: familyId,
      nickname: child.nickname,
      birth_date: child.birthDate,
      gender: genderMap[child.gender] || child.gender || null,
      birth_weight_g: child.birthWeightG || null,
      birth_height_cm: child.birthHeightCm || null,
      gestational_weeks: child.gestationalWeeks || null,
      allergies: child.allergies || [],
      health_conditions: child.healthConditions || [],
      special_traits: child.specialTraits || [],
    })
    .select()
    .single()

  if (childError) {
    return NextResponse.json({ error: childError.message }, { status: 500 })
  }

  return NextResponse.json({
    family_id: familyId,
    child: newChild,
  }, { status: 201 })
}
