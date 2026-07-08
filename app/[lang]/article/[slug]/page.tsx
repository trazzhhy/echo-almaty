import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicArticleCard } from '@/components/public/article-card'
import { ArticleViewTracker } from '@/components/public/article-view-tracker'
import { PopularWidget } from '@/components/public/popular-widget'
import { PublicSectionHeading } from '@/components/public/section-heading'
import { PublicSiteShell } from '@/components/public/site-shell'
import {
  getPopularArticles,
  getPublicArticleBySlug,
  getRelatedArticles,
  getUserById,
} from '@/lib/cms/repository'
import { getCategoryBySlug, isLang, localize, t, type Lang } from '@/lib/i18n'
import { fullDate } from '@/lib/time'
import { absoluteUrl, getVideoEmbedUrl, paragraphize } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const safeLang = isLang(lang) ? lang : 'ru'
  const article = await getPublicArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Материал не найден',
    }
  }

  const title = localize(article.seoTitle, safeLang) || localize(article.title, safeLang)
  const description =
    localize(article.seoDescription, safeLang) || localize(article.excerpt, safeLang)

  return {
    title,
    description,
    alternates: {
      canonical: `/${safeLang}/article/${article.slug}`,
      languages: {
        ru: `/ru/article/${article.slug}`,
        kk: `/kk/article/${article.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: absoluteUrl(article.mainImage),
        },
      ],
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const safeLang: Lang = isLang(lang) ? lang : 'ru'
  const article = await getPublicArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const author = await getUserById(article.authorId)
  const [related, popular24h, popularWeek] = await Promise.all([
    getRelatedArticles(article),
    getPopularArticles('24h'),
    getPopularArticles('7d'),
  ])

  return (
    <PublicSiteShell lang={safeLang} path={`/article/${slug}`} mainClassName="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_340px]">
        <div>
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href={`/${safeLang}`} className="hover:text-primary">
            {t(safeLang, 'backToHome')}
          </Link>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          {article.breaking && (
            <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold uppercase text-primary-foreground">
              Breaking
            </span>
          )}
          {article.categories.map((slugItem) => {
            const category = getCategoryBySlug(slugItem)
            if (!category) return null
            return (
              <Link
                key={slugItem}
                href={`/${safeLang}/category/${slugItem}`}
                className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase text-primary-foreground"
              >
                {localize(category.name, safeLang)}
              </Link>
            )
          })}
          {!article.showOnHome && (
            <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
              {t(safeLang, 'hiddenFromHome')}
            </span>
          )}
        </div>

        <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-balance sm:text-5xl">
          {localize(article.title, safeLang)}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          {localize(article.excerpt, safeLang)}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
          <span>
            {t(safeLang, 'publishedAt')}: {fullDate(article.publishedAt ?? article.updatedAt, safeLang)}
          </span>
          <span>
            {article.readMinutes} {t(safeLang, 'minRead')}
          </span>
          <span>
            {article.views.toLocaleString(safeLang === 'ru' ? 'ru-RU' : 'kk-KZ')} {t(safeLang, 'views')}
          </span>
          {author && (
            <span>
              {t(safeLang, 'byAuthor')}: {' '}
              <Link href={`/${safeLang}/author/${author.id}`} className="text-primary hover:underline">
                {author.name}
              </Link>
            </span>
          )}
        </div>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[2rem]">
          <Image
            src={article.mainImage}
            alt={localize(article.title, safeLang)}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover"
          />
        </div>

        <article className="mt-8 space-y-6 text-lg leading-8 text-foreground/90">
          {paragraphize(localize(article.body, safeLang)).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
        <ArticleViewTracker articleId={article.id} />

        {article.gallery.length > 0 && (
          <section className="mt-12">
            <PublicSectionHeading lang={safeLang} title={t(safeLang, 'gallery')} />
            <div className="grid gap-4 sm:grid-cols-2">
              {article.gallery.map((item, index) => (
                <div key={`${item}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={item}
                    alt={`${localize(article.title, safeLang)} ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {article.videoUrls.length > 0 && (
          <section className="mt-12">
            <PublicSectionHeading lang={safeLang} title={t(safeLang, 'videos')} />
            <div className="grid gap-6">
              {article.videoUrls.map((url, index) => {
                const embedUrl = getVideoEmbedUrl(url)
                if (!embedUrl) return null

                return (
                  <div key={`${url}-${index}`} className="overflow-hidden rounded-2xl border border-border">
                    <div className="aspect-video">
                      <iframe
                        src={embedUrl}
                        title={`video-${index}`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {(article.tags.length > 0 || article.sourceName) && (
          <section className="mt-12 rounded-[2rem] border border-border bg-card p-6">
            {article.tags.length > 0 && (
              <div>
                <h2 className="font-heading text-xl font-semibold">{t(safeLang, 'tags')}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/${safeLang}/search?q=${encodeURIComponent(tag)}`}
                      className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {article.sourceName && (
              <p className="mt-6 text-sm text-muted-foreground">
                {t(safeLang, 'source')}: {' '}
                {article.sourceUrl ? (
                  <a
                    href={article.sourceUrl}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {article.sourceName}
                  </a>
                ) : (
                  article.sourceName
                )}
              </p>
            )}
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-14">
            <PublicSectionHeading lang={safeLang} title={t(safeLang, 'relatedNews')} />
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <PublicArticleCard
                  key={item.id}
                  article={item}
                  lang={safeLang}
                  variant="compact"
                />
              ))}
            </div>
          </section>
        )}

        </div>

        <aside className="space-y-6">
          <PopularWidget
            lang={safeLang}
            title={t(safeLang, 'popular24h')}
            items={popular24h}
          />
          <PopularWidget
            lang={safeLang}
            title={t(safeLang, 'popularWeek')}
            items={popularWeek}
          />
        </aside>
      </div>
    </PublicSiteShell>
  )
}
