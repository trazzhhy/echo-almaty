import { PublicArticleCard } from '@/components/public/article-card'
import type { Article } from '@/lib/cms/types'
import type { Lang } from '@/lib/i18n'

export function PopularWidget({
  lang,
  title,
  items,
}: {
  lang: Lang
  title: string
  items: Article[]
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="border border-border bg-card p-4">
      <h2 className="news-section-heading">{title}</h2>
      <div>
        {items.map((article) => (
          <PublicArticleCard
            key={article.id}
            article={article}
            lang={lang}
            variant="row"
          />
        ))}
      </div>
    </section>
  )
}
