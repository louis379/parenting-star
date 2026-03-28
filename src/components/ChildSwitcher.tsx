'use client'

import { useProfile } from '@/hooks/useProfile'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export function ChildSwitcher() {
  const { children, activeChildId, setActiveChildId, activeChild } = useProfile()

  if (children.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 px-5 py-2.5" style={{ background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #E8E0D5' }}>
        <p className="text-xs text-gray-400">尚未新增小朋友</p>
        <Link
          href="/settings"
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: '#EBF4FF', color: '#5E85A3' }}
        >
          + 新增
        </Link>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-2 px-5 py-2"
      style={{ background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #E8E0D5' }}
    >
      <div className="flex gap-1.5 overflow-x-auto flex-1">
        {children.map(child => {
          const isActive = activeChildId === child.id || (!activeChildId && children[0]?.id === child.id)
          const emoji = child.gender === 'male' ? '👦' : child.gender === 'female' ? '👧' : '🧒'
          return (
            <button
              key={child.id}
              onClick={() => setActiveChildId(child.id)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: isActive ? '#7B9EBD' : '#EBF4FF',
                color: isActive ? 'white' : '#5E85A3',
              }}
            >
              {emoji} {child.nickname}
            </button>
          )
        })}
      </div>
      {children.length > 0 && (
        <Link
          href="/settings"
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: '#EBF4FF' }}
        >
          <Plus size={14} style={{ color: '#7B9EBD' }} />
        </Link>
      )}
    </div>
  )
}

export function useActiveChildId(): string | null {
  const { activeChildId, children } = useProfile()
  return activeChildId || children[0]?.id || null
}
