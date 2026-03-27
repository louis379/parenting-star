'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrendingUp, Brain, BookOpen, School, MapPin } from 'lucide-react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const navItems = [
  {
    href: '/growth',
    icon: TrendingUp,
    label: '生長',
    color: '#7B9EBD',
    activeColor: '#5E85A3',
  },
  {
    href: '/psychology',
    icon: Brain,
    label: '心理',
    color: '#9B8BB4',
    activeColor: '#7A6A96',
  },
  {
    href: '/education',
    icon: BookOpen,
    label: '教育',
    color: '#7BA87B',
    activeColor: '#5A8A5A',
  },
  {
    href: '/schools',
    icon: School,
    label: '學校',
    color: '#D4956A',
    activeColor: '#B07548',
  },
  {
    href: '/places',
    icon: MapPin,
    label: '景點',
    color: '#7BB8A8',
    activeColor: '#5A9888',
  },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF5' }}>
      <main className="pb-nav max-w-md mx-auto">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{ background: 'white', borderColor: '#E8E0D5' }}
      >
        <div className="max-w-md mx-auto flex">
          {navItems.map(({ href, icon: Icon, label, color, activeColor }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all relative"
                style={{ color: isActive ? activeColor : '#8E9EAD' }}
              >
                {isActive && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{ background: color }}
                  />
                )}
                <Icon
                  size={22}
                  style={{
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    strokeWidth: isActive ? 2.5 : 1.8,
                    transition: 'transform 0.15s',
                  }}
                />
                <span
                  className="text-[10px]"
                  style={{ fontWeight: isActive ? 700 : 500 }}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
        {/* iOS safe area */}
        <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
      </nav>
    </div>
  )
}
