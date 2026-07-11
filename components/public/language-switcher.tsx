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
        'inline-flex items-center divide-x divide-foreground/20 border-x border-foreground/20 text-[10px] font-semibold',
        className,
      )}
    >
      <Link
        href={`/${lang}${path}`}
        className="px-2.5 py-1.5 text-foreground"
        aria-current="true"
      >
        {lang === 'ru' ? 'РУС' : 'ҚАЗ'}
      </Link>
      <Link
        href={`/${alternate}${path}`}
        className="px-2.5 py-1.5 text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground"
      >
        {alternate === 'ru' ? 'РУС' : 'ҚАЗ'}
      </Link>
    </div>
  )
}
