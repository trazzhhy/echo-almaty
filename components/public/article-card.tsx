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
      <Link href={href} className="group flex gap-3 py-3 news-divider last:border-b-0">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden bg-muted sm:h-[4.5rem] sm:w-28">
          <Image
            src={article.mainImage}
            alt={localize(article.title, lang)}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 news-meta">
            {category && <span className="news-category">{localize(category.name, lang)}</span>}
            <span>{relativeTime(article.publishedAt ?? article.updatedAt, lang)}</span>
          </div>
          <h3 className="font-heading text-sm font-semibold leading-snug text-balance group-hover:text-primary sm:text-base">
            {localize(article.title, lang)}
          </h3>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={href} className="group block">
        <div className="relative mb-2.5 aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={article.mainImage}
            alt={localize(article.title, lang)}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 news-meta">
          {category && <span className="news-category">{localize(category.name, lang)}</span>}
          <span>{relativeTime(article.publishedAt ?? article.updatedAt, lang)}</span>
        </div>
        <h3 className="font-heading text-base font-semibold leading-snug text-balance group-hover:text-primary">
          {localize(article.title, lang)}
        </h3>
      </Link>
    )
  }

  return (
    <Link href={href} className="group flex h-full flex-col border border-border bg-card">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={article.mainImage}
          alt={localize(article.title, lang)}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 news-meta">
          {category && <span className="news-category">{localize(category.name, lang)}</span>}
          {article.breaking && <span className="news-breaking">Breaking</span>}
        </div>
        <h3 className="font-heading text-lg font-semibold leading-snug text-balance group-hover:text-primary">
          {localize(article.title, lang)}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {localize(article.excerpt, lang)}
        </p>
        <div className="mt-auto pt-3 news-meta">
          {relativeTime(article.publishedAt ?? article.updatedAt, lang)} · {article.readMinutes}{' '}
          {t(lang, 'minRead')}
        </div>
      </div>
    </Link>
  )
}
