import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicPageIntro } from '@/components/public/page-intro'
import { PublicSiteShell } from '@/components/public/site-shell'
import { getCategorySummaries } from '@/lib/cms/repository'
import { isLang, localize, t, type Lang } from '@/lib/i18n'
import { relativeTime } from '@/lib/time'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const safeLang = isLang(lang) ? lang : 'ru'

  return {
    title: safeLang === 'ru' ? 'Категории Эхо Алматы' : 'Эхо Алматы санаттары',
  }
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const safeLang: Lang = isLang(lang) ? lang : 'ru'
  const summaries = await getCategorySummaries()

  return (
    <PublicSiteShell lang={safeLang} path="/categories">
      <PublicPageIntro
        eyebrow={t(safeLang, 'categoriesPage')}
        title={t(safeLang, 'browseCategories')}
        description={
          safeLang === 'ru'
            ? 'Каждая рубрика ведет на отдельную страницу с собственной лентой, фильтрами и сортировкой.'
            : 'Әр санат жеке бетке апарады, онда өз лентасы, фильтрлері және сұрыптауы бар.'
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {summaries.map((summary) => (
          <Link
            key={summary.category.slug}
            href={`/${safeLang}/category/${summary.category.slug}`}
            className="rounded-[2rem] border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-heading text-2xl font-bold tracking-tight">
                {localize(summary.category.name, safeLang)}
              </h2>
              <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
                {summary.count}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {summary.latestArticle
                ? summary.latestArticle.excerpt[safeLang]
                : t(safeLang, 'noResults')}
            </p>

            {summary.latestArticle ? (
              <p className="mt-5 text-sm font-semibold">
                {summary.latestArticle.title[safeLang]}
              </p>
            ) : null}

            {summary.latestArticle ? (
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {relativeTime(
                  summary.latestArticle.publishedAt ?? summary.latestArticle.updatedAt,
                  safeLang,
                )}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </PublicSiteShell>
  )
}
