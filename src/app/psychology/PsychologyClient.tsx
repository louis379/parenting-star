'use client'

import { useState } from 'react'
import { Brain, BookOpen, ClipboardList, Heart, Users, Focus, Target, Camera, FileText, Sparkles, Info, TrendingUp, CheckCircle } from 'lucide-react'

type MainTab = 'knowledge' | 'records'

const emotionStages = [
  {
    age: '0–6 月',
    title: '基礎情緒期',
    desc: '能感受快樂、悲傷、驚訝、厭惡等基本情緒。主要透過哭泣表達需求。',
    tip: '規律回應哭聲，建立安全感。',
    evidence: 'Cochrane A',
  },
  {
    age: '6–18 月',
    title: '社會情緒萌發',
    desc: '陌生人焦慮出現（約 8 月），開始模仿大人表情，分離焦慮高峰期。',
    tip: '建立固定照顧者，減少突然分離。',
    evidence: 'Cochrane A',
  },
  {
    age: '18 月–3 歲',
    title: '自我意識覺醒',
    desc: '「可怕的兩歲」，強烈表達自主意志，情緒起伏大，開始理解羞愧/驕傲。',
    tip: '給予選擇空間，用語言幫孩子命名情緒。',
    evidence: 'Cochrane A',
  },
  {
    age: '3–6 歲',
    title: '情緒理解成長',
    desc: '能理解他人情緒，開始玩假想遊戲，同理心萌發。',
    tip: '繪本、角色扮演是情緒教育最佳工具。',
    evidence: 'Cochrane A',
  },
  {
    age: '6–12 歲',
    title: '複雜情緒整合',
    desc: '能同時感受多種情緒，開始理解社交規範，自我調節能力增強。',
    tip: '教導「情緒日記」，鼓勵表達而非壓抑。',
    evidence: 'Cochrane B',
  },
]

const attachmentTypes = [
  {
    type: '安全型依附',
    desc: '孩子把照顧者當安全基地，能探索環境，分離焦慮合理，照顧者回來後容易安撫。',
    tips: ['穩定回應孩子需求', '建立可預測的日常作息', '溫暖的肢體接觸'],
    color: '#7BA87B',
    bg: '#EBF4EB',
    rate: '~65%',
  },
  {
    type: '焦慮型依附',
    desc: '對分離極度焦慮，照顧者回來後難以平復，需要持續確認愛。',
    tips: ['增加肌膚接觸與安撫', '固定出發/回來的儀式', '避免忽視與過度保護'],
    color: '#D4956A',
    bg: '#FDF0E8',
    rate: '~20%',
  },
  {
    type: '逃避型依附',
    desc: '壓抑情緒需求，分離不哭，照顧者回來也不主動親近，表面獨立。',
    tips: ['主動發起身體接觸', '不要因孩子不哭就忽略', '創造安全的情緒表達環境'],
    color: '#9B8BB4',
    bg: '#F0EBF8',
    rate: '~15%',
  },
]

const focusGuide = [
  { age: '1–2 歲', duration: '2–5 分鐘', activity: '簡單疊積木、圖片書' },
  { age: '3–4 歲', duration: '5–10 分鐘', activity: '拼圖、角色扮演遊戲' },
  { age: '5–6 歲', duration: '10–15 分鐘', activity: '繪畫、簡單桌遊' },
  { age: '7–10 歲', duration: '20–30 分鐘', activity: '作業、閱讀、複雜積木' },
  { age: '11 歲+', duration: '45 分鐘+', activity: '長時間閱讀、學習任務' },
]

const socialGuide = [
  { age: '0–1 歲', skill: '眼神接觸、互動性微笑、牙牙學語對話', evidence: 'A' },
  { age: '1–2 歲', skill: '平行遊戲（各玩各的）、指物給他人看', evidence: 'A' },
  { age: '2–3 歲', skill: '開始聯合遊戲、分享困難但嘗試、爭玩具', evidence: 'A' },
  { age: '3–4 歲', skill: '合作遊戲、輪流等待、開始有好朋友', evidence: 'A' },
  { age: '5–6 歲', skill: '理解社交規則、處理衝突、維持友誼', evidence: 'A' },
]

