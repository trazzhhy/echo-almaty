import Link from 'next/link'
import { t, type Lang } from '@/lib/i18n'

export function PublicSectionHeading({
  lang,
  title,
  href,
}: {
  lang: Lang
  title: string
  href?: string
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="news-section-heading">{title}</h2>
      {href && (
        <Link
          href={href}
          className="shrink-0 pb-3 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {t(lang, 'more')}
        </Link>
      )}
    </div>
  )
}
