'use client'

import { useState, useMemo } from 'react'
import {
  MapPin, BookOpen, ClipboardList, Star, Clock, Baby,
  Sun, CloudRain, Wind, Leaf, Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Heart, ThumbsUp,
} from 'lucide-react'

const REGIONS = [
  { key: 'north', label: '北部', emoji: '🏙️', cities: ['台北市', '新北市', '基隆市', '桃園市', '新竹市', '新竹縣'] },
  { key: 'central', label: '中部', emoji: '🌾', cities: ['苗栗縣', '台中市', '彰化縣', '南投縣', '雲林縣'] },
  { key: 'south', label: '南部', emoji: '🌴', cities: ['嘉義市', '嘉義縣', '台南市', '高雄市', '屏東縣'] },
  { key: 'east', label: '東部', emoji: '🏔️', cities: ['宜蘭縣', '花蓮縣', '台東縣'] },
]

const PLACE_TYPES = [
  { key: 'sport', label: '🏃 運動體能', emoji: '🏃' },
  { key: 'art', label: '🎨 藝文創作', emoji: '🎨' },
  { key: 'nature', label: '🌿 自然生態', emoji: '🌿' },
  { key: 'science', label: '🔬 科學探索', emoji: '🔬' },
  { key: 'craft', label: '🧁 手作體驗', emoji: '🧁' },
]

const SEASONAL_TIPS = [
  {
    season: '春季（3–5月）', icon: Leaf, color: '#5A8A5A', bg: '#EBF4EB',
    tips: ['踏青好時機，戶外公園、農場都適合', '注意花粉季，過敏兒建議先查過敏原', '春雨較多，出發前確認天氣'],
    placeIds: ['12', '13', '14', '23', '6'],
  },
  {
    season: '夏季（6–8月）', icon: Sun, color: '#B07548', bg: '#FDF0E8',
    tips: ['室內場館優先，避免正午外出', '水上樂園、游泳池是首選', '蚊蟲多，戶外活動做好防護'],
    placeIds: ['7', '8', '18', '2', '24'],
  },
  {
    season: '秋季（9–11月）', icon: Wind, color: '#5E85A3', bg: '#EBF4FF',
    tips: ['最舒適的戶外季節', '登山健行適合各年齡', '音樂節、文化祭活動多'],
    placeIds: ['14', '3', '21', '19', '22'],
  },
  {
    season: '冬季（12–2月）', icon: CloudRain, color: '#7A6A96', bg: '#F0EBF8',
    tips: ['室內活動為主，避免寒流外出', '溫泉適合2歲以上（注意水溫）', '注意保暖，層次穿衣'],
    placeIds: ['2', '10', '15', '4', '25'],
  },
]

interface PlaceData {
  id: string
  name: string
  city: string
  district: string
  is_indoor: boolean
  types: string[]
  suitable_age_min: number
  suitable_age_max: number
  avg_rating: number
  review_count: number
  avg_stay_minutes: number
  features: string[]
  budget: string
  transport: string
  description: string
  parentTip: string
  highlights: string[]
}

