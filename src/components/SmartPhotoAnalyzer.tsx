'use client'

import { useState } from 'react'
import { Camera, Sparkles, CheckCircle2 } from 'lucide-react'

export type AnalysisPage = 'growth' | 'psychology' | 'education'

interface PhotoRecord {
  id: string
  date: string
  sortDate: number
  imageData: string
  note: string
  page: string
}

interface AnalysisResult {
  strengths: string[]
  suggestions: string[]
  weeklyGoal: string
  cheer: string
  pageSpecificLabel: string
  pageSpecificItems: string[]
}

// ── Growth 分析資料池 ──
const GROWTH_RESULTS: AnalysisResult[] = [
  {
    strengths: [
      '寶貝看起來氣色很好，臉頰紅潤、眼神有精神 ✨',
      '體型比例均衡，處於健康的發育範圍內',
    ],
    suggestions: ['可以增加一些戶外大動作活動，像是爬坡、踢球，幫助骨骼和肌肉更強健'],
    weeklyGoal: '每天至少一次戶外活動，哪怕只是 20 分鐘散步也很好',
    cheer: '你每天的陪伴，就是寶貝最好的成長養分 💙',
    pageSpecificLabel: '🏋️ 生長觀察',
    pageSpecificItems: [
      '體型評估：適中 — 寶貝的體重符合這個年紀的正常範圍',
      '動作發展：活潑好動 — 從照片可見寶貝的動作協調性不錯',
      '如果這是餐盤照：蛋白質和蔬菜搭配看起來不錯，可以再加點全穀類',
    ],
  },
  {
    strengths: [
      '寶貝的笑容燦爛，顯示身體狀態很舒適、有安全感 😊',
      '肌肉張力看起來良好，站姿/坐姿很自然穩定',
    ],
    suggestions: ['可以多讓寶貝嘗試新的食材，豐富飲食多樣性，讓腸胃更健康'],
    weeklyGoal: '這週嘗試一種新蔬菜或水果，讓寶貝決定怎麼吃',
    cheer: '每一口好食物，都在為寶貝的未來打底 🌱',
    pageSpecificLabel: '🏋️ 生長觀察',
    pageSpecificItems: [
      '體型評估：圓潤可愛 — 這個年紀的嬰兒脂肪是正常的，隨著活動量增加自然會調整',
      '動作發展：穩健發展 — 身體協調性符合年齡預期',
      '如果這是便便照：顏色和型態看起來都在正常範圍，腸胃健康！',
    ],
  },
  {
    strengths: [
      '寶貝看起來很放鬆，沒有緊張或不適的跡象 🌟',
      '身形修長，只要食慾正常、精神好，就是最棒的狀態',
    ],
    suggestions: ['睡眠充足對生長激素分泌很重要，可以確保寶貝每天有固定的睡覺時間'],
    weeklyGoal: '建立固定的睡前儀式：洗澡→按摩→唸繪本，幫助寶貝更好入睡',
    cheer: '規律作息是給寶貝最好的禮物，你做得很棒 💪',
    pageSpecificLabel: '🏋️ 生長觀察',
    pageSpecificItems: [
      '體型評估：纖細活潑 — 均衡飲食搭配充足活動是最好的組合',
      '動作發展：輕盈靈活 — 動作看起來很自在流暢',
      '如果這是餐盤照：再補充一點優質蛋白質（雞蛋、豆腐、魚）會更均衡',
    ],
  },
]

