import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLang, isLang, langCookieName } from '@/lib/i18n'

export function proxy(request: NextRequest) {
  const segment = request.nextUrl.pathname.split('/')[1] ?? ''
  const pathLang = isLang(segment) ? segment : null
  const lang = pathLang ?? defaultLang
  const headers = new Headers(request.headers)
  headers.set('x-echo-almaty-lang', lang)

  const response = NextResponse.next({
    request: {
      headers,
    },
  })

  if (pathLang && request.cookies.get(langCookieName)?.value !== pathLang) {
    response.cookies.set(langCookieName, pathLang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|icon-dark-32x32.png|icon-light-32x32.png|apple-icon.png).*)'],
}