const MOCK_PLACES: PlaceData[] = [
  // ── 北部 ──
  { id: '1', name: '台北市立兒童新樂園', city: '台北市', district: '士林區', is_indoor: false, types: ['sport', 'art'], suitable_age_min: 12, suitable_age_max: 144, avg_rating: 4.5, review_count: 328, avg_stay_minutes: 180, features: ['旋轉木馬', '兒童摩天輪', '碰碰車', '遊樂設施'], budget: 'low', transport: 'mrt', description: '台北最大的兒童主題樂園，交通便利，捷運直達。', parentTip: '建議平日去人較少，帶一套換洗衣物以防玩水區弄濕。園區內餐飲選擇有限，可自帶輕食。', highlights: ['2歲以下免費入園', '捷運劍潭站有接駁車', '週三有優惠票價'] },
  { id: '2', name: '國立臺灣科學教育館', city: '台北市', district: '士林區', is_indoor: true, types: ['science'], suitable_age_min: 24, suitable_age_max: 144, avg_rating: 4.6, review_count: 421, avg_stay_minutes: 180, features: ['互動展覽', '3D劇場', '空中腳踏車', '地震體驗'], budget: 'low', transport: 'mrt', description: '台北科教館，豐富互動式科學展覽，適合親子共學。', parentTip: '3-5樓的常設展最適合3歲以上，B1兒童益智探索區適合幼兒。空中腳踏車需排隊建議一到就先去。', highlights: ['6歲以下免門票', '雨天室內首選', '可搭配兒童新樂園一日遊'] },
  { id: '3', name: '台北市立動物園', city: '台北市', district: '文山區', is_indoor: false, types: ['nature', 'science'], suitable_age_min: 6, suitable_age_max: 144, avg_rating: 4.7, review_count: 892, avg_stay_minutes: 300, features: ['大貓熊', '企鵝館', '兒童動物區', '夜間動物園'], budget: 'low', transport: 'mrt', description: '台灣規模最大的動物園，捷運動物園站直達，餵食體驗深受小朋友喜愛。', parentTip: '園區很大建議帶推車，兒童動物區可近距離接觸小動物最受歡迎。上午動物比較活潑，建議早點到。', highlights: ['門票只要60元超划算', '兒童動物區可餵食', '搭貓纜可看夜景'] },
  { id: '4', name: '信誼小太陽親子館', city: '台北市', district: '中正區', is_indoor: true, types: ['art', 'craft'], suitable_age_min: 0, suitable_age_max: 72, avg_rating: 4.8, review_count: 256, avg_stay_minutes: 120, features: ['感統遊戲', '繪本閱讀', '積木區', '寶寶爬行區'], budget: 'low', transport: 'mrt', description: '專為0-6歲設計的親子館，教具豐富，空間溫馨安全。', parentTip: '需要線上預約場次，每場限制人數所以品質很好。0-2歲寶寶有專屬爬行區，不用擔心大小孩衝撞。', highlights: ['需預約・品質好', '0-2歲專屬區', '專業老師帶活動'] },
  { id: '5', name: '新北市立圖書館總館', city: '新北市', district: '板橋區', is_indoor: true, types: ['art', 'science'], suitable_age_min: 0, suitable_age_max: 144, avg_rating: 4.6, review_count: 203, avg_stay_minutes: 120, features: ['兒童閱覽區', '3D列印', 'VR體驗', '親子共讀'], budget: 'free', transport: 'mrt', description: '免費入場，設施現代，適合親子共讀與科技探索。', parentTip: '4樓兒童閱覽區有地墊區可讓幼兒自由閱讀，5樓有VR和3D列印體驗適合大孩子。假日有說故事活動。', highlights: ['完全免費', '捷運板橋站步行5分鐘', '假日有免費說故事活動'] },
  { id: '6', name: '朱銘美術館', city: '新北市', district: '金山區', is_indoor: false, types: ['art', 'nature'], suitable_age_min: 24, suitable_age_max: 144, avg_rating: 4.5, review_count: 312, avg_stay_minutes: 180, features: ['戶外雕塑', '兒童藝術中心', '太極廣場', 'DIY體驗'], budget: 'medium', transport: 'car', description: '台灣最大戶外雕塑美術館，兒童藝術體驗區超豐富。', parentTip: '兒童藝術中心有各種免費DIY活動，戶外草坪可以讓孩子跑跳。建議搭配金山老街吃午餐。', highlights: ['兒童藝術中心免費DIY', '草坪超大可野餐', '搭配金山老街半日遊'] },
  { id: '7', name: '小人國主題樂園', city: '桃園市', district: '龍潭區', is_indoor: false, types: ['sport', 'art'], suitable_age_min: 24, suitable_age_max: 144, avg_rating: 4.3, review_count: 445, avg_stay_minutes: 360, features: ['迷你台灣', '水上樂園', '遊樂設施', '室內樂園'], budget: 'medium', transport: 'car', description: '台灣特色微縮景觀搭配遊樂設施，夏天有水上樂園。', parentTip: '迷你世界區很適合跟孩子介紹地標建築，室內樂園下雨天也OK。夏天水樂園記得帶泳衣和防曬。', highlights: ['微縮景觀寓教於樂', '夏天水樂園超消暑', '室內外都有設施'] },
  { id: '8', name: 'Xpark 水族館', city: '桃園市', district: '中壢區', is_indoor: true, types: ['science', 'nature'], suitable_age_min: 12, suitable_age_max: 144, avg_rating: 4.4, review_count: 678, avg_stay_minutes: 150, features: ['水母區', '企鵝餵食', '珊瑚潛水', '互動投影'], budget: 'medium', transport: 'train', description: '日系都會型水族館，光影互動設計讓孩子身歷其境。', parentTip: '水母萬花筒區拍照超美，建議平日下午場人少。1歲以下免費，企鵝餵食秀時間要先查好卡位。', highlights: ['水母區光影超夢幻', '1歲以下免費入場', '鄰近華泰名品城好逛'] },
  { id: '9', name: '新竹市立動物園', city: '新竹市', district: '東區', is_indoor: false, types: ['nature'], suitable_age_min: 6, suitable_age_max: 144, avg_rating: 4.2, review_count: 234, avg_stay_minutes: 120, features: ['無籠式設計', '河馬', '馬來熊', '大草坪'], budget: 'low', transport: 'bus', description: '台灣歷史最悠久的動物園，重新改建後採無籠式設計，友善親子。', parentTip: '改建後園區不大但規劃很好，1-2小時可逛完，適合搭配新竹公園一起玩。推車友善。', highlights: ['票價便宜僅50元', '無籠式設計很先進', '旁邊就是新竹公園'] },
  // ── 中部 ──
  { id: '10', name: '國立自然科學博物館', city: '台中市', district: '北區', is_indoor: true, types: ['science', 'nature'], suitable_age_min: 24, suitable_age_max: 144, avg_rating: 4.7, review_count: 512, avg_stay_minutes: 240, features: ['恐龍化石', '3D劇場', '太空劇場', '植物園'], budget: 'low', transport: 'bus', description: '台灣最完整的自然科學博物館，科教設施豐富。', parentTip: '恐龍廳是孩子最愛，會動的暴龍模型超震撼。太空劇場適合5歲以上。旁邊植物園免費可散步。', highlights: ['恐龍廳必看・會動', '太空劇場身歷其境', '植物園免費散步好去處'] },
  { id: '11', name: '麗寶樂園', city: '台中市', district: '后里區', is_indoor: false, types: ['sport'], suitable_age_min: 36, suitable_age_max: 144, avg_rating: 4.3, review_count: 389, avg_stay_minutes: 360, features: ['摩天輪', '水陸雙樂園', '卡丁車', 'Outlet'], budget: 'high', transport: 'car', description: '水陸雙樂園加上 Outlet 購物，一整天不無聊。', parentTip: '探索世界的旋轉木馬和小火車適合3歲幼兒。馬拉灣水樂園夏天開放。Outlet可以讓媽媽逛街爸爸帶小孩。', highlights: ['水陸雙樂園一票到底', 'Outlet逛街吃飯方便', '摩天輪夜景超美'] },
  { id: '12', name: '東勢林場遊樂區', city: '台中市', district: '東勢區', is_indoor: false, types: ['nature'], suitable_age_min: 12, suitable_age_max: 144, avg_rating: 4.4, review_count: 178, avg_stay_minutes: 240, features: ['螢火蟲季', '森林步道', '體能訓練場', '烤肉區'], budget: 'low', transport: 'car', description: '台灣中部最美森林遊樂區，春季賞螢名所。', parentTip: '4-5月螢火蟲季必訪，需事先報名夜間導覽。體能訓練場有繩索設施適合大孩子。可自備食材烤肉。', highlights: ['4-5月螢火蟲季必訪', '森林浴超放鬆', '可烤肉野餐'] },
  { id: '13', name: '飛牛牧場', city: '苗栗縣', district: '通霄鎮', is_indoor: false, types: ['nature', 'craft'], suitable_age_min: 12, suitable_age_max: 144, avg_rating: 4.3, review_count: 187, avg_stay_minutes: 300, features: ['餵牛體驗', '擠牛奶', '牧場導覽', '牛奶冰淇淋DIY'], budget: 'medium', transport: 'car', description: '親子農場體驗，可接觸各種農場動物，DIY乳製品。', parentTip: '餵小牛喝奶是最受歡迎的活動，建議住一晚，晚上可以看星星。鮮乳冰淇淋DIY孩子超愛做。', highlights: ['餵小牛喝奶超療癒', '住宿看星星', '鮮奶冰淇淋DIY'] },
  { id: '14', name: '溪頭自然教育園區', city: '南投縣', district: '鹿谷鄉', is_indoor: false, types: ['nature'], suitable_age_min: 24, suitable_age_max: 144, avg_rating: 4.6, review_count: 567, avg_stay_minutes: 300, features: ['大學池', '神木步道', '空中走廊', '森林芬多精'], budget: 'low', transport: 'car', description: '台灣最知名森林遊樂區，步道平緩適合帶小孩健行。', parentTip: '大學池步道平緩好推推車，空中走廊有點高度適合膽大的孩子。妖怪村在附近可順遊。夏天涼爽避暑勝地。', highlights: ['步道平緩推車友善', '夏天避暑勝地', '順遊妖怪村'] },
  // ── 南部 ──
  { id: '15', name: '奇美博物館', city: '台南市', district: '仁德區', is_indoor: true, types: ['art', 'science'], suitable_age_min: 36, suitable_age_max: 144, avg_rating: 4.8, review_count: 723, avg_stay_minutes: 240, features: ['西洋繪畫', '樂器收藏', '動物標本', '戶外草坪'], budget: 'low', transport: 'bus', description: '歐式建築搭配豐富收藏，戶外草坪適合野餐奔跑。', parentTip: '動物廳的標本展覽孩子會看到入迷。戶外園區免費開放，阿波羅噴泉廣場適合拍照。自帶野餐墊草坪超棒。', highlights: ['動物廳標本超精彩', '戶外草坪免費開放', '歐式建築拍照打卡'] },
  { id: '16', name: '台南十鼓仁糖文創園區', city: '台南市', district: '仁德區', is_indoor: false, types: ['art', 'sport'], suitable_age_min: 24, suitable_age_max: 144, avg_rating: 4.5, review_count: 289, avg_stay_minutes: 180, features: ['鼓樂表演', '高空滑車', '蜜糖罐攀岩', '星光場次'], budget: 'medium', transport: 'car', description: '老糖廠改建的文創園區，擊鼓體驗和冒險設施都超讚。', parentTip: '星光場次票價較便宜而且燈光美氣氛佳。擊鼓體驗孩子都超愛，2歲以上就能參與。高空滑車超刺激但有身高限制。', highlights: ['星光場次CP值高', '擊鼓體驗2歲可玩', '搭配奇美博物館一日遊'] },
  { id: '17', name: '義大遊樂世界', city: '高雄市', district: '大樹區', is_indoor: false, types: ['sport'], suitable_age_min: 36, suitable_age_max: 144, avg_rating: 4.2, review_count: 356, avg_stay_minutes: 360, features: ['古希臘主題', '室內遊樂館', '摩天輪', 'Outlet'], budget: 'high', transport: 'car', description: '南台灣最大主題樂園，室內外設施兼具，雨天也能玩。', parentTip: '特洛伊城室內館有很多適合幼兒的遊樂設施，不怕雨天。Outlet和飯店在旁邊，適合安排兩天一夜。', highlights: ['室內館雨天照玩', '鄰近Outlet和飯店', '適合兩天一夜'] },
  { id: '18', name: '國立海洋生物博物館', city: '屏東縣', district: '車城鄉', is_indoor: true, types: ['science', 'nature'], suitable_age_min: 12, suitable_age_max: 144, avg_rating: 4.8, review_count: 645, avg_stay_minutes: 360, features: ['鯨鯊展示', '珊瑚王國', '夜宿海生館', '觸摸池'], budget: 'medium', transport: 'car', description: '台灣最大水族館，夜宿海生館是孩子一生難忘的體驗。', parentTip: '夜宿活動超推薦但要提早3個月訂！觸摸池讓孩子摸海星海膽超興奮。餵食秀時間表先抄下來安排路線。', highlights: ['夜宿海生館必體驗', '觸摸池小朋友超愛', '要提早3個月預訂'] },
  { id: '19', name: '駁二藝術特區', city: '高雄市', district: '鹽埕區', is_indoor: false, types: ['art', 'craft'], suitable_age_min: 12, suitable_age_max: 144, avg_rating: 4.5, review_count: 412, avg_stay_minutes: 180, features: ['大型公共藝術', '哈瑪星鐵道園區', '小火車', '展覽'], budget: 'free', transport: 'mrt', description: '高雄最夯文創基地，小火車和大型藝術裝置小朋友超愛。', parentTip: '哈瑪星小火車是孩子最愛，50元一趟很超值。園區腹地大適合騎腳踏車，可租親子車。假日有市集活動。', highlights: ['小火車50元超值', '免費入園逛到飽', '租親子腳踏車遊園'] },
  // ── 東部 ──
  { id: '20', name: '遠雄海洋公園', city: '花蓮縣', district: '壽豐鄉', is_indoor: false, types: ['nature', 'sport'], suitable_age_min: 24, suitable_age_max: 144, avg_rating: 4.4, review_count: 334, avg_stay_minutes: 360, features: ['海豚表演', '海獅秀', '遊樂設施', '水族館'], budget: 'high', transport: 'car', description: '花蓮唯一海洋主題樂園，海豚互動體驗超值。', parentTip: '海豚表演一天兩場要先看好時間，VIP互動體驗可以跟海豚握手拍照孩子會記一輩子。園區有坡度帶推車較辛苦。', highlights: ['海豚互動終身難忘', '花蓮必去親子景點', '建議安排整天'] },
  { id: '21', name: '宜蘭傳統藝術中心', city: '宜蘭縣', district: '五結鄉', is_indoor: false, types: ['art', 'craft'], suitable_age_min: 12, suitable_age_max: 144, avg_rating: 4.5, review_count: 278, avg_stay_minutes: 180, features: ['捏麵人', '手拉坯', '布袋戲', '古早味小吃'], budget: 'low', transport: 'car', description: '體驗台灣傳統工藝，手作DIY活動超多，寓教於樂。', parentTip: '捏麵人和手拉坯是最受歡迎的DIY，每個約100-200元。古早味小吃街氛圍很好。黃舉人宅有免費導覽。', highlights: ['捏麵人DIY超好玩', '古早味小吃街', '手拉坯體驗陶藝'] },
  { id: '22', name: '初鹿牧場', city: '台東縣', district: '卑南鄉', is_indoor: false, types: ['nature'], suitable_age_min: 6, suitable_age_max: 144, avg_rating: 4.3, review_count: 167, avg_stay_minutes: 180, features: ['餵食小動物', '滑草場', '鮮乳冰淇淋', '大草原'], budget: 'low', transport: 'car', description: '台東最美牧場，遼闊草原讓孩子盡情奔跑。', parentTip: '滑草場超好玩但要穿長褲。餵食小動物的飼料門口有賣。鮮乳冰淇淋必吃，現擠鮮奶也超濃。', highlights: ['滑草場必玩（穿長褲）', '鮮奶冰淇淋必吃', '大草原超適合放電'] },
  { id: '23', name: '羅東林業文化園區', city: '宜蘭縣', district: '羅東鎮', is_indoor: false, types: ['nature', 'art'], suitable_age_min: 0, suitable_age_max: 144, avg_rating: 4.4, review_count: 198, avg_stay_minutes: 120, features: ['貯木池', '森林鐵路', '竹林步道', '免費入園'], budget: 'free', transport: 'train', description: '免費入園的林業文化園區，平坦好推嬰兒車，生態豐富。', parentTip: '完全免費超佛心，步道平坦嬰兒車無障礙。貯木池可看到很多水鳥，帶望遠鏡更好玩。旁邊就是羅東夜市。', highlights: ['免費入園超佛心', '推車友善無障礙', '順遊羅東夜市'] },
  // ── 室內親子空間 ──
  { id: '24', name: '騎士堡兒童育成中心', city: '台北市', district: '信義區', is_indoor: true, types: ['sport', 'craft'], suitable_age_min: 12, suitable_age_max: 96, avg_rating: 4.3, review_count: 345, avg_stay_minutes: 150, features: ['角色扮演', '球池', '攀爬區', '職業體驗'], budget: 'medium', transport: 'mrt', description: '大型室內親子樂園，雨天放電首選，多分店方便。', parentTip: '辦會員年卡比較划算，平日不限時最棒。球池和攀爬區讓孩子放電效果極佳。記得穿襪子（大人小孩都要）。', highlights: ['雨天放電救星', '會員年卡較划算', '全台多分店方便'] },
  { id: '25', name: '貝兒絲樂園', city: '新北市', district: '板橋區', is_indoor: true, types: ['sport', 'craft'], suitable_age_min: 6, suitable_age_max: 96, avg_rating: 4.2, review_count: 267, avg_stay_minutes: 150, features: ['主題變裝', '沙坑', '超市體驗', '水池區'], budget: 'medium', transport: 'mrt', description: '主題式室內樂園，每季換主題，全台多分店。', parentTip: '每間分店主題不同可以收集，變裝拍照孩子超開心。決明子沙坑比較不怕髒。平日買團購券最划算。', highlights: ['主題每季更換', '變裝拍照超可愛', '平日團購券划算'] },
]

