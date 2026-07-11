import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicArticleCard } from '@/components/public/article-card'
import { PopularWidget } from '@/components/public/popular-widget'
import { PublicSiteShell } from '@/components/public/site-shell'
import {
  getArticlesByCategory,
  getPopularArticles,
  getPublicAuthors,
  type PublicArticleSort,
} from '@/lib/cms/repository'
import { getCategoryBySlug, isLang, localize, t, type Lang } from '@/lib/i18n'

const sortOptions: PublicArticleSort[] = ['newest', 'popular', 'oldest']

function getSort(value?: string): PublicArticleSort {
  return sortOptions.includes(value as PublicArticleSort)
    ? (value as PublicArticleSort)
    : 'newest'
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const safeLang = isLang(lang) ? lang : 'ru'
  const category = getCategoryBySlug(slug)

  return {
    title: category ? localize(category.name, safeLang) : 'Category',
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>
  searchParams: Promise<{ q?: string; author?: string; sort?: string }>
}) {
  const { lang, slug } = await params
  const { q = '', author = '', sort } = await searchParams
  const safeLang: Lang = isLang(lang) ? lang : 'ru'
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const safeSort = getSort(sort)
  const authors = await getPublicAuthors()
  const safeAuthor = authors.some((item) => item.id === author) ? author : ''
  const [articles, popularWeek] = await Promise.all([
    getArticlesByCategory(slug, safeLang, {
      query: q,
      authorId: safeAuthor || undefined,
      sort: safeSort,
    }),
    getPopularArticles('7d'),
  ])

  return (
    <PublicSiteShell
      lang={safeLang}
      path={`/category/${slug}`}
      mainClassName="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:pt-10"
    >
      <header className="border-b border-foreground/20 pb-7">
        <p className="text-sm font-medium text-primary">{t(safeLang, 'inCategory')}</p>
        <h1 className="mt-2 max-w-5xl font-heading text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-[0.94] tracking-[-0.04em] text-balance">
          {localize(category.name, safeLang)}
        </h1>
        <p className="mt-5 max-w-[64ch] text-base leading-7 text-muted-foreground">
          {safeLang === 'ru'
            ? 'Последние новости, объяснения и репортажи редакции по этой теме. Настройте выдачу по автору, дате или популярности.'
            : 'Осы тақырып бойынша редакцияның соңғы жаңалықтары, түсіндірмелері мен репортаждары. Нәтижені автор, күн немесе танымалдық бойынша реттеңіз.'}
        </p>
      </header>

      <form className="news-filter-form mt-8 lg:grid-cols-3">
        <input
          name="q"
          defaultValue={q}
          placeholder={t(safeLang, 'searchPlaceholder')}
          className="news-input"
        />
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
        <div className="flex flex-wrap gap-3 lg:col-span-3">
          <button
            type="submit"
            className="news-btn-primary"
          >
            {t(safeLang, 'applyFilters')}
          </button>
          <Link
            href={`/${safeLang}/category/${slug}`}
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
              {safeLang === 'ru' ? 'Материалы рубрики' : 'Санат материалдары'}
            </h2>
            <span className="text-sm tabular-nums text-muted-foreground">
              {articles.length} {t(safeLang, 'materials')}
            </span>
          </div>
          {articles.length === 0 ? (
            <p className="border-b border-foreground/20 px-6 py-16 text-center text-muted-foreground">
              {t(safeLang, 'noResults')}
            </p>
          ) : (
            <div className="grid gap-x-5 gap-y-8 md:grid-cols-2">
              {articles.map((article, index) => (
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
            title={t(safeLang, 'popularWeek')}
            items={popularWeek}
          />
        </aside>
      </div>
    </PublicSiteShell>
  )
}
