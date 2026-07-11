import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
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
  const [featured, ...remaining] = summaries
  const topics = remaining.slice(0, 4)
  const formats = remaining.slice(4)

  return (
    <PublicSiteShell
      lang={safeLang}
      path="/categories"
      mainClassName="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:pt-10"
    >
      <header className="border-b border-foreground/20 pb-7">
        <p className="text-sm font-medium text-primary">{t(safeLang, 'categoriesPage')}</p>
        <h1 className="mt-2 max-w-4xl font-heading text-[clamp(2.25rem,5vw,4.75rem)] font-bold leading-[0.98] tracking-[-0.035em] text-balance">
          {safeLang === 'ru' ? 'Темы, которые формируют повестку' : 'Күн тәртібін қалыптастыратын тақырыптар'}
        </h1>
        <p className="mt-5 max-w-[64ch] text-base leading-7 text-muted-foreground">
          {safeLang === 'ru'
            ? 'Новости, решения и события собраны по редакционным рубрикам. Выберите тему, чтобы открыть полную ленту.'
            : 'Жаңалықтар, шешімдер мен оқиғалар редакциялық санаттар бойынша жинақталған. Толық лентаны ашу үшін тақырыпты таңдаңыз.'}
        </p>
      </header>

      {featured ? (
        <section className="mt-8">
          <Link
            href={`/${safeLang}/category/${featured.category.slug}`}
            className="group grid overflow-hidden border border-foreground/20 bg-card md:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.8fr)]"
          >
            {featured.latestArticle ? (
              <div className="relative min-h-64 overflow-hidden bg-muted md:min-h-[390px]">
                <Image
                  src={featured.latestArticle.mainImage}
                  alt={localize(featured.latestArticle.title, safeLang)}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 65vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                />
              </div>
            ) : (
              <div className="min-h-64 bg-secondary md:min-h-[390px]" aria-hidden />
            )}

            <div className="flex min-h-72 flex-col p-5 sm:p-7">
              <div className="flex items-start justify-between gap-5">
                <span className="text-xs font-semibold text-primary">
                  {featured.count} {t(safeLang, 'materials')}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.6}
                />
              </div>

              <h2 className="mt-auto font-heading text-[clamp(2rem,4vw,3.75rem)] font-bold leading-none tracking-[-0.03em] transition-colors duration-200 group-hover:text-primary">
                {localize(featured.category.name, safeLang)}
              </h2>

              {featured.latestArticle ? (
                <>
                  <p className="mt-5 line-clamp-3 text-base font-medium leading-6">
                    {localize(featured.latestArticle.title, safeLang)}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {relativeTime(
                      featured.latestArticle.publishedAt ?? featured.latestArticle.updatedAt,
                      safeLang,
                    )}
                  </p>
                </>
              ) : (
                <p className="mt-5 text-sm text-muted-foreground">{t(safeLang, 'noResults')}</p>
              )}
            </div>
          </Link>
        </section>
      ) : null}

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between gap-5 border-b border-foreground/20 pb-3">
          <h2 className="font-heading text-2xl font-bold tracking-[-0.02em]">
            {safeLang === 'ru' ? 'Основные темы' : 'Негізгі тақырыптар'}
          </h2>
          <span className="hidden text-xs text-muted-foreground sm:block">
            {safeLang === 'ru' ? 'Последнее обновление рубрик' : 'Санаттардың соңғы жаңартылуы'}
          </span>
        </div>

        <div className="divide-y divide-foreground/20 border-b border-foreground/20">
          {topics.map((summary, index) => (
            <Link
              key={summary.category.slug}
              href={`/${safeLang}/category/${summary.category.slug}`}
              className="group grid gap-3 py-5 transition-colors duration-200 hover:bg-secondary/55 sm:grid-cols-[42px_minmax(180px,0.55fr)_minmax(0,1fr)_auto] sm:items-center sm:px-3"
            >
              <span className="text-xs tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-xl font-bold tracking-[-0.02em] transition-colors duration-200 group-hover:text-primary sm:text-2xl">
                {localize(summary.category.name, safeLang)}
              </h3>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-medium leading-6">
                  {summary.latestArticle
                    ? localize(summary.latestArticle.title, safeLang)
                    : t(safeLang, 'noResults')}
                </p>
                {summary.latestArticle ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {relativeTime(
                      summary.latestArticle.publishedAt ?? summary.latestArticle.updatedAt,
                      safeLang,
                    )}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-4 sm:justify-end">
                <span className="text-xs tabular-nums text-muted-foreground">
                  {summary.count} {t(safeLang, 'materials')}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.6}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {formats.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-4 font-heading text-2xl font-bold tracking-[-0.02em]">
            {safeLang === 'ru' ? 'Форматы редакции' : 'Редакция форматтары'}
          </h2>
          <div className="grid border border-foreground/20 md:grid-cols-2 md:divide-x md:divide-foreground/20">
            {formats.map((summary, index) => (
              <Link
                key={summary.category.slug}
                href={`/${safeLang}/category/${summary.category.slug}`}
                className={`group flex min-h-64 flex-col p-5 transition-colors duration-200 sm:p-7 ${
                  index > 0 ? 'border-t border-foreground/20 md:border-t-0' : ''
                } ${index === 0 ? 'bg-foreground text-background' : 'bg-card text-foreground'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`text-xs ${
                      index === 0 ? 'text-background/65' : 'text-muted-foreground'
                    }`}
                  >
                    {summary.count} {t(safeLang, 'materials')}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.6}
                  />
                </div>

                <h3 className="mt-auto font-heading text-[clamp(2rem,4vw,3.25rem)] font-bold leading-none tracking-[-0.03em]">
                  {localize(summary.category.name, safeLang)}
                </h3>
                <p
                  className={`mt-4 line-clamp-2 max-w-[48ch] text-sm leading-6 ${
                    index === 0 ? 'text-background/70' : 'text-muted-foreground'
                  }`}
                >
                  {summary.latestArticle
                    ? localize(summary.latestArticle.excerpt, safeLang)
                    : t(safeLang, 'noResults')}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </PublicSiteShell>
  )
}
