'use client'

import { useState, useRef, useMemo } from 'react'
import {
  Clock, Camera, Plus, ChevronDown, ChevronUp, Sparkles,
  Edit3, Trash2, Check, X, UserPlus, Image as ImageIcon,
} from 'lucide-react'
import { ChildSwitcher } from '@/components/ChildSwitcher'
import { useProfile } from '@/hooks/useProfile'
import { calcAgeMonths } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

// ── Types ──
interface AnalysisResult {
  strengths: string[]
  suggestions: string[]
  weeklyGoal: string
  cheer: string
  pageSpecificLabel: string
  pageSpecificItems: string[]
  developmentLevel?: {
    stage: string
    description: string
    nextMilestone: string
    recommendedActivities: string[]
  }
}

interface TimelineRecord {
  id: string
  date: string
  sortDate: number
  type: 'photo' | 'video'
  thumbnail: string
  aiResult: AnalysisResult | null
  childId?: string
  detectedChildren?: { count: number; description: string }
  note?: string
  milestone?: string
}

// ── Growth stages ──
const GROWTH_STAGES = [
  { key: '0-3m', label: '新生兒期', range: '0–3 個月', emoji: '👶', months: [0, 3], color: '#FFE4E1', borderColor: '#FFB4A2' },
  { key: '3-6m', label: '翻身探索期', range: '3–6 個月', emoji: '🌀', months: [3, 6], color: '#FFF3CD', borderColor: '#FFD93D' },
  { key: '6-12m', label: '爬行成長期', range: '6–12 個月', emoji: '🐾', months: [6, 12], color: '#D1ECF1', borderColor: '#6ECFED' },
  { key: '1-2y', label: '學步語言爆發期', range: '1–2 歲', emoji: '🚶', months: [12, 24], color: '#D4EDDA', borderColor: '#71C285' },
  { key: '2-4y', label: '自主探索期', range: '2–4 歲', emoji: '🔍', months: [24, 48], color: '#E2D9F3', borderColor: '#A78BDA' },
  { key: '4-6y', label: '社交學習期', range: '4–6 歲', emoji: '🎓', months: [48, 72], color: '#D6EAF8', borderColor: '#5DADE2' },
  { key: '6y+', label: '學齡成長期', range: '6 歲以上', emoji: '📚', months: [72, 999], color: '#FADBD8', borderColor: '#EC7063' },
]

const STAGE_SUMMARIES: Record<string, { tips: string[]; milestone: string }> = {
  '0-3m': {
    tips: ['建立規律哺餵和睡眠', '觀察追視和社交性微笑', '大量肌膚接觸和輕聲說話'],
    milestone: '追視、社交性微笑、頭部支撐',
  },
  '3-6m': {
    tips: ['鼓勵趴趴練習強化頸部', '創造豐富的視聽刺激', '開始準備副食品'],
    milestone: '翻身、抓握、發出聲音回應',
  },
  '6-12m': {
    tips: ['提供安全爬行空間', '引入多種副食品', '玩物體永恆性遊戲'],
    milestone: '爬行、扶站、理解簡單詞彙',
  },
  '1-2y': {
    tips: ['大量說話豐富詞彙', '允許探索設定安全界線', '建立固定生活作息'],
    milestone: '獨立行走、說單詞、自主進食',
  },
  '2-4y': {
    tips: ['給予選擇機會培養自主感', '情緒同理重於行為糾正', '豐富的社交互動'],
    milestone: '說短句、如廁訓練、角色扮演',
  },
  '4-6y': {
    tips: ['培養閱讀和邏輯思考', '支持興趣發展', '建立解決問題的自信心'],
    milestone: '書寫啟蒙、社交合作、獨立思考',
  },
  '6y+': {
    tips: ['支持學業與課外平衡', '培養閱讀習慣', '尊重個體發展節奏'],
    milestone: '自主學習、團隊合作、情緒管理',
  },
}

function getStageForMonths(months: number): string {
  for (const stage of GROWTH_STAGES) {
    if (months >= stage.months[0] && months < stage.months[1]) return stage.key
  }
  return '6y+'
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxSize = 800
        let w = img.width, h = img.height
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = Math.round(h * maxSize / w); w = maxSize }
          else { w = Math.round(w * maxSize / h); h = maxSize }
        }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d')?.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

