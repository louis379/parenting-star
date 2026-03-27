import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const { pathname } = url

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isOnboarding = pathname.startsWith('/onboarding')
  const isPublic = pathname === '/'
  const isApiRoute = pathname.startsWith('/api/')

  // 未登入 → 導向 /login（排除公開頁與 API routes）
  if (!user && !isPublic && !isAuthPage && !isApiRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 已登入且在 auth 頁面 → 導向 /dashboard
  if (user && isAuthPage) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // 已登入、在受保護路由 → 檢查是否已完成 onboarding
  if (user && !isPublic && !isAuthPage && !isOnboarding && !isApiRoute) {
    const onboarded = request.cookies.get('ps_onboarded')?.value === '1'

    if (!onboarded) {
      // 查詢是否有 family_members 記錄
      const { count } = await supabase
        .from('family_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (!count) {
        // 尚未完成 onboarding → 導向 /onboarding
        url.pathname = '/onboarding'
        return NextResponse.redirect(url)
      }

      // 已完成 onboarding → 設置 cookie 避免後續重複查詢
      supabaseResponse.cookies.set('ps_onboarded', '1', {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
      })
    }
  }

  return supabaseResponse
}
