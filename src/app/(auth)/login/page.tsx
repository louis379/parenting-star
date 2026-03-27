'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Baby } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('請輸入有效的 Email'),
  password: z.string().min(6, '密碼至少 6 個字元'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setServerError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setServerError(error.message === 'Invalid login credentials' ? '帳號或密碼錯誤' : error.message)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAF5' }}>
      {/* Header */}
      <div className="gradient-hero text-white px-6 pt-14 pb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-3xl mb-4 backdrop-blur-sm">
          <Baby size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-black">歡迎回來</h1>
        <p className="text-white/75 text-sm mt-1">登入繼續使用育兒智多星</p>
      </div>

      <div className="relative -mt-5 z-10">
        <svg viewBox="0 0 390 24" className="w-full" preserveAspectRatio="none">
          <path d="M0,12 C130,24 260,0 390,12 L390,24 L0,24 Z" fill="#FAFAF5" />
        </svg>
      </div>

      <div className="flex-1 px-6 -mt-1 pb-10 max-w-sm mx-auto w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="relative">
            <Input
              label="密碼"
              type={showPw ? 'text' : 'password'}
              placeholder="至少 6 個字元"
              error={errors.password?.message}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-4 bottom-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPw(!showPw)}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full mt-2" loading={isSubmitting}>
            登入
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          還沒有帳號？{' '}
          <Link href="/register" className="text-[#7B9EBD] font-semibold">
            免費註冊
          </Link>
        </p>
      </div>
    </div>
  )
}
