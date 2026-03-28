'use client'

import { useState } from 'react'
import {
  TrendingUp, BookOpen, ClipboardList, Ruler, Weight, Moon, Info,
  Sparkles, CheckCircle2, ChevronRight, AlertTriangle,
  Plus, X, Utensils, ChevronDown, Shield, Heart,
} from 'lucide-react'
import SmartPhotoAnalyzer from '@/components/SmartPhotoAnalyzer'
import { ChildSwitcher, useActiveChildId } from '@/components/ChildSwitcher'

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

const HUANG_TOPICS = [
  {
    id: 'nutrition-feeding',
    emoji: '🍼',
    title: '營養餵食',
    bgColor: '#FDF0E8',
    borderColor: '#E8C4A0',
    headerColor: '#B07548',
    sections: [
      {
        title: '親餵 vs 瓶餵，哪個好？',
        content: '你選擇親餵還是瓶餵，兩種都很好！最重要的是找到適合你和寶寶的方式。\n\n親餵的好處：母乳含有量身訂製的免疫因子（IgA、白血球），成分隨月齡自動調整，親餵也幫助子宮恢復。\n\n瓶餵的好處：爸爸和家人都能參與育兒、媽媽的睡眠更彈性、配方奶品質也已相當高。\n\n💡 小提醒：奶嘴有助於預防猝死（SIDS），3-6月寶寶超過5kg就可嘗試睡過夜囉！',
      },
      {
        title: '副食品：什麼時候開始？',
        content: '每個寶寶都有自己的步調，準備好了自然會告訴你！\n\n準備信號（通常4-6月出現）：\n• 能坐穩、頭部可控制\n• 看到大人吃飯會感興趣、流口水\n• 體重達出生2倍（約6kg以上）\n\nWHO建議純母乳至6月，但個體差異大，出現準備信號就可以開始。\n\n🌟 起步方式：從鐵強化米精開始（1茶匙），每種新食材試7天，確認沒有過敏反應再換下一種。',
      },
      {
        title: '偏挑食，不用太緊張',
        content: '孩子對新食物謹慎是正常的保護本能，不是故意挑剔！研究顯示需要15-20次嘗試，孩子才可能接受新食物。\n\n你可以試試：\n① 全家一起吃相同食物（身教是最好的示範）\n② 讓孩子參與備餐（洗菜、攪拌、擺盤）\n③ 小份量多次嘗試，不強迫進食\n④ 持續提供，不放棄\n\n💡 有實證的免疫輔助品：益生菌、多醣體（β-glucan）、維生素D',
      },
      {
        title: '袋鼠育兒法 🦘',
        content: '袋鼠育兒法結合肌膚接觸（Skin-to-skin）和安撫，對寶寶和家長都有好處！\n\n三個重點：\n① 照顧者與寶寶肌膚接觸——媽媽、爸爸或其他人都可以\n② 不一定要定點不動，可以到處走動，也可以使用揹巾\n③ 每次至少1小時，一天多次都沒關係\n\n💛 好處包括：調節寶寶體溫和心跳、增進親密感、促進母乳分泌。',
      },
      {
        title: '5S 安撫法',
        content: '寶寶哭的時候，先依序排除原因（換尿布→溫度→拍嗝→抱起→親餵），再進行5S安撫。\n\n5S模仿子宮環境，讓寶寶感到熟悉安全：\n\n🌀 Swaddle 包包巾\n🤱 Side/Stomach Position 側抱或趴抱\n🔄 Swing/Sway 搖擺\n🤫 Shush 噓聲\n👄 Suck 吸吮（奶嘴或手指）\n\n組合一起用效果更好！',
      },
      {
        title: '解碼寶寶哭聲',
        content: '寶寶在告訴你他的需要，這8個信號可以幫你讀懂：\n\n1. 轉頭蠕動、啄木鳥動作 → 餓了\n2. 拱背、腳蹬起來 → 需要拍嗝排氣\n3. 一放下就哭、抱起就停 → 需要安全感\n4. 尖叫大哭、滿臉脹紅 → 身體不舒服（可能腸絞痛）\n5. 閉眼哭、哭聲頻率一致 → 想睡了\n6. 喝奶到一半大哭 → 需要拍嗝或便秘\n7. 嘴邊輕點會轉動找奶 → 尋乳反射，不代表餓\n8. 奶瓶塞嘴就吸 → 吸吮反射，不代表餓',
      },
    ],
  },
  {
    id: 'solidFood',
    title: '副食品時機與方法',
    emoji: '🥣',
    content: `什麼時候開始？WHO建議6個月後，但觀察寶貝的發展信號更重要：能坐穩（不倒）、對食物有興趣、舌頭推出反射消失。大多數寶貝在4–6個月之間準備好。\n\n怎麼開始？\n• 從單一食材開始（鐵強化米糊、南瓜泥、地瓜泥）\n• 每次只加一種新食材，觀察3–7天\n• 份量：1茶匙開始，慢慢增加\n• 質地：稀泥狀→厚泥→軟塊→手指食物\n\n早點引入過敏原反而更好！最新研究顯示，花生、蛋、魚等在6個月左右早點引入，反而降低過敏風險。`,
  },
  {
    id: 'pickyEater',
    title: '偏挑食怎麼辦',
    emoji: '🥕',
    content: `偏挑食是2–6歲孩子最普遍的問題，90%以上的孩子都會有某種程度的偏食，你不孤單！\n\n為什麼孩子挑食？新食物恐懼症（Neophobia）是演化保護機制，2歲後大腦本能上對不熟悉的食物有防衛心。\n\n有效的方法：\n• 一種新食物需要嘗試8–15次才會接受，別在前5次就放棄\n• 不強迫吃完，但要求「嘗一小口」\n• 讓孩子參與備餐（洗菜、攪拌），增加接受度\n• 家人一起吃，示範比說教有效10倍\n\n不用擔心的情況：孩子活力好、體重在正常範圍、喜歡的食物還有10種以上，這就沒問題。\n\n小提醒：接受食物不到20種、質地敏感、完全拒絕某類食物，可以諮詢職能治療師。`,
  },
  {
    id: 'growthNutrition',
    title: '成長營養5大提醒',
    emoji: '🌱',
    content: `5個營養觀念校正：\n\n① 不需要急著補充各種營養品\n天然食物提供的營養已經足夠。各種「成長補充品」廣告常誇大效果，先吃好日常飲食最重要。\n\n② 天然的最好\n加工食品中的化學添加物要盡量避免。新鮮食材、少加工、少糖鹽，是最好的飲食原則。\n\n③ 肉吃不夠不代表有影響\n孩子不吃肉但會吃豆腐、雞蛋、魚等其他蛋白質來源，一樣可以長得很好，不必逼孩子吃肉。\n\n④ 偏挑食：帶孩子去戶外跑跑\n讓孩子消耗體力、增加飢餓感，是改善食慾最自然有效的方法。挑食很多時候是「不夠餓」。\n\n⑤ 關於身高：6個好時機\n生長激素分泌高峰：熟睡時（前3小時）、運動後、傍晚。確保充足睡眠 + 規律運動，對身高最有幫助。`,
  },
]

