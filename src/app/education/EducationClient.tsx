'use client'

import { useState } from 'react'
import {
  BookOpen, ClipboardList, MessageSquare, Lightbulb, GraduationCap,
  Camera, FileText, Sparkles, AlertTriangle, CheckCircle2, ChevronRight,
  Info, TrendingUp, Plus, X, Star,
} from 'lucide-react'

type MainTab = 'knowledge' | 'records'
type KnowledgeSection = 'language' | 'piaget' | 'guide'

const AGE_GROUPS_LANG = [
  { key: '0-1y', label: '0–1歲' },
  { key: '1-2y', label: '1–2歲' },
  { key: '2-3y', label: '2–3歲' },
  { key: '3-5y', label: '3–5歲' },
  { key: '5-7y', label: '5–7歲' },
  { key: '7-12y', label: '7–12歲' },
]

const LANGUAGE_DATA: Record<string, {
  vocab: string
  sentence: string
  expression: string
  note: string
  warning: string
}> = {
  '0-1y': {
    vocab: '第一個有意義的詞（約10–12月）',
    sentence: '牙牙學語、重複音節（ba-ba, ma-ma）',
    expression: '哭聲分化、手勢指物（9–12月）',
    note: '對聲音有反應，開始模仿口型，以哭聲/表情溝通',
    warning: '12月後仍無任何語音或手勢，需評估',
  },
  '1-2y': {
    vocab: '10–50 個詞（18月後詞彙爆發）',
    sentence: '兩詞組合（媽媽水、爸爸走）',
    expression: '用詞+手勢表達多重含義',
    note: '18月是詞彙爆發關鍵點，此後每週平均新增10個詞',
    warning: '18月不到10個詞、24月不到50個詞需評估',
  },
  '2-3y': {
    vocab: '200–300 個詞',
    sentence: '3–4詞完整句，開始問「是什麼」',
    expression: '能敘述剛發生的事，使用代名詞（我/你）',
    note: '開始問為什麼，語法快速複雜化',
    warning: '3歲陌生人聽不懂75%以上，需語言評估',
  },
  '3-5y': {
    vocab: '1000–2000 個詞',
    sentence: '複雜句型，使用連接詞（因為/但是）',
    expression: '能講有情節的故事，理解過去/未來',
    note: '大量發問期，語法接近成人，出現創意語言遊戲',
    warning: '5歲仍有明顯發音錯誤或結巴需評估',
  },
  '5-7y': {
    vocab: '2000–5000 個詞',
    sentence: '成人語法結構，理解反話/玩笑',
    expression: '能解釋抽象概念，書寫語言萌發',
    note: '開始學習閱讀，語言和認知高度整合',
    warning: '無法理解同年齡閱讀材料需評估',
  },
  '7-12y': {
    vocab: '5000+ 個詞（閱讀擴大詞彙量）',
    sentence: '複雜書面語/口語區分',
    expression: '論述/說服/比喻，語用技巧成熟',
    note: '語言成為學習工具，閱讀為主要知識獲取方式',
    warning: '閱讀困難（讀寫障礙）需早期介入',
  },
}

const piagetStages = [
  {
    stage: '感覺動作期',
    age: '0–2 歲',
    key: '用感官和動作認識世界',
    traits: ['客體永久性（8–12月出現）', '模仿學習為主', '因果概念萌發（9–12月）', '符號功能出現（18–24月）'],
    tips: ['提供多元感官刺激（不同材質/聲音）', '玩藏東西遊戲（布偶躲起來）', '讓孩子自由探索安全環境', '說出孩子的動作（「你在拍！」）'],
    color: '#5A8A5A',
    bg: '#EBF4EB',
  },
  {
    stage: '前運思期',
    age: '2–7 歲',
    key: '符號思維，但以自我為中心',
    traits: ['自我中心思維（不理解他人觀點）', '萬物有靈論（玩具有感情）', '缺乏守恆概念（高杯/矮杯水量相同不理解）', '象徵遊戲活躍'],
    tips: ['角色扮演遊戲促進觀點取替', '不急著糾正「錯誤」邏輯', '繪本建立因果思維', '讓孩子主導假裝遊戲'],
    color: '#5E85A3',
    bg: '#EBF4FF',
  },
  {
    stage: '具體運思期',
    age: '7–12 歲',
    key: '邏輯思維，但需具體物件輔助',
    traits: ['守恆概念建立', '分類與序列能力', '去除自我中心，理解他人觀點', '理解規則，公平感強'],
    tips: ['操作性學習（積木、測量、實驗）', '自然觀察記錄（植物生長）', '規律作息和學習習慣', '給予挑戰但不要超前太多'],
    color: '#B07548',
    bg: '#FDF0E8',
  },
  {
    stage: '形式運思期',
    age: '12 歲+',
    key: '抽象邏輯、假設演繹',
    traits: ['抽象推理（代數/哲學）', '假設思維（「如果……那麼」）', '系統性問題解決', '道德哲學思考萌發'],
    tips: ['辯論、討論時事', '科學實驗設計', '鼓勵質疑與批判性思維', '尊重其獨立見解'],
    color: '#5E85A3',
    bg: '#EBF4FF',
  },
]