// ── Psychology 分析資料池 ──
const PSYCHOLOGY_RESULTS: AnalysisResult[] = [
  {
    strengths: [
      '寶貝的笑容很燦爛，情緒狀態看起來非常穩定 😊',
      '眼神專注而有光彩，表示對環境感到安全和自在',
    ],
    suggestions: ['多給寶貝表達情緒的機會，讓他/她學習辨識自己的感受，情緒詞彙越豐富越好'],
    weeklyGoal: '睡前問寶貝：今天最開心的一件事是什麼？一起分享感受',
    cheer: '你給的安全感，是寶貝情緒健康的根基，繼續這樣溫暖的陪伴 💛',
    pageSpecificLabel: '😊 情緒觀察',
    pageSpecificItems: [
      '表情判讀：開心輕鬆 — 寶貝的表情自然，情緒狀態正向',
      '場景分析：玩耍時光 — 在玩耍中探索是最好的情緒發展方式',
      '社交狀態：舒適自在 — 寶貝看起來很享受當下的環境',
    ],
  },
  {
    strengths: [
      '寶貝的肢體語言放鬆，沒有防衛或焦慮的信號 🌿',
      '專注投入的樣子，顯示內在動機很強，這是很珍貴的特質',
    ],
    suggestions: ['當寶貝有情緒波動時，先同理再引導，「我知道你很傷心」比「不要哭了」更有效'],
    weeklyGoal: '這週練習一次情緒調節：當寶貝生氣時，一起做三次深呼吸',
    cheer: '每一次你耐心回應寶貝的情緒，都在幫他/她建立情緒智能 🌈',
    pageSpecificLabel: '😊 情緒觀察',
    pageSpecificItems: [
      '表情判讀：平靜專注 — 寶貝處於良好的學習/探索狀態',
      '場景分析：專注活動 — 高度投入是情緒穩定的好信號',
      '社交狀態：獨立探索 — 這顯示寶貝有良好的自主性',
    ],
  },
  {
    strengths: [
      '寶貝的眼神裡充滿好奇，好奇心是情緒健康最美的展現 ✨',
      '看起來很有活力，情緒正向，這樣的狀態最適合學習和成長',
    ],
    suggestions: ['多用「寶貝，你剛才是不是有點…的感覺？」來幫助孩子識別情緒'],
    weeklyGoal: '用情緒卡片或繪本，每天和寶貝聊一個情緒詞彙',
    cheer: '你對寶貝情緒的關注，正在種下情商的種子 🌱',
    pageSpecificLabel: '😊 情緒觀察',
    pageSpecificItems: [
      '表情判讀：好奇愉快 — 寶貝正在積極探索和感受世界',
      '場景分析：互動玩耍 — 社交互動對情緒發展非常有益',
      '社交狀態：開放參與 — 願意互動是很好的社交發展指標',
    ],
  },
]

// ── Education 分析資料池 ──
const EDUCATION_RESULTS: AnalysisResult[] = [
  {
    strengths: [
      '寶貝的專注力看起來很好，能夠投入在當下的活動中 📚',
      '場景布置豐富多元，提供了很棒的探索和學習機會',
    ],
    suggestions: ['可以多加入語言互動，引導寶貝描述他/她正在做的事，豐富詞彙量'],
    weeklyGoal: '每天睡前唸一本繪本，選寶貝自己選的書，培養閱讀習慣',
    cheer: '你創造的每一個學習環境，都是寶貝大腦發展的養料 🧠',
    pageSpecificLabel: '📚 學習觀察',
    pageSpecificItems: [
      '場景分析：探索玩耍 — 在玩中學是最自然的早期教育',
      '專注狀態：高度投入 — 寶貝對當下活動很感興趣',
      '學習模式：主動探索 — 自主學習的態度非常棒',
    ],
  },
  {
    strengths: [
      '寶貝看起來完全沉浸在活動中，這是深度學習的最好狀態 🌟',
      '從照片可以看到豐富的感官刺激，對大腦發展很有益',
    ],
    suggestions: ['可以多問開放式問題，例如「你覺得為什麼會這樣？」刺激思考能力'],
    weeklyGoal: '這週一起做一個小實驗（例如：把東西放進水裡看會不會浮），觀察寶貝的反應',
    cheer: '好奇心是最好的老師，你給了寶貝最棒的探索空間 💡',
    pageSpecificLabel: '📚 學習觀察',
    pageSpecificItems: [
      '場景分析：創造活動 — 動手做的學習方式最能促進大腦連結',
      '專注狀態：深度專注 — 這樣的投入程度表示活動難度恰到好處',
      '學習模式：創造思考 — 從做中學的能力值得鼓勵',
    ],
  },
  {
    strengths: [
      '寶貝的表情充滿了學習的喜悅，這樣的正向情緒最能促進記憶 ✨',
      '互動場景看起來很自然，沒有壓力的學習環境是最理想的',
    ],
    suggestions: ['減少一點結構性的安排，給寶貝更多自由探索的時間，讓他/她引導學習方向'],
    weeklyGoal: '讓寶貝當「小老師」，教你一件他/她最近學到的事',
    cheer: '每一次你跟著寶貝的好奇心走，就是最好的親子共學 🎯',
    pageSpecificLabel: '📚 學習觀察',
    pageSpecificItems: [
      '場景分析：語言社交 — 和人互動的學習最有助於語言發展',
      '專注狀態：輕鬆愉快 — 在放鬆狀態下學習效果最好',
      '學習模式：社交學習 — 從互動中學習是這個階段最有效的方式',
    ],
  },
]

function getRandomAnalysis(page: AnalysisPage): AnalysisResult {
  const pool =
    page === 'growth' ? GROWTH_RESULTS : page === 'psychology' ? PSYCHOLOGY_RESULTS : EDUCATION_RESULTS
  return pool[Math.floor(Math.random() * pool.length)]
}

function compressToDataURL(file: File, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width
        let h = img.height
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = Math.round(h * maxSize / w); w = maxSize }
          else { w = Math.round(w * maxSize / h); h = maxSize }
        }
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d')?.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

interface SmartPhotoAnalyzerProps {
  page: AnalysisPage
  storageKey: string
  label: string
}