const SLEEP_TOPICS = [
  {
    id: 'sleepRitual',
    title: '睡眠作息',
    bgColor: '#EBF4FF',
    borderColor: '#C5D8E8',
    headerColor: '#5E85A3',
    sections: [
      {
        title: '各年齡建議睡眠時數',
        content: '半夜醒來在15分鐘內繼續入睡，都算是連續睡眠，很正常！\n\n建議總睡眠時數：\n🌟 0-3月：14小時\n🌟 4-11月：12小時\n🌟 1-2歲：11小時\n🌟 3-5歲：10小時\n🌟 6-13歲：9小時\n🌟 14-17歲：8小時\n\n睡足了，大腦才能好好整合白天學到的東西！',
      },
      {
        title: '睡前儀式這樣建立',
        content: '固定的睡前儀式幫助寶寶的大腦建立「要睡覺了」的信號，通常2-4週就能見效。\n\n推薦三步驟：\n① 洗澡 / 全身按摩（溫水放鬆肌肉）\n② 調暗燈光（促進褪黑激素分泌）\n③ 輕音樂或繪本故事\n\n寶寶睡眠週期約45-60分鐘，換週期時短暫醒來是正常的，輕聲陪伴即可。\n\n💡 3-6月寶寶體重超過5kg，就可以嘗試建立睡過夜的習慣了！',
      },
      {
        title: '惡夢 vs 夜驚，怎麼分？',
        content: '半夜哭鬧，先判斷是哪種：\n\n😨 惡夢（多在下半夜）：\n• 孩子會醒來、可以被安撫\n• 可能記得夢的內容\n• 處理：溫柔抱抱、說「沒事了，爸爸媽媽在這裡」\n\n😱 夜驚（多在上半夜）：\n• 孩子看似醒著但意識不清楚\n• 白天刺激過多會加劇\n• 處理：不要強行叫醒，保護安全，等待自然結束\n\n💡 整理白天的刺激源（減少3C、過多活動）可以有效減少夜驚。',
      },
      {
        title: '打鼾、尿床、磨牙',
        content: '這些都是家長常見的擔心，先放鬆一下：\n\n😴 打鼾：偶爾是正常的。若持續打鼾加上白天嗜睡、注意力差，可評估是否有腺樣體肥大，找耳鼻喉科看看。\n\n🌊 尿床：5歲前幾乎都是正常的生理發育現象，5歲後每週2次以上才需要特別關注。不要責罵孩子，這不是他的錯。\n\n⚙️ 磨牙：學齡前磨牙很常見（比例高達30%），多數會自然改善，壓力大或換牙期間較明顯。',
      },
    ],
  },
  {
    id: 'vaccine',
    emoji: '💉',
    title: '疫苗接種',
    bgColor: '#F0FDF4',
    borderColor: '#A7D7B8',
    headerColor: '#3D8B5E',
    sections: [
      {
        title: '為什麼要打疫苗？',
        content: '疫苗讓寶寶的免疫系統提前「認識」病毒，建立保護記憶，不需要真的生病就能獲得抵抗力。\n\n媽媽給的抗體在6個月後逐漸消退，這段「免疫缺口期」需要疫苗接力保護。\n\n群體免疫的意義：當社區有足夠多人接種，連無法打疫苗的新生兒和免疫缺乏者也能得到保護。\n\n✅ 疫苗的安全性經過嚴格臨床試驗和長期追蹤，效益遠大於風險。',
      },
      {
        title: '打完疫苗的正常反應',
        content: '這些反應代表身體的免疫系統在認真工作，是好事：\n\n常見（幾天內自然消退）：\n• 注射部位紅腫、硬塊\n• 輕微發燒（38.5度以下）\n• 哭鬧不安、睡眠略有改變\n• 食慾稍降\n\n照顧方式：\n• 退燒藥讓孩子舒服，活動力好的話可等待觀察\n• 冷敷注射部位（毛巾包冰敷）\n• 補充水份\n\n🚨 需立即就醫：高燒39.5度以上、持續超過48小時、嚴重哭鬧不止',
      },
      {
        title: '寶寶生病可以打疫苗嗎？',
        content: '這是家長最常問的問題！以下是參考原則：\n\n✅ 通常可以接種：\n• 輕微感冒（流鼻涕但精神好）\n• 低燒但沒有其他症狀\n• 過敏性鼻炎、輕微濕疹\n\n⏸️ 建議延後：\n• 高燒（38.5度以上）\n• 嚴重急性病症（如腸胃炎伴嚴重嘔吐）\n• 正在使用免疫抑制藥物\n\n💡 有任何疑慮，直接告訴診間護理師，他們會幫你評估！不用自己猜。',
      },
    ],
  },
  {
    id: 'illness',
    emoji: '🌡️',
    title: '常見病症照顧',
    bgColor: '#FFF5F5',
    borderColor: '#FFC5C5',
    headerColor: '#C0392B',
    sections: [
      {
        title: '發燒：退燒藥要不要吃？',
        content: '先深呼吸！發燒是身體免疫反應，是好事，代表在對抗病菌。\n\n退燒藥的真正目的：讓孩子舒服、方便觀察活動力，不是「消滅」發燒。\n\n重要觀念：\n• 溫度沒有持續升高，活動力還不錯 → 不一定要吃退燒藥\n• 補充水份是最重要的事\n• 3個月以下嬰兒發燒 → 直接就醫，不用等\n\n⚠️ 熱性痙攣怎麼辦？\n① 手機錄影（對稱？持續幾秒？）\n② 讓口鼻暢通，讓孩子側躺\n③ 不要塞任何東西進嘴巴\n多數熱性痙攣1-3分鐘自然結束，雖然嚇人，大多數沒有後遺症。',
      },
      {
        title: '流感',
        content: '流感特徵：突然高燒 + 明顯肌肉酸痛（同時出現要想到流感）\n\n跟一般感冒最大差別：症狀來得快又猛，肌肉酸痛非常明顯，通常還有明顯疲倦感。\n\n克流感（Tamiflu）：\n• 48小時內使用效果最好\n• 接觸者也可預防性投藥\n• 懷疑流感，早點就醫！越早越好。\n\n💡 最有效的預防：每年秋季接種流感疫苗，可大幅降低重症和住院風險。',
      },
      {
        title: '腸病毒',
        content: '腸病毒特徵：口腔潰瘍 + 手腳皮疹（手足口病）\n\n照顧重點：\n• 補充水份（最重要！）：冰水、牛奶、冰淇淋都可以，讓孩子願意吃就好\n• 退燒止痛（讓孩子能喝水進食）\n• 口腔止痛噴劑（幫助孩子能進食）\n\n有效輔助品：益生菌、多醣體（β-glucan）、維生素D\n\n🚨 出現這些症狀立即送醫：\n• 嗜睡、意識改變\n• 肌躍抽搐（突然抖一下）\n• 持續嘔吐\n• 呼吸急促、心跳很快\n這些可能是重症腸病毒的前兆，不要等！',
      },
      {
        title: '過敏：鼻炎與氣喘',
        content: '過敏不是「體質差」，而是免疫系統對某些物質過度反應，可以好好管理！\n\n減少誘發因子：\n• PM2.5、PM5（空汙日減少戶外活動）\n• 氮氧化物（瓦斯爐旁加強通風，開窗或開抽油煙機）\n• 控制塵蟎（定期洗曬床具、避免毛绒玩具堆積）\n\n過敏鼻炎：生理食鹽水洗鼻 + 鼻噴類固醇（安全有效的第一線治療）\n\n氣喘：規律使用控制性吸入劑，不是只有發作才用，平日保養最重要！',
      },
      {
        title: '異位性皮膚炎（濕疹）',
        content: '皮膚保濕是第一優先！異位性皮膚炎是皮膚屏障功能受損，保濕比什麼都重要。\n\n日常照顧：\n• 避免過度清潔（不需要每天泡澡，水溫適中就好）\n• 避免香精、香皂、含酒精產品\n• 洗澡後3分鐘內立刻塗保濕乳液（趁皮膚還濕的時候）\n• 選擇棉質、寬鬆衣物\n\n💡 局部類固醇藥膏：正確使用是安全的，不要因為擔心副作用而放著皮膚一直發炎，那才傷害更大。有疑問請問醫師。',
      },
    ],
  },
  {
    id: 'growth-height',
    emoji: '📏',
    title: '生長判斷與身高',
    bgColor: '#F5F0FF',
    borderColor: '#C5B8E8',
    headerColor: '#6B4FA0',
    sections: [
      {
        title: '寶寶生長基準（0-1歲）',
        content: '了解寶寶的生長節奏，你就不會那麼緊張了：\n\n身高：\n• 1歲前，每月長約4cm\n• 之後放緩，每月約2-3cm\n\n體重：\n• 前3個月，每月長約1kg\n• 之後每月約增加0.5kg以上\n\n頭圍：\n• 滿月頭圍約35-37cm（腦部發育指標）\n\n社交發展：\n• 滿月後開始有社交行為（會笑、眼神接觸）\n• 4-5個月後，脖頸才慢慢發育完成',
      },
      {
        title: '身高成長里程碑',
        content: '不要跨超過2條百分位線才需要擔心，在範圍內的個體差異都是正常的！\n\n各年齡成長速度參考：\n• 0-6月：16cm / 半年\n• 7-12月：8cm / 半年\n• 1-2歲：12cm / 年\n• 2-3歲：10cm / 年\n• 3-5歲：7cm / 年\n• 5歲-青春期：5cm / 年\n• 4歲-青春期：一年長高4-6cm是正常範圍\n• 青春期女生：7cm / 年\n\n小於4cm偏慢，大於6cm偏快，可跟醫師討論。',
      },
      {
        title: '身高迷思破解',
        content: '這些常見說法，讓我們來一起看清楚：\n\n❌ 需要補很多鈣 → ✅ 不需要過度補鈣，均衡飲食就夠了\n❌ 可以打生長激素幫助長高 → ✅ 除非有醫療適應症，否則不需要\n❌ 要補綜合維他命 → ✅ 可能造成氣喘、過敏，飲食均衡優先\n❌ 喝豬骨湯長高 → ✅ 傳統骨湯小孩不排斥尚可，但鈣質含量非常低\n❌ 要在「養肝時間」睡覺才長高 → ✅ 沒有科學根據，充足睡眠才重要\n\n💡 初經來後還可以長高2-4年，平均約7cm，不用急！',
      },
      {
        title: '性早熟需要注意',
        content: '如果出現以下情況，建議積極評估：\n\n⚠️ 女孩未滿8歲出現乳房發育\n⚠️ 男孩未滿9歲出現陰毛或陰莖發育\n\n可能伴隨的症狀：\n• 骨齡超前（影響最終身高）\n• 頭痛\n• 莫名嘔吐\n• 看東西模糊\n\n💡 早期評估和處理效果很好，不用過度擔心，但也不要忽視。發現跡象請找小兒科或小兒內分泌科。',
      },
      {
        title: '科學育兒 4 大 Tips',
        content: '科學育兒核心理念：\n\n① 培養成長型思維\n稱讚「努力過程」+「特質」，而不只是稱讚結果。大腦就像肌肉，是訓練出來的！\n\n② 告訴孩子誠實的好結果\n獎勵誠實的行為 + 以身作則（父母間也要誠實）\n\n③ 養邏輯思維\n多做創造性活動（不限制做法和說法），問「為什麼」比給答案更重要\n\n④ 支持型父母，培養內在動機\n7成事情讓孩子與父母討論，3成事情讓父母決定——讓孩子有參與感！',
      },
    ],
  },
  {
    id: 'body-type',
    emoji: '⚖️',
    title: '寶貝的體型健康嗎？',
    badge: '成長秘書',
    bgColor: '#F0FDF4',
    borderColor: '#A8D8B8',
    headerColor: '#3D7A5E',
    sections: [
      {
        title: 'BMI 參考（用描述，不用數字嚇家長）',
        content: '「看起來圓圓的」不一定是胖，嬰兒期的嬰兒脂肪是正常的！\n\n🍼 1歲前：圓滾滾的寶寶大部分是健康的，不需要刻意減重\n\n👣 1–3歲：開始走路後會自然變瘦，這是正常的「嬰兒脂肪消退期」\n\n🌱 3歲後：如果體重持續在同年齡97百分位以上，可以多留意飲食均衡\n\n⚠️ 偏瘦：如果體重低於3百分位，優先確認是否有進食困難或吸收問題',
      },
      {
        title: '需要多留意的信號（溫和提醒）',
        content: '這些不是「警告」，只是讓你多一份了解：\n\n• 連續3個月體重沒有增加 → 可以跟醫師聊聊\n\n• 突然暴瘦或暴胖 → 值得留意原因\n\n• 肚子一直很脹但體重不增 → 可能是消化吸收需要關注\n\n• 四肢很瘦但肚子很大 → 可以留意營養均衡\n\n💙 每個寶寶的身體都有自己的節奏，定期健康檢查是最好的監測方式！',
      },
    ],
  },
  {
    id: 'poop-guide',
    emoji: '💩',
    title: '從便便了解寶貝的身體',
    bgColor: '#FFFBF0',
    borderColor: '#E8D8A0',
    headerColor: '#8B6914',
    sections: [
      {
        title: '各月齡便便參考',
        content: '便便的樣子跟吃的東西、月齡都有關係，以下是參考：\n\n🍼 1–3個月：每天2–10次，膏狀/糊狀/顆粒狀。母乳寶寶可能一天多次，或好幾天才一次，都正常！\n\n🥣 3–6個月：每天2–10次，開始成型。副食品開始後便便會改變。\n\n🌱 6–12個月：每天1–3次，逐漸成型。顏色和質地跟吃的食物有關。\n\n👣 1–2歲：每天1–2次，定型。如果超過3天沒便便，可以多補充水分和纖維。\n\n🌟 2歲+：每天約1次，堅固型。可以開始養成固定排便習慣。',
      },
      {
        title: '便便顏色指南（重要！）',
        content: '顏色能告訴你很多事情：\n\n✅ 黃色、綠色、棕色 → 都是正常的，不用擔心\n\n⚠️ 黑色（柏油狀）→ 如果不是吃了含鐵食物，建議就醫\n\n⚠️ 紅色（帶血絲）→ 少量可能是肛裂，大量請就醫\n\n🚨 白色/灰白色 → 需要盡快就醫（可能是膽道問題）\n\n💡 剛開始吃副食品時，便便顏色多變是正常的，不用太緊張！',
      },
      {
        title: '便秘怎麼辦？（專業建議）',
        content: '先試試這些溫和的方法：\n\n💧 多喝水，補充水分是第一步\n\n🥦 多吃纖維：地瓜、南瓜、香蕉、蘋果都是好選擇\n\n🤲 腹部按摩：順時針畫圓，輕柔按摩肚子\n\n⏳ 不要急著用浣腸，先嘗試飲食調整\n\n🏥 如果超過一週都沒有便便，或寶寶很不舒服，再考慮就醫\n\n💙 便秘很常見，輕鬆處理就好，不用太焦慮！',
      },
    ],
  },
  {
    id: 'sleepBasics',
    title: '睡眠週期與作息表',
    emoji: '📊',
    content: `育兒知識課程：睡眠基礎知識\n\n睡眠週期：嬰幼兒每個睡眠週期約 45–60 分鐘，成人為 90 分鐘。週期結束時寶寶會有短暫清醒，這是正常的！\n\n睡前儀式重點：\n• 洗澡/全身按摩 → 調暗燈光 → 輕音樂\n• 奶嘴有助防猝死（SIDS），放心使用\n• 3–6個月的寶寶（超過5kg）可以開始睡過夜\n• 不用特意保持家裡安靜，讓寶寶習慣正常家庭音量\n\n半夜醒來：15分鐘內自行入睡算連續睡眠，不需介入\n夜驚（上半夜）：大腦在整理白天刺激，不需介入\n惡夢（下半夜）：孩子清醒且記得，需要安撫\n\n每日建議睡眠時數：\n| 月齡 | 總時數 | 日間小睡次數 |\n|------|--------|-------------|\n| 1–3月 | 15–17小時 | 4–5次，每次3–5小時 |\n| 4–6月 | 13–16小時 | 3–4次 |\n| 7–12月 | 11–14小時 | 2–3次 |\n| 1–2歲 | 11–14小時 | 1–2次 |\n| 2–3歲 | 10–13小時 | 1次 |\n| 3–5歲 | 10–13小時 | 可不午睡 |\n| 5歲+ | 9–11小時 | 不需午睡 |\n\n尿布更換頻率參考：\n• 每2小時換一次是基準\n| 月齡 | 尿次數 | 尿量 | 便次數 |\n|------|--------|------|--------|\n| 1–3月 | 15–20次/天 | 10–70cc | 2–10次 |\n| 3–6月 | 10–15次/天 | 70–100cc | 2–10次 |\n| 6–12月 | 8–12次/天 | 100cc+ | 1–3次 |\n| 1–2歲 | 4–8次/天 | 80–100cc | 1–2次 |\n| 2歲+ | 3–6次/天 | 150cc+ | 1次 |`,
  },
]

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