const CITIES_ALL = ['台北市', '新北市', '基隆市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '台中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '台南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '台東縣']

const TRANSPORT_TYPES = [
  { key: 'mrt', label: '捷運' },
  { key: 'bus', label: '公車' },
  { key: 'car', label: '開車' },
  { key: 'train', label: '火車' },
]

const BUDGET_OPTIONS = [
  { key: 'free', label: '免費' },
  { key: 'low', label: '200元以下' },
  { key: 'medium', label: '200–500元' },
  { key: 'high', label: '500元以上' },
]

const ALLERGY_OPTIONS = ['花粉', '蚊蟲', '塵蟎', '動物毛髮', '海鮮', '無特殊過敏']
const AGE_OPTIONS = ['0–6個月', '6–12個月', '1歲', '2歲', '3歲', '4歲', '5歲', '6歲', '7歲以上']

interface FilterState {
  city: string
  indoorOutdoor: 'all' | 'indoor' | 'outdoor'
  budget: string[]
  transport: string[]
  allergies: string[]
  adultCount: number
  children: { age: string }[]
  placeTypes: string[]
}

const DEFAULT_FILTER: FilterState = {
  city: '',
  indoorOutdoor: 'all',
  budget: [],
  transport: [],
  allergies: [],
  adultCount: 2,
  children: [{ age: '3歲' }],
  placeTypes: [],
}

function StarRating({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={size} style={{ color: value >= n ? '#FBBF24' : '#E5E7EB', fill: value >= n ? '#FBBF24' : '#E5E7EB' }} />
      ))}
    </div>
  )
}

