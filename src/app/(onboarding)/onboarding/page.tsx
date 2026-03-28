'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Baby, Heart, Home, CheckCircle, Camera, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface ChildData {
  nickname: string
  birthDate: string
  gender: string
  birthWeightG: string
  birthHeightCm: string
  gestationalWeeks: string
  allergies: string[]
  healthConditions: string[]
  specialTraits: string[]
}

interface FamilyData {
  familyName: string
  city: string
  district: string
  parentingStyle: string[]
}

const ALLERGY_OPTIONS = ['牛奶', '雞蛋', '花生', '堅果', '海鮮', '小麥', '黃豆', '芝麻']
const HEALTH_OPTIONS = ['早產', '氣喘', '異位性皮膚炎', '先天性心臟病', '罕見疾病']
const TRAIT_OPTIONS = ['易被蚊蟲叮咬', '怕熱', '怕冷', '過敏體質', '活潑好動', '敏感氣質']
const PARENTING_STYLES = ['蒙特梭利', '華德福', '正向教養', '自然教育', '雙語教育', '親子共學']
const CITIES = ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市', '新竹縣市', '宜蘭縣', '其他']

const STEPS = [
  { icon: Baby, title: '孩子的資料', subtitle: '讓我們認識你的寶貝' },
  { icon: Camera, title: '照片初體驗', subtitle: '一張照片，AI 幫你解讀現在的寶貝' },
  { icon: Heart, title: '健康狀況', subtitle: '有助於更準確的推薦' },
  { icon: Home, title: '家庭資訊', subtitle: '個性化你的使用體驗' },
  { icon: CheckCircle, title: '設定完成！', subtitle: '你的育兒智多星已就緒' },
]

// 根據月齡計算發展階段描述
function getAgeStageInfo(birthDate: string): { stage: string; focus: string[] } {
  if (!birthDate) return {
    stage: '寶貝發展期',
    focus: ['觀察日常行為發展', '記錄每天的成長時刻', '持續和寶貝互動溝通'],
  }
  const months = Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  if (months < 3) return {
    stage: '新生兒期（0–3個月）',
    focus: ['建立規律哺餵和睡眠', '觀察追視和社交性微笑', '進行大量肌膚接觸和輕聲說話'],
  }
  if (months < 6) return {
    stage: '翻身探索期（3–6個月）',
    focus: ['鼓勵趴趴練習強化頸部和核心', '創造豐富的視覺和聽覺刺激', '開始準備副食品的心理建設'],
  }
  if (months < 12) return {
    stage: '爬行成長期（6–12個月）',
    focus: ['提供安全的爬行空間', '引入多種副食品擴展味覺', '玩聲音和物體永恆性的遊戲'],
  }
  if (months < 24) return {
    stage: '學步語言爆發期（1–2歲）',
    focus: ['大量說話和命名，豐富詞彙', '允許探索但設定安全界線', '建立固定的生活作息'],
  }
  if (months < 48) return {
    stage: '自主探索期（2–4歲）',
    focus: ['給予選擇機會培養自主感', '情緒同理重於行為糾正', '豐富的遊戲和社交互動'],
  }
  return {
    stage: '社交學習期（4歲以上）',
    focus: ['培養閱讀和邏輯思考習慣', '支持興趣發展不過度安排', '建立解決問題的自信心'],
  }
}

