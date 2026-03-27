'use client'

import { useState } from 'react'
import {
  BookOpen, ClipboardList, MessageSquare, Lightbulb, GraduationCap,
  Camera, FileText, Sparkles, AlertTriangle, CheckCircle2, ChevronRight,
  Info, TrendingUp, Plus, X, Star, ChevronDown, Shield,
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
  activities: string[]
  bilingual: string
}> = {
  '0-1y': {
    vocab: '被動詞彙：約50詞（10-12月）｜主動說出：1-3個有意義的詞（約12月）',
    sentence: '牙牙學語（ba-ba, ma-ma, da-da）、重複音節模仿、開始有意圖的發音',
    expression: '哭聲分化（餓/累/痛不同）、9–12月手勢指物（指著想要的東西）、揮手拜拜',
    note: '語言發展的基礎在聽覺輸入。對聲音有反應（4月），模仿口型（4-6月），輪流對話（6月），共同注意力（9月）。越多對話輸入，語言發展越好。',
    warning: '12月後仍無任何語音或手勢→需評估聽力和語言發展｜6月對聲音無反應→聽力檢查',
    activities: ['每天大量說話（描述動作：「媽媽在洗碗」）', '念押韻兒歌和手指謠（促進語音意識）', '讀厚紙板書，指著圖說名稱', '等待孩子「回應」後再繼續說（輪流對話訓練）', '減少背景噪音（電視），讓孩子聽清楚語音'],
    bilingual: '雙語環境從出生即可。「一人一語」原則最有效（爸爸說國語、媽媽說台語）。兩種語言的總詞彙量加起來看，不是只看單一語言。',
  },
  '1-2y': {
    vocab: '12月：約10詞｜18月：約50詞（詞彙爆發）｜24月：約200-300詞',
    sentence: '18月：兩詞組合（媽媽水、爸爸走、不要！）｜24月：三詞句（寶寶要喝水）',
    expression: '用詞+手勢表達多重含義（說「要」同時伸手）、開始問「這是什麼？」',
    note: '18月是詞彙爆發的關鍵時間點，此後每週平均新增10個新詞。若18月詞彙爆發未出現，需留意。注意：這個階段的語言發展是「被輸入量」決定的，跟孩子說越多，累積越多。',
    warning: '18月主動詞彙<10個→語言治療評估｜24月主動詞彙<50個→語言治療評估｜不使用手勢（指物/揮手）→評估',
    activities: ['每天親子共讀15-20分鐘（指著圖命名）', '描述孩子正在做的事（「你在踢球！球飛走了！」）', '擴充孩子說的話（孩子說「水」→你說「要喝水，冷冷的水」）', '唱兒歌和動作歌（頭兒肩膀膝腳趾）', '避免「聽懂就給」，鼓勵孩子開口說'],
    bilingual: '雙語詞彙混用（中英混搭）完全正常，不代表混亂或語言障礙。看總詞彙量（兩種語言加起來），而非單一語言的詞彙量。',
  },
  '2-3y': {
    vocab: '24月：200-300詞｜36月：500-1000詞',
    sentence: '3-4詞完整句（我要喝牛奶）→複雜句（因為我餓了所以要吃）｜開始問「為什麼？這是什麼？」',
    expression: '能敘述剛發生的簡單事件｜使用代名詞（我/你）｜理解並說出顏色/大小/位置',
    note: '這階段是語法爆炸期，每週都有新的語法結構出現。孩子開始問大量的「為什麼」，是語言和認知整合的重要標誌。陌生人應能聽懂孩子75%的話。',
    warning: '3歲陌生人聽不懂50%以上的話→語言清晰度評估｜3歲不使用3詞以上的句子→語言治療評估',
    activities: ['講故事（你說上句，孩子說下句）', '玩「描述遊戲」（這個東西是什麼顏色？圓的？）', '一起看圖書討論（「你覺得小熊接下來會做什麼？」）', '角色扮演（扮家家酒、醫生/病人）增加語言使用情境', '每天念繪本，讀完後問2-3個簡單問題'],
    bilingual: '雙語兒童的某一語言語法可能稍晚建立，但整體語言能力與單語兒童相當。重要：確保兩種語言都有足夠輸入（不只學校語言）。',
  },
  '3-5y': {
    vocab: '3歲：約1000詞｜5歲：約2000詞',
    sentence: '複雜句型（連接詞：因為/但是/如果/雖然）｜開始使用時態（昨天/明天）',
    expression: '能講有情節的故事（開始→中間→結尾）｜理解和使用比喻｜能解釋「為什麼」',
    note: '語言進入創意期：孩子開始創造新詞（把垃圾車叫「臭臭車」）、玩文字遊戲、押韻。這時期親子共讀是語言發展最有效的活動（Cochrane A級證據）。',
    warning: '5歲仍有多個固定的語音錯誤（如「兔子」說「肚子」）→語音評估｜無法敘述簡單事件序列→語言理解評估',
    activities: ['每天親子共讀20分鐘（選詞彙豐富的繪本）', '說故事接龍（輪流加一句）', '「詞語猜謎」（它是紅的、圓的、甜的，是什麼？）', '學習兒歌、順口溜（語音意識，閱讀準備度基礎）', '讓孩子「說說看」今天在學校發生了什麼（敘事能力）'],
    bilingual: '雙語兒童在抑制控制（執行功能）上優於單語兒童（Cochrane研究）。維持兩種語言的輸入，包括讓孩子在兩種語言環境中都有機會「說」。',
  },
  '5-7y': {
    vocab: '5歲：2000-3000詞｜7歲：4000-5000詞（開始從閱讀中習得詞彙）',
    sentence: '接近成人語法結構｜理解被動句（「貓被狗追了」）｜理解反話和玩笑',
    expression: '書寫語言萌發（認識常用字，開始寫名字）｜能解釋抽象概念｜論述能力初步',
    note: '語言和閱讀高度整合期。閱讀準備度關鍵：音素意識（知道「貓」有3個音）、字型意識（知道字是從左到右）。此時期親子共讀的書可更長、詞彙更豐富。',
    warning: '無法識別和自己名字相關的字→閱讀準備度評估｜無法理解同年齡閱讀材料→讀寫障礙篩查',
    activities: ['開始「手指跟著字走」的閱讀方式（建立字音對應）', '字母/注音拼音遊戲（磁鐵字母拼接）', '讓孩子自己「讀」（即使是看圖說故事）', '玩押韻遊戲（「貓、刀、高」押韻嗎？）', '圖書館每週借5-7本書自主選擇'],
    bilingual: '母語閱讀能力可遷移到第二語言（共同底層能力）。先建立一種語言的閱讀基礎，另一語言的閱讀習得會更快。',
  },
  '7-12y': {
    vocab: '7歲：5000詞｜12歲：15000-20000詞（大量從閱讀習得）',
    sentence: '書面語和口語開始分化｜複雜書面句型（主從句、分詞短語）｜修辭和比喻',
    expression: '論述/說服（能提出論點和理由）｜比喻和成語理解｜語用技巧成熟（不同場合用不同語體）',
    note: '語言成為學習工具。每天閱讀30分鐘的孩子，每年額外學習約100萬個詞彙的使用情境。差異化越來越大：閱讀量大的孩子，詞彙成長呈指數型。',
    warning: '閱讀速度明顯比同齡慢→讀寫障礙評估｜理解課文有困難但聽力理解正常→閱讀理解策略輔導',
    activities: ['每天固定閱讀30分鐘（讓孩子自選書目）', '讀完後討論：「你最喜歡哪一段？為什麼？」', '寫讀書心得（3句話）培養書面表達', '查字典習慣：遇到不懂的詞立刻查（電子字典更方便）', '參加辯論或演講活動，鍛鍊口語論述'],
    bilingual: '雙語學習在小學階段的優勢進一步顯現：更強的元語言意識，能分析語言規則。維持雙語的鑰匙是「功能」——讓兩種語言都有不可替代的使用場合。',
  },
}

