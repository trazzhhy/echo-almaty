import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const lang = path.startsWith('/kk') ? 'kk' : 'ru'
  const headers = new Headers(request.headers)
  headers.set('x-echo-almaty-lang', lang)

  return NextResponse.next({
    request: {
      headers,
    },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|icon-dark-32x32.png|icon-light-32x32.png|apple-icon.png).*)'],
}
