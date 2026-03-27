'use client'

import { useState } from 'react'
import {
  Brain, BookOpen, ClipboardList, Heart, Users, Focus, Target,
  Camera, FileVideo, Sparkles, AlertTriangle, CheckCircle2, ChevronRight,
  Info, TrendingUp, Plus, X, Clock,
} from 'lucide-react'

type MainTab = 'knowledge' | 'records'
type KnowledgeSection = 'emotion' | 'attachment' | 'focus' | 'social'
type SituationType = 'crying' | 'social' | 'focus' | 'sleep' | 'separation'

const AGE_GROUPS = [
  { key: '0-6m', label: '0–6月' },
  { key: '6-18m', label: '6–18月' },
  { key: '18m-3y', label: '18月–3歲' },
  { key: '3-6y', label: '3–6歲' },
  { key: '6-12y', label: '6–12歲' },
]

const EMOTION_DATA: Record<string, {
  title: string
  features: string[]
  normal: string[]
  warnings: string[]
  tip: string
  evidence: string
}> = {
  '0-6m': {
    title: '基礎情緒期',
    features: ['能感受快樂、悲傷、驚訝、厭惡等基本情緒', '主要透過哭泣表達需求', '對照顧者聲音有明顯反應'],
    normal: ['哭聲不同（餓/累/痛）', '對人臉有特別注意', '4–6月開始社交微笑'],
    warnings: ['持續哭泣超過3小時（腸絞痛注意）', '缺乏眼神接觸', '對聲音無反應'],
    tip: '規律回應哭聲，建立安全感。不要擔心「寵壞」—— 及時回應是建立依附的基礎。',
    evidence: 'Cochrane A',
  },
  '6-18m': {
    title: '社會情緒萌發',
    features: ['陌生人焦慮出現（約8月）', '開始模仿大人表情', '分離焦慮高峰期（9–18月）'],
    normal: ['看到陌生人哭鬧', '找不到媽媽時焦慮', '喜歡躲貓貓遊戲'],
    warnings: ['完全無分離焦慮（可能依附問題）', '18月後仍無指物動作', '缺乏共同注意力'],
    tip: '建立固定照顧者，減少突然分離。分開時給予固定告別儀式，增加可預測性。',
    evidence: 'Cochrane A',
  },
  '18m-3y': {
    title: '自我意識覺醒',
    features: ['「可怕的兩歲」，強烈表達自主意志', '情緒起伏大，轉換困難', '開始理解羞愧/驕傲等複雜情緒'],
    normal: ['因挫折大哭大鬧', '說「不要」頻繁', '搶玩具、咬人（情緒調節不足）'],
    warnings: ['語言理解明顯落後', '對同伴完全無興趣', '重複行為影響日常生活'],
    tip: '給予選擇空間（「要蘋果還是香蕉？」），用語言幫孩子命名情緒（「你很生氣，因為……」）。',
    evidence: 'Cochrane A',
  },
  '3-6y': {
    title: '情緒理解成長',
    features: ['能理解他人情緒', '開始玩假想遊戲，同理心萌發', '能用語言描述自己感受'],
    normal: ['因規則不公平大哭', '害怕黑暗/怪獸（正常恐懼）', '競爭心強，輸了很難受'],
    warnings: ['持續攻擊同伴', '極度恐懼干擾日常', '完全無法等待輪流'],
    tip: '繪本、角色扮演是情緒教育最佳工具。讓孩子在安全環境中練習處理負面情緒。',
    evidence: 'Cochrane A',
  },
  '6-12y': {
    title: '複雜情緒整合',
    features: ['能同時感受多種情緒', '開始理解社交規範', '自我調節能力增強'],
    normal: ['因同伴關係大喜大悲', '對不公平非常敏感', '開始在乎「面子」'],
    warnings: ['持續退縮、不願上學', '頻繁身體不適（頭痛/胃痛）無生理原因', '明顯情緒低落超過2週'],
    tip: '教導「情緒日記」，鼓勵表達而非壓抑。讓孩子知道所有情緒都是被允許的。',
    evidence: 'Cochrane B',
  },
}