const piagetStages = [
  {
    stage: '感覺動作期',
    age: '0–2 歲',
    key: '用感官和動作認識世界，建立基礎認知架構',
    traits: ['0-4月：反射期，吸吮/抓握為主要探索方式', '4-8月：開始重複有趣的動作（敲擊→有聲音→再敲）', '8-12月：客體永久性出現（布蓋住玩具後知道還在）', '12-18月：新方法嘗試，因果概念建立（推倒積木）', '18-24月：符號功能出現（用木棍代替電話）'],
    tips: ['感官探索箱：裝豆子/麵粉/沙子讓孩子用手探索', '藏玩具遊戲：布蓋住玩具，讓孩子找（8月後）', '提供不同材質物品（光滑/粗糙/柔軟），說出感覺', '讓孩子自由探索安全環境（不要過度限制）', '說出孩子的動作（「你在拍！好大聲！」）'],
    games: ['感官箱探索', '藏貓貓/藏玩具', '水沙玩耍', '敲打樂器', '鏡子遊戲（認識自己）'],
    color: '#5A8A5A',
    bg: '#EBF4EB',
  },
  {
    stage: '前運思期',
    age: '2–7 歲',
    key: '符號思維豐富，但以自我為中心，缺乏邏輯守恆',
    traits: ['自我中心思維：無法理解他人與自己有不同觀點', '萬物有靈論：相信玩具、太陽有情感和意志', '缺乏守恆概念：高細杯和矮寬杯「水量一樣」不理解', '象徵遊戲豐富：積木是城堡，毯子是海洋', '直覺思維：根據外觀而非邏輯做判斷'],
    tips: ['角色扮演遊戲促進觀點取替（換角色演）', '不急著糾正「錯誤」邏輯，好奇地問「為什麼你覺得呢？」', '用繪本建立因果思維（「先發生什麼，後來呢？」）', '守恆實驗：讓孩子自己倒水，親眼驗證', '讓孩子主導假想遊戲，跟著孩子的劇情走'],
    games: ['扮家家酒/角色扮演', '積木城堡建築', '水和容器實驗（守恆觀察）', '黏土捏塑', '排序遊戲（大中小）'],
    color: '#5E85A3',
    bg: '#EBF4FF',
  },
  {
    stage: '具體運思期',
    age: '7–12 歲',
    key: '邏輯思維發展，但需具體物件輔助，抽象思維受限',
    traits: ['守恆概念完全建立（數量/重量/體積守恆）', '分類能力：能依多重屬性分類（顏色+形狀）', '序列能力：能按大小/長短排序', '去自我中心：能站在他人角度思考', '理解規則和公平：道德推理開始'],
    tips: ['操作性學習：積木測量、秤重實驗、分組分類', '自然觀察日記：記錄植物生長、天氣變化', '數學用實物（積木/籌碼）建立概念，不急著進入抽象符號', '給予挑戰但不超前太多（最近發展區理論）', '讓孩子解釋解題過程，培養邏輯表達'],
    games: ['積木橋梁工程挑戰', '自然觀察日記', '棋類遊戲（圍棋/象棋）', '數學實物操作（分數切水果）', '地圖製作（方向感）'],
    color: '#B07548',
    bg: '#FDF0E8',
  },
  {
    stage: '形式運思期',
    age: '12 歲+',
    key: '抽象邏輯成熟，假設演繹，系統性思維',
    traits: ['抽象推理：能理解代數符號、哲學概念', '假設思維：「如果……那麼……」的推理', '系統性問題解決：考慮所有變量', '道德哲學思考：質疑規則的合理性', '後設認知：知道自己知道什麼，知道自己不知道什麼'],
    tips: ['辯論時事（支持孩子提出論點，即使不同意）', '科學實驗設計：讓孩子自己設計變量控制', '鼓勵質疑和批判性思維（「你怎麼知道這是真的？」）', '尊重孩子的獨立見解，保持開放對話', '引導閱讀有深度的書（小說/哲學/科普）'],
    games: ['辯論和時事討論', '複雜桌遊（文明/移民火星）', '科學實驗設計', '閱讀哲學繪本', '思想實驗（電車問題等）'],
    color: '#5E85A3',
    bg: '#EBF4FF',
  },
]

