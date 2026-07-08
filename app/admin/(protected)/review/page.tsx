import Link from 'next/link'
import { redirect } from 'next/navigation'
import { updateArticleStateAction } from '@/app/admin/actions'
import { StatusBadge } from '@/components/admin/status-badge'
import { SubmitButton } from '@/components/admin/submit-button'
import { getCurrentUser } from '@/lib/cms/auth'
import { canModerate, canPublish } from '@/lib/cms/permissions'
import { getAdminArticles } from '@/lib/cms/repository'
import { fullDate } from '@/lib/time'

export default async function ReviewQueuePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/admin/login')
  }

  if (!canModerate(user)) {
    redirect('/admin')
  }

  const articles = await getAdminArticles(user)
  const queue = articles.filter((article) => article.status === 'in_review' || article.status === 'rejected')

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
          Модерация
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold">Очередь проверки</h1>
      </div>

      <div className="space-y-4">
        {queue.map((article) => (
          <div key={article.id} className="rounded-[1.75rem] border border-border bg-card p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={article.status} />
                  <span className="text-sm text-muted-foreground">
                    Отправлено {fullDate(article.submittedAt ?? article.updatedAt, 'ru')}
                  </span>
                </div>
                <h2 className="mt-4 font-heading text-2xl font-bold">{article.title.ru}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{article.excerpt.ru}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/admin/news/${article.id}`}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
                >
                  Открыть
                </Link>

                <form action={updateArticleStateAction}>
                  <input type="hidden" name="articleId" value={article.id} />
                  <input type="hidden" name="action" value="trash" />
                  <SubmitButton className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                    В корзину
                  </SubmitButton>
                </form>

                {canPublish(user) && (
                  <form action={updateArticleStateAction}>
                    <input type="hidden" name="articleId" value={article.id} />
                    <input type="hidden" name="action" value="publish" />
                    <SubmitButton className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                      Одобрить и опубликовать
                    </SubmitButton>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}

        {queue.length === 0 && (
          <p className="rounded-[1.75rem] border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
            Очередь модерации пуста.
          </p>
        )}
      </div>
    </div>
  )
}
