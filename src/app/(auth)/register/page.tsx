'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Baby } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  displayName: z.string().min(2, '暱稱至少 2 個字').max(20, '暱稱最多 20 個字'),
  email: z.string().email('請輸入有效的 Email'),
  password: z.string().min(6, '密碼至少 6 個字元'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: '兩次密碼不一致',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setServerError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { display_name: data.displayName },
      },
    })
    if (error) {
      setServerError(
        error.message.includes('already registered') ? '此 Email 已被註冊' : error.message
      )
      return
    }
    setSuccess(true)
    setTimeout(() => router.push('/onboarding'), 1500)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fffbf5' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">註冊成功！</h2>
          <p className="text-gray-500">正在前往設定你的育兒資料…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#fffbf5' }}>
      <div className="gradient-hero text-white px-6 pt-14 pb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-3xl mb-4 backdrop-blur-sm">
          <Baby size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-black">建立你的帳號</h1>
        <p className="text-orange-100 text-sm mt-1">開始你的個性化育兒之旅</p>
      </div>

      <div className="relative -mt-5 z-10">
        <svg viewBox="0 0 390 24" className="w-full" preserveAspectRatio="none">
          <path d="M0,12 C130,24 260,0 390,12 L390,24 L0,24 Z" fill="#fffbf5" />
        </svg>
      </div>

      <div className="flex-1 px-6 -mt-1 pb-10 max-w-sm mx-auto w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="你的暱稱"
            placeholder="怎麼稱呼你？"
            error={errors.displayName?.message}
            {...register('displayName')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="密碼"
            type="password"
            placeholder="至少 6 個字元"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="確認密碼"
            type="password"
            placeholder="再輸入一次密碼"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full mt-2" loading={isSubmitting}>
            建立帳號
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          已有帳號？{' '}
          <Link href="/login" className="text-orange-500 font-semibold">
            立即登入
          </Link>
        </p>
      </div>
    </div>
  )
}
