'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Clock, Camera, Plus, ChevronDown, ChevronUp, Sparkles,
  Edit3, Trash2, Check, X, UserPlus, Image as ImageIcon,
  TrendingUp, Brain, BookOpen, Loader2, Heart,
} from 'lucide-react'
import { ChildSwitcher } from '@/components/ChildSwitcher'
import { useProfile } from '@/hooks/useProfile'
import { calcAgeMonths } from '@/lib/utils'

// ── Types ──
interface DevelopmentLevel {
  stage: string
  description: string
  nextMilestone: string
  recommendedActivities: string[]
}

interface AnalysisResult {
  strengths: string[]
  suggestions: string[]
  weeklyGoal: string
  cheer: string
  pageSpecificLabel: string
  pageSpecificItems: string[]
  developmentLevel?: DevelopmentLevel
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
  ageMonthsAtPhoto?: number
}

// ── Growth stages with multi-dimension info ──
const GROWTH_STAGES = [
  { key: '0-3m', label: '新生兒期', range: '0–3 個月', emoji: '👶', months: [0, 3], color: '#FFE4E1', borderColor: '#FFB4A2' },
  { key: '3-6m', label: '翻身探索期', range: '3–6 個月', emoji: '🌀', months: [3, 6], color: '#FFF3CD', borderColor: '#FFD93D' },
  { key: '6-12m', label: '爬行成長期', range: '6–12 個月', emoji: '🐾', months: [6, 12], color: '#D1ECF1', borderColor: '#6ECFED' },
  { key: '1-2y', label: '學步語言爆發期', range: '1–2 歲', emoji: '🚶', months: [12, 24], color: '#D4EDDA', borderColor: '#71C285' },
  { key: '2-4y', label: '自主探索期', range: '2–4 歲', emoji: '🔍', months: [24, 48], color: '#E2D9F3', borderColor: '#A78BDA' },
  { key: '4-6y', label: '社交學習期', range: '4–6 歲', emoji: '🎓', months: [48, 72], color: '#D6EAF8', borderColor: '#5DADE2' },
  { key: '6y+', label: '學齡成長期', range: '6 歲以上', emoji: '📚', months: [72, 999], color: '#FADBD8', borderColor: '#EC7063' },
]

