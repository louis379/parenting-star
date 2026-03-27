'use client'

import { useState } from 'react'
import {
  Brain, BookOpen, ClipboardList, Heart, Users, Focus, Target,
  Camera, Sparkles, AlertTriangle, CheckCircle2, ChevronRight,
  Info, TrendingUp, Plus, X, Clock, ChevronDown,
} from 'lucide-react'

const PSYCH_HUANG_TOPICS = [
  {
    id: 'emotion-power',
    emoji: '💛',
    title: '情緒力',
    badge: '黃瑽寧醫師',
    bgColor: '#FFF8E8',
    borderColor: '#F5D880',
    headerColor: '#B08820',
    sections: [
      {
        title: '情緒發展進程',
        content: '孩子的情緒能力是慢慢長出來的，了解時間表就不會那麼焦慮！\n\n寶寶為什麼哭的發展時間線：\n• 1個月：身體不舒服（冷/熱/痛）\n• 4個月：環境刺激太多\n• 6個月：出現陌生人焦慮\n• 1歲：佔有慾不滿、愛要爸媽抱\n• 1.5歲：分離焦慮高峰\n• 2歲：理想與現實有差距（想要就要得到）\n• 3歲：更在意自我形象（「我不對」會很受傷）',
      },
      {
        title: '應對哭鬧發脾氣',
        content: '孩子哭鬧發脾氣時，五步驟幫你沉著應對：\n\n① 抱：先抱住孩子、陪伴（身體接觸傳達安全感）\n② 問：同理問句和猜測（「你很傷心對不對？是因為…嗎？」）\n③ 離開現場：帶到安靜地方，轉移注意力\n④ 受不了了：換手（讓另一個照顧者接手，不丟臉）\n⑤ 謝謝你：等他開始溝通了，給予正面回饋（「謝謝你告訴我」）\n\n💡 同理三層次：\n🔷 認知同理 → 關心（「我知道你發生什麼事了」）\n🔶 情緒同理 → 感受+陪伴\n🔹 閱讀同理 → 幫他解決問題',
      },
      {
        title: '建立良好依附關係',
        content: '依附關係是孩子一生的心理安全感基礎，你的每個回應都在建立它！\n\n五個可以今天就開始的方式：\n① 正向思考：他不是故意的，我生氣是有原因的，找到根本問題解決\n② 抓大放小：7次正面回應：1次負面提醒（7:1原則）\n③ 甜蜜語言：每月針對最難接受的行為設定主題，溫柔但一致\n④ 擁抱：隨時給，不需要理由\n⑤ 回應談話：幫助孩子表達恐懼和擔心（不要代替他說，引導他說出來）',
      },
      {
        title: '高敏感孩子怎麼陪伴',
        content: '高敏感不是問題，是特質！他們感受更豐富，需要多一點理解。\n\n三個陪伴原則：\n① 規律生活：可預測的時間表讓高敏感孩子安心\n② 減少刺激：少3C、不過度刺激的故事、情緒不要太大聲\n③ 聆聽接納：說出他內心的恐懼，給他同理 + 時間\n\n同時，執行一致的家規，溫柔但清楚：\n• Leave：離開讓人生氣的現場\n• Ask：詢問他的感受和原因\n• Time Out：執行家規（1歲=1分鐘，剝奪最愛的東西且與違規行為有關）\n• Embrace：擁抱，肯定下次可以做更好\n• Review：討論怎麼做得更好（為自己行為負責）',
      },
      {
        title: '爸媽的情緒控制',
        content: '照顧好自己的情緒，才能照顧好孩子的情緒——這不是自私，這是必要的！\n\n當你快要爆發時，記得：\n• 孩子的行為不是針對你個人的\n• 你生氣是有原因的，找出來解決更重要\n• 可以說「我現在需要冷靜一下」然後短暫離開\n\n💡 如果常常覺得快要控制不住，可以：\n• 和伴侶輪流照顧（換手不是失敗）\n• 找媽媽群互相支持\n• 必要時尋求諮商協助——這是勇氣，不是軟弱',
      },
    ],
  },
  {
    id: 'social-power',
    emoji: '🤝',
    title: '社交力',
    badge: '黃瑽寧醫師',
    bgColor: '#F0FDF4',
    borderColor: '#A7D7B8',
    headerColor: '#2D7A4F',
    sections: [
      {
        title: '適應團體生活',
        content: '進入幼兒園或學校，對孩子來說是巨大的轉變，需要時間適應。\n\n學前最重要的培養：\n① 抽象技能：專注力、工作記憶、合作、解決問題\n② 鼓勵正向行為（不只在意結果，也在意方式）\n③ 更多自由活動（非結構性遊戲）\n④ 更多運動機會\n⑤ 傾聽多於教導\n\n💡 選幼兒園不用過度焦慮：蒙特梭利和華德福都從孩子需求出發（全人教育），看哪種適合你們家的節奏和孩子個性。',
      },
      {
        title: '霸凌：預防與應對',
        content: '讓孩子知道：有些事情一定要告訴爸爸媽媽，說出來不是打小報告。\n\n預防面：\n• 幫孩子建立自信（被肯定的孩子不容易成為霸凌目標）\n• 練習清楚說「不行」「我不喜歡這樣」\n• 教導同理心（不欺負弱小）\n\n應對面：\n• 相信孩子說的話，不要第一反應是「你有沒有先惹他」\n• 和老師溝通，了解全貌\n• 讓孩子知道：逃離危險的情境是聰明的選擇，不是懦弱\n\n💛 最重要的：家是最安全的避風港，孩子願意告訴你才最重要。',
      },
      {
        title: '手足紛爭與公平感',
        content: '有兩個以上孩子的家長必看！手足之爭其實是孩子在爭「我被愛嗎？」\n\n關於公平：\n• 孩子追求的是「被公平對待」，不是「絕對一樣」\n• 每個孩子的需求不同，解釋給他們聽（「哥哥現在需要...，所以...」）\n• 讓孩子說出內心的嫉妒和委屈，這是正常的\n\n實際做法：\n① 固定每個孩子的「特別時間」（哪怕只有10分鐘）\n② 讓較大的孩子有「長幼有別」的特權感\n③ 不強迫分享，引導協商\n④ 手足之間有摩擦是正常的，讓他們練習自己解決（你觀察就好）',
      },
    ],
  },
]

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
  reminders: string[]
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
    reminders: ['6週後仍無任何社交微笑，可以跟兒科醫師聊聊', '持續觀察到對照顧者聲音無特別反應', '持續缺乏眼神接觸，可以多留意', '如果哭泣超過3小時/天持續出現，可以諮詢醫師了解是否腸絞痛'],
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
    reminders: ['如果持續觀察到完全無分離焦慮，可以跟醫師聊聊依附發展', '18月後仍無指物動作，可以多留意', '如果持續觀察到對所有人反應完全相同，可以諮詢兒科醫師', '持續缺乏共同注意力，可以多留意'],
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
    reminders: ['如果18月後仍無任何有意義的詞彙，可以跟語言治療師聊聊', '持續觀察到對他人痛苦完全無反應，可以多留意', '如果重複刻板行為影響日常，可以跟醫師聊聊', '持續缺乏眼神接觸，可以多留意'],
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
    reminders: ['如果持續觀察到語言理解明顯落後同齡，可以跟語言治療師聊聊', '持續觀察到對他人痛苦完全無同理反應，可以多留意', '如果重複刻板行為嚴重影響日常，可以跟醫師聊聊', '如果攻擊行為頻繁持續出現，可以諮詢兒童心理師'],
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
    reminders: ['如果持續觀察到攻擊行為每天針對特定對象，可以跟心理師聊聊', '如果極度恐懼嚴重干擾日常生活，可以多留意並諮詢醫師', '持續觀察到完全無法理解任何規則，可以多留意', '如果3歲後完全無友誼形成傾向，可以跟兒科醫師聊聊'],
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
    reminders: ['如果持續觀察到退縮不願上學超過2週，可以跟老師和醫師聊聊', '如果頻繁身體不適但無生理原因持續出現，可以多留意', '持續觀察到情緒低落超過2週，可以跟醫師聊聊', '如果持續觀察到被欺凌的跡象，可以溫和詢問並尋求學校支持'],
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
    reminders: ['如果持續觀察到抑鬱或焦慮徵象超過2週，可以跟兒童心理師聊聊', '如果觀察到自傷行為或言語，請盡快尋求專業支持', '持續觀察到學業表現急劇下滑，可以多留意並了解原因', '如果完全切斷所有連結持續出現，可以諮詢家族治療師', '持續觀察到危險行為跡象，可以跟醫師或心理師聊聊'],
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

