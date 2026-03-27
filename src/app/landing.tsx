'use client'

import Link from 'next/link'
import { Baby, TrendingUp, MapPin, School, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const features = [
  { icon: TrendingUp, title: '生長分析', desc: 'AI 對比 WHO 標準，即時偵測成長偏差' },
  { icon: MapPin, title: '景點推薦', desc: '依孩子體質篩選，過敏蚊蟲都考慮進去' },
  { icon: School, title: '幼兒園查詢', desc: '全台結構化資料，費用評價一目了然' },
  { icon: Shield, title: '崩潰急救', desc: '父母喘息站，情緒支援隨時在線' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="gradient-hero text-white px-6 pt-16 pb-20 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="relative z-10 max-w-sm mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-5 backdrop-blur-sm">
            <Baby size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black mb-3 leading-tight">
            育兒智多星
          </h1>
          <p className="text-lg text-orange-100 leading-relaxed mb-2">
            台灣每個家庭的
          </p>
          <p className="text-2xl font-bold text-yellow-200 mb-6">
            AI 育兒夥伴
          </p>
          <p className="text-sm text-orange-100 leading-relaxed">
            不只是工具，是能理解你家孩子<br />獨特性的智慧助手
          </p>
        </div>
      </div>

      {/* Wave divider */}
      <div className="relative -mt-6 z-10">
        <svg viewBox="0 0 390 32" className="w-full" preserveAspectRatio="none">
          <path d="M0,16 C130,32 260,0 390,16 L390,32 L0,32 Z" fill="#fffbf5" />
        </svg>
      </div>

      {/* Features */}
      <div className="flex-1 px-5 -mt-2 pb-10" style={{ background: '#fffbf5' }}>
        <h2 className="text-center text-lg font-bold text-gray-700 mb-5">
          為什麼選擇育兒智多星？
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-warm p-4">
              <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center mb-3">
                <Icon size={20} className="text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6 text-center">
          <div className="text-3xl font-black text-orange-500 mb-1">10,000+</div>
          <div className="text-sm text-gray-600">台灣家庭信賴使用</div>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link href="/register" className="block">
            <Button size="lg" className="w-full">
              免費開始使用
            </Button>
          </Link>
          <Link href="/login" className="block">
            <Button variant="outline" size="lg" className="w-full">
              已有帳號？登入
            </Button>
          </Link>
        </div>

        <p className="text-xs text-center text-gray-400 mt-4">
          完全免費 · 無需信用卡 · 隨時可刪帳號
        </p>
      </div>
    </div>
  )
}
