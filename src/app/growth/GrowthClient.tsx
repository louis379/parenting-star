'use client'

import { useState } from 'react'
import {
  TrendingUp, BookOpen, ClipboardList, Ruler, Weight, Moon, Info,
  Camera, FileVideo, Sparkles, AlertTriangle, CheckCircle2, ChevronRight,
  Plus, X, Utensils,
} from 'lucide-react'

type MainTab = 'knowledge' | 'records'

const AGE_GROUPS = [
  { key: '0-3m', label: '0–3月' },
  { key: '4-6m', label: '4–6月' },
  { key: '7-9m', label: '7–9月' },
  { key: '10-12m', label: '10–12月' },
  { key: '1-2y', label: '1–2歲' },
  { key: '2-3y', label: '2–3歲' },
  { key: '3-4y', label: '3–4歲' },
  { key: '4-5y', label: '4–5歲' },
  { key: '5-6y', label: '5–6歲' },
  { key: '6-8y', label: '6–8歲' },
  { key: '8-10y', label: '8–10歲' },
  { key: '10-12y', label: '10–12歲' },
]

const AGE_DATA: Record<string, {
  height: string
  weight: string
  grossMotor: string[]
  fineMotor: string[]
  sleep: string
  sleepNote: string
}> = {
  '0-3m': {
    height: '男 50–62 / 女 49–61 cm',
    weight: '男 3.3–7.0 / 女 3.2–6.5 kg',
    grossMotor: ['俯臥時抬頭（0–4週）', '俯臥時頭可撐起45度（6週）', '俯臥時頭部可穩定抬高90度（3月）'],
    fineMotor: ['反射性握拳（出生）', '雙手可打開（2月）', '追視移動物體（1–2月）'],
    sleep: '14–17 小時/天',
    sleepNote: '多次短睡，無固定作息，夜間每2–4小時需餵奶',
  },
  '4-6m': {
    height: '男 62–68 / 女 61–67 cm',
    weight: '男 6.0–8.5 / 女 5.5–8.0 kg',
    grossMotor: ['翻身（前→後，後→前）', '雙手撐胸俯臥', '扶坐時頭部穩定'],
    fineMotor: ['伸手抓物', '雙手換物', '把玩具放入口中探索'],
    sleep: '12–15 小時/天',
    sleepNote: '夜間可睡5–6小時，白天午睡2–3次',
  },
  '7-9m': {
    height: '男 68–74 / 女 66–72 cm',
    weight: '男 8.0–10.0 / 女 7.3–9.4 kg',
    grossMotor: ['獨立坐穩（6–8月）', '四肢爬行（7–10月）', '扶站（8–10月）'],
    fineMotor: ['拇指與手掌側面捏取', '敲打兩個積木', '刻意丟棄物品'],
    sleep: '12–15 小時/天',
    sleepNote: '白天午睡2次（早/下午），夜間10–11小時',
  },
  '10-12m': {
    height: '男 73–78 / 女 71–76 cm',
    weight: '男 9.0–11.0 / 女 8.5–10.5 kg',
    grossMotor: ['扶走（巡走）', '蹲下後站起', '可獨立站幾秒'],
    fineMotor: ['拇指食指精細捏取', '疊積木2塊', '模仿塗鴉動作'],
    sleep: '11–14 小時/天',
    sleepNote: '白天午睡1–2次，夜間穩定10–12小時',
  },
  '1-2y': {
    height: '男 75–92 / 女 74–90 cm',
    weight: '男 9.5–13.5 / 女 9.0–13.0 kg',
    grossMotor: ['獨立行走（12–15月）', '跑步（18月）', '上下樓梯（扶欄）'],
    fineMotor: ['疊積木3–6塊', '自己翻書頁', '用湯匙舀食'],
    sleep: '11–14 小時/天',
    sleepNote: '午睡1次（1–2小時），夜間10–12小時',
  },
  '2-3y': {
    height: '男 87–101 / 女 85–100 cm',
    weight: '男 12–16 / 女 11.5–15.5 kg',
    grossMotor: ['雙腳跳躍', '單腳站立2–3秒', '踢球、跑步轉向'],
    fineMotor: ['疊積木6–8塊', '畫垂直線、圓形', '剪紙（直線）'],
    sleep: '10–13 小時/天',
    sleepNote: '午睡1次，夜間10–12小時，部分幼兒開始拒絕午睡',
  },
  '3-4y': {
    height: '男 96–107 / 女 95–106 cm',
    weight: '男 14–18 / 女 13.5–17.5 kg',
    grossMotor: ['單腳跳', '騎三輪車', '接球、丟球有準頭'],
    fineMotor: ['用剪刀沿曲線剪', '畫人形（頭+手腳）', '仿寫簡單字母'],
    sleep: '10–13 小時/天',
    sleepNote: '部分幼兒不再需要午睡，夜間維持10–11小時',
  },
  '4-5y': {
    height: '男 103–115 / 女 102–114 cm',
    weight: '男 16–21 / 女 15.5–20.5 kg',
    grossMotor: ['跳繩開始學習', '騎兩輪自行車（有輔助輪）', '單腳跳5次以上'],
    fineMotor: ['用筷子（輔助型）', '畫有細節的圖（房子/樹）', '仿寫自己的名字'],
    sleep: '10–13 小時/天',
    sleepNote: '夜間10–11小時，不再需要午睡',
  },
  '5-6y': {
    height: '男 109–122 / 女 109–121 cm',
    weight: '男 18–23 / 女 17.5–23 kg',
    grossMotor: ['騎兩輪自行車（無輔助輪）', '跳繩連續跳', '倒退走/側走協調'],
    fineMotor: ['正確握筆書寫', '完成複雜拼圖（50片）', '打蝴蝶結'],
    sleep: '9–11 小時/天',
    sleepNote: '固定就寢時間最重要，不建議晚於9:30',
  },
  '6-8y': {
    height: '男 115–132 / 女 114–131 cm',
    weight: '男 20–30 / 女 19–29 kg',
    grossMotor: ['游泳、溜冰入門', '球類運動技巧提升', '體能爆發力明顯增強'],
    fineMotor: ['書寫速度加快', '樂器演奏基礎', '精細手工藝（摺紙、編織）'],
    sleep: '9–11 小時/天',
    sleepNote: '學齡兒童建議不晚於9:00就寢',
  },
  '8-10y': {
    height: '男 127–145 / 女 127–147 cm',
    weight: '男 26–40 / 女 25–41 kg',
    grossMotor: ['運動專項技能發展', '身體協調性成熟', '女孩生長加速（9–10歲）'],
    fineMotor: ['精密工藝（模型、縫紉）', '樂器演奏中級', '書寫自動化'],
    sleep: '9–11 小時/天',
    sleepNote: '課業壓力增加，需特別保障睡眠時間',
  },
  '10-12y': {
    height: '男 137–162 / 女 140–163 cm',
    weight: '男 31–53 / 女 33–56 kg',
    grossMotor: ['青春期前生長加速', '男孩肌力開始增強', '運動表現個體差異大'],
    fineMotor: ['複雜器械操作', '藝術/手工精細度成人化', '鍵盤打字流暢'],
    sleep: '9–11 小時/天',
    sleepNote: '青春期前後睡眠需求增加，建議不晚於10:00就寢',
  },
}

