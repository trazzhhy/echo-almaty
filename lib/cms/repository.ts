import { randomUUID } from 'node:crypto'
import type { Article as DbArticle, AuditEntry as DbAuditEntry, Prisma, Subscriber as DbSubscriber, User as DbUser } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { categories, getCategoryBySlug, localize, type CategorySlug, type Lang, type LocalizedText } from '@/lib/i18n'
import { ensureDatabaseBootstrappedFromSnapshot } from './db-sync'
import type {
  Article,
  ArticleStatus,
  AuditEntry,
  AuthUser,
  CMSData,
  SaveArticleInput,
  Subscriber,
  User,
} from './types'

export type PublicArticleSort = 'newest' | 'oldest' | 'popular'
export type PopularWindow = '24h' | '7d'
type PromoteScheduledSource = 'cron' | 'runtime'

export type PublicArticleFilterOptions = {
  query?: string
  category?: string
  authorId?: string
  sort?: PublicArticleSort
  tag?: string
  year?: number
  month?: number
  showOnHomeOnly?: boolean
}

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

const VIEW_DEDUP_WINDOW_MS = 6 * 60 * 60 * 1000

function normalizeText(value: string): string {
  return value.trim()
}

function normalizeTags(values: string[]): string[] {
  return values
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .filter((item, index, list) => list.indexOf(item) === index)
}

function estimateReadMinutes(body: { ru: string; kk: string }): number {
  const text = `${body.ru} ${body.kk}`.trim()
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 180))
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9а-яёқңғүұһәі\s-]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[а]/g, 'a')
    .replace(/[ә]/g, 'a')
    .replace(/[б]/g, 'b')
    .replace(/[в]/g, 'v')
    .replace(/[г]/g, 'g')
    .replace(/[ғ]/g, 'g')
    .replace(/[д]/g, 'd')
    .replace(/[её]/g, 'e')
    .replace(/[ж]/g, 'zh')
    .replace(/[з]/g, 'z')
    .replace(/[иі]/g, 'i')
    .replace(/[й]/g, 'y')
    .replace(/[кқ]/g, 'k')
    .replace(/[л]/g, 'l')
    .replace(/[м]/g, 'm')
    .replace(/[нң]/g, 'n')
    .replace(/[оө]/g, 'o')
    .replace(/[п]/g, 'p')
    .replace(/[р]/g, 'r')
    .replace(/[с]/g, 's')
    .replace(/[т]/g, 't')
    .replace(/[уұү]/g, 'u')
    .replace(/[ф]/g, 'f')
    .replace(/[хһ]/g, 'h')
    .replace(/[ц]/g, 'ts')
    .replace(/[ч]/g, 'ch')
    .replace(/[шщ]/g, 'sh')
    .replace(/[ьъ]/g, '')
    .replace(/[ы]/g, 'y')
    .replace(/[э]/g, 'e')
    .replace(/[ю]/g, 'yu')
    .replace(/[я]/g, 'ya')
}

function compareByDate(left?: string | null, right?: string | null) {
  return new Date(right ?? 0).getTime() - new Date(left ?? 0).getTime()
}

function compareByViews(left: Article, right: Article) {
  if (left.views !== right.views) {
    return right.views - left.views
  }

  return compareByDate(left.publishedAt, right.publishedAt)
}

function isPublishedArticle(article: Article) {
  return article.status === 'published' && !article.deletedAt
}

function stripPassword(user: User): AuthUser {
  const { passwordHash: _passwordHash, ...safeUser } = user
  return safeUser
}

function maybeMarkInterview(
  article: Article,
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
  const migrated: CategorySlug[] = article.categories.flatMap((slug) => {
    if (allowedCategorySlugs.has(slug as CategorySlug)) {
      return [slug as CategorySlug]
    }

    return legacyCategoryMap[slug] ?? []
  })

  const deduped: CategorySlug[] = migrated.filter(
    (slug, index, list) => list.indexOf(slug) === index,
  )

  return maybeMarkInterview(article, deduped.length > 0 ? deduped : ['society'])
}

