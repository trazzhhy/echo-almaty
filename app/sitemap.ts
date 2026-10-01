import type { MetadataRoute } from 'next'
import { categories, hasTranslation, locales } from '@/lib/i18n'
import { getPublicAuthors, getPublishedArticles } from '@/lib/cms/repository'
import { siteConfig } from '@/lib/site-config'

// Rebuild hourly so newly published articles appear without a redeploy.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, authors] = await Promise.all([
    getPublishedArticles(),
    getPublicAuthors(),
  ])

  const staticPages = locales.flatMap((lang) => [
    {
      url: `${siteConfig.baseUrl}/${lang}`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.baseUrl}/${lang}/news`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.baseUrl}/${lang}/categories`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.baseUrl}/${lang}/archive`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.baseUrl}/${lang}/authors`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.baseUrl}/${lang}/about`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.baseUrl}/${lang}/contacts`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.baseUrl}/${lang}/advertising`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.baseUrl}/${lang}/privacy-policy`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.baseUrl}/${lang}/search`,
      lastModified: new Date(),
    },
  ])

  const categoryPages = locales.flatMap((lang) =>
    categories.map((category) => ({
      url: `${siteConfig.baseUrl}/${lang}/category/${category.slug}`,
      lastModified: new Date(),
    })),
  )

  const authorPages = locales.flatMap((lang) =>
    authors.map((author) => ({
      url: `${siteConfig.baseUrl}/${lang}/author/${author.id}`,
      lastModified: author.latestArticle
        ? new Date(author.latestArticle.updatedAt)
        : new Date(),
    })),
  )

  // Untranslated English articles are noindex duplicates of the Russian page.
  const articlePages = locales.flatMap((lang) =>
    articles.filter((article) => hasTranslation(article.title, lang)).map((article) => ({
      url: `${siteConfig.baseUrl}/${lang}/article/${article.slug}`,
      lastModified: new Date(article.updatedAt),
    })),
  )

  return [...staticPages, ...categoryPages, ...authorPages, ...articlePages]
}