interface BodyRecord {
  id: string
  date: string
  hadPoop: boolean
  poopType: string
  poopColor: string
  appetite: string
  sleepQuality: string
  note: string
}


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
      '熱痙攣（高燒引起的抽搐）：① 立刻拿手機錄影（記錄時間和持續長度）② 確保孩子安全（側躺、遠離危險物品）③ 不要強壓四肢，等待自行停止 ④ 停止後立刻就醫',
      '退燒藥目的：讓孩子舒服、維持活動力，不是「把溫度降到正常」',
    ],
    dontList: [
      '不要用酒精擦拭（酒精中毒風險）',
      '不要冰敷額頭（無效且讓孩子不舒服）',
      '不要強迫吃東西，食慾差是正常的',
    ],
    urgent: '出現這些情況立刻就醫：① 3個月以下任何發燒 ② 發燒超過5天 ③ 熱痙攣（抽筋）④ 出疹 ⑤ 頸部僵硬 ⑥ 嗜睡叫不醒',
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
      '流感：48小時內吃克流感效果最佳，確診後越快吃越好。也可預防性投藥保護家中密切接觸者。',
      '每年打流感疫苗：6個月以上建議接種',
      '洗手是最有效的傳染預防，肥皂洗20秒',
    ],
    dontList: [
      '感冒藥4大迷思：感冒藥「縮短病程」（無效）、抗生素殺病毒（無效，感冒是病毒）、不發燒代表好了（不一定）、止咳藥讓咳嗽快好（無科學根據）',
      '不要讓孩子帶病上學（傳染給同學）',
    ],
    urgent: '就醫時機：呼吸急促/呼吸困難、嘴唇發青、嗜睡叫不醒、超過5天沒改善',
  },
  {
    type: 'warning',
    title: '鈣質攝取可能不足',
    detail: '本週紀錄中牛奶/乳製品出現僅2次，此年齡段每天需鈣質700mg，約需2杯牛奶+1片起司才能達標。骨骼密度在兒童期建立，短缺難以補救。',
    suggestion: '每天固定：①早餐240ml鮮奶或豆漿（高鈣豆漿優先）；②午餐一份豆腐（嫩豆腐100g含鈣150mg）；③點心1片起司或優格80g。可準備「起司蛋餅」「豆腐味噌湯」讓孩子喜歡乳製品。',
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
      '環境控制：注意 PM2.5、PM10、氮氧化物等空氣污染，過敏季節減少戶外活動時間',
      '異位性皮膚炎：避免過度清潔、過度日曬、含香精的清潔用品',
    ],
    dontList: [
      '不要因為「類固醇」兩個字就拒絕使用（局部/短期安全有效）',
      '不要相信「斷根食療」「排毒飲食」等偏方',
    ],
    urgent: '急性氣喘發作（喘鳴、呼吸急促、說話困難）立刻就醫',
  },
  {
    type: 'ok',
    title: '大動作發展符合標準',
    detail: '孩子跑步步態協調，雙腳跳躍時離地清楚，符合此年齡段「2–3歲雙腳跳」發展里程碑。',
    suggestion: '繼續提供多元運動機會：公園攀爬架（平衡感）、玩球（追球/踢球）、音樂律動（身體協調）。戶外活動每天至少60分鐘。',
  },
  {
    id: 'heightDev',
    icon: '📏',
    title: '身高發展與成長速率',
    subtitle: '了解孩子正常的身高成長節奏',
    story: '孩子的身高成長不是均速的，每個階段速率不同。了解正常速率，就能更從容地判斷孩子的生長狀況，不焦慮、不急著補品。',
    doList: [
      '身高預測參考：不太可能超過父母中較矮的那位，遺傳是主要因素',
      '4歲是觀察關鍵點：若一年長高不到4cm，可考慮照手部X光（骨齡評估）',
      '骨齡檢查：照手掌X光，評估骨骼成熟度，可預測最終身高',
      '確保充足睡眠（生長激素主要在熟睡前3小時分泌）+ 規律運動',
      '均衡飲食勝於補充劑：鈣、蛋白質、維生素D從天然食物補充最好',
    ],
    dontList: [
      '不要盲目購買「長高補充品」，缺乏科學根據',
      '不要因短暫成長停滯就焦慮，季節性波動是正常的',
    ],
    urgent: '需要評估：① 4–6歲每年長高 <4cm ② 5歲以前就出現青春期特徵（性早熟） ③ 身高落在同齡同性別第3百分位以下',
    reference: '— 育兒知識課程：身高發展篇',
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

const MOCK_AI_RESULTS: AIResult[] = [
  {
    type: 'ok',
    title: '大動作發展非常棒！',
    detail: '雙腳跳躍動作清楚有力，完全符合這個年齡段的里程碑，太厲害了 🎉 精細動作協調良好，拇指食指捏取準確，書寫前的準備已經打好基礎。',
    suggestion: '繼續保持目前的運動習慣，可以增加戶外探索時間讓寶貝多爬、多跑、多跳。',
  },
  {
    type: 'ok',
    title: '寶貝的便便紀錄看起來很正常！',
    detail: '你每天記錄寶貝的身體狀況，真的很用心！最近的便便記錄都在正常範圍，腸胃運作得不錯。',
    suggestion: '繼續保持均衡飲食就好，可以多補充蔬菜和水分，讓腸胃更舒暢。',
  },
  {
    type: 'warning',
    title: '蛋白質與鈣質可以加強',
    detail: '從記錄來看，蛋白質和鈣質的攝取可以再增加一點，對成長很有幫助。',
    suggestion: '每天多加一顆蒸蛋或一塊嫩豆腐，再搭配一杯奶，小小調整就有效果。',
  },
  {
    type: 'ok',
    title: '體型發展在正常範圍內',
    detail: '根據身高體重紀錄，寶貝的生長曲線很穩定。這個年紀圓圓的是正常的嬰兒脂肪，不用擔心！',
    suggestion: '繼續定期記錄身高體重，下次健康檢查時可以帶記錄給醫師看，讓醫師更了解寶貝的成長趨勢。',
  },
  {
    type: 'ok',
    title: '持續記錄非常用心！',
    detail: '你持續記錄飲食和生長數據，這份用心對寶貝來說是最珍貴的禮物 💙',
    suggestion: '這週試試看：每天散步回家時，讓寶貝自己走樓梯上樓（至少2層），大腿肌肉在遊戲中自然強壯 🪜',
  },
]

export default function GrowthClient() {
  const childId = useActiveChildId()
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
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [openTopic, setOpenTopic] = useState<string | null>(null)
  const [showGrowthForm, setShowGrowthForm] = useState(false)
  const [showMealForm, setShowMealForm] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [bodyRecords, setBodyRecords] = useState<BodyRecord[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('growth_body_records')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [showBodyForm, setShowBodyForm] = useState(false)
  const [bodyForm, setBodyForm] = useState({
    date: new Date().toISOString().split('T')[0],
    hadPoop: true,
    poopType: '正常條狀',
    poopColor: '黃色',
    appetite: '普通',
    sleepQuality: '普通',
    note: '',
  })

  function toggleAccordion(id: string) {
    setOpenAccordion(prev => prev === id ? null : id)
  }
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

  function addBodyRecord() {
    const newRecord: BodyRecord = { id: Date.now().toString(), ...bodyForm }
    setBodyRecords(r => {
      const updated = [...r, newRecord].sort((a, b) => b.date.localeCompare(a.date))
      localStorage.setItem('growth_body_records', JSON.stringify(updated))
      return updated
    })
    setShowBodyForm(false)
    setBodyForm({ date: new Date().toISOString().split('T')[0], hadPoop: true, poopType: '正常條狀', poopColor: '黃色', appetite: '普通', sleepQuality: '普通', note: '' })
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

      <ChildSwitcher />

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
              {/* 睡眠倒退期提醒 */}
              <div className="mt-3 p-3 rounded-2xl border" style={{ background: '#FFFBEB', borderColor: '#F59E0B' }}>
                <p className="text-xs font-bold mb-1.5" style={{ color: '#92400E' }}>💡 常見睡眠倒退期（暫時性，不是退步）</p>
                <p className="text-xs leading-relaxed" style={{ color: '#78350F' }}>
                  以下月份常見睡眠倒退：<strong>4月、6月、8月、12月、18月、2歲、2.5歲</strong>。
                  原因通常是發展跳躍、長牙、分離焦慮，通常 2–4 週後自然改善。
                  孩子突然難入睡，先確認是否在這些時間點附近，給自己和孩子多一點耐心。
                </p>
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

            {/* 育兒知識課程知識庫 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Shield size={16} style={{ color: '#7B9EBD' }} />
                <h2 className="font-bold text-base" style={{ color: '#2D3436' }}>育兒知識課程</h2>
                <span className="evidence-badge">59單元</span>
              </div>
              <div className="space-y-3">
                {HUANG_TOPICS.map((topic) => (
                  <div key={topic.id} className="rounded-2xl overflow-hidden border" style={{ borderColor: topic.borderColor }}>
                    {/* Topic header */}
                    <button
                      onClick={() => setOpenTopic(openTopic === topic.id ? null : topic.id)}
                      className="w-full flex items-center justify-between p-4"
                      style={{ background: topic.bgColor }}
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 20 }}>{topic.emoji}</span>
                        <div className="text-left">
                          <div className="font-bold text-sm" style={{ color: topic.headerColor }}>{topic.title}</div>
                                                  </div>
                      </div>
                      <ChevronDown
                        size={16}
                        style={{
                          color: topic.headerColor,
                          transform: openTopic === topic.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      />
                    </button>
                    {/* Topic sections */}
                    {openTopic === topic.id && (
                      <div className="border-t" style={{ borderColor: topic.borderColor, background: 'white' }}>
                        {(topic.sections ?? []).map((section, si) => (
                          <div key={si} className="border-b last:border-b-0" style={{ borderColor: '#F0EDE8' }}>
                            <button
                              onClick={() => setOpenAccordion(openAccordion === `${topic.id}-${si}` ? null : `${topic.id}-${si}`)}
                              className="w-full flex items-center justify-between px-4 py-3"
                            >
                              <span className="text-sm font-semibold text-left" style={{ color: '#2D3436' }}>{section.title}</span>
                              <ChevronDown
                                size={14}
                                style={{
                                  color: '#8E9EAD',
                                  flexShrink: 0,
                                  marginLeft: 8,
                                  transform: openAccordion === `${topic.id}-${si}` ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s ease'
                                }}
                              />
                            </button>
                            {openAccordion === `${topic.id}-${si}` && (
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

          {/* 智能拍照分析 */}
          <SmartPhotoAnalyzer key={childId} page="growth" storageKey={`growth_photos_${childId || 'default'}`} label="成長" />

          {/* 每日身體觀察 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Heart size={16} style={{ color: '#C5608A' }} />
                <h2 className="font-bold" style={{ color: '#2D3436' }}>每日身體觀察</h2>
              </div>
              <button onClick={() => setShowBodyForm(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white" style={{ background: '#C5608A' }}>
                <Plus size={12} />新增今日
              </button>
            </div>
            {bodyRecords.length === 0 ? (
              <div className="p-4 rounded-2xl border text-center" style={{ background: '#FFF0F8', borderColor: '#E8B0D0' }}>
                <p className="text-sm" style={{ color: '#A0336A' }}>還沒有記錄，點右上角新增今日觀察吧！</p>
                <p className="text-xs mt-1" style={{ color: '#C5608A' }}>或直接用上方拍照辨識，更快速！</p>
              </div>
            ) : (
              <div className="space-y-2">
                {bodyRecords.slice(0, 7).map(r => (
                  <div key={r.id} className="p-3 rounded-xl border" style={{ background: 'white', borderColor: '#F0D0E0' }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold" style={{ color: '#2D3436' }}>{r.date}</span>
                      <div className="flex gap-1.5">
                        <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: r.hadPoop ? '#D8F5D8' : '#FFE8E8', color: r.hadPoop ? '#3A7A3A' : '#C45A5A' }}>
                          {r.hadPoop ? '有便便 ✓' : '無便便'}
                        </span>
                      </div>
                    </div>
                    {r.hadPoop && (
                      <div className="flex gap-2 mb-1 flex-wrap">
                        <span className="text-xs px-1.5 py-0.5 rounded-lg" style={{ background: '#FFFBF0', color: '#8B6914' }}>型態：{r.poopType}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-lg" style={{ background: '#FFFBF0', color: '#8B6914' }}>顏色：{r.poopColor}</span>
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs" style={{ color: '#6B7B8D' }}>食慾：{r.appetite}</span>
                      <span className="text-xs" style={{ color: '#6B7B8D' }}>睡眠：{r.sleepQuality}</span>
                      {r.note && <span className="text-xs" style={{ color: '#6B7B8D' }}>{r.note}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* 每日身體觀察表單 Modal */}
      {showBodyForm && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 max-w-md mx-auto" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg" style={{ color: '#2D3436' }}>每日身體觀察</h2>
              <button onClick={() => setShowBodyForm(false)}><X size={22} style={{ color: '#8E9EAD' }} /></button>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: '#2D3436' }}>日期</label>
              <input type="date" value={bodyForm.date} onChange={e => setBodyForm(f => ({ ...f, date: e.target.value }))} className="w-full h-11 px-4 rounded-2xl border text-sm outline-none" style={{ borderColor: '#E8E0D5', color: '#2D3436' }} />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>今天便便了嗎？</label>
              <div className="flex gap-3">
                {[{ v: true, label: '有便便 ✓' }, { v: false, label: '今天沒有' }].map(({ v, label }) => (
                  <button key={String(v)} onClick={() => setBodyForm(f => ({ ...f, hadPoop: v }))}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                    style={{ background: bodyForm.hadPoop === v ? (v ? '#D8F5D8' : '#FFE8E8') : 'white', color: bodyForm.hadPoop === v ? (v ? '#3A7A3A' : '#C45A5A') : '#6B7B8D', borderColor: bodyForm.hadPoop === v ? (v ? '#A8D8A8' : '#F5C5C5') : '#E8E0D5' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {bodyForm.hadPoop && (
              <>
                <div>
                  <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>便便型態</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['水狀', '糊狀', '軟條狀', '硬顆粒', '正常條狀'].map(t => (
                      <button key={t} onClick={() => setBodyForm(f => ({ ...f, poopType: t }))}
                        className="py-2 rounded-xl text-sm border"
                        style={{ background: bodyForm.poopType === t ? '#FFF3CC' : 'white', color: bodyForm.poopType === t ? '#8B6914' : '#6B7B8D', borderColor: bodyForm.poopType === t ? '#E8C850' : '#E8E0D5', fontWeight: bodyForm.poopType === t ? 700 : 400 }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>便便顏色</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['黃色', '綠色', '棕色', '其他'].map(c => (
                      <button key={c} onClick={() => setBodyForm(f => ({ ...f, poopColor: c }))}
                        className="py-2 rounded-xl text-sm border"
                        style={{ background: bodyForm.poopColor === c ? '#FFF3CC' : 'white', color: bodyForm.poopColor === c ? '#8B6914' : '#6B7B8D', borderColor: bodyForm.poopColor === c ? '#E8C850' : '#E8E0D5', fontWeight: bodyForm.poopColor === c ? 700 : 400 }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>今天食慾如何？</label>
              <div className="flex gap-2">
                {['很好', '普通', '不太好'].map(a => (
                  <button key={a} onClick={() => setBodyForm(f => ({ ...f, appetite: a }))}
                    className="flex-1 py-2 rounded-xl text-sm border"
                    style={{ background: bodyForm.appetite === a ? '#EBF4FF' : 'white', color: bodyForm.appetite === a ? '#5E85A3' : '#6B7B8D', borderColor: bodyForm.appetite === a ? '#7B9EBD' : '#E8E0D5', fontWeight: bodyForm.appetite === a ? 700 : 400 }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>昨晚睡眠品質？</label>
              <div className="flex gap-2">
                {['很好', '普通', '不太好'].map(s => (
                  <button key={s} onClick={() => setBodyForm(f => ({ ...f, sleepQuality: s }))}
                    className="flex-1 py-2 rounded-xl text-sm border"
                    style={{ background: bodyForm.sleepQuality === s ? '#EBF4FF' : 'white', color: bodyForm.sleepQuality === s ? '#5E85A3' : '#6B7B8D', borderColor: bodyForm.sleepQuality === s ? '#7B9EBD' : '#E8E0D5', fontWeight: bodyForm.sleepQuality === s ? 700 : 400 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1" style={{ color: '#2D3436' }}>備注（選填）</label>
              <input type="text" placeholder="例：有點脹氣、今天胃口特別好" value={bodyForm.note} onChange={e => setBodyForm(f => ({ ...f, note: e.target.value }))} className="w-full h-11 px-4 rounded-2xl border text-sm outline-none" style={{ borderColor: '#E8E0D5', color: '#2D3436' }} />
            </div>
            <button onClick={addBodyRecord} className="w-full py-4 rounded-2xl font-bold text-base text-white" style={{ background: 'linear-gradient(135deg, #C5608A, #A0336A)' }}>
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
