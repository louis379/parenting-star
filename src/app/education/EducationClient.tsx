'use client'

import { useState } from 'react'
import { BookOpen, ClipboardList, MessageSquare, Lightbulb, GraduationCap, Camera, FileText, TrendingUp, Info, CheckCircle, Star } from 'lucide-react'

type MainTab = 'knowledge' | 'records'

const languageStages = [
  { age: '0–3 月', vocab: '哭聲區分', sentence: '反射性發聲', note: '對聲音有反應，哭聲開始分化' },
  { age: '4–6 月', vocab: '牙牙學語', sentence: '重複音節（ba ba, ma ma）', note: '開始模仿口型，笑聲社交化' },
  { age: '9–12 月', vocab: '第一個詞', sentence: '單詞表達多種意思', note: '"媽媽"用於呼叫、請求、抗議' },
  { age: '18 月', vocab: '10–20 詞', sentence: '兩詞組合', note: '"喝水"、"爸爸走"' },
  { age: '24 月', vocab: '50+ 詞', sentence: '2–3 詞短句', note: '詞彙爆發期，每週新增詞彙' },
  { age: '3 歲', vocab: '200–300 詞', sentence: '3–4 詞完整句', note: '能敘述簡單事件，問「為什麼」' },
  { age: '4 歲', vocab: '1000+ 詞', sentence: '複雜句型', note: '使用連接詞（因為、但是）' },
  { age: '5 歲', vocab: '2000+ 詞', sentence: '成人語法', note: '能講故事，理解反話、玩笑' },
]

const piagetStages = [
  {
    stage: '感覺動作期',
    age: '0–2 歲',
    key: '用感官和動作認識世界',
    traits: ['客體永久性（8–12 月出現）', '模仿學習', '因果概念萌發'],
    tips: ['提供多元感官刺激', '玩藏東西遊戲', '讓孩子自由探索安全環境'],
    color: '#7BA87B',
    bg: '#EBF4EB',
  },
  {
    stage: '前運思期',
    age: '2–7 歲',
    key: '符號思維，但以自我為中心',
    traits: ['自我中心思維', '萬物有靈論', '缺乏守恆概念', '象徵遊戲活躍'],
    tips: ['角色扮演遊戲', '不急著糾正「錯誤」邏輯', '繪本建立因果思維'],
    color: '#7B9EBD',
    bg: '#EBF4FF',
  },
  {
    stage: '具體運思期',
    age: '7–12 歲',
    key: '邏輯思維，但需具體物件輔助',
    traits: ['守恆概念建立', '分類與序列', '去除自我中心', '理解規則'],
    tips: ['操作性學習（積木、測量）', '自然觀察實驗', '建立規律作息'],
    color: '#D4956A',
    bg: '#FDF0E8',
  },
  {
    stage: '形式運思期',
    age: '12 歲+',
    key: '抽象邏輯、假設演繹',
    traits: ['抽象推理', '假設思維', '系統性問題解決', '道德哲學思考'],
    tips: ['辯論討論', '科學實驗設計', '鼓勵質疑與批判性思維'],
    color: '#9B8BB4',
    bg: '#F0EBF8',
  },
]

const learningGuide = [
  { age: '0–2 歲', style: '感官探索', method: '看、摸、聽、嚐', avoid: '過度限制探索' },
  { age: '2–4 歲', style: '遊戲式學習', method: '扮家家酒、積木、歌謠', avoid: '填鴨式記憶' },
  { age: '4–6 歲', style: '問答啟發', method: '故事書、自然觀察、簡單實驗', avoid: '過早學術化' },
  { age: '6–9 歲', style: '概念建立', method: '閱讀、數學操作、小組合作', avoid: '單純死記' },
  { age: '9–12 歲', style: '系統學習', method: '專題研究、辯論、自主閱讀', avoid: '一種學習風格' },
]

