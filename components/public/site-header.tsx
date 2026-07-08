import Link from 'next/link'
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

export function PublicSiteHeader({
  lang,
  path,
}: {
  lang: Lang
  path: string
}) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur">
      <div className="border-b border-border bg-secondary/55">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-xs text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <span className="capitalize">{longDate(lang)}</span>
          <div className="flex flex-wrap items-center gap-4">
            <span>{t(lang, 'editorialUpdate')}</span>
            <div className="flex flex-wrap items-center gap-3">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={`/${lang}${item.href}`}
                  className="transition-colors hover:text-foreground"
                >
                  {t(lang, item.label)}
                </Link>
              ))}
            </div>
            <LanguageSwitcher lang={lang} path={path} />
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link href={`/${lang}`} className="inline-flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary font-heading text-2xl font-bold text-primary-foreground">
              Э
            </span>
            <span>
              <span className="block font-heading text-4xl font-bold leading-none">
                {t(lang, 'brandTitle')}
              </span>
              <span className="block text-sm uppercase tracking-[0.24em] text-muted-foreground">
                {t(lang, 'brandTagline')}
              </span>
            </span>
          </Link>
        </div>

        <form action={`/${lang}/search`} className="w-full lg:max-w-md">
          <label className="sr-only" htmlFor="site-search">
            {t(lang, 'search')}
          </label>
          <input
            id="site-search"
            name="q"
            placeholder={t(lang, 'searchPlaceholder')}
            className="h-12 w-full rounded-full border border-border bg-secondary/55 px-5 text-sm outline-none transition focus:border-primary"
          />
        </form>
      </div>

      <nav className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href || 'home'}
              href={`/${lang}${item.href}`}
              className="whitespace-nowrap px-3 py-3 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
            >
              {t(lang, item.label)}
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-border bg-card/80">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-3">
          <span className="shrink-0 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
            {t(lang, 'categoriesPage')}
          </span>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${lang}/category/${category.slug}`}
              className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
            >
              {localize(category.name, lang)}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