function getEntitySummary(title: string): string {
  return title.length > 80 ? `${title.slice(0, 77)}...` : title
}

function getSearchableText(article: Article, users: User[], lang: Lang) {
  const author = users.find((user) => user.id === article.authorId)
  const categoryNames = article.categories
    .map((slug) => getCategoryBySlug(slug))
    .filter(Boolean)
    .map((category) => localize(category!.name, lang))
    .join(' ')

  return [
    article.title.ru,
    article.title.kk,
    article.excerpt.ru,
    article.excerpt.kk,
    article.body.ru,
    article.body.kk,
    article.tags.join(' '),
    categoryNames,
    author?.name ?? '',
    article.sourceName,
  ]
    .join(' ')
    .toLowerCase()
}

function sortArticles(articles: Article[], sort: PublicArticleSort = 'newest') {
  if (sort === 'popular') {
    return [...articles].sort(compareByViews)
  }

  return [...articles].sort((left, right) =>
    sort === 'oldest'
      ? compareByDate(right.publishedAt, left.publishedAt)
      : compareByDate(left.publishedAt, right.publishedAt),
  )
}

function filterPublicArticles(
  articles: Article[],
  users: User[],
  lang: Lang,
  options: PublicArticleFilterOptions = {},
) {
  const normalizedQuery = options.query?.trim().toLowerCase() ?? ''
  const normalizedTag = options.tag?.trim().toLowerCase() ?? ''

  return articles.filter((article) => {
    if (options.showOnHomeOnly && !article.showOnHome) {
      return false
    }

    if (options.category && !article.categories.includes(options.category as CategorySlug)) {
      return false
    }

    if (options.authorId && article.authorId !== options.authorId) {
      return false
    }

    if (normalizedTag && !article.tags.includes(normalizedTag)) {
      return false
    }

    const publishedDate = new Date(article.publishedAt ?? article.updatedAt)
    if (options.year && publishedDate.getFullYear() !== options.year) {
      return false
    }

    if (options.month && publishedDate.getMonth() + 1 !== options.month) {
      return false
    }

    if (normalizedQuery && !getSearchableText(article, users, lang).includes(normalizedQuery)) {
      return false
    }

    return true
  })
}

function getWindowDurationMs(window: PopularWindow) {
  return window === '24h' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
}

function toLocalizedText(value: Prisma.JsonValue): LocalizedText {
  const objectValue =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null

  return {
    ru: typeof objectValue?.ru === 'string' ? objectValue.ru : '',
    kk: typeof objectValue?.kk === 'string' ? objectValue.kk : '',
  }
}

function toIso(value?: Date | null) {
  return value ? value.toISOString() : null
}

function toDate(value?: string | null) {
  return value ? new Date(value) : null
}

function toDbLocalizedText(value: LocalizedText): Prisma.InputJsonValue {
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

function mapDbUser(user: DbUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    passwordHash: user.passwordHash,
    active: user.active,
    avatar: user.avatar,
    bio: toLocalizedText(user.bio),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    lastLoginAt: toIso(user.lastLoginAt),
  }
}

function mapDbArticle(article: DbArticle): Article {
  return {
    id: article.id,
    slug: article.slug,
    title: toLocalizedText(article.title),
    excerpt: toLocalizedText(article.excerpt),
    body: toLocalizedText(article.body),
    seoTitle: toLocalizedText(article.seoTitle),
    seoDescription: toLocalizedText(article.seoDescription),
    mainImage: article.mainImage,
    gallery: article.gallery,
    videoUrls: article.videoUrls,
    authorId: article.authorId,
    reviewerId: article.reviewerId,
    categories: article.categories as CategorySlug[],
    tags: article.tags,
    sourceName: article.sourceName,
    sourceUrl: article.sourceUrl,
    status: article.status,
    previousStatus: article.previousStatus,
    showOnHome: article.showOnHome,
    featured: article.featured,
    breaking: article.breaking,
    views: article.views,
    readMinutes: article.readMinutes,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    submittedAt: toIso(article.submittedAt),
    reviewedAt: toIso(article.reviewedAt),
    publishedAt: toIso(article.publishedAt),
    scheduledAt: toIso(article.scheduledAt),
    deletedAt: toIso(article.deletedAt),
    revision: article.revision,
  }
}

