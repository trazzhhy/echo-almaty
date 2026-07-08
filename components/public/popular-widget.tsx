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
    <section className="rounded-[2rem] border border-border bg-card p-5">
      <h2 className="font-heading text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-5 space-y-4">
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
