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
  nutrition: string[]
}> = {
  '0-3m': {
    height: '男 50–62 / 女 49–61 cm',
    weight: '男 3.3–7.0 / 女 3.2–6.5 kg',
    grossMotor: ['俯臥時抬頭（0–4週）', '俯臥時頭可撐起45度（約6週）', '俯臥時頭部可穩定抬高90度（約3月）', '手腳對稱性動作（踢腳/揮手）', '對聲音有驚嚇反應（Moro反射）'],
    fineMotor: ['反射性握拳（出生至2月）', '雙手可主動打開（約2月）', '追視水平移動物體（1–2月）', '注視人臉20–30秒（出生即有）', '手放入口探索（2–3月）'],
    sleep: '14–17 小時/天',
    sleepNote: '白天：多次小睡（每次45–120分鐘，共4–5次）｜夜間：每2–4小時需餵奶，連續睡眠不超過4小時。建議：讓嬰兒學習區分日夜，白天多互動，夜間保持昏暗安靜。',
    nutrition: ['純母乳或配方奶，按需哺乳 8–12 次/天', '配方奶：每次 60–120 ml（隨月齡遞增）', '母乳/配方奶是唯一所需食物，禁止添加副食品', '每天補充維生素 D 400 IU（純母乳嬰兒必須補充）', '注意：不要給嬰兒飲水，以免低血鈉'],
  },
  '4-6m': {
    height: '男 62–68 / 女 61–67 cm',
    weight: '男 6.0–8.5 / 女 5.5–8.0 kg',
    grossMotor: ['翻身（腹→背，約4月）', '翻身（背→腹，約5–6月）', '雙手撐胸俯臥（約4–5月）', '扶坐時頭部穩定（約4月）', '拉坐時頭部不後仰（約5月）'],
    fineMotor: ['伸手主動抓取物品（約4月）', '雙手換物（約5–6月）', '把玩具放入口中探索', '搖晃玩具製造聲音', '雙手同時抓住兩樣東西（約6月）'],
    sleep: '12–15 小時/天',
    sleepNote: '白天：午睡 3 次（上午、中午、下午，各 45–90 分鐘）｜夜間：可連續睡 5–6 小時。建議：4 月起可嘗試建立固定睡前儀式（洗澡→按摩→餵奶→放下）。',
    nutrition: ['母乳或配方奶仍為主食（每天 600–800 ml）', '4–6月可開始嘗試副食品（WHO建議6月後，個體差異大）', '副食品入門：鐵強化嬰兒米糊（1茶匙開始）', '單一食材試7天，無過敏反應再換新食材', '維生素 D 繼續每天補充 400 IU'],
  },
  '7-9m': {
    height: '男 68–74 / 女 66–72 cm',
    weight: '男 8.0–10.0 / 女 7.3–9.4 kg',
    grossMotor: ['獨立坐穩（約6–8月，不需支撐）', '腹部貼地爬行（約7–8月）', '四肢交替爬行（約8–10月）', '扶站（約8–10月）', '站立時可撐住自身重量數秒'],
    fineMotor: ['拇指+其他四指捏（耙型抓）', '拇指側面+食指捏（約8月）', '敲打兩個積木', '刻意丟棄物品（反覆練習）', '開始理解「給我」和「謝謝」手勢'],
    sleep: '12–15 小時/天',
    sleepNote: '白天：午睡 2 次（上午9–10點、下午1–2點，各60–90分鐘）｜夜間：10–11 小時。建議：此期分離焦慮開始，固定照顧者執行睡眠儀式非常重要。',
    nutrition: ['每天副食品 1–2 餐，母乳/配方奶仍每天 600 ml', '蛋白質來源：雞肝泥、魚泥、豆腐（每天30–40g）', '蔬菜泥：南瓜、地瓜、紅蘿蔔（每天2–3湯匙）', '可引入全蛋蛋黃（過敏風險已降低，早引入反降低風險）', '開始嘗試手指食物：香蕉片、地瓜條（訓練自主進食）'],
  },
  '10-12m': {
    height: '男 73–78 / 女 71–76 cm',
    weight: '男 9.0–11.0 / 女 8.5–10.5 kg',
    grossMotor: ['扶走（巡走，沿著家具行走）', '蹲下撿物後站起', '可獨立站立3–5秒', '可能開始獨立行走（10–15月）', '爬上矮沙發/台階'],
    fineMotor: ['拇指+食指精細捏取（鑷型抓）', '疊積木2塊', '模仿塗鴉動作（隨意筆跡）', '把小物品放入容器', '翻書頁（厚板書）'],
    sleep: '11–14 小時/天',
    sleepNote: '白天：午睡 1–2 次（逐漸整合為1次，共約1.5–2小時）｜夜間：穩定10–12小時。建議：10月前後可嘗試睡眠訓練（漸進式方式），建立固定睡覺時間。',
    nutrition: ['每天3餐副食品+2次點心，奶量 400–600 ml', '可引入全蛋（蒸蛋、炒蛋）', '軟固體食物：碎肉（每天30–40g）、豆腐、蒸魚', '避免：蜂蜜（1歲前）、整顆堅果（窒息風險）、含糖飲料', '鈣質需求 260mg/天（母乳/配方奶可提供大部分）'],
  },
  '1-2y': {
    height: '男 75–92 / 女 74–90 cm',
    weight: '男 9.5–13.5 / 女 9.0–13.0 kg',
    grossMotor: ['獨立行走（12–15月）', '跑步但常跌倒（約18月）', '上下樓梯（扶欄，雙腳踩同一台階）', '蹲下再站起（靈活）', '踢固定的球（約18月）'],
    fineMotor: ['疊積木3–6塊', '自己翻書頁（紙書）', '用湯匙舀食（灑漏多）', '仿畫垂直線（約18月）', '把圓形插入形狀板'],
    sleep: '11–14 小時/天',
    sleepNote: '白天：午睡 1 次（約1–2小時，通常午飯後）｜夜間：10–12小時。建議：作息規律最重要，就寢時間固定在晚上7:30–8:30。',
    nutrition: ['全脂牛奶 360–480 ml/天（不超過600ml，避免影響食慾）', '每天1–2顆全蛋（蒸蛋/炒蛋/水煮蛋）', '肉類 30–50g/天（雞肉、魚肉、豬肉輪替）', '蔬菜 1/2 杯+水果 1/2 杯/天', '避免高糖、高鹽、加工食品。鈣質需求 700mg/天。'],
  },
  '2-3y': {
    height: '男 87–101 / 女 85–100 cm',
    weight: '男 12–16 / 女 11.5–15.5 kg',
    grossMotor: ['雙腳跳躍（離地）', '單腳站立2–3秒（約30月）', '踢球、奔跑中轉向', '騎三輪車（腳踩踏板）', '走平衡木（寬15cm）'],
    fineMotor: ['疊積木6–8塊', '畫垂直線、水平線、圓形', '剪紙（直線）', '串大型珠子', '打開/關上簡單容器'],
    sleep: '10–13 小時/天',
    sleepNote: '白天：午睡1次（約1–1.5小時，部分幼兒開始拒絕午睡）｜夜間：10–12小時。建議：若孩子拒絕午睡，可改為30分鐘安靜休息時間，但夜間就寢時間不應晚於8:30。',
    nutrition: ['每天牛奶 2 杯（360 ml），優格或起司計入鈣質', '五穀雜糧為主食（糙米、全麥麵包）', '蔬果彩虹飲食（每天5種顏色蔬果）', '堅果碎 10–15g/天（加入粥/飯增加好脂肪，需剁碎避免窒息）', '鈣質 700mg/天、鐵質 7mg/天'],
  },
  '3-4y': {
    height: '男 96–107 / 女 95–106 cm',
    weight: '男 14–18 / 女 13.5–17.5 kg',
    grossMotor: ['單腳跳（約3.5歲）', '騎三輪車靈活轉向', '接球（大球，2公尺距離）', '丟球有準頭', '跑步中急停、轉向'],
    fineMotor: ['用剪刀沿曲線剪', '畫人形（頭+身體+4肢）', '仿寫簡單字母/數字', '折紙（對折、三角）', '串小型珠子'],
    sleep: '10–13 小時/天',
    sleepNote: '白天：部分幼兒不再需要午睡，如需午睡控制在45分鐘內避免影響夜眠｜夜間：10–11小時（不應晚於9:00就寢）。建議：固定睡前30分鐘安靜活動（繪本、輕柔音樂）。',
    nutrition: ['每天牛奶 2 杯（360 ml）+ 起司 1 片（補充鈣質600mg/天）', '全蛋每天1顆', '魚肉每週至少2次（DHA促進腦發育）', '新鮮蔬果每天5份（減少果汁，吃整顆水果更好）', '避免含糖飲料和零食，鐵質需求 10mg/天'],
  },
  '4-5y': {
    height: '男 103–115 / 女 102–114 cm',
    weight: '男 16–21 / 女 15.5–20.5 kg',
    grossMotor: ['跳繩開始學習（協調動作）', '騎兩輪自行車（有輔助輪）', '單腳連續跳5次以上', '上下樓梯交替腳（無需扶欄）', '投球準確性提升'],
    fineMotor: ['用學習筷（輔助型）', '畫有細節的圖（房子/樹/人）', '仿寫自己的名字', '正確握筆（三指握）', '完成20片以上拼圖'],
    sleep: '10–13 小時/天',
    sleepNote: '白天：通常不需要午睡｜夜間：10–11小時（建議晚上8:30前就寢）。建議：電子螢幕在就寢前1小時完全關閉，藍光影響褪黑激素分泌。',
    nutrition: ['每天牛奶 2–3 杯（鈣質 600mg/天）', '蛋白質 35g/天：1顆雞蛋+2份肉類（各30g）', '魚類每週2次（富含 Omega-3）', '全穀類每天 4–5 份（糙米、燕麥、全麥）', '鐵質 10mg/天（豆類、深綠蔬菜、紅肉補充）'],
  },
  '5-6y': {
    height: '男 109–122 / 女 109–121 cm',
    weight: '男 18–23 / 女 17.5–23 kg',
    grossMotor: ['騎兩輪自行車（無輔助輪）', '跳繩連續跳10下以上', '倒退走/側走協調流暢', '接球準確（手套球，2.5公尺距離）', '單腳跳10次以上'],
    fineMotor: ['正確三指握筆書寫', '完成複雜拼圖（50–100片）', '打蝴蝶結', '使用剪刀剪複雜曲線', '演奏簡單樂器（鋼琴/小提琴啟蒙）'],
    sleep: '9–11 小時/天',
    sleepNote: '白天：不需要午睡｜夜間：9–11小時（不應晚於9:30就寢）。建議：學前入學準備期，建立固定就寢時間（晚上8:30）最重要，週末也不例外。',
    nutrition: ['鈣質 700mg/天：牛奶2杯+起司1–2片', '蛋白質 35g/天（1顆蛋+雞腿肉30g+魚肉30g）', '全穀類 4–5 份（白米:糙米=1:1 開始練習）', '新鮮蔬果5份/天（彩虹飲食原則）', '維生素 D 600 IU/天（補充或陽光曝曬20分鐘）'],
  },
  '6-8y': {
    height: '男 115–132 / 女 114–131 cm',
    weight: '男 20–30 / 女 19–29 kg',
    grossMotor: ['游泳：換氣協調（蛙式/自由式入門）', '球類運動技巧提升（籃球運球/足球傳球）', '跳繩：雙人跳、花式跳', '體能爆發力明顯增強', '騎自行車熟練，開始嘗試山地車'],
    fineMotor: ['書寫速度加快，字體逐漸工整', '鋼琴/小提琴可演奏簡單曲目', '精細手工藝（摺紙複雜款式、簡單刺繡）', '使用尺、圓規等工具', '模型拼裝（50–200片）'],
    sleep: '9–11 小時/天',
    sleepNote: '白天：不需午睡｜夜間：9–11小時（建議不晚於9:00就寢）。注意：學齡兒童睡眠不足會直接影響記憶力、專注力和情緒調節，請嚴格保護睡眠時間。',
    nutrition: ['熱量需求 1400–1600 kcal/天', '鈣質 800mg/天（牛奶2–3杯或豆漿2杯+高鈣豆腐）', '蛋白質 40g/天：每天2顆雞蛋+魚或肉50g', '鐵質 10mg/天（豬肝/蛤蜊/深色蔬菜）', '早餐必吃：全麥吐司+蛋+牛奶，提升上午專注力'],
  },
  '8-10y': {
    height: '男 127–145 / 女 127–147 cm',
    weight: '男 26–40 / 女 25–41 kg',
    grossMotor: ['運動專項技能發展（田徑/游泳/球類）', '身體協調性接近成人', '女孩青春期前生長加速（約9–10歲）', '耐力顯著增強（長跑、持久運動）', '反應速度和敏捷性達到兒童高峰'],
    fineMotor: ['精密工藝（模型組裝、針線縫紉）', '樂器演奏中級（雙手協調）', '書寫自動化（不需思考字形）', '繪圖技巧進步（透視感、陰影）', '電腦打字速度明顯加快'],
    sleep: '9–11 小時/天',
    sleepNote: '白天：不需午睡｜夜間：9–11小時（建議9:30前入睡）。注意：課業壓力增加，需特別保障睡眠。建議固定作業時間，避免熬夜完成功課。',
    nutrition: ['鈣質 1000mg/天（青春期準備，牛奶3杯或豆漿+高鈣食物）', '蛋白質 40g/天，包括每天2顆蛋+魚/肉60g', '複合碳水化合物為主（燕麥、糙米、全麥）', '鐵質 10mg/天（女孩月經前準備，特別重要）', 'Omega-3：每週吃鮭魚/鯖魚/沙丁魚2次'],
  },
  '10-12y': {
    height: '男 137–162 / 女 140–163 cm',
    weight: '男 31–53 / 女 33–56 kg',
    grossMotor: ['青春期前生長加速（女孩先、男孩後）', '男孩肌力開始顯著增強', '運動表現個體差異大（受青春期影響）', '精細運動控制達成人水平', '有氧運動能力持續增強'],
    fineMotor: ['複雜器械操作（縫紉機基礎、電動工具）', '藝術/手工精細度接近成人', '鍵盤打字流暢（可達20字/分鐘以上）', '樂器演奏進入高級階段', '精密模型（飛機/船艦等複雜套件）'],
    sleep: '9–11 小時/天',
    sleepNote: '白天：不需午睡（若有，限30分鐘）｜夜間：9–11小時（建議不晚於10:00就寢）。注意：青春期荷爾蒙會讓就寢時間自然延後，需積極管理。週末補眠不超過1小時。',
    nutrition: ['鈣質 1300mg/天（青春期骨骼快速發育，牛奶3杯+起司+高鈣豆腐）', '鐵質：女孩月經開始後需 15mg/天（補血食物：豬肝、蛤蜊、菠菜）', '蛋白質 45g/天（肌肉發育，每天3份蛋/肉/魚/豆類）', '避免節食或不吃早餐（影響生長激素分泌）', '維生素 D 600–1000 IU/天（骨密度最重要時期）'],
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
    title: '大腿肌力偏弱，膝蓋內旋',
    detail: '從影片觀察，孩子蹲起動作時膝蓋內旋（膝蓋往內倒），大腿股四頭肌和臀中肌力量尚不足，長期可能影響膝關節健康。',
    suggestion: '每天練習：①側躺抬腿10次×2組（訓練臀中肌）；②低矮台階上下踏步，每次10分鐘，持續2–3週。外出時鼓勵走路上下樓梯，避免長時間被抱。',
  },
  {
    type: 'warning',
    title: '蛋白質攝取不足（估計達標率70%）',
    detail: '依據本週餐盤紀錄，白飯/麵條比例偏高（約佔盤面60%），豆蛋肉類攝取量估計低於建議量30%。蛋白質不足影響肌肉發育和免疫力。',
    suggestion: '具體食物建議：每天2顆雞蛋（早餐1顆蒸蛋、晚餐1顆炒蛋）；每天一杯240ml全脂鮮奶（可加入燕麥一起煮燕麥牛奶粥）；30g核桃碎/腰果碎（剁碎後拌入粥飯，增加好脂肪）；每週至少2次魚肉（蒸鱸魚/鯖魚，20–30分鐘即可完成）。',
  },
  {
    type: 'warning',
    title: '鈣質攝取可能不足',
    detail: '本週紀錄中牛奶/乳製品出現僅2次，此年齡段每天需鈣質700mg，約需2杯牛奶+1片起司才能達標。骨骼密度在兒童期建立，短缺難以補救。',
    suggestion: '每天固定：①早餐240ml鮮奶或豆漿（高鈣豆漿優先）；②午餐一份豆腐（嫩豆腐100g含鈣150mg）；③點心1片起司或優格80g。可準備「起司蛋餅」「豆腐味噌湯」讓孩子喜歡乳製品。',
  },
  {
    type: 'ok',
    title: '精細動作發展正常',
    detail: '孩子拇指食指捏取動作協調（觀察抓葡萄、撿小積木的影片），符合此年齡段標準。書寫前準備動作良好。',
    suggestion: '可提供更多挑戰：珠子穿線（先大後小）、捏黏土搓長條/壓扁、剪紙（直線→曲線）。每天15–20分鐘精細活動，為日後書寫做準備。',
  },
  {
    type: 'ok',
    title: '大動作發展符合標準',
    detail: '孩子跑步步態協調，雙腳跳躍時離地清楚，符合此年齡段「2–3歲雙腳跳」發展里程碑。',
    suggestion: '繼續提供多元運動機會：公園攀爬架（平衡感）、玩球（追球/踢球）、音樂律動（身體協調）。戶外活動每天至少60分鐘。',
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

            {/* 營養需求重點 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Utensils size={16} style={{ color: '#7B9EBD' }} />
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>營養需求重點</h2>
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
                本頁資料來源：WHO Child Growth Standards（2006）、Cochrane 系統性回顧、美國國家睡眠基金會（NSF）、台灣衛福部國民健康署每日飲食指南。建議僅供參考，個別差異因人而異，請諮詢專業醫師/營養師。
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