function mapDbAuditEntry(entry: DbAuditEntry): AuditEntry {
  return {
    id: entry.id,
    entityType: entry.entityType,
    entityId: entry.entityId,
    action: entry.action,
    actorId: entry.actorId,
    actorName: entry.actorName,
    summary: entry.summary,
    timestamp: entry.timestamp.toISOString(),
  }
}

function mapDbSubscriber(subscriber: DbSubscriber): Subscriber {
  return {
    id: subscriber.id,
    email: subscriber.email,
    createdAt: subscriber.createdAt.toISOString(),
    source: subscriber.source,
  }
}

function articleToPersistenceInput(article: Article) {
  return {
    slug: article.slug,
    title: toDbLocalizedText(article.title),
    excerpt: toDbLocalizedText(article.excerpt),
    body: toDbLocalizedText(article.body),
    seoTitle: toDbLocalizedText(article.seoTitle),
    seoDescription: toDbLocalizedText(article.seoDescription),
    mainImage: article.mainImage,
    gallery: article.gallery,
    videoUrls: article.videoUrls,
    authorId: article.authorId,
    reviewerId: article.reviewerId,
    categories: article.categories,
    tags: article.tags,
    sourceName: article.sourceName,
    sourceUrl: article.sourceUrl,
    status: article.status,
    previousStatus: toWorkflowStatus(article.previousStatus),
    showOnHome: article.showOnHome,
    featured: article.featured,
    breaking: article.breaking,
    views: article.views,
    readMinutes: article.readMinutes,
    createdAt: new Date(article.createdAt),
    updatedAt: new Date(article.updatedAt),
    submittedAt: toDate(article.submittedAt),
    reviewedAt: toDate(article.reviewedAt),
    publishedAt: toDate(article.publishedAt),
    scheduledAt: toDate(article.scheduledAt),
    deletedAt: toDate(article.deletedAt),
    revision: article.revision,
  }
}

function userToPersistenceInput(user: User) {
  return {
    name: normalizeText(user.name),
    email: normalizeText(user.email).toLowerCase(),
    role: user.role,
    passwordHash: user.passwordHash,
    active: user.active,
    avatar: user.avatar,
    bio: toDbLocalizedText(user.bio),
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
    lastLoginAt: toDate(user.lastLoginAt),
  }
}

async function ensureUniqueArticleSlug(desiredSlug: string, currentId?: string): Promise<string> {
  const base = slugify(desiredSlug) || `material-${Date.now()}`
  let slug = base
  let counter = 2

  while (
    await prisma.article.findFirst({
      where: {
        slug,
        ...(currentId ? { NOT: { id: currentId } } : {}),
      },
      select: { id: true },
    })
  ) {
    slug = `${base}-${counter}`
    counter += 1
  }

  return slug
}

async function getRecentViewCounts(window: PopularWindow) {
  const cutoff = new Date(Date.now() - getWindowDurationMs(window))
  const rows = await prisma.articleView.groupBy({
    by: ['articleId'],
    where: {
      viewedAt: {
        gte: cutoff,
      },
    },
    _count: {
      articleId: true,
    },
  })

  return new Map(
    rows
      .sort((left, right) => right._count.articleId - left._count.articleId)
      .map((row) => [row.articleId, row._count.articleId]),
  )
}

