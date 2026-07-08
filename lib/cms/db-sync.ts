import { prisma } from '@/lib/prisma'
import { categories, type CategorySlug, type LocalizedText } from '@/lib/i18n'
import type { Article, AuditEntry, CMSData, Subscriber, User } from './types'
import { readCMSData } from './storage'

const allowedCategorySlugs = new Set<CategorySlug>(
  categories.map((category) => category.slug),
)

const legacyCategoryMap: Record<string, CategorySlug[]> = {
  analytics: ['analytics'],
  culture: ['culture-events'],
  economy: ['business-economy'],
  incidents: ['society'],
  politics: ['politics'],
  society: ['society'],
  sport: ['sport'],
  tech: ['business-economy'],
}

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

function maybeMarkInterview(
  article: Pick<Article, 'title' | 'excerpt' | 'body' | 'tags'>,
  categoriesList: CategorySlug[],
): CategorySlug[] {
  const text = [
    article.title.ru,
    article.title.kk,
    article.excerpt.ru,
    article.excerpt.kk,
    article.body.ru,
    article.body.kk,
    article.tags.join(' '),
  ]
    .join(' ')
    .toLowerCase()

  if (
    !categoriesList.includes('interviews') &&
    ['интервью', 'сұхбат', 'exclusive', 'эксклюзив'].some((pattern) =>
      text.includes(pattern),
    )
  ) {
    return [...categoriesList, 'interviews']
  }

  return categoriesList
}

function normalizeStoredCategories(article: Article): CategorySlug[] {
  const migrated = article.categories.flatMap((slug) => {
    if (allowedCategorySlugs.has(slug)) {
      return [slug]
    }

    return legacyCategoryMap[slug] ?? []
  })

  const deduped = migrated.filter(
    (slug, index, list) => list.indexOf(slug) === index,
  )

  return maybeMarkInterview(article, deduped.length > 0 ? deduped : ['society'])
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

export async function syncCMSData(data: CMSData) {
  const users = data.users.map(normalizeUser)
  const articles = data.articles.map(normalizeArticle)
  const audit = data.audit.map(normalizeAuditEntry)
  const subscribers = data.subscribers.map(normalizeSubscriber)

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

export async function ensureDatabaseBootstrappedFromSnapshot() {
  const [usersCount, articlesCount] = await prisma.$transaction([
    prisma.user.count(),
    prisma.article.count(),
  ])

  if (usersCount > 0 || articlesCount > 0) {
    return false
  }

  const data = await readCMSData()
  await syncCMSData(data)
  return true
}