export default function PsychologyClient() {
  const [mainTab, setMainTab] = useState<MainTab>('knowledge')
  const [knowledgeSection, setKnowledgeSection] = useState<'emotion' | 'attachment' | 'focus' | 'social'>('emotion')

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-5"
        style={{ background: 'linear-gradient(160deg, #C4B8D4 0%, #9B8BB4 45%, #7A6A96 100%)' }}
      >
        <div className="flex items-center gap-2 text-white mb-4">
          <Brain size={22} strokeWidth={2.5} />
          <h1 className="text-xl font-black">心理培養</h1>
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
              color: mainTab === 'knowledge' ? '#7A6A96' : 'rgba(255,255,255,0.85)',
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
              color: mainTab === 'records' ? '#7A6A96' : 'rgba(255,255,255,0.85)',
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
              { key: 'emotion', label: '情緒發展', icon: Heart },
              { key: 'attachment', label: '依附關係', icon: Heart },
              { key: 'focus', label: '專注力', icon: Focus },
              { key: 'social', label: '社交力', icon: Users },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setKnowledgeSection(key as any)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
                style={{
                  background: knowledgeSection === key ? '#9B8BB4' : 'white',
                  color: knowledgeSection === key ? 'white' : '#6B7B8D',
                  borderColor: knowledgeSection === key ? '#9B8BB4' : '#E8E0D5',
                }}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          <div className="px-5 py-5 space-y-5">
            {/* 情緒發展 */}
            {knowledgeSection === 'emotion' && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>各年齡情緒發展階段</h2>
                  <span className="evidence-badge">Cochrane A</span>
                </div>
                <div className="space-y-3">
                  {emotionStages.map((stage) => (
                    <div
                      key={stage.age}
                      className="p-4 rounded-2xl border"
                      style={{ background: 'white', borderColor: '#E8D5E8' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span
                            className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold mb-1"
                            style={{ background: '#F0EBF8', color: '#7A6A96' }}
                          >
                            {stage.age}
                          </span>
                          <h3 className="font-bold text-sm" style={{ color: '#2D3436' }}>{stage.title}</h3>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: '#6B7B8D' }}>{stage.desc}</p>
                      <div
                        className="flex items-start gap-1.5 p-2 rounded-xl"
                        style={{ background: '#F0EBF8' }}
                      >
                        <Target size={12} className="shrink-0 mt-0.5" style={{ color: '#7A6A96' }} />
                        <p className="text-xs" style={{ color: '#7A6A96' }}>{stage.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 依附關係 */}
            {knowledgeSection === 'attachment' && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>依附關係類型</h2>
                  <span className="evidence-badge">Cochrane A</span>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B7B8D' }}>
                  依附理論由 Bowlby 提出，研究孩子與主要照顧者的情感連結模式。
                  早期依附關係會影響孩子一生的人際關係模式。
                </p>
                <div className="space-y-3">
                  {attachmentTypes.map((t) => (
                    <div
                      key={t.type}
                      className="p-4 rounded-2xl border"
                      style={{ background: 'white', borderColor: '#E8E0D5' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="font-bold text-sm px-3 py-1 rounded-xl"
                          style={{ background: t.bg, color: t.color }}
                        >
                          {t.type}
                        </span>
                        <span className="text-xs" style={{ color: '#8E9EAD' }}>佔比約 {t.rate}</span>
                      </div>
                      <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B7B8D' }}>{t.desc}</p>
                      <div style={{ background: t.bg }} className="p-3 rounded-xl">
                        <p className="text-xs font-bold mb-1.5" style={{ color: t.color }}>引導建議</p>
                        {t.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-1.5 mb-1">
                            <CheckCircle size={12} className="shrink-0 mt-0.5" style={{ color: t.color }} />
                            <span className="text-xs" style={{ color: '#2D3436' }}>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 專注力 */}
            {knowledgeSection === 'focus' && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>專注力發展標準</h2>
                  <span className="evidence-badge">Cochrane B</span>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B7B8D' }}>
                  專注力隨年齡自然發展，過早要求高專注可能造成反效果。
                  以下為各年齡「正常」持續專注時間參考。
                </p>
                <div className="space-y-2">
                  {focusGuide.map((f) => (
                    <div
                      key={f.age}
                      className="p-4 rounded-2xl border"
                      style={{ background: 'white', borderColor: '#E8E0D5' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm" style={{ color: '#2D3436' }}>{f.age}</span>
                        <span
                          className="text-sm font-bold px-3 py-0.5 rounded-xl"
                          style={{ background: '#F0EBF8', color: '#7A6A96' }}
                        >
                          {f.duration}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: '#6B7B8D' }}>適合活動：{f.activity}</p>
                    </div>
                  ))}
                </div>
                <div
                  className="p-4 rounded-2xl border"
                  style={{ background: '#F0EBF8', borderColor: '#D4C5E8' }}
                >
                  <p className="text-xs font-bold mb-1" style={{ color: '#7A6A96' }}>注意</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#5A4A7A' }}>
                    若孩子專注時間明顯低於同齡，且伴隨衝動、坐立難安等情形，建議諮詢兒童精神科或職能治療師評估 ADHD。
                  </p>
                </div>
              </>
            )}

            {/* 社交力 */}
            {knowledgeSection === 'social' && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>社交力發展里程碑</h2>
                  <span className="evidence-badge">Cochrane A</span>
                </div>
                <div className="space-y-2">
                  {socialGuide.map((s) => (
                    <div
                      key={s.age}
                      className="flex items-start gap-3 p-3 rounded-xl border"
                      style={{ background: 'white', borderColor: '#E8E0D5' }}
                    >
                      <div
                        className="shrink-0 px-2 py-0.5 rounded-lg text-xs font-bold mt-0.5"
                        style={{ background: '#F0EBF8', color: '#7A6A96' }}
                      >
                        {s.age}
                      </div>
                      <span className="text-sm" style={{ color: '#2D3436' }}>{s.skill}</span>
                    </div>
                  ))}
                </div>
                <div
                  className="flex items-start gap-2 p-4 rounded-2xl border"
                  style={{ background: '#F0EBF8', borderColor: '#D4C5E8' }}
                >
                  <Info size={16} className="shrink-0 mt-0.5" style={{ color: '#7A6A96' }} />
                  <p className="text-xs leading-relaxed" style={{ color: '#5A4A7A' }}>
                    若孩子在 18 個月後仍缺乏眼神接觸、指物、呼名反應，建議進行自閉症早期篩檢（M-CHAT）。
                  </p>
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
            <h2 className="font-bold mb-3" style={{ color: '#2D3436' }}>AI 行為分析</h2>
            <div className="space-y-3">
              <div
                className="p-4 rounded-2xl border"
                style={{ background: 'white', borderColor: '#D4C5E8' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Camera size={18} style={{ color: '#9B8BB4' }} />
                  <span className="font-semibold text-sm" style={{ color: '#2D3436' }}>上傳哭鬧影片</span>
                </div>
                <p className="text-xs mb-3" style={{ color: '#6B7B8D' }}>
                  AI 分析哭鬧原因、建議溝通方式、識別是否有情緒發展異常跡象
                </p>
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border"
                  style={{ background: '#F0EBF8', borderColor: '#9B8BB4', color: '#7A6A96' }}
                >
                  上傳影片分析
                </button>
              </div>

              <div
                className="p-4 rounded-2xl border"
                style={{ background: 'white', borderColor: '#D4C5E8' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users size={18} style={{ color: '#9B8BB4' }} />
                  <span className="font-semibold text-sm" style={{ color: '#2D3436' }}>上傳社交互動影片</span>
                </div>
                <p className="text-xs mb-3" style={{ color: '#6B7B8D' }}>
                  分析孩子與同伴互動模式，識別社交障礙點，給出具體引導建議
                </p>
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border"
                  style={{ background: '#F0EBF8', borderColor: '#9B8BB4', color: '#7A6A96' }}
                >
                  上傳影片分析
                </button>
              </div>

              <div
                className="p-4 rounded-2xl border"
                style={{ background: 'white', borderColor: '#D4C5E8' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Focus size={18} style={{ color: '#9B8BB4' }} />
                  <span className="font-semibold text-sm" style={{ color: '#2D3436' }}>上傳寫作業影片</span>
                </div>
                <p className="text-xs mb-3" style={{ color: '#6B7B8D' }}>
                  分析孩子專注狀況，評估是否有 ADHD 跡象，提供環境調整建議
                </p>
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border"
                  style={{ background: '#F0EBF8', borderColor: '#9B8BB4', color: '#7A6A96' }}
                >
                  上傳影片分析
                </button>
              </div>
            </div>
          </section>

          {/* 目標追蹤 */}
          <section>
            <h2 className="font-bold mb-3" style={{ color: '#2D3436' }}>目標設定與追蹤</h2>
            <div
              className="p-4 rounded-2xl border text-center"
              style={{ background: 'white', borderColor: '#E8E0D5' }}
            >
              <TrendingUp size={32} className="mx-auto mb-2" style={{ color: '#C4B8D4' }} />
              <p className="font-semibold text-sm mb-1" style={{ color: '#2D3436' }}>尚未設定目標</p>
              <p className="text-xs mb-3" style={{ color: '#6B7B8D' }}>設定情緒或社交發展目標，AI 協助追蹤改善進度</p>
              <button
                className="px-6 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #9B8BB4, #7A6A96)' }}
              >
                新增發展目標
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