export async function promoteScheduledArticles(source: PromoteScheduledSource = 'runtime') {
  const now = new Date()
  const dueArticles = await prisma.article.findMany({
    where: {
      status: 'scheduled',
      scheduledAt: {
        not: null,
        lte: now,
      },
    },
    select: {
      id: true,
      slug: true,
      scheduledAt: true,
      revision: true,
      title: true,
    },
  })

  if (dueArticles.length === 0) {
    return []
  }

  await prisma.$transaction([
    ...dueArticles.map((article) =>
      prisma.article.update({
        where: { id: article.id },
        data: {
          status: 'published',
          publishedAt: article.scheduledAt ?? now,
          scheduledAt: null,
          updatedAt: now,
          revision: article.revision + 1,
        },
      }),
    ),
    ...dueArticles.map((article) =>
      prisma.auditEntry.create({
        data: {
          id: randomUUID(),
          entityType: 'article',
          entityId: article.id,
          action: 'scheduled_publish',
          actorId: null,
          actorName: source === 'cron' ? 'Scheduler' : 'Runtime',
          summary: `${getEntitySummary(toLocalizedText(article.title).ru)}: материал автоматически опубликован по расписанию.`,
          timestamp: now,
        },
      }),
    ),
  ])

  return dueArticles.map((article) => ({
    id: article.id,
    slug: article.slug,
  }))
}

async function loadData(): Promise<CMSData> {
  await ensureDatabaseBootstrappedFromSnapshot()
  await promoteScheduledArticles()

  const [users, articles, audit, subscribers] = await prisma.$transaction([
    prisma.user.findMany(),
    prisma.article.findMany(),
    prisma.auditEntry.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    }),
    prisma.subscriber.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ])

  return {
    users: users.map(mapDbUser),
    articles: articles.map(mapDbArticle),
    audit: audit.map(mapDbAuditEntry),
    subscribers: subscribers.map(mapDbSubscriber),
  }
}

export async function recordArticleView(articleId: string, viewerId: string) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: {
      id: true,
      status: true,
      deletedAt: true,
    },
  })

  if (!article || article.status !== 'published' || article.deletedAt) {
    return { recorded: false as const }
  }

  const dedupCutoff = new Date(Date.now() - VIEW_DEDUP_WINDOW_MS)
  const recentView = await prisma.articleView.findFirst({
    where: {
      articleId,
      viewerId,
      viewedAt: {
        gte: dedupCutoff,
      },
    },
    select: { id: true },
    orderBy: {
      viewedAt: 'desc',
    },
  })

  if (recentView) {
    return { recorded: false as const }
  }

  await prisma.$transaction([
    prisma.articleView.create({
      data: {
        id: randomUUID(),
        articleId,
        viewerId,
        viewedAt: new Date(),
      },
    }),
    prisma.article.update({
      where: { id: articleId },
      data: {
        views: {
          increment: 1,
        },
      },
    }),
  ])

  return { recorded: true as const }
}

export async function getUserById(id: string) {
  const data = await loadData()
  return data.users.find((item) => item.id === id) ?? null
}

export async function getUserByEmail(email: string) {
  const data = await loadData()
  return (
    data.users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
    ) ?? null
  )
}

export async function getUsers() {
  const data = await loadData()
  return data.users
    .map(stripPassword)
    .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
}

export async function getAuditEntries(limit?: number) {
  const data = await loadData()
  return typeof limit === 'number' ? data.audit.slice(0, limit) : data.audit
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const data = await loadData()
  return data.subscribers
}

export async function getAllArticles() {
  const data = await loadData()
  return data.articles.sort((left, right) => compareByDate(left.updatedAt, right.updatedAt))
}

export async function getAdminArticles(user: AuthUser) {
  const articles = await getAllArticles()
  if (user.role === 'author') {
    return articles.filter((article) => article.authorId === user.id)
  }
  return articles
}

export async function getArticleById(id: string) {
  const data = await loadData()
  return data.articles.find((article) => article.id === id) ?? null
}

export async function getPublishedArticles() {
  const data = await loadData()
  return data.articles
    .filter(isPublishedArticle)
    .sort((left, right) => compareByDate(left.publishedAt, right.publishedAt))
}

export async function getPublicArticleFeed(
  options: PublicArticleFilterOptions = {},
  lang: Lang,
) {
  const data = await loadData()
  const publishedArticles = data.articles.filter(isPublishedArticle)
  const filtered = filterPublicArticles(publishedArticles, data.users, lang, options)
  return sortArticles(filtered, options.sort)
}

export async function getPublicArticleBySlug(slug: string) {
  const articles = await getPublishedArticles()
  return articles.find((article) => article.slug === slug) ?? null
}