const subjectGuide = [
  {
    subject: '數學', age: '3–8歲',
    method: '數積木/步數/餅乾、形狀分類、用實物做加減法（拿走3顆積木）、量高度比較、分組計數',
    milestone: '3歲：認識1-10、形狀分類｜5歲：10以內加減（實物）｜7歲：基礎加減法自動化、簡單分數概念',
    activities: ['「數步走路」：走路時數步數，到10換另一腳', '超市數學：讓孩子數水果、比較哪堆多', '積木測量：用積木量桌子多少「積木長」', '烹飪數學：量杯、半杯、四分之一（分數直觀）'],
    avoid: '提前做計算題紙本（3歲前）｜用記憶代替理解（死背九九乘法表前先理解）｜因計算錯誤責罵',
  },
  {
    subject: '語文/閱讀', age: '0歲起',
    method: '每天親子共讀15-30分鐘、說故事接龍、字卡遊戲、指字閱讀、圖書館定期借書',
    milestone: '3歲：認識自己名字的字｜5歲：認識常用字30-50個｜7歲：獨立閱讀短文｜10歲：閱讀為主要學習方式',
    activities: ['繪本讀完後問「接下來會怎樣？」（預測）', '讓孩子「讀」給你聽（即使是看圖說故事）', '做書籤：孩子設計自己的書籤', '寫/畫一本自製小書（孩子是作者）'],
    avoid: '大量抄寫漢字（6歲前）｜枯燥拼音/注音練習（應配合有意義的詞）｜強迫讀不感興趣的書',
  },
  {
    subject: '自然科學', age: '3–10歲',
    method: '觀察蝸牛/植物/昆蟲生長記錄、簡單家庭實驗（醋和小蘇打）、天氣觀察日記、參觀科學館',
    milestone: '4歲：能觀察並描述現象（「葉子是綠的/有斑點」）｜6歲：提出問題和假設｜8歲：設計簡單實驗',
    activities: ['種豆芽菜：每天觀察記錄（畫圖/照相）', '廚房科學：食用色素在水裡擴散', '「為什麼」日記：每天記錄一個好問題', '夜晚觀星：認識月亮變化（30天月相記錄）'],
    avoid: '只背答案，不觀察過程｜否定孩子的「錯誤」假設（科學就是提出假設驗證）｜要求「正確結論」而非「好問題」',
  },
  {
    subject: '藝術表達', age: '2歲起',
    method: '自由塗鴉（提供大紙和粗筆）、黏土/麵團捏塑、音樂律動、混色實驗、拼貼創作',
    milestone: '2歲：自由塗鴉（歷程重於結果）｜4歲：畫出有意義的圖（人/房子）｜6歲：有細節的創作',
    activities: ['混色實驗：三原色加水混出各種顏色', '撕紙拼貼：雜誌圖案剪下拼成新圖', '音樂律動：聽不同節奏用身體反應', '用不同工具畫：海綿/牙刷/葉子印章'],
    avoid: '批評作品「不像」｜要求臨摹標準答案｜過早強調技巧（如素描透視）而非表達｜比較兄弟姊妹的作品',
  },
  {
    subject: '社會探索', age: '3歲起',
    method: '角色扮演（醫生/老師/廚師/消防員）、參觀社區設施（消防局/農場/市場）、合作任務、義工活動',
    milestone: '3歲：了解基本社會角色｜5歲：理解規則和公民概念｜8歲：開始理解公平/正義/道德',
    activities: ['超市「購物任務」：讓孩子負責選擇和付款', '家庭角色扮演：一天的「小廚師/小助手」', '社區觀察：走出去找10種社區職業', '討論新聞中的社會問題（適齡化）'],
    avoid: '過早強調競爭（輸贏）而忽視合作｜只關注學業成績，忽視公民素養｜不給孩子承擔責任的機會',
  },
]

// ===== 黃瑽寧醫師課程架構：教育深度指南 =====

const INTELLIGENCE_TOPICS = [
  {
    id: 'keyFactors',
    title: '智力發展關鍵因素',
    emoji: '🧠',
    content: `影響孩子智力發展的關鍵因素（按影響力排序）：\n\n1. 安全依附關係（最重要）：感覺被愛、被理解的孩子，大腦才有安全感去探索和學習。壓力荷爾蒙皮質醇過高會抑制大腦發育。\n\n2. 豐富的語言輸入：出生到3歲是大腦語言神經網路快速建立期。和孩子說話的「品質」（互動性、回應性）比數量更重要。\n\n3. 親子共讀：每天15–30分鐘，是已知對語言、認知、情緒最綜合有效的活動（Cochrane A級）。\n\n4. 自由遊戲時間：非結構性的自由玩耍促進執行功能、創造力、解決問題能力。\n\n5. 睡眠充足：記憶鞏固發生在深睡眠。學齡前兒童每少睡1小時，注意力和記憶力顯著下降。\n\n不影響智力的因素：閃卡、早期識字、提前學習算術（缺乏長期效益的科學證據）。`,
  },
  {
    id: 'talkMore',
    title: '多說話：語言輸入的藝術',
    emoji: '💬',
    content: `美國學者 Hart & Risley 的研究（3000萬詞彙研究）發現：\n• 高收入家庭的孩子到3歲，比低收入家庭多接觸了3000萬個詞彙\n• 這個差距直接預測4–6歲的語言能力和學業準備度\n\n7:1 說話原則：每一個「指令/糾正」，應該配上至少7個「肯定/描述/對話」。\n\n如何「說話」最有效？\n• 描述孩子正在做的事：「你在把積木疊高高！」\n• 擴充孩子說的話：孩子說「狗狗」，你說「是啊，那是一隻棕色的大狗狗！」\n• 提問引發思考（而非測試）：「你覺得接下來會怎樣？」\n• 說自己的思考過程：「媽媽在想今天午餐要做什麼，我要看看冰箱有什麼...」\n\n💙 和孩子說話的黃金時間：洗澡、吃飯、搭車、睡前，這些日常中的對話是最寶貴的語言課。`,
  },
  {
    id: 'sharedReading',
    title: '親子共讀的科學',
    emoji: '📚',
    content: `親子共讀是已知對孩子發展最有影響的單一活動，Cochrane 系統性回顧證實對語言、認知、親子關係、情緒調節都有顯著正效益。\n\n什麼樣的共讀最有效？\n• 互動式共讀（Dialogic Reading）比「讀出來」更好\n• 問問題：「你覺得小熊為什麼難過？」\n• 讓孩子預測：「你覺得接下來會發生什麼？」\n• 連結生活：「你也有過這樣的感覺嗎？」\n• 讓孩子自己翻頁、指圖、說出來\n\n選書原則：\n• 0–2歲：厚紙板書、洞洞書、押韻書\n• 2–4歲：簡單情節、重複句型、豐富圖畫\n• 4–6歲：角色有情緒、有問題需要解決的故事\n• 6歲+：孩子自選，什麼類型都好\n\n💙 不需要讀「有教育意義」的書。孩子喜歡、你們一起笑、一起討論，就是最好的共讀。`,
  },
  {
    id: 'playTogether',
    title: '一起玩：遊戲的學習力',
    emoji: '🎮',
    content: `遊戲是孩子的工作。自由遊戲（非結構性）促進：\n• 執行功能（計劃、靈活切換、抑制衝動）\n• 創造力和問題解決\n• 社交技能（協商、輪流、同理）\n• 情緒調節\n\n「以孩子主導」的遊戲最有效：\n• 讓孩子決定玩什麼、怎麼玩\n• 你的角色是「在場的夥伴」，而非「老師/導演」\n• 跟著孩子的劇情走，不要糾正「玩法不對」\n• 大量描述和讚美（「哇，你把橋蓋到這麼高！」）\n\n不同年齡的遊戲重點：\n• 0–2歲：感官探索（沙/水/麵粉）、藏貓貓、因果玩具\n• 2–4歲：角色扮演、積木建構、繪畫塗鴉\n• 4–7歲：合作遊戲、桌遊、戶外探索\n• 7歲+：棋盤遊戲、收集興趣、競技體育\n\n💙 每天15–30分鐘不看手機、完全專注和孩子玩，是最廉價最有效的「育兒投資」。`,
  },
]

