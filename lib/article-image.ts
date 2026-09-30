/**
 * Cover shown for articles saved without a main image. Replace the file in
 * /public (or point this path elsewhere) to change it site-wide.
 */
export const ARTICLE_PLACEHOLDER_IMAGE = '/news/placeholder.svg'

/** The article's main image, or the site-wide placeholder when none is set. */
export function getArticleImage(article: { mainImage?: string | null }): string {
  return article.mainImage?.trim() || ARTICLE_PLACEHOLDER_IMAGE
}

// Hosts next/image may optimize (keep in sync with images.remotePatterns in
// next.config.mjs). Editors can paste links to any other site; those are
// rendered as-is, since next/image throws on unconfigured hosts.
function isOptimizableImage(src: string): boolean {
  if (src.startsWith('/')) return true

  try {
    const { hostname } = new URL(src)
    const storageBase = process.env.STORAGE_PUBLIC_BASE_URL
    return (
      hostname.endsWith('.public.blob.vercel-storage.com') ||
      (storageBase ? hostname === new URL(storageBase).hostname : false)
    )
  } catch {
    return false
  }
}

/** `src` plus `unoptimized` for spreading into next/image. */
export function imageSrcProps(src: string) {
  return { src, unoptimized: !isOptimizableImage(src) }
}

/** next/image props for an article's main image (placeholder when unset). */
export function articleImageProps(article: { mainImage?: string | null }) {
  return imageSrcProps(getArticleImage(article))
}
