'use client'

import { useState } from 'react'
import {
  TrendingUp, BookOpen, ClipboardList, Ruler, Weight, Moon, Info,
  Camera, FileVideo, Sparkles, CheckCircle2, ChevronRight,
  Plus, X, Utensils, ChevronDown, Shield, Heart, AlertCircle, Syringe,
} from 'lucide-react'

type MainTab = 'knowledge' | 'records'
type KnowledgeTab = 'growth' | 'symptoms' | 'vaccine'

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
  nutrition: string[]
  storyNote: string
}> = {
  '0-3m': {
    height: '男 50–62 / 女 49–61 cm',
    weight: '男 3.3–7.0 / 女 3.2–6.5 kg',
    grossMotor: ['俯臥時抬頭（0–4週）', '俯臥時頭可撐起45度（約6週）', '俯臥時頭部可穩定抬高90度（約3月）', '手腳對稱性動作（踢腳/揮手）', '對聲音有驚嚇反應（Moro反射）'],
    fineMotor: ['反射性握拳（出生至2月）', '雙手可主動打開（約2月）', '追視水平移動物體（1–2月）', '注視人臉20–30秒（出生即有）', '手放入口探索（2–3月）'],
    sleep: '14–17 小時/天',
    sleepNote: '白天：多次小睡（每次45–120分鐘，共4–5次）｜夜間：每2–4小時需餵奶，連續睡眠不超過4小時。建議：讓嬰兒學習區分日夜，白天多互動，夜間保持昏暗安靜。',
    nutrition: ['純母乳或配方奶，按需哺乳 8–12 次/天', '配方奶：每次 60–120 ml（隨月齡遞增）', '母乳/配方奶是唯一所需食物，禁止添加副食品', '每天補充維生素 D 400 IU（純母乳嬰兒必須補充）', '注意：不要給嬰兒飲水，以免低血鈉'],
    storyNote: '0–3個月的寶寶正在從一個全新的世界探索者變成家庭的小太陽。這段時間你可能會發現寶貝大部分時間都在睡覺——別擔心，這是完全正常的，睡眠就是寶貝最重要的「工作」！你可能也注意到不同的哭聲聽起來不太一樣，餓的時候、累的時候、肚子不舒服的時候，寶貝已經在用自己的方式跟你說話了。約在6–8週左右，你會收到寶貝送給你的第一份大禮物——那個真正對著你綻放的社交微笑。那一刻，所有的辛苦都值得了。',
  },
  '4-6m': {
    height: '男 62–68 / 女 61–67 cm',
    weight: '男 6.0–8.5 / 女 5.5–8.0 kg',
    grossMotor: ['翻身（腹→背，約4月）', '翻身（背→腹，約5–6月）', '雙手撐胸俯臥（約4–5月）', '扶坐時頭部穩定（約4月）', '拉坐時頭部不後仰（約5月）'],
    fineMotor: ['伸手主動抓取物品（約4月）', '雙手換物（約5–6月）', '把玩具放入口中探索', '搖晃玩具製造聲音', '雙手同時抓住兩樣東西（約6月）'],
    sleep: '12–15 小時/天',
    sleepNote: '白天：午睡 3 次（上午、中午、下午，各 45–90 分鐘）｜夜間：可連續睡 5–6 小時。建議：4 月起可嘗試建立固定睡前儀式（洗澡→按摩→餵奶→放下）。',
    nutrition: ['母乳或配方奶仍為主食（每天 600–800 ml）', '4–6月可開始嘗試副食品（WHO建議6月後，個體差異大）', '副食品入門：鐵強化嬰兒米糊（1茶匙開始）', '單一食材試7天，無過敏反應再換新食材', '維生素 D 繼續每天補充 400 IU'],
    storyNote: '4–6個月的寶寶正在快速發現「我可以控制我的身體！」你可能會發現他/她開始瘋狂地練習翻身，翻過來翻過去停不下來。這個階段不用擔心寶貝一直把東西往嘴裡放——這是他/她認識世界最重要的方式，口腔是這個年齡的主要感官工具。你也可能注意到寶貝對你的臉、你的聲音，甚至你的情緒，都有越來越強烈的反應。寶貝正在學習「這個大人是我的，我讓她笑或讓她擔心」，親子互動的雙向溝通正在建立。',
  },
  '7-9m': {
    height: '男 68–74 / 女 66–72 cm',
    weight: '男 8.0–10.0 / 女 7.3–9.4 kg',
    grossMotor: ['獨立坐穩（約6–8月，不需支撐）', '腹部貼地爬行（約7–8月）', '四肢交替爬行（約8–10月）', '扶站（約8–10月）', '站立時可撐住自身重量數秒'],
    fineMotor: ['拇指+其他四指捏（耙型抓）', '拇指側面+食指捏（約8月）', '敲打兩個積木', '刻意丟棄物品（反覆練習）', '開始理解「給我」和「謝謝」手勢'],
    sleep: '12–15 小時/天',
    sleepNote: '白天：午睡 2 次（上午9–10點、下午1–2點，各60–90分鐘）｜夜間：10–11 小時。建議：此期分離焦慮開始，固定照顧者執行睡眠儀式非常重要。',
    nutrition: ['每天副食品 1–2 餐，母乳/配方奶仍每天 600 ml', '蛋白質來源：雞肝泥、魚泥、豆腐（每天30–40g）', '蔬菜泥：南瓜、地瓜、紅蘿蔔（每天2–3湯匙）', '可引入全蛋蛋黃（過敏風險已降低，早引入反降低風險）', '開始嘗試手指食物：香蕉片、地瓜條（訓練自主進食）'],
    storyNote: '7–9個月是寶寶「探險家」精神大爆發的時期！你可能會發現寶貝突然不滿足於待在原地了——爬行的動力越來越強，什麼都想去摸、去嘗試。這段時間如果出現「陌生人焦慮」，寶貝看到不熟悉的人就哭或躲，請不要擔心，這反而是一個好訊號，說明寶貝對照顧者建立了清晰的依附，能區分「親人」和「陌生人」了！繼續讓寶貝在安全的環境中自由探索，你的笑容就是最好的加油站。',
  },
  '10-12m': {
    height: '男 73–78 / 女 71–76 cm',
    weight: '男 9.0–11.0 / 女 8.5–10.5 kg',
    grossMotor: ['扶走（巡走，沿著家具行走）', '蹲下撿物後站起', '可獨立站立3–5秒', '可能開始獨立行走（10–15月）', '爬上矮沙發/台階'],
    fineMotor: ['拇指+食指精細捏取（鑷型抓）', '疊積木2塊', '模仿塗鴉動作（隨意筆跡）', '把小物品放入容器', '翻書頁（厚板書）'],
    sleep: '11–14 小時/天',
    sleepNote: '白天：午睡 1–2 次（逐漸整合為1次，共約1.5–2小時）｜夜間：穩定10–12小時。建議：10月前後可嘗試睡眠訓練（漸進式方式），建立固定睡覺時間。',
    nutrition: ['每天3餐副食品+2次點心，奶量 400–600 ml', '可引入全蛋（蒸蛋、炒蛋）', '軟固體食物：碎肉（每天30–40g）、豆腐、蒸魚', '避免：蜂蜜（1歲前）、整顆堅果（窒息風險）、含糖飲料', '鈣質需求 260mg/天（母乳/配方奶可提供大部分）'],
    storyNote: '快到一歲啦！這個月齡的寶寶正在努力站起來，努力向前邁步——有些寶寶已經開始「巡走」，扶著沙發、牆壁、椅子四處探險。你可能會發現寶貝摔跌的次數突然變多，別太緊張，這是學走路必經的過程。這個階段也是互動最有趣的時候，寶貝開始懂得「給」和「拿」的遊戲，會用手指著想要的東西，會模仿你拍手、揮手。每一個小動作背後，都是大腦在高速運轉的證明。',
  },
  '1-2y': {
    height: '男 75–92 / 女 74–90 cm',
    weight: '男 9.5–13.5 / 女 9.0–13.0 kg',
    grossMotor: ['獨立行走（12–15月）', '跑步但常跌倒（約18月）', '上下樓梯（扶欄，雙腳踩同一台階）', '蹲下再站起（靈活）', '踢固定的球（約18月）'],
    fineMotor: ['疊積木3–6塊', '自己翻書頁（紙書）', '用湯匙舀食（灑漏多）', '仿畫垂直線（約18月）', '把圓形插入形狀板'],
    sleep: '11–14 小時/天',
    sleepNote: '白天：午睡 1 次（約1–2小時，通常午飯後）｜夜間：10–12小時。建議：作息規律最重要，就寢時間固定在晚上7:30–8:30。',
    nutrition: ['全脂牛奶 360–480 ml/天（不超過600ml，避免影響食慾）', '每天1–2顆全蛋（蒸蛋/炒蛋/水煮蛋）', '肉類 30–50g/天（雞肉、魚肉、豬肉輪替）', '蔬菜 1/2 杯+水果 1/2 杯/天', '避免高糖、高鹽、加工食品。鈣質需求 700mg/天。'],
    storyNote: '1–2歲，俗稱「Terrible Two前奏」，但換個角度看：這是寶貝人生中第一次大聲宣告「我有自己的想法！」你可能會發現「不要」成了出現頻率最高的詞，哭鬧的次數也增加了——請把這理解為成長的信號，不是行為問題。這個時期的寶貝大腦前額葉（情緒調節的指揮官）還在快速發育中，能量和情緒遠超過他/她能控制的能力，爆發是難免的。你能做的最重要的事：在旁邊陪著、命名他/她的情緒、等風暴過去。你做得很好。',
  },
  '2-3y': {
    height: '男 87–101 / 女 85–100 cm',
    weight: '男 12–16 / 女 11.5–15.5 kg',
    grossMotor: ['雙腳跳躍（離地）', '單腳站立2–3秒（約30月）', '踢球、奔跑中轉向', '騎三輪車（腳踩踏板）', '走平衡木（寬15cm）'],
    fineMotor: ['疊積木6–8塊', '畫垂直線、水平線、圓形', '剪紙（直線）', '串大型珠子', '打開/關上簡單容器'],
    sleep: '10–13 小時/天',
    sleepNote: '白天：午睡1次（約1–1.5小時，部分幼兒開始拒絕午睡）｜夜間：10–12小時。建議：若孩子拒絕午睡，可改為30分鐘安靜休息時間，但夜間就寢時間不應晚於8:30。',
    nutrition: ['每天牛奶 2 杯（360 ml），優格或起司計入鈣質', '五穀雜糧為主食（糙米、全麥麵包）', '蔬果彩虹飲食（每天5種顏色蔬果）', '堅果碎 10–15g/天（加入粥/飯增加好脂肪，需剁碎避免窒息）', '鈣質 700mg/天、鐵質 7mg/天'],
    storyNote: '2–3歲的寶寶正在成為一個「小小人」。你可能會注意到他/她開始有真正的好朋友，開始問讓人頭疼的「為什麼」，開始在玩耍時創造出複雜的想象世界。情緒爆發還是會有，轉換困難還是會出現，但你可能也開始看到那個讓你融化的樣子——幫你遞東西、看到小狗說「好可愛」、主動抱著你說「我愛你」。同理心的種子正在萌芽，你每一次溫柔的回應都是在澆水。',
  },
  '3-4y': {
    height: '男 96–107 / 女 95–106 cm',
    weight: '男 14–18 / 女 13.5–17.5 kg',
    grossMotor: ['單腳跳（約3.5歲）', '騎三輪車靈活轉向', '接球（大球，2公尺距離）', '丟球有準頭', '跑步中急停、轉向'],
    fineMotor: ['用剪刀沿曲線剪', '畫人形（頭+身體+4肢）', '仿寫簡單字母/數字', '折紙（對折、三角）', '串小型珠子'],
    sleep: '10–13 小時/天',
    sleepNote: '白天：部分幼兒不再需要午睡，如需午睡控制在45分鐘內避免影響夜眠｜夜間：10–11小時（不應晚於9:00就寢）。建議：固定睡前30分鐘安靜活動（繪本、輕柔音樂）。',
    nutrition: ['每天牛奶 2 杯（360 ml）+ 起司 1 片（補充鈣質600mg/天）', '全蛋每天1顆', '魚肉每週至少2次（DHA促進腦發育）', '新鮮蔬果每天5份（減少果汁，吃整顆水果更好）', '避免含糖飲料和零食，鐵質需求 10mg/天'],
    storyNote: '3–4歲的孩子充滿了不可思議的創造力！你可能會發現他/她的問題越來越多、越來越奇怪，想像力旺盛到讓你目瞪口呆——積木可以是城堡，毛巾可以是翅膀，地板突然變成了熔岩。這個年齡也是恐懼的高峰期，害怕黑暗、害怕怪獸完全正常，因為孩子的大腦正在構建對世界的理解，想象力越豐富的孩子往往恐懼也越多——這是智能發展的好訊號。',
  },
  '4-5y': {
    height: '男 103–115 / 女 102–114 cm',
    weight: '男 16–21 / 女 15.5–20.5 kg',
    grossMotor: ['跳繩開始學習（協調動作）', '騎兩輪自行車（有輔助輪）', '單腳連續跳5次以上', '上下樓梯交替腳（無需扶欄）', '投球準確性提升'],
    fineMotor: ['用學習筷（輔助型）', '畫有細節的圖（房子/樹/人）', '仿寫自己的名字', '正確握筆（三指握）', '完成20片以上拼圖'],
    sleep: '10–13 小時/天',
    sleepNote: '白天：通常不需要午睡｜夜間：10–11小時（建議晚上8:30前就寢）。建議：電子螢幕在就寢前1小時完全關閉，藍光影響褪黑激素分泌。',
    nutrition: ['每天牛奶 2–3 杯（鈣質 600mg/天）', '蛋白質 35g/天：1顆雞蛋+2份肉類（各30g）', '魚類每週2次（富含 Omega-3）', '全穀類每天 4–5 份（糙米、燕麥、全麥）', '鐵質 10mg/天（豆類、深綠蔬菜、紅肉補充）'],
    storyNote: '4–5歲的孩子開始有越來越強烈的「社交意識」。你可能會發現他/她非常在意朋友怎麼看自己，輸了遊戲可能大哭，說謊的頻率也可能增加——不用過度擔心，這些都是社交認知發展的必經過程。這個年齡的孩子開始真正理解「規則」，喜歡有規則的遊戲，對「不公平」極度敏感。這是未來道德感、同理心的基礎。',
  },
  '5-6y': {
    height: '男 109–122 / 女 109–121 cm',
    weight: '男 18–23 / 女 17.5–23 kg',
    grossMotor: ['騎兩輪自行車（無輔助輪）', '跳繩連續跳10下以上', '倒退走/側走協調流暢', '接球準確（手套球，2.5公尺距離）', '單腳跳10次以上'],
    fineMotor: ['正確三指握筆書寫', '完成複雜拼圖（50–100片）', '打蝴蝶結', '使用剪刀剪複雜曲線', '演奏簡單樂器（鋼琴/小提琴啟蒙）'],
    sleep: '9–11 小時/天',
    sleepNote: '白天：不需要午睡｜夜間：9–11小時（不應晚於9:30就寢）。建議：學前入學準備期，建立固定就寢時間（晚上8:30）最重要，週末也不例外。',
    nutrition: ['鈣質 700mg/天：牛奶2杯+起司1–2片', '蛋白質 35g/天（1顆蛋+雞腿肉30g+魚肉30g）', '全穀類 4–5 份（白米:糙米=1:1 開始練習）', '新鮮蔬果5份/天（彩虹飲食原則）', '維生素 D 600 IU/天（補充或陽光曝曬20分鐘）'],
    storyNote: '5–6歲的孩子正在跨越一個重要的里程碑：學習閱讀和書寫。你可能會發現他/她突然對文字很感興趣，或者相反，對讀書很有挫折感——這兩種都有可能，個體差異非常大，不用和別人比較。這個年齡的孩子通常對「一切怎麼運作」充滿好奇：水為什麼往下流？月亮為什麼跟著我們走？這些問題是科學思維的起點，值得認真對待。',
  },
  '6-8y': {
    height: '男 115–132 / 女 114–131 cm',
    weight: '男 20–30 / 女 19–29 kg',
    grossMotor: ['游泳：換氣協調（蛙式/自由式入門）', '球類運動技巧提升（籃球運球/足球傳球）', '跳繩：雙人跳、花式跳', '體能爆發力明顯增強', '騎自行車熟練，開始嘗試山地車'],
    fineMotor: ['書寫速度加快，字體逐漸工整', '鋼琴/小提琴可演奏簡單曲目', '精細手工藝（摺紙複雜款式、簡單刺繡）', '使用尺、圓規等工具', '模型拼裝（50–200片）'],
    sleep: '9–11 小時/天',
    sleepNote: '白天：不需午睡｜夜間：9–11小時（建議不晚於9:00就寢）。注意：學齡兒童睡眠不足會直接影響記憶力、專注力和情緒調節，請嚴格保護睡眠時間。',
    nutrition: ['熱量需求 1400–1600 kcal/天', '鈣質 800mg/天（牛奶2–3杯或豆漿2杯+高鈣豆腐）', '蛋白質 40g/天：每天2顆雞蛋+魚或肉50g', '鐵質 10mg/天（豬肝/蛤蜊/深色蔬菜）', '早餐必吃：全麥吐司+蛋+牛奶，提升上午專注力'],
    storyNote: '6–8歲的孩子正式踏入學校的世界，也踏入了「同儕比較」的世界。你可能會發現孩子開始非常在意「別人怎麼看自己」，好朋友的重要性甚至超過了爸媽。這是完全正常的社會發展，意味著孩子的社交圈正在健康地擴展。學業壓力開始增加，但請記住：這個年齡最重要的學習，不是分數，而是「學習這件事是有趣的」這個信念。',
  },
  '8-10y': {
    height: '男 127–145 / 女 127–147 cm',
    weight: '男 26–40 / 女 25–41 kg',
    grossMotor: ['運動專項技能發展（田徑/游泳/球類）', '身體協調性接近成人', '女孩青春期前生長加速（約9–10歲）', '耐力顯著增強（長跑、持久運動）', '反應速度和敏捷性達到兒童高峰'],
    fineMotor: ['精密工藝（模型組裝、針線縫紉）', '樂器演奏中級（雙手協調）', '書寫自動化（不需思考字形）', '繪圖技巧進步（透視感、陰影）', '電腦打字速度明顯加快'],
    sleep: '9–11 小時/天',
    sleepNote: '白天：不需午睡｜夜間：9–11小時（建議9:30前入睡）。注意：課業壓力增加，需特別保障睡眠。建議固定作業時間，避免熬夜完成功課。',
    nutrition: ['鈣質 1000mg/天（青春期準備，牛奶3杯或豆漿+高鈣食物）', '蛋白質 40g/天，包括每天2顆蛋+魚/肉60g', '複合碳水化合物為主（燕麥、糙米、全麥）', '鐵質 10mg/天（女孩月經前準備，特別重要）', 'Omega-3：每週吃鮭魚/鯖魚/沙丁魚2次'],
    storyNote: '8–10歲的孩子通常在運動和技能方面有令人驚嘆的進步。你可能會發現他/她某一天突然「開竅」了——游泳不再喝水、腳踏車騎得很穩、樂器彈出了旋律。這個年齡的大腦整合能力正在快速提升。同時，女孩可能開始注意到身體的變化，部分孩子已進入青春期前期，溫和地提前溝通和準備，比措手不及更好。',
  },
  '10-12y': {
    height: '男 137–162 / 女 140–163 cm',
    weight: '男 31–53 / 女 33–56 kg',
    grossMotor: ['青春期前生長加速（女孩先、男孩後）', '男孩肌力開始顯著增強', '運動表現個體差異大（受青春期影響）', '精細運動控制達成人水平', '有氧運動能力持續增強'],
    fineMotor: ['複雜器械操作（縫紉機基礎、電動工具）', '藝術/手工精細度接近成人', '鍵盤打字流暢（可達20字/分鐘以上）', '樂器演奏進入高級階段', '精密模型（飛機/船艦等複雜套件）'],
    sleep: '9–11 小時/天',
    sleepNote: '白天：不需午睡（若有，限30分鐘）｜夜間：9–11小時（建議不晚於10:00就寢）。注意：青春期荷爾蒙會讓就寢時間自然延後，需積極管理。週末補眠不超過1小時。',
    nutrition: ['鈣質 1300mg/天（青春期骨骼快速發育，牛奶3杯+起司+高鈣豆腐）', '鐵質：女孩月經開始後需 15mg/天（補血食物：豬肝、蛤蜊、菠菜）', '蛋白質 45g/天（肌肉發育，每天3份蛋/肉/魚/豆類）', '避免節食或不吃早餐（影響生長激素分泌）', '維生素 D 600–1000 IU/天（骨密度最重要時期）'],
    storyNote: '10–12歲，青春期的門口。你可能會發現孩子開始尋求更多的私人空間，有時候會「不想說」，有時候對爸媽的意見很有主見（甚至抗議）。這不是叛逆，這是健康的個體化過程——孩子正在探索「我是誰」。最重要的事：保持溝通管道暢通，讓孩子知道你永遠在，不論他/她選擇分享什麼，你都不會評判。',
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
  great: string[]
  suggestions: string[]
  weekGoal: string
  cheer: string
}

// ── 黃瑽寧醫師「0-12歲育兒全百科」知識架構 ──

const SYMPTOM_GUIDE = [
  {
    id: 'fever',
    icon: '🌡️',
    title: '發燒',
    subtitle: '孩子最常見的求救訊號',
    story: '發燒本身不是壞事，而是寶貝免疫系統正在努力工作的證明！體溫升高會讓病毒和細菌更難存活。多數發燒可以在家觀察，重要的是觀察「整體狀況」，而不只是溫度數字。',
    doList: [
      '38°C 以上算發燒，體溫計量腋溫+0.5°C = 核心體溫',
      '優先補充水分，少穿衣服（別包太緊）讓身體散熱',
      '退燒藥的目的是讓孩子舒服，不是「讓體溫正常」',
      '觀察精神狀況：退燒後孩子有精神、願意玩，通常不需擔心',
    ],
    dontList: [
      '不要用酒精擦拭（酒精中毒風險）',
      '不要冰敷額頭（無效且讓孩子不舒服）',
      '不要強迫吃東西，食慾差是正常的',
    ],
    urgent: '出現這些情況立刻就醫：① 3個月以下任何發燒 ② 發燒超過5天 ③ 熱痙攣（抽筋）④ 出疹 ⑤ 頸部僵硬 ⑥ 嗜睡叫不醒',
    reference: '— 黃瑽寧醫師 CH5 發燒篇',
  },
  {
    id: 'cold',
    icon: '🤧',
    title: '感冒與流感',
    subtitle: '搞清楚差別，才知道怎麼處理',
    story: '普通感冒是「鼻病毒」等造成的，症狀漸進、以流鼻水/咳嗽為主，通常7-10天自癒。流感症狀來得又快又猛，高燒、全身痠痛、疲憊感強烈，需要抗病毒藥物（流感快篩陽性，48小時內給克流感）。',
    doList: [
      '多休息、多喝水是感冒最有效的「藥」',
      '流感高危族群（嬰幼兒、慢性病）24-48小時內就醫',
      '每年打流感疫苗：6個月以上建議接種',
      '洗手是最有效的傳染預防，肥皂洗20秒',
    ],
    dontList: [
      '感冒藥4大迷思：感冒藥「縮短病程」（無效）、抗生素殺病毒（無效，感冒是病毒）、不發燒代表好了（不一定）、止咳藥讓咳嗽快好（無科學根據）',
      '不要讓孩子帶病上學（傳染給同學）',
    ],
    urgent: '就醫時機：呼吸急促/呼吸困難、嘴唇發青、嗜睡叫不醒、超過5天沒改善',
    reference: '— 黃瑽寧醫師 CH5 流感篇',
  },
  {
    id: 'handfoot',
    icon: '🖐️',
    title: '腸病毒',
    subtitle: '台灣夏季家長的心頭大患',
    story: '腸病毒在台灣一年四季都有，但夏季是高峰。手足口病（手腳口有水泡、口腔潰瘍）是最常見的表現，多數5-7天自癒。但5歲以下，尤其是1-2歲嬰幼兒，要特別注意重症前兆！',
    doList: [
      '口腔潰瘍很痛：給冰涼食物（冰棒/布丁）緩解疼痛幫助進食',
      '補充水分是最重要的護理工作',
      '手足口病通常7天傳染期，退燒24小時才可上學',
      '用肥皂洗手是最有效的預防（腸病毒對酒精消毒液抵抗力強）',
    ],
    dontList: [
      '不要自行給類固醇（讓病毒更容易散播）',
      '水泡不要刺破',
    ],
    urgent: '🚨 重症前兆，立刻急診：持續高燒、嗜睡/意識改變、肌躍型抽搐（突然抖一下）、手腳無力、嘔吐劇烈',
    reference: '— 黃瑽寧醫師 CH5 腸病毒篇',
  },
  {
    id: 'allergy',
    icon: '🌿',
    title: '過敏：鼻炎、氣喘、異位性皮膚炎',
    subtitle: '了解過敏，和它好好相處',
    story: '過敏是免疫系統「太敏感」的反應，有家族遺傳傾向。台灣每3個孩子就有1個有過敏體質。過敏不是病，而是一種體質，目標是「控制」而非「根治」。早期引入多樣食物（6個月後）有助降低食物過敏風險。',
    doList: [
      '過敏性鼻炎：避開塵螨（床套防塵螨、減少絨毛玩具）、規律服藥',
      '氣喘：每天用藥（類固醇吸入劑）是最重要的，不用擔心少量類固醇',
      '異位性皮膚炎：保濕是第一步（每天全身塗保濕霜），避免過度清潔',
      '家中避免抽菸、地毯、寵物（強過敏原）',
    ],
    dontList: [
      '不要因為「類固醇」兩個字就拒絕使用（局部/短期安全有效）',
      '不要相信「斷根食療」「排毒飲食」等偏方',
    ],
    urgent: '急性氣喘發作（喘鳴、呼吸急促、說話困難）立刻就醫',
    reference: '— 黃瑽寧醫師 CH5 過敏三部曲',
  },
  {
    id: 'gut',
    icon: '🫃',
    title: '腸胃問題：吐奶、腹瀉、便秘',
    subtitle: '寶寶腸胃的常見煩惱',
    story: '嬰幼兒的腸胃系統正在成熟中，吐奶、腹瀉、便秘都是成長過程中非常常見的狀況，多數不需要藥物，調整飲食和生活方式就能改善。',
    doList: [
      '吐奶/溢奶（6個月前）：正常現象，餵奶後拍嗝、不要壓迫腹部',
      '急性腸胃炎：口服電解質液補充（不是白開水或運動飲料）',
      '腹瀉：繼續正常飲食（不需禁食），避免果汁和高糖飲料',
      '便秘：多喝水、多吃蔬果、增加活動量；嬰兒可以順時針按摩腹部',
    ],
    dontList: [
      '腹瀉不要用止瀉藥（阻止細菌/毒素排出）',
      '不要給嬰兒喝白開水（電解質失衡風險）',
    ],
    urgent: '就醫：血便、嚴重嘔吐超過8小時、腹瀉超過24小時無改善、明顯脫水（小便很少、哭無淚）',
    reference: '— 黃瑽寧醫師 CH5 腸胃篇',
  },
  {
    id: 'skin',
    icon: '🌸',
    title: '皮膚問題：熱疹、蕁麻疹、尿布疹',
    subtitle: '皮膚是孩子的第一道防線',
    story: '孩子的皮膚比大人薄，容易出現各種疹子，多數是暫時性的、不傳染的。看到疹子先別慌，觀察疹子的「形狀、分佈、有無其他症狀」有助判斷。',
    doList: [
      '熱疹（痱子）：散熱最重要 — 薄衣服、涼爽環境',
      '尿布疹：頻繁換尿布、換尿布時讓屁股「透氣」5-10分鐘，保護膏薄薄塗',
      '蕁麻疹（風疹塊）：找出過敏原，急性期可給抗組織胺',
      '異位性皮膚炎：早期使用保濕霜（不痛不癢也要每天塗）',
    ],
    dontList: [
      '不要用痱子粉（吸入有風險）',
      '皮膚問題不要自行買類固醇藥膏使用，需要醫師評估',
    ],
    urgent: '就醫：疹子快速擴散、伴隨發燒、嘴唇/眼睛腫脹（可能過敏性休克前兆）',
    reference: '— 黃瑽寧醫師 CH5 皮膚篇',
  },
]

const VACCINE_GUIDE = [
  {
    age: '出生',
    vaccines: ['B型肝炎（第1劑）', 'BCG 卡介苗'],
    note: '出生24小時內接種 B 肝，媽媽若帶原需加打免疫球蛋白',
  },
  {
    age: '1–2 個月',
    vaccines: ['B型肝炎（第2劑）'],
    note: '與第1劑間隔至少4週',
  },
  {
    age: '2 個月',
    vaccines: ['五合一疫苗（第1劑）', '肺炎鏈球菌（第1劑）', '輪狀病毒（自費，第1劑）'],
    note: '五合一：白喉+破傷風+百日咳+b型嗜血桿菌+小兒麻痺',
  },
  {
    age: '4 個月',
    vaccines: ['五合一疫苗（第2劑）', '肺炎鏈球菌（第2劑）', '輪狀病毒（自費，第2劑）'],
    note: '',
  },
  {
    age: '6 個月',
    vaccines: ['五合一疫苗（第3劑）', '肺炎鏈球菌（第3劑）', 'B型肝炎（第3劑）', '流感疫苗（每年）'],
    note: '流感疫苗：6個月以上建議每年接種，首次接種需打2劑（間隔4週）',
  },
  {
    age: '12 個月',
    vaccines: ['MMR 麻疹腮腺炎德國麻疹（第1劑）', '水痘（自費，第1劑）', '日本腦炎（第1劑）'],
    note: '水痘疫苗自費，2劑效果最好；MMR可能引起輕微發燒/皮疹（正常反應）',
  },
  {
    age: '15 個月',
    vaccines: ['肺炎鏈球菌（第4劑追加）'],
    note: '',
  },
  {
    age: '18 個月',
    vaccines: ['五合一疫苗（第4劑追加）', 'A型肝炎（自費，第1劑）'],
    note: '追加劑加強長期免疫力',
  },
  {
    age: '2 歲（24 個月）',
    vaccines: ['日本腦炎（第2劑）', 'A型肝炎（自費，第2劑）'],
    note: '',
  },
  {
    age: '5 歲（入學前）',
    vaccines: ['MMR（第2劑）', '水痘（自費，第2劑）', 'DTaP 追加', '小兒麻痺追加'],
    note: '入學前加強：確認疫苗是否齊全，可帶兒童健康手冊請醫師核對',
  },
]

const WHY_VACCINE = [
  { q: '為什麼要打疫苗？', a: '疫苗訓練免疫系統「記住」病原體，讓身體在真正感染前就做好準備。不打疫苗不代表孩子不會生病，而是少了一層保護。台灣能控制小兒麻痺、麻疹等疾病，全靠高接種率的群體免疫。' },
  { q: '疫苗的副作用嚴重嗎？', a: '多數副作用輕微暫時：注射部位紅腫（1-3天）、輕微發燒（1-2天）、煩躁。嚴重過敏反應（過敏性休克）極罕見（約每百萬劑1例），且發生在接種後15-30分鐘內，所以留在診所觀察30分鐘很重要。' },
  { q: '發燒時可以打疫苗嗎？', a: '38°C以上發燒需暫緩。輕微鼻水/咳嗽、發燒已退，可以正常接種。打疫苗後發燒（通常低燒）是免疫反應，不是生病，可給退燒藥讓孩子舒服。' },
]

const MOCK_AI_RESULTS: AIResult = {
  great: [
    '寶貝的大動作發展非常棒！雙腳跳躍動作清楚有力，完全符合這個年齡段的里程碑，太厲害了 🎉',
    '精細動作協調良好，拇指食指捏取準確，這表示小肌肉群發展得很健康，書寫前的準備已經打好基礎 ✨',
    '你持續記錄飲食和生長數據，這份用心對寶貝來說是最珍貴的禮物 💙',
  ],
  suggestions: [
    '蛋白質可以再補充一點點 — 每天多加一顆蒸蛋或一塊嫩豆腐就好，不用大改飲食，小小調整就有效果',
    '大腿肌力可以用有趣的方式練習 — 一起走樓梯、踩石頭過河遊戲、上下小斜坡，讓寶貝在玩耍中自然強壯',
    '鈣質補充很輕鬆 — 每天一杯奶加一片起司就能達標，可以做成寶貝喜歡的起司蛋餅或牛奶燕麥粥',
  ],
  weekGoal: '這週一起試試看：每天散步回家時，讓寶貝自己走樓梯上樓（至少2層），大腿肌肉在遊戲中自然強壯 🪜',
  cheer: '你記錄了這麼多珍貴的成長瞬間，每一筆紀錄都會成為寶貝長大後最寶貴的回憶。你真的很用心，繼續加油！💙',
}

export default function GrowthClient() {
  const [mainTab, setMainTab] = useState<MainTab>('knowledge')
  const [knowledgeTab, setKnowledgeTab] = useState<KnowledgeTab>('growth')
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
          <div>
            <h1 className="text-xl font-black">生長發展</h1>
            <p className="text-sm text-white opacity-80 mt-0.5">陪伴寶貝每一個成長瞬間</p>
          </div>
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
          {/* 子導覽 */}
          <div className="flex gap-1 px-5 py-3 overflow-x-auto border-b" style={{ borderColor: '#E8E0D5', background: 'white' }}>
            {[
              { key: 'growth', label: '成長發展', icon: TrendingUp },
              { key: 'symptoms', label: '常見病症', icon: Heart },
              { key: 'vaccine', label: '疫苗指南', icon: Shield },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setKnowledgeTab(key as KnowledgeTab)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
                style={{ background: knowledgeTab === key ? '#7B9EBD' : 'white', color: knowledgeTab === key ? 'white' : '#6B7B8D', borderColor: knowledgeTab === key ? '#7B9EBD' : '#E8E0D5' }}
              >
                <Icon size={12} />{label}
              </button>
            ))}
          </div>

          {/* 成長發展 */}
          {knowledgeTab === 'growth' && (
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
            {/* 寶貝的成長故事 */}
            <section className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #EBF4FF, #F0F8FF)', border: '1px solid #C5D8E8' }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: 18 }}>✨</span>
                <p className="text-xs font-bold" style={{ color: '#5E85A3' }}>這個階段的寶貝正在經歷...</p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{ageData.storyNote}</p>
            </section>

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
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>這個月可以期待的大動作 🏃</h2>
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
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>小手指的神奇發展 ✋</h2>
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
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>寶貝的睡眠時光 🌙</h2>
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

            {/* 營養需求重點 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Utensils size={16} style={{ color: '#7B9EBD' }} />
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>吃得好，長得棒 🥦</h2>
                <span className="evidence-badge">Cochrane 實證</span>
              </div>
              <div className="space-y-2">
                {ageData.nutrition.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                    <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: '#FDF0E8', color: '#B07548' }}>
                      {i + 1}
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: '#8E9EAD' }}>* 依據 Cochrane Review: 早期嬰兒營養、台灣衛福部每日飲食指南</p>
            </section>

            {/* 來源說明 */}
            <div className="flex items-start gap-2 p-4 rounded-2xl border" style={{ background: '#EBF4FF', borderColor: '#C5D8E8' }}>
              <Info size={16} className="shrink-0 mt-0.5" style={{ color: '#5E85A3' }} />
              <p className="text-xs leading-relaxed" style={{ color: '#5E85A3' }}>
                每個寶貝都有自己獨特的成長節奏，以上數據來自 WHO 兒童生長標準（2006）及 Cochrane 系統性回顧，是「參考範圍」而非「標準答案」。如果有任何疑問，主治醫師和兒科醫生是最好的夥伴。
              </p>
            </div>
          </div>
          </div>
          )} {/* end knowledgeTab === 'growth' */}

          {/* === 常見病症 Tab === */}
          {knowledgeTab === 'symptoms' && (
            <div className="px-5 py-5 space-y-4">
              <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #EBF4FF, #F0F8FF)', border: '1px solid #C5D8E8' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={16} style={{ color: '#5E85A3' }} />
                  <p className="font-bold text-sm" style={{ color: '#5E85A3' }}>黃瑽寧醫師 CH5 知識精華</p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#6B7B8D' }}>
                  遇到孩子生病，家長最需要的是「判斷力」，而不是焦慮。了解常見症狀的處理原則，讓你在孩子生病時更有信心陪伴他度過。
                </p>
              </div>
              {SYMPTOM_GUIDE.map(s => (
                <div key={s.id} className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                  <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#F5F8FF' }}>
                    <span style={{ fontSize: 24 }}>{s.icon}</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#2D3436' }}>{s.title}</p>
                      <p className="text-xs" style={{ color: '#6B7B8D' }}>{s.subtitle}</p>
                    </div>
                  </div>
                  <div className="px-4 py-4 space-y-3">
                    <p className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{s.story}</p>
                    <div className="p-3 rounded-xl" style={{ background: '#EBF8EB' }}>
                      <p className="text-xs font-bold mb-2" style={{ color: '#3A7A3A' }}>✅ 正確做法</p>
                      <div className="space-y-1.5">
                        {s.doList.map((d, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 size={12} className="shrink-0 mt-0.5" style={{ color: '#5A8A5A' }} />
                            <p className="text-xs" style={{ color: '#2D3436' }}>{d}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: '#FFF8EC' }}>
                      <p className="text-xs font-bold mb-2" style={{ color: '#8A6020' }}>💭 比較好避免的</p>
                      <div className="space-y-1.5">
                        {s.dontList.map((d, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <ChevronRight size={12} className="shrink-0 mt-0.5" style={{ color: '#B07548' }} />
                            <p className="text-xs" style={{ color: '#2D3436' }}>{d}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: '#EBF4FF' }}>
                      <p className="text-xs font-bold mb-1" style={{ color: '#5E85A3' }}>🔔 何時需要就醫</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#2D3436' }}>{s.urgent}</p>
                    </div>
                    <p className="text-xs text-right" style={{ color: '#8E9EAD' }}>{s.reference}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === 疫苗指南 Tab === */}
          {knowledgeTab === 'vaccine' && (
            <div className="px-5 py-5 space-y-4">
              <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #EBF4FF, #F0F8FF)', border: '1px solid #C5D8E8' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} style={{ color: '#5E85A3' }} />
                  <p className="font-bold text-sm" style={{ color: '#5E85A3' }}>黃瑽寧醫師 CH4 疫苗知識</p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#6B7B8D' }}>
                  疫苗是給孩子最重要的禮物之一。了解「為什麼要打」「有什麼副作用」「什麼時候打」，讓你對疫苗更有信心。
                </p>
              </div>
              {/* 為什麼要打疫苗 Q&A */}
              <div className="space-y-3">
                {WHY_VACCINE.map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                    <p className="font-bold text-sm mb-2" style={{ color: '#5E85A3' }}>Q：{item.q}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{item.a}</p>
                  </div>
                ))}
              </div>
              {/* 疫苗時程 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={16} style={{ color: '#7B9EBD' }} />
                  <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>台灣公費 + 自費疫苗時程</h2>
                </div>
                <div className="space-y-2">
                  {VACCINE_GUIDE.map((v, i) => (
                    <div key={i} className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-black px-2 py-1 rounded-xl" style={{ background: '#EBF4FF', color: '#5E85A3' }}>{v.age}</span>
                      </div>
                      <div className="space-y-1">
                        {v.vaccines.map((vac, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <div className="shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: '#7B9EBD' }} />
                            <p className="text-sm" style={{ color: '#2D3436' }}>{vac}</p>
                          </div>
                        ))}
                      </div>
                      {v.note && <p className="text-xs mt-2" style={{ color: '#6B7B8D' }}>{v.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-2 p-4 rounded-2xl border" style={{ background: '#EBF4FF', borderColor: '#C5D8E8' }}>
                <Info size={16} className="shrink-0 mt-0.5" style={{ color: '#5E85A3' }} />
                <p className="text-xs leading-relaxed" style={{ color: '#5E85A3' }}>
                  以上為台灣常規疫苗時程，詳細接種計畫請以兒童健康手冊為準，並諮詢您的兒科醫師。
                </p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* === 家長紀錄 Tab === */}
      {mainTab === 'records' && (
        <div className="px-5 py-5 space-y-5">
          {/* 成長亮點卡片 */}
          <section>
            <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #A8C5DA, #7B9EBD)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize: 20 }}>🌟</span>
                <h2 className="font-black text-white text-base">寶貝的成長亮點</h2>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <p className="text-white font-black text-lg">+2cm</p>
                  <p className="text-white text-xs opacity-80">過去3個月</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <p className="text-white font-black text-lg">7天</p>
                  <p className="text-white text-xs opacity-80">連續記錄</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <p className="text-white font-black text-lg">+0.5kg</p>
                  <p className="text-white text-xs opacity-80">健康增重</p>
                </div>
              </div>
              <p className="text-white text-xs opacity-90 text-center">每一次記錄都是給寶貝最好的禮物 💙</p>
            </div>
          </section>

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
                上傳照片/影片和飲食記錄，成長秘書會給寶貝一份專屬的「成長亮點報告」，讓你看見孩子的每一個進步
              </p>
              <button
                onClick={() => setShowAI(true)}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}
              >
                <Sparkles size={16} />讓成長秘書來看看
              </button>
            </div>
          </section>

          {/* AI 分析結果 */}
          {showAI && (
            <section className="space-y-3">
              <h2 className="font-bold" style={{ color: '#2D3436' }}>AI 成長秘書分析報告</h2>

              {/* 做得很好 */}
              <div className="p-4 rounded-2xl border" style={{ background: '#EBF8EB', borderColor: '#A8D8A8' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 18 }}>🌟</span>
                  <p className="font-bold text-sm" style={{ color: '#3A7A3A' }}>寶貝做得很棒的地方</p>
                </div>
                <div className="space-y-2">
                  {MOCK_AI_RESULTS.great.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: '#5A8A5A' }} />
                      <p className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 可以一起努力 */}
              <div className="p-4 rounded-2xl border" style={{ background: '#FFF8EC', borderColor: '#F5D8A0' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 18 }}>💡</span>
                  <p className="font-bold text-sm" style={{ color: '#8A6020' }}>可以一起努力的方向</p>
                </div>
                <div className="space-y-2">
                  {MOCK_AI_RESULTS.suggestions.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight size={14} className="shrink-0 mt-0.5" style={{ color: '#B07548' }} />
                      <p className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 這週小目標 */}
              <div className="p-4 rounded-2xl border" style={{ background: '#EBF4FF', borderColor: '#C5D8E8' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: 18 }}>🎯</span>
                  <p className="font-bold text-sm" style={{ color: '#5E85A3' }}>這週的小目標</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#2D3436' }}>{MOCK_AI_RESULTS.weekGoal}</p>
              </div>

              {/* 加油打氣 */}
              <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: 18 }}>💪</span>
                  <p className="font-bold text-sm text-white">給你的加油打氣</p>
                </div>
                <p className="text-sm leading-relaxed text-white opacity-95">{MOCK_AI_RESULTS.cheer}</p>
              </div>

              <p className="text-xs text-center" style={{ color: '#8E9EAD' }}>* 此為模擬分析結果，實際功能即將上線</p>
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
