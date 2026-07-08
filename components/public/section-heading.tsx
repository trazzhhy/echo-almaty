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
    <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
      <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {t(lang, 'more')}
        </Link>
      )}
    </div>
  )
}