export default function EducationClient() {
  const [mainTab, setMainTab] = useState<MainTab>('knowledge')
  const [knowledgeSection, setKnowledgeSection] = useState<'language' | 'piaget' | 'guide'>('language')

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg, #A8C8A8 0%, #7BA87B 45%, #5A8A5A 100%)' }}
      >
        <div className="flex items-center gap-2 text-white mb-4">
          <BookOpen size={22} strokeWidth={2.5} />
          <h1 className="text-xl font-black">教育發展</h1>
        </div>

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
              color: mainTab === 'knowledge' ? '#5A8A5A' : 'rgba(255,255,255,0.85)',
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
              color: mainTab === 'records' ? '#5A8A5A' : 'rgba(255,255,255,0.85)',
            }}
          >
            <ClipboardList size={15} />
            我的紀錄
          </button>
        </div>
      </div>

      {/* === 專業知識 Tab === */}
      {mainTab === 'knowledge' && (
        <div>
          {/* Knowledge sub-nav */}
          <div
            className="flex gap-1 px-5 py-3 overflow-x-auto border-b"
            style={{ borderColor: '#E8E0D5', background: 'white' }}
          >
            {[
              { key: 'language', label: '語言發展', icon: MessageSquare },
              { key: 'piaget', label: '認知階段', icon: Lightbulb },
              { key: 'guide', label: '學習引導', icon: GraduationCap },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setKnowledgeSection(key as any)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
                style={{
                  background: knowledgeSection === key ? '#7BA87B' : 'white',
                  color: knowledgeSection === key ? 'white' : '#6B7B8D',
                  borderColor: knowledgeSection === key ? '#7BA87B' : '#E8E0D5',
                }}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          <div className="px-5 py-5 space-y-4">
            {/* 語言發展 */}
            {knowledgeSection === 'language' && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>語言發展里程碑</h2>
                  <span className="evidence-badge">Cochrane A</span>
                </div>
                <div
                  className="rounded-2xl overflow-hidden border"
                  style={{ borderColor: '#B8D8B8' }}
                >
                  <div
                    className="grid grid-cols-3 px-3 py-2 text-xs font-bold"
                    style={{ background: '#EBF4EB', color: '#5A8A5A' }}
                  >
                    <span>年齡</span>
                    <span>詞彙量</span>
                    <span>句型</span>
                  </div>
                  {languageStages.map((row, i) => (
                    <div key={row.age}>
                      <div
                        className="grid grid-cols-3 px-3 py-2.5 text-xs border-t"
                        style={{
                          background: i % 2 === 0 ? 'white' : '#F5FBF5',
                          borderColor: '#E0F0E0',
                        }}
                      >
                        <span className="font-medium" style={{ color: '#2D3436' }}>{row.age}</span>
                        <span style={{ color: '#5A8A5A' }}>{row.vocab}</span>
                        <span style={{ color: '#6B7B8D' }}>{row.sentence}</span>
                      </div>
                      <div
                        className="px-3 pb-2 text-xs border-t"
                        style={{ background: i % 2 === 0 ? 'white' : '#F5FBF5', borderColor: '#E0F0E0', color: '#8E9EAD' }}
                      >
                        ↳ {row.note}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="flex items-start gap-2 p-3 rounded-xl border"
                  style={{ background: '#EBF4EB', borderColor: '#B8D8B8' }}
                >
                  <Info size={14} className="shrink-0 mt-0.5" style={{ color: '#5A8A5A' }} />
                  <p className="text-xs" style={{ color: '#3A6A3A' }}>
                    語言發展落後 3 個月以上，或 2 歲後仍不到 50 個詞，建議諮詢語言治療師。
                  </p>
                </div>
              </>
            )}

            {/* 皮亞傑認知階段 */}
            {knowledgeSection === 'piaget' && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>皮亞傑認知發展</h2>
                  <span className="evidence-badge">心理學經典</span>
                </div>
                <div className="space-y-3">
                  {piagetStages.map((stage) => (
                    <div
                      key={stage.stage}
                      className="p-4 rounded-2xl border"
                      style={{ background: 'white', borderColor: '#E8E0D5' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span
                            className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold mb-1"
                            style={{ background: stage.bg, color: stage.color }}
                          >
                            {stage.age}
                          </span>
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
                      <div style={{ background: stage.bg }} className="p-3 rounded-xl">
                        <p className="text-xs font-bold mb-1.5" style={{ color: stage.color }}>親子互動建議</p>
                        {stage.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-1.5 mb-1">
                            <CheckCircle size={11} className="shrink-0 mt-0.5" style={{ color: stage.color }} />
                            <span className="text-xs" style={{ color: '#2D3436' }}>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 學習引導 */}
            {knowledgeSection === 'guide' && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>各年齡學習引導方式</h2>
                  <span className="evidence-badge">Cochrane B</span>
                </div>
                <div className="space-y-2">
                  {learningGuide.map((g) => (
                    <div
                      key={g.age}
                      className="p-4 rounded-2xl border"
                      style={{ background: 'white', borderColor: '#E8E0D5' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm" style={{ color: '#2D3436' }}>{g.age}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-lg font-medium"
                          style={{ background: '#EBF4EB', color: '#5A8A5A' }}
                        >
                          {g.style}
                        </span>
                      </div>
                      <p className="text-xs mb-1" style={{ color: '#6B7B8D' }}>
                        <span className="font-medium" style={{ color: '#5A8A5A' }}>推薦：</span>{g.method}
                      </p>
                      <p className="text-xs" style={{ color: '#8E9EAD' }}>
                        <span className="font-medium" style={{ color: '#C45A5A' }}>避免：</span>{g.avoid}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* === 我的紀錄 Tab === */}
      {mainTab === 'records' && (
        <div className="px-5 py-5 space-y-5">
          {/* AI 分析工具 */}
          <section>
            <h2 className="font-bold mb-3" style={{ color: '#2D3436' }}>AI 學習分析</h2>
            <div className="space-y-3">
              <div
                className="p-4 rounded-2xl border"
                style={{ background: 'white', borderColor: '#B8D8B8' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Camera size={18} style={{ color: '#7BA87B' }} />
                  <span className="font-semibold text-sm" style={{ color: '#2D3436' }}>上傳唸繪本影片</span>
                </div>
                <p className="text-xs mb-3" style={{ color: '#6B7B8D' }}>
                  AI 分析閱讀困難 vs. 發音問題，識別是否需要語言治療評估
                </p>
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border"
                  style={{ background: '#EBF4EB', borderColor: '#7BA87B', color: '#5A8A5A' }}
                >
                  上傳影片分析
                </button>
              </div>

              <div
                className="p-4 rounded-2xl border"
                style={{ background: 'white', borderColor: '#B8D8B8' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={18} style={{ color: '#7BA87B' }} />
                  <span className="font-semibold text-sm" style={{ color: '#2D3436' }}>上傳考卷照片</span>
                </div>
                <p className="text-xs mb-3" style={{ color: '#6B7B8D' }}>
                  分析易錯題型、知識漏洞，給出針對性複習建議
                </p>
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border"
                  style={{ background: '#EBF4EB', borderColor: '#7BA87B', color: '#5A8A5A' }}
                >
                  拍照分析
                </button>
              </div>
            </div>
          </section>

          {/* 學習進度追蹤 */}
          <section>
            <h2 className="font-bold mb-3" style={{ color: '#2D3436' }}>學習進度追蹤</h2>
            <div
              className="p-4 rounded-2xl border text-center"
              style={{ background: 'white', borderColor: '#E8E0D5' }}
            >
              <TrendingUp size={32} className="mx-auto mb-2" style={{ color: '#C0D8C0' }} />
              <p className="font-semibold text-sm mb-1" style={{ color: '#2D3436' }}>尚無學習記錄</p>
              <p className="text-xs mb-3" style={{ color: '#6B7B8D' }}>記錄孩子的學習里程碑，AI 追蹤進度變化</p>
              <button
                className="px-6 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7BA87B, #5A8A5A)' }}
              >
                新增學習記錄
              </button>
            </div>
          </section>

          {/* 才藝班推薦 */}
          <section>
            <h2 className="font-bold mb-3" style={{ color: '#2D3436' }}>才藝班建議</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: '音樂律動', age: '1歲+', desc: '聽覺、節奏感、情緒' },
                { name: '美術創作', age: '2歲+', desc: '精細動作、創造力' },
                { name: '體能課', age: '1.5歲+', desc: '大動作、社交、自信' },
                { name: '語言啟蒙', age: '3歲+', desc: '語言、認知、邏輯' },
              ].map((c) => (
                <div
                  key={c.name}
                  className="p-3 rounded-2xl border"
                  style={{ background: 'white', borderColor: '#E8E0D5' }}
                >
                  <div
                    className="text-xs px-2 py-0.5 rounded-lg inline-block mb-1.5 font-medium"
                    style={{ background: '#EBF4EB', color: '#5A8A5A' }}
                  >
                    {c.age}
                  </div>
                  <p className="font-bold text-sm mb-0.5" style={{ color: '#2D3436' }}>{c.name}</p>
                  <p className="text-xs" style={{ color: '#6B7B8D' }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
