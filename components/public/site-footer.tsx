import Link from 'next/link'
import {
  categories,
  localize,
  primaryNavigation,
  secondaryNavigation,
  t,
  type Lang,
} from '@/lib/i18n'

export function PublicSiteFooter({
  lang,
}: {
  lang: Lang
}) {
  return (
    <footer className="mt-12 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <span className="font-heading text-2xl font-bold">{t(lang, 'brandTitle')}</span>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            {t(lang, 'aboutText')}
          </p>
        </div>

        <div>
          <h2 className="font-heading text-sm font-bold">{t(lang, 'mainSections')}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {primaryNavigation.concat(secondaryNavigation).map((item) => (
              <li key={item.href || 'home'}>
                <Link
                  href={`/${lang}${item.href}`}
                  className="transition-colors hover:text-primary"
                >
                  {t(lang, item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-sm font-bold">{t(lang, 'categoriesPage')}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/${lang}/category/${category.slug}`}
                  className="transition-colors hover:text-primary"
                >
                  {localize(category.name, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-sm font-bold">{t(lang, 'contacts')}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>info@echoalmaty.kz</li>
            <li>ads@echoalmaty.kz</li>
            <li>+7 (7172) 00-00-00</li>
            <li>{lang === 'ru' ? 'Алматы, Казахстан' : 'Алматы, Қазақстан'}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {t(lang, 'brandTitle')}. {t(lang, 'rights')}
          </span>
          <span>{t(lang, 'brandTagline')}</span>
        </div>
      </div>
    </footer>
  )
}