export default function TimelineClient() {
  const { activeChild, activeChildId, children } = useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [records, setRecords] = useState<TimelineRecord[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('ps_growth_timeline')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  const [expandedStage, setExpandedStage] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState('')
  const [editMilestone, setEditMilestone] = useState('')
  const [showSummary, setShowSummary] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStage, setUploadStage] = useState<string | null>(null)

  // Filter records for active child
  const childRecords = useMemo(() => {
    if (!activeChildId) return records
    return records.filter(r => !r.childId || r.childId === activeChildId)
  }, [records, activeChildId])

  // Group records by growth stage based on child's birth_date
  const stageGroups = useMemo(() => {
    const groups: Record<string, TimelineRecord[]> = {}
    GROWTH_STAGES.forEach(s => { groups[s.key] = [] })

    if (!activeChild?.birth_date) {
      // No birth date — group by raw date
      childRecords.forEach(r => {
        groups['0-3m'].push(r)
      })
      return groups
    }

    const birthTime = new Date(activeChild.birth_date).getTime()
    childRecords.forEach(r => {
      const photoTime = r.sortDate
      const ageAtPhotoMs = photoTime - birthTime
      const ageAtPhotoMonths = Math.max(0, Math.floor(ageAtPhotoMs / (1000 * 60 * 60 * 24 * 30.44)))
      const stageKey = getStageForMonths(ageAtPhotoMonths)
      if (groups[stageKey]) {
        groups[stageKey].push(r)
      }
    })

    // Sort each group by date
    Object.values(groups).forEach(arr => arr.sort((a, b) => a.sortDate - b.sortDate))
    return groups
  }, [childRecords, activeChild?.birth_date])

  // Current child age in months
  const currentAgeMonths = activeChild?.birth_date ? calcAgeMonths(activeChild.birth_date) : null
  const currentStageKey = currentAgeMonths !== null ? getStageForMonths(currentAgeMonths) : null

  // Auto-expand current stage on first render
  if (expandedStage === null && currentStageKey) {
    // Use a microtask to avoid setState during render
    queueMicrotask(() => setExpandedStage(currentStageKey))
  }

  function saveRecords(updated: TimelineRecord[]) {
    setRecords(updated)
    try {
      localStorage.setItem('ps_growth_timeline', JSON.stringify(updated))
    } catch { /* ignore */ }
  }

  function handleDelete(id: string) {
    if (!confirm('確定要刪除這張照片嗎？')) return
    saveRecords(records.filter(r => r.id !== id))
  }

  function handleSaveEdit(id: string) {
    const updated = records.map(r =>
      r.id === id ? { ...r, note: editNote, milestone: editMilestone } : r
    )
    saveRecords(updated)
    setEditingId(null)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, targetStage?: string) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)

    const newRecords: TimelineRecord[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const compressed = await compressImage(file)
      const photoDate = new Date(file.lastModified)
      const dateStr = photoDate.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
      const id = `tl_${Date.now()}_${i}_${Math.random().toString(36).slice(2)}`

      newRecords.push({
        id,
        date: dateStr,
        sortDate: photoDate.getTime(),
        type: 'photo',
        thumbnail: compressed,
        aiResult: null,
        childId: activeChildId ?? undefined,
      })
    }

    const updated = [...records, ...newRecords].sort((a, b) => a.sortDate - b.sortDate)
    saveRecords(updated)
    setUploading(false)
    setUploadStage(null)
    e.target.value = ''

    // Expand the stage of the first uploaded photo
    if (newRecords.length > 0 && activeChild?.birth_date) {
      const birthTime = new Date(activeChild.birth_date).getTime()
      const ageMs = newRecords[0].sortDate - birthTime
      const ageMonths = Math.max(0, Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.44)))
      setExpandedStage(getStageForMonths(ageMonths))
    }
  }

  const totalPhotos = childRecords.length
  const stagesWithPhotos = GROWTH_STAGES.filter(s => stageGroups[s.key].length > 0).length

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(160deg, #A8C5DA 0%, #7B9EBD 45%, #5E85A3 100%)' }}
      >
        <div className="flex items-center gap-2 text-white mb-3">
          <Clock size={22} strokeWidth={2.5} />
          <h1 className="text-xl font-black">成長時間軸</h1>
        </div>
        <p className="text-white/70 text-xs mb-3">
          用照片記錄每個珍貴時刻，看見寶貝一步步成長的軌跡
        </p>
        {activeChild && (
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl px-3 py-1.5 text-white text-xs">
              {activeChild.nickname} · {totalPhotos} 張照片 · {stagesWithPhotos} 個階段
            </div>
          </div>
        )}
      </div>

      <ChildSwitcher />

      <div className="px-5 py-4">
        {/* Encouragement banner */}
        {totalPhotos === 0 && (
          <div
            className="rounded-2xl p-4 mb-4 text-center"
            style={{ background: 'linear-gradient(135deg, #EBF4FF, #F0F8FF)', border: '2px dashed #7B9EBD' }}
          >
            <div className="text-4xl mb-2">📸</div>
            <p className="text-sm font-bold mb-1" style={{ color: '#5E85A3' }}>
              開始記錄 {activeChild?.nickname ?? '寶貝'} 的成長旅程！
            </p>
            <p className="text-xs mb-3" style={{ color: '#8E9EAD' }}>
              上傳照片，系統會自動依照寶貝的年齡分類到對應的成長階段
            </p>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handleUpload(e)}
              />
              <Camera size={16} />
              上傳第一張照片
            </label>
          </div>
        )}

        {totalPhotos > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-500">
              {activeChild?.nickname} 的成長故事 — 共 {totalPhotos} 張照片
            </p>
            <label className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
              style={{ background: '#EBF4FF', color: '#5E85A3' }}>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handleUpload(e)}
              />
              <Plus size={14} />
              新增照片
            </label>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-0.5"
            style={{ background: '#E8E0D5' }}
          />

          {GROWTH_STAGES.map((stage, idx) => {
            const photos = stageGroups[stage.key]
            const isCurrent = stage.key === currentStageKey
            const isExpanded = expandedStage === stage.key
            const hasPhotos = photos.length > 0
            const summary = STAGE_SUMMARIES[stage.key]
            const isShowingSummary = showSummary === stage.key

            return (
              <div key={stage.key} className="relative pl-10 pb-6">
                {/* Timeline dot */}
                <div
                  className="absolute left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px]"
                  style={{
                    background: hasPhotos ? stage.color : 'white',
                    borderColor: isCurrent ? '#7B9EBD' : hasPhotos ? stage.borderColor : '#D1D5DB',
                    boxShadow: isCurrent ? '0 0 0 3px rgba(123,158,189,0.3)' : undefined,
                  }}
                >
                  {hasPhotos ? stage.emoji : ''}
                </div>

                {/* Stage header */}
                <button
                  onClick={() => setExpandedStage(isExpanded ? null : stage.key)}
                  className="w-full text-left"
                >
                  <div
                    className="rounded-2xl p-3 transition-all"
                    style={{
                      background: hasPhotos ? stage.color : '#F5F5F0',
                      border: `1.5px solid ${isCurrent ? '#7B9EBD' : hasPhotos ? stage.borderColor : '#E8E0D5'}`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-gray-800">
                            {stage.emoji} {stage.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#7B9EBD] text-white font-semibold">
                              目前
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{stage.range}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasPhotos && (
                          <span className="text-xs text-gray-500">{photos.length} 張</span>
                        )}
                        {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-2 space-y-2">
                    {/* Stage milestone info */}
                    {summary && (
                      <div className="rounded-xl p-3" style={{ background: '#FAFAF5', border: '1px solid #E8E0D5' }}>
                        <button
                          onClick={() => setShowSummary(isShowingSummary ? null : stage.key)}
                          className="w-full flex items-center justify-between"
                        >
                          <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                            <Sparkles size={12} style={{ color: '#7B9EBD' }} />
                            階段成長總結
                          </span>
                          {isShowingSummary ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                        </button>
                        {isShowingSummary && (
                          <div className="mt-2 space-y-2">
                            <div>
                              <p className="text-[11px] font-semibold text-gray-500 mb-1">關鍵里程碑</p>
                              <p className="text-xs text-gray-700">{summary.milestone}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-gray-500 mb-1">這個階段可以關注</p>
                              {summary.tips.map((tip, i) => (
                                <p key={i} className="text-xs text-gray-600 mb-0.5">
                                  <span className="font-bold" style={{ color: '#7B9EBD' }}>{['①', '②', '③'][i]}</span> {tip}
                                </p>
                              ))}
                            </div>
                            {/* AI summary from photos in this stage */}
                            {hasPhotos && (
                              <div className="mt-2 pt-2" style={{ borderTop: '1px solid #E8E0D5' }}>
                                <p className="text-[11px] font-semibold text-gray-500 mb-1">AI 照片總結</p>
                                {(() => {
                                  const withAI = photos.filter(p => p.aiResult)
                                  if (withAI.length === 0) return <p className="text-xs text-gray-400">尚無 AI 分析資料</p>
                                  const latest = withAI[withAI.length - 1]
                                  const dev = latest.aiResult?.developmentLevel
                                  return (
                                    <div className="space-y-1">
                                      {dev && (
                                        <p className="text-xs text-gray-700">
                                          發展階段：<span className="font-semibold" style={{ color: '#5E85A3' }}>{dev.stage}</span> — {dev.description}
                                        </p>
                                      )}
                                      {latest.aiResult?.strengths?.slice(0, 2).map((s, i) => (
                                        <p key={i} className="text-xs text-gray-600">• {s}</p>
                                      ))}
                                      {dev?.nextMilestone && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          下一個里程碑：{dev.nextMilestone}
                                        </p>
                                      )}
                                    </div>
                                  )
                                })()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Photos grid */}
                    {hasPhotos ? (
                      <div className="space-y-2">
                        {photos.map(photo => (
                          <div key={photo.id} className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid #E8E0D5' }}>
                            <div className="flex gap-3 p-3">
                              <img
                                src={photo.thumbnail}
                                alt="成長照片"
                                className="w-20 h-20 rounded-lg object-cover shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-xs text-gray-500">{photo.date}</p>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => {
                                        setEditingId(photo.id)
                                        setEditNote(photo.note ?? '')
                                        setEditMilestone(photo.milestone ?? '')
                                      }}
                                      className="p-1 text-gray-400 hover:text-[#7B9EBD]"
                                    >
                                      <Edit3 size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(photo.id)}
                                      className="p-1 text-gray-400 hover:text-red-400"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>

                                {/* Note & milestone display */}
                                {photo.note && (
                                  <p className="text-xs text-gray-700 mb-1">{photo.note}</p>
                                )}
                                {photo.milestone && (
                                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold mb-1"
                                    style={{ background: '#EBF4FF', color: '#5E85A3' }}>
                                    {photo.milestone}
                                  </span>
                                )}

                                {/* AI result snippet */}
                                {photo.aiResult?.developmentLevel && (
                                  <p className="text-[11px] text-gray-500">
                                    {photo.aiResult.developmentLevel.stage} · {photo.aiResult.developmentLevel.description?.slice(0, 30)}...
                                  </p>
                                )}

                                {/* Multi-child detection */}
                                {photo.detectedChildren && photo.detectedChildren.count > 1 && (
                                  <div className="mt-1 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px]"
                                    style={{ background: '#FFF3CD', color: '#856404' }}>
                                    <UserPlus size={11} />
                                    偵測到 {photo.detectedChildren.count} 位孩子 — {photo.detectedChildren.description}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Inline editing */}
                            {editingId === photo.id && (
                              <div className="px-3 pb-3 space-y-2" style={{ borderTop: '1px solid #E8E0D5' }}>
                                <div className="pt-2">
                                  <label className="text-[11px] font-semibold text-gray-500 block mb-1">備註</label>
                                  <input
                                    value={editNote}
                                    onChange={e => setEditNote(e.target.value)}
                                    placeholder="記錄這一刻的故事..."
                                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                                    style={{ borderColor: '#C5D8E8' }}
                                  />
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold text-gray-500 block mb-1">里程碑標記</label>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {['第一次翻身', '第一次坐穩', '第一次爬', '第一次站', '第一次走路', '第一次說話', '第一顆牙', '第一次吃副食品'].map(m => (
                                      <button
                                        key={m}
                                        onClick={() => setEditMilestone(editMilestone === m ? '' : m)}
                                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all"
                                        style={{
                                          background: editMilestone === m ? '#7B9EBD' : '#EBF4FF',
                                          color: editMilestone === m ? 'white' : '#5E85A3',
                                        }}
                                      >
                                        {m}
                                      </button>
                                    ))}
                                  </div>
                                  <input
                                    value={editMilestone}
                                    onChange={e => setEditMilestone(e.target.value)}
                                    placeholder="或自訂里程碑..."
                                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                                    style={{ borderColor: '#C5D8E8' }}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSaveEdit(photo.id)}
                                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1"
                                    style={{ background: '#7B9EBD' }}
                                  >
                                    <Check size={13} /> 儲存
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-gray-500 bg-gray-100 flex items-center justify-center gap-1"
                                  >
                                    <X size={13} /> 取消
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="rounded-xl p-4 text-center"
                        style={{ background: '#F5F5F0', border: '1.5px dashed #D1D5DB' }}
                      >
                        <ImageIcon size={24} className="mx-auto mb-1 text-gray-300" />
                        <p className="text-xs text-gray-400 mb-2">
                          這個階段還沒有照片
                        </p>
                        <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                          style={{ background: '#EBF4FF', color: '#5E85A3' }}>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={e => handleUpload(e, stage.key)}
                          />
                          <Camera size={13} />
                          上傳照片
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom encouragement */}
        {totalPhotos > 0 && (
          <div className="mt-4 mb-8 rounded-2xl p-4 text-center"
            style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
            <p className="text-white text-sm font-semibold mb-1">
              {activeChild?.nickname ?? '寶貝'} 的成長故事正在書寫中
            </p>
            <p className="text-white/70 text-xs">
              每張照片都是一段珍貴的回憶，繼續記錄吧！
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