export async function getArticlesByCategory(
  slug: string,
  lang: Lang,
  options: Omit<PublicArticleFilterOptions, 'category'> = {},
) {
  return getPublicArticleFeed(
    {
      ...options,
      category: slug,
    },
    lang,
  )
}

export async function getPopularArticles(
  window: PopularWindow,
  count = 5,
  options: Pick<PublicArticleFilterOptions, 'showOnHomeOnly'> = {},
) {
  const articles = await getPublishedArticles()
  const filteredArticles = options.showOnHomeOnly
    ? articles.filter((article) => article.showOnHome)
    : articles
  const recentViewCounts = await getRecentViewCounts(window)

  const inWindow = filteredArticles
    .filter((article) => recentViewCounts.has(article.id))
    .sort((left, right) => {
      const rightCount = recentViewCounts.get(right.id) ?? 0
      const leftCount = recentViewCounts.get(left.id) ?? 0
      if (rightCount !== leftCount) {
        return rightCount - leftCount
      }

      return compareByViews(left, right)
    })

  const fallback = sortArticles(filteredArticles, 'popular').filter(
    (article) => !recentViewCounts.has(article.id),
  )

  return [...inWindow, ...fallback].slice(0, count)
}

export async function getRelatedArticles(article: Article, count = 3) {
  const articles = await getPublishedArticles()
  return articles
    .filter((item) => item.id !== article.id)
    .map((item) => {
      const sharedCategories = item.categories.filter((category) =>
        article.categories.includes(category),
      ).length
      const sharedTags = item.tags.filter((tag) => article.tags.includes(tag)).length
      const sameAuthor = item.authorId === article.authorId ? 1 : 0

      return {
        item,
        score: sharedTags * 4 + sharedCategories * 3 + sameAuthor,
      }
    })
    .sort((left, right) => {
      if (left.score !== right.score) {
        return right.score - left.score
      }

      return compareByDate(left.item.publishedAt, right.item.publishedAt)
    })
    .map((entry) => entry.item)
    .slice(0, count)
}

export async function searchArticles(
  query: string,
  lang: Lang,
  options: Omit<PublicArticleFilterOptions, 'query'> = {},
) {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) {
    return []
  }

  return getPublicArticleFeed(
    {
      ...options,
      query: normalizedQuery,
    },
    lang,
  )
}

export async function getCategorySummaries() {
  const articles = await getPublishedArticles()

  return categories.map((category) => {
    const items = articles.filter((article) => article.categories.includes(category.slug))
    return {
      category,
      count: items.length,
      latestArticle: items[0] ?? null,
    }
  })
}

export async function getPublicAuthors() {
  const data = await loadData()
  const publishedArticles = data.articles.filter(isPublishedArticle)

  return data.users
    .map(stripPassword)
    .map((user) => {
      const articles = publishedArticles.filter((article) => article.authorId === user.id)
      const totalViews = articles.reduce((sum, article) => sum + article.views, 0)
      return {
        ...user,
        articleCount: articles.length,
        totalViews,
        latestArticle: articles[0] ?? null,
      }
    })
    .filter((user) => user.articleCount > 0)
    .sort((left, right) => {
      if (left.articleCount !== right.articleCount) {
        return right.articleCount - left.articleCount
      }

      return right.totalViews - left.totalViews
    })
}

export async function getAuthorProfile(authorId: string, lang: Lang) {
  const authors = await getPublicAuthors()
  const author = authors.find((item) => item.id === authorId) ?? null
  if (!author) {
    return null
  }

  const articles = await getPublicArticleFeed(
    {
      authorId,
      sort: 'newest',
    },
    lang,
  )

  return {
    author,
    articles,
  }
}

