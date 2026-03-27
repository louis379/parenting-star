'use client'

import { useState } from 'react'
import { Heart, ChevronDown, ChevronRight } from 'lucide-react'
import { AppShell } from '@/components/layouts/AppShell'
import { Card } from '@/components/ui/Card'

const TOPICS = [
  {
    id: 'anxiety',
    emoji: '😰',
    title: '新手爸媽常見焦慮',
    color: 'bg-blue-50 border-blue-100',
    titleColor: 'text-blue-800',
    articles: [
      {
        title: '寶寶哭不停怎麼辦？',
        content: `新生兒哭泣是正常的溝通方式，平均每天哭 1-3 小時。遇到哭泣時，可以依序檢查：

**1. 基本需求**
• 肚子餓？試著喂奶
• 尿布濕？換尿布
• 太冷或太熱？調整衣物

**2. 安撫技巧**
• 輕輕搖晃（像在子宮內的動作）
• 發出「嗡嗡」聲（模擬子宮聲音）
• 包緊包巾，給予安全感
• 換個姿勢抱（肚子趴在手臂上）

**3. 允許自己有界限**
如果寶寶持續哭泣讓你感到崩潰，先確保寶寶安全地放在嬰兒床後，去另一個房間冷靜幾分鐘。這不是失職，而是負責任的育兒行為。

記住：嬰兒的哭泣不代表你做錯了。`,
      },
      {
        title: '寶寶睡眠不規律，我快崩潰了',
        content: `新生兒每 2-3 小時就需要哺乳，睡眠片段化是正常的生理需求。通常：

**睡眠發展時間線**
• 0-3 個月：完全無規律，按需哺乳
• 3-4 個月：開始有些規律，可能 3-4 小時一段
• 6 個月後：大多數寶寶夜間可以睡較長片段

**讓父母撐過去的方法**
• 「寶寶睡，爸媽也睡」—不要用這段時間做家務
• 輪班制：夫妻輪流負責夜間育兒
• 接受外援：讓家人幫忙白天看顧，你去補眠
• 建立睡前儀式（洗澡→餵奶→搖搖→睡覺）

最重要的是：這個階段終會過去。`,
      },
    ],
  },
  {
    id: 'stress',
    emoji: '🧘',
    title: '育兒壓力管理',
    color: 'bg-green-50 border-green-100',
    titleColor: 'text-green-800',
    articles: [
      {
        title: '正念育兒：5 分鐘呼吸練習',
        content: `當你感到快要爆發時，試試這個簡單的呼吸練習：

**4-7-8 呼吸法**
1. 用鼻子吸氣 4 秒
2. 閉氣 7 秒
3. 用嘴巴呼氣 8 秒
4. 重複 3-4 次

**每日正念時刻**
• 洗澡時：專注感受水流在身上的觸感
• 餵奶時：觀察寶寶的表情和動作，感恩這份連結
• 睡前：回想今天一件「還好」的小事

**當下停頓練習**
感到壓力時，先暫停，問自己：「這件事 5 年後還重要嗎？」多數育兒焦慮，答案是否定的。`,
      },
      {
        title: '育兒倦怠的自我辨識與應對',
        content: `**育兒倦怠的徵兆**
• 對孩子感到麻木或情感疏離
• 覺得自己做什麼都沒用
• 身體持續疲勞，即使睡了也沒好
• 開始怨恨親子時間

**這不是你的錯，也不代表你是壞父母**

**應對策略**
• 允許自己「夠好就好」，不需要完美
• 分配任務：明確告訴伴侶或家人你需要什麼
• 保留個人時間：每週至少一次 1 小時只屬於自己
• 尋求支持：加入父母支持群組，分享感受

如果情況嚴重，請諮詢心理師或家庭治療師。尋求幫助是勇敢的行為。`,
      },
    ],
  },
  {
    id: 'couple',
    emoji: '💑',
    title: '伴侶溝通技巧',
    color: 'bg-[#F0EBF8] border-[#C5D8E8]',
    titleColor: 'text-[#6B4E8A]',
    articles: [
      {
        title: '孩子出生後，你們的關係改變了嗎？',
        content: `研究顯示，67% 的夫妻在生育後婚姻滿意度下降，這是正常的轉變，不是危機。

**常見衝突點**
• 誰做更多（家務、育兒分工不均）
• 睡眠剝奪導致的情緒爆發
• 性生活減少
• 育兒觀念不同

**改善溝通的方法**

「我訊息」說話法：
- ❌ 「你從來不幫忙！」
- ✅ 「當我一個人應付寶寶時，我覺得很孤單，希望你能多參與。」

**每週家庭會議**
花 15 分鐘：
1. 感謝對方這週做的一件事
2. 討論下週分工
3. 各說一個需要支持的事項`,
      },
      {
        title: '家務與育兒分工清單',
        content: `**建立公平分工的步驟**

1. 列出所有任務（包括「看不見的勞動」）
   • 餵奶/調配方奶
   • 換尿布
   • 洗衣服、折衣服
   • 預約醫療
   • 採買嬰兒用品
   • 安撫寶寶哭泣
   • 追蹤發展里程碑

2. 討論各自的優先順序和能力
3. 定期重新調整（孩子長大，需求改變）

**記住**：不公平的感受要說出來，不要累積。伴侶不是讀心術，清楚表達才能改變。`,
      },
    ],
  },
  {
    id: 'grandparents',
    emoji: '👴👵',
    title: '隔代教養溝通',
    color: 'bg-amber-50 border-amber-100',
    titleColor: 'text-amber-800',
    articles: [
      {
        title: '長輩觀念不同，怎麼說？',
        content: `**常見摩擦點與應對**

**「要給寶寶喝水」**
現代建議：6 個月前純母乳/配方奶，不需額外喂水
應對：「醫生說寶寶還小，腎臟發育未完全，喝太多水會稀釋電解質。等大一點再喝沒關係。」

**「不抱不哭」**
現代建議：嬰兒哭泣是正常溝通，及時回應有助建立安全依附
應對：「我們家的做法是寶寶哭就先抱，這樣他比較有安全感，長大反而更獨立哦。」

**原則**
• 涉及安全問題（趴睡、添加副食品時間）：堅定但溫和地堅持
• 生活習慣（抱不抱、穿多少）：彈性，可以有共識空間

**建立對話的方式**
不是「你錯了，我對了」，而是「讓我們一起看看最新的建議」。`,
      },
      {
        title: '感謝與設立界限並行',
        content: `隔代教養常讓父母陷入感恩與挫折並存的矛盾。

**你可以同時做到**
• 真誠感謝長輩的付出與愛
• 同時溫和地堅持育兒主要決定權

**說話模板**
「謝謝您這麼愛(孩子名字)，我知道您這樣做是為了他好。我這邊想試試另一個方法，如果有問題我們再討論。」

**何時尋求第三方協助**
• 衝突持續且影響夫妻感情
• 長輩行為涉及孩子安全
• 自己無法平靜溝通

家庭諮詢師可以幫助建立所有人都能接受的界限。`,
      },
    ],
  },
  {
    id: 'mindfulness',
    emoji: '🌱',
    title: '正念育兒',
    color: 'bg-teal-50 border-teal-100',
    titleColor: 'text-teal-800',
    articles: [
      {
        title: '什麼是正念育兒？',
        content: `正念育兒不是「更完美的育兒」，而是「帶著覺察的育兒」。

**核心概念**

**1. 活在當下**
不要總是擔心「下一個階段怎麼辦」，珍惜現在與孩子的連結。今天他需要你抱，明天他就會走路了。

**2. 不評判地觀察**
觀察孩子的行為，不要馬上給標籤（「他很難帶」「她太依賴了」）。每個行為背後都有原因。

**3. 接受不完美**
「夠好的父母」（Good enough parent）這個概念由心理學家溫尼考特提出：你不需要完美，只需要足夠好。

**每日正念練習**
• 餵奶時：放下手機，只是看著孩子
• 洗澡時：描述你在做什麼（「我在幫你洗頭」），同時享受這個儀式
• 睡前：在心中說一句感謝，無論今天多艱難`,
      },
      {
        title: '當你對孩子發火後，怎麼修復？',
        content: `每個父母都會對孩子發火。這不代表你是壞父母。

**修復關係的步驟**

**1. 先讓自己平靜**
深呼吸，給自己幾分鐘。你無法在激動時有效溝通。

**2. 向孩子道歉（任何年齡都值得）**
「剛才媽媽/爸爸太大聲了，對不起。你沒有做錯事，是我的情緒沒有控制好。」

**3. 解釋（適合 2 歲以上）**
「我很累，有點不耐煩，但這不是你的錯。」

**4. 給孩子安撫**
擁抱、貼臉，重新建立身體連結。

**5. 反思（給自己的）**
是什麼觸發了你？下次可以有不同的回應嗎？

發火後修復，比從不發火更重要。因為修復過程本身就在教孩子：關係可以被修復，情緒可以被處理。`,
      },
    ],
  },
]

