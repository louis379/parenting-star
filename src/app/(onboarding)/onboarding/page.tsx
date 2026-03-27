'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Baby, Heart, Home, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

// === Step 1: 孩子基本資料 ===
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

// === Step 2: 家庭資訊 ===
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
  { icon: Heart, title: '健康狀況', subtitle: '有助於更準確的推薦' },
  { icon: Home, title: '家庭資訊', subtitle: '個性化你的使用體驗' },
  { icon: CheckCircle, title: '設定完成！', subtitle: '你的育兒智多星已就緒' },
]

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

  function toggleArr(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
  }

  function handleFinish() {
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

    try {
      localStorage.setItem('ps_onboarding', JSON.stringify(onboardingData))
    } catch {
      // localStorage 不可用時靜默忽略
    }

    setStep(3)
  }

  const progress = ((step + 1) / STEPS.length) * 100
  const StepIcon = STEPS[step].icon

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div className="gradient-hero text-white px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          {step > 0 && step < 3 && (
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

        {/* Step 1: 健康狀況 */}
        {step === 1 && (
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

            <Button size="lg" className="w-full mt-4" onClick={() => setStep(2)}>
              下一步
            </Button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
            >
              跳過（之後可補填）
            </button>
          </div>
        )}

        {/* Step 2: 家庭資訊 */}
        {step === 2 && (
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
              onClick={handleFinish}
            >
              完成設定！
            </Button>
          </div>
        )}

        {/* Step 3: 完成 */}
        {step === 3 && (
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
            <Button size="lg" className="w-full mt-6" onClick={() => router.push('/growth')}>
              開始使用
            </Button>
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3"
            >
              建立帳號以儲存資料
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
