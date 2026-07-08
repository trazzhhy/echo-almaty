import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { recordArticleView } from '@/lib/cms/repository'

const VIEWER_COOKIE = 'echo_almaty_viewer_id'
const VIEWER_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 365

export const runtime = 'nodejs'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const cookieStore = await cookies()
  const existingViewerId = cookieStore.get(VIEWER_COOKIE)?.value
  const viewerId = existingViewerId ?? randomUUID()
  const result = await recordArticleView(id, viewerId)

  const response = NextResponse.json(
    { ok: true, recorded: result.recorded },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )

  if (!existingViewerId) {
    response.cookies.set(VIEWER_COOKIE, viewerId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: VIEWER_COOKIE_TTL_SECONDS,
    })
  }

  return response
}
