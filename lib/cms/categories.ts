import { categories, type CategorySlug } from '@/lib/i18n'
import type { Article } from './types'

export const allowedCategorySlugs = new Set<CategorySlug>(
  categories.map((category) => category.slug),
)

const eventPatterns = [
  'фестиваль',
  'концерт',
  'ивент',
  'мероприят',
  'event',
  'оқиға',
  'фестивал',
]

function resolveCultureOrEvents(
  article: Pick<Article, 'title' | 'excerpt' | 'body' | 'tags'>,
): CategorySlug {
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

  return eventPatterns.some((pattern) => text.includes(pattern)) ? 'events' : 'culture'
}

const legacyCategoryMap: Record<string, CategorySlug[]> = {
  analytics: ['analytics'],
  culture: ['culture'],
  'culture-events': [],
  economy: ['business-economy'],
  events: ['events'],
  incidents: ['society'],
  politics: ['politics'],
  society: ['society'],
  sport: ['sport'],
  tech: ['business-economy'],
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

export function normalizeStoredCategories(
  article: Pick<Article, 'title' | 'excerpt' | 'body' | 'tags'> & {
    categories: string[]
  },
): CategorySlug[] {
  const migrated: CategorySlug[] = article.categories.flatMap((slug) => {
    if (slug === 'culture-events') {
      return [resolveCultureOrEvents(article)]
    }

    if (allowedCategorySlugs.has(slug as CategorySlug)) {
      return [slug as CategorySlug]
    }

    return legacyCategoryMap[slug] ?? []
  })

  const deduped = migrated.filter(
    (slug, index, list) => list.indexOf(slug) === index,
  )

  return maybeMarkInterview(article, deduped.length > 0 ? deduped : ['society'])
}
