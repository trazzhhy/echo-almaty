import Link from 'next/link'
import { languageLabels, languageSwitcherOrder, t, type Lang } from '@/lib/i18n'
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
  return (
    <nav
      aria-label={t(lang, 'language')}
      className={cn(
        'inline-flex items-center divide-x divide-foreground/20 border-x border-foreground/20 text-[10px] font-semibold',
        className,
      )}
    >
      {languageSwitcherOrder.map((item) => {
        const active = item === lang

        return (
          <Link
            key={item}
            href={`/${item}${path}`}
            hrefLang={item}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'px-2.5 py-1.5',
              active
                ? 'text-foreground'
                : 'text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground',
            )}
          >
            {languageLabels[item]}
          </Link>
        )
      })}
    </nav>
  )
}
