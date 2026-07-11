import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicArticleCard } from '@/components/public/article-card'
import { PopularWidget } from '@/components/public/popular-widget'
import { PublicSiteShell } from '@/components/public/site-shell'
import {
  getAuthorProfile,
  getPopularArticles,
  type PublicArticleSort,
} from '@/lib/cms/repository'
import { isLang, t, type Lang } from '@/lib/i18n'

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
  params: Promise<{ lang: string; id: string }>
}): Promise<Metadata> {
  const { lang, id } = await params
  const safeLang = isLang(lang) ? lang : 'ru'
  const profile = await getAuthorProfile(id, safeLang)

  return {
    title: profile?.author.name ?? (safeLang === 'ru' ? 'Автор' : 'Автор'),
  }
}

export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; id: string }>
  searchParams: Promise<{ sort?: string }>
}) {
  const { lang, id } = await params
  const { sort } = await searchParams
  const safeLang: Lang = isLang(lang) ? lang : 'ru'
  const profile = await getAuthorProfile(id, safeLang)

  if (!profile) {
    notFound()
  }

  const safeSort = getSort(sort)
  const articles =
    safeSort === 'newest'
      ? profile.articles
      : [...profile.articles].sort((left, right) => {
          if (safeSort === 'popular') {
            return right.views - left.views
          }

          return new Date(left.publishedAt ?? left.updatedAt).getTime() -
            new Date(right.publishedAt ?? right.updatedAt).getTime()
        })

  const popularWeek = await getPopularArticles('7d')

  return (
    <PublicSiteShell
      lang={safeLang}
      path={`/author/${id}`}
      mainClassName="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:pt-10"
    >
      <header className="grid border border-foreground/20 lg:grid-cols-[minmax(220px,0.34fr)_minmax(0,1fr)]">
        <div className="flex min-h-60 items-center justify-center bg-foreground p-8 text-background lg:min-h-[360px]">
          <span
            aria-hidden
            className="font-brand text-[clamp(5rem,13vw,10rem)] font-black leading-none tracking-[-0.04em]"
          >
            {profile.author.name.charAt(0)}
          </span>
        </div>
        <div className="flex flex-col p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-medium text-primary">{t(safeLang, 'byAuthor')}</p>
          <h1 className="mt-3 max-w-4xl font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.96] tracking-[-0.035em] text-balance">
            {profile.author.name}
          </h1>
          <p className="mt-5 max-w-[64ch] text-base leading-7 text-muted-foreground">
            {profile.author.bio[safeLang]}
          </p>
          <dl className="mt-auto grid grid-cols-2 gap-6 border-t border-foreground/20 pt-6">
            <div>
              <dt className="text-xs text-muted-foreground">{t(safeLang, 'materials')}</dt>
              <dd className="mt-1 font-heading text-2xl font-bold tabular-nums">
                {profile.author.articleCount}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t(safeLang, 'views')}</dt>
              <dd className="mt-1 font-heading text-2xl font-bold tabular-nums">
                {profile.author.totalViews.toLocaleString(safeLang === 'ru' ? 'ru-RU' : 'kk-KZ')}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <form className="news-filter-form mt-8 sm:grid-cols-[minmax(200px,1fr)_auto] sm:items-center">
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
        <button
          type="submit"
          className="news-btn-primary"
        >
          {t(safeLang, 'applyFilters')}
        </button>
      </form>

      <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.65fr)]">
        <section>
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-foreground/20 pb-3">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.02em]">
              {safeLang === 'ru' ? 'Публикации автора' : 'Автор жарияланымдары'}
            </h2>
            <span className="text-sm tabular-nums text-muted-foreground">
              {articles.length} {t(safeLang, 'materials')}
            </span>
          </div>
          <div className="grid gap-x-5 gap-y-8 md:grid-cols-2">
            {articles.map((article, index) => (
              <div key={article.id} className={index === 0 ? 'md:col-span-2' : undefined}>
                <PublicArticleCard article={article} lang={safeLang} />
              </div>
            ))}
          </div>
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
