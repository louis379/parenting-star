'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { TrendingUp, Plus, Ruler, Weight, BookOpen, ClipboardList, Brain, Moon, Info, Camera, FileText, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { formatAge, calcAgeMonths } from '@/lib/utils'
import type { Child, GrowthRecord } from '@/types/database'

const GrowthChart = dynamic(
  () => import('@/components/charts/GrowthChart').then(m => ({ default: m.GrowthChart })),
  {
    loading: () => <div className="h-48 flex items-center justify-center text-sm" style={{ color: '#8E9EAD' }}>載入圖表中…</div>,
    ssr: false,
  }
)

interface Props {
  children: Child[]
  initialRecords: GrowthRecord[]
}

type MainTab = 'knowledge' | 'records'
type ChartTab = 'height' | 'weight'

// WHO 里程碑資料
const motorMilestones = [
  { age: '0–3 月', skill: '抬頭（俯臥）', type: '大動作', evidence: 'A' },
  { age: '4–6 月', skill: '翻身、雙手撐胸', type: '大動作', evidence: 'A' },
  { age: '6–9 月', skill: '獨立坐穩、爬行', type: '大動作', evidence: 'A' },
  { age: '9–12 月', skill: '扶站、扶走', type: '大動作', evidence: 'A' },
  { age: '12–15 月', skill: '獨立行走', type: '大動作', evidence: 'A' },
  { age: '18–24 月', skill: '跑步、上下階梯（扶扶手）', type: '大動作', evidence: 'A' },
  { age: '2–3 歲', skill: '跳躍、單腳站立', type: '大動作', evidence: 'A' },
]

const fineMilestones = [
  { age: '0–3 月', skill: '反射性握拳', type: '精細動作', evidence: 'A' },
  { age: '4–6 月', skill: '伸手抓物、雙手換物', type: '精細動作', evidence: 'A' },
  { age: '9–12 月', skill: '拇指食指捏取小物', type: '精細動作', evidence: 'A' },
  { age: '12–18 月', skill: '疊積木 2 塊、塗鴉', type: '精細動作', evidence: 'A' },
  { age: '2 歲', skill: '疊積木 6 塊、畫垂直線', type: '精細動作', evidence: 'A' },
  { age: '3 歲', skill: '剪紙、畫圓形、仿寫', type: '精細動作', evidence: 'A' },
]

const sleepGuide = [
  { age: '0–3 月', total: '14–17 小時', note: '多次短睡，無固定作息' },
  { age: '4–11 月', total: '12–15 小時', note: '午睡 2–3 次，夜間逐漸延長' },
  { age: '1–2 歲', total: '11–14 小時', note: '午睡 1 次，夜間 10–11 小時' },
  { age: '3–5 歲', total: '10–13 小時', note: '午睡漸少，維持規律作息' },
  { age: '6–12 歲', total: '9–11 小時', note: '固定就寢時間最重要' },
]

const whoStandards = [
  { age: '出生', height: '49.9 / 49.1', weight: '3.3 / 3.2' },
  { age: '3 月', height: '61.4 / 59.8', weight: '6.0 / 5.5' },
  { age: '6 月', height: '67.6 / 65.7', weight: '7.9 / 7.3' },
  { age: '9 月', height: '72.3 / 70.1', weight: '9.0 / 8.2' },
  { age: '12 月', height: '75.7 / 74.0', weight: '9.6 / 8.9' },
  { age: '18 月', height: '82.3 / 80.7', weight: '10.9 / 10.2' },
  { age: '24 月', height: '87.8 / 86.4', weight: '12.2 / 11.5' },
  { age: '3 歲', height: '96.1 / 95.1', weight: '14.3 / 13.9' },
  { age: '4 歲', height: '103.3 / 102.7', weight: '16.3 / 16.1' },
  { age: '5 歲', height: '110.0 / 109.4', weight: '18.3 / 18.2' },
]