const subjectGuide = [
  { subject: '數學', age: '3–6歲', method: '數積木/步數/餅乾、形狀分類', milestone: '認識1–10數字，簡單加法', avoid: '提前做計算題，忽略概念理解' },
  { subject: '語文', age: '2–6歲', method: '每天親子共讀15分鐘、說故事', milestone: '認識常用字、自己看圖說故事', avoid: '大量抄寫、枯燥拼音練習' },
  { subject: '自然科學', age: '3–8歲', method: '觀察蝸牛/植物/昆蟲、簡單實驗', milestone: '能觀察並描述現象，提出疑問', avoid: '只背答案，不觀察過程' },
  { subject: '藝術', age: '2歲+', method: '自由塗鴉、黏土、音樂律動', milestone: '自由表達情感，不追求「像不像」', avoid: '要求臨摹標準答案，批評作品' },
  { subject: '社會探索', age: '4歲+', method: '角色扮演（醫生/老師/廚師）、參觀社區', milestone: '了解社會角色，建立公民感', avoid: '過早強調競爭，忽視合作學習' },
]

interface LearningRecord {
  id: string
  date: string
  type: 'book' | 'exam' | 'milestone'
  desc: string
  analyzed: boolean
}

const BOOK_ANALYSIS = [
  { type: 'ok', title: '閱讀流暢度良好', detail: '孩子能順暢閱讀句子，斷句自然，未出現逐字閱讀的跡象。', suggestion: '可以嘗試閱讀段落更長的繪本，循序漸進挑戰詞彙量。' },
  { type: 'warning', title: '發音準確度需加強', detail: '「zh/ch/sh」等捲舌音發音不準，可能需要語音訓練。', suggestion: '每天做5分鐘繞口令練習（「吃葡萄不吐葡萄皮」），趣味性強效果佳。' },
]

const EXAM_ANALYSIS = [
  { type: 'warning', title: '易錯類型：應用題理解', detail: '計算題正確率高，但文字應用題失分多，顯示「閱讀理解→數學轉換」連結尚弱。', suggestion: '練習時先圈出題目關鍵詞，再列式計算，培養審題習慣。' },
  { type: 'warning', title: '知識缺口：分數概念', detail: '分數比較和加減運算有系統性錯誤，基本概念需鞏固。', suggestion: '用實物操作（切蘋果/披薩）重新建立分數直覺，再進入計算練習。' },
  { type: 'ok', title: '文字書寫整潔', detail: '書寫工整，計算步驟清晰，良好的學習習慣值得繼續保持。', suggestion: '繼續維持，可以加入更多「解釋你的思路」類題目培養邏輯表達。' },
]

