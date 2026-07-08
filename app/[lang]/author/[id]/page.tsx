import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicArticleCard } from '@/components/public/article-card'
import { PublicPageIntro } from '@/components/public/page-intro'
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
    <PublicSiteShell lang={safeLang} path={`/author/${id}`}>
      <PublicPageIntro
        eyebrow={t(safeLang, 'byAuthor')}
        title={profile.author.name}
        description={profile.author.bio[safeLang]}
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <span className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
          {profile.author.articleCount} {t(safeLang, 'materials')}
        </span>
        <span className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
          {profile.author.totalViews.toLocaleString(safeLang === 'ru' ? 'ru-RU' : 'kk-KZ')} {t(safeLang, 'views')}
        </span>
      </div>

      <form className="mb-8 flex flex-wrap gap-3 rounded-[2rem] border border-border bg-card p-5">
        <select
          name="sort"
          defaultValue={safeSort}
          className="h-12 rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
        >
          <option value="newest">{t(safeLang, 'sortNewest')}</option>
          <option value="popular">{t(safeLang, 'sortPopular')}</option>
          <option value="oldest">{t(safeLang, 'sortOldest')}</option>
        </select>
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t(safeLang, 'applyFilters')}
        </button>
      </form>

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)]">
        <section>
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <PublicArticleCard key={article.id} article={article} lang={safeLang} />
            ))}
          </div>
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
