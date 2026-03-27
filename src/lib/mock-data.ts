/**
 * 靜態 seed data — 當 Supabase 查詢失敗（table 不存在）時使用
 */

export interface MockPlace {
  id: string
  name: string
  city: string
  district: string
  address: string
  lat: number
  lng: number
  place_type: string[]
  suitable_age_min: number
  suitable_age_max: number
  is_indoor: boolean
  mosquito_risk_level: number
  features: string[]
  avg_stay_minutes: number
  avg_rating: number
  review_count: number
  description: string
  is_trending: boolean
  created_at: string
}

export interface MockKindergarten {
  id: string
  name: string
  city: string
  district: string
  address: string
  lat: number
  lng: number
  phone: string
  type: string
  teaching_method: string[]
  student_teacher_ratio: number
  capacity: number
  monthly_fee: number
  registration_fee: number
  extended_care_fee: number
  material_fee: number
  features: Record<string, unknown>
  description: string
  created_at: string
}

export const MOCK_PLACES: MockPlace[] = [
  {
    id: 'mock-place-1',
    name: '國立臺灣科學教育館',
    city: '台北市', district: '士林區', address: '台北市士林區士商路189號',
    lat: 25.0968, lng: 121.5140,
    place_type: ['科學館', '室內'],
    suitable_age_min: 24, suitable_age_max: 144,
    is_indoor: true, mosquito_risk_level: 1,
    features: ['互動展覽', '科學實驗', '親子活動', '哺乳室'],
    avg_stay_minutes: 180, avg_rating: 4.3, review_count: 245,
    description: '全台最大科學教育館，有豐富的互動展覽，孩子可以動手做實驗，非常適合學齡前到國小的孩子',
    is_trending: true, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-place-2',
    name: '臺北市立動物園',
    city: '台北市', district: '文山區', address: '台北市文山區新光路二段30號',
    lat: 24.9993, lng: 121.5806,
    place_type: ['動物園', '戶外'],
    suitable_age_min: 6, suitable_age_max: 144,
    is_indoor: false, mosquito_risk_level: 2,
    features: ['動物觀賞', '纜車', '兒童動物區', '哺乳室', '餐廳'],
    avg_stay_minutes: 240, avg_rating: 4.5, review_count: 892,
    description: '台灣最大動物園，有兒童動物區、無尾熊館，附近有貓纜可搭，適合全年齡孩子',
    is_trending: true, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-place-3',
    name: '臺北市兒童新樂園',
    city: '台北市', district: '士林區', address: '台北市士林區承德路五段55號',
    lat: 25.0923, lng: 121.5133,
    place_type: ['遊樂園', '室內外'],
    suitable_age_min: 12, suitable_age_max: 120,
    is_indoor: false, mosquito_risk_level: 1,
    features: ['遊樂設施', '兒童遊樂場', '旋轉木馬', '室內設施'],
    avg_stay_minutes: 180, avg_rating: 4.2, review_count: 567,
    description: '專為兒童設計的主題遊樂園，設施適合12個月到10歲孩子，安全有趣',
    is_trending: true, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-place-4',
    name: '大安森林公園',
    city: '台北市', district: '大安區', address: '台北市大安區新生南路二段1號',
    lat: 25.0294, lng: 121.5358,
    place_type: ['公園', '戶外'],
    suitable_age_min: 0, suitable_age_max: 144,
    is_indoor: false, mosquito_risk_level: 2,
    features: ['草地', '兒童遊具', '音樂廣場', '餐廳'],
    avg_stay_minutes: 120, avg_rating: 4.4, review_count: 423,
    description: '台北市中心的大型公園，有寬闊草地和兒童遊具，適合各年齡孩子野餐玩耍',
    is_trending: false, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-place-5',
    name: '新北市兒童藝術館',
    city: '新北市', district: '板橋區', address: '新北市板橋區縣民大道二段6號',
    lat: 25.0111, lng: 121.4630,
    place_type: ['藝術館', '室內'],
    suitable_age_min: 0, suitable_age_max: 72,
    is_indoor: true, mosquito_risk_level: 1,
    features: ['親子藝術', '互動裝置', '表演廳', '哺乳室'],
    avg_stay_minutes: 120, avg_rating: 4.4, review_count: 198,
    description: '專為0-6歲設計的藝術體驗空間，以感官探索為主軸',
    is_trending: true, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-place-6',
    name: '日月潭',
    city: '南投縣', district: '魚池鄉', address: '南投縣魚池鄉中山路',
    lat: 23.8618, lng: 120.9177,
    place_type: ['湖泊', '戶外'],
    suitable_age_min: 12, suitable_age_max: 144,
    is_indoor: false, mosquito_risk_level: 2,
    features: ['遊船', '環湖步道', '原住民文化', '自行車道'],
    avg_stay_minutes: 240, avg_rating: 4.6, review_count: 1234,
    description: '台灣最大高山湖泊，搭船遊湖、環湖步道都很適合親子同遊',
    is_trending: true, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-place-7',
    name: '奇美博物館',
    city: '台南市', district: '仁德區', address: '台南市仁德區文華路一段66號',
    lat: 22.9556, lng: 120.2566,
    place_type: ['博物館', '室內'],
    suitable_age_min: 36, suitable_age_max: 144,
    is_indoor: true, mosquito_risk_level: 1,
    features: ['藝術展覽', '音樂展示', '希臘建築', '兒童探索'],
    avg_stay_minutes: 180, avg_rating: 4.8, review_count: 1567,
    description: '台灣最美麗的私立博物館，希臘式建築令人驚嘆，有豐富的藝術典藏',
    is_trending: true, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-place-8',
    name: '阿里山國家森林遊樂區',
    city: '嘉義縣', district: '阿里山鄉', address: '嘉義縣阿里山鄉香林村',
    lat: 23.5141, lng: 120.8026,
    place_type: ['森林', '高山'],
    suitable_age_min: 36, suitable_age_max: 144,
    is_indoor: false, mosquito_risk_level: 1,
    features: ['森林步道', '小火車', '雲海', '神木'],
    avg_stay_minutes: 480, avg_rating: 4.7, review_count: 2156,
    description: '台灣最著名的森林遊樂區，搭小火車、看雲海、拜訪千年神木',
    is_trending: true, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-place-9',
    name: '屏東國立海洋生物博物館',
    city: '屏東縣', district: '車城鄉', address: '屏東縣車城鄉後灣村後灣路2號',
    lat: 22.0221, lng: 120.7057,
    place_type: ['海洋館', '室內'],
    suitable_age_min: 0, suitable_age_max: 144,
    is_indoor: true, mosquito_risk_level: 2,
    features: ['海底隧道', '鯨鯊', '海洋生態', '住宿體驗'],
    avg_stay_minutes: 240, avg_rating: 4.8, review_count: 2134,
    description: '台灣最頂級海洋館，90米長的海底隧道讓你與鯨鯊同游，更有住宿體驗',
    is_trending: true, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-place-10',
    name: '國立傳統藝術中心',
    city: '宜蘭縣', district: '五結鄉', address: '宜蘭縣五結鄉季新村五濱路二段201號',
    lat: 24.6683, lng: 121.8244,
    place_type: ['藝術中心', '戶外'],
    suitable_age_min: 12, suitable_age_max: 144,
    is_indoor: false, mosquito_risk_level: 2,
    features: ['傳統工藝', 'DIY體驗', '表演', '老街'],
    avg_stay_minutes: 240, avg_rating: 4.5, review_count: 789,
    description: '保存台灣傳統文化的活態園區，可以學習布袋戲、歌仔戲等傳統技藝',
    is_trending: true, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-place-11',
    name: '彩虹眷村',
    city: '台中市', district: '南屯區', address: '台中市南屯區春安路56巷',
    lat: 24.1291, lng: 120.6462,
    place_type: ['藝術村', '戶外'],
    suitable_age_min: 12, suitable_age_max: 144,
    is_indoor: false, mosquito_risk_level: 1,
    features: ['彩色壁畫', '打卡景點', '步行遊覽'],
    avg_stay_minutes: 60, avg_rating: 4.3, review_count: 567,
    description: '充滿繽紛色彩的藝術眷村，老爺爺的彩繪故事讓孩子驚喜',
    is_trending: true, created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-place-12',
    name: '高雄市立海洋科技博物館',
    city: '高雄市', district: '楠梓區', address: '高雄市楠梓區高楠公路1號',
    lat: 22.7257, lng: 120.3175,
    place_type: ['海洋館', '室內'],
    suitable_age_min: 12, suitable_age_max: 144,
    is_indoor: true, mosquito_risk_level: 1,
    features: ['海洋生態', '海底隧道', '互動展覽', '鯊魚水族'],
    avg_stay_minutes: 180, avg_rating: 4.5, review_count: 678,
    description: '海底隧道讓孩子彷彿置身深海，認識台灣豐富的海洋生態',
    is_trending: true, created_at: '2024-01-01T00:00:00Z',
  },
]