const LANGUAGE_EXTRA_TOPICS = [
  {
    id: 'delayJudge',
    title: '語言遲緩如何判斷',
    emoji: '🔔',
    content: `語言遲緩的「三不原則」（不急著確診、不盲目等待、不只看詞彙量）：\n\n需要評估的信號：\n• 12月：呼名不回應（可能聽力問題）\n• 18月：主動詞彙少於10個、不會指物\n• 24月：主動詞彙少於50個、不說兩個詞的短句\n• 3歲：陌生人聽不懂50%以上的話\n• 任何年齡：語言發展停滯不前或退步\n\n如何區分「正常晚說話」和「需要評估」？\n• 晚說話但理解力正常（聽懂指令）→ 觀察為主\n• 晚說話且理解力也落後 → 需要評估\n• 有其他發展疑慮（眼神接觸、社交） → 需要評估\n\n評估管道：\n• 兒科醫師門診\n• 語言治療師（SLP）直接評估\n• 台灣各縣市早療聯合評估中心（免費）\n\n💙 早期介入在3歲前效果最好，評估不是「確診問題」，而是「了解孩子」。不要等，有疑慮就諮詢。`,
  },
  {
    id: 'bilingualPrinciples',
    title: '雙語三大原則',
    emoji: '🌍',
    content: `原則一：一人一語（OPOL, One Parent One Language）\n最有效的雙語環境策略。爸爸固定說一種語言，媽媽固定說另一種。孩子的大腦非常擅長分離不同語言的規則，這不會造成混亂。\n\n原則二：看總詞彙量，不只看單一語言\n雙語兒童的任一單一語言詞彙可能少於單語同齡兒童，但兩種語言加起來的概念詞彙總量通常相當甚至更多。評估語言發展時需要用「概念詞彙」衡量（兩語言加總）。\n\n原則三：確保「功能性使用」維持雙語\n語言需要使用才不會消退。讓每種語言都有不可替代的使用場合：\n• 家裡說媽媽語言，學校說教學語言\n• 一種語言的朋友圈、一種語言的書\n• 旅行/視訊讓孩子接觸第二語言的真實場合\n\n雙語的認知優勢：注意力控制、多工處理、轉換思維方式，這些益處在雙語程度越高的孩子身上越明顯。\n\n💙 最常見的錯誤：擔心混亂而放棄一種語言。請放心，大腦能夠處理多種語言。`,
  },
]

