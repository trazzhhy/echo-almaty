import Image from 'next/image'
import Link from 'next/link'
import { getCategoryBySlug, localize, t, type Lang } from '@/lib/i18n'
import { relativeTime } from '@/lib/time'
import type { Article } from '@/lib/cms/types'

type Variant = 'default' | 'compact' | 'row'

export function PublicArticleCard({
  article,
  lang,
  variant = 'default',
}: {
  article: Article
  lang: Lang
  variant?: Variant
}) {
  const category = getCategoryBySlug(article.categories[0] ?? '')
  const href = `/${lang}/article/${article.slug}`

  if (variant === 'row') {
    return (
      <Link
        href={href}
        className="group flex gap-4 rounded-xl border border-border bg-card p-3 transition-shadow hover:shadow-md"
      >
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={article.mainImage}
            alt={localize(article.title, lang)}
            fill
            sizes="128px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {category && (
              <span className="font-semibold uppercase tracking-wide text-primary">
                {localize(category.name, lang)}
              </span>
            )}
            <span>{relativeTime(article.publishedAt ?? article.updatedAt, lang)}</span>
          </div>
          <h3 className="font-heading text-base font-semibold leading-snug text-balance group-hover:text-primary">
            {localize(article.title, lang)}
          </h3>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={href} className="group block">
        <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={article.mainImage}
            alt={localize(article.title, lang)}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {category && (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {localize(category.name, lang)}
          </span>
        )}
        <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-balance group-hover:text-primary">
          {localize(article.title, lang)}
        </h3>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.mainImage}
          alt={localize(article.title, lang)}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {category && (
            <span className="font-semibold uppercase tracking-[0.18em] text-primary">
              {localize(category.name, lang)}
            </span>
          )}
          {article.breaking && (
            <span className="rounded-full bg-destructive px-2 py-0.5 font-bold uppercase text-primary-foreground">
              Breaking
            </span>
          )}
        </div>
        <h3 className="font-heading text-xl font-semibold leading-snug text-balance group-hover:text-primary">
          {localize(article.title, lang)}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {localize(article.excerpt, lang)}
        </p>
        <div className="mt-auto pt-4 text-xs text-muted-foreground">
          {relativeTime(article.publishedAt ?? article.updatedAt, lang)} · {article.readMinutes}{' '}
          {t(lang, 'minRead')}
        </div>
      </div>
    </Link>
  )
}
