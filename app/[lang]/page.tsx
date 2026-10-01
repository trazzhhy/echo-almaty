import type { Metadata } from 'next'
import Link from 'next/link'
import { subscribeToNewsletterAction } from '@/app/actions'
import { NewsletterForm } from '@/components/public/newsletter-form'
import { HomeAdBanner } from '@/components/public/home-ad-banners'
import { getHomeAdBanners } from '@/lib/cms/ad-banners'
import { HomeHero } from '@/components/public/home-hero'
import { PublicArticleCard } from '@/components/public/article-card'
import { PopularWidget } from '@/components/public/popular-widget'
import { SocialCard } from '@/components/public/social-links'
import { PublicSectionHeading } from '@/components/public/section-heading'
import { PublicSiteShell } from '@/components/public/site-shell'
import { isLang, languageAlternates, localize, t, type Lang } from '@/lib/i18n'
import { getHomePageData } from '@/lib/cms/repository'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const safeLang = isLang(lang) ? lang : 'ru'

  const headline = localize(
    {
      ru: 'Главные новости Казахстана',
      kk: 'Қазақстанның басты жаңалықтары',
      en: 'Top news from Kazakhstan',
    },
    safeLang,
  )

  return {
    // The [lang] layout's title template doesn't apply to its own segment.
    title: { absolute: `${headline} | ${t(safeLang, 'brandTitle')}` },
    description: t(safeLang, 'siteDescription'),
    alternates: {
      canonical: `/${safeLang}`,
      languages: languageAlternates(),
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const safeLang: Lang = isLang(lang) ? lang : 'ru'
  const [home, adBanners] = await Promise.all([
    getHomePageData(),
    getHomeAdBanners(),
  ])
  const [topBanner, middleBanner, bottomBanner] = adBanners

  if (!home.hero) {
    return (
      <PublicSiteShell lang={safeLang} path="">
        <section className="border border-dashed border-border bg-card px-6 py-14 text-center sm:px-10">
          <h1 className="font-heading text-4xl font-bold tracking-tight">
            {t(safeLang, 'brandTitle')}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {localize(
              {
                ru: 'На сайте пока нет опубликованных материалов. Если база только что создана, откройте админку или выполните импорт данных в PostgreSQL.',
                kk: 'Сайтта әлі жарияланған материалдар жоқ. Егер база жаңа ғана жасалса, админканы ашыңыз немесе деректерді PostgreSQL-ге импорттаңыз.',
                en: 'There are no published stories yet. If the database was just created, open the admin panel or import the data into PostgreSQL.',
              },
              safeLang,
            )}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${safeLang}/news`}
              className="border border-border px-5 py-2.5 text-sm font-semibold transition hover:bg-secondary"
            >
              {t(safeLang, 'news')}
            </Link>
            <Link
              href="/admin"
              className="bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {localize({ ru: 'Открыть админку', kk: 'Админканы ашу', en: 'Open admin panel' }, safeLang)}
            </Link>
          </div>
        </section>
      </PublicSiteShell>
    )
  }

  return (
    <PublicSiteShell lang={safeLang} path="">
      <HomeHero lang={safeLang} lead={home.hero} secondary={home.heroSecondary} />

      {/* Banner 1 — leaderboard between hero and latest feed */}
      <HomeAdBanner lang={safeLang} banner={topBanner} className="mt-8" />

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)]">
        <section>
          <PublicSectionHeading
            lang={safeLang}
            title={t(safeLang, 'latestFeed')}
            href={`/${safeLang}/news`}
          />
          <div className="grid gap-6 md:grid-cols-2">
            {home.latestFeed.map((article) => (
              <PublicArticleCard
                key={article.id}
                article={article}
                lang={safeLang}
              />
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          {/* Wide desktops get the fixed side rail instead (see SocialRail). */}
          <SocialCard lang={safeLang} className="min-[1440px]:hidden" />
          <PopularWidget
            lang={safeLang}
            title={t(safeLang, 'popular24h')}
            items={home.popular24h}
          />
          <PopularWidget
            lang={safeLang}
            title={t(safeLang, 'popularWeek')}
            items={home.popularWeek}
          />
        </aside>
      </div>

      {/* Banner 2 — between feed grid and category sections */}
      <HomeAdBanner lang={safeLang} banner={middleBanner} className="mt-10" />

      <div className="mt-12 space-y-12">
        {home.sections.map((section) => (
          <section key={section.category.slug}>
            <PublicSectionHeading
              lang={safeLang}
              title={localize(section.category.name, safeLang)}
              href={`/${safeLang}/category/${section.category.slug}`}
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {section.items.map((article) => (
                <PublicArticleCard
                  key={article.id}
                  article={article}
                  lang={safeLang}
                  variant="compact"
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Banner 3 — before newsletter */}
      <HomeAdBanner lang={safeLang} banner={bottomBanner} className="mt-10" />

      <div className="mt-14">
        <NewsletterForm lang={safeLang} action={subscribeToNewsletterAction} />
      </div>
    </PublicSiteShell>
  )
}