const FOCUS_TOPICS = [
  {
    id: 'correctExpectation',
    title: '正確的學習期待',
    emoji: '🎯',
    content: `「三歲前不需要學認字」「幼兒園重點不是學科知識」這些說法的科學依據是什麼？\n\n大腦的學習方式（Vygotsky 最近發展區）：\n孩子最能有效學習的範圍，是「剛好有一點挑戰」的事——比目前能力稍微高一點點。太容易無聊，太難挫折放棄。\n\n不同年齡的正確學習目標：\n• 0–3歲：建立安全感、感官探索、基礎語言輸入\n• 3–5歲：自由遊戲、社交學習、語言豐富化、好奇心保護\n• 5–7歲：閱讀準備度、數概念直觀（非算術）、學習習慣建立\n• 7歲+：學科知識、學習策略、自主閱讀\n\n提前學習的研究結果：\n• 幼兒園學認字、算術的孩子，在小學一年級有短暫優勢\n• 到小學三年級，差異消失（追趕效應）\n• 但早期過度學業壓力，對學習動機有持久負面影響\n\n💙 種樹的最佳時機是今天，但你澆的水要是對的水。好奇心和學習熱情，比超前學習更值得保護。`,
  },
  {
    id: 'brainHowWork',
    title: '大腦怎麼學習最有效',
    emoji: '⚡',
    content: `學習科學的幾個反直覺發現：\n\n1. 睡眠比熬夜多學更有效\n記憶鞏固發生在深睡眠。學了之後睡一覺，記憶比繼續學習更穩固。不要因為功課多讓孩子少睡。\n\n2. 間隔複習比集中學習好\n「今天學10次」不如「連續5天每天學2次」。間隔效應是記憶科學最確定的發現之一。\n\n3. 主動提取比再讀一遍好\n讓孩子合上書回答問題（即使答不出），比再讀一遍更能強化記憶。不要只劃重點，要自我測試。\n\n4. 犯錯是學習必要條件\n當孩子犯錯然後得到正確答案，學習效果最強。不要保護孩子不犯錯——犯錯後的驚訝感讓記憶更深刻。\n\n5. 情緒參與促進記憶\n有情緒連結的學習（好奇/驚訝/有趣）比無情緒的學習記憶更持久，這就是為什麼「玩中學」有效。`,
  },
  {
    id: 'screenTime',
    title: '3C 管控原則',
    emoji: '📱',
    content: `美國兒科學會（AAP）和台灣兒科醫學會的建議：\n• 18月以下：除視訊通話外，避免螢幕\n• 18–24月：只有高品質內容，且需家長陪同觀看\n• 2–5歲：每天不超過1小時，陪同觀看\n• 6歲+：建立一致的限制，確保不影響睡眠、運動、學習\n\n3C 對孩子的實際影響：\n• 快速切換的螢幕內容降低真實世界的注意力（不是讓孩子專注力差，是讓他們習慣高刺激）\n• 就寢前螢幕藍光抑制褪黑激素，影響睡眠品質\n• 社群媒體與8歲以上孩子的焦慮/憂鬱相關（對女孩尤其顯著）\n\n如何管理 3C？\n• 規則孩子參與制定，比大人單方規定更容易遵守\n• 充電器放客廳，手機不進臥室\n• 就寢前1小時無螢幕（全家一起執行）\n• 用「時間代幣」而非「禁止」（限量但不匱乏）\n• 陪孩子選擇高品質內容，而非直接說「不行」\n\n💙 重點不是完全禁3C，而是讓孩子建立「我可以決定何時用、何時放下」的自主控制感。`,
  },
  {
    id: 'learningFun',
    title: '讓學習變有趣',
    emoji: '✨',
    content: `內在動機 vs 外在動機：\n給予外在獎勵（貼紙/零食/金錢）換取學習，短期有效，但長期降低內在學習動機（這是有研究支持的）。\n\n什麼促進內在動機？\n• 自主感（可以選擇）：「你要先做數學還是國語？」\n• 能力感（感覺進步）：「你今天比昨天多做對3題！」\n• 連結感（有人陪伴）：陪孩子學習，而非監督孩子學習\n\n具體讓學習變有趣的方法：\n• 遊戲化：字卡遊戲、數學競賽（和上次的自己比）\n• 故事化：把計算題的數字變成角色（6顆糖果和3顆糖果戰鬥）\n• 真實應用：買東西找零錢、烹飪量杯\n• 選擇感：今天學什麼順序、用什麼方式學\n• 慶祝小進步：「你今天比昨天早5分鐘寫完功課！」\n\n自信心和學習的關係：\n相信「我能進步」（成長型思維）比「我聰明」更重要。稱讚努力和策略，不只稱讚結果。\n\n💙 孩子對學習的態度，大部分來自觀察你對待學習的態度。`,
  },
]

interface LearningRecord {
  id: string
  date: string
  type: 'book' | 'exam' | 'milestone'
  desc: string
  analyzed: boolean
}

const BOOK_ANALYSIS: {
  great: string[]
  suggestions: string[]
  weekGoal: string
  cheer: string
} = {
  great: [
    '孩子能順暢閱讀句子，斷句自然，語調有起伏，顯示理解力很好 🎉',
    '肯坐下來唸書這件事本身就很棒，閱讀習慣的建立是最珍貴的禮物 ✨',
  ],
  suggestions: [
    '捲舌音可以用有趣的方式練習：一起對著鏡子比賽誰的舌頭捲得更高，遊戲中練習更輕鬆',
    '讀完後可以聊聊「你最喜歡哪一段？為什麼？」培養理解深度而不只是「讀出來」',
    '試試讓孩子「讀給玩具聽」，消除讀書的壓力感',
  ],
  weekGoal: '這週試試每天10分鐘親子共讀：孩子讀，你聽，讀完後聊一聊 📖',
  cheer: '喜歡閱讀的孩子，世界永遠不會無聊。你給孩子的這份習慣，比任何補習班都值錢 💙',
}

const EXAM_ANALYSIS: {
  great: string[]
  suggestions: string[]
  weekGoal: string
  cheer: string
} = {
  great: [
    '書寫工整、計算步驟清楚，這個學習習慣非常棒，高年級會越來越有優勢 ✨',
    '願意嘗試所有題目，沒有放棄，這個態度比答對更重要 💙',
  ],
  suggestions: [
    '應用題可以練習「先讀、再圈關鍵詞、再列式」三步驟，不是孩子不會，是需要找到方法',
    '分數概念先用切水果/披薩操作建立直覺，比直接做算式題有效得多',
    '每次練習後稱讚孩子「你今天比昨天多堅持了5分鐘」，而不只是看分數',
  ],
  weekGoal: '這週練習2題應用題：拿出紙筆一起讀、圈出關鍵詞、一起列式，享受解謎的過程 🧮',
  cheer: '孩子遇到挫折願意繼續嘗試，是最難能可貴的品格。成績是過程，韌性才是一輩子的資產 💙',
}