export const MOCK_KINDERGARTENS: MockKindergarten[] = [
  {
    id: 'mock-kg-1',
    name: '台北市立南海實驗幼兒園',
    city: '台北市', district: '中正區', address: '台北市中正區南海路41號',
    lat: 25.0319, lng: 121.5148, phone: '02-2392-1380',
    type: '公立', teaching_method: ['主題教學', '探索學習'],
    student_teacher_ratio: 8.0, capacity: 120,
    monthly_fee: 3200, registration_fee: 0, extended_care_fee: 1500, material_fee: 800,
    features: { 特色: ['政府補助', '公立師資', '安全環境'], 認證: ['教育部立案'] },
    description: '台北市立模範幼兒園，主題式探索學習，公立收費親民',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-kg-2',
    name: '新北市立板橋幼兒園',
    city: '新北市', district: '板橋區', address: '新北市板橋區府中路1號',
    lat: 25.0130, lng: 121.4619, phone: '02-2965-8088',
    type: '公立', teaching_method: ['角落教學', '生活教育'],
    student_teacher_ratio: 7.5, capacity: 150,
    monthly_fee: 2800, registration_fee: 0, extended_care_fee: 1200, material_fee: 600,
    features: { 特色: ['鄰近捷運', '大操場', '游泳課'] },
    description: '新北市立優質幼兒園，有大型戶外活動空間，鄰近板橋捷運站',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-kg-3',
    name: '台北美國學校附設幼兒園',
    city: '台北市', district: '士林區', address: '台北市士林區德行西路800號',
    lat: 25.0970, lng: 121.5252, phone: '02-2873-9900',
    type: '私立', teaching_method: ['雙語教學', '蒙特梭利', '專案學習'],
    student_teacher_ratio: 6.0, capacity: 80,
    monthly_fee: 45000, registration_fee: 20000, extended_care_fee: 8000, material_fee: 3000,
    features: { 特色: ['純英語環境', '外籍師資', '國際課程'], 語言: ['英文'] },
    description: '全英語沉浸式幼兒教育，師資來自英美澳，培養雙語能力，費用較高',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-kg-4',
    name: '愛彌兒托嬰中心附設幼兒園',
    city: '台中市', district: '南屯區', address: '台中市南屯區大墩南路282號',
    lat: 24.1289, lng: 120.6454, phone: '04-2320-1234',
    type: '私立', teaching_method: ['創意課程', '音樂律動', '自然探索'],
    student_teacher_ratio: 8.0, capacity: 100,
    monthly_fee: 18000, registration_fee: 10000, extended_care_fee: 3500, material_fee: 2000,
    features: { 特色: ['藝術教育', '音樂課', '烹飪課'], 認證: ['優良私立幼兒園'] },
    description: '以藝術與創意著稱，音樂和美術課程豐富，在台中口碑優良',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-kg-5',
    name: '台南蒙特梭利實驗幼兒園',
    city: '台南市', district: '東區', address: '台南市東區長榮路三段109號',
    lat: 22.9894, lng: 120.2126, phone: '06-208-9012',
    type: '私立', teaching_method: ['蒙特梭利'],
    student_teacher_ratio: 6.0, capacity: 60,
    monthly_fee: 22000, registration_fee: 15000, extended_care_fee: 4000, material_fee: 2500,
    features: { 特色: ['AMI認證師資', '蒙特梭利教具', '混齡班級'], 認證: ['AMI國際認證'] },
    description: '台南第一所AMI認證蒙特梭利幼兒園，強調孩子自主學習和專注力培養',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-kg-6',
    name: '桃園華德福實驗教育機構',
    city: '桃園市', district: '龜山區', address: '桃園市龜山區文化一路200號',
    lat: 25.0367, lng: 121.3456, phone: '03-319-5678',
    type: '私立', teaching_method: ['華德福'],
    student_teacher_ratio: 6.5, capacity: 45,
    monthly_fee: 25000, registration_fee: 12000, extended_care_fee: 4500, material_fee: 3000,
    features: { 特色: ['自然材料', '四季節慶', '手工藝', '音樂戲劇'], 認證: ['華德福協會認證'] },
    description: '依循魯道夫史代納華德福教育理念，重視藝術、自然和靈性發展',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-kg-7',
    name: '新北市非營利永和幼兒園',
    city: '新北市', district: '永和區', address: '新北市永和區環河西路一段162號',
    lat: 25.0131, lng: 121.5120, phone: '02-2231-6789',
    type: '非營利', teaching_method: ['主題式學習', '社區融合', '多元文化'],
    student_teacher_ratio: 7.0, capacity: 90,
    monthly_fee: 8500, registration_fee: 2000, extended_care_fee: 2000, material_fee: 1000,
    features: { 特色: ['非營利收費', '社區親子活動', '多元文化'] },
    description: '非營利幼兒園，費用介於公私立之間，提供優質且平價的教育',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mock-kg-8',
    name: '高雄市立苓洲幼兒園',
    city: '高雄市', district: '苓雅區', address: '高雄市苓雅區武廟路62號',
    lat: 22.6267, lng: 120.3152, phone: '07-224-5678',
    type: '公立', teaching_method: ['生活教育', '本土語言', '體能發展'],
    student_teacher_ratio: 8.5, capacity: 100,
    monthly_fee: 2500, registration_fee: 0, extended_care_fee: 1000, material_fee: 500,
    features: { 特色: ['台語教學', '體能課', '在地文化'] },
    description: '高雄市立優質幼兒園，重視本土語言傳承和體能發展',
    created_at: '2024-01-01T00:00:00Z',
  },
]
