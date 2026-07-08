import Link from 'next/link'
import { redirect } from 'next/navigation'
import { updateArticleStateAction } from '@/app/admin/actions'
import { StatusBadge } from '@/components/admin/status-badge'
import { SubmitButton } from '@/components/admin/submit-button'
import { getCurrentUser } from '@/lib/cms/auth'
import { canPublish } from '@/lib/cms/permissions'
import { getAdminArticles } from '@/lib/cms/repository'
import { fullDate } from '@/lib/time'

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/admin/login')
  }

  const { q = '', status = '' } = await searchParams
  const articles = await getAdminArticles(user)
  const normalizedQuery = q.trim().toLowerCase()

  const filtered = articles.filter((article) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      `${article.title.ru} ${article.title.kk} ${article.tags.join(' ')}`.toLowerCase().includes(normalizedQuery)
    const matchesStatus = !status || article.status === status
    return matchesQuery && matchesStatus
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
            Контент
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold">Все новости</h1>
        </div>
        <Link
          href="/admin/news/new"
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Создать новость
        </Link>
      </div>

      <form className="grid gap-4 rounded-[1.75rem] border border-border bg-card p-5 md:grid-cols-[minmax(0,1fr)_220px_auto]">
        <input
          name="q"
          defaultValue={q}
          placeholder="Поиск по заголовку, тегу, slug"
          className="h-11 rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
        >
          <option value="">Все статусы</option>
          <option value="draft">Черновики</option>
          <option value="in_review">На проверке</option>
          <option value="scheduled">Запланировано</option>
          <option value="published">Опубликовано</option>
          <option value="rejected">Возвращено</option>
          <option value="trash">Корзина</option>
        </select>
        <button
          type="submit"
          className="rounded-full border border-border px-5 py-3 text-sm font-semibold"
        >
          Фильтровать
        </button>
      </form>

      <div className="space-y-4">
        {filtered.map((article) => (
          <div key={article.id} className="rounded-[1.5rem] border border-border bg-card p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={article.status} />
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {article.slug}
                  </span>
                </div>
                <h2 className="mt-3 font-heading text-2xl font-bold">
                  {article.title.ru}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Обновлено {fullDate(article.updatedAt, 'ru')} · Ревизия #{article.revision}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {article.categories.map((category) => (
                    <span key={category} className="rounded-full bg-secondary px-3 py-1">
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/admin/news/${article.id}`}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold"
                >
                  Редактировать
                </Link>

                <form action={updateArticleStateAction}>
                  <input type="hidden" name="articleId" value={article.id} />
                  <input type="hidden" name="action" value={article.showOnHome ? 'hide_home' : 'show_home'} />
                  <SubmitButton className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                    {article.showOnHome ? 'Скрыть с главной' : 'Вернуть на главную'}
                  </SubmitButton>
                </form>

                {article.status !== 'trash' && (
                  <form action={updateArticleStateAction}>
                    <input type="hidden" name="articleId" value={article.id} />
                    <input type="hidden" name="action" value="trash" />
                    <SubmitButton className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                      В корзину
                    </SubmitButton>
                  </form>
                )}

                {canPublish(user) && article.status !== 'published' && article.status !== 'trash' && (
                  <form action={updateArticleStateAction}>
                    <input type="hidden" name="articleId" value={article.id} />
                    <input type="hidden" name="action" value="publish" />
                    <SubmitButton className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                      Опубликовать
                    </SubmitButton>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