const EDU_HUANG_TOPICS = [
  {
    id: 'intelligence',
    emoji: '🧠',
    title: '智力發展',
    badge: '黃瑽寧醫師',
    bgColor: '#F0F4FF',
    borderColor: '#B8C5E8',
    headerColor: '#3A5AA0',
    sections: [
      {
        title: '如何科學提升智力？',
        content: '好消息：智力不是固定的，是可以培養的！\n\n三歲前最有效的三件事：\n① 多說話：鼓勵比責備多7倍（7:1原則），每月針對一個溝通主題深入互動\n② 擁抱、溫暖：有愛的環境讓大腦發育更好\n③ 一起玩：非結構性遊戲，讓孩子主導，你跟著玩\n\n💡 親子共讀效益極高：每天15分鐘的繪本時間，對語言和認知發展的影響超過大多數學習課程。',
      },
      {
        title: '成長型思維的培養',
        content: '成長型思維（Growth Mindset）是孩子面對挫折的最好武器。\n\n大腦真的像肌肉，是訓練出來的！\n\n怎麼稱讚？\n❌ 「你好聰明！」（固定型思維）\n✅ 「你這次很努力！」「你有這種特質，很棒！」（成長型思維）\n\n同時：\n• 告訴孩子誠實的好結果（獎勵誠實本身）\n• 父母間也要誠實（身教環境）\n• 養邏輯思維：多做創造性活動，不限制做法和說法',
      },
      {
        title: '支持型父母 vs 控制型父母',
        content: '支持型父母培養出有內在動機的孩子！\n\n關鍵公式：\n• 7成事情讓孩子與父母討論決定\n• 3成事情由父母決定\n\n讓孩子有參與感和自主感，內在動機就會自然生長。\n\n「自己參與決定的事，就會想要完成它。」\n\n💡 每天花時間做一件孩子喜歡、你也一起的事，親子關係好了，什麼事都好溝通。',
      },
    ],
  },
  {
    id: 'language',
    emoji: '🗣️',
    title: '語言力',
    badge: '黃瑽寧醫師',
    bgColor: '#FFF8F0',
    borderColor: '#F5D5A8',
    headerColor: '#B07548',
    sections: [
      {
        title: '語言發展時間軸',
        content: '每個孩子都有自己的語言節奏，這個時間軸幫你了解大方向：\n\n• 7個月：發出聲音（咿咿呀呀）\n• 9個月：模仿大人說話的音調\n• 11個月：理解「不要」、「88」\n• 1歲：叫爸媽\n• 1.3歲：說單字\n• 1.5歲：說5個詞、可以指身體部位\n• 2歲：說短句子\n• 3歲：跟音、可仿說句型\n• 4歲：發出ㄈ、ㄆ、ㄘ等氣音\n• 5歲：捲舌音、出入（對、錯）概念清楚',
      },
      {
        title: '語言遲緩怎麼判斷？',
        content: '先放鬆！語言發展個體差異很大，男孩普遍比女孩慢一點。\n\n需要評估的指標（這是建議不是警告）：\n• 1歲還沒有任何有意義的詞（爸爸、媽媽、不要）\n• 2歲說的詞少於50個，或還不會說兩個字的組合\n• 3歲陌生人聽不懂他說的話\n\n3-4歲結巴是正常的！大腦轉得比嘴巴快，幫他把話接上就好，不要幫他說完，讓他自己慢慢說出來。\n\n4-5歲大舌頭（說話不清楚）可以觀察，大多數會自然改善。',
      },
      {
        title: '雙語三大原則',
        content: '10歲前學英文，可以達到母語者95%的程度——不用焦慮，慢慢來！\n\n重要：要不要讓孩子學第二語言，先看孩子的個性和喜好，喜歡就加，不喜歡不要勉強。\n\n三大原則：\n① 先建立母語的穩固基礎（中文好，英文學更快）\n② 語言學習要在有意義的情境中（看英文卡通、英文繪本、跟外師玩）\n③ 不要讓孩子有壓力（語言是工具，不是成績）\n\n💡 親子共讀是最有效的語言投資：每天15分鐘，長期效益驚人！',
      },
    ],
  },
  {
    id: 'focus',
    emoji: '🎯',
    title: '專注力',
    badge: '黃瑽寧醫師',
    bgColor: '#F5FFF5',
    borderColor: '#A8D5A8',
    headerColor: '#2E7B2E',
    sections: [
      {
        title: '孩子的正常專注時間',
        content: '孩子「坐不住」有時候只是因為要求太高了！\n\n正常的專注時間參考：\n年齡 × 2~5 分鐘 = 合理專注時長\n\n例如：4歲的孩子專注8-20分鐘是正常的\n\n💡 專注力是一個光譜，不是有沒有，而是多少。如果擔心孩子有ADHD傾向，建議給專業評估，不要自行診斷。',
      },
      {
        title: '大腦運作良好，專注力才好',
        content: '這四件事是專注力的基礎，比任何訓練都重要：\n\n① 充足睡眠（睡眠時數）：\n0-3月14hr、4-11月12hr、1-2歲11hr\n3-5歲10hr、6-13歲9hr、14-17歲8hr\n\n② 積極運動：每天至少60分鐘身體活動\n\n③ 健康飲食：避免過多化學添加物（色素、防腐劑、人工甜味劑）\n\n④ 控制疾病：過敏、慢性鼻炎、睡眠呼吸問題都會影響專注力',
      },
      {
        title: '排除學習障礙',
        content: '孩子學習效果差，先檢查有沒有這些狀況：\n\n生理面：\n• 視力問題（近視？斜弱視？）\n• 聽力問題（慢性中耳炎？聽損？）\n• 睡眠問題（睡不夠、睡眠呼吸中止）\n• 過敏引起的慢性不舒服\n\n心理面：\n• 學習焦慮（怕錯、怕被笑）\n• 家庭壓力或關係問題\n• 閱讀/書寫障礙（dyslexia）\n\n💡 在幫孩子加課前，先確認沒有這些障礙——排除障礙的效果遠大於補習！',
      },
      {
        title: '建立自信心，產生內在動機',
        content: '習得無助感（Learned Helplessness）是學習最大的敵人。\n\n破除習得無助感四步驟：\n① 建立歸屬感（孩子感受到被接受和被愛）\n② 任務由淺入深（先讓他有成功經驗）\n③ 建立自信心（稱讚努力和過程）\n④ 產生內在動機（因為有趣、有意義，而不是為了獎勵）\n\n幼兒園選擇小提醒：\n好的幼兒園培養抽象技能（專注力、工作記憶、合作、解決問題），傾聽多於教導，有自由活動時間和運動機會。',
      },
      {
        title: '3C 管理原則',
        content: 'WHO建議：2歲以下不看螢幕，2-5歲每天不超過1小時，6歲以上有限度使用。\n\n但比時間更重要的是：\n• 一起看（有陪伴的3C體驗比獨自使用效益高很多）\n• 看完討論（「剛剛那個好玩嗎？學到什麼？」）\n• 睡前1小時停用所有螢幕（藍光影響睡眠）\n\n💡 與其禁止，不如建立家庭3C使用規則（家人一起制定，孩子更願意遵守）。',
      },
    ],
  },
  {
    id: 'school-choice',
    emoji: '🏫',
    title: '幼兒園選擇指南',
    badge: '黃瑽寧醫師',
    bgColor: '#F5F0FF',
    borderColor: '#C5B8E8',
    headerColor: '#6B4FA0',
    sections: [
      {
        title: '學前教育的正確期待',
        content: '好的學前教育培養的是這些，而不是提早學注音、算術：\n\n🎯 最重要的五件事：\n① 培養抽象技能：專注力、工作記憶、合作、解決問題\n② 鼓勵正向行為\n③ 更多自由活動（非結構性遊戲）\n④ 更多運動機會\n⑤ 傾聽多於教導\n\n「玩就是學習」——這是有大量科學研究支持的。',
      },
      {
        title: '蒙特梭利 vs 華德福',
        content: '兩種都是以孩子需求出發的全人教育，各有特色：\n\n共同點：關注孩子需求出發，全人教育\n\n🔵 蒙特梭利：\n• 混齡班（大帶小，互相學習）\n• 精心設計的教具環境\n• 手的操作 × 實際面\n• 培養獨立思考、為自己負責，在世界中找到定位\n\n🟢 華德福：\n• 到小學就不混齡\n• 自己畫課本（沒有標準課本）\n• 藝術面 × 感官（每堂課都有畫畫、音樂）\n• 良善純美、與自然土地連結\n\n💡 選擇前，多去實際參觀，看孩子喜不喜歡那個氛圍！',
      },
    ],
  },
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
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  function toggleAccordion(id: string) {
    setOpenAccordion(prev => prev === id ? null : id)
  }
  const [showBookAI, setShowBookAI] = useState(false)
  const [showExamAI, setShowExamAI] = useState(false)
  const [openEduTopic, setOpenEduTopic] = useState<string | null>(null)
  const [openEduItem, setOpenEduItem] = useState<string | null>(null)
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
        <p className="text-sm text-white opacity-80 mt-0.5">激發寶貝天生的學習熱情</p>
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
                  <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>語言發展標準</h2>
                  <span className="evidence-badge">Cochrane A</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: '詞彙量標準', value: langData.vocab, color: '#5E85A3', bg: '#EBF4FF' },
                    { label: '句型發展', value: langData.sentence, color: '#5A8A5A', bg: '#EBF4EB' },
                    { label: '表達能力', value: langData.expression, color: '#B07548', bg: '#FDF0E8' },
                  ].map(item => (
                    <div key={item.label} className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                      <div className="inline-block px-2 py-0.5 rounded-lg text-xs font-bold mb-2" style={{ background: item.bg, color: item.color }}>{item.label}</div>
                      <p className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl" style={{ background: '#F5F8FF', borderColor: '#C5D8E8', border: '1px solid #C5D8E8' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: '#5E85A3' }}>發展特點與重要里程碑</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7B8D' }}>{langData.note}</p>
                </div>
                <div className="p-4 rounded-2xl border" style={{ background: '#EBF8EB', borderColor: '#A8D8A8' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#3A7A3A' }}>推薦活動與練習方式</p>
                  <div className="space-y-1.5">
                    {langData.activities.map((a, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Star size={11} className="shrink-0 mt-0.5" style={{ color: '#5A8A5A' }} fill="#5A8A5A" />
                        <p className="text-xs" style={{ color: '#2D3436' }}>{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: '#FDF5FF', borderColor: '#D5A8F5', border: '1px solid #D5A8F5' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: '#7A4A9A' }}>雙語環境建議</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#5A3A7A' }}>{langData.bilingual}</p>
                </div>
                <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#EBF4FF', borderColor: '#C5D8E8', border: '1px solid #C5D8E8' }}>
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" style={{ color: '#5E85A3' }} />
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: '#5E85A3' }}>可以多留意的地方</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#4A6A83' }}>{langData.warning}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#EBF4FF', borderColor: '#C5D8E8', border: '1px solid #C5D8E8' }}>
                  <Info size={14} className="shrink-0 mt-0.5" style={{ color: '#5E85A3' }} />
                  <p className="text-xs" style={{ color: '#5E85A3' }}>語言發展具有大範圍個體差異，以上為一般參考值。若擔心孩子發展，請諮詢語言治療師（SLP）評估，早期介入效果最佳。</p>
                </div>

                {/* 語言力深度指南（手風琴） */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={15} style={{ color: '#7B9EBD' }} />
                    <h3 className="font-bold text-sm" style={{ color: '#2D3436' }}>語言力深度指南</h3>
                    <span className="evidence-badge">黃瑽寧醫師</span>
                  </div>
                  <div className="space-y-2">
                    {LANGUAGE_EXTRA_TOPICS.map(topic => (
                      <div key={topic.id} className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                        <button
                          onClick={() => toggleAccordion('lang_' + topic.id)}
                          className="w-full flex items-center justify-between px-4 py-3"
                        >
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 18 }}>{topic.emoji}</span>
                            <span className="text-sm font-semibold" style={{ color: '#2D3436' }}>{topic.title}</span>
                          </div>
                          <ChevronDown
                            size={16}
                            style={{ color: '#7B9EBD', transform: openAccordion === 'lang_' + topic.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                          />
                        </button>
                        {openAccordion === 'lang_' + topic.id && (
                          <div className="px-4 pb-4">
                            <div className="p-3 rounded-xl" style={{ background: '#FDF5FF' }}>
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
                    <div className="mt-3 p-3 rounded-xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                      <p className="text-xs font-bold mb-1.5" style={{ color: '#5E85A3' }}>推薦遊戲 & 活動</p>
                      <div className="flex flex-wrap gap-1.5">
                        {stage.games.map((g, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-xl" style={{ background: stage.bg, color: stage.color }}>{g}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 智力發展深度指南（手風琴） */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={15} style={{ color: '#7B9EBD' }} />
                  <h3 className="font-bold text-sm" style={{ color: '#2D3436' }}>智力發展深度指南</h3>
                  <span className="evidence-badge">黃瑽寧醫師</span>
                </div>
                <div className="space-y-2">
                  {INTELLIGENCE_TOPICS.map(topic => (
                    <div key={topic.id} className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                      <button
                        onClick={() => toggleAccordion('intel_' + topic.id)}
                        className="w-full flex items-center justify-between px-4 py-3"
                      >
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 18 }}>{topic.emoji}</span>
                          <span className="text-sm font-semibold" style={{ color: '#2D3436' }}>{topic.title}</span>
                        </div>
                        <ChevronDown
                          size={16}
                          style={{ color: '#7B9EBD', transform: openAccordion === 'intel_' + topic.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                        />
                      </button>
                      {openAccordion === 'intel_' + topic.id && (
                        <div className="px-4 pb-4">
                          <div className="p-3 rounded-xl" style={{ background: '#EBF4EB' }}>
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
                    <p className="text-xs mb-2" style={{ color: '#6B7B8D' }}>
                      <span className="font-semibold" style={{ color: '#5A8A5A' }}>推薦方法：</span>{g.method}
                    </p>
                    <p className="text-xs mb-2" style={{ color: '#6B7B8D' }}>
                      <span className="font-semibold" style={{ color: '#5E85A3' }}>里程碑：</span>{g.milestone}
                    </p>
                    <div className="p-3 rounded-xl mb-2" style={{ background: '#EBF8EB' }}>
                      <p className="text-xs font-bold mb-1.5" style={{ color: '#3A7A3A' }}>具體活動</p>
                      {g.activities.map((a, i) => (
                        <div key={i} className="flex items-start gap-1.5 mb-1">
                          <Star size={10} className="shrink-0 mt-0.5" style={{ color: '#5A8A5A' }} fill="#5A8A5A" />
                          <span className="text-xs" style={{ color: '#2D3436' }}>{a}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: '#8E9EAD' }}>
                      <span className="font-semibold" style={{ color: '#C45A5A' }}>避免：</span>{g.avoid}
                    </p>
                  </div>
                ))}
              </div>

              {/* 專注力深度指南（手風琴） */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={15} style={{ color: '#7B9EBD' }} />
                  <h3 className="font-bold text-sm" style={{ color: '#2D3436' }}>專注力與學習深度指南</h3>
                  <span className="evidence-badge">黃瑽寧醫師</span>
                </div>
                <div className="space-y-2">
                  {FOCUS_TOPICS.map(topic => (
                    <div key={topic.id} className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                      <button
                        onClick={() => toggleAccordion('focus_' + topic.id)}
                        className="w-full flex items-center justify-between px-4 py-3"
                      >
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 18 }}>{topic.emoji}</span>
                          <span className="text-sm font-semibold" style={{ color: '#2D3436' }}>{topic.title}</span>
                        </div>
                        <ChevronDown
                          size={16}
                          style={{ color: '#7B9EBD', transform: openAccordion === 'focus_' + topic.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                        />
                      </button>
                      {openAccordion === 'focus_' + topic.id && (
                        <div className="px-4 pb-4">
                          <div className="p-3 rounded-xl" style={{ background: '#FDF0E8' }}>
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

          {/* 黃瑽寧醫師課程：教育發展 */}
          <div className="px-5 py-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} style={{ color: '#7B9EBD' }} />
              <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>黃瑽寧醫師課程</h2>
              <span className="evidence-badge">教育發展</span>
            </div>
            <div className="space-y-3">
              {EDU_HUANG_TOPICS.map((topic) => (
                <div key={topic.id} className="rounded-2xl overflow-hidden border" style={{ borderColor: topic.borderColor }}>
                  <button
                    onClick={() => setOpenEduTopic(openEduTopic === topic.id ? null : topic.id)}
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
                      style={{ color: topic.headerColor, transform: openEduTopic === topic.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                    />
                  </button>
                  {openEduTopic === topic.id && (
                    <div className="border-t" style={{ borderColor: topic.borderColor, background: 'white' }}>
                      {topic.sections.map((section, si) => (
                        <div key={si} className="border-b last:border-b-0" style={{ borderColor: '#F0EDE8' }}>
                          <button
                            onClick={() => setOpenEduItem(openEduItem === `${topic.id}-${si}` ? null : `${topic.id}-${si}`)}
                            className="w-full flex items-center justify-between px-4 py-3"
                          >
                            <span className="text-sm font-semibold text-left" style={{ color: '#2D3436' }}>{section.title}</span>
                            <ChevronDown
                              size={14}
                              style={{ color: '#8E9EAD', flexShrink: 0, marginLeft: 8, transform: openEduItem === `${topic.id}-${si}` ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                            />
                          </button>
                          {openEduItem === `${topic.id}-${si}` && (
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
                <span style={{ fontSize: 20 }}>📚</span>
                <h2 className="font-black text-white text-base">學習成長記錄</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <p className="text-white font-black text-lg">3筆</p>
                  <p className="text-white text-xs opacity-80">學習里程碑</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <p className="text-white font-black text-lg">本月</p>
                  <p className="text-white text-xs opacity-80">持續記錄中</p>
                </div>
              </div>
              <p className="text-white text-xs opacity-90 text-center">記錄學習的每一步，見證孩子的成長 💙</p>
            </div>
          </section>

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
            <section className="space-y-3">
              <h2 className="font-bold" style={{ color: '#2D3436' }}>成長秘書的分析</h2>

              <div className="p-4 rounded-2xl border" style={{ background: '#EBF8EB', borderColor: '#A8D8A8' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 18 }}>🌟</span>
                  <p className="font-bold text-sm" style={{ color: '#3A7A3A' }}>你做得很棒的地方</p>
                </div>
                <div className="space-y-2">
                  {BOOK_ANALYSIS.great.map((item, i) => (
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
                  {BOOK_ANALYSIS.suggestions.map((item, i) => (
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
                <p className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{BOOK_ANALYSIS.weekGoal}</p>
              </div>

              <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: 18 }}>💪</span>
                  <p className="font-bold text-sm text-white">給你的加油打氣</p>
                </div>
                <p className="text-sm leading-relaxed text-white opacity-95">{BOOK_ANALYSIS.cheer}</p>
              </div>
              <p className="text-xs text-center" style={{ color: '#8E9EAD' }}>* 此為模擬分析結果</p>
            </section>
          )}

          {/* 考卷分析結果 */}
          {showExamAI && (
            <section className="space-y-3">
              <h2 className="font-bold" style={{ color: '#2D3436' }}>成長秘書的分析</h2>

              <div className="p-4 rounded-2xl border" style={{ background: '#EBF8EB', borderColor: '#A8D8A8' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 18 }}>🌟</span>
                  <p className="font-bold text-sm" style={{ color: '#3A7A3A' }}>你做得很棒的地方</p>
                </div>
                <div className="space-y-2">
                  {EXAM_ANALYSIS.great.map((item, i) => (
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
                  {EXAM_ANALYSIS.suggestions.map((item, i) => (
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
                <p className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{EXAM_ANALYSIS.weekGoal}</p>
              </div>

              <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: 18 }}>💪</span>
                  <p className="font-bold text-sm text-white">給你的加油打氣</p>
                </div>
                <p className="text-sm leading-relaxed text-white opacity-95">{EXAM_ANALYSIS.cheer}</p>
              </div>
              <p className="text-xs text-center" style={{ color: '#8E9EAD' }}>* 此為模擬分析結果</p>
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
