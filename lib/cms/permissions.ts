import type { Article, AuthUser } from './types'

export function canManageUsers(user: AuthUser): boolean {
  return user.role === 'admin'
}

export function canModerate(user: AuthUser): boolean {
  return user.role === 'admin' || user.role === 'editor' || user.role === 'moderator'
}

export function canPublish(user: AuthUser): boolean {
  return user.role === 'admin' || user.role === 'editor'
}

export function canAccessHistory(user: AuthUser): boolean {
  return user.role !== 'author'
}

export function canCreateNews(user: AuthUser): boolean {
  return user.role === 'admin' || user.role === 'editor' || user.role === 'author'
}

export function canEditArticle(user: AuthUser, article: Article): boolean {
  if (user.role === 'admin' || user.role === 'editor') return true
  if (user.role === 'moderator') return article.status !== 'trash'
  return article.authorId === user.id
}

export function canChangeOwnership(user: AuthUser): boolean {
  return user.role === 'admin' || user.role === 'editor'
}