const attachmentTypes = [
  {
    type: '安全型依附',
    desc: '孩子把照顧者當安全基地，能探索環境，分離焦慮合理，照顧者回來後容易安撫。',
    tips: ['穩定回應孩子需求', '建立可預測的日常作息', '溫暖的肢體接觸'],
    color: '#5A8A5A',
    bg: '#EBF4EB',
    rate: '~65%',
  },
  {
    type: '焦慮型依附',
    desc: '對分離極度焦慮，照顧者回來後難以平復，需要持續確認愛。',
    tips: ['增加肌膚接觸與安撫', '固定出發/回來的儀式', '避免忽視與過度保護'],
    color: '#B07548',
    bg: '#FDF0E8',
    rate: '~20%',
  },
  {
    type: '逃避型依附',
    desc: '壓抑情緒需求，分離不哭，照顧者回來也不主動親近，表面獨立。',
    tips: ['主動發起身體接觸', '不要因孩子不哭就忽略', '創造安全的情緒表達環境'],
    color: '#5E85A3',
    bg: '#EBF4FF',
    rate: '~15%',
  },
]

const focusGuide = [
  { age: '1–2 歲', duration: '2–5 分鐘', activity: '簡單疊積木、圖片書', assess: '能否在無干擾下專注一項活動至少2分鐘' },
  { age: '3–4 歲', duration: '5–10 分鐘', activity: '拼圖、角色扮演遊戲', assess: '能否完成簡單拼圖（4–6片）而不中途放棄' },
  { age: '5–6 歲', duration: '10–15 分鐘', activity: '繪畫、簡單桌遊', assess: '能否坐下來聽故事書15分鐘' },
  { age: '7–10 歲', duration: '20–30 分鐘', activity: '作業、閱讀、複雜積木', assess: '能否在家完成作業而不需頻繁提醒' },
  { age: '11 歲+', duration: '45 分鐘+', activity: '長時間閱讀、學習任務', assess: '能否自主完成長期作業計畫' },
]

const socialGuide = [
  { age: '0–1 歲', skill: '眼神接觸、互動性微笑、牙牙學語對話', type: '平行前期', evidence: 'A' },
  { age: '1–2 歲', skill: '平行遊戲（各玩各的）、指物給他人看', type: '平行遊戲', evidence: 'A' },
  { age: '2–3 歲', skill: '開始聯合遊戲、分享困難但嘗試、爭玩具', type: '聯合遊戲', evidence: 'A' },
  { age: '3–4 歲', skill: '合作遊戲、輪流等待、開始有好朋友', type: '合作遊戲', evidence: 'A' },
  { age: '5–6 歲', skill: '理解社交規則、處理衝突、維持友誼', type: '友誼建立', evidence: 'A' },
  { age: '6–12 歲', skill: '同伴認同感強、小圈圈形成、道義友誼', type: '友誼深化', evidence: 'A' },
]

const SITUATION_TYPES = [
  { key: 'crying', label: '🔊 哭鬧', color: '#C45A5A', bg: '#FFF0F0' },
  { key: 'social', label: '👥 社交', color: '#5E85A3', bg: '#EBF4FF' },
  { key: 'focus', label: '📚 專注力', color: '#5A8A5A', bg: '#EBF4EB' },
  { key: 'sleep', label: '🌙 睡眠抗拒', color: '#7A6A96', bg: '#F0EBF8' },
  { key: 'separation', label: '💔 分離焦慮', color: '#B07548', bg: '#FDF0E8' },
]