export async function getArchiveData({
  year,
  month,
}: {
  year?: number
  month?: number
} = {}) {
  const articles = await getPublishedArticles()
  const availableYears = Array.from(
    new Set(
      articles.map((article) =>
        new Date(article.publishedAt ?? article.updatedAt).getFullYear(),
      ),
    ),
  ).sort((left, right) => right - left)

  const availableMonths = Array.from(
    new Set(
      articles
        .filter((article) =>
          year
            ? new Date(article.publishedAt ?? article.updatedAt).getFullYear() === year
            : true,
        )
        .map((article) => new Date(article.publishedAt ?? article.updatedAt).getMonth() + 1),
    ),
  ).sort((left, right) => right - left)

  const filtered = articles.filter((article) => {
    const date = new Date(article.publishedAt ?? article.updatedAt)

    if (year && date.getFullYear() !== year) {
      return false
    }

    if (month && date.getMonth() + 1 !== month) {
      return false
    }

    return true
  })

  const groups = Object.entries(
    filtered.reduce<Record<string, Article[]>>((accumulator, article) => {
      const date = new Date(article.publishedAt ?? article.updatedAt)
      const key = date.toISOString().slice(0, 10)
      accumulator[key] = accumulator[key] ? [...accumulator[key], article] : [article]
      return accumulator
    }, {}),
  )
    .sort(([left], [right]) => new Date(right).getTime() - new Date(left).getTime())
    .map(([date, items]) => ({
      date,
      items: sortArticles(items, 'newest'),
    }))

  return {
    availableYears,
    availableMonths,
    groups,
    total: filtered.length,
  }
}

export async function getHomePageData() {
  const articles = await getPublishedArticles()
  const visible = articles.filter((article) => article.showOnHome)
  const hero = visible.find((article) => article.featured) ?? visible[0] ?? null
  const remainder = visible.filter((article) => article.id !== hero?.id)
  const [popular24h, popularWeek] = await Promise.all([
    getPopularArticles('24h', 5, { showOnHomeOnly: true }),
    getPopularArticles('7d', 5, { showOnHomeOnly: true }),
  ])

  return {
    hero,
    heroSecondary: remainder.slice(0, 2),
    latestFeed: remainder.slice(0, 8),
    popular24h,
    popularWeek,
    sections: categories
      .map((category) => ({
        category,
        items: visible.filter((article) => article.categories.includes(category.slug)).slice(0, 4),
      }))
      .filter((section) => section.items.length > 0),
  }
}

export async function getDashboardStats(user: AuthUser) {
  const articles = await getAdminArticles(user)
  const subscribers = await getSubscribers()

  return {
    total: articles.length,
    published: articles.filter((article) => article.status === 'published').length,
    review: articles.filter((article) => article.status === 'in_review').length,
    scheduled: articles.filter((article) => article.status === 'scheduled').length,
    drafts: articles.filter((article) => article.status === 'draft').length,
    trash: articles.filter((article) => article.status === 'trash').length,
    subscribers: subscribers.length,
  }
}

