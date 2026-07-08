import Link from 'next/link'
import { t, type Lang } from '@/lib/i18n'
import type { Article, AuthUser } from '@/lib/cms/types'
import { fullDate } from '@/lib/time'

type AuthorCardUser = AuthUser & {
  articleCount: number
  totalViews: number
  latestArticle: Article | null
}

export function PublicAuthorCard({
  author,
  lang,
}: {
  author: AuthorCardUser
  lang: Lang
}) {
  return (
    <article className="rounded-[2rem] border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">
            {author.role}
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold">{author.name}</h2>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
          {author.articleCount} {t(lang, 'materials')}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {author.bio[lang]}
      </p>

      {author.latestArticle ? (
        <div className="mt-5 rounded-3xl bg-secondary/60 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {t(lang, 'publishedAt')}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6">
            {author.latestArticle.title[lang]}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {fullDate(author.latestArticle.publishedAt ?? author.latestArticle.updatedAt, lang)}
          </p>
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {author.totalViews.toLocaleString(lang === 'ru' ? 'ru-RU' : 'kk-KZ')} {t(lang, 'views')}
        </span>
        <Link
          href={`/${lang}/author/${author.id}`}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:bg-secondary"
        >
          {t(lang, 'readMore')}
        </Link>
      </div>
    </article>
  )
}
