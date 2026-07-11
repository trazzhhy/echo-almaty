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
    <header className="bg-card">
      <div className="border-y border-foreground/20 bg-background">
        <div className="mx-auto grid min-h-9 max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 text-[11px] text-muted-foreground md:grid-cols-[1fr_auto_1fr]">
          <span className="capitalize tabular-nums">{longDate(lang)}</span>
          <nav
            aria-label={lang === 'ru' ? 'Служебная навигация' : 'Қызметтік навигация'}
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
          <LanguageSwitcher lang={lang} path={path} className="justify-self-end" />
        </div>
      </div>

      <div className="mx-auto grid min-h-[76px] max-w-7xl grid-cols-[56px_1fr_56px] border-x border-foreground/20 sm:min-h-[88px] md:grid-cols-[minmax(180px,1fr)_auto_minmax(180px,1fr)]">
        <div className="flex items-center border-r border-foreground/20 px-3 md:px-5">
          <Link
            href={`/${lang}/categories`}
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <Menu aria-hidden className="size-5" strokeWidth={1.7} />
            <span className="hidden lg:inline">{t(lang, 'categoriesPage')}</span>
          </Link>
        </div>

        <Link
          href={`/${lang}`}
          className="flex min-w-0 items-center justify-center px-3 text-center"
          aria-label={t(lang, 'brandTitle')}
        >
          <span className="font-brand whitespace-nowrap text-[clamp(1.55rem,3.1vw,2.8rem)] font-extrabold leading-none tracking-[-0.035em] text-foreground">
            {t(lang, 'brandTitle')}
          </span>
        </Link>

        <div className="flex items-center justify-end border-l border-foreground/20 px-3 md:px-5">
          <span className="hidden max-w-44 text-right text-[11px] leading-4 text-muted-foreground lg:block">
            {t(lang, 'brandTagline')}
          </span>
          <Link
            href={`/${lang}/search`}
            className="ml-4 inline-flex size-8 items-center justify-center transition-colors duration-200 hover:text-primary lg:hidden"
            aria-label={t(lang, 'search')}
          >
            <Search aria-hidden className="size-5" strokeWidth={1.7} />
          </Link>
        </div>
      </div>

      <div className="border-y border-foreground/20">
        <div className="mx-auto grid max-w-7xl grid-cols-[48px_minmax(0,1fr)] border-x border-foreground/20 lg:grid-cols-[132px_minmax(0,1fr)_250px]">
          <Link
            href={`/${lang}/news`}
            className="flex min-h-11 items-center justify-center border-r border-foreground/20 text-sm font-medium transition-colors duration-200 hover:bg-secondary lg:justify-start lg:px-4"
            aria-label={t(lang, 'news')}
          >
            <Menu aria-hidden className="size-4 lg:mr-2" strokeWidth={1.7} />
            <span className="hidden lg:inline">{t(lang, 'news')}</span>
          </Link>

          <nav
            aria-label={t(lang, 'mainSections')}
            className="flex min-w-0 items-stretch overflow-x-auto"
          >
            {primaryNavigation.map((item) => {
              const active = isActivePath(path, item.href)

              return (
                <Link
                  key={item.href || 'home'}
                  href={`/${lang}${item.href}`}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex min-h-11 shrink-0 items-center px-4 text-sm transition-colors duration-200 hover:bg-secondary ${
                    active ? 'font-semibold text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {t(lang, item.label)}
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-4 bottom-0 h-0.5 bg-foreground"
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

      <div className="bg-foreground text-background">
        <nav
          aria-label={t(lang, 'categoriesPage')}
          className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2.5"
        >
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${lang}/category/${category.slug}`}
              className="whitespace-nowrap text-xs font-medium text-background/72 transition-colors duration-200 hover:text-background"
            >
              {localize(category.name, lang)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
