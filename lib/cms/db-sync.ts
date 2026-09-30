import { type LocalizedText } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { normalizeStoredCategories } from './categories'
import type { Article, AuditEntry, CMSData, Subscriber, User } from './types'
import { readCMSData } from './storage'

function normalizeText(value: string): string {
  return value.trim()
}

function normalizeTags(values: string[]): string[] {
  return values
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .filter((item, index, list) => list.indexOf(item) === index)
}

function estimateReadMinutes(body: LocalizedText): number {
  const text = `${body.ru} ${body.kk}`.trim()
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 180))
}

function toDate(value?: string | null) {
  return value ? new Date(value) : null
}

function toJson(value: LocalizedText) {
  return {
    ru: normalizeText(value.ru),
    kk: normalizeText(value.kk),
  }
}

function toWorkflowStatus(value: Article['previousStatus']) {
  if (!value) {
    return null
  }

  return value
}

function normalizeUser(user: User) {
  return {
    ...user,
    name: normalizeText(user.name),
    email: normalizeText(user.email).toLowerCase(),
    bio: toJson(user.bio),
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
    lastLoginAt: toDate(user.lastLoginAt),
  }
}

function normalizeArticle(article: Article) {
  const title = toJson(article.title)
  const excerpt = toJson(article.excerpt)
  const body = toJson(article.body)
  const seoTitle = toJson(article.seoTitle)
  const seoDescription = toJson(article.seoDescription)

  return {
    ...article,
    title,
    excerpt,
    body,
    seoTitle,
    seoDescription,
    mainImage: normalizeText(article.mainImage),
    gallery: article.gallery.map(normalizeText).filter(Boolean),
    videoUrls: article.videoUrls.map(normalizeText).filter(Boolean),
    categories: normalizeStoredCategories(article),
    tags: normalizeTags(article.tags),
    sourceName: normalizeText(article.sourceName),
    sourceUrl: normalizeText(article.sourceUrl),
    previousStatus: toWorkflowStatus(article.previousStatus),
    readMinutes: article.readMinutes || estimateReadMinutes(body),
    createdAt: new Date(article.createdAt),
    updatedAt: new Date(article.updatedAt),
    submittedAt: toDate(article.submittedAt),
    reviewedAt: toDate(article.reviewedAt),
    publishedAt: toDate(article.publishedAt),
    scheduledAt: toDate(article.scheduledAt),
    deletedAt: toDate(article.deletedAt),
  }
}

function normalizeAuditEntry(entry: AuditEntry) {
  return {
    ...entry,
    timestamp: new Date(entry.timestamp),
  }
}

function normalizeSubscriber(subscriber: Subscriber) {
  return {
    ...subscriber,
    email: normalizeText(subscriber.email).toLowerCase(),
    createdAt: new Date(subscriber.createdAt),
  }
}

function normalizeSnapshot(data: CMSData) {
  return {
    users: data.users.map(normalizeUser),
    articles: data.articles.map(normalizeArticle),
    audit: data.audit.map(normalizeAuditEntry),
    subscribers: data.subscribers.map(normalizeSubscriber),
  }
}

export async function syncCMSData(data: CMSData) {
  const { users, articles, audit, subscribers } = normalizeSnapshot(data)

  await prisma.$transaction([
    prisma.auditEntry.deleteMany(),
    prisma.subscriber.deleteMany(),
    prisma.article.deleteMany(),
    prisma.user.deleteMany(),
    prisma.user.createMany({ data: users }),
    prisma.article.createMany({ data: articles }),
    prisma.auditEntry.createMany({ data: audit }),
    prisma.subscriber.createMany({ data: subscribers }),
  ])
}

// Arbitrary constant key for the Postgres advisory lock guarding the bootstrap.
const BOOTSTRAP_LOCK_KEY = 7_340_231

async function isDatabaseEmpty(client: Pick<typeof prisma, 'user' | 'article'>) {
  const usersCount = await client.user.count()
  const articlesCount = await client.article.count()
  return usersCount === 0 && articlesCount === 0
}

async function bootstrapIfEmpty() {
  if (!(await isDatabaseEmpty(prisma))) {
    return false
  }

  const { users, articles, audit, subscribers } = normalizeSnapshot(await readCMSData())

  // Several requests (or build workers, or serverless instances) can see the
  // empty database at once. The transaction-scoped advisory lock lets only one
  // of them seed; the others wait, re-check, and find the data already there.
  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRawUnsafe(`SELECT pg_advisory_xact_lock(${BOOTSTRAP_LOCK_KEY})`)

      if (!(await isDatabaseEmpty(tx))) {
        return false
      }

      await tx.user.createMany({ data: users })
      await tx.article.createMany({ data: articles })
      await tx.auditEntry.createMany({ data: audit })
      await tx.subscriber.createMany({ data: subscribers })
      return true
    },
    { maxWait: 20_000, timeout: 30_000 },
  )
}

let bootstrapInFlight: Promise<boolean> | null = null

/**
 * Seeds an empty database from data/cms.json. Safe to call concurrently:
 * callers in the same process share one run, and the advisory lock above
 * serializes runs across processes.
 */
export function ensureDatabaseBootstrappedFromSnapshot() {
  bootstrapInFlight ??= bootstrapIfEmpty().finally(() => {
    bootstrapInFlight = null
  })
  return bootstrapInFlight
}
