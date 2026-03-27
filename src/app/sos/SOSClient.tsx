'use client'

import { useState } from 'react'
import { AlertCircle, Heart, Wind, Phone, BookOpen, Coffee } from 'lucide-react'
import { cn } from '@/lib/utils'

const CRISIS_CARDS = [
  {
    id: 'breathe',
    icon: Wind,
    title: '先深呼吸',
    subtitle: '60秒呼吸法',
    color: 'from-blue-100 to-sky-50',
    iconColor: 'text-blue-500',
    content: '4-7-8 呼吸法：吸氣 4 秒 → 憋氣 7 秒 → 吐氣 8 秒。重複 3-4 次，啟動副交感神經系統，快速平靜焦慮。',
    steps: ['鼻子吸氣 4 秒（感受腹部膨脹）', '憋住氣息 7 秒（不用太精準）', '嘴巴緩緩吐氣 8 秒', '重複 3-4 次'],
  },
  {
    id: 'affirmation',
    icon: Heart,
    title: '你已經很棒了',
    subtitle: '育兒正念提醒',
    color: 'from-rose-100 to-pink-50',
    iconColor: 'text-rose-500',
    content: '帶孩子真的很辛苦，疲憊不代表你不愛孩子，崩潰也不代表你是壞父母。你願意尋求幫助，本身就是很勇敢的事。',
    steps: [
      '我今天已經盡力了',
      '孩子需要的不是完美父母，而是夠好的父母',
      '尋求幫助是智慧，不是軟弱',
      '明天的我會更好',
    ],
  },
  {
    id: 'timeout',
    icon: Coffee,
    title: '爸媽充電站',
    subtitle: '5分鐘自我照顧',
    color: 'from-amber-100 to-yellow-50',
    iconColor: 'text-amber-500',
    content: '短暫離開是合理的。把孩子放在安全的地方，給自己 5 分鐘喝杯水、深呼吸、做幾個拉伸動作。',
    steps: ['確認孩子在安全環境', '走到另一個房間', '喝一杯水（慢慢喝）', '做 3 個深呼吸後再回去'],
  },
  {
    id: 'resources',
    icon: Phone,
    title: '求助資源',
    subtitle: '台灣育兒支持專線',
    color: 'from-green-100 to-emerald-50',
    iconColor: 'text-green-500',
    content: '你不必一個人扛，台灣有許多支持資源：',
    steps: [
      '婦幼保護專線：113（24小時）',
      '安心專線：1925（24小時心理支持）',
      '家庭支持服務：1966',
      '各縣市家庭教育中心：免費諮詢',
    ],
  },
]

const AFFIRMATIONS = [
  '你是孩子最好的父母，因為你是專屬於他的那一個。',
  '不完美的父母，仍然可以養出心理健康的孩子。',
  '睡眠不足會讓任何人都失去耐心，這是生理事實，不是你的錯。',
  '你今天的崩潰，不會毀掉孩子的一生。',
  '尋求幫助需要勇氣，你很勇敢。',
  '每一個孩子都需要父母偶爾喘口氣，這讓你成為更好的照顧者。',
]

export default function SOSClient() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [affirmIdx, setAffirmIdx] = useState(0)
  const [breathing, setBreathing] = useState(false)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [breathCount, setBreathCount] = useState(0)

  function nextAffirmation() {
    setAffirmIdx(i => (i + 1) % AFFIRMATIONS.length)
  }

  function startBreathing() {
    setBreathing(true)
    setBreathPhase('inhale')
    setBreathCount(0)
    // 4-7-8 pattern
    let count = 0
    const cycle = () => {
      setBreathPhase('inhale')
      setTimeout(() => {
        setBreathPhase('hold')
        setTimeout(() => {
          setBreathPhase('exhale')
          setTimeout(() => {
            count++
            setBreathCount(count)
            if (count < 4) cycle()
            else setBreathing(false)
          }, 8000)
        }, 7000)
      }, 4000)
    }
    cycle()
  }

  const PHASE_LABELS = { inhale: '吸氣...', hold: '憋住...', exhale: '吐氣...' }
  const PHASE_COLORS = { inhale: 'bg-blue-500', hold: 'bg-purple-500', exhale: 'bg-sky-400' }

  return (
    <div style={{ background: '#fffbf5' }} className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white px-5 pt-12 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={22} />
          <h1 className="text-xl font-black">崩潰急救站</h1>
        </div>
        <p className="text-rose-100 text-sm">沒關係，每個父母都有崩潰的時候</p>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Affirmation card */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-2xl p-5">
          <p className="text-sm font-semibold text-rose-800 mb-2">給你的話</p>
          <p className="text-gray-700 leading-relaxed font-medium mb-4">
            "{AFFIRMATIONS[affirmIdx]}"
          </p>
          <button
            onClick={nextAffirmation}
            className="text-xs text-rose-500 font-semibold"
          >
            換一句 →
          </button>
        </div>

        {/* Breathing exercise */}
        {!breathing ? (
          <button
            onClick={startBreathing}
            className="w-full bg-gradient-to-br from-blue-500 to-sky-600 text-white rounded-2xl p-5 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Wind size={24} />
              </div>
              <div>
                <p className="font-bold text-lg">開始 4-7-8 呼吸法</p>
                <p className="text-blue-100 text-sm">4 組深呼吸，幫你快速平靜</p>
              </div>
            </div>
          </button>
        ) : (
          <div className="bg-gradient-to-br from-blue-500 to-sky-600 text-white rounded-2xl p-6 text-center">
            <div className={`w-20 h-20 rounded-full ${PHASE_COLORS[breathPhase]} mx-auto mb-4 flex items-center justify-center text-2xl font-black transition-all duration-1000`}>
              {breathPhase === 'inhale' ? '↑' : breathPhase === 'hold' ? '•' : '↓'}
            </div>
            <p className="text-xl font-black mb-1">{PHASE_LABELS[breathPhase]}</p>
            <p className="text-blue-100 text-sm">{breathCount + 1} / 4 組</p>
          </div>
        )}

        {/* Crisis cards */}
        <h2 className="font-bold text-gray-700">急救工具包</h2>
        <div className="space-y-3">
          {CRISIS_CARDS.map(card => {
            const Icon = card.icon
            const isOpen = expanded === card.id
            return (
              <div key={card.id} className="overflow-hidden rounded-2xl border border-orange-100 bg-white">
                <button
                  onClick={() => setExpanded(isOpen ? null : card.id)}
                  className={cn('w-full p-4 text-left flex items-center gap-3', isOpen && `bg-gradient-to-r ${card.color}`)}
                >
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm', isOpen && 'shadow-none')}>
                    <Icon size={22} className={card.iconColor} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{card.title}</p>
                    <p className="text-xs text-gray-500">{card.subtitle}</p>
                  </div>
                  <span className={cn('text-gray-400 transition-transform', isOpen && 'rotate-90')}>›</span>
                </button>

                {isOpen && (
                  <div className={`px-4 pb-4 bg-gradient-to-b ${card.color}`}>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{card.content}</p>
                    <div className="space-y-2">
                      {card.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-0.5', card.iconColor.replace('text-', 'bg-'))}>
                            {i + 1}
                          </div>
                          <p className="text-sm text-gray-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Support message */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5 text-center">
          <p className="text-2xl mb-2">💛</p>
          <p className="text-sm text-amber-800 font-medium leading-relaxed">
            育兒是世界上最難的工作之一。<br />
            你每天的付出都很有意義。
          </p>
        </div>
      </div>
    </div>
  )
}
