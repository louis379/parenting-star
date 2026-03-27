'use client'

import Link from 'next/link'
import { TrendingUp, Brain, BookOpen, School, MapPin, Star } from 'lucide-react'

const sections = [
  {
    href: '/growth',
    icon: TrendingUp,
    title: '生長發展',
    desc: 'WHO 曲線追蹤・里程碑分析・飲食紀錄',
    color: '#7B9EBD',
    bg: '#EBF4FF',
  },
  {
    href: '/psychology',
    icon: Brain,
    title: '心理培養',
    desc: '情緒引導・依附關係・社交力發展',
    color: '#9B8BB4',
    bg: '#F0EBF8',
  },
  {
    href: '/education',
    icon: BookOpen,
    title: '教育發展',
    desc: '語言發展・認知階段・學習建議',
    color: '#7BA87B',
    bg: '#EBF4EB',
  },
  {
    href: '/schools',
    icon: School,
    title: '教育環境',
    desc: '全台學校資料庫・評價・師資・裁罰',
    color: '#D4956A',
    bg: '#FDF0E8',
  },
  {
    href: '/places',
    icon: MapPin,
    title: '親子景點',
    desc: '室內外景點・過敏篩選・交通預算',
    color: '#7BB8A8',
    bg: '#EBF6F2',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF5' }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden px-6 pt-16 pb-14"
        style={{ background: 'linear-gradient(160deg, #A8C5DA 0%, #7B9EBD 45%, #5E85A3 100%)' }}
      >
        {/* 裝飾圓 */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />

        <div className="relative z-10 max-w-sm mx-auto text-center">
          {/* Logo */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 mx-auto"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
          >
            <Star size={38} className="text-white" fill="white" />
          </div>

          <h1 className="text-4xl font-black text-white mb-2 leading-tight tracking-tight">
            育兒智多星
          </h1>
          <p className="text-base font-medium mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
            台灣每個家庭的
          </p>
          <p className="text-2xl font-bold mb-5" style={{ color: '#F5E6C8' }}>
            AI 育兒夥伴
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.80)' }}>
            循證育兒知識 × AI 個人化分析<br />從生長到教育，全方位陪伴成長
          </p>
        </div>
      </div>

      {/* Wave divider */}
      <div className="relative -mt-4 z-10" style={{ background: '#FAFAF5' }}>
        <svg viewBox="0 0 390 28" className="w-full block" preserveAspectRatio="none">
          <path d="M0,14 C100,28 290,0 390,14 L390,28 L0,28 Z" fill="#FAFAF5" />
        </svg>
      </div>

      {/* Five sections */}
      <div className="flex-1 px-5 -mt-6 pb-10" style={{ background: '#FAFAF5' }}>
        <p className="text-center text-sm font-medium mb-4" style={{ color: '#6B7B8D' }}>
          五大核心功能，一站式育兒解決方案
        </p>

        <div className="space-y-3 mb-8">
          {sections.map(({ href, icon: Icon, title, desc, color, bg }) => (
            <div
              key={href}
              className="flex items-center gap-4 p-4 rounded-2xl border"
              style={{ background: 'white', borderColor: '#E8E0D5' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: bg }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm mb-0.5" style={{ color: '#2D3436' }}>
                  {title}
                </h3>
                <p className="text-xs leading-relaxed truncate" style={{ color: '#6B7B8D' }}>
                  {desc}
                </p>
              </div>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: bg }}
              >
                <span className="text-xs" style={{ color }}>›</span>
              </div>
            </div>
          ))}
        </div>

        {/* Evidence badge */}
        <div
          className="rounded-2xl p-4 mb-6 text-center border"
          style={{ background: '#EBF4FF', borderColor: '#C5D8E8' }}
        >
          <div className="text-xs font-medium mb-1" style={{ color: '#5E85A3' }}>
            Cochrane 系統性回顧 × WHO 標準
          </div>
          <div className="text-sm font-bold" style={{ color: '#2D3436' }}>
            所有建議皆基於最高等級實證研究
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href="/onboarding"
            className="block w-full text-center py-4 rounded-2xl font-bold text-white text-base transition-opacity active:opacity-80"
            style={{ background: 'linear-gradient(135deg, #7B9EBD, #5E85A3)' }}
          >
            開始使用（免費）
          </Link>
          <Link
            href="/register"
            className="block w-full text-center py-4 rounded-2xl font-semibold text-base border transition-opacity active:opacity-80"
            style={{ color: '#7B9EBD', borderColor: '#C5D8E8', background: 'white' }}
          >
            建立帳號以儲存資料
          </Link>
          <Link
            href="/login"
            className="block w-full text-center py-3 rounded-2xl font-medium text-sm transition-opacity active:opacity-80"
            style={{ color: '#8E9EAD' }}
          >
            已有帳號？登入
          </Link>
        </div>

        <p className="text-xs text-center mt-4" style={{ color: '#8E9EAD' }}>
          完全免費 · 無需信用卡 · 隨時可刪帳號
        </p>
      </div>
    </div>
  )
}