interface GrowthRecord {
  id: string
  date: string
  height: string
  weight: string
  note: string
}

interface MealRecord {
  id: string
  date: string
  meal: string
  desc: string
}

interface AIResult {
  type: 'warning' | 'ok'
  title: string
  detail: string
  suggestion: string
}

const MOCK_AI_RESULTS: AIResult[] = [
  {
    type: 'warning',
    title: '大腿肌力偏弱',
    detail: '從影片觀察，孩子蹲起動作時膝蓋內旋，大腿肌群力量尚不足。',
    suggestion: '建議每天進行「沿著低矮台階上下踏步」訓練，每次10分鐘，持續2週。',
  },
  {
    type: 'warning',
    title: '蛋白質攝取不足',
    detail: '依據本週餐盤紀錄，主食比例偏高，豆蛋肉類攝取量估計低於建議量30%。',
    suggestion: '建議每餐增加一份豆腐（約50g）或雞蛋，可做成蒸蛋或豆腐味噌湯。',
  },
  {
    type: 'ok',
    title: '精細動作發展正常',
    detail: '孩子拇指食指捏取動作協調，符合該年齡段標準。',
    suggestion: '可提供更多珠子穿線、捏黏土等精細活動進一步刺激。',
  },
]

export default function GrowthClient() {
  const [mainTab, setMainTab] = useState<MainTab>('knowledge')
  const [selectedAge, setSelectedAge] = useState('1-2y')
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([
    { id: '1', date: '2026-01-15', height: '85', weight: '12.5', note: '健康檢查' },
    { id: '2', date: '2026-02-20', height: '86.5', weight: '12.8', note: '自量' },
    { id: '3', date: '2026-03-10', height: '87', weight: '13.0', note: '自量' },
  ])
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([
    { id: '1', date: '2026-03-25', meal: '午餐', desc: '白飯半碗、蒸蛋1個、花椰菜炒肉' },
  ])
  const [showGrowthForm, setShowGrowthForm] = useState(false)
  const [showMealForm, setShowMealForm] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [growthForm, setGrowthForm] = useState({ date: new Date().toISOString().split('T')[0], height: '', weight: '', note: '' })
  const [mealForm, setMealForm] = useState({ date: new Date().toISOString().split('T')[0], meal: '早餐', desc: '' })

  const ageData = AGE_DATA[selectedAge]

  function addGrowthRecord() {
    if (!growthForm.height && !growthForm.weight) return
    setGrowthRecords(r => [...r, { id: Date.now().toString(), ...growthForm }])
    setShowGrowthForm(false)
    setGrowthForm({ date: new Date().toISOString().split('T')[0], height: '', weight: '', note: '' })
  }

  function addMealRecord() {
    if (!mealForm.desc) return
    setMealRecords(r => [...r, { id: Date.now().toString(), ...mealForm }])
    setShowMealForm(false)
    setMealForm({ date: new Date().toISOString().split('T')[0], meal: '早餐', desc: '' })
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg, #A8C5DA 0%, #7B9EBD 45%, #5E85A3 100%)' }}
      >
        <div className="flex items-center gap-2 text-white mb-4">
          <TrendingUp size={22} strokeWidth={2.5} />
          <h1 className="text-xl font-black">生長發展</h1>
        </div>
        <div className="flex rounded-2xl p-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <button
            onClick={() => setMainTab('knowledge')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: mainTab === 'knowledge' ? 'white' : 'transparent', color: mainTab === 'knowledge' ? '#5E85A3' : 'rgba(255,255,255,0.85)' }}
          >
            <BookOpen size={15} />專業知識
          </button>
          <button
            onClick={() => setMainTab('records')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: mainTab === 'records' ? 'white' : 'transparent', color: mainTab === 'records' ? '#5E85A3' : 'rgba(255,255,255,0.85)' }}
          >
            <ClipboardList size={15} />家長紀錄
          </button>
        </div>
      </div>

      {/* === 專業知識 Tab === */}
      {mainTab === 'knowledge' && (
        <div>
          <div className="px-5 py-3 border-b" style={{ background: 'white', borderColor: '#E8E0D5' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#6B7B8D' }}>選擇年齡段</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {AGE_GROUPS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedAge(key)}
                  className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
                  style={{
                    background: selectedAge === key ? '#7B9EBD' : 'white',
                    color: selectedAge === key ? 'white' : '#6B7B8D',
                    borderColor: selectedAge === key ? '#7B9EBD' : '#E8E0D5',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-5 space-y-5">
            {/* 身高體重範圍 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Ruler size={16} style={{ color: '#7B9EBD' }} />
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>
                  身高體重標準
                </h2>
                <span className="evidence-badge">WHO 標準</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#C5D8E8' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Ruler size={14} style={{ color: '#7B9EBD' }} />
                    <span className="text-xs font-bold" style={{ color: '#5E85A3' }}>身高範圍</span>
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#2D3436' }}>{ageData.height}</p>
                </div>
                <div className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#C5D8E8' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Weight size={14} style={{ color: '#7B9EBD' }} />
                    <span className="text-xs font-bold" style={{ color: '#5E85A3' }}>體重範圍</span>
                  </div>
                  <p className="text-sm font-bold" style={{ color: '#2D3436' }}>{ageData.weight}</p>
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: '#8E9EAD' }}>* 依據 WHO Child Growth Standards 第3–97百分位範圍</p>
            </section>

            {/* 大動作里程碑 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize: 16 }}>🏃</span>
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>大動作里程碑</h2>
                <span className="evidence-badge">Cochrane A</span>
              </div>
              <div className="space-y-2">
                {ageData.grossMotor.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                    <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: '#EBF4FF', color: '#5E85A3' }}>
                      {i + 1}
                    </div>
                    <span className="text-sm" style={{ color: '#2D3436' }}>{m}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 精細動作 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize: 16 }}>✋</span>
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>精細動作里程碑</h2>
                <span className="evidence-badge">Cochrane A</span>
              </div>
              <div className="space-y-2">
                {ageData.fineMotor.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                    <div className="shrink-0 px-2 py-0.5 rounded-lg text-xs font-bold mt-0.5" style={{ background: '#F5E6C8', color: '#B07548' }}>
                      {i + 1}
                    </div>
                    <span className="text-sm" style={{ color: '#2D3436' }}>{m}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 睡眠建議 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Moon size={16} style={{ color: '#7B9EBD' }} />
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>睡眠建議</h2>
                <span className="evidence-badge">NSF 實證</span>
              </div>
              <div className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: '#2D3436' }}>建議總睡眠時數</span>
                  <span className="text-sm font-black px-3 py-1 rounded-xl" style={{ background: '#EBF4FF', color: '#5E85A3' }}>{ageData.sleep}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#6B7B8D' }}>{ageData.sleepNote}</p>
              </div>
            </section>

            {/* 來源說明 */}
            <div className="flex items-start gap-2 p-4 rounded-2xl border" style={{ background: '#EBF4FF', borderColor: '#C5D8E8' }}>
              <Info size={16} className="shrink-0 mt-0.5" style={{ color: '#5E85A3' }} />
              <p className="text-xs leading-relaxed" style={{ color: '#5E85A3' }}>
                本頁資料來源：WHO Child Growth Standards（2006）、Cochrane 系統性回顧、美國國家睡眠基金會（NSF）。建議僅供參考，個別差異因人而異，請諮詢專業醫師。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* === 家長紀錄 Tab === */}
      {mainTab === 'records' && (
        <div className="px-5 py-5 space-y-5">
          {/* 上傳區域 */}
          <section>
            <h2 className="font-bold mb-3" style={{ color: '#2D3436' }}>上傳紀錄媒體</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-opacity active:opacity-70" style={{ background: 'white', borderColor: '#C5D8E8' }}>
                <Camera size={24} style={{ color: '#7B9EBD' }} />
                <span className="text-xs font-semibold" style={{ color: '#5E85A3' }}>上傳照片</span>
                <span className="text-[10px]" style={{ color: '#8E9EAD' }}>支援 JPG / PNG</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-opacity active:opacity-70" style={{ background: 'white', borderColor: '#C5D8E8' }}>
                <FileVideo size={24} style={{ color: '#7B9EBD' }} />
                <span className="text-xs font-semibold" style={{ color: '#5E85A3' }}>上傳影片</span>
                <span className="text-[10px]" style={{ color: '#8E9EAD' }}>支援 MP4 / MOV</span>
              </button>
            </div>
          </section>

          {/* 身高體重記錄 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold" style={{ color: '#2D3436' }}>身高體重紀錄</h2>
              <button onClick={() => setShowGrowthForm(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white" style={{ background: '#7B9EBD' }}>
                <Plus size={12} />新增
              </button>
            </div>
            <div className="space-y-2">
              {[...growthRecords].reverse().map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#2D3436' }}>{r.date}</p>
                    {r.note && <p className="text-xs" style={{ color: '#8E9EAD' }}>{r.note}</p>}
                  </div>
                  <div className="text-right text-sm space-y-0.5">
                    {r.height && <p style={{ color: '#5E85A3' }}>{r.height} cm</p>}
                    {r.weight && <p style={{ color: '#6B7B8D' }}>{r.weight} kg</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 飲食記錄 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Utensils size={16} style={{ color: '#7B9EBD' }} />
                <h2 className="font-bold" style={{ color: '#2D3436' }}>飲食紀錄</h2>
              </div>
              <button onClick={() => setShowMealForm(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white" style={{ background: '#7B9EBD' }}>
                <Plus size={12} />新增
              </button>
            </div>
            <div className="space-y-2">
              {[...mealRecords].reverse().map(r => (
                <div key={r.id} className="p-3 rounded-xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: '#2D3436' }}>{r.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: '#EBF4FF', color: '#5E85A3' }}>{r.meal}</span>
                  </div>
                  <p className="text-sm" style={{ color: '#6B7B8D' }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* AI 分析 */}
          <section>
            <div className="p-4 rounded-2xl border" style={{ background: '#F5F8FF', borderColor: '#C5D8E8' }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} style={{ color: '#7B9EBD' }} />
                <h3 className="font-bold" style={{ color: '#2D3436' }}>AI 智慧分析</h3>
              </div>
              <p className="text-xs mb-3" style={{ color: '#6B7B8D' }}>
                上傳照片/影片和飲食紀錄後，AI 將分析孩子動作發展和營養攝取情況
              </p>
              <button
                onClick={() => setShowAI(true)}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}
              >
                <Sparkles size={16} />立即 AI 分析
              </button>
            </div>
          </section>

          {/* AI 分析結果 */}
          {showAI && (
            <section>
              <h2 className="font-bold mb-3" style={{ color: '#2D3436' }}>AI 分析結果</h2>
              <div className="space-y-3">
                {MOCK_AI_RESULTS.map((r, i) => (
                  <div key={i} className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: r.type === 'warning' ? '#F5C5C5' : '#B8D8B8' }}>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: r.type === 'warning' ? '#FFF0F0' : '#EBF4EB' }}>
                        {r.type === 'warning'
                          ? <AlertTriangle size={16} style={{ color: '#C45A5A' }} />
                          : <CheckCircle2 size={16} style={{ color: '#5A8A5A' }} />
                        }
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm mb-1" style={{ color: '#2D3436' }}>{r.title}</p>
                        <p className="text-xs leading-relaxed mb-2" style={{ color: '#6B7B8D' }}>{r.detail}</p>
                        <div className="p-2.5 rounded-xl flex items-start gap-1.5" style={{ background: r.type === 'warning' ? '#FFF8F0' : '#EBF4EB' }}>
                          <ChevronRight size={13} className="shrink-0 mt-0.5" style={{ color: r.type === 'warning' ? '#B07548' : '#5A8A5A' }} />
                          <p className="text-xs" style={{ color: r.type === 'warning' ? '#B07548' : '#3A6A3A' }}>{r.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center mt-3" style={{ color: '#8E9EAD' }}>* 此為模擬分析結果</p>
            </section>
          )}
        </div>
      )}

      {/* 身高體重表單 Modal */}
      {showGrowthForm && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg" style={{ color: '#2D3436' }}>新增生長紀錄</h2>
              <button onClick={() => setShowGrowthForm(false)}><X size={22} style={{ color: '#8E9EAD' }} /></button>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: '#2D3436' }}>測量日期</label>
              <input type="date" value={growthForm.date} onChange={e => setGrowthForm(f => ({ ...f, date: e.target.value }))} className="w-full h-11 px-4 rounded-2xl border text-sm outline-none" style={{ borderColor: '#E8E0D5', color: '#2D3436' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold block mb-1" style={{ color: '#2D3436' }}>身高 (cm)</label>
                <input type="number" step="0.1" placeholder="例：87.5" value={growthForm.height} onChange={e => setGrowthForm(f => ({ ...f, height: e.target.value }))} className="w-full h-11 px-4 rounded-2xl border text-sm outline-none" style={{ borderColor: '#E8E0D5', color: '#2D3436' }} />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1" style={{ color: '#2D3436' }}>體重 (kg)</label>
                <input type="number" step="0.01" placeholder="例：13.2" value={growthForm.weight} onChange={e => setGrowthForm(f => ({ ...f, weight: e.target.value }))} className="w-full h-11 px-4 rounded-2xl border text-sm outline-none" style={{ borderColor: '#E8E0D5', color: '#2D3436' }} />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: '#2D3436' }}>備注（選填）</label>
              <input type="text" placeholder="例：定期健康檢查、自量" value={growthForm.note} onChange={e => setGrowthForm(f => ({ ...f, note: e.target.value }))} className="w-full h-11 px-4 rounded-2xl border text-sm outline-none" style={{ borderColor: '#E8E0D5', color: '#2D3436' }} />
            </div>
            <button onClick={addGrowthRecord} className="w-full py-4 rounded-2xl font-bold text-base text-white" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
              儲存紀錄
            </button>
          </div>
        </div>
      )}

      {/* 飲食紀錄表單 Modal */}
      {showMealForm && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg" style={{ color: '#2D3436' }}>新增飲食紀錄</h2>
              <button onClick={() => setShowMealForm(false)}><X size={22} style={{ color: '#8E9EAD' }} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold block mb-1" style={{ color: '#2D3436' }}>日期</label>
                <input type="date" value={mealForm.date} onChange={e => setMealForm(f => ({ ...f, date: e.target.value }))} className="w-full h-11 px-4 rounded-2xl border text-sm outline-none" style={{ borderColor: '#E8E0D5', color: '#2D3436' }} />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1" style={{ color: '#2D3436' }}>餐別</label>
                <select value={mealForm.meal} onChange={e => setMealForm(f => ({ ...f, meal: e.target.value }))} className="w-full h-11 px-4 rounded-2xl border text-sm outline-none" style={{ borderColor: '#E8E0D5', color: '#2D3436' }}>
                  {['早餐', '午餐', '晚餐', '點心'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: '#2D3436' }}>餐盤內容描述</label>
              <textarea value={mealForm.desc} onChange={e => setMealForm(f => ({ ...f, desc: e.target.value }))} placeholder="例：白飯半碗、蒸蛋1個、花椰菜炒肉、蘋果半顆" rows={3} className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none border" style={{ borderColor: '#E8E0D5', color: '#2D3436' }} />
            </div>
            <button onClick={addMealRecord} className="w-full py-4 rounded-2xl font-bold text-base text-white" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
              儲存紀錄
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
