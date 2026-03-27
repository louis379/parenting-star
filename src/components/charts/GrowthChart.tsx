'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'
import type { GrowthRecord } from '@/types/database'

// WHO 男孩身高參考 (月齡 → P15, P50, P85)
const WHO_HEIGHT_BOYS: Record<number, [number, number, number]> = {
  0: [46.1, 49.9, 53.7], 3: [57.3, 61.4, 65.5], 6: [63.3, 67.6, 71.9],
  9: [68.0, 72.3, 76.6], 12: [71.7, 75.7, 79.7], 18: [78.4, 82.3, 86.2],
  24: [83.9, 87.8, 91.7], 36: [90.7, 96.1, 101.5], 48: [97.4, 103.3, 109.2],
  60: [103.2, 110.0, 116.8],
}

// WHO 男孩體重參考 (月齡 → P15, P50, P85)
const WHO_WEIGHT_BOYS: Record<number, [number, number, number]> = {
  0: [2.5, 3.3, 4.4], 3: [5.1, 6.4, 7.7], 6: [6.4, 7.9, 9.4],
  9: [7.5, 9.2, 10.9], 12: [8.2, 9.9, 11.6], 18: [9.4, 11.1, 12.8],
  24: [10.3, 12.2, 14.1], 36: [11.8, 14.3, 16.8], 48: [13.4, 16.3, 19.2],
  60: [15.0, 18.3, 21.6],
}

type ChartType = 'height' | 'weight'

interface Props {
  records: GrowthRecord[]
  ageMonths: number
  type: ChartType
  gender?: string
}

function getWHOData(ageMonths: number, type: ChartType) {
  const ref = type === 'height' ? WHO_HEIGHT_BOYS : WHO_WEIGHT_BOYS
  const result: { month: number; p15: number; p50: number; p85: number }[] = []
  const maxMonth = Math.min(Math.ceil(ageMonths) + 6, 60)

  for (const m of Object.keys(ref).map(Number).filter(m => m <= maxMonth)) {
    result.push({ month: m, p15: ref[m][0], p50: ref[m][1], p85: ref[m][2] })
  }
  return result
}

const CustomTooltip = ({ active, payload, label, type }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-orange-100 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-bold text-gray-700 mb-1">{label} 個月</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {entry.value} {type === 'height' ? 'cm' : 'kg'}
        </p>
      ))}
    </div>
  )
}

export function GrowthChart({ records, ageMonths, type, gender }: Props) {
  const whoData = getWHOData(ageMonths, type)

  // 合併實際資料
  const actualData = records
    .filter(r => type === 'height' ? r.height_cm : r.weight_kg)
    .map(r => {
      const birth = new Date()
      // 近似月齡：用測量日計算
      return {
        month: Math.round(ageMonths - (new Date().getTime() - new Date(r.measured_at).getTime()) / (1000 * 60 * 60 * 24 * 30.4)),
        actual: type === 'height' ? r.height_cm : r.weight_kg,
      }
    })

  // 合併 WHO + actual
  const chartData = whoData.map(d => {
    const match = actualData.find(a => Math.abs(a.month - d.month) < 1)
    return { ...d, actual: match?.actual }
  })

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 5, right: 15, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
        <XAxis
          dataKey="month"
          tickFormatter={v => `${v}m`}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          unit={type === 'height' ? 'cm' : 'kg'}
        />
        <Tooltip content={<CustomTooltip type={type} />} />
        <Line type="monotone" dataKey="p85" name="85百分位" stroke="#fed7aa" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
        <Line type="monotone" dataKey="p50" name="50百分位(中位數)" stroke="#fb923c" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="p15" name="15百分位" stroke="#fed7aa" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
        <Line
          type="monotone"
          dataKey="actual"
          name={type === 'height' ? '實際身高' : '實際體重'}
          stroke="#ea580c"
          strokeWidth={2.5}
          dot={{ fill: '#ea580c', r: 4, strokeWidth: 2, stroke: 'white' }}
          connectNulls={false}
        />
        <ReferenceLine x={ageMonths} stroke="#f97316" strokeDasharray="3 3" />
      </LineChart>
    </ResponsiveContainer>
  )
}