const AI_ANALYSIS: Record<string, {
  great: string[]
  suggestions: string[]
  weekGoal: string
  cheer: string
}> = {
  crying: {
    great: ['記錄下寶貝哭鬧的情況，這本身就很了不起——很多爸媽會選擇逃避，你選擇了正視 💙', '你意識到需要了解背後的原因，這是情緒引導的第一步 ✨'],
    suggestions: ['試試看先蹲下來到孩子的高度，輕聲說「我知道你很難過」，讓孩子感受到你在', '等孩子情緒稍微平緩後（不用完全停止哭），再輕輕問「發生什麼事了？」', '避免「不要哭了」「哭什麼哭」——改用「媽媽在這裡，你可以哭」'],
    weekGoal: '這週練習一次：下次孩子哭鬧時，先深呼吸3秒，再說「我看到你很不開心，我在這裡陪你」🤗',
    cheer: '引導孩子情緒需要時間和練習，你願意學習就是最棒的爸媽。慢慢來，你做得到 💙',
  },
  social: {
    great: ['你注意到孩子的社交情況，說明你是一個非常細心的家長 ✨', '願意尋求方法幫助孩子，這份愛心是孩子最大的資產 💙'],
    suggestions: ['先從一對一玩伴開始，找孩子感興趣的同伴，降低群體壓力', '合作型活動（一起搭積木、拼拼圖）比自由遊戲更容易讓孩子融入', '在家先「演練」：教孩子說「我可以一起玩嗎？」再帶到真實場景'],
    weekGoal: '這週安排一次一對一玩伴時光，讓孩子在輕鬆的環境練習社交 🧩',
    cheer: '每個孩子的社交節奏都不同，內向不是問題，只是風格。你陪在他身邊，就是最好的後盾 💙',
  },
  focus: {
    great: ['你留意到孩子專注力的狀況，很多家長會直接責備孩子「不認真」，你沒有 ✨', '記錄下來尋求幫助，說明你選擇了理解而不是批評 💙'],
    suggestions: ['先試試環境調整：桌面清空只留當前活動，減少背景聲音', '用計時器（可視化時鐘）讓孩子看到時間，5分鐘先開始', '每天至少1小時戶外活動——能量消耗是提升室內專注力的最自然方法'],
    weekGoal: '這週試試：每天固定時間（如下午4點）進行10分鐘的安靜活動，連做5天看看效果 ⏰',
    cheer: '專注力是可以培養的，不是天生固定的。你願意幫孩子找方法，這份耐心就是最好的示範 💙',
  },
  sleep: {
    great: ['能注意到孩子睡眠的問題並尋求解決，這份用心很珍貴 ✨', '你沒有選擇「硬撐」，而是尋求更好的方式，很聰明 💙'],
    suggestions: ['建立固定睡前儀式（洗澡→繪本→道晚安），每晚順序完全一樣，持續2週', '把睡前螢幕關閉時間提早到入睡前1小時，藍光真的影響褪黑激素', '給孩子「過渡客體」（你的舊T恤/安撫玩具），讓你的氣味陪伴他入睡'],
    weekGoal: '這週開始執行睡前儀式：洗澡→故事→道晚安，每晚同樣的順序，給自己2週時間觀察 🌙',
    cheer: '睡眠建立是一場長跑，不是短跑。每一個進步，哪怕只是早睡5分鐘，都值得慶祝 💙',
  },
  separation: {
    great: ['你注意到孩子的分離焦慮並認真對待，這說明你們的依附關係是真實且有意義的 ✨', '選擇用理解而不是強迫的方式，已經走在正確的方向上 💙'],
    suggestions: ['每次分離前建立固定告別儀式（擁抱→說拜拜→承諾幾點回來）', '說到做到是關鍵：「3點回來」就一定3點，這樣孩子才會相信你會回來', '離開時平靜快速，不要猶豫——你越猶豫，孩子越焦慮'],
    weekGoal: '這週嘗試建立你們的「告別儀式」：擊掌+親親+說「X點見」，連做5天 👋',
    cheer: '分離焦慮是愛的證明——孩子愛你所以捨不得你走。隨著信任建立，這會慢慢改善。你是孩子的安全基地 💙',
  },
}

