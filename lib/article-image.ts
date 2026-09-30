/**
 * Cover shown for articles saved without a main image. Replace the file in
 * /public (or point this path elsewhere) to change it site-wide.
 */
export const ARTICLE_PLACEHOLDER_IMAGE = '/news/placeholder.svg'

/** The article's main image, or the site-wide placeholder when none is set. */
export function getArticleImage(article: { mainImage?: string | null }): string {
  return article.mainImage?.trim() || ARTICLE_PLACEHOLDER_IMAGE
}
