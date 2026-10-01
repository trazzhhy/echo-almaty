import Link from 'next/link'
import { Menu, Search } from 'lucide-react'
import {
  categories,
  localize,
  primaryNavigation,
  secondaryNavigation,
  t,
  type Lang,
} from '@/lib/i18n'
import { longDate } from '@/lib/time'
import { LanguageSwitcher } from './language-switcher'

function isActivePath(path: string, href: string) {
  if (!href) return path === '' || path === '/'
  return path === href || path.startsWith(`${href}/`)
}

export function PublicSiteHeader({
  lang,
  path,
}: {
  lang: Lang
  path: string
}) {
  return (
    <header className="border-b border-foreground/20 bg-card">
      <div className="border-b border-foreground/20 bg-background">
        <div className="public-container flex min-h-9 items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <span className="min-w-0 truncate tabular-nums first-letter:uppercase">{longDate(lang)}</span>
          <nav
            aria-label={t(lang, 'serviceNavigation')}
            className="hidden items-center gap-5 md:flex"
          >
            {secondaryNavigation.map((item) => (
              <Link
                key={item.href}
                href={`/${lang}${item.href}`}
                className="transition-colors duration-200 hover:text-foreground"
              >
                {t(lang, item.label)}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher lang={lang} path={path} className="shrink-0" />
        </div>
      </div>

      <div className="border-b border-foreground/20">
        <div className="public-container grid min-h-16 grid-cols-[minmax(2.5rem,1fr)_auto_minmax(2.5rem,1fr)] items-center gap-2 py-2.5 sm:min-h-[80px] sm:gap-4 sm:py-3">
          <Link
            href={`/${lang}/categories`}
            aria-label={t(lang, 'categoriesPage')}
            className="-ml-2 inline-flex min-h-10 min-w-10 items-center justify-center gap-2 justify-self-start text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground sm:min-w-0 sm:px-1"
          >
            <Menu aria-hidden className="size-5 shrink-0" strokeWidth={1.7} />
            <span className="hidden lg:inline">{t(lang, 'categoriesPage')}</span>
          </Link>

          <Link
            href={`/${lang}`}
            className="flex min-w-0 items-center justify-center px-1 text-center"
            aria-label={t(lang, 'brandTitle')}
          >
            <span className="font-brand max-w-full truncate text-[clamp(1.5rem,6.5vw,2.8rem)] font-extrabold leading-none tracking-[-0.035em] text-foreground">
              {t(lang, 'brandTitle')}
            </span>
          </Link>

          <div className="-mr-2 flex min-h-10 items-center justify-end gap-2 justify-self-end sm:gap-3">
            <span className="hidden max-w-44 text-right text-[11px] leading-4 text-muted-foreground xl:block">
              {t(lang, 'brandTagline')}
            </span>
            <Link
              href={`/${lang}/search`}
              className="inline-flex size-10 items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-primary xl:hidden"
              aria-label={t(lang, 'search')}
            >
              <Search aria-hidden className="size-5" strokeWidth={1.7} />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-foreground/20">
        <div className="public-container">
          <div className="grid min-h-11 grid-cols-[minmax(0,1fr)] items-stretch sm:grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,1fr)_minmax(220px,250px)]">
            <Link
              href={`/${lang}/news`}
              className="hidden min-h-11 items-center justify-center gap-2 border-r border-foreground/20 px-3 text-sm font-medium sm:flex transition-colors duration-200 hover:bg-secondary lg:px-4"
            >
              <Menu aria-hidden className="size-4 shrink-0" strokeWidth={1.7} />
              <span className="hidden sm:inline">{t(lang, 'news')}</span>
            </Link>

            <nav
              aria-label={t(lang, 'mainSections')}
              className="scroll-fade-x -mx-4 flex min-w-0 items-stretch overflow-x-auto px-1 [-ms-overflow-style:none] sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {primaryNavigation.map((item) => {
                const active = isActivePath(path, item.href)

                return (
                  <Link
                    key={item.href || 'home'}
                    href={`/${lang}${item.href}`}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex min-h-11 shrink-0 items-center px-3 text-sm transition-colors duration-200 hover:bg-secondary sm:px-4 ${
                      active ? 'font-semibold text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {t(lang, item.label)}
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-x-3 bottom-0 h-0.5 bg-foreground sm:inset-x-4"
                      />
                    ) : null}
                  </Link>
                )
              })}
            </nav>

            <form
              action={`/${lang}/search`}
              className="hidden min-h-11 items-center border-l border-foreground/20 lg:flex"
            >
              <label className="sr-only" htmlFor="site-search">
                {t(lang, 'search')}
              </label>
              <input
                id="site-search"
                name="q"
                placeholder={t(lang, 'searchPlaceholder')}
                className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:bg-secondary/60"
              />
              <button
                type="submit"
                className="flex h-full w-11 shrink-0 items-center justify-center border-l border-foreground/20 transition-colors duration-200 hover:bg-secondary"
                aria-label={t(lang, 'search')}
              >
                <Search aria-hidden className="size-4" strokeWidth={1.7} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-foreground text-background">
        <nav
          aria-label={t(lang, 'categoriesPage')}
          className="public-container scroll-fade-x flex items-center gap-5 overflow-x-auto py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => {
            const active = isActivePath(path, `/category/${category.slug}`)

            return (
              <Link
                key={category.slug}
                href={`/${lang}/category/${category.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`shrink-0 whitespace-nowrap text-xs font-medium transition-colors duration-200 hover:text-background ${
                  active ? 'text-background underline decoration-2 underline-offset-[6px]' : 'text-background/72'
                }`}
              >
                {localize(category.name, lang)}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
