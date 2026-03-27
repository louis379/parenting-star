import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-200',
      secondary: 'bg-amber-400 text-white hover:bg-amber-500 shadow-sm shadow-amber-200',
      outline: 'border-2 border-orange-300 text-orange-600 hover:bg-orange-50',
      ghost: 'text-orange-600 hover:bg-orange-50',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-11 px-5 text-base',
      lg: 'h-14 px-7 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
