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
  { key: '6-12m', label: '6–12月' },
  { key: '1-2y', label: '1–2歲' },
  { key: '2-3y', label: '2–3歲' },
  { key: '3-5y', label: '3–5歲' },
  { key: '6-8y', label: '6–8歲' },
  { key: '9-12y', label: '9–12歲' },
]

const EMOTION_DATA: Record<string, {
  title: string
  subtitle: string
  features: string[]
  normal: string[]
  rightGuide: string[]
  wrongGuide: string[]
  scriptExample: string
  warnings: string[]
  evidence: string
}> = {
  '0-6m': {
    title: '基礎情緒期',
    subtitle: '社交性微笑、依附萌發',
    features: ['能感受快樂、悲傷、驚訝、厭惡等基本情緒', '約6週出現社交微笑（非反射性，真正回應人臉）', '眼神接觸成為社交溝通的最初工具', '哭泣是唯一溝通方式，已開始分化（餓/累/痛/無聊）', '對照顧者聲音有特別的情緒反應'],
    normal: ['哭聲開始出現差異（餓哭/累哭/痛哭節奏不同）', '被特定照顧者的聲音安撫比陌生人更快', '約6–8週出現第一個真正的社交微笑', '對人臉有特別注意，尤其是眼睛區域'],
    rightGuide: ['及時回應哭聲（建立信任基礎，不用擔心「寵壞」）', '做誇張表情逗笑，等待嬰兒「回應」後再繼續（輪流模式）', '和嬰兒說話時語調誇張放慢（親子語）', '維持固定照顧者，一致性建立安全感'],
    wrongGuide: ['讓嬰兒長時間哭泣不回應（損害依附安全感）', '讓太多不同陌生人照顧，照顧者不穩定', '說「哭什麼哭，不哭了」否定哭泣行為'],
    scriptExample: '當寶寶哭泣：「媽媽來了，你餓了嗎？媽媽在這裡，沒事的。」（溫柔、確定語氣，抱起後輕拍後背，配合安撫聲「嘘嘘嘘」）',
    warnings: ['6週後仍無任何社交微笑', '對照顧者聲音無特別反應', '持續缺乏眼神接觸', '哭泣超過3小時/天（腸絞痛需就醫）'],
    evidence: 'Cochrane A',
  },
  '6-12m': {
    title: '社會情緒萌發',
    subtitle: '陌生人焦慮、物體恆存、分離焦慮高峰',
    features: ['陌生人焦慮出現（約7–8月，看到陌生人哭/縮回）', '分離焦慮開始（約9月），高峰在12–18月', '物體恆存概念發展（約8–12月，知道消失的東西還在）', '共同注意力出現（9–12月，指著東西讓照顧者也看）', '能理解照顧者會離開、也會回來'],
    normal: ['看到陌生人哭鬧或轉頭躲進照顧者懷中', '媽媽離開時嚎啕大哭（正常依附反應）', '搜尋消失的玩具（把布蓋住玩具後會翻找）', '喜歡躲貓貓遊戲（練習「消失→出現」概念）'],
    rightGuide: ['建立固定告別儀式（「媽媽去工作，3點回來接你」）', '照顧者離開時要說再見，不要偷偷走，建立可預測性', '讓孩子接觸不同的人（在安全範圍內，減少日後過度焦慮）', '玩藏貓貓幫助理解「消失後還會回來」，Cochrane證實有效'],
    wrongGuide: ['趁孩子不注意偷溜走（短期有效，長期損害信任感）', '嘲笑分離焦慮「這麼大了還哭」', '強迫孩子跟陌生人互動（「快叫阿姨！」）'],
    scriptExample: '「媽媽要去工作了，阿公會陪你玩。下午3點媽媽會回來，我們拍拍手說拜拜。」（平靜自信語氣，快速告別，不要猶豫徘徊，回頭越多孩子越焦慮）',
    warnings: ['完全無分離焦慮（可能有依附建立問題）', '18月後仍無指物動作', '對所有人反應完全相同（照顧者與陌生人無區別）', '缺乏共同注意力（不會看你再看物品）'],
    evidence: 'Cochrane A',
  },
  '1-2y': {
    title: '自我意識萌芽',
    subtitle: 'Terrible Two前期、平行遊戲、自主意志',
    features: ['自我意識萌芽（約15–18月照鏡子認出自己）', '「不要」成為最常說的詞，表達自主意志', '平行遊戲（各玩各的，不真正互動，這是正常的！）', '情緒爆發期開始，挫折耐受度低', '象徵遊戲開始（拿木棍當電話打）'],
    normal: ['因任何事情說「不要」，即使自己想要', '搶走其他孩子的玩具（所有權概念未建立）', '挫折時大哭倒地，四肢亂打', '玩耍時不願意分享（2歲前大腦尚無法理解分享）'],
    rightGuide: ['提供受限選擇（「要喝水還是牛奶？」而非「要喝什麼？」）', '用語言命名孩子的情緒（「你現在很生氣，因為積木倒了」）', '允許孩子近距離觀察其他孩子玩，不強迫互動', '設定溫和但堅定的界限，態度平靜不動搖'],
    wrongGuide: ['強迫分享（此年齡大腦無法真正理解分享，只會製造衝突）', '在情緒爆發高峰時講道理（無法吸收，等平靜後再說）', '體罰或長時間隔離懲罰'],
    scriptExample: '孩子搶玩具後哭鬧：「我看到你很想要那個玩具，你很不開心。現在玩具是小明的，等他玩完換你。我們去找另一個車子，你要這輛嗎？」（承認情緒→解釋規則→立刻轉移注意）',
    warnings: ['18月後仍無任何有意義的詞彙', '對他人痛苦完全無反應（無同理心萌芽）', '重複刻板行為影響日常', '眼神接觸持續缺乏'],
    evidence: 'Cochrane A',
  },
  '2-3y': {
    title: '情緒爆發期',
    subtitle: 'Terrible Two高峰、同理心萌芽、轉換困難',
    features: ['Terrible Two高峰：情緒調節能力落後語言發展', '轉換困難（從一個活動切換到另一個極度困難）', '同理心開始萌芽（看到別人哭會靠過去安慰）', '象徵遊戲豐富（扮家家酒、扮醫生/老師）', '可理解簡單規則，但挫折時仍難以遵守'],
    normal: ['因挫折/規則/轉換時哭鬧大叫', '咬人/打人（情緒調節未成熟的出口）', '說「我自己來！」堅持獨立完成', '在地上打滾、屏住呼吸（正常策略，不危險）'],
    rightGuide: ['提前5分鐘預告轉換（「再5分鐘就要吃飯了，你要再玩一次還是把玩具收好？」）', '幫孩子命名情緒，不要求立刻停止哭泣', '等情緒完全平息後再溝通（前額葉重新上線需時）', '建立固定作息減少不確定感，降低挫折機會'],
    wrongGuide: ['在情緒爆發時要求「馬上停止哭泣！」', '說「再哭就不要你了」（威脅依附安全感）', '用食物/螢幕轉移情緒（長期養成情緒調節不良模式）', '情緒爆發後立刻給孩子想要的東西（強化爆發行為）'],
    scriptExample: '孩子不想離開遊樂場：「我知道你玩得很開心，你不想走。再5分鐘，你要再溜一次滑梯還是盪一次鞦韆？」→時間到後：「時間到了，我們說拜拜給溜滑梯聽。下次再來。」（給予最後選擇，平靜執行，不討價還價）',
    warnings: ['語言理解明顯落後同齡', '對他人痛苦完全無同理反應', '重複刻板行為嚴重影響日常', '攻擊行為頻繁（每天多次，超過年齡應有程度）'],
    evidence: 'Cochrane A',
  },
  '3-5y': {
    title: '想像力與恐懼期',
    subtitle: '假想遊戲豐富、友誼概念、正常恐懼',
    features: ['豐富想像力（怪獸/黑暗/死亡等恐懼正常出現）', '友誼概念萌芽，開始有特定好朋友', '能遵守簡單規則，公平感強（「不公平！」）', '去自我中心初步開始（能稍微理解他人觀點）', '謊言出現（想象與現實界線模糊，屬正常發展）'],
    normal: ['害怕黑暗/怪獸/打雷/陌生環境（4–6歲恐懼高峰）', '輸了遊戲大哭，競爭心強', '說謊（保護自己/取悅大人）', '因規則不公平激烈抗議'],
    rightGuide: ['承認並命名恐懼（「怪獸讓你很害怕，那很真實的感覺」）', '不嘲笑或否認恐懼，用實際方法「解決」（小夜燈、「趕怪獸噴霧」）', '合作遊戲建立友誼（一起完成任務比競爭更有效）', '用繪本討論情緒和恐懼（《媽媽不見了》《怕黑的小豬》）'],
    wrongGuide: ['「不要怕，怪獸不存在」（否認感受，徒增焦慮）', '強迫參與社交（「去跟那個小朋友玩！」）', '用競爭激勵（「你看哥哥比你厲害多了」）', '對說謊大發雷霆（此年齡部分謊言是正常發展）'],
    scriptExample: '孩子怕黑不敢睡：「你感覺到黑暗裡有什麼，那讓你很害怕，我相信你的感覺。我們一起讓房間更安心好嗎？你要小夜燈還是讓門開一點縫？」（先確認感受，再共同解決）',
    warnings: ['持續攻擊行為（每天，針對特定對象）', '極度恐懼嚴重干擾日常生活（無法上學/睡覺）', '完全無法理解或遵守任何規則', '3歲後完全無友誼形成傾向'],
    evidence: 'Cochrane A',
  },
  '6-8y': {
    title: '規則意識與同儕壓力期',
    subtitle: '公平感強、同儕認同、學校適應',
    features: ['規則意識強，對不公平極度敏感', '同儕認同感增強，在乎朋友眼光', '能較完整理解他人觀點（去自我中心完成）', '自我評價開始受同儕影響', '學習動機可能因同儕競爭而波動'],
    normal: ['對不公平激烈抗議（「為什麼他可以我不行！」）', '因好友關係起伏情緒大波動', '開始在乎外表和穿著', '強烈競爭心，可能有輕微作弊行為', '做作業時需要確認和鼓勵'],
    rightGuide: ['先傾聽再分析，不要急著解決人際問題', '幫助孩子自己思考（「那你覺得可以怎麼做？」）', '維持家庭規則一致性，即使孩子說「別人家可以！」', '限制螢幕時間，引導面對面社交技巧', '稱讚努力過程，不只稱讚結果（成長型思維）'],
    wrongGuide: ['幫孩子解決所有人際問題（剝奪學習機會）', '在乎成績多於學習過程', '說「不要管他們」否定同儕關係的重要性', '和其他孩子比較（「你看xxx多厲害」）'],
    scriptExample: '孩子說「我沒有好朋友，沒人喜歡我」：「我聽到了，你現在覺得很孤單，這很讓人難過。能告訴我今天發生什麼事嗎？」（先傾聽，不急著說「你有朋友的啊」或立刻解決，讓孩子先被理解）',
    warnings: ['持續退縮不願上學超過2週', '頻繁身體不適（頭痛/胃痛）無生理原因', '明顯情緒低落超過2週', '被欺凌的徵象（衣物損壞、不願說學校的事）'],
    evidence: 'Cochrane A',
  },
  '9-12y': {
    title: '前青春期：自我認同探索',
    subtitle: '同儕認同高峰、質疑權威、私人空間需求',
    features: ['自我認同探索（「我是誰」「我擅長什麼」）', '同儕認同達到高峰，朋友比父母更重要', '開始質疑父母和權威的合理性', '情緒波動大（部分因荷爾蒙開始變化）', '私人空間需求增加，秘密增多'],
    normal: ['「你不懂我」「我不想說」（正常界線建立）', '和朋友比與父母更親密，分享更多', '對外表和同儕評價極度敏感', '對批評有強烈反應（不公平感）', '強烈的正義感和道德判斷'],
    rightGuide: ['尊重私人空間，不翻看日記/手機', '保持溝通管道開放但不逼問（「我在這裡，隨時可以說」）', '多問開放式問題（「你覺得呢？」「那怎麼了？」）', '保持穩定的連結關係，每週至少一次只有你們的時間', '一起制定手機使用規則（讓孩子參與，更願意遵守）'],
    wrongGuide: ['偷看日記/手機（發現後信任永久損壞）', '嘲笑青春期的身體變化或情緒', '在孩子的朋友面前批評孩子', '說「你現在這樣都是青春期作怪」一概而論', '與兄弟姊妹比較'],
    scriptExample: '孩子拒絕說學校的事：「你不想說的話我不勉強，我不會追問。不管發生什麼，我都在這裡支持你。如果你什麼時候想說，我會認真聽。」（給空間，清楚表達支持，不是沉默的放棄）',
    warnings: ['明顯抑鬱或焦慮徵象持續超過2週', '自傷行為或言語', '學業表現急劇下滑', '完全與父母切斷所有連結', '危險行為（攻擊/逃跑/物質使用跡象）'],
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
      { type: 'warning', title: '分析：需求未被語言識別', detail: '3歲幼兒哭鬧常因語言表達不足，無法清楚說明需求（餓/累/疼痛/受挫/過度刺激）。哭泣是孩子唯一有效的求救信號。', suggestion: '用「猜猜我的需求」：「你是餓了嗎？還是累了？還是玩具壞了讓你不開心？」幫助孩子識別自身狀態。先安撫身體（抱起、降低刺激），再尋找原因。' },
      { type: 'warning', title: '錯誤話術警示', detail: '常見的「不要哭」「哭什麼哭」「再哭就走了」會讓孩子壓抑情緒或製造焦慮，長期影響情緒調節能力。', suggestion: '替換話術示範：「媽媽看到你很難過，我在這裡陪你。深呼吸，先吸氣……呼氣……好了，告訴媽媽發生什麼事？」（先給情緒空間，再問原因）' },
      { type: 'ok', title: '正確回應流程', detail: 'Cochrane 研究顯示：情緒接納→命名情緒→解決問題，比直接制止效果顯著更好且持久。', suggestion: '步驟①承認：「你現在很生氣/很難過。」→ 步驟②陪伴：「我在這裡，你可以哭。」→ 步驟③平靜後問：「現在好一點了嗎？告訴我你要什麼。」' },
    ],
  },
  social: {
    results: [
      { type: 'warning', title: '分析：可能是缺乏技巧而非不想互動', detail: '從描述看，孩子在群體活動中退縮，通常原因是缺乏社交進入技巧，而非不想與人互動。強迫加入只會增加焦慮。', suggestion: '先從一對一玩伴開始，選擇孩子有共同興趣的同伴。在家中先練習：分享、輪流、如何加入遊戲的語言（「我可以一起玩嗎？」）' },
      { type: 'ok', title: '結構化遊戲優於自由遊戲', detail: '有規則的活動（桌遊、拼圖、積木任務）比自由遊戲更容易讓社交困難的孩子融入，因為規則提供清楚的行為框架。', suggestion: '設計簡單合作任務：「你們兩個一起把積木搭到這麼高。」合作→共同成就感→友誼萌發。避免競爭性遊戲（輸贏製造壓力）。' },
      { type: 'ok', title: '家長示範話術', detail: '孩子需要學習如何開始社交互動。直接教他們具體的語句比說「去和他玩」更有效。', suggestion: '在家練習：「你要說：『我叫XXX，你在玩什麼？我可以看嗎？』」先在安全環境演練，再帶到真實場景。' },
    ],
  },
  focus: {
    results: [
      { type: 'warning', title: '專注力評估：先排除環境因素', detail: '5歲孩子正常專注時間約10–15分鐘。若低於5分鐘且伴隨衝動/多話/靜不下來，需在排除環境因素後才考慮評估ADHD。', suggestion: '先調整2–4週：①減少桌面雜物，②電子螢幕下午3點後完全關閉，③作息規律，④每天至少1小時戶外活動（消耗精力）。觀察是否改善。' },
      { type: 'ok', title: '漸進式專注訓練法', detail: 'Cochrane 研究支持：漸進延長比強迫長時間坐著更有效，且孩子自我效能感更強。', suggestion: '每天固定時間：①設定計時器5分鐘，②孩子選活動（積木/拼圖/畫畫），③完成給予明確口頭讚美（「你剛才專注了整整5分鐘！做到了！」），④每週增加1分鐘。' },
      { type: 'ok', title: '環境優化建議', detail: '學習環境對專注力影響達40%。座位安排、雜物、聲音控制是關鍵。', suggestion: '理想學習環境：面向白牆（不面向窗戶或電視），桌面只有當前活動物品，背景白噪音（雨聲/海浪聲），自然光充足。' },
    ],
  },
  sleep: {
    results: [
      { type: 'warning', title: '睡眠抗拒：找出根本原因', detail: '2–5歲是睡眠抗拒高峰。常見原因按頻率：①分離焦慮（最常見）②過度疲勞（反而難入睡）③就寢前過度刺激（螢幕/激烈遊戲）④作息不規律。', suggestion: '觀察孩子的睡眠抗拒模式：是哭著要你、一直出來找你，還是躺著睡不著？不同原因有不同策略。' },
      { type: 'ok', title: '固定儀式法（最有Cochrane實證）', detail: '固定睡前儀式可縮短入睡時間平均37%。順序重複比每個步驟本身更重要。', suggestion: '設計專屬儀式：洗澡（10分鐘）→穿睡衣→刷牙→一本繪本（不超過20分鐘）→關燈說晚安。每天順序完全一樣，持續執行2週。話術：「我們要開始睡前儀式了，先去洗澡。」' },
      { type: 'ok', title: '漸進分離法（分離焦慮型）', detail: '若孩子需要陪伴入睡且是因分離焦慮，可用系統性漸進法，避免突然CIO（讓哭）。', suggestion: '第1週：坐在床邊直到入睡。第2週：坐在房間門口。第3週：在門口說晚安後離開。給孩子過渡客體（你的舊T恤/安撫布），說：「這是媽媽的味道，媽媽雖然不在，但愛一直在。」' },
    ],
  },
  separation: {
    results: [
      { type: 'warning', title: '分離焦慮嚴重度評估', detail: '3歲後的分離焦慮若影響正常入學/日常生活超過4週，且程度越來越嚴重，需進一步評估是否為分離焦慮症。', suggestion: '觀察三個維度：①持續時間（每次哭多久）②功能影響（是否影響進食/睡眠）③觸發範圍（是否越來越廣）。三個都嚴重則建議兒童心理評估。' },
      { type: 'ok', title: '固定告別儀式（最重要！）', detail: '研究顯示：有固定告別儀式的孩子，照顧者離開後平均快40%停止哭泣。偷偷走反而讓孩子更焦慮。', suggestion: '建立儀式：①提前告知（「媽媽3分鐘後要去工作了」）→②固定動作（擊掌/擁抱/吻額頭）→③清楚承諾（「3點媽媽來接你」）→④平靜快速離開。話術：「媽媽去工作，下午3點接你。我說到做到。拜拜！」（不猶豫，快速離開）' },
      { type: 'ok', title: '漸進分離練習', detail: '讓孩子體驗「你離開了，但你會回來」，反覆練習鞏固信任。', suggestion: '居家練習：「媽媽去廁所2分鐘，你數到10我就回來。」→成功後延長：「媽媽出去買牛奶，15分鐘回來。」每次說到做到，累積信任感。給孩子「象徵物」：你的舊圍巾/你的照片，說：「這代表媽媽在陪你。」' },
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
  const [selectedAge, setSelectedAge] = useState('3-5y')
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
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>{emotionData.title}</h2>
                  <span className="evidence-badge">{emotionData.evidence}</span>
                </div>
                <p className="text-sm font-semibold" style={{ color: '#5E85A3' }}>{emotionData.subtitle}</p>

                <div className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#C5D8E8' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#5E85A3' }}>此階段情緒特徵</p>
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
                  <p className="text-xs font-bold mb-2" style={{ color: '#5A8A5A' }}>✅ 正常表現（勿過度擔心）</p>
                  <div className="space-y-1.5">
                    {emotionData.normal.map((n, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: '#5A8A5A' }} />
                        <p className="text-sm" style={{ color: '#2D3436' }}>{n}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border" style={{ background: '#EBF8EB', borderColor: '#A8D8A8' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#3A7A3A' }}>正確引導方式</p>
                  <div className="space-y-1.5">
                    {emotionData.rightGuide.map((g, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <TrendingUp size={13} className="shrink-0 mt-0.5" style={{ color: '#5A8A5A' }} />
                        <p className="text-sm" style={{ color: '#2D3436' }}>{g}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border" style={{ background: '#FFF8F0', borderColor: '#F5D5A5' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#B07548' }}>❌ 常見錯誤做法（請避免）</p>
                  <div className="space-y-1.5">
                    {emotionData.wrongGuide.map((g, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertTriangle size={13} className="shrink-0 mt-0.5" style={{ color: '#B07548' }} />
                        <p className="text-sm" style={{ color: '#2D3436' }}>{g}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border" style={{ background: '#EBF4FF', borderColor: '#C5D8E8' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Target size={14} style={{ color: '#5E85A3' }} />
                    <p className="text-xs font-bold" style={{ color: '#5E85A3' }}>具體話術範例</p>
                  </div>
                  <p className="text-sm leading-relaxed italic" style={{ color: '#2D3436' }}>{emotionData.scriptExample}</p>
                </div>

                <div className="p-4 rounded-2xl border" style={{ background: '#FFF8F8', borderColor: '#F5C5C5' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#C45A5A' }}>⚠️ 需留意的警訊（建議諮詢專業）</p>
                  <div className="space-y-1.5">
                    {emotionData.warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertTriangle size={13} className="shrink-0 mt-0.5" style={{ color: '#C45A5A' }} />
                        <p className="text-sm" style={{ color: '#2D3436' }}>{w}</p>
                      </div>
                    ))}
                  </div>
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