// Each stage has growth, psychology, education dimensions
const STAGE_INFO: Record<string, {
  milestone: string
  growth: { title: string; items: string[] }
  psychology: { title: string; items: string[] }
  education: { title: string; items: string[] }
  tips: string[]
}> = {
  '0-3m': {
    milestone: '追視、社交性微笑、頭部支撐',
    growth: {
      title: '生長發育',
      items: ['身長每月增加 3-4 cm', '體重每月增加 0.7-1 kg', '頭圍每月增加 1-2 cm', '反射動作為主（抓握、吸吮、莫洛反射）'],
    },
    psychology: {
      title: '心理發展',
      items: ['建立基本信任感和依附關係', '6 週左右出現社交性微笑', '能辨認主要照顧者的聲音', '哭泣是主要溝通方式'],
    },
    education: {
      title: '認知啟蒙',
      items: ['追視移動物體（1-2 月）', '對聲音有驚嚇和轉頭反應', '開始用手探索口腔', '能分辨明暗和簡單圖形'],
    },
    tips: ['建立規律哺餵和睡眠', '觀察追視和社交性微笑', '大量肌膚接觸和輕聲說話'],
  },
  '3-6m': {
    milestone: '翻身、抓握、發出聲音回應',
    growth: {
      title: '生長發育',
      items: ['身長每月增加 2 cm', '體重每月增加 0.5-0.6 kg', '開始翻身（腹→背約 4 月，背→腹約 5-6 月）', '雙手撐胸俯臥，頭部穩定'],
    },
    psychology: {
      title: '心理發展',
      items: ['開始區分熟人和陌生人', '出現焦慮分離的早期信號', '笑聲更頻繁，情緒表達更豐富', '對鏡中自己感到好奇'],
    },
    education: {
      title: '認知啟蒙',
      items: ['伸手主動抓取物品', '雙手換物、搖晃玩具', '開始理解因果關係（按鈕→聲音）', '發出咿呀聲回應對話'],
    },
    tips: ['鼓勵趴趴練習強化頸部', '創造豐富的視聽刺激', '開始準備副食品'],
  },
  '6-12m': {
    milestone: '爬行、扶站、理解簡單詞彙',
    growth: {
      title: '生長發育',
      items: ['獨立坐穩（6-8 月）', '四肢交替爬行（8-10 月）', '扶站並開始巡走', '拇指食指精細捏取'],
    },
    psychology: {
      title: '心理發展',
      items: ['分離焦慮高峰期（8-10 月）', '開始發展「物體恆存」概念', '能讀懂簡單的表情和語調', '對陌生人有明顯警覺'],
    },
    education: {
      title: '認知啟蒙',
      items: ['理解「不行」和簡單指令', '開始模仿動作和聲音', '能用手指指向想要的東西', '說出「媽」「爸」等第一個詞'],
    },
    tips: ['提供安全爬行空間', '引入多種副食品', '玩物體永恆性遊戲'],
  },
  '1-2y': {
    milestone: '獨立行走、說單詞、自主進食',
    growth: {
      title: '生長發育',
      items: ['獨立行走（12-15 月）', '跑步但常跌倒（約 18 月）', '上下樓梯扶欄', '疊積木 3-6 塊，用湯匙進食'],
    },
    psychology: {
      title: '心理發展',
      items: ['自我意識萌芽，開始說「不要」', '情緒波動大，需要大量同理', '開始理解所有權（「我的」）', '安全依附讓探索更自信'],
    },
    education: {
      title: '認知發展',
      items: ['詞彙量從 10 個爆發到 200+ 個', '開始組合兩個詞（「媽媽抱」）', '能指認身體部位和常見物品', '開始假裝遊戲（餵娃娃吃飯）'],
    },
    tips: ['大量說話豐富詞彙', '允許探索設定安全界線', '建立固定生活作息'],
  },
  '2-4y': {
    milestone: '說短句、如廁訓練、角色扮演',
    growth: {
      title: '生長發育',
      items: ['雙腳跳躍離地', '騎三輪車', '用剪刀剪紙', '畫垂直線、圓形'],
    },
    psychology: {
      title: '心理發展',
      items: ['進入「第一個叛逆期」，追求自主', '開始理解他人有不同感受', '想像力爆發，可能怕黑怕怪物', '友誼概念萌芽，但以平行遊戲為主'],
    },
    education: {
      title: '認知發展',
      items: ['能說完整句子、講簡單故事', '認識顏色、形狀、數字 1-10', '問「為什麼」的階段', '注意力可持續 5-10 分鐘'],
    },
    tips: ['給予選擇機會培養自主感', '情緒同理重於行為糾正', '豐富的社交互動'],
  },
  '4-6y': {
    milestone: '書寫啟蒙、社交合作、獨立思考',
    growth: {
      title: '生長發育',
      items: ['單腳跳、跳繩學習', '騎兩輪自行車（輔助輪）', '正確三指握筆', '完成 20-50 片拼圖'],
    },
    psychology: {
      title: '心理發展',
      items: ['能辨識和命名多種情緒', '開始發展同理心和同情心', '有明確的好朋友和社交偏好', '理解規則並開始遵守'],
    },
    education: {
      title: '認知發展',
      items: ['仿寫自己名字、認識注音', '邏輯思考萌芽（分類、排序）', '能專注 15-20 分鐘', '開始理解時間概念（昨天、明天）'],
    },
    tips: ['培養閱讀和邏輯思考', '支持興趣發展', '建立解決問題的自信心'],
  },
  '6y+': {
    milestone: '自主學習、團隊合作、情緒管理',
    growth: {
      title: '生長發育',
      items: ['運動技能專項發展', '身體協調性接近成人', '青春期前生長加速', '精細動作達成人水平'],
    },
    psychology: {
      title: '心理發展',
      items: ['自尊心和自我認同形成', '同儕關係比家庭更重要', '能自我調節情緒', '開始發展道德判斷能力'],
    },
    education: {
      title: '認知發展',
      items: ['抽象思維能力發展', '閱讀理解和寫作能力', '解決問題的策略性思考', '時間管理和計劃能力'],
    },
    tips: ['支持學業與課外平衡', '培養閱讀習慣', '尊重個體發展節奏'],
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

function calcAgeAtPhoto(birthDate: string, photoTimestamp: number): number {
  const birthTime = new Date(birthDate).getTime()
  const ageMs = photoTimestamp - birthTime
  return Math.max(0, Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.44)))
}