const PSYCH_PHOTO_AI_RESULT = {
  stage: '情緒狀態觀察',
  stageDesc: '從照片的表情和肢體語言來看，寶貝看起來狀態很好！眼神充滿好奇，是探索欲旺盛的好徵兆。',
  trend: '情緒發展趨勢',
  trendDesc: '持續記錄日常互動照片，可以幫助你看出孩子的情緒模式——哪些時候最開心？哪些情境容易情緒波動？這些觀察是了解孩子內心世界最直接的窗口。',
  suggestions: [
    '記錄孩子開心玩耍的照片，觀察他/她最沉浸的活動類型，這反映了天生的興趣傾向',
    '也可以記錄情緒爆發後平靜下來的照片，對比兩種狀態，幫助了解調節時間',
    '拍攝親子互動時的照片（自拍），觀察你們的眼神交流和肢體語言',
  ],
  cheer: '你願意這麼認真觀察和記錄孩子的情緒，這份用心本身就是最好的育兒方式。被充分理解的孩子，才能長出健康的情緒力 💙',
}

// ===== 黃瑽寧醫師課程架構：情緒力延伸指南 =====

const EMOTION_EXTRA_TOPICS = [
  {
    id: 'highSensitive',
    title: '高敏感孩子',
    emoji: '🌸',
    content: `高敏感孩子（HSC, Highly Sensitive Child）佔孩子總數的15–20%，是天生的神經系統差異，不是問題，不是病。\n\n高敏感的特徵：\n• 對聲音、光線、氣味、質地特別敏感\n• 情緒反應比其他孩子更強烈\n• 對環境變化需要更長的適應時間\n• 觀察力強、同理心高、思考深入\n• 換場景或新刺激後需要更多時間「充電」\n\n如何引導高敏感孩子：\n• 提前預告任何改變（「等一下我們要去新的地方，會有很多人，我會一直陪著你」）\n• 不要催促他「快一點適應」，給足夠的緩衝時間\n• 退出嘈雜環境是正當的需求，不是嬌氣\n• 找到他的能量充電方式（多數是安靜獨處）並尊重這個需求\n• 幫助他為強烈情緒命名：「你的感受器比別人靈敏，所以你感覺得更深，這不是壞事」\n\n💙 高敏感孩子的優勢：往往是最有創造力、最有同理心、最深刻思考的人。`,
  },
  {
    id: 'parentEmotion',
    title: '爸媽情緒控制',
    emoji: '🧘',
    content: `孩子的情緒調節能力，很大程度來自觀察爸媽如何處理情緒。我們不需要完美，但可以「示範修復」。\n\n為什麼爸媽容易在孩子哭鬧時崩潰？\n• 孩子的哭聲在演化上設計來讓成人焦慮，這是本能反應\n• 當你自己疲憊/飢餓/壓力大，前額葉（理性）更難壓制杏仁核（情緒）\n• 這不是你的錯，是神經系統的特性\n\n當你感覺要爆炸的時候：\n• 先把孩子放在安全的地方\n• 離開現場30秒到1分鐘（不是逃跑，是調節）\n• 深呼吸：吸4秒、憋4秒、呼6秒（啟動副交感神經）\n• 說「媽媽現在需要冷靜一下，我馬上回來」\n\n當你確實發火之後：\n• 事後（情緒平靜後）和孩子修復：「剛才媽媽對你大叫，我做得不好，對不起。你沒有做錯。」\n• 修復本身就是在示範：人可以犯錯，也可以道歉和改善\n• 不要在親子關係的自責中打轉，向前走更重要\n\n💙 黃瑽寧醫師說：「爸媽不需要完美，需要的是在孩子面前示範真實的人。」`,
  },
  {
    id: 'babyCrySignals',
    title: '解讀寶寶的6種哭鬧信號',
    emoji: '👶',
    content: `黃瑽寧醫師：讀懂寶寶在說什麼\n\n寶寶在學會說話前，用整個身體在溝通。這6種信號是最常見的：\n\n1. 寶寶肚子搖擺、頭轉動 → 肚子餓了，想喝奶\n2. 寶寶吐舌頭、腳往上踢 → 肚子脹氣或不舒服，需要排氣\n3. 寶寶一扭一扭、蹭來蹭去 → 想睡了、想動一動、或是洗澡會讓他舒服\n4. 寶寶嗝嗝聲然後大哭 → 需要拍嗝、幫助排氣\n5. 寶寶頭轉來轉去找東西 → 覓乳反射（Rooting Reflex），寶寶在找奶，是餓的信號\n6. 寶寶嘴巴做出吸吮動作 → 吸吮反射（Sucking Reflex），這是本能，代表想要安撫\n\n寶寶哭的排除清單（依序確認）：\n① 清潔 → 尿布濕了嗎？\n② 飢餓 → 距離上次喝奶多久了？\n③ 溫度 → 太冷或太熱？\n④ 環境 → 光線太強？聲音太大？\n⑤ 擁抱 → 需要肌膚接觸和安全感\n⑥ 觀察 → 以上都沒有，可能只是需要陪伴\n\n💙 每個寶寶都有自己獨特的哭聲密碼，你是最了解自己寶貝的專家，相信直覺。`,
  },
  {
    id: 'fiveSMethod',
    title: '5S 安撫法 + 袋鼠育兒',
    emoji: '🤱',
    content: `黃瑽寧醫師推薦：科學有效的安撫方式\n\n🌟 5S 安撫法（模仿子宮環境）\n\n① Swaddle 包巾包裹\n緊實包裹讓寶寶有被「抱住」的安全感，但注意不要太緊影響髖關節發育。\n\n② Side/Stomach Position 側抱或趴抱\n側躺或趴著（在大人懷裡，不是床上！）能有效緩解不適。注意：只有睡覺時才讓寶寶仰臥，防猝死。\n\n③ Swing/Sway 搖擺\n輕柔、規律的搖擺動作，模仿媽媽肚子裡的感覺。不需要劇烈搖晃，輕柔才有效。\n\n④ Shush 噓聲\n在耳邊輕聲「嘘嘘嘘」，模仿子宮內的血流聲。聲音要持續且比哭聲稍大才有效。\n\n⑤ Suck 吸吮\n奶嘴、乾淨手指都能讓寶寶平靜。吸吮是最強力的自我安撫機制。\n\n🦘 袋鼠育兒法（Kangaroo Care）\n\n核心精神：肌膚對肌膚的接觸（Skin-to-Skin）\n\n做法：\n• 照顧者（媽媽、爸爸、祖父母都可以）解開上衣，讓寶寶直接貼在胸口\n• 不需要固定不動，可以到處走動，也可以使用背巾\n• 每次至少1小時，一天多次沒問題\n\n好處：\n• 調節寶寶體溫、心跳、呼吸\n• 促進泌乳、提升母乳成功率\n• 建立安全依附關係\n• 爸爸做同樣有效！\n\n💙 對早產兒尤其重要，但對所有寶寶都有益。`,
  },
]

