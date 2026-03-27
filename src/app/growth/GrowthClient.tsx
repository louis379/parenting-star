'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Plus, TrendingUp, Ruler, Weight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

const GrowthChart = dynamic(
  () => import('@/components/charts/GrowthChart').then(m => ({ default: m.GrowthChart })),
  {
    loading: () => <div className="h-48 flex items-center justify-center text-gray-400 text-sm">載入圖表中…</div>,
    ssr: false,
  }
)
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { formatAge, calcAgeMonths } from '@/lib/utils'
import type { Child, GrowthRecord } from '@/types/database'

interface Props {
  children: Child[]
  initialRecords: GrowthRecord[]
}

type ChartTab = 'height' | 'weight'

export default function GrowthClient({ children, initialRecords }: Props) {
  const [activeChildIdx, setActiveChildIdx] = useState(0)
  const [records, setRecords] = useState<GrowthRecord[]>(initialRecords)
  const [chartTab, setChartTab] = useState<ChartTab>('height')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    measuredAt: new Date().toISOString().split('T')[0],
    heightCm: '', weightKg: '', headCm: '', notes: '',
  })

  const activeChild = children[activeChildIdx]
  const ageMonths = activeChild ? calcAgeMonths(activeChild.birth_date) : 0
  const latestRecord = records[records.length - 1]

  async function handleSave() {
    if (!activeChild) return
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('growth_records').insert({
      child_id: activeChild.id,
      measured_at: form.measuredAt,
      height_cm: form.heightCm ? parseFloat(form.heightCm) : null,
      weight_kg: form.weightKg ? parseFloat(form.weightKg) : null,
      head_circumference_cm: form.headCm ? parseFloat(form.headCm) : null,
      notes: form.notes || null,
    }).select().single()

    if (!error && data) {
      setRecords(r => [...r, data])
      setShowForm(false)
      setForm({ measuredAt: new Date().toISOString().split('T')[0], heightCm: '', weightKg: '', headCm: '', notes: '' })
    }
    setSaving(false)
  }

  return (
    <div style={{ background: '#fffbf5' }} className="min-h-screen">
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={22} />
            <h1 className="text-xl font-black">生長追蹤</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm font-medium"
          >
            <Plus size={16} />新增記錄
          </button>
        </div>

        {/* Child selector */}
        {children.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {children.map((child, i) => (
              <button
                key={child.id}
                onClick={() => setActiveChildIdx(i)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  i === activeChildIdx ? 'bg-white text-orange-600' : 'bg-white/20 text-white'
                }`}
              >
                {child.nickname}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Latest stats */}
        {activeChild && (
          <div className="grid grid-cols-3 gap-3">
            <div className="card-warm p-3 text-center">
              <Ruler size={18} className="mx-auto text-orange-400 mb-1" />
              <p className="text-xl font-black text-gray-800">
                {latestRecord?.height_cm ?? '—'}
              </p>
              <p className="text-xs text-gray-500">身高 (cm)</p>
            </div>
            <div className="card-warm p-3 text-center">
              <Weight size={18} className="mx-auto text-orange-400 mb-1" />
              <p className="text-xl font-black text-gray-800">
                {latestRecord?.weight_kg ?? '—'}
              </p>
              <p className="text-xs text-gray-500">體重 (kg)</p>
            </div>
            <div className="card-warm p-3 text-center">
              <span className="text-lg">📏</span>
              <p className="text-xl font-black text-gray-800">
                {latestRecord?.head_circumference_cm ?? '—'}
              </p>
              <p className="text-xs text-gray-500">頭圍 (cm)</p>
            </div>
          </div>
        )}

        {/* Chart */}
        {activeChild && (
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800">成長曲線</h2>
                <div className="flex bg-orange-50 rounded-xl p-0.5 gap-0.5">
                  {(['height', 'weight'] as ChartTab[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setChartTab(t)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        chartTab === t ? 'bg-orange-500 text-white' : 'text-gray-500'
                      }`}
                    >
                      {t === 'height' ? '身高' : '體重'}
                    </button>
                  ))}
                </div>
              </div>
              <GrowthChart
                records={records}
                ageMonths={ageMonths}
                type={chartTab}
                gender={activeChild.gender ?? undefined}
              />
              <p className="text-xs text-gray-400 text-center mt-2">
                橘色實線為 WHO 50百分位參考值
              </p>
            </div>
          </Card>
        )}

        {/* Records list */}
        {records.length > 0 && (
          <div>
            <h2 className="font-bold text-gray-700 mb-3">測量紀錄</h2>
            <div className="space-y-2">
              {[...records].reverse().slice(0, 5).map(record => (
                <div key={record.id} className="card-warm p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(record.measured_at).toLocaleDateString('zh-TW')}
                    </p>
                    {record.notes && <p className="text-xs text-gray-500 mt-0.5">{record.notes}</p>}
                  </div>
                  <div className="text-right text-sm">
                    {record.height_cm && <p className="text-gray-700">{record.height_cm} cm</p>}
                    {record.weight_kg && <p className="text-gray-500">{record.weight_kg} kg</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {children.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-gray-500 mb-4">還沒有孩子資料</p>
            <Button onClick={() => window.location.href = '/onboarding'}>
              新增孩子資料
            </Button>
          </div>
        )}
      </div>

      {/* Add record modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-gray-800 text-lg">新增測量記錄</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <Input
              label="測量日期"
              type="date"
              value={form.measuredAt}
              onChange={e => setForm(f => ({ ...f, measuredAt: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="身高 (cm)"
                type="number" step="0.1" placeholder="例：75.5"
                value={form.heightCm}
                onChange={e => setForm(f => ({ ...f, heightCm: e.target.value }))}
              />
              <Input
                label="體重 (kg)"
                type="number" step="0.01" placeholder="例：9.8"
                value={form.weightKg}
                onChange={e => setForm(f => ({ ...f, weightKg: e.target.value }))}
              />
            </div>
            <Input
              label="頭圍 (cm)"
              type="number" step="0.1" placeholder="例：44.5"
              value={form.headCm}
              onChange={e => setForm(f => ({ ...f, headCm: e.target.value }))}
            />
            <Input
              label="備注（選填）"
              placeholder="例：健康檢查、自量"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
            <Button size="lg" className="w-full" loading={saving} onClick={handleSave}>
              儲存記錄
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