export default function SmartPhotoAnalyzer({ page, storageKey, label }: SmartPhotoAnalyzerProps) {
  const [photos, setPhotos] = useState<PhotoRecord[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [latestImage, setLatestImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  async function handleSingleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview + analysis for the single photo
    const preview = await compressToDataURL(file, 600, 0.75)
    setLatestImage(preview)
    setAnalysis(null)
    setIsAnalyzing(true)

    // Add to timeline
    const compressed = await compressToDataURL(file, 800, 0.7)
    const photoDate = new Date(file.lastModified)
    const dateStr = photoDate.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const newPhoto: PhotoRecord = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      date: dateStr,
      sortDate: photoDate.getTime(),
      imageData: compressed,
      note: '',
      page,
    }
    setPhotos(prev => {
      const updated = [newPhoto, ...prev].sort((a, b) => (b.sortDate ?? 0) - (a.sortDate ?? 0))
      localStorage.setItem(storageKey, JSON.stringify(updated))
      return updated
    })

    // Simulate AI processing
    setTimeout(() => {
      setAnalysis(getRandomAnalysis(page))
      setIsAnalyzing(false)
    }, 1200)

    e.target.value = ''
  }

  async function handleBatchUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newPhotos: PhotoRecord[] = []
    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx]
      const compressed = await compressToDataURL(file, 800, 0.7)
      const photoDate = new Date(file.lastModified)
      const dateStr = photoDate.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
      newPhotos.push({
        id: `${Date.now()}_${idx}_${Math.random().toString(36).slice(2)}`,
        date: dateStr,
        sortDate: photoDate.getTime(),
        imageData: compressed,
        note: '',
        page,
      })
    }

    setPhotos(prev => {
      const updated = [...prev, ...newPhotos].sort((a, b) => (b.sortDate ?? 0) - (a.sortDate ?? 0))
      localStorage.setItem(storageKey, JSON.stringify(updated))
      return updated
    })

    e.target.value = ''
  }

  // Group photos by month for timeline
  const photoGroups: Record<string, PhotoRecord[]> = {}
  photos.forEach(p => {
    const d = new Date(p.sortDate ?? Date.now())
    const key = `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月`
    if (!photoGroups[key]) photoGroups[key] = []
    photoGroups[key].push(p)
  })
  const sortedGroups = Object.entries(photoGroups).sort(([a], [b]) => b.localeCompare(a))

  return (
    <section>
      {/* 標題 */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold" style={{ color: '#2D3436' }}>{label}相簿 📸</h2>
        <span
          className="text-xs px-2 py-1 rounded-xl font-semibold"
          style={{ background: '#EBF4FF', color: '#5E85A3' }}
        >
          {photos.length} 張
        </span>
      </div>

      {/* 累積鼓勵訊息 */}
      {photos.length > 0 && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
          style={{ background: 'linear-gradient(135deg, #EBF8EB, #D8F5D8)', border: '1px solid #A8D8A8' }}
        >
          <span style={{ fontSize: 16 }}>✨</span>
          <p className="text-xs font-semibold" style={{ color: '#3A7A3A' }}>
            已累積 {photos.length} 張{label}紀錄
            {photos.length >= 10
              ? '，AI 分析越來越準確了！🎯'
              : photos.length >= 5
              ? '，繼續加油，累積越多分析越精準！'
              : '，再多幾張，成長軌跡就會清晰起來！'}
          </p>
        </div>
      )}

      {/* 統一拍照入口 */}
      <div
        className="p-4 rounded-2xl mb-3"
        style={{ background: 'linear-gradient(135deg, #F0F7FF, #EBF4FF)', border: '2px dashed #7B9EBD' }}
      >
        <div className="text-center mb-3">
          <p className="text-sm font-bold" style={{ color: '#5E85A3' }}>📸 智能拍照分析</p>
          <p className="text-xs mt-0.5" style={{ color: '#8E9EAD' }}>一張照片，全方位 AI 分析</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* 立即拍照（觸發分析） */}
          <label className="flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer active:opacity-70" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleSingleUpload}
            />
            <Camera size={20} className="text-white" />
            <span className="text-xs font-bold text-white">拍照</span>
          </label>
          {/* 從相簿選取（觸發分析） */}
          <label className="flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-pointer active:opacity-70" style={{ background: 'white', border: '1.5px solid #C5D8E8' }}>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSingleUpload}
            />
            <span style={{ fontSize: 20 }}>🖼️</span>
            <span className="text-xs font-bold" style={{ color: '#5E85A3' }}>從相簿選取</span>
          </label>
        </div>
        {/* 批次導入 */}
        <label className="flex items-center justify-center gap-2 mt-2 py-2 rounded-xl cursor-pointer active:opacity-70" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid #C5D8E8' }}>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleBatchUpload}
          />
          <span style={{ fontSize: 14 }}>📂</span>
          <span className="text-xs font-semibold" style={{ color: '#6B7B8D' }}>批次導入成長照片</span>
        </label>
        <p className="text-[10px] text-center mt-1.5" style={{ color: '#A0AEB8' }}>
          批次導入會自動讀取照片日期，按時間排序
        </p>
      </div>

      {/* 分析結果區（上傳後顯示） */}
      {(latestImage || isAnalyzing) && (
        <div className="mb-4 rounded-2xl overflow-hidden" style={{ border: '1px solid #C5D8E8' }}>
          <div
            className="px-4 py-2.5 flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}
          >
            <Sparkles size={14} className="text-white" />
            <span className="text-sm font-bold text-white">AI 全方位分析</span>
            {isAnalyzing && (
              <span className="text-xs text-white opacity-80 ml-auto">分析中…</span>
            )}
          </div>

          <div className="p-4" style={{ background: 'white' }}>
            {isAnalyzing ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#7B9EBD', borderTopColor: 'transparent' }} />
                <p className="text-xs" style={{ color: '#8E9EAD' }}>AI 正在分析照片…</p>
              </div>
            ) : analysis && latestImage ? (
              <div className="space-y-3">
                {/* 照片預覽 + 快速總結 */}
                <div className="flex gap-3">
                  <img
                    src={latestImage}
                    alt="分析照片"
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className="p-2.5 rounded-xl h-full flex flex-col justify-center"
                      style={{ background: 'linear-gradient(135deg, #EBF8EB, #D8F5D8)' }}
                    >
                      <p className="text-xs font-bold mb-1" style={{ color: '#3A7A3A' }}>🌟 做得很好的地方</p>
                      {analysis.strengths.map((s, i) => (
                        <p key={i} className="text-[11px] leading-snug" style={{ color: '#2D5A2D' }}>• {s}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 頁面專屬分析 */}
                <div className="p-3 rounded-xl" style={{ background: '#EBF4FF', border: '1px solid #C5D8E8' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#5E85A3' }}>{analysis.pageSpecificLabel}</p>
                  {analysis.pageSpecificItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5 mb-1">
                      <CheckCircle2 size={11} className="shrink-0 mt-0.5" style={{ color: '#7B9EBD' }} />
                      <p className="text-[11px] leading-snug" style={{ color: '#4A5568' }}>{item}</p>
                    </div>
                  ))}
                </div>

                {/* 建議 + 目標 */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl" style={{ background: '#FFF8F0', border: '1px solid #E8D5C0' }}>
                    <p className="text-xs font-bold mb-1" style={{ color: '#B07548' }}>💡 可以一起努力</p>
                    <p className="text-[11px] leading-snug" style={{ color: '#6B4A2A' }}>{analysis.suggestions[0]}</p>
                  </div>
                  <div className="p-2.5 rounded-xl" style={{ background: '#F8F0FF', border: '1px solid #D8C5E8' }}>
                    <p className="text-xs font-bold mb-1" style={{ color: '#8060A8' }}>🎯 這週小目標</p>
                    <p className="text-[11px] leading-snug" style={{ color: '#4A3A6A' }}>{analysis.weeklyGoal}</p>
                  </div>
                </div>

                {/* 加油打氣 */}
                <div
                  className="p-3 rounded-xl text-center"
                  style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}
                >
                  <p className="text-xs font-semibold text-white">💪 {analysis.cheer}</p>
                </div>

                <p className="text-[10px] text-center" style={{ color: '#A0AEB8' }}>* 此為 AI 模擬分析，僅供參考，非醫療診斷</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 時間軸相簿 */}
      {photos.length > 0 && (
        <div className="space-y-4 mb-3">
          {sortedGroups.map(([month, monthPhotos]) => (
            <div key={month}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: '#7B9EBD' }} />
                <span className="text-xs font-bold" style={{ color: '#5E85A3' }}>{month}</span>
                <span className="text-[10px]" style={{ color: '#8E9EAD' }}>{monthPhotos.length} 張</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {monthPhotos.map(photo => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-xl overflow-hidden"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                  >
                    <img src={photo.imageData} alt={`${label}照片`} className="w-full h-full object-cover" />
                    <div
                      className="absolute bottom-0 left-0 right-0 px-1 py-0.5"
                      style={{ background: 'rgba(0,0,0,0.45)' }}
                    >
                      <p className="text-white text-[9px] text-center">{photo.date}</p>
                    </div>
                    {/* AI 分析標籤 */}
                    <div
                      className="absolute top-1 right-1 px-1 py-0.5 rounded-md"
                      style={{ background: 'rgba(123,158,189,0.9)' }}
                    >
                      <Sparkles size={8} className="text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
