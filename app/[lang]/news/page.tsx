import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicArticleCard } from '@/components/public/article-card'
import { PublicPageIntro } from '@/components/public/page-intro'
import { PopularWidget } from '@/components/public/popular-widget'
import { PublicSiteShell } from '@/components/public/site-shell'
import {
  getPopularArticles,
  getPublicArticleFeed,
  getPublicAuthors,
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
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const safeLang = isLang(lang) ? lang : 'ru'

  return {
    title: safeLang === 'ru' ? 'Новости Эхо Алматы' : 'Эхо Алматы жаңалықтары',
  }
}

export default async function NewsPage({
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

  const [articles, popular24h, popularWeek] = await Promise.all([
    getPublicArticleFeed(
      {
        query: q,
        category: safeCategory || undefined,
        authorId: safeAuthor || undefined,
        sort: safeSort,
      },
      safeLang,
    ),
    getPopularArticles('24h'),
    getPopularArticles('7d'),
  ])

  return (
    <PublicSiteShell lang={safeLang} path="/news">
      <PublicPageIntro
        eyebrow={t(safeLang, 'news')}
        title={t(safeLang, 'allNews')}
        description={
          safeLang === 'ru'
            ? 'Единая лента редакции с поиском по тексту, фильтрами по рубрикам и авторами, а также сортировкой по дате и популярности.'
            : 'Мәтін бойынша іздеу, санаттар мен авторлар фильтрі және күн мен танымалдық бойынша сұрыптау бар бірыңғай редакциялық лента.'
        }
      />

      <form className="news-filter-form lg:grid-cols-4">
        <input
          name="q"
          defaultValue={q}
          placeholder={t(safeLang, 'searchPlaceholder')}
          className="news-input"
        />
        <select name="category" defaultValue={safeCategory} className="news-input">
          <option value="">{t(safeLang, 'allCategories')}</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {localize(item.name, safeLang)}
            </option>
          ))}
        </select>
        <select name="author" defaultValue={safeAuthor} className="news-input">
          <option value="">{t(safeLang, 'allAuthors')}</option>
          {authors.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={safeSort} className="news-input">
          <option value="newest">{t(safeLang, 'sortNewest')}</option>
          <option value="popular">{t(safeLang, 'sortPopular')}</option>
          <option value="oldest">{t(safeLang, 'sortOldest')}</option>
        </select>
        <div className="flex flex-wrap gap-2 lg:col-span-4">
          <button type="submit" className="news-btn-primary">
            {t(safeLang, 'applyFilters')}
          </button>
          <Link href={`/${safeLang}/news`} className="news-btn-secondary">
            {t(safeLang, 'clearFilters')}
          </Link>
        </div>
      </form>

      <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)]">
        <section>
          <p className="mb-4 text-sm text-muted-foreground">
            {t(safeLang, 'foundMaterials')}: {articles.length}
          </p>

          {articles.length === 0 ? (
            <p className="border border-dashed border-border px-6 py-14 text-center text-muted-foreground">
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

        <aside className="space-y-6">
          <PopularWidget
            lang={safeLang}
            title={t(safeLang, 'popular24h')}
            items={popular24h}
          />
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