function formatAgeMonths(months: number): string {
  if (months < 12) return `${months} 個月`
  const y = Math.floor(months / 12)
  const m = months % 12
  return m === 0 ? `${y} 歲` : `${y} 歲 ${m} 個月`
}

async function analyzePhotoForTimeline(imageBase64: string): Promise<AnalysisResult | null> {
  try {
    const res = await fetch('/api/analyze-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, analysisType: 'growth' }),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.success || !data.result) return null
    const r = data.result
    return {
      strengths: r.positives ?? [],
      suggestions: r.suggestions ?? [],
      weeklyGoal: r.weeklyGoal ?? '',
      cheer: r.encouragement ?? '',
      pageSpecificLabel: r.analysis?.label ?? '',
      pageSpecificItems: r.analysis?.items ?? [],
      developmentLevel: r.developmentLevel,
    }
  } catch {
    return null
  }
}

export default function TimelineClient() {
  const { activeChild, activeChildId, children } = useProfile()

  const [records, setRecords] = useState<TimelineRecord[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [expandedStage, setExpandedStage] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState('')
  const [editMilestone, setEditMilestone] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null)
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set())

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ps_growth_timeline')
      if (saved) setRecords(JSON.parse(saved))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  // Auto-expand current stage when activeChild loads
  useEffect(() => {
    if (activeChild?.birth_date && expandedStage === null) {
      const months = calcAgeMonths(activeChild.birth_date)
      setExpandedStage(getStageForMonths(months))
    }
  }, [activeChild?.birth_date, expandedStage])

  // Filter records for active child
  const childRecords = useMemo(() => {
    if (!activeChildId) return records
    return records.filter(r => !r.childId || r.childId === activeChildId)
  }, [records, activeChildId])

  // Group records by growth stage — wait for birth_date before classifying
  const stageGroups = useMemo(() => {
    const groups: Record<string, TimelineRecord[]> = {}
    GROWTH_STAGES.forEach(s => { groups[s.key] = [] })

    const birthDate = activeChild?.birth_date
    if (!birthDate || childRecords.length === 0) return groups

    childRecords.forEach(r => {
      const ageMonths = calcAgeAtPhoto(birthDate, r.sortDate)
      const stageKey = getStageForMonths(ageMonths)
      if (groups[stageKey]) {
        groups[stageKey].push({ ...r, ageMonthsAtPhoto: ageMonths })
      }
    })

    Object.values(groups).forEach(arr => arr.sort((a, b) => a.sortDate - b.sortDate))
    return groups
  }, [childRecords, activeChild?.birth_date])

  const currentAgeMonths = activeChild?.birth_date ? calcAgeMonths(activeChild.birth_date) : null
  const currentStageKey = currentAgeMonths !== null ? getStageForMonths(currentAgeMonths) : null

  const saveRecords = useCallback((updated: TimelineRecord[]) => {
    setRecords(updated)
    try { localStorage.setItem('ps_growth_timeline', JSON.stringify(updated)) } catch { /* ignore */ }
  }, [])

  function handleDelete(id: string) {
    if (!confirm('確定要刪除這張照片嗎？')) return
    saveRecords(records.filter(r => r.id !== id))
  }

  function handleSaveEdit(id: string) {
    saveRecords(records.map(r => r.id === id ? { ...r, note: editNote, milestone: editMilestone } : r))
    setEditingId(null)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadProgress({ current: 0, total: files.length })

    const newRecords: TimelineRecord[] = []
    for (let i = 0; i < files.length; i++) {
      setUploadProgress({ current: i + 1, total: files.length })
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

    // Save immediately so photos show up in correct stage
    const updated = [...records, ...newRecords].sort((a, b) => a.sortDate - b.sortDate)
    saveRecords(updated)
    setUploading(false)
    setUploadProgress(null)
    e.target.value = ''

    // Auto-expand the first photo's stage
    if (newRecords.length > 0 && activeChild?.birth_date) {
      const ageMonths = calcAgeAtPhoto(activeChild.birth_date, newRecords[0].sortDate)
      setExpandedStage(getStageForMonths(ageMonths))
    }

    // Background AI analysis for each photo
    for (const rec of newRecords) {
      setAnalyzingIds(prev => new Set(prev).add(rec.id))
      analyzePhotoForTimeline(rec.thumbnail).then(aiResult => {
        if (aiResult) {
          setRecords(prev => {
            const next = prev.map(r => r.id === rec.id ? { ...r, aiResult } : r)
            try { localStorage.setItem('ps_growth_timeline', JSON.stringify(next)) } catch { /* */ }
            return next
          })
        }
        setAnalyzingIds(prev => {
          const next = new Set(prev)
          next.delete(rec.id)
          return next
        })
      })
      // Throttle: 1.5s between requests
      if (newRecords.indexOf(rec) < newRecords.length - 1) {
        await new Promise(r => setTimeout(r, 1500))
      }
    }
  }

  const totalPhotos = childRecords.length
  const stagesWithPhotos = GROWTH_STAGES.filter(s => stageGroups[s.key].length > 0).length

  // Loading state: profile not yet loaded
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAF5' }}>
        <Loader2 size={24} className="animate-spin text-[#7B9EBD]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-6" style={{ background: 'linear-gradient(160deg, #A8C5DA 0%, #7B9EBD 45%, #5E85A3 100%)' }}>
        <div className="flex items-center gap-2 text-white mb-3">
          <Clock size={22} strokeWidth={2.5} />
          <h1 className="text-xl font-black">成長時間軸</h1>
        </div>
        <p className="text-white/70 text-xs mb-3">
          上傳照片，自動依照拍攝時間歸類到寶貝的成長階段
        </p>
        {activeChild && (
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-white/20 rounded-xl px-3 py-1.5 text-white text-xs">
              {activeChild.nickname} · {currentAgeMonths !== null ? formatAgeMonths(currentAgeMonths) : ''}
            </div>
            {totalPhotos > 0 && (
              <div className="bg-white/20 rounded-xl px-3 py-1.5 text-white text-xs">
                {totalPhotos} 張照片 · {stagesWithPhotos} 個階段
              </div>
            )}
          </div>
        )}
      </div>

      <ChildSwitcher />

      {/* Upload progress */}
      {uploading && uploadProgress && (
        <div className="px-5 py-2" style={{ background: '#EBF4FF' }}>
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin text-[#7B9EBD]" />
            <p className="text-xs font-semibold" style={{ color: '#5E85A3' }}>
              正在處理照片 {uploadProgress.current}/{uploadProgress.total}...
            </p>
          </div>
        </div>
      )}

      <div className="px-5 py-4">
        {/* No child selected */}
        {!activeChild && children.length === 0 && (
          <div className="rounded-2xl p-6 text-center" style={{ background: '#F5F5F0', border: '1.5px dashed #D1D5DB' }}>
            <p className="text-sm text-gray-500 mb-2">請先新增孩子資料</p>
            <a href="/settings" className="text-sm font-semibold" style={{ color: '#5E85A3' }}>前往設定</a>
          </div>
        )}

        {/* Waiting for profile to load */}
        {!activeChild && children.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-[#7B9EBD]" />
            <span className="text-xs text-gray-500 ml-2">載入中...</span>
          </div>
        )}

        {activeChild && (
          <>
            {/* Encouragement banner */}
            {totalPhotos === 0 && (
              <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: 'linear-gradient(135deg, #EBF4FF, #F0F8FF)', border: '2px dashed #7B9EBD' }}>
                <div className="text-4xl mb-2">📸</div>
                <p className="text-sm font-bold mb-1" style={{ color: '#5E85A3' }}>
                  開始記錄 {activeChild.nickname} 的成長旅程！
                </p>
                <p className="text-xs mb-3" style={{ color: '#8E9EAD' }}>
                  上傳照片後，系統會根據照片拍攝時間計算寶貝當時的月齡，<br />
                  自動歸類到對應的發展階段，並用 AI 分析每張照片
                </p>
                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
                  <Camera size={16} /> 上傳照片
                </label>
              </div>
            )}

            {totalPhotos > 0 && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-gray-500">{activeChild.nickname} 的成長故事</p>
                <label className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                  style={{ background: '#EBF4FF', color: '#5E85A3' }}>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
                  <Plus size={14} /> 新增照片
                </label>
              </div>
            )}

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ background: '#E8E0D5' }} />

              {GROWTH_STAGES.map(stage => {
                const photos = stageGroups[stage.key]
                const isCurrent = stage.key === currentStageKey
                const isExpanded = expandedStage === stage.key
                const hasPhotos = photos.length > 0
                const info = STAGE_INFO[stage.key]

                return (
                  <div key={stage.key} className="relative pl-10 pb-5">
                    {/* Dot */}
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

                    {/* Header */}
                    <button onClick={() => setExpandedStage(isExpanded ? null : stage.key)} className="w-full text-left">
                      <div className="rounded-2xl p-3 transition-all" style={{
                        background: hasPhotos ? stage.color : '#F5F5F0',
                        border: `1.5px solid ${isCurrent ? '#7B9EBD' : hasPhotos ? stage.borderColor : '#E8E0D5'}`,
                      }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-gray-800">{stage.emoji} {stage.label}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#7B9EBD] text-white font-semibold">目前</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{stage.range}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasPhotos && <span className="text-xs text-gray-500">{photos.length} 張</span>}
                            {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded */}
                    {isExpanded && (
                      <div className="mt-2 space-y-2">
                        {/* Multi-dimension development info */}
                        {info && (
                          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E8E0D5' }}>
                            {/* Milestone */}
                            <div className="px-3 py-2" style={{ background: stage.color }}>
                              <p className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
                                <Sparkles size={11} style={{ color: '#7B9EBD' }} /> 關鍵里程碑
                              </p>
                              <p className="text-xs text-gray-800 font-medium mt-0.5">{info.milestone}</p>
                            </div>

                            {/* Three dimensions */}
                            <div className="divide-y" style={{ borderColor: '#E8E0D5' }}>
                              {[
                                { icon: TrendingUp, data: info.growth, color: '#7B9EBD' },
                                { icon: Brain, data: info.psychology, color: '#9B8BB4' },
                                { icon: BookOpen, data: info.education, color: '#71C285' },
                              ].map(({ icon: Icon, data, color }) => (
                                <div key={data.title} className="px-3 py-2 bg-white">
                                  <p className="text-[11px] font-semibold flex items-center gap-1 mb-1" style={{ color }}>
                                    <Icon size={11} /> {data.title}
                                  </p>
                                  {data.items.map((item, i) => (
                                    <p key={i} className="text-[11px] text-gray-600 leading-relaxed">• {item}</p>
                                  ))}
                                </div>
                              ))}
                            </div>

                            {/* Tips */}
                            <div className="px-3 py-2 bg-white" style={{ borderTop: '1px solid #E8E0D5' }}>
                              <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1 mb-1">
                                <Heart size={11} style={{ color: '#D4956A' }} /> 爸媽可以做
                              </p>
                              {info.tips.map((tip, i) => (
                                <p key={i} className="text-[11px] text-gray-600">
                                  <span className="font-bold" style={{ color: '#7B9EBD' }}>{['①', '②', '③'][i]}</span> {tip}
                                </p>
                              ))}
                            </div>

                            {/* AI summary if photos exist */}
                            {hasPhotos && (() => {
                              const withAI = photos.filter(p => p.aiResult)
                              if (withAI.length === 0) return null
                              const latest = withAI[withAI.length - 1]
                              const dev = latest.aiResult?.developmentLevel
                              return (
                                <div className="px-3 py-2" style={{ background: 'linear-gradient(135deg, #EBF4FF, #F0F8FF)', borderTop: '1px solid #E8E0D5' }}>
                                  <p className="text-[11px] font-semibold flex items-center gap-1 mb-1" style={{ color: '#5E85A3' }}>
                                    <Sparkles size={11} /> AI 照片分析總結（{withAI.length} 張）
                                  </p>
                                  {dev && (
                                    <p className="text-xs text-gray-700 mb-1">
                                      <span className="font-semibold" style={{ color: '#5E85A3' }}>{dev.stage}</span> — {dev.description}
                                    </p>
                                  )}
                                  {latest.aiResult?.strengths?.slice(0, 2).map((s, i) => (
                                    <p key={i} className="text-[11px] text-gray-600">• {s}</p>
                                  ))}
                                  {dev?.nextMilestone && (
                                    <p className="text-[11px] text-gray-500 mt-1">下一個里程碑：{dev.nextMilestone}</p>
                                  )}
                                </div>
                              )
                            })()}
                          </div>
                        )}

                        {/* Photos */}
                        {hasPhotos ? (
                          <div className="space-y-2">
                            {photos.map(photo => {
                              const isAnalyzing = analyzingIds.has(photo.id)
                              return (
                                <div key={photo.id} className="rounded-xl overflow-hidden bg-white" style={{ border: '1px solid #E8E0D5' }}>
                                  <div className="flex gap-3 p-3">
                                    <img src={photo.thumbnail} alt="成長照片" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <div>
                                          <p className="text-xs text-gray-500">{photo.date}</p>
                                          {photo.ageMonthsAtPhoto !== undefined && (
                                            <p className="text-[10px]" style={{ color: '#7B9EBD' }}>
                                              {activeChild.nickname} {formatAgeMonths(photo.ageMonthsAtPhoto)} 時
                                            </p>
                                          )}
                                        </div>
                                        <div className="flex gap-1">
                                          <button onClick={() => { setEditingId(photo.id); setEditNote(photo.note ?? ''); setEditMilestone(photo.milestone ?? '') }} className="p-1 text-gray-400 hover:text-[#7B9EBD]">
                                            <Edit3 size={13} />
                                          </button>
                                          <button onClick={() => handleDelete(photo.id)} className="p-1 text-gray-400 hover:text-red-400">
                                            <Trash2 size={13} />
                                          </button>
                                        </div>
                                      </div>

                                      {photo.note && <p className="text-xs text-gray-700 mb-1">{photo.note}</p>}
                                      {photo.milestone && (
                                        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold mb-1" style={{ background: '#EBF4FF', color: '#5E85A3' }}>
                                          {photo.milestone}
                                        </span>
                                      )}

                                      {/* AI analyzing indicator */}
                                      {isAnalyzing && (
                                        <div className="flex items-center gap-1 mt-1">
                                          <Loader2 size={11} className="animate-spin" style={{ color: '#7B9EBD' }} />
                                          <span className="text-[10px]" style={{ color: '#8E9EAD' }}>AI 分析中...</span>
                                        </div>
                                      )}

                                      {/* AI result */}
                                      {!isAnalyzing && photo.aiResult && (
                                        <div className="mt-1 space-y-0.5">
                                          {photo.aiResult.developmentLevel && (
                                            <p className="text-[11px]" style={{ color: '#5E85A3' }}>
                                              {photo.aiResult.developmentLevel.stage} · {photo.aiResult.developmentLevel.description?.slice(0, 40)}
                                            </p>
                                          )}
                                          {photo.aiResult.strengths?.slice(0, 1).map((s, i) => (
                                            <p key={i} className="text-[10px] text-gray-500 truncate">{s}</p>
                                          ))}
                                        </div>
                                      )}

                                      {/* Multi-child */}
                                      {photo.detectedChildren && photo.detectedChildren.count > 1 && (
                                        <div className="mt-1 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px]" style={{ background: '#FFF3CD', color: '#856404' }}>
                                          <UserPlus size={11} />
                                          偵測到 {photo.detectedChildren.count} 位孩子
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Edit */}
                                  {editingId === photo.id && (
                                    <div className="px-3 pb-3 space-y-2" style={{ borderTop: '1px solid #E8E0D5' }}>
                                      <div className="pt-2">
                                        <label className="text-[11px] font-semibold text-gray-500 block mb-1">備註</label>
                                        <input value={editNote} onChange={e => setEditNote(e.target.value)} placeholder="記錄這一刻的故事..."
                                          className="w-full px-3 py-2 rounded-xl border text-xs outline-none" style={{ borderColor: '#C5D8E8' }} />
                                      </div>
                                      <div>
                                        <label className="text-[11px] font-semibold text-gray-500 block mb-1">里程碑標記</label>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                          {['第一次翻身', '第一次坐穩', '第一次爬', '第一次站', '第一次走路', '第一次說話', '第一顆牙', '第一次吃副食品'].map(m => (
                                            <button key={m} onClick={() => setEditMilestone(editMilestone === m ? '' : m)}
                                              className="px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all"
                                              style={{ background: editMilestone === m ? '#7B9EBD' : '#EBF4FF', color: editMilestone === m ? 'white' : '#5E85A3' }}>
                                              {m}
                                            </button>
                                          ))}
                                        </div>
                                        <input value={editMilestone} onChange={e => setEditMilestone(e.target.value)} placeholder="或自訂里程碑..."
                                          className="w-full px-3 py-2 rounded-xl border text-xs outline-none" style={{ borderColor: '#C5D8E8' }} />
                                      </div>
                                      <div className="flex gap-2">
                                        <button onClick={() => handleSaveEdit(photo.id)}
                                          className="flex-1 py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1" style={{ background: '#7B9EBD' }}>
                                          <Check size={13} /> 儲存
                                        </button>
                                        <button onClick={() => setEditingId(null)}
                                          className="flex-1 py-2 rounded-xl text-xs font-semibold text-gray-500 bg-gray-100 flex items-center justify-center gap-1">
                                          <X size={13} /> 取消
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="rounded-xl p-4 text-center" style={{ background: '#F5F5F0', border: '1.5px dashed #D1D5DB' }}>
                            <ImageIcon size={24} className="mx-auto mb-1 text-gray-300" />
                            <p className="text-xs text-gray-400 mb-2">這個階段還沒有照片</p>
                            <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                              style={{ background: '#EBF4FF', color: '#5E85A3' }}>
                              <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
                              <Camera size={13} /> 上傳照片
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
              <div className="mt-4 mb-8 rounded-2xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
                <p className="text-white text-sm font-semibold mb-1">
                  {activeChild.nickname} 的成長故事正在書寫中
                </p>
                <p className="text-white/70 text-xs">
                  每張照片都是一段珍貴的回憶，繼續記錄吧！
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
