import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicArticleCard } from '@/components/public/article-card'
import { PublicPageIntro } from '@/components/public/page-intro'
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
    <PublicSiteShell lang={safeLang} path={`/category/${slug}`}>
      <PublicPageIntro
        eyebrow={t(safeLang, 'inCategory')}
        title={localize(category.name, safeLang)}
        description={
          safeLang === 'ru'
            ? 'Отдельная страница рубрики с поиском по тексту и автору, а также сортировкой по дате и популярности.'
            : 'Мәтін мен автор бойынша іздеуі және күн мен танымалдық бойынша сұрыптауы бар жеке санат беті.'
        }
      />

      <form className="grid gap-4 rounded-[2rem] border border-border bg-card p-5 lg:grid-cols-3">
        <input
          name="q"
          defaultValue={q}
          placeholder={t(safeLang, 'searchPlaceholder')}
          className="h-12 rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
        />
        <select
          name="author"
          defaultValue={safeAuthor}
          className="h-12 rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
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
          className="h-12 rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
        >
          <option value="newest">{t(safeLang, 'sortNewest')}</option>
          <option value="popular">{t(safeLang, 'sortPopular')}</option>
          <option value="oldest">{t(safeLang, 'sortOldest')}</option>
        </select>
        <div className="flex flex-wrap gap-3 lg:col-span-3">
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t(safeLang, 'applyFilters')}
          </button>
          <Link
            href={`/${safeLang}/category/${slug}`}
            className="rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:bg-secondary"
          >
            {t(safeLang, 'clearFilters')}
          </Link>
        </div>
      </form>

      <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)]">
        <section>
          {articles.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
              {t(safeLang, 'noResults')}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((article) => (
                <PublicArticleCard key={article.id} article={article} lang={safeLang} />
              ))}
            </div>
          )}
        </section>

        <aside>
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
