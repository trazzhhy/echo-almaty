import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicArticleCard } from '@/components/public/article-card'
import { PopularWidget } from '@/components/public/popular-widget'
import { PublicSiteShell } from '@/components/public/site-shell'
import {
  getPopularArticles,
  getPublicAuthors,
  searchArticles,
  type PublicArticleSort,
} from '@/lib/cms/repository'
import { categories, isLang, localize, t, type Lang } from '@/lib/i18n'

const sortOptions: PublicArticleSort[] = ['newest', 'popular', 'oldest']

function getSort(value?: string): PublicArticleSort {
  return sortOptions.includes(value as PublicArticleSort)
    ? (value as PublicArticleSort)
    : 'newest'
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ q?: string; category?: string; author?: string; sort?: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const { q = '' } = await searchParams
  const safeLang = isLang(lang) ? lang : 'ru'

  return {
    title:
      safeLang === 'ru'
        ? `Поиск: ${q || 'новости'}`
        : `Іздеу: ${q || 'жаңалықтар'}`,
  }
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ q?: string; category?: string; author?: string; sort?: string }>
}) {
  const { lang } = await params
  const { q = '', category = '', author = '', sort } = await searchParams
  const safeLang: Lang = isLang(lang) ? lang : 'ru'
  const safeSort = getSort(sort)
  const authors = await getPublicAuthors()
  const safeCategory = categories.some((item) => item.slug === category) ? category : ''
  const safeAuthor = authors.some((item) => item.id === author) ? author : ''
  const [results, popular24h] = await Promise.all([
    searchArticles(q, safeLang, {
      category: safeCategory || undefined,
      authorId: safeAuthor || undefined,
      sort: safeSort,
    }),
    getPopularArticles('24h'),
  ])

  return (
    <PublicSiteShell
      lang={safeLang}
      path="/search"
      mainClassName="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:pt-10"
    >
      <header className="border-b border-foreground/20 pb-7">
        <p className="text-sm font-medium text-primary">{t(safeLang, 'results')}</p>
        <h1 className="mt-2 max-w-5xl font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.96] tracking-[-0.035em] text-balance">
          {q ? `«${q}»` : t(safeLang, 'search')}
        </h1>
        <p className="mt-5 max-w-[68ch] text-base leading-7 text-muted-foreground">
          {safeLang === 'ru'
            ? 'Ищите по заголовкам, полному тексту, тегам, категориям, источникам и авторам. Фильтры помогут сузить выдачу.'
            : 'Тақырыптар, толық мәтін, тегтер, санаттар, дереккөздер және авторлар бойынша іздеңіз. Сүзгілер нәтижені нақтылауға көмектеседі.'}
        </p>
      </header>

      <form className="news-filter-form mt-8 lg:grid-cols-4">
        <input
          name="q"
          defaultValue={q}
          placeholder={t(safeLang, 'searchPlaceholder')}
          className="news-input"
        />
        <select
          name="category"
          defaultValue={safeCategory}
          aria-label={t(safeLang, 'allCategories')}
          className="news-input"
        >
          <option value="">{t(safeLang, 'allCategories')}</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {localize(item.name, safeLang)}
            </option>
          ))}
        </select>
        <select
          name="author"
          defaultValue={safeAuthor}
          aria-label={t(safeLang, 'allAuthors')}
          className="news-input"
        >
          <option value="">{t(safeLang, 'allAuthors')}</option>
          {authors.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          name="sort"
          defaultValue={safeSort}
          aria-label={t(safeLang, 'sortNewest')}
          className="news-input"
        >
          <option value="newest">{t(safeLang, 'sortNewest')}</option>
          <option value="popular">{t(safeLang, 'sortPopular')}</option>
          <option value="oldest">{t(safeLang, 'sortOldest')}</option>
        </select>
        <div className="flex flex-wrap gap-3 lg:col-span-4">
          <button
            type="submit"
            className="news-btn-primary"
          >
            {t(safeLang, 'applyFilters')}
          </button>
          <Link
            href={`/${safeLang}/search`}
            className="news-btn-secondary"
          >
            {t(safeLang, 'clearFilters')}
          </Link>
        </div>
      </form>

      <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.65fr)]">
        <section>
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-foreground/20 pb-3">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.02em]">
              {safeLang === 'ru' ? 'Найденные материалы' : 'Табылған материалдар'}
            </h2>
            <span className="text-sm tabular-nums text-muted-foreground">
              {results.length} {t(safeLang, 'materials')}
            </span>
          </div>
          {results.length === 0 ? (
            <p className="border-b border-foreground/20 px-6 py-16 text-center text-muted-foreground">
              {t(safeLang, 'noResults')}
            </p>
          ) : (
            <div className="grid gap-x-5 gap-y-8 md:grid-cols-2">
              {results.map((article, index) => (
                <div key={article.id} className={index === 0 ? 'md:col-span-2' : undefined}>
                  <PublicArticleCard article={article} lang={safeLang} />
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="xl:pt-12">
          <PopularWidget
            lang={safeLang}
            title={t(safeLang, 'popular24h')}
            items={popular24h}
          />
        </aside>
      </div>
    </PublicSiteShell>
  )
}