export default function GrowthClient({ children, initialRecords }: Props) {
  const [mainTab, setMainTab] = useState<MainTab>('knowledge')
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
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg, #A8C5DA 0%, #7B9EBD 45%, #5E85A3 100%)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white">
            <TrendingUp size={22} strokeWidth={2.5} />
            <h1 className="text-xl font-black">生長發展</h1>
          </div>
          {mainTab === 'records' && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-white"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <Plus size={16} />新增
            </button>
          )}
        </div>

        {/* Child selector */}
        {children.length > 0 && mainTab === 'records' && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
            {children.map((child, i) => (
              <button
                key={child.id}
                onClick={() => setActiveChildIdx(i)}
                className="shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: i === activeChildIdx ? 'white' : 'rgba(255,255,255,0.2)',
                  color: i === activeChildIdx ? '#5E85A3' : 'white',
                }}
              >
                {child.nickname}
              </button>
            ))}
          </div>
        )}

        {/* Main tab switcher */}
        <div
          className="flex rounded-2xl p-1"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <button
            onClick={() => setMainTab('knowledge')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: mainTab === 'knowledge' ? 'white' : 'transparent',
              color: mainTab === 'knowledge' ? '#5E85A3' : 'rgba(255,255,255,0.85)',
            }}
          >
            <BookOpen size={15} />
            專業知識
          </button>
          <button
            onClick={() => setMainTab('records')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: mainTab === 'records' ? 'white' : 'transparent',
              color: mainTab === 'records' ? '#5E85A3' : 'rgba(255,255,255,0.85)',
            }}
          >
            <ClipboardList size={15} />
            我的紀錄
          </button>
        </div>
      </div>

      {/* === 專業知識 Tab === */}
      {mainTab === 'knowledge' && (
        <div className="px-5 py-5 space-y-5">
          {/* WHO 標準表 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Ruler size={16} style={{ color: '#7B9EBD' }} />
              <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>WHO 生長標準</h2>
              <span className="evidence-badge">Cochrane A</span>
            </div>
            <div
              className="rounded-2xl overflow-hidden border"
              style={{ borderColor: '#C5D8E8' }}
            >
              <div
                className="grid grid-cols-3 px-4 py-2 text-xs font-bold"
                style={{ background: '#EBF4FF', color: '#5E85A3' }}
              >
                <span>月齡/年齡</span>
                <span className="text-center">身高 男/女(cm)</span>
                <span className="text-right">體重 男/女(kg)</span>
              </div>
              {whoStandards.map((row, i) => (
                <div
                  key={row.age}
                  className="grid grid-cols-3 px-4 py-2.5 text-xs border-t"
                  style={{
                    background: i % 2 === 0 ? 'white' : '#F8FBFF',
                    borderColor: '#E8F0F8',
                    color: '#2D3436',
                  }}
                >
                  <span className="font-medium">{row.age}</span>
                  <span className="text-center" style={{ color: '#5E85A3' }}>{row.height}</span>
                  <span className="text-right" style={{ color: '#6B7B8D' }}>{row.weight}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: '#8E9EAD' }}>
              * 數值為 WHO 第 50 百分位，男/女格式
            </p>
          </section>

          {/* 大動作里程碑 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Brain size={16} style={{ color: '#7B9EBD' }} />
              <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>大動作發展里程碑</h2>
              <span className="evidence-badge">Cochrane A</span>
            </div>
            <div className="space-y-2">
              {motorMilestones.map((m) => (
                <div
                  key={m.age + m.skill}
                  className="flex items-start gap-3 p-3 rounded-xl border"
                  style={{ background: 'white', borderColor: '#E8E0D5' }}
                >
                  <div
                    className="shrink-0 px-2 py-0.5 rounded-lg text-xs font-bold mt-0.5"
                    style={{ background: '#EBF4FF', color: '#5E85A3' }}
                  >
                    {m.age}
                  </div>
                  <span className="text-sm" style={{ color: '#2D3436' }}>{m.skill}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 精細動作 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: '#7B9EBD', fontSize: 16 }}>✋</span>
              <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>精細動作發展</h2>
              <span className="evidence-badge">Cochrane A</span>
            </div>
            <div className="space-y-2">
              {fineMilestones.map((m) => (
                <div
                  key={m.age + m.skill}
                  className="flex items-start gap-3 p-3 rounded-xl border"
                  style={{ background: 'white', borderColor: '#E8E0D5' }}
                >
                  <div
                    className="shrink-0 px-2 py-0.5 rounded-lg text-xs font-bold mt-0.5"
                    style={{ background: '#F5E6C8', color: '#B07548' }}
                  >
                    {m.age}
                  </div>
                  <span className="text-sm" style={{ color: '#2D3436' }}>{m.skill}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 睡眠建議 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Moon size={16} style={{ color: '#7B9EBD' }} />
              <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>睡眠時數建議</h2>
              <span className="evidence-badge">NSF 實證</span>
            </div>
            <div className="space-y-2">
              {sleepGuide.map((s) => (
                <div
                  key={s.age}
                  className="p-3 rounded-xl border"
                  style={{ background: 'white', borderColor: '#E8E0D5' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold" style={{ color: '#2D3436' }}>{s.age}</span>
                    <span
                      className="text-sm font-bold px-2 py-0.5 rounded-lg"
                      style={{ background: '#EBF4FF', color: '#5E85A3' }}
                    >
                      {s.total}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: '#6B7B8D' }}>{s.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 來源說明 */}
          <div
            className="flex items-start gap-2 p-4 rounded-2xl border"
            style={{ background: '#EBF4FF', borderColor: '#C5D8E8' }}
          >
            <Info size={16} className="shrink-0 mt-0.5" style={{ color: '#5E85A3' }} />
            <p className="text-xs leading-relaxed" style={{ color: '#5E85A3' }}>
              本頁資料來源：WHO Child Growth Standards（2006）、Cochrane 系統性回顧、
              美國國家睡眠基金會（NSF）。建議僅供參考，個別差異因人而異，請諮詢專業醫師。
            </p>
          </div>
        </div>
      )}

      {/* === 我的紀錄 Tab === */}
      {mainTab === 'records' && (
        <div className="px-5 py-5 space-y-5">
          {children.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📊</p>
              <p className="font-semibold mb-2" style={{ color: '#2D3436' }}>還沒有孩子資料</p>
              <p className="text-sm mb-6" style={{ color: '#6B7B8D' }}>先完成設定，才能追蹤生長紀錄</p>
              <button
                onClick={() => window.location.href = '/onboarding'}
                className="px-6 py-3 rounded-2xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}
              >
                新增孩子資料
              </button>
            </div>
          ) : (
            <>
              {/* Latest stats */}
              <div className="grid grid-cols-3 gap-3">
                <div
                  className="p-3 text-center rounded-2xl border"
                  style={{ background: 'white', borderColor: '#C5D8E8' }}
                >
                  <Ruler size={18} className="mx-auto mb-1" style={{ color: '#7B9EBD' }} />
                  <p className="text-xl font-black" style={{ color: '#2D3436' }}>
                    {latestRecord?.height_cm ?? '—'}
                  </p>
                  <p className="text-xs" style={{ color: '#6B7B8D' }}>身高 (cm)</p>
                </div>
                <div
                  className="p-3 text-center rounded-2xl border"
                  style={{ background: 'white', borderColor: '#C5D8E8' }}
                >
                  <Weight size={18} className="mx-auto mb-1" style={{ color: '#7B9EBD' }} />
                  <p className="text-xl font-black" style={{ color: '#2D3436' }}>
                    {latestRecord?.weight_kg ?? '—'}
                  </p>
                  <p className="text-xs" style={{ color: '#6B7B8D' }}>體重 (kg)</p>
                </div>
                <div
                  className="p-3 text-center rounded-2xl border"
                  style={{ background: 'white', borderColor: '#C5D8E8' }}
                >
                  <span className="text-lg block mb-1">📏</span>
                  <p className="text-xl font-black" style={{ color: '#2D3436' }}>
                    {latestRecord?.head_circumference_cm ?? '—'}
                  </p>
                  <p className="text-xs" style={{ color: '#6B7B8D' }}>頭圍 (cm)</p>
                </div>
              </div>

              {/* Chart */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{ background: 'white', borderColor: '#C5D8E8' }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold" style={{ color: '#2D3436' }}>WHO 成長曲線</h2>
                    <div
                      className="flex rounded-xl p-0.5 gap-0.5"
                      style={{ background: '#EBF4FF' }}
                    >
                      {(['height', 'weight'] as ChartTab[]).map(t => (
                        <button
                          key={t}
                          onClick={() => setChartTab(t)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                          style={{
                            background: chartTab === t ? '#7B9EBD' : 'transparent',
                            color: chartTab === t ? 'white' : '#5E85A3',
                          }}
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
                  <p className="text-xs text-center mt-2" style={{ color: '#8E9EAD' }}>
                    藍色線為 WHO 第 50 百分位參考值
                  </p>
                </div>
              </div>

              {/* AI analysis prompt */}
              <div
                className="p-4 rounded-2xl border"
                style={{ background: '#F5F8FF', borderColor: '#C5D8E8' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} style={{ color: '#7B9EBD' }} />
                  <h3 className="font-bold text-sm" style={{ color: '#2D3436' }}>AI 智慧分析</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-opacity active:opacity-70"
                    style={{ background: 'white', borderColor: '#C5D8E8', color: '#5E85A3' }}
                  >
                    <Camera size={18} style={{ color: '#7B9EBD' }} />
                    上傳照片/影片
                  </button>
                  <button
                    className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-opacity active:opacity-70"
                    style={{ background: 'white', borderColor: '#C5D8E8', color: '#5E85A3' }}
                  >
                    <FileText size={18} style={{ color: '#7B9EBD' }} />
                    輸入症狀描述
                  </button>
                </div>
                <p className="text-xs mt-2 text-center" style={{ color: '#8E9EAD' }}>
                  AI 將分析孩子動作發展，給出個性化建議
                </p>
              </div>

              {/* Records list */}
              {records.length > 0 && (
                <div>
                  <h2 className="font-bold mb-3" style={{ color: '#2D3436' }}>測量紀錄</h2>
                  <div className="space-y-2">
                    {[...records].reverse().slice(0, 5).map(record => (
                      <div
                        key={record.id}
                        className="p-3 flex items-center justify-between rounded-xl border"
                        style={{ background: 'white', borderColor: '#E8E0D5' }}
                      >
                        <div>
                          <p className="text-sm font-semibold" style={{ color: '#2D3436' }}>
                            {new Date(record.measured_at).toLocaleDateString('zh-TW')}
                          </p>
                          {record.notes && (
                            <p className="text-xs mt-0.5" style={{ color: '#6B7B8D' }}>{record.notes}</p>
                          )}
                        </div>
                        <div className="text-right text-sm">
                          {record.height_cm && <p style={{ color: '#5E85A3' }}>{record.height_cm} cm</p>}
                          {record.weight_kg && <p style={{ color: '#6B7B8D' }}>{record.weight_kg} kg</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Add record modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg" style={{ color: '#2D3436' }}>新增測量記錄</h2>
              <button onClick={() => setShowForm(false)} className="text-xl" style={{ color: '#8E9EAD' }}>✕</button>
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
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 rounded-2xl font-bold text-white text-base disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}
            >
              {saving ? '儲存中…' : '儲存記錄'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
