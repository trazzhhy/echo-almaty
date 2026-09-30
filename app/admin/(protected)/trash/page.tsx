import { redirect } from 'next/navigation'
import { RotateCcw, Trash2 } from 'lucide-react'
import { updateArticleStateAction } from '@/app/admin/actions'
import { SubmitButton } from '@/components/admin/submit-button'
import { getCurrentUser } from '@/lib/cms/auth'
import { getAdminArticles } from '@/lib/cms/repository'
import { fullDate } from '@/lib/time'

export default async function TrashPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/admin/login')
  }

  const trash = (await getAdminArticles(user)).filter((article) => article.status === 'trash')

  return (
    <div className="space-y-8">
      <header>
        <h1 className="admin-page-title">Корзина</h1>
        <p className="admin-page-description">
          Здесь находятся удалённые новости. Их можно восстановить или удалить навсегда.
        </p>
      </header>

      <div className="divide-y divide-border border-y border-border bg-card">
        {trash.map((article) => (
          <article key={article.id} className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold">{article.title.ru}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Удалено {fullDate(article.deletedAt ?? article.updatedAt, 'ru')}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <form action={updateArticleStateAction}>
                  <input type="hidden" name="articleId" value={article.id} />
                  <input type="hidden" name="action" value="restore" />
                  <SubmitButton className="admin-btn-secondary min-h-10 px-4 text-sm">
                    <RotateCcw aria-hidden className="size-4" strokeWidth={1.8} />
                    Восстановить
                  </SubmitButton>
                </form>

                <form action={updateArticleStateAction}>
                  <input type="hidden" name="articleId" value={article.id} />
                  <input type="hidden" name="action" value="purge" />
                  <SubmitButton
                    className="admin-btn-danger min-h-10 px-4 text-sm"
                    confirmMessage={`Удалить «${article.title.ru}» навсегда? Это действие нельзя отменить.`}
                    pendingLabel="Удаляем..."
                  >
                    <Trash2 aria-hidden className="size-4" strokeWidth={1.8} />
                    Удалить навсегда
                  </SubmitButton>
                </form>
              </div>
            </div>
          </article>
        ))}

        {trash.length === 0 && (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <Trash2 aria-hidden className="size-10 text-muted-foreground" strokeWidth={1.5} />
            <h2 className="mt-4 text-xl font-bold">Корзина пуста</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Удалённые новости появятся здесь.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