// ===== 黃瑽寧醫師課程架構：社交力延伸指南 =====

const SOCIAL_EXTRA_TOPICS = [
  {
    id: 'groupAdaptation',
    title: '適應團體生活',
    emoji: '🏫',
    content: `進入幼兒園、托嬰中心是孩子人生第一次長期與陌生人相處，需要時間和支持。\n\n準備期（入園前1–2個月）：\n• 帶孩子提前參觀幼兒園，認識老師和環境\n• 閱讀關於上學的繪本（《我愛幼兒園》《要上幼兒園了》）\n• 練習與照顧者短暫分離，建立「你會回來」的信任\n\n入園適應期（前2–4週）：\n• 大多數孩子需要2–6週適應，部分需要更長\n• 建立固定告別儀式，平靜快速告別\n• 不要因孩子哭泣而猶豫徘徊（越猶豫孩子越焦慮）\n• 每天固定時間接送，讓孩子知道你會來\n\n需要多留意的情況：\n• 適應超過3個月仍每天大哭\n• 開始出現退縮（不說話、縮回嬰兒行為）\n• 持續身體症狀（肚子痛/頭痛）但無生理原因\n\n💙 適應不良不是孩子的錯，也不是家長的錯。慢慢來，你陪在身邊就是最大的力量。`,
  },
  {
    id: 'bullying',
    title: '霸凌應對',
    emoji: '🛡️',
    content: `霸凌的定義：重複性、有意的攻擊行為，且雙方有力量差距（不是一般衝突）。\n\n如何判斷是否是霸凌？\n• 一次性衝突、互相吵架 → 正常人際衝突，需要引導\n• 針對特定人、重複發生、孩子無力反擊 → 可能是霸凌\n\n孩子被霸凌的跡象：\n• 不想上學、找身體不舒服的理由請假\n• 回家情緒特別低落、易怒\n• 東西莫名消失或損壞\n• 突然沒有朋友話題或說「我沒有朋友」\n\n家長怎麼做？\n• 先傾聽，不要急著問細節或解決（孩子需要先被理解）\n• 告訴孩子：「這不是你的錯，我相信你」\n• 通知老師/學校（留下書面記錄）\n• 不要叫孩子「自己解決」或「打回去」（升高風險）\n• 嚴重情況：與學校溝通制定保護計畫，或尋求學校輔導\n\n💙 孩子告訴你「有人欺負我」是一份信任，請認真對待。`,
  },
  {
    id: 'siblingConflict',
    title: '手足紛爭（公平感）',
    emoji: '👫',
    content: `手足衝突是完全正常的，甚至是練習衝突解決能力的最佳場所。完全沒有衝突才需要擔心。\n\n為什麼孩子對「公平」這麼執著？\n• 孩子的「公平感」在2–3歲開始發展\n• 他們理解的公平是「一樣多」，而不是「各得所需」\n• 對不公平的強烈反應是認知發展的正常現象\n\n家長常犯的錯誤：\n• 要求老大「讓弟弟/妹妹」（對老大不公平，且傳達「你因為大就要吃虧」）\n• 比較兩個孩子（「你看妹妹多乖」）\n• 每次都介入解決（剝奪自主解決能力）\n\n更有效的方式：\n• 輪流原則：清楚說明規則「今天哥哥先選，明天弟弟先選」\n• 計時器：「計時器響了就換人」，規則代替家長\n• 衝突後引導：「你們都想要同一個玩具，你們覺得可以怎麼辦？\"\n• 分別給每個孩子獨自相處時間，減少注意力爭奪\n\n💙 手足是孩子一生最長的關係之一。衝突是過程，讓他們練習解決，比替他們解決更有價值。`,
  },
  {
    id: 'emotionTimeline',
    title: '情緒發展時間線',
    emoji: '📅',
    content: `黃瑽寧醫師：不同階段的情緒需求\n\n哭鬧背後的原因隨年齡變化：\n\n0–3個月：寶寶哭是為了讓大人來照顧，這是純生存本能，及時回應不會寵壞孩子。\n\n6個月：開始出現分離焦慮，因為依附關係正在形成，這是好事！\n\n1.5歲：想要的事情辦不到會有強烈挫折感（例如東西放不進去、積木倒了）。這是理解能力超前動作能力造成的落差，不是壞脾氣。\n\n2歲：Terrible Two — 知道自己想要什麼，但不知道如何用語言表達，也無法接受「不行」。理想和現實的差距讓他們爆發。\n\n3歲：語言能力提升後，情緒爆發開始減少，但仍需要大人幫助命名和整理情緒。\n\n處理情緒的六步法：\n① 花時間：先把孩子的情緒「接住」，讓他感覺被看見\n② 同理：「我知道你很難過／生氣／害怕」\n③ 擁抱：肢體接觸是最快的安撫\n④ 等待：讓情緒自然平息，不催促「快停哭」\n⑤ 倒數或給時間：「再哭一會兒，哭完我們來想辦法」\n⑥ 提供解決方式：「你覺得我們可以怎麼辦？」\n\n建立良好依附關係4要素：\n① 保持可預測性：固定作息讓孩子有安全感\n② 0–1歲是關鍵期：及時回應建立信任基礎\n③ 每次分離都好好說再見\n④ 擁抱要多，語言要溫柔\n\n💙 完美的依附關係不存在，「夠好的爸媽」（Good Enough Parent）就已經足夠了。`,
  },
]