export async function saveArticle(
  actor: AuthUser,
  input: SaveArticleInput,
  intent: 'draft' | 'review' | 'publish' | 'schedule' | 'reject',
) {
  const now = new Date().toISOString()
  const existing = input.id ? await getArticleById(input.id) : null

  const slug = await ensureUniqueArticleSlug(
    input.slug || input.title.ru || input.title.kk,
    existing?.id,
  )

  const nextStatus: ArticleStatus =
    intent === 'draft'
      ? 'draft'
      : intent === 'review'
        ? 'in_review'
        : intent === 'publish'
          ? 'published'
          : intent === 'schedule'
            ? 'scheduled'
            : 'rejected'

  const nextArticle: Article = {
    id: existing?.id ?? randomUUID(),
    slug,
    title: {
      ru: normalizeText(input.title.ru),
      kk: normalizeText(input.title.kk),
    },
    excerpt: {
      ru: normalizeText(input.excerpt.ru),
      kk: normalizeText(input.excerpt.kk),
    },
    body: {
      ru: normalizeText(input.body.ru),
      kk: normalizeText(input.body.kk),
    },
    seoTitle: {
      ru: normalizeText(input.seoTitle.ru),
      kk: normalizeText(input.seoTitle.kk),
    },
    seoDescription: {
      ru: normalizeText(input.seoDescription.ru),
      kk: normalizeText(input.seoDescription.kk),
    },
    mainImage: input.mainImage,
    gallery: input.gallery,
    videoUrls: input.videoUrls,
    authorId: input.authorId,
    reviewerId:
      nextStatus === 'published' || nextStatus === 'scheduled' || nextStatus === 'rejected'
        ? actor.id
        : existing?.reviewerId ?? null,
    categories: normalizeStoredCategories({
      ...(existing ?? {
        id: '',
        slug: '',
        title: input.title,
        excerpt: input.excerpt,
        body: input.body,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        mainImage: input.mainImage,
        gallery: input.gallery,
        videoUrls: input.videoUrls,
        authorId: input.authorId,
        reviewerId: null,
        categories: input.categories,
        tags: input.tags,
        sourceName: input.sourceName,
        sourceUrl: input.sourceUrl,
        status: nextStatus,
        previousStatus: null,
        showOnHome: input.showOnHome,
        featured: input.featured,
        breaking: input.breaking,
        views: input.views,
        readMinutes: estimateReadMinutes(input.body),
        createdAt: now,
        updatedAt: now,
        submittedAt: null,
        reviewedAt: null,
        publishedAt: null,
        scheduledAt: null,
        deletedAt: null,
        revision: 0,
      }),
      categories: input.categories,
      title: input.title,
      excerpt: input.excerpt,
      body: input.body,
      tags: input.tags,
    }),
    tags: normalizeTags(input.tags),
    sourceName: normalizeText(input.sourceName),
    sourceUrl: normalizeText(input.sourceUrl),
    status: nextStatus,
    previousStatus: existing?.previousStatus ?? null,
    showOnHome: input.showOnHome,
    featured: input.featured,
    breaking: input.breaking,
    views: Number.isFinite(input.views) ? input.views : existing?.views ?? 0,
    readMinutes: estimateReadMinutes(input.body),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    submittedAt: nextStatus === 'in_review' ? now : existing?.submittedAt ?? null,
    reviewedAt:
      nextStatus === 'published' || nextStatus === 'scheduled' || nextStatus === 'rejected'
        ? now
        : existing?.reviewedAt ?? null,
    publishedAt:
      nextStatus === 'published'
        ? input.publishedAt ?? existing?.publishedAt ?? now
        : existing?.publishedAt ?? null,
    scheduledAt: nextStatus === 'scheduled' ? input.scheduledAt : null,
    deletedAt: null,
    revision: (existing?.revision ?? 0) + 1,
  }

  const auditEntry: AuditEntry = {
    id: randomUUID(),
    entityType: 'article',
    entityId: nextArticle.id,
    action: nextStatus,
    actorId: actor.id,
    actorName: actor.name,
    summary: `${getEntitySummary(nextArticle.title.ru)}: статус изменен на ${nextStatus}.`,
    timestamp: new Date().toISOString(),
  }

  await prisma.$transaction([
    existing
      ? prisma.article.update({
          where: { id: nextArticle.id },
          data: articleToPersistenceInput(nextArticle),
        })
      : prisma.article.create({
          data: {
            id: nextArticle.id,
            ...articleToPersistenceInput(nextArticle),
          },
        }),
    prisma.auditEntry.create({
      data: {
        id: auditEntry.id,
        entityType: auditEntry.entityType,
        entityId: auditEntry.entityId,
        action: auditEntry.action,
        actorId: auditEntry.actorId,
        actorName: auditEntry.actorName,
        summary: auditEntry.summary,
        timestamp: new Date(auditEntry.timestamp),
      },
    }),
  ])

  return nextArticle
}

