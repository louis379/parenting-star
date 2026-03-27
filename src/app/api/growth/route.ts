import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/growth?child_id=xxx — 列出某孩子的成長紀錄
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const childId = new URL(request.url).searchParams.get('child_id')
  if (!childId) return NextResponse.json({ error: 'Missing child_id' }, { status: 400 })

  const { data, error } = await supabase
    .from('growth_records')
    .select('*')
    .eq('child_id', childId)
    .order('measured_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/growth — 新增成長紀錄
// Body: { child_id, measured_at, height_cm?, weight_kg?, head_circumference_cm?, notes? }
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase
    .from('growth_records')
    .insert({ ...body, recorded_by: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// PATCH /api/growth — 更新成長紀錄
// Body: { id, ...fields }
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, ...updates } = await request.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data, error } = await supabase
    .from('growth_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/growth?id=xxx — 刪除成長紀錄
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase.from('growth_records').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
