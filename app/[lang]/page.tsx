import type { Metadata } from 'next'
import Link from 'next/link'
import { subscribeToNewsletterAction } from '@/app/actions'
import { NewsletterForm } from '@/components/public/newsletter-form'
import { HomeHero } from '@/components/public/home-hero'
import { PublicArticleCard } from '@/components/public/article-card'
import { PopularWidget } from '@/components/public/popular-widget'
import { PublicSectionHeading } from '@/components/public/section-heading'
import { PublicSiteShell } from '@/components/public/site-shell'
import { isLang, localize, t, type Lang } from '@/lib/i18n'
import { getHomePageData } from '@/lib/cms/repository'
import { siteConfig } from '@/lib/site-config'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const safeLang = isLang(lang) ? lang : 'ru'

  return {
    title:
      safeLang === 'ru'
        ? 'Главные новости Казахстана'
        : 'Қазақстанның басты жаңалықтары',
    description: siteConfig.description,
    alternates: {
      canonical: `/${safeLang}`,
      languages: {
        ru: '/ru',
        kk: '/kk',
      },
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
  const home = await getHomePageData()

  if (!home.hero) {
    return (
      <PublicSiteShell lang={safeLang} path="">
        <section className="rounded-[2rem] border border-dashed border-border bg-card px-6 py-16 text-center sm:px-10">
          <h1 className="font-heading text-4xl font-bold tracking-tight">
            {t(safeLang, 'brandTitle')}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {safeLang === 'ru'
              ? 'На сайте пока нет опубликованных материалов. Если база только что создана, откройте админку или выполните импорт данных в PostgreSQL.'
              : 'Сайтта әлі жарияланған материалдар жоқ. Егер база жаңа ғана жасалса, админканы ашыңыз немесе деректерді PostgreSQL-ге импорттаңыз.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${safeLang}/news`}
              className="rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:bg-secondary"
            >
              {t(safeLang, 'news')}
            </Link>
            <Link
              href="/admin"
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {safeLang === 'ru' ? 'Открыть админку' : 'Админканы ашу'}
            </Link>
          </div>
        </section>
      </PublicSiteShell>
    )
  }

  return (
    <PublicSiteShell lang={safeLang} path="">
      <div>
        <div className="mb-4">
          <span className="rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-accent-foreground">
            {t(safeLang, 'mainNewsOfDay')}
          </span>
        </div>
        <HomeHero lang={safeLang} lead={home.hero} secondary={home.heroSecondary} />
      </div>

      <div className="mt-12 grid gap-10 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)]">
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

      <div className="mt-14">
        <NewsletterForm lang={safeLang} action={subscribeToNewsletterAction} />
      </div>
    </PublicSiteShell>
  )
}
