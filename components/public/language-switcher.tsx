import Link from 'next/link'
import { getAlternateLang, type Lang } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({
  lang,
  path,
  className,
}: {
  lang: Lang
  path: string
  className?: string
}) {
  const alternate = getAlternateLang(lang)

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-background p-0.5 text-xs font-semibold',
        className,
      )}
    >
      <Link
        href={`/${lang}${path}`}
        className="rounded-full bg-primary px-2.5 py-1 text-primary-foreground"
      >
        {lang === 'ru' ? 'РУС' : 'ҚАЗ'}
      </Link>
      <Link
        href={`/${alternate}${path}`}
        className="rounded-full px-2.5 py-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        {alternate === 'ru' ? 'РУС' : 'ҚАЗ'}
      </Link>
    </div>
  )
}
