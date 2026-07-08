import { redirect } from 'next/navigation'
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
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
          Корзина
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold">Удаленные материалы</h1>
      </div>

      <div className="space-y-4">
        {trash.map((article) => (
          <div key={article.id} className="rounded-[1.75rem] border border-border bg-card p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold">{article.title.ru}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Удалено {fullDate(article.deletedAt ?? article.updatedAt, 'ru')}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <form action={updateArticleStateAction}>
                  <input type="hidden" name="articleId" value={article.id} />
                  <input type="hidden" name="action" value="restore" />
                  <SubmitButton className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                    Восстановить
                  </SubmitButton>
                </form>

                <form action={updateArticleStateAction}>
                  <input type="hidden" name="articleId" value={article.id} />
                  <input type="hidden" name="action" value="purge" />
                  <SubmitButton className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-primary-foreground">
                    Удалить навсегда
                  </SubmitButton>
                </form>
              </div>
            </div>
          </div>
        ))}

        {trash.length === 0 && (
          <p className="rounded-[1.75rem] border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
            Корзина пуста.
          </p>
        )}
      </div>
    </div>
  )
}