export default function EducationClient() {
  const [mainTab, setMainTab] = useState<MainTab>('knowledge')
  const [knowledgeSection, setKnowledgeSection] = useState<KnowledgeSection>('language')
  const [selectedAge, setSelectedAge] = useState('2-3y')
  const [records, setRecords] = useState<LearningRecord[]>([
    { id: '1', date: '2026-03-15', type: 'book', desc: '唸《好餓的毛毛蟲》', analyzed: false },
    { id: '2', date: '2026-03-20', type: 'milestone', desc: '能數到30，開始認識簡單國字', analyzed: false },
  ])
  const [showForm, setShowForm] = useState(false)
  const [showBookAI, setShowBookAI] = useState(false)
  const [showExamAI, setShowExamAI] = useState(false)
  const [recordForm, setRecordForm] = useState({ date: new Date().toISOString().split('T')[0], type: 'milestone' as 'book' | 'exam' | 'milestone', desc: '' })

  const langData = LANGUAGE_DATA[selectedAge]

  function addRecord() {
    if (!recordForm.desc) return
    setRecords(r => [...r, { id: Date.now().toString(), ...recordForm, analyzed: false }])
    setShowForm(false)
    setRecordForm({ date: new Date().toISOString().split('T')[0], type: 'milestone', desc: '' })
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: 'linear-gradient(160deg, #A8C5DA 0%, #7B9EBD 45%, #5E85A3 100%)' }}>
        <div className="flex items-center gap-2 text-white mb-4">
          <BookOpen size={22} strokeWidth={2.5} />
          <h1 className="text-xl font-black">教育發展</h1>
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
          <div className="flex gap-1 px-5 py-3 overflow-x-auto border-b" style={{ borderColor: '#E8E0D5', background: 'white' }}>
            {[
              { key: 'language', label: '語言發展', icon: MessageSquare },
              { key: 'piaget', label: '認知階段', icon: Lightbulb },
              { key: 'guide', label: '學科引導', icon: GraduationCap },
            ].map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setKnowledgeSection(key as KnowledgeSection)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
                style={{ background: knowledgeSection === key ? '#7B9EBD' : 'white', color: knowledgeSection === key ? 'white' : '#6B7B8D', borderColor: knowledgeSection === key ? '#7B9EBD' : '#E8E0D5' }}>
                <Icon size={12} />{label}
              </button>
            ))}
          </div>

          {/* 語言發展 */}
          {knowledgeSection === 'language' && (
            <div>
              <div className="px-5 py-3 border-b" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#6B7B8D' }}>選擇年齡段</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {AGE_GROUPS_LANG.map(({ key, label }) => (
                    <button key={key} onClick={() => setSelectedAge(key)}
                      className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
                      style={{ background: selectedAge === key ? '#7B9EBD' : 'white', color: selectedAge === key ? 'white' : '#6B7B8D', borderColor: selectedAge === key ? '#7B9EBD' : '#E8E0D5' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-5 py-5 space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>語言發展</h2>
                  <span className="evidence-badge">Cochrane A</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: '詞彙量', value: langData.vocab, color: '#5E85A3', bg: '#EBF4FF' },
                    { label: '句型發展', value: langData.sentence, color: '#5A8A5A', bg: '#EBF4EB' },
                    { label: '表達力', value: langData.expression, color: '#B07548', bg: '#FDF0E8' },
                  ].map(item => (
                    <div key={item.label} className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                      <div className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold mb-2" style={{ background: item.bg, color: item.color }}>{item.label}</div>
                      <p className="text-sm font-semibold" style={{ color: '#2D3436' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl" style={{ background: '#F5F8FF', borderColor: '#C5D8E8', border: '1px solid #C5D8E8' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: '#5E85A3' }}>發展特點</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7B8D' }}>{langData.note}</p>
                </div>
                <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#FFF8F0', borderColor: '#F5D5A8', border: '1px solid #F5D5A8' }}>
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: '#B07548' }} />
                  <p className="text-xs leading-relaxed" style={{ color: '#8A5A28' }}>{langData.warning}</p>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#EBF4FF', borderColor: '#C5D8E8', border: '1px solid #C5D8E8' }}>
                  <Info size={14} className="shrink-0 mt-0.5" style={{ color: '#5E85A3' }} />
                  <p className="text-xs" style={{ color: '#5E85A3' }}>語言發展具有大範圍個體差異，以上為一般參考值。若擔心孩子發展，請諮詢語言治療師評估。</p>
                </div>
              </div>
            </div>
          )}

          {/* 皮亞傑 */}
          {knowledgeSection === 'piaget' && (
            <div className="px-5 py-5 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>皮亞傑認知發展</h2>
                <span className="evidence-badge">心理學經典</span>
              </div>
              <div className="space-y-3">
                {piagetStages.map(stage => (
                  <div key={stage.stage} className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold mb-1" style={{ background: stage.bg, color: stage.color }}>{stage.age}</span>
                        <h3 className="font-bold text-sm" style={{ color: '#2D3436' }}>{stage.stage}</h3>
                      </div>
                    </div>
                    <p className="text-xs mb-2 font-medium" style={{ color: stage.color }}>{stage.key}</p>
                    <div className="space-y-1 mb-3">
                      {stage.traits.map((t, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <Star size={10} className="shrink-0 mt-0.5" style={{ color: stage.color }} fill={stage.color} />
                          <span className="text-xs" style={{ color: '#6B7B8D' }}>{t}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: stage.bg }}>
                      <p className="text-xs font-bold mb-1.5" style={{ color: stage.color }}>親子互動建議</p>
                      {stage.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-1.5 mb-1">
                          <CheckCircle2 size={11} className="shrink-0 mt-0.5" style={{ color: stage.color }} />
                          <span className="text-xs" style={{ color: '#2D3436' }}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 學科引導 */}
          {knowledgeSection === 'guide' && (
            <div className="px-5 py-5 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>學科能力發展與引導</h2>
                <span className="evidence-badge">Cochrane B</span>
              </div>
              <div className="space-y-3">
                {subjectGuide.map(g => (
                  <div key={g.subject} className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm" style={{ color: '#2D3436' }}>{g.subject}</span>
                      <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: '#EBF4FF', color: '#5E85A3' }}>{g.age}</span>
                    </div>
                    <p className="text-xs mb-1.5" style={{ color: '#6B7B8D' }}>
                      <span className="font-semibold" style={{ color: '#5A8A5A' }}>推薦方法：</span>{g.method}
                    </p>
                    <p className="text-xs mb-1.5" style={{ color: '#6B7B8D' }}>
                      <span className="font-semibold" style={{ color: '#5E85A3' }}>里程碑：</span>{g.milestone}
                    </p>
                    <p className="text-xs" style={{ color: '#8E9EAD' }}>
                      <span className="font-semibold" style={{ color: '#C45A5A' }}>避免：</span>{g.avoid}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* === 家長紀錄 Tab === */}
      {mainTab === 'records' && (
        <div className="px-5 py-5 space-y-5">
          {/* AI 分析工具 */}
          <section>
            <h2 className="font-bold mb-3" style={{ color: '#2D3436' }}>AI 學習分析</h2>
            <div className="space-y-3">
              {/* 繪本影片 */}
              <div className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#C5D8E8' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Camera size={18} style={{ color: '#7B9EBD' }} />
                  <span className="font-semibold text-sm" style={{ color: '#2D3436' }}>上傳唸繪本影片</span>
                </div>
                <p className="text-xs mb-3" style={{ color: '#6B7B8D' }}>
                  AI 分析閱讀流暢度、發音準確度，識別是否需要語言治療評估
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-xl text-xs font-semibold border" style={{ background: 'white', borderColor: '#C5D8E8', color: '#5E85A3' }}>
                    上傳影片
                  </button>
                  <button
                    onClick={() => setShowBookAI(true)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-white"
                    style={{ background: '#7B9EBD' }}
                  >
                    查看模擬分析
                  </button>
                </div>
              </div>

              {/* 考卷照片 */}
              <div className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#C5D8E8' }}>
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={18} style={{ color: '#7B9EBD' }} />
                  <span className="font-semibold text-sm" style={{ color: '#2D3436' }}>上傳考卷照片</span>
                </div>
                <p className="text-xs mb-3" style={{ color: '#6B7B8D' }}>
                  分析易錯題型、知識漏洞，給出針對性複習建議
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-xl text-xs font-semibold border" style={{ background: 'white', borderColor: '#C5D8E8', color: '#5E85A3' }}>
                    拍照上傳
                  </button>
                  <button
                    onClick={() => setShowExamAI(true)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-white"
                    style={{ background: '#7B9EBD' }}
                  >
                    查看模擬分析
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 繪本分析結果 */}
          {showBookAI && (
            <section>
              <h2 className="font-bold mb-3" style={{ color: '#2D3436' }}>繪本閱讀 AI 分析</h2>
              <div className="space-y-3">
                {BOOK_ANALYSIS.map((r, i) => (
                  <div key={i} className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: r.type === 'warning' ? '#F5C5C5' : '#B8D8B8' }}>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: r.type === 'warning' ? '#FFF0F0' : '#EBF4EB' }}>
                        {r.type === 'warning' ? <AlertTriangle size={16} style={{ color: '#C45A5A' }} /> : <CheckCircle2 size={16} style={{ color: '#5A8A5A' }} />}
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
            </section>
          )}

          {/* 考卷分析結果 */}
          {showExamAI && (
            <section>
              <h2 className="font-bold mb-3" style={{ color: '#2D3436' }}>考卷 AI 分析</h2>
              <div className="space-y-3">
                {EXAM_ANALYSIS.map((r, i) => (
                  <div key={i} className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: r.type === 'warning' ? '#F5C5C5' : '#B8D8B8' }}>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: r.type === 'warning' ? '#FFF0F0' : '#EBF4EB' }}>
                        {r.type === 'warning' ? <AlertTriangle size={16} style={{ color: '#C45A5A' }} /> : <CheckCircle2 size={16} style={{ color: '#5A8A5A' }} />}
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
              <p className="text-xs text-center mt-2" style={{ color: '#8E9EAD' }}>* 此為模擬分析結果</p>
            </section>
          )}

          {/* 學習進度追蹤 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} style={{ color: '#7B9EBD' }} />
                <h2 className="font-bold" style={{ color: '#2D3436' }}>學習進度追蹤</h2>
              </div>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white" style={{ background: '#7B9EBD' }}>
                <Plus size={12} />新增
              </button>
            </div>
            <div className="space-y-2">
              {[...records].reverse().map(r => {
                const typeMap = { book: { label: '繪本', bg: '#EBF4FF', color: '#5E85A3' }, exam: { label: '考卷', bg: '#FDF0E8', color: '#B07548' }, milestone: { label: '里程碑', bg: '#EBF4EB', color: '#5A8A5A' } }
                const t = typeMap[r.type]
                return (
                  <div key={r.id} className="p-3 rounded-xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: '#2D3436' }}>{r.date}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: t.bg, color: t.color }}>{t.label}</span>
                    </div>
                    <p className="text-sm" style={{ color: '#6B7B8D' }}>{r.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      )}

      {/* 新增紀錄 Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg" style={{ color: '#2D3436' }}>新增學習紀錄</h2>
              <button onClick={() => setShowForm(false)}><X size={22} style={{ color: '#8E9EAD' }} /></button>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: '#2D3436' }}>日期</label>
              <input type="date" value={recordForm.date} onChange={e => setRecordForm(f => ({ ...f, date: e.target.value }))} className="w-full h-11 px-4 rounded-2xl border text-sm outline-none" style={{ borderColor: '#E8E0D5', color: '#2D3436' }} />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>紀錄類型</label>
              <div className="flex gap-2">
                {[{ key: 'book', label: '繪本閱讀' }, { key: 'exam', label: '考卷分析' }, { key: 'milestone', label: '學習里程碑' }].map(t => (
                  <button key={t.key} onClick={() => setRecordForm(f => ({ ...f, type: t.key as any }))}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: recordForm.type === t.key ? '#7B9EBD' : 'white', color: recordForm.type === t.key ? 'white' : '#6B7B8D', border: `1px solid ${recordForm.type === t.key ? '#7B9EBD' : '#E8E0D5'}` }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: '#2D3436' }}>描述</label>
              <textarea value={recordForm.desc} onChange={e => setRecordForm(f => ({ ...f, desc: e.target.value }))} placeholder="描述學習內容或里程碑…" rows={3} className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none border" style={{ borderColor: '#E8E0D5', color: '#2D3436' }} />
            </div>
            <button onClick={addRecord} className="w-full py-4 rounded-2xl font-bold text-base text-white" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
              儲存紀錄
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
