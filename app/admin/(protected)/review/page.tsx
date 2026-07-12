import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle2, Pencil, ShieldCheck, Trash2 } from 'lucide-react'
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
      <header>
        <h1 className="admin-page-title">Материалы на проверке</h1>
        <p className="admin-page-description">
          Откройте новость, проверьте текст и опубликуйте её, когда всё будет готово.
        </p>
      </header>

      <div className="divide-y divide-border border-y border-border bg-card">
        {queue.map((article) => (
          <article key={article.id} className="p-5 sm:p-6">
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
                  className="admin-btn-secondary min-h-10 px-4 text-sm"
                >
                  <Pencil aria-hidden className="size-4" strokeWidth={1.8} />
                  Проверить текст
                </Link>

                <form action={updateArticleStateAction}>
                  <input type="hidden" name="articleId" value={article.id} />
                  <input type="hidden" name="action" value="trash" />
                  <SubmitButton className="admin-btn-secondary min-h-10 px-4 text-sm">
                    <Trash2 aria-hidden className="size-4" strokeWidth={1.8} />
                    В корзину
                  </SubmitButton>
                </form>

                {canPublish(user) && (
                  <form action={updateArticleStateAction}>
                    <input type="hidden" name="articleId" value={article.id} />
                    <input type="hidden" name="action" value="publish" />
                    <SubmitButton
                      className="admin-btn-primary min-h-10 px-4 text-sm"
                      confirmMessage={`Проверка завершена? Опубликовать «${article.title.ru}» на сайте?`}
                      pendingLabel="Публикуем..."
                    >
                      <CheckCircle2 aria-hidden className="size-4" strokeWidth={1.8} />
                      Опубликовать
                    </SubmitButton>
                  </form>
                )}
              </div>
            </div>
          </article>
        ))}

        {queue.length === 0 && (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <ShieldCheck aria-hidden className="size-10 text-primary" strokeWidth={1.5} />
            <h2 className="mt-4 text-xl font-bold">Всё проверено</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Сейчас нет материалов, которые ожидают проверки.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