const AI_ANALYSIS: Record<string, { results: Array<{ type: 'warning' | 'ok'; title: string; detail: string; suggestion: string }> }> = {
  crying: {
    results: [
      { type: 'warning', title: '可能原因：需求未被識別', detail: '3歲幼兒哭鬧常因語言表達不足，無法清楚說明需求（餓/累/疼痛/受挫）。', suggestion: '用「猜猜我的需求」方式：「你是餓了嗎？累了嗎？還是玩具壞了不開心？」幫助孩子識別自身狀態。' },
      { type: 'ok', title: '建議替代話術', detail: '避免「不要哭」「哭什麼哭」，這會讓孩子壓抑情緒。', suggestion: '改用「媽媽看到你很難過，我在這裡。深呼吸，告訴我發生什麼事？」' },
    ],
  },
  social: {
    results: [
      { type: 'warning', title: '社交障礙點識別', detail: '從描述看，孩子在群體活動中退縮，可能是缺乏社交技巧而非不想互動。', suggestion: '先從一對一玩伴開始，選擇孩子有共同興趣的同伴，在家中先練習分享和輪流。' },
      { type: 'ok', title: '引導方式建議', detail: '結構化的遊戲（有規則的桌遊）比自由遊戲更容易讓社交困難的孩子融入。', suggestion: '設計簡單合作遊戲（一起搭積木、完成拼圖），減少競爭壓力。' },
    ],
  },
  focus: {
    results: [
      { type: 'warning', title: '專注力現況評估', detail: '5歲孩子正常專注時間約10–15分鐘。若低於5分鐘且伴隨衝動行為，需進一步評估。', suggestion: '先排除環境因素（雜亂、螢幕時間過多），調整後觀察2–4週。' },
      { type: 'ok', title: '居家訓練建議', detail: '漸進式延長專注訓練：每天固定時間進行5分鐘安靜活動，每週增加1分鐘。', suggestion: '使用計時器讓孩子看到時間，完成後給予明確稱讚而非物質獎勵。' },
    ],
  },
  sleep: {
    results: [
      { type: 'warning', title: '睡眠抗拒可能原因', detail: '2–5歲是睡眠抗拒高峰，常見原因：分離焦慮、過度刺激、作息不規律、床墊不適。', suggestion: '建立固定睡前儀式（洗澡→繪本→道晚安），每晚順序相同，持續2週。' },
      { type: 'ok', title: '漸進分離法', detail: '若孩子需要陪伴入睡，可用漸進方式：第一週坐在床邊，第二週坐在門口，逐步增加距離。', suggestion: '給孩子「過渡客體」（安撫布/玩具），作為照顧者的象徵替代。' },
    ],
  },
  separation: {
    results: [
      { type: 'warning', title: '分離焦慮嚴重度評估', detail: '3歲後的分離焦慮若影響正常入學/社交，需特別關注。', suggestion: '避免偷偷離開，每次離開前固定道別儀式（「媽媽去工作，下午3點回來接你」），說到做到建立信任。' },
      { type: 'ok', title: '增強安全感方法', detail: '短暫分離練習：從10分鐘開始，讓孩子體驗「你離開了，但你會回來」。', suggestion: '留下代表你的物品（你的舊圍巾/照片），讓孩子感覺你始終在。' },
    ],
  },
}

interface PsychRecord {
  id: string
  date: string
  situation: SituationType
  desc: string
  analyzed: boolean
}

