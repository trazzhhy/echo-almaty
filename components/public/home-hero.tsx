import Image from 'next/image'
import Link from 'next/link'
import { getCategoryBySlug, localize, t, type Lang } from '@/lib/i18n'
import { relativeTime } from '@/lib/time'
import type { Article } from '@/lib/cms/types'

export function HomeHero({
  lang,
  lead,
  secondary,
}: {
  lang: Lang
  lead: Article
  secondary: Article[]
}) {
  const category = getCategoryBySlug(lead.categories[0] ?? '')

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
      <Link
        href={`/${lang}/article/${lead.slug}`}
        className="group news-divider block bg-card pb-4"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={lead.mainImage}
            alt={localize(lead.title, lang)}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <div className="pt-4">
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 news-meta">
            {lead.breaking && <span className="news-breaking">Breaking</span>}
            {category && (
              <span className="news-category">{localize(category.name, lang)}</span>
            )}
            <span>
              {relativeTime(lead.publishedAt ?? lead.updatedAt, lang)} · {lead.readMinutes}{' '}
              {t(lang, 'minRead')}
            </span>
          </div>
          <h1 className="max-w-4xl font-heading text-3xl font-bold leading-tight text-balance sm:text-4xl group-hover:text-primary">
            {localize(lead.title, lang)}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            {localize(lead.excerpt, lang)}
          </p>
        </div>
      </Link>

      <div className="divide-y divide-border border border-border bg-card">
        {secondary.map((article) => {
          const secondaryCategory = getCategoryBySlug(article.categories[0] ?? '')
          return (
            <Link
              key={article.id}
              href={`/${lang}/article/${article.slug}`}
              className="group flex gap-3 p-3 transition-colors hover:bg-secondary/40"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden bg-muted sm:h-24 sm:w-32">
                <Image
                  src={article.mainImage}
                  alt={localize(article.title, lang)}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 news-meta">
                  {secondaryCategory && (
                    <span className="news-category">{localize(secondaryCategory.name, lang)}</span>
                  )}
                  <span>{relativeTime(article.publishedAt ?? article.updatedAt, lang)}</span>
                </div>
                <h2 className="font-heading text-base font-semibold leading-snug text-balance group-hover:text-primary sm:text-lg">
                  {localize(article.title, lang)}
                </h2>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
