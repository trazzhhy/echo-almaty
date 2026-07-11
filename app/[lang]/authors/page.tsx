import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PublicSiteShell } from '@/components/public/site-shell'
import { getPublicAuthors } from '@/lib/cms/repository'
import { isLang, t, type Lang } from '@/lib/i18n'
import { fullDate } from '@/lib/time'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const safeLang = isLang(lang) ? lang : 'ru'

  return {
    title: safeLang === 'ru' ? 'Авторы Эхо Алматы' : 'Эхо Алматы авторлары',
  }
}

export default async function AuthorsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const safeLang: Lang = isLang(lang) ? lang : 'ru'
  const authors = await getPublicAuthors()

  return (
    <PublicSiteShell
      lang={safeLang}
      path="/authors"
      mainClassName="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:pt-10"
    >
      <header className="grid gap-6 border-b border-foreground/20 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] lg:items-end">
        <div>
          <p className="text-sm font-medium text-primary">{t(safeLang, 'authors')}</p>
          <h1 className="mt-2 max-w-4xl font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.96] tracking-[-0.035em] text-balance">
            {t(safeLang, 'authorsDesk')}
          </h1>
        </div>
        <p className="max-w-[52ch] text-base leading-7 text-muted-foreground lg:pb-1">
          {safeLang === 'ru'
            ? 'Редакторы и журналисты, которые каждый день проверяют факты, объясняют решения и рассказывают истории города.'
            : 'Күн сайын деректерді тексеріп, шешімдерді түсіндіретін және қала оқиғаларын баяндайтын редакторлар мен журналистер.'}
        </p>
      </header>

      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between gap-4">
          <h2 className="font-heading text-2xl font-bold tracking-[-0.02em]">
            {safeLang === 'ru' ? 'Редакция' : 'Редакция'}
          </h2>
          <span className="text-sm tabular-nums text-muted-foreground">
            {authors.length} {t(safeLang, 'authors')}
          </span>
        </div>

        <div className="divide-y divide-foreground/20 border-y border-foreground/20">
          {authors.map((author, index) => (
            <Link
              key={author.id}
              href={`/${safeLang}/author/${author.id}`}
              className="group grid gap-5 py-6 transition-colors duration-200 hover:bg-secondary/55 sm:px-3 lg:grid-cols-[48px_minmax(190px,0.55fr)_minmax(0,1fr)_minmax(190px,0.6fr)_auto] lg:items-center"
            >
              <span className="text-xs tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-heading text-2xl font-bold tracking-[-0.02em] transition-colors group-hover:text-primary">
                  {author.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{author.role}</p>
              </div>
              <p className="max-w-[58ch] text-sm leading-6 text-muted-foreground">
                {author.bio[safeLang]}
              </p>
              <div>
                {author.latestArticle ? (
                  <>
                    <p className="line-clamp-2 text-sm font-medium leading-6">
                      {author.latestArticle.title[safeLang]}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {fullDate(
                        author.latestArticle.publishedAt ?? author.latestArticle.updatedAt,
                        safeLang,
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">{t(safeLang, 'noResults')}</p>
                )}
              </div>
              <div className="flex items-center justify-between gap-5 lg:justify-end">
                <span className="text-xs tabular-nums text-muted-foreground">
                  {author.articleCount} {t(safeLang, 'materials')}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.6}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicSiteShell>
  )
}
