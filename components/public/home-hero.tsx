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
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.9fr)]">
      <Link
        href={`/${lang}/article/${lead.slug}`}
        className="group relative overflow-hidden rounded-[2rem]"
      >
        <div className="relative aspect-[16/10] overflow-hidden lg:aspect-[16/9]">
          <Image
            src={lead.mainImage}
            alt={localize(lead.title, lang)}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            {lead.breaking && (
              <span className="rounded-full bg-destructive px-3 py-1 font-bold uppercase">
                Breaking
              </span>
            )}
            {category && (
              <span className="rounded-full bg-accent px-3 py-1 font-bold uppercase text-accent-foreground">
                {localize(category.name, lang)}
              </span>
            )}
          </div>
          <h1 className="max-w-4xl font-heading text-4xl font-bold leading-tight text-balance sm:text-5xl">
            {localize(lead.title, lang)}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/85 sm:text-base">
            {localize(lead.excerpt, lang)}
          </p>
          <div className="mt-4 text-xs uppercase tracking-[0.24em] text-white/70">
            {relativeTime(lead.publishedAt ?? lead.updatedAt, lang)} · {lead.readMinutes}{' '}
            {t(lang, 'minRead')}
          </div>
        </div>
      </Link>

      <div className="grid gap-5">
        {secondary.map((article) => {
          const secondaryCategory = getCategoryBySlug(article.categories[0] ?? '')
          return (
            <Link
              key={article.id}
              href={`/${lang}/article/${article.slug}`}
              className="group relative overflow-hidden rounded-[1.5rem]"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={article.mainImage}
                  alt={localize(article.title, lang)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                {secondaryCategory && (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                    {localize(secondaryCategory.name, lang)}
                  </span>
                )}
                <h2 className="mt-2 font-heading text-xl font-semibold leading-snug text-balance">
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
