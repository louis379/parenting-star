import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPTS: Record<string, string> = {
  growth: `你是一個溫暖的育兒成長秘書。分析家長上傳的寶貝照片（可能是寶貝本人、便便、或餐盤），先肯定再給建議，讓家長感到被支持而非焦慮。

分析重點：
- 體型與外觀：臉色、精神、體型比例是否適中
- 動作發展：若能看到肢體，評估協調性和活力
- 飲食營養：若是餐盤照，評估食物種類與營養均衡；若是便便照，評估顏色型態是否正常

語氣要溫暖、正向、具體，像媽媽朋友在聊天，不要過度醫療化。`,

  psychology: `你是一個溫暖的育兒成長秘書。分析家長上傳的寶貝照片中的情緒與心理狀態，先肯定再給建議，讓家長感到被支持而非焦慮。

分析重點：
- 表情情緒：判讀寶貝的情緒狀態（開心、好奇、平靜、緊張等）
- 社交場景：若有互動場景，評估社交發展情況
- 身體語言：放鬆還是緊繃，是否有安全感

語氣要溫暖、正向、具體，像媽媽朋友在聊天，幫助家長了解寶貝內心世界。`,

  education: `你是一個溫暖的育兒成長秘書。分析家長上傳的寶貝照片中的學習與發展狀態，先肯定再給建議，讓家長感到被支持而非焦慮。

分析重點：
- 學習場景：辨識寶貝正在做什麼（玩耍、閱讀、創作、探索等）
- 專注度：評估寶貝的投入程度
- 發展契機：從場景中找到可以延伸的學習機會

語氣要溫暖、正向、具體，像媽媽朋友在聊天，給予實用的親子互動建議。`,
}

const PAGE_LABELS: Record<string, string> = {
  growth: '🏋️ 生長觀察',
  psychology: '😊 情緒觀察',
  education: '📚 學習觀察',
}

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, analysisType } = await req.json()

    if (!imageBase64 || !analysisType) {
      return NextResponse.json({ error: '缺少必要參數' }, { status: 400 })
    }

    const type = analysisType as 'growth' | 'psychology' | 'education'
    const systemPrompt = SYSTEM_PROMPTS[type]
    if (!systemPrompt) {
      return NextResponse.json({ error: '無效的分析類型' }, { status: 400 })
    }

    // 取出 base64 data（去掉 data:image/...;base64, 前綴）
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64
    const mediaTypeMatch = imageBase64.match(/^data:(image\/[^;]+);base64,/)
    const mediaType = (mediaTypeMatch?.[1] ?? 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    const pageLabel = PAGE_LABELS[type]

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `請分析這張照片，並以 JSON 格式回傳（不要加任何 markdown 標記，直接回傳 JSON）：
{
  "positives": ["做得好的地方1", "做得好的地方2"],
  "analysis": {
    "label": "${pageLabel}",
    "items": ["具體觀察1", "具體觀察2", "具體觀察3"]
  },
  "suggestions": ["建議1"],
  "weeklyGoal": "這週的小目標（一句話）",
  "encouragement": "給家長加油打氣的話（一句話）"
}`,
            },
          ],
        },
      ],
    })

    const textBlock = response.content.find(b => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('API 未回傳文字內容')
    }

    let parsed
    try {
      // 嘗試解析 JSON，有時模型會加上 ```json ... ```
      const cleaned = textBlock.text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      throw new Error('無法解析 AI 回傳的 JSON')
    }

    return NextResponse.json({ success: true, result: parsed })
  } catch (error) {
    console.error('analyze-photo error:', error)
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'API Key 無效', fallback: true }, { status: 401 })
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: '請求頻率過高，請稍後再試', fallback: true }, { status: 429 })
    }
    return NextResponse.json({ error: '分析失敗，請稍後再試', fallback: true }, { status: 500 })
  }
}