// Mock 照片分析結果
const ONBOARDING_PHOTO_RESULTS = [
  {
    observation: '寶貝看起來精神飽滿、充滿活力！',
    highlights: ['氣色紅潤，健康狀態看起來很好', '表情自然放鬆，情緒狀態穩定'],
  },
  {
    observation: '好可愛的寶貝！從照片感受到滿滿的生命力！',
    highlights: ['笑容燦爛，安全感十足', '眼神好奇，學習動力旺盛'],
  },
  {
    observation: '從照片可以感受到寶貝的活潑和好奇心！',
    highlights: ['肢體動作自然，發展狀態良好', '表情豐富，情緒表達能力好'],
  },
]

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxSize = 600
        let w = img.width, h = img.height
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = Math.round(h * maxSize / w); w = maxSize }
          else { w = Math.round(w * maxSize / h); h = maxSize }
        }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d')?.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [child, setChild] = useState<ChildData>({
    nickname: '', birthDate: '', gender: '', birthWeightG: '',
    birthHeightCm: '', gestationalWeeks: '', allergies: [], healthConditions: [], specialTraits: [],
  })
  const [family, setFamily] = useState<FamilyData>({
    familyName: '', city: '', district: '', parentingStyle: [],
  })

  // Photo step state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [photoResult, setPhotoResult] = useState<typeof ONBOARDING_PHOTO_RESULTS[0] | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  function toggleArr(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const compressed = await compressImage(file)
    setPhotoPreview(compressed)
    setPhotoResult(null)
    setIsAnalyzing(true)
    setTimeout(() => {
      setPhotoResult(ONBOARDING_PHOTO_RESULTS[Math.floor(Math.random() * ONBOARDING_PHOTO_RESULTS.length)])
      setIsAnalyzing(false)
    }, 1500)
    e.target.value = ''
  }

  async function handleFinish() {
    const onboardingData = {
      child: {
        nickname: child.nickname,
        birthDate: child.birthDate,
        gender: child.gender || null,
        birthWeightG: child.birthWeightG ? parseInt(child.birthWeightG) : null,
        birthHeightCm: child.birthHeightCm ? parseFloat(child.birthHeightCm) : null,
        gestationalWeeks: child.gestationalWeeks ? parseInt(child.gestationalWeeks) : null,
        allergies: child.allergies,
        healthConditions: child.healthConditions,
        specialTraits: child.specialTraits,
      },
      family: {
        name: family.familyName || `${child.nickname}的家`,
        city: family.city,
        district: family.district,
        parentingStyle: family.parentingStyle,
      },
      completedAt: new Date().toISOString(),
    }

    // 存 localStorage 備份
    try {
      localStorage.setItem('ps_onboarding', JSON.stringify(onboardingData))
    } catch {
      // localStorage 不可用時靜默忽略
    }

    // 呼叫 API 存入資料庫（失敗仍可繼續，資料已存 localStorage）
    setSaving(true)
    setSaveError('')
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      })
      if (!res.ok) {
        // 不論什麼錯誤，都允許繼續（資料已在 localStorage）
        console.warn('Onboarding API error:', await res.json().catch(() => ({})))
      }
    } catch (e) {
      // 網路錯誤時靜默忽略
      console.warn('Onboarding save failed:', e)
    }
    setSaving(false)
    setStep(4)
  }

  const progress = ((step + 1) / STEPS.length) * 100
  const StepIcon = STEPS[step].icon
  const stageInfo = getAgeStageInfo(child.birthDate)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          {step > 0 && step < 4 && (
            <button onClick={() => setStep(s => s - 1)} className="text-white/80 hover:text-white">
              <ChevronLeft size={24} />
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <StepIcon size={18} className="text-white" />
              <span className="font-bold text-white">{STEPS[step].title}</span>
            </div>
            <p className="text-xs text-white/70">{STEPS[step].subtitle}</p>
          </div>
          <span className="text-xs text-white/60">{step + 1} / {STEPS.length}</span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 max-w-sm mx-auto w-full">

        {/* Step 0: 孩子基本資料 */}
        {step === 0 && (
          <div className="space-y-4">
            <Input
              label="孩子的暱稱 *"
              placeholder="例如：小明、糰子"
              value={child.nickname}
              onChange={e => setChild(c => ({ ...c, nickname: e.target.value }))}
            />
            <Input
              label="出生日期 *"
              type="date"
              value={child.birthDate}
              onChange={e => setChild(c => ({ ...c, birthDate: e.target.value }))}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">性別</label>
              <div className="grid grid-cols-3 gap-2">
                {['男生', '女生', '不透露'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setChild(c => ({ ...c, gender: g }))}
                    className={cn(
                      'h-11 rounded-2xl text-sm font-medium border-2 transition-all',
                      child.gender === g
                        ? 'bg-[#7B9EBD] text-white border-[#7B9EBD]'
                        : 'bg-white text-gray-600 border-[#C5D8E8] hover:border-[#7B9EBD]'
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="出生體重 (g)"
                type="number"
                placeholder="例：3200"
                value={child.birthWeightG}
                onChange={e => setChild(c => ({ ...c, birthWeightG: e.target.value }))}
              />
              <Input
                label="出生身長 (cm)"
                type="number"
                step="0.1"
                placeholder="例：50.5"
                value={child.birthHeightCm}
                onChange={e => setChild(c => ({ ...c, birthHeightCm: e.target.value }))}
              />
            </div>
            <Input
              label="出生週數（早產請填）"
              type="number"
              placeholder="足月為 40 週"
              value={child.gestationalWeeks}
              onChange={e => setChild(c => ({ ...c, gestationalWeeks: e.target.value }))}
            />
            <Button
              size="lg"
              className="w-full mt-4"
              disabled={!child.nickname || !child.birthDate}
              onClick={() => setStep(1)}
            >
              下一步
            </Button>
          </div>
        )}

        {/* Step 1: 照片辨識（新增） */}
        {step === 1 && (
          <div className="space-y-4">
            {/* 發展階段說明 */}
            <div
              className="p-4 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #EBF4FF, #F0F8FF)', border: '1px solid #C5D8E8' }}
            >
              <p className="text-xs font-bold mb-1" style={{ color: '#5E85A3' }}>
                📊 {child.nickname} 目前的發展階段
              </p>
              <p className="text-sm font-semibold mb-2" style={{ color: '#2D3436' }}>{stageInfo.stage}</p>
              <p className="text-xs font-semibold mb-1.5" style={{ color: '#6B7B8D' }}>這個階段可以特別關注：</p>
              {stageInfo.focus.map((f, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1">
                  <span className="shrink-0 text-xs font-bold" style={{ color: '#7B9EBD' }}>
                    {['①', '②', '③'][i]}
                  </span>
                  <p className="text-xs leading-snug" style={{ color: '#4A5568' }}>{f}</p>
                </div>
              ))}
            </div>

            {/* 上傳區 */}
            {!photoPreview ? (
              <div
                className="p-6 rounded-2xl text-center"
                style={{ background: 'linear-gradient(135deg, #F0F7FF, #EBF4FF)', border: '2px dashed #7B9EBD' }}
              >
                <div className="text-4xl mb-3">📸</div>
                <p className="text-sm font-bold mb-1" style={{ color: '#5E85A3' }}>上傳一張寶貝的近照</p>
                <p className="text-xs mb-4" style={{ color: '#8E9EAD' }}>AI 會分析寶貝的狀態，給你個性化的建議</p>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex flex-col items-center gap-1.5 py-3 rounded-xl cursor-pointer active:opacity-70" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                    <Camera size={18} className="text-white" />
                    <span className="text-xs font-bold text-white">拍照</span>
                  </label>
                  <label className="flex flex-col items-center gap-1.5 py-3 rounded-xl cursor-pointer active:opacity-70" style={{ background: 'white', border: '1.5px solid #C5D8E8' }}>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    <span style={{ fontSize: 18 }}>🖼️</span>
                    <span className="text-xs font-bold" style={{ color: '#5E85A3' }}>從相簿選取</span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #C5D8E8' }}>
                {/* 照片預覽 + 分析結果 */}
                <div className="p-4 flex gap-3" style={{ background: 'white' }}>
                  <img
                    src={photoPreview}
                    alt="寶貝照片"
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                  />
                  <div className="flex-1 min-w-0">
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center justify-center h-full gap-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                          style={{ borderColor: '#7B9EBD', borderTopColor: 'transparent' }}
                        />
                        <p className="text-xs" style={{ color: '#8E9EAD' }}>AI 正在認識寶貝…</p>
                      </div>
                    ) : photoResult ? (
                      <div>
                        <div className="flex items-center gap-1 mb-1.5">
                          <Sparkles size={12} style={{ color: '#7B9EBD' }} />
                          <p className="text-xs font-bold" style={{ color: '#5E85A3' }}>AI 觀察到</p>
                        </div>
                        <p className="text-xs mb-2 leading-snug" style={{ color: '#2D3436' }}>{photoResult.observation}</p>
                        {photoResult.highlights.map((h, i) => (
                          <p key={i} className="text-[11px] leading-snug" style={{ color: '#6B7B8D' }}>• {h}</p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 鼓勵訊息 */}
                {photoResult && (
                  <div className="px-4 py-3" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
                    <p className="text-xs text-white text-center">
                      我們會陪著你和 {child.nickname} 一起成長！💙
                    </p>
                  </div>
                )}
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={() => setStep(2)}
            >
              {photoResult ? '繼續' : '跳過，之後再上傳'}
            </Button>
            {!photoPreview && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
              >
                之後再上傳
              </button>
            )}
            <p className="text-[10px] text-center" style={{ color: '#A0AEB8' }}>
              * 照片僅用於 AI 分析，不會上傳至伺服器
            </p>
          </div>
        )}

        {/* Step 2: 健康狀況 */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">過敏原（可多選）</p>
              <div className="flex flex-wrap gap-2">
                {ALLERGY_OPTIONS.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setChild(c => ({ ...c, allergies: toggleArr(c.allergies, a) }))}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-sm border-2 transition-all',
                      child.allergies.includes(a)
                        ? 'bg-[#7B9EBD] text-white border-[#7B9EBD]'
                        : 'bg-white text-gray-600 border-[#C5D8E8]'
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">健康狀況（可多選）</p>
              <div className="flex flex-wrap gap-2">
                {HEALTH_OPTIONS.map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setChild(c => ({ ...c, healthConditions: toggleArr(c.healthConditions, h) }))}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-sm border-2 transition-all',
                      child.healthConditions.includes(h)
                        ? 'bg-[#7B9EBD] text-white border-[#7B9EBD]'
                        : 'bg-white text-gray-600 border-[#C5D8E8]'
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">特殊體質（可多選）</p>
              <div className="flex flex-wrap gap-2">
                {TRAIT_OPTIONS.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setChild(c => ({ ...c, specialTraits: toggleArr(c.specialTraits, t) }))}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-sm border-2 transition-all',
                      child.specialTraits.includes(t)
                        ? 'bg-[#7B9EBD] text-white border-[#7B9EBD]'
                        : 'bg-white text-gray-600 border-[#C5D8E8]'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <Button size="lg" className="w-full mt-4" onClick={() => setStep(3)}>
              下一步
            </Button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
            >
              跳過（之後可補填）
            </button>
          </div>
        )}

        {/* Step 3: 家庭資訊 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">居住縣市</label>
              <div className="flex flex-wrap gap-2">
                {CITIES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFamily(f => ({ ...f, city: c }))}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-sm border-2 transition-all',
                      family.city === c
                        ? 'bg-[#7B9EBD] text-white border-[#7B9EBD]'
                        : 'bg-white text-gray-600 border-[#C5D8E8]'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="區域（選填）"
              placeholder="例：大安區、板橋區"
              value={family.district}
              onChange={e => setFamily(f => ({ ...f, district: e.target.value }))}
            />

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">教養風格偏好（可多選）</p>
              <div className="flex flex-wrap gap-2">
                {PARENTING_STYLES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFamily(f => ({ ...f, parentingStyle: toggleArr(f.parentingStyle, s) }))}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-sm border-2 transition-all',
                      family.parentingStyle.includes(s)
                        ? 'bg-[#7B9EBD] text-white border-[#7B9EBD]'
                        : 'bg-white text-gray-600 border-[#C5D8E8]'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-4"
              loading={saving}
              onClick={handleFinish}
            >
              {saving ? '儲存中...' : '完成設定！'}
            </Button>
          </div>
        )}

        {/* Step 4: 完成 */}
        {step === 4 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-5">🎉</div>
            <h2 className="text-2xl font-black text-gray-800 mb-3">
              {child.nickname} 的專屬首頁<br />已準備好了！
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              育兒智多星已根據你提供的資料<br />
              客製化你的使用體驗
            </p>
            <div className="space-y-3">
              {['生長曲線追蹤已啟用', '個性化景點推薦已啟用', '幼兒園智慧配對已啟用'].map(item => (
                <div key={item} className="flex items-center gap-2 bg-[#EBF4FF] rounded-xl p-3">
                  <CheckCircle size={16} className="text-[#7B9EBD] shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="w-full mt-6" onClick={() => router.push('/dashboard')}>
              開始使用
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