function ArticleItem({ article }: { article: { title: string; content: string } }) {
  const [open, setOpen] = useState(false)

  const lines = article.content.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-bold text-gray-800 mt-3 mb-1">{line.slice(2, -2)}</p>
    }
    if (line.startsWith('• ')) {
      return <p key={i} className="text-sm text-gray-600 pl-4">• {line.slice(2)}</p>
    }
    if (line.startsWith('- ')) {
      return <p key={i} className="text-sm text-gray-600 pl-4">– {line.slice(2)}</p>
    }
    if (line.match(/^\d+\./)) {
      return <p key={i} className="text-sm text-gray-700 font-medium mt-1">{line}</p>
    }
    if (line === '') return <div key={i} className="h-1" />
    return <p key={i} className="text-sm text-gray-600">{line}</p>
  })

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-3 text-left gap-2"
      >
        <span className="text-sm font-semibold text-gray-700">{article.title}</span>
        {open ? <ChevronDown size={16} className="text-gray-400 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="pb-4 space-y-1 pl-1">
          {lines}
        </div>
      )}
    </div>
  )
}

export default function ParentsPage() {
  return (
    <AppShell>
      <div style={{ background: '#FAFAF5' }} className="min-h-screen">
        {/* Header */}
        <div className="gradient-hero text-white px-5 pt-12 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={22} />
            <h1 className="text-xl font-black">家長心態專區</h1>
          </div>
          <p className="text-white/75 text-sm">照顧好自己，才能更好地照顧孩子</p>
        </div>

        <div className="px-5 py-4 space-y-4">
          {TOPICS.map(topic => (
            <Card key={topic.id} className={topic.color}>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{topic.emoji}</span>
                  <h2 className={`font-black text-base ${topic.titleColor}`}>{topic.title}</h2>
                </div>
                <div>
                  {topic.articles.map((article, i) => (
                    <ArticleItem key={i} article={article} />
                  ))}
                </div>
              </div>
            </Card>
          ))}

          {/* 底部勵志語 */}
          <Card className="bg-gradient-to-br from-[#EBF4FF] to-[#F5E6C8] border-[#C5D8E8]">
            <div className="p-4 text-center">
              <p className="text-3xl mb-2">🌟</p>
              <p className="text-[#3D6A8A] font-bold mb-1">你已經做得很好了</p>
              <p className="text-sm text-[#5E85A3] leading-relaxed">
                育兒沒有標準答案，只有適合你們家的答案。每一天你選擇繼續愛孩子，就是最好的育兒。
              </p>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
