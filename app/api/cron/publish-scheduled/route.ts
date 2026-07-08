import { NextResponse } from 'next/server'
import { promoteScheduledArticles } from '@/lib/cms/repository'
import { ensureDatabaseBootstrappedFromSnapshot } from '@/lib/cms/db-sync'
import { getOptionalEnv } from '@/lib/env'

export const runtime = 'nodejs'

function isAuthorized(request: Request) {
  const secret = getOptionalEnv('CRON_SECRET')
  if (!secret) {
    return false
  }

  const authorization = request.headers.get('authorization')
  if (authorization === `Bearer ${secret}`) {
    return true
  }

  return request.headers.get('x-cron-secret') === secret
}

async function handleCronRequest(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await ensureDatabaseBootstrappedFromSnapshot()
  const promoted = await promoteScheduledArticles('cron')

  return NextResponse.json({
    ok: true,
    promoted: promoted.length,
    articles: promoted.map((article) => ({
      id: article.id,
      slug: article.slug,
    })),
  })
}

export async function GET(request: Request) {
  return handleCronRequest(request)
}

export async function POST(request: Request) {
  return handleCronRequest(request)
}