export default function PsychologyClient() {
  const [mainTab, setMainTab] = useState<MainTab>('knowledge')
  const [knowledgeSection, setKnowledgeSection] = useState<KnowledgeSection>('emotion')
  const [selectedAge, setSelectedAge] = useState('3-6y')
  const [situationType, setSituationType] = useState<SituationType>('crying')
  const [records, setRecords] = useState<PsychRecord[]>([
    { id: '1', date: '2026-03-20', situation: 'crying', desc: '在超市因為不能買零食大哭20分鐘，完全無法安撫', analyzed: true },
    { id: '2', date: '2026-03-25', situation: 'social', desc: '在遊樂場一直獨自玩，不願意和其他小朋友互動', analyzed: false },
  ])
  const [showRecordForm, setShowRecordForm] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [recordForm, setRecordForm] = useState({ date: new Date().toISOString().split('T')[0], situation: 'crying' as SituationType, desc: '' })

  const emotionData = EMOTION_DATA[selectedAge]

  function addRecord() {
    if (!recordForm.desc) return
    setRecords(r => [...r, { id: Date.now().toString(), ...recordForm, analyzed: false }])
    setShowRecordForm(false)
    setRecordForm({ date: new Date().toISOString().split('T')[0], situation: 'crying', desc: '' })
  }

  const aiResults = AI_ANALYSIS[situationType]?.results ?? []

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: 'linear-gradient(160deg, #A8C5DA 0%, #7B9EBD 45%, #5E85A3 100%)' }}>
        <div className="flex items-center gap-2 text-white mb-4">
          <Brain size={22} strokeWidth={2.5} />
          <h1 className="text-xl font-black">心理培養</h1>
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
          {/* Sub-nav */}
          <div className="flex gap-1 px-5 py-3 overflow-x-auto border-b" style={{ borderColor: '#E8E0D5', background: 'white' }}>
            {[
              { key: 'emotion', label: '情緒發展', icon: Heart },
              { key: 'attachment', label: '依附關係', icon: Heart },
              { key: 'focus', label: '專注力', icon: Focus },
              { key: 'social', label: '社交力', icon: Users },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setKnowledgeSection(key as KnowledgeSection)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
                style={{ background: knowledgeSection === key ? '#7B9EBD' : 'white', color: knowledgeSection === key ? 'white' : '#6B7B8D', borderColor: knowledgeSection === key ? '#7B9EBD' : '#E8E0D5' }}
              >
                <Icon size={12} />{label}
              </button>
            ))}
          </div>

          {/* 情緒發展 */}
          {knowledgeSection === 'emotion' && (
            <div>
              <div className="px-5 py-3 border-b" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#6B7B8D' }}>選擇年齡段</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {AGE_GROUPS.map(({ key, label }) => (
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
                  <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>{emotionData.title}</h2>
                  <span className="evidence-badge">{emotionData.evidence}</span>
                </div>

                <div className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#C5D8E8' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#5E85A3' }}>情緒特徵</p>
                  <div className="space-y-1.5">
                    {emotionData.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: '#7B9EBD' }} />
                        <p className="text-sm" style={{ color: '#2D3436' }}>{f}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#5A8A5A' }}>✅ 正常表現</p>
                  <div className="space-y-1.5">
                    {emotionData.normal.map((n, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: '#5A8A5A' }} />
                        <p className="text-sm" style={{ color: '#2D3436' }}>{n}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border" style={{ background: '#FFF8F8', borderColor: '#F5C5C5' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#C45A5A' }}>⚠️ 需注意的警訊</p>
                  <div className="space-y-1.5">
                    {emotionData.warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertTriangle size={13} className="shrink-0 mt-0.5" style={{ color: '#C45A5A' }} />
                        <p className="text-sm" style={{ color: '#2D3436' }}>{w}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#EBF4FF', borderColor: '#C5D8E8' }}>
                  <Target size={14} className="shrink-0 mt-0.5" style={{ color: '#5E85A3' }} />
                  <p className="text-xs leading-relaxed" style={{ color: '#5E85A3' }}>{emotionData.tip}</p>
                </div>
              </div>
            </div>
          )}

          {/* 依附關係 */}
          {knowledgeSection === 'attachment' && (
            <div className="px-5 py-5 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>依附關係類型</h2>
                <span className="evidence-badge">Cochrane A</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7B8D' }}>
                依附理論由 Bowlby 提出，早期依附關係影響孩子一生的人際模式。安全依附是目標，但任何類型都可以透過後天引導改善。
              </p>
              <div className="space-y-3">
                {attachmentTypes.map(t => (
                  <div key={t.type} className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm px-3 py-1 rounded-xl" style={{ background: t.bg, color: t.color }}>{t.type}</span>
                      <span className="text-xs" style={{ color: '#8E9EAD' }}>佔比約 {t.rate}</span>
                    </div>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: '#6B7B8D' }}>{t.desc}</p>
                    <div className="p-3 rounded-xl" style={{ background: t.bg }}>
                      <p className="text-xs font-bold mb-1.5" style={{ color: t.color }}>引導建議</p>
                      {t.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-1.5 mb-1">
                          <CheckCircle2 size={12} className="shrink-0 mt-0.5" style={{ color: t.color }} />
                          <span className="text-xs" style={{ color: '#2D3436' }}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 專注力 */}
          {knowledgeSection === 'focus' && (
            <div className="px-5 py-5 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>專注力發展標準</h2>
                <span className="evidence-badge">Cochrane B</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7B8D' }}>
                專注力隨年齡自然發展，過早要求高專注可能造成反效果。以下為各年齡正常持續專注時間參考。
              </p>
              <div className="space-y-3">
                {focusGuide.map(f => (
                  <div key={f.age} className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm" style={{ color: '#2D3436' }}>{f.age}</span>
                      <span className="text-sm font-black px-3 py-0.5 rounded-xl" style={{ background: '#EBF4FF', color: '#5E85A3' }}>{f.duration}</span>
                    </div>
                    <p className="text-xs mb-1.5" style={{ color: '#6B7B8D' }}>推薦活動：{f.activity}</p>
                    <div className="flex items-start gap-1.5 p-2 rounded-lg" style={{ background: '#F5F8FF' }}>
                      <Clock size={11} className="shrink-0 mt-0.5" style={{ color: '#7B9EBD' }} />
                      <p className="text-xs" style={{ color: '#6B7B8D' }}>如何評估：{f.assess}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl border" style={{ background: '#FFF8F0', borderColor: '#F5D5A8' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#B07548' }}>ADHD 提醒</p>
                <p className="text-xs leading-relaxed" style={{ color: '#8A5A28' }}>
                  若孩子專注時間明顯低於同齡，且伴隨衝動、坐立難安等情形，建議諮詢兒童精神科或職能治療師評估 ADHD。不要自行貼標籤，需由專業人員評估。
                </p>
              </div>
            </div>
          )}

          {/* 社交力 */}
          {knowledgeSection === 'social' && (
            <div className="px-5 py-5 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>社交力發展里程碑</h2>
                <span className="evidence-badge">Cochrane A</span>
              </div>
              <div className="space-y-2">
                {socialGuide.map(s => (
                  <div key={s.age} className="p-3 rounded-xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: '#EBF4FF', color: '#5E85A3' }}>{s.age}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F5E6C8', color: '#B07548' }}>{s.type}</span>
                    </div>
                    <p className="text-sm" style={{ color: '#2D3436' }}>{s.skill}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 p-4 rounded-2xl border" style={{ background: '#FFF8F0', borderColor: '#F5D5A8' }}>
                <Info size={16} className="shrink-0 mt-0.5" style={{ color: '#B07548' }} />
                <p className="text-xs leading-relaxed" style={{ color: '#8A5A28' }}>
                  若孩子在18個月後仍缺乏眼神接觸、指物、呼名反應，建議進行自閉症早期篩檢（M-CHAT）。早期發現、早期介入效果最佳。
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === 家長紀錄 Tab === */}
      {mainTab === 'records' && (
        <div className="px-5 py-5 space-y-5">
          {/* 上傳媒體 */}
          <section>
            <h2 className="font-bold mb-3" style={{ color: '#2D3436' }}>上傳情境記錄</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border active:opacity-70" style={{ background: 'white', borderColor: '#C5D8E8' }}>
                <Camera size={24} style={{ color: '#7B9EBD' }} />
                <span className="text-xs font-semibold" style={{ color: '#5E85A3' }}>上傳照片</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border active:opacity-70" style={{ background: 'white', borderColor: '#C5D8E8' }}>
                <FileVideo size={24} style={{ color: '#7B9EBD' }} />
                <span className="text-xs font-semibold" style={{ color: '#5E85A3' }}>上傳影片</span>
              </button>
            </div>
          </section>

          {/* 情境記錄 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold" style={{ color: '#2D3436' }}>情境描述紀錄</h2>
              <button onClick={() => setShowRecordForm(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white" style={{ background: '#7B9EBD' }}>
                <Plus size={12} />新增
              </button>
            </div>
            <div className="space-y-2">
              {[...records].reverse().map(r => {
                const st = SITUATION_TYPES.find(s => s.key === r.situation)
                return (
                  <div key={r.id} className="p-3 rounded-xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: '#2D3436' }}>{r.date}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: st?.bg, color: st?.color }}>{st?.label}</span>
                    </div>
                    <p className="text-sm" style={{ color: '#6B7B8D' }}>{r.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* AI 分析 */}
          <section>
            <div className="p-4 rounded-2xl border" style={{ background: '#F5F8FF', borderColor: '#C5D8E8' }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} style={{ color: '#7B9EBD' }} />
                <h3 className="font-bold" style={{ color: '#2D3436' }}>AI 行為分析</h3>
              </div>
              <p className="text-xs mb-2" style={{ color: '#6B7B8D' }}>選擇要分析的情境類型：</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {SITUATION_TYPES.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setSituationType(s.key as SituationType)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: situationType === s.key ? s.color : 'white', color: situationType === s.key ? 'white' : s.color, border: `1px solid ${s.color}` }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAI(true)}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}
              >
                <Sparkles size={16} />AI 分析此情境
              </button>
            </div>
          </section>

          {/* AI 分析結果 */}
          {showAI && (
            <section>
              <h2 className="font-bold mb-3" style={{ color: '#2D3436' }}>
                AI 分析結果 — {SITUATION_TYPES.find(s => s.key === situationType)?.label}
              </h2>
              <div className="space-y-3">
                {aiResults.map((r, i) => (
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
              <p className="text-xs text-center mt-3" style={{ color: '#8E9EAD' }}>* 此為模擬分析結果</p>
            </section>
          )}

          {/* 改善追蹤報告 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} style={{ color: '#7B9EBD' }} />
              <h2 className="font-bold" style={{ color: '#2D3436' }}>改善追蹤時間軸</h2>
            </div>
            <div className="space-y-2">
              {[
                { date: '03/20', event: '哭鬧記錄 #1', status: 'analyzed', note: '超市情境，持續20分鐘' },
                { date: '03/25', event: '社交記錄 #1', status: 'new', note: '遊樂場退縮行為' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: item.status === 'analyzed' ? '#7B9EBD' : '#D4B896' }}>
                      {i + 1}
                    </div>
                    {i < 1 && <div className="w-0.5 h-4" style={{ background: '#E8E0D5' }} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold" style={{ color: '#2D3436' }}>{item.event}</p>
                      <span className="text-xs" style={{ color: '#8E9EAD' }}>{item.date}</span>
                    </div>
                    <p className="text-xs" style={{ color: '#6B7B8D' }}>{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* 新增紀錄 Modal */}
      {showRecordForm && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg" style={{ color: '#2D3436' }}>新增情境紀錄</h2>
              <button onClick={() => setShowRecordForm(false)}><X size={22} style={{ color: '#8E9EAD' }} /></button>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: '#2D3436' }}>日期</label>
              <input type="date" value={recordForm.date} onChange={e => setRecordForm(f => ({ ...f, date: e.target.value }))} className="w-full h-11 px-4 rounded-2xl border text-sm outline-none" style={{ borderColor: '#E8E0D5', color: '#2D3436' }} />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>情境類型</label>
              <div className="flex flex-wrap gap-2">
                {SITUATION_TYPES.map(s => (
                  <button key={s.key} onClick={() => setRecordForm(f => ({ ...f, situation: s.key as SituationType }))}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: recordForm.situation === s.key ? s.color : 'white', color: recordForm.situation === s.key ? 'white' : s.color, border: `1px solid ${s.color}` }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: '#2D3436' }}>情境描述</label>
              <textarea value={recordForm.desc} onChange={e => setRecordForm(f => ({ ...f, desc: e.target.value }))} placeholder="描述當時發生了什麼…" rows={4} className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none border" style={{ borderColor: '#E8E0D5', color: '#2D3436' }} />
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