function PlaceCard({ place, onSelect }: { place: PlaceData; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className="w-full text-left">
      <div className="p-4 rounded-2xl border" style={{ background: 'white', borderColor: '#E8E0D5' }}>
        <div className="flex gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: '#EBF4FF' }}>
            {place.is_indoor ? '🏛️' : '🌳'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm leading-tight line-clamp-1" style={{ color: '#2D3436' }}>{place.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={11} style={{ color: '#8E9EAD' }} />
              <span className="text-xs" style={{ color: '#8E9EAD' }}>{place.city} {place.district}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-0.5">
                <StarRating value={Math.round(place.avg_rating)} size={11} />
                <span className="text-xs font-semibold ml-0.5" style={{ color: '#2D3436' }}>{place.avg_rating.toFixed(1)}</span>
              </div>
              <span className="text-xs px-1.5 py-0.5 rounded-lg" style={{ background: place.is_indoor ? '#EBF4FF' : '#EBF4EB', color: place.is_indoor ? '#5E85A3' : '#5A8A5A' }}>
                {place.is_indoor ? '室內' : '戶外'}
              </span>
            </div>
          </div>
        </div>
        {/* 家長心得精華 */}
        <div className="mt-2.5 p-2.5 rounded-xl" style={{ background: '#FAFAF5' }}>
          <div className="flex items-center gap-1 mb-1">
            <ThumbsUp size={11} style={{ color: '#7B9EBD' }} />
            <span className="text-xs font-semibold" style={{ color: '#7B9EBD' }}>家長推薦</span>
          </div>
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#6B7B8D' }}>{place.parentTip}</p>
        </div>
        {place.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {place.highlights.slice(0, 3).map(h => (
              <span key={h} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EBF4FF', color: '#5E85A3' }}>{h}</span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}

type MainTab = 'knowledge' | 'records'

export default function PlacesClient({ initialPlaces }: { initialPlaces?: any[] }) {
  const places = (initialPlaces && initialPlaces.length > 0 ? initialPlaces : MOCK_PLACES) as PlaceData[]
  const placesMap = useMemo(() => new Map(places.map(p => [p.id, p])), [places])
  const [mainTab, setMainTab] = useState<MainTab>('knowledge')
  const [expandedSeason, setExpandedSeason] = useState<string | null>(null)
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null)
  const [activeTypeFilter, setActiveTypeFilter] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER)
  const [showFilter, setShowFilter] = useState(false)
  const [tempFilter, setTempFilter] = useState<FilterState>(DEFAULT_FILTER)
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null)
  const [hasFiltered, setHasFiltered] = useState(false)

  // 搜尋 tab 篩選
  const filtered = useMemo(() => {
    return places.filter(p => {
      if (filter.city && p.city !== filter.city) return false
      if (filter.indoorOutdoor === 'indoor' && !p.is_indoor) return false
      if (filter.indoorOutdoor === 'outdoor' && p.is_indoor) return false
      if (filter.budget.length > 0 && !filter.budget.includes(p.budget)) return false
      if (filter.transport.length > 0 && !filter.transport.includes(p.transport)) return false
      if (filter.placeTypes.length > 0 && !filter.placeTypes.some(t => p.types.includes(t))) return false
      return true
    })
  }, [places, filter])

  // 知識 tab：地區景點
  const regionPlaces = useMemo(() => {
    if (!expandedRegion) return []
    const region = REGIONS.find(r => r.key === expandedRegion)
    if (!region) return []
    return places.filter(p => region.cities.includes(p.city))
  }, [places, expandedRegion])

  // 知識 tab：類型篩選
  const typePlaces = useMemo(() => {
    if (!activeTypeFilter) return []
    return places.filter(p => p.types.includes(activeTypeFilter))
  }, [places, activeTypeFilter])

  function applyFilter() {
    setFilter({ ...tempFilter })
    setHasFiltered(true)
    setShowFilter(false)
  }

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5" style={{ background: 'linear-gradient(160deg, #A8C5DA 0%, #7B9EBD 45%, #5E85A3 100%)' }}>
        <div className="flex items-center gap-2 text-white mb-4">
          <MapPin size={22} strokeWidth={2.5} />
          <h1 className="text-xl font-black">親子景點</h1>
        </div>
        <div className="flex rounded-2xl p-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
          <button onClick={() => setMainTab('knowledge')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all" style={{ background: mainTab === 'knowledge' ? 'white' : 'transparent', color: mainTab === 'knowledge' ? '#5E85A3' : 'rgba(255,255,255,0.85)' }}>
            <BookOpen size={15} />探索景點
          </button>
          <button onClick={() => setMainTab('records')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all" style={{ background: mainTab === 'records' ? 'white' : 'transparent', color: mainTab === 'records' ? '#5E85A3' : 'rgba(255,255,255,0.85)' }}>
            <SlidersHorizontal size={15} />條件搜尋
          </button>
        </div>
      </div>

      {/* === 探索景點 Tab === */}
      {mainTab === 'knowledge' && (
        <div className="px-5 py-5 space-y-6">

          {/* 景點類型篩選 */}
          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: '#2D3436' }}>依類型探索</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {PLACE_TYPES.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTypeFilter(activeTypeFilter === t.key ? null : t.key)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: activeTypeFilter === t.key ? '#7B9EBD' : 'white',
                    color: activeTypeFilter === t.key ? 'white' : '#6B7B8D',
                    border: `1px solid ${activeTypeFilter === t.key ? '#7B9EBD' : '#E8E0D5'}`,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {/* 類型篩選結果 */}
            {activeTypeFilter && (
              <div className="space-y-3">
                <p className="text-xs" style={{ color: '#8E9EAD' }}>
                  {PLACE_TYPES.find(t => t.key === activeTypeFilter)?.label} · 共 {typePlaces.length} 個景點
                </p>
                {typePlaces.map(place => (
                  <PlaceCard key={place.id} place={place} onSelect={() => setSelectedPlace(place)} />
                ))}
              </div>
            )}
          </section>

          {/* 地區分類瀏覽 */}
          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: '#2D3436' }}>依地區探索</h2>
            <div className="space-y-2">
              {REGIONS.map(r => {
                const count = places.filter(p => r.cities.includes(p.city)).length
                return (
                  <div key={r.key} className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                    <button onClick={() => setExpandedRegion(expandedRegion === r.key ? null : r.key)} className="w-full flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{r.emoji}</span>
                        <div className="text-left">
                          <span className="font-bold text-sm" style={{ color: '#2D3436' }}>{r.label}</span>
                          <span className="text-xs ml-2" style={{ color: '#8E9EAD' }}>{count} 個景點</span>
                        </div>
                      </div>
                      {expandedRegion === r.key ? <ChevronUp size={16} style={{ color: '#8E9EAD' }} /> : <ChevronDown size={16} style={{ color: '#8E9EAD' }} />}
                    </button>
                    {expandedRegion === r.key && (
                      <div className="px-4 pb-4 space-y-3">
                        {regionPlaces.length === 0 ? (
                          <p className="text-xs text-center py-4" style={{ color: '#8E9EAD' }}>此地區尚無推薦景點</p>
                        ) : (
                          regionPlaces.map(place => (
                            <PlaceCard key={place.id} place={place} onSelect={() => setSelectedPlace(place)} />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* 季節推薦 */}
          <section>
            <h2 className="font-bold text-base mb-3" style={{ color: '#2D3436' }}>季節推薦景點</h2>
            <div className="space-y-3">
              {SEASONAL_TIPS.map(s => (
                <div key={s.season} className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: '#E8E0D5' }}>
                  <button onClick={() => setExpandedSeason(expandedSeason === s.season ? null : s.season)} className="w-full flex items-center gap-3 p-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                      <s.icon size={18} style={{ color: s.color }} />
                    </div>
                    <span className="font-bold text-sm flex-1 text-left" style={{ color: '#2D3436' }}>{s.season}</span>
                    {expandedSeason === s.season ? <ChevronUp size={16} style={{ color: '#8E9EAD' }} /> : <ChevronDown size={16} style={{ color: '#8E9EAD' }} />}
                  </button>
                  {expandedSeason === s.season && (
                    <div className="px-4 pb-4">
                      <div className="space-y-1 mb-3 p-3 rounded-xl" style={{ background: s.bg }}>
                        {s.tips.map((tip, i) => <p key={i} className="text-xs leading-relaxed" style={{ color: s.color }}>• {tip}</p>)}
                      </div>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#2D3436' }}>推薦景點</p>
                      <div className="space-y-3">
                        {s.placeIds.map(id => {
                          const place = placesMap.get(id)
                          if (!place) return null
                          return <PlaceCard key={id} place={place} onSelect={() => setSelectedPlace(place)} />
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* === 條件搜尋 Tab === */}
      {mainTab === 'records' && (
        <div className="px-5 py-5 space-y-4">
          {/* 篩選按鈕 */}
          <button
            onClick={() => { setTempFilter({ ...filter }); setShowFilter(true) }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border font-semibold text-sm"
            style={{ background: 'white', borderColor: '#C5D8E8', color: '#5E85A3' }}
          >
            <SlidersHorizontal size={18} />
            設定篩選條件（找到最適合的景點）
          </button>

          {/* 篩選摘要 */}
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: '#8E9EAD' }}>共找到 {filtered.length} 個景點</p>
            {hasFiltered && (
              <button onClick={() => { setFilter(DEFAULT_FILTER); setHasFiltered(false) }} className="text-xs flex items-center gap-1" style={{ color: '#C45A5A' }}>
                <X size={12} />清除篩選
              </button>
            )}
          </div>

          {/* 結果列表 */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🔍</p>
                <p style={{ color: '#8E9EAD' }}>沒有找到符合條件的景點</p>
                <p className="text-xs mt-1" style={{ color: '#8E9EAD' }}>試試放寬篩選條件</p>
              </div>
            ) : (
              filtered.map(place => (
                <PlaceCard key={place.id} place={place} onSelect={() => setSelectedPlace(place)} />
              ))
            )}
          </div>
        </div>
      )}

      {/* 景點詳情 */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedPlace(null)}>
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-black text-xl leading-tight" style={{ color: '#2D3436' }}>{selectedPlace.name}</h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={12} style={{ color: '#8E9EAD' }} />
                  <span className="text-sm" style={{ color: '#8E9EAD' }}>{selectedPlace.city} {selectedPlace.district}</span>
                </div>
              </div>
              <button onClick={() => setSelectedPlace(null)} className="text-xl shrink-0" style={{ color: '#8E9EAD' }}>✕</button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <StarRating value={Math.round(selectedPlace.avg_rating)} size={18} />
              <span className="font-black text-lg" style={{ color: '#2D3436' }}>{selectedPlace.avg_rating.toFixed(1)}</span>
              <span className="text-sm" style={{ color: '#8E9EAD' }}>({selectedPlace.review_count} 則)</span>
              <span className="text-xs px-2 py-1 rounded-lg ml-auto" style={{ background: selectedPlace.is_indoor ? '#EBF4FF' : '#EBF4EB', color: selectedPlace.is_indoor ? '#5E85A3' : '#5A8A5A' }}>
                {selectedPlace.is_indoor ? '🏠 室內' : '🌳 戶外'}
              </span>
            </div>
            {selectedPlace.description && <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7B8D' }}>{selectedPlace.description}</p>}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl p-3" style={{ background: '#EBF4FF' }}>
                <p className="text-xs mb-1" style={{ color: '#8E9EAD' }}>適合年齡</p>
                <p className="font-bold text-sm" style={{ color: '#2D3436' }}>
                  {selectedPlace.suitable_age_min < 12 ? `${selectedPlace.suitable_age_min}個月` : `${Math.floor(selectedPlace.suitable_age_min / 12)}歲`}
                  {' ~ '}
                  {selectedPlace.suitable_age_max >= 144 ? '12歲+' : `${Math.floor(selectedPlace.suitable_age_max / 12)}歲`}
                </p>
              </div>
              {selectedPlace.avg_stay_minutes && (
                <div className="rounded-xl p-3" style={{ background: '#EBF4FF' }}>
                  <p className="text-xs mb-1" style={{ color: '#8E9EAD' }}>建議停留</p>
                  <p className="font-bold text-sm" style={{ color: '#2D3436' }}>{selectedPlace.avg_stay_minutes} 分鐘</p>
                </div>
              )}
            </div>

            {/* 家長實用心得 */}
            {selectedPlace.parentTip && (
              <div className="mb-4 p-4 rounded-2xl" style={{ background: '#FFFBF0', border: '1px solid #F5E6C8' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={14} style={{ color: '#D4956A', fill: '#D4956A' }} />
                  <span className="font-bold text-sm" style={{ color: '#8B6A3E' }}>家長實用心得</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#6B5030' }}>{selectedPlace.parentTip}</p>
              </div>
            )}

            {/* 推薦亮點 */}
            {selectedPlace.highlights.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: '#6B7B8D' }}>推薦亮點</p>
                <div className="space-y-1.5">
                  {selectedPlace.highlights.map(h => (
                    <div key={h} className="flex items-center gap-2">
                      <ThumbsUp size={12} style={{ color: '#7B9EBD' }} />
                      <span className="text-sm" style={{ color: '#2D3436' }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedPlace.features.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: '#6B7B8D' }}>設施特色</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPlace.features.map(f => (
                    <span key={f} className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#EBF4FF', color: '#5E85A3' }}>{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 篩選表單 */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowFilter(false)}>
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black" style={{ color: '#2D3436' }}>篩選條件</h2>
              <button onClick={() => setShowFilter(false)} style={{ color: '#8E9EAD' }}><X size={22} /></button>
            </div>

            {/* 住家縣市 */}
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>住家縣市（選填）</label>
              <select value={tempFilter.city} onChange={e => setTempFilter(f => ({ ...f, city: e.target.value }))} className="w-full h-11 px-4 rounded-2xl border text-sm outline-none" style={{ borderColor: '#E8E0D5', color: '#2D3436' }}>
                <option value="">不限縣市</option>
                {CITIES_ALL.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* 室內外 */}
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>室內 / 戶外</label>
              <div className="flex gap-2">
                {[{ key: 'all', label: '不限' }, { key: 'indoor', label: '🏠 室內' }, { key: 'outdoor', label: '🌳 戶外' }].map(({ key, label }) => (
                  <button key={key} onClick={() => setTempFilter(f => ({ ...f, indoorOutdoor: key as any }))} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: tempFilter.indoorOutdoor === key ? '#7B9EBD' : 'white', color: tempFilter.indoorOutdoor === key ? 'white' : '#6B7B8D', border: `1px solid ${tempFilter.indoorOutdoor === key ? '#7B9EBD' : '#E8E0D5'}` }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 預算 */}
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>預算範圍（可多選）</label>
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map(b => (
                  <button key={b.key} onClick={() => setTempFilter(f => ({ ...f, budget: toggleArray(f.budget, b.key) }))} className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all" style={{ background: tempFilter.budget.includes(b.key) ? '#7B9EBD' : 'white', color: tempFilter.budget.includes(b.key) ? 'white' : '#6B7B8D', border: `1px solid ${tempFilter.budget.includes(b.key) ? '#7B9EBD' : '#E8E0D5'}` }}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 交通方式 */}
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>交通方式（可多選）</label>
              <div className="flex flex-wrap gap-2">
                {TRANSPORT_TYPES.map(t => (
                  <button key={t.key} onClick={() => setTempFilter(f => ({ ...f, transport: toggleArray(f.transport, t.key) }))} className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all" style={{ background: tempFilter.transport.includes(t.key) ? '#7B9EBD' : 'white', color: tempFilter.transport.includes(t.key) ? 'white' : '#6B7B8D', border: `1px solid ${tempFilter.transport.includes(t.key) ? '#7B9EBD' : '#E8E0D5'}` }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 過敏內容 */}
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>孩子過敏內容（可多選）</label>
              <div className="flex flex-wrap gap-2">
                {ALLERGY_OPTIONS.map(a => (
                  <button key={a} onClick={() => setTempFilter(f => ({ ...f, allergies: toggleArray(f.allergies, a) }))} className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all" style={{ background: tempFilter.allergies.includes(a) ? '#C45A5A' : 'white', color: tempFilter.allergies.includes(a) ? 'white' : '#6B7B8D', border: `1px solid ${tempFilter.allergies.includes(a) ? '#C45A5A' : '#E8E0D5'}` }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* 大人/小孩人數 */}
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>出遊人數</label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 rounded-xl border flex items-center justify-between" style={{ borderColor: '#E8E0D5' }}>
                  <span className="text-sm" style={{ color: '#2D3436' }}>大人</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setTempFilter(f => ({ ...f, adultCount: Math.max(1, f.adultCount - 1) }))} className="w-7 h-7 rounded-full border flex items-center justify-center font-bold" style={{ borderColor: '#C5D8E8', color: '#5E85A3' }}>−</button>
                    <span className="font-bold text-base w-4 text-center" style={{ color: '#2D3436' }}>{tempFilter.adultCount}</span>
                    <button onClick={() => setTempFilter(f => ({ ...f, adultCount: f.adultCount + 1 }))} className="w-7 h-7 rounded-full border flex items-center justify-center font-bold" style={{ borderColor: '#C5D8E8', color: '#5E85A3' }}>+</button>
                  </div>
                </div>
                <div className="p-3 rounded-xl border flex items-center justify-between" style={{ borderColor: '#E8E0D5' }}>
                  <span className="text-sm" style={{ color: '#2D3436' }}>小孩</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setTempFilter(f => ({ ...f, children: f.children.length > 0 ? f.children.slice(0, -1) : [] }))} className="w-7 h-7 rounded-full border flex items-center justify-center font-bold" style={{ borderColor: '#C5D8E8', color: '#5E85A3' }}>−</button>
                    <span className="font-bold text-base w-4 text-center" style={{ color: '#2D3436' }}>{tempFilter.children.length}</span>
                    <button onClick={() => setTempFilter(f => ({ ...f, children: [...f.children, { age: '3歲' }] }))} className="w-7 h-7 rounded-full border flex items-center justify-center font-bold" style={{ borderColor: '#C5D8E8', color: '#5E85A3' }}>+</button>
                  </div>
                </div>
              </div>
              {tempFilter.children.length > 0 && (
                <div className="space-y-2">
                  {tempFilter.children.map((child, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5" style={{ color: '#7B9EBD' }}>
                        <Baby size={14} />
                        <span className="text-sm" style={{ color: '#6B7B8D' }}>第 {i + 1} 個孩子</span>
                      </div>
                      <select
                        value={child.age}
                        onChange={e => setTempFilter(f => ({ ...f, children: f.children.map((c, ci) => ci === i ? { ...c, age: e.target.value } : c) }))}
                        className="flex-1 h-9 px-3 rounded-xl border text-sm outline-none"
                        style={{ borderColor: '#E8E0D5', color: '#2D3436' }}
                      >
                        {AGE_OPTIONS.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 景點類型 */}
            <div className="mb-6">
              <label className="text-sm font-semibold block mb-2" style={{ color: '#2D3436' }}>景點類型（可多選）</label>
              <div className="flex flex-wrap gap-2">
                {PLACE_TYPES.map(t => (
                  <button key={t.key} onClick={() => setTempFilter(f => ({ ...f, placeTypes: toggleArray(f.placeTypes, t.key) }))} className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all" style={{ background: tempFilter.placeTypes.includes(t.key) ? '#7B9EBD' : 'white', color: tempFilter.placeTypes.includes(t.key) ? 'white' : '#6B7B8D', border: `1px solid ${tempFilter.placeTypes.includes(t.key) ? '#7B9EBD' : '#E8E0D5'}` }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={applyFilter} className="w-full py-3.5 rounded-2xl font-bold text-base text-white" style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}>
              <Search size={16} className="inline mr-2" />搜尋景點
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
