import type { CategorySlug, Lang, LocalizedText } from '@/lib/i18n'

export type Role = 'admin' | 'editor' | 'author' | 'moderator'

export type ArticleStatus =
  | 'draft'
  | 'in_review'
  | 'scheduled'
  | 'published'
  | 'rejected'
  | 'trash'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  passwordHash: string
  active: boolean
  avatar: string
  bio: LocalizedText
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
}

export type Article = {
  id: string
  slug: string
  title: LocalizedText
  excerpt: LocalizedText
  body: LocalizedText
  seoTitle: LocalizedText
  seoDescription: LocalizedText
  mainImage: string
  gallery: string[]
  videoUrls: string[]
  authorId: string
  reviewerId: string | null
  categories: CategorySlug[]
  tags: string[]
  sourceName: string
  sourceUrl: string
  status: ArticleStatus
  previousStatus: Exclude<ArticleStatus, 'trash'> | null
  showOnHome: boolean
  featured: boolean
  breaking: boolean
  views: number
  readMinutes: number
  createdAt: string
  updatedAt: string
  submittedAt: string | null
  reviewedAt: string | null
  publishedAt: string | null
  scheduledAt: string | null
  deletedAt: string | null
  revision: number
}

export type AuditEntity = 'article' | 'user' | 'newsletter' | 'auth'

export type AuditEntry = {
  id: string
  entityType: AuditEntity
  entityId: string
  action: string
  actorId: string | null
  actorName: string
  summary: string
  timestamp: string
}

export type Subscriber = {
  id: string
  email: string
  createdAt: string
  source: 'footer'
}

export type CMSData = {
  users: User[]
  articles: Article[]
  audit: AuditEntry[]
  subscribers: Subscriber[]
}

export type AuthUser = Omit<User, 'passwordHash'>

export type SaveArticleInput = {
  id?: string
  slug?: string
  title: LocalizedText
  excerpt: LocalizedText
  body: LocalizedText
  seoTitle: LocalizedText
  seoDescription: LocalizedText
  mainImage: string
  gallery: string[]
  videoUrls: string[]
  authorId: string
  categories: CategorySlug[]
  tags: string[]
  sourceName: string
  sourceUrl: string
  showOnHome: boolean
  featured: boolean
  breaking: boolean
  views: number
  publishedAt: string | null
  scheduledAt: string | null
}
