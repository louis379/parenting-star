'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, MapPin, School, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: '首頁' },
  { href: '/growth', icon: TrendingUp, label: '生長' },
  { href: '/places', icon: MapPin, label: '景點' },
  { href: '/kindergartens', icon: School, label: '幼兒園' },
  { href: '/sos', icon: AlertCircle, label: '急救' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen" style={{ background: '#fffbf5' }}>
      <main className="pb-nav max-w-md mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-100 safe-bottom">
        <div className="max-w-md mx-auto flex">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all',
                  isActive ? 'text-orange-500' : 'text-gray-400 hover:text-orange-400'
                )}
              >
                <Icon
                  size={22}
                  className={cn(
                    'transition-transform',
                    isActive && 'scale-110'
                  )}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                <span className={cn('text-[10px] font-medium', isActive && 'font-bold')}>
                  {label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-500" />
                )}
              </Link>
            )
          })}
        </div>
        {/* iOS safe area */}
        <div className="h-safe-bottom" />
      </nav>
    </div>
  )
}