interface PsychRecord {
  id: string
  date: string
  situation: SituationType
  desc: string
  analyzed: boolean
}

interface PhotoRecord {
  id: string
  date: string
  sortDate: number
  imageData: string
  note: string
  page: string
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
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  function toggleAccordion(id: string) {
    setOpenAccordion(prev => prev === id ? null : id)
  }
  const [showAI, setShowAI] = useState(false)
  const [recordForm, setRecordForm] = useState({ date: new Date().toISOString().split('T')[0], situation: 'crying' as SituationType, desc: '' })
  const [photos, setPhotos] = useState<PhotoRecord[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('psych_photos')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [showPhotoAI, setShowPhotoAI] = useState(false)

  const emotionData = EMOTION_DATA[selectedAge]

  function addRecord() {
    if (!recordForm.desc) return
    setRecords(r => [...r, { id: Date.now().toString(), ...recordForm, analyzed: false }])
    setShowRecordForm(false)
    setRecordForm({ date: new Date().toISOString().split('T')[0], situation: 'crying', desc: '' })
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    Array.from(files).forEach((file, idx) => {
      const photoDate = new Date(file.lastModified)
      const dateStr = photoDate.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
      const reader = new FileReader()
      reader.onload = (ev) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxSize = 800
          let w = img.width, h = img.height
          if (w > maxSize || h > maxSize) {
            if (w > h) { h = h * maxSize / w; w = maxSize }
            else { w = w * maxSize / h; h = maxSize }
          }
          canvas.width = w; canvas.height = h
          canvas.getContext('2d')?.drawImage(img, 0, 0, w, h)
          const compressed = canvas.toDataURL('image/jpeg', 0.7)
          const newPhoto: PhotoRecord = {
            id: `${Date.now()}_${idx}_${Math.random().toString(36).slice(2)}`,
            date: dateStr,
            sortDate: photoDate.getTime(),
            imageData: compressed,
            note: '',
            page: 'psychology',
          }
          setPhotos(prev => {
            const updated = [...prev, newPhoto].sort((a, b) => (b.sortDate ?? 0) - (a.sortDate ?? 0))
            localStorage.setItem('psych_photos', JSON.stringify(updated))
            return updated
          })
        }
        img.src = ev.target?.result as string
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: 'linear-gradient(160deg, #A8C5DA 0%, #7B9EBD 45%, #5E85A3 100%)' }}>
        <div className="flex items-center gap-2 text-white mb-4">
          <Brain size={22} strokeWidth={2.5} />
          <h1 className="text-xl font-black">心理培養</h1>
        </div>
        <p className="text-sm text-white opacity-80 mt-0.5">理解寶貝的心，做最好的陪伴</p>
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

                <div className="p-4 rounded-2xl border" style={{ background: '#F5F8FF', borderColor: '#C5D8E8' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#5E85A3' }}>💭 比較好避免的做法</p>
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

                <div className="p-4 rounded-2xl border" style={{ background: '#EBF4FF', borderColor: '#C5D8E8' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#5E85A3' }}>🔔 可以多留意的地方</p>
                  <div className="space-y-1.5">
                    {emotionData.reminders.map((w, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertTriangle size={13} className="shrink-0 mt-0.5" style={{ color: '#5E85A3' }} />
                        <p className="text-sm" style={{ color: '#2D3436' }}>{w}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 情緒力延伸指南（手風琴） */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Heart size={15} style={{ color: '#7B9EBD' }} />
                    <h3 className="font-bold text-sm" style={{ color: '#2D3436' }}>情緒力深度指南</h3>
                    <span className="evidence-badge">黃瑽寧醫師</span>
                  </div>
                  <div className="space-y-2">
                    {EMOTION_EXTRA_TOPICS.map(topic => (
                      <div key={topic.id} className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                        <button
                          onClick={() => toggleAccordion('emotion_' + topic.id)}
                          className="w-full flex items-center justify-between px-4 py-3"
                        >
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 18 }}>{topic.emoji}</span>
                            <span className="text-sm font-semibold" style={{ color: '#2D3436' }}>{topic.title}</span>
                          </div>
                          <ChevronDown
                            size={16}
                            style={{ color: '#7B9EBD', transform: openAccordion === 'emotion_' + topic.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                          />
                        </button>
                        {openAccordion === 'emotion_' + topic.id && (
                          <div className="px-4 pb-4">
                            <div className="p-3 rounded-xl" style={{ background: '#F5F8FF' }}>
                              <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: '#2D3436' }}>{topic.content}</p>
                            </div>
                          </div>
                        )}
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

              {/* 社交力延伸指南（手風琴） */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={15} style={{ color: '#7B9EBD' }} />
                  <h3 className="font-bold text-sm" style={{ color: '#2D3436' }}>社交力深度指南</h3>
                  <span className="evidence-badge">黃瑽寧醫師</span>
                </div>
                <div className="space-y-2">
                  {SOCIAL_EXTRA_TOPICS.map(topic => (
                    <div key={topic.id} className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                      <button
                        onClick={() => toggleAccordion('social_' + topic.id)}
                        className="w-full flex items-center justify-between px-4 py-3"
                      >
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 18 }}>{topic.emoji}</span>
                          <span className="text-sm font-semibold" style={{ color: '#2D3436' }}>{topic.title}</span>
                        </div>
                        <ChevronDown
                          size={16}
                          style={{ color: '#7B9EBD', transform: openAccordion === 'social_' + topic.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                        />
                      </button>
                      {openAccordion === 'social_' + topic.id && (
                        <div className="px-4 pb-4">
                          <div className="p-3 rounded-xl" style={{ background: '#EBF4FF' }}>
                            <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: '#2D3436' }}>{topic.content}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 黃瑽寧醫師課程：心理培養 */}
          <div className="px-5 py-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} style={{ color: '#7B9EBD' }} />
              <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>黃瑽寧醫師課程</h2>
              <span className="evidence-badge">心理培養</span>
            </div>
            <div className="space-y-3">
              {PSYCH_HUANG_TOPICS.map((topic) => (
                <div key={topic.id} className="rounded-2xl overflow-hidden border" style={{ borderColor: topic.borderColor }}>
                  <button
                    onClick={() => setOpenHuangTopic(openHuangTopic === topic.id ? null : topic.id)}
                    className="w-full flex items-center justify-between p-4"
                    style={{ background: topic.bgColor }}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 20 }}>{topic.emoji}</span>
                      <div className="text-left">
                        <div className="font-bold text-sm" style={{ color: topic.headerColor }}>{topic.title}</div>
                        <div className="text-xs" style={{ color: topic.headerColor, opacity: 0.7 }}>{topic.badge}</div>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      style={{ color: topic.headerColor, transform: openHuangTopic === topic.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                    />
                  </button>
                  {openHuangTopic === topic.id && (
                    <div className="border-t" style={{ borderColor: topic.borderColor, background: 'white' }}>
                      {topic.sections.map((section, si) => (
                        <div key={si} className="border-b last:border-b-0" style={{ borderColor: '#F0EDE8' }}>
                          <button
                            onClick={() => setOpenHuangItem(openHuangItem === `${topic.id}-${si}` ? null : `${topic.id}-${si}`)}
                            className="w-full flex items-center justify-between px-4 py-3"
                          >
                            <span className="text-sm font-semibold text-left" style={{ color: '#2D3436' }}>{section.title}</span>
                            <ChevronDown
                              size={14}
                              style={{ color: '#8E9EAD', flexShrink: 0, marginLeft: 8, transform: openHuangItem === `${topic.id}-${si}` ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                            />
                          </button>
                          {openHuangItem === `${topic.id}-${si}` && (
                            <div className="px-4 pb-4">
                              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#4A5568' }}>{section.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === 家長紀錄 Tab === */}
      {mainTab === 'records' && (
        <div className="px-5 py-5 space-y-5">
          <section>
            <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #A8C5DA, #7B9EBD)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: 20 }}>💙</span>
                <h2 className="font-black text-white text-base">你的陪伴記錄</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <p className="text-white font-black text-lg">5次</p>
                  <p className="text-white text-xs opacity-80">已記錄情況</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <p className="text-white font-black text-lg">2項</p>
                  <p className="text-white text-xs opacity-80">已解析情況</p>
                </div>
              </div>
              <p className="text-white text-xs opacity-90 text-center">每一次記錄都是理解孩子的珍貴積累 💙</p>
            </div>
          </section>

          {/* 情緒相簿 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold" style={{ color: '#2D3436' }}>情緒記錄相簿 📸</h2>
              <span className="text-xs px-2 py-1 rounded-xl font-semibold" style={{ background: '#EBF4FF', color: '#5E85A3' }}>{photos.length} 張</span>
            </div>

            {/* 累積鼓勵訊息 */}
            {photos.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3" style={{ background: 'linear-gradient(135deg, #EBF8EB, #D8F5D8)', border: '1px solid #A8D8A8' }}>
                <span style={{ fontSize: 16 }}>✨</span>
                <p className="text-xs font-semibold" style={{ color: '#3A7A3A' }}>
                  已累積 {photos.length} 張情緒記錄
                  {photos.length >= 10 ? '，AI 分析越來越準確了！🎯' : photos.length >= 5 ? '，繼續加油，累積越多分析越精準！' : '，再多幾張，情緒模式就會浮現出來！'}
                </p>
              </div>
            )}

            {/* 上傳按鈕區 */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <label className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 border-dashed cursor-pointer active:opacity-70" style={{ borderColor: '#7B9EBD', background: 'linear-gradient(135deg, #F0F7FF, #EBF4FF)' }}>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
                  <Camera size={18} className="text-white" />
                </div>
                <span className="text-xs font-bold" style={{ color: '#5E85A3' }}>立即拍照</span>
              </label>
              <label className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 border-dashed cursor-pointer active:opacity-70" style={{ borderColor: '#B07548', background: 'linear-gradient(135deg, #FFF8F0, #FDF0E8)' }}>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4885A, #B07548)' }}>
                  <span style={{ fontSize: 18 }}>📸</span>
                </div>
                <span className="text-xs font-bold" style={{ color: '#B07548' }}>批次導入</span>
              </label>
            </div>
            <p className="text-[10px] text-center mb-3" style={{ color: '#8E9EAD' }}>批次導入會自動讀取照片日期，按時間排序</p>

            {/* 時間軸相簿 */}
            {photos.length > 0 && (() => {
              const groups: Record<string, PhotoRecord[]> = {}
              photos.forEach(p => {
                const d = new Date(p.sortDate ?? Date.now())
                const key = `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月`
                if (!groups[key]) groups[key] = []
                groups[key].push(p)
              })
              const sortedGroups = Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
              return (
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
                          <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                            <img src={photo.imageData} alt="情緒記錄" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5" style={{ background: 'rgba(0,0,0,0.45)' }}>
                              <p className="text-white text-[9px] text-center">{photo.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}

            {photos.length > 0 && (
              <button
                onClick={() => setShowPhotoAI(true)}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 mb-2"
                style={{ background: 'linear-gradient(135deg, #A8C5DA, #5E85A3)' }}
              >
                <Sparkles size={16} />AI 分析情緒狀態（{photos.length} 張）
              </button>
            )}

            {showPhotoAI && (
              <div className="mt-1 space-y-3">
                <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #EBF4FF, #F0F8FF)', border: '1px solid #C5D8E8' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: 18 }}>🔍</span>
                    <p className="font-bold text-sm" style={{ color: '#5E85A3' }}>{PSYCH_PHOTO_AI_RESULT.stage}</p>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{PSYCH_PHOTO_AI_RESULT.stageDesc}</p>
                </div>
                <div className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: 18 }}>📈</span>
                    <p className="font-bold text-sm" style={{ color: '#2D3436' }}>{PSYCH_PHOTO_AI_RESULT.trend}</p>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7B8D' }}>{PSYCH_PHOTO_AI_RESULT.trendDesc}</p>
                </div>
                <div className="p-4 rounded-2xl border" style={{ background: '#EBF8EB', borderColor: '#A8D8A8' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#3A7A3A' }}>📷 記錄建議</p>
                  {PSYCH_PHOTO_AI_RESULT.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1.5">
                      <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: '#5A8A5A' }} />
                      <p className="text-xs leading-relaxed" style={{ color: '#2D3436' }}>{s}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
                  <p className="text-sm leading-relaxed text-white">{PSYCH_PHOTO_AI_RESULT.cheer}</p>
                </div>
                <p className="text-xs text-center" style={{ color: '#8E9EAD' }}>* 此為模擬分析，非醫療診斷</p>
              </div>
            )}
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
            <section className="space-y-3">
              <h2 className="font-bold" style={{ color: '#2D3436' }}>成長秘書的分析</h2>

              <div className="p-4 rounded-2xl border" style={{ background: '#EBF8EB', borderColor: '#A8D8A8' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 18 }}>🌟</span>
                  <p className="font-bold text-sm" style={{ color: '#3A7A3A' }}>你做得很棒的地方</p>
                </div>
                <div className="space-y-2">
                  {AI_ANALYSIS[situationType]?.great.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: '#5A8A5A' }} />
                      <p className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl border" style={{ background: '#FFF8EC', borderColor: '#F5D8A0' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 18 }}>💡</span>
                  <p className="font-bold text-sm" style={{ color: '#8A6020' }}>可以一起試試看</p>
                </div>
                <div className="space-y-2">
                  {AI_ANALYSIS[situationType]?.suggestions.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight size={14} className="shrink-0 mt-0.5" style={{ color: '#B07548' }} />
                      <p className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl border" style={{ background: '#EBF4FF', borderColor: '#C5D8E8' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: 18 }}>🎯</span>
                  <p className="font-bold text-sm" style={{ color: '#5E85A3' }}>這週的小目標</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{AI_ANALYSIS[situationType]?.weekGoal}</p>
              </div>

              <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: 18 }}>💪</span>
                  <p className="font-bold text-sm text-white">給你的加油打氣</p>
                </div>
                <p className="text-sm leading-relaxed text-white opacity-95">{AI_ANALYSIS[situationType]?.cheer}</p>
              </div>
              <p className="text-xs text-center" style={{ color: '#8E9EAD' }}>* 此為模擬分析結果</p>
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