export async function updateArticleState(
  actor: AuthUser,
  articleId: string,
  action:
    | 'trash'
    | 'restore'
    | 'publish'
    | 'hide_home'
    | 'show_home'
    | 'purge'
    | 'send_review',
) {
  const article = await getArticleById(articleId)
  if (!article) return null

  const now = new Date().toISOString()
  let nextArticle: Article | null = null

  if (action === 'purge') {
    await prisma.article.delete({
      where: { id: articleId },
    })
  } else {
    if (action === 'trash') {
      nextArticle = {
        ...article,
        previousStatus:
          article.status === 'trash' ? article.previousStatus : article.status,
        status: 'trash',
        deletedAt: now,
        updatedAt: now,
        revision: article.revision + 1,
      }
    } else if (action === 'restore') {
      nextArticle = {
        ...article,
        status: article.previousStatus ?? 'draft',
        previousStatus: null,
        deletedAt: null,
        updatedAt: now,
        revision: article.revision + 1,
      }
    } else if (action === 'publish') {
      nextArticle = {
        ...article,
        status: 'published',
        reviewerId: actor.id,
        reviewedAt: now,
        publishedAt: article.publishedAt ?? now,
        scheduledAt: null,
        updatedAt: now,
        revision: article.revision + 1,
      }
    } else if (action === 'send_review') {
      nextArticle = {
        ...article,
        status: 'in_review',
        submittedAt: now,
        updatedAt: now,
        revision: article.revision + 1,
      }
    } else if (action === 'hide_home') {
      nextArticle = {
        ...article,
        showOnHome: false,
        updatedAt: now,
        revision: article.revision + 1,
      }
    } else {
      nextArticle = {
        ...article,
        showOnHome: true,
        updatedAt: now,
        revision: article.revision + 1,
      }
    }

    await prisma.article.update({
      where: { id: articleId },
      data: articleToPersistenceInput(nextArticle),
    })
  }

  await prisma.auditEntry.create({
    data: {
      id: randomUUID(),
      entityType: 'article',
      entityId: articleId,
      action,
      actorId: actor.id,
      actorName: actor.name,
      summary: `${getEntitySummary(article.title.ru)}: действие ${action}.`,
      timestamp: new Date(),
    },
  })

  return true
}

export async function saveNewsletterSubscriber(email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) {
    return { ok: false, message: 'Введите e-mail.' }
  }

  const existing = await prisma.subscriber.findUnique({
    where: {
      email: normalizedEmail,
    },
    select: {
      id: true,
    },
  })

  if (existing) {
    return { ok: true, message: 'already_exists' as const }
  }

  await prisma.$transaction([
    prisma.subscriber.create({
      data: {
        id: randomUUID(),
        email: normalizedEmail,
        createdAt: new Date(),
        source: 'footer',
      },
    }),
    prisma.auditEntry.create({
      data: {
        id: randomUUID(),
        entityType: 'newsletter',
        entityId: normalizedEmail,
        action: 'subscribed',
        actorId: null,
        actorName: 'Сайт',
        summary: `Новый подписчик редакционной рассылки: ${normalizedEmail}.`,
        timestamp: new Date(),
      },
    }),
  ])

  return { ok: true, message: 'subscribed' as const }
}

export async function saveUser(
  actor: AuthUser,
  input: Omit<User, 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'passwordHash'> & {
    passwordHash?: string
  },
) {
  const now = new Date().toISOString()
  const existing = input.id ? await getUserById(input.id) : null

  const nextUser: User = {
    id: existing?.id ?? randomUUID(),
    name: normalizeText(input.name),
    email: normalizeText(input.email).toLowerCase(),
    role: input.role,
    passwordHash: input.passwordHash ?? existing?.passwordHash ?? '',
    active: input.active,
    avatar: input.avatar,
    bio: input.bio,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    lastLoginAt: existing?.lastLoginAt ?? null,
  }

  await prisma.$transaction(async (tx) => {
    if (existing) {
      await tx.user.update({
        where: { id: nextUser.id },
        data: userToPersistenceInput(nextUser),
      })
    } else {
      await tx.user.create({
        data: {
          id: nextUser.id,
          ...userToPersistenceInput(nextUser),
        },
      })
    }

    await tx.auditEntry.create({
      data: {
        id: randomUUID(),
        entityType: 'user',
        entityId: nextUser.id,
        action: existing ? 'updated' : 'created',
        actorId: actor.id,
        actorName: actor.name,
        summary: `${existing ? 'Обновлен' : 'Создан'} пользователь ${nextUser.name}.`,
        timestamp: new Date(),
      },
    })
  })

  return nextUser
}

export async function touchUserLogin(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    },
  })
}
