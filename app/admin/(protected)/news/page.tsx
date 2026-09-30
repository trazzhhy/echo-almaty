import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CirclePlus, FileText, Pencil, Search, Trash2 } from 'lucide-react'
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
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="admin-page-title">Все новости</h1>
          <p className="admin-page-description">
            Найдите материал, измените его или проверьте статус публикации.
          </p>
        </div>
        <Link href="/admin/news/new" className="admin-btn-primary shrink-0">
          <CirclePlus aria-hidden className="size-5" strokeWidth={1.8} />
          Создать новость
        </Link>
      </div>

      <form className="admin-panel grid gap-4 md:grid-cols-[minmax(0,1fr)_240px_auto] md:items-end">
        <div>
          <label htmlFor="news-search" className="admin-label">Поиск</label>
          <input
            id="news-search"
            name="q"
            defaultValue={q}
            placeholder="Например, название новости"
            className="admin-field"
          />
        </div>
        <div>
          <label htmlFor="news-status" className="admin-label">Статус</label>
          <select id="news-status" name="status" defaultValue={status} className="admin-field">
            <option value="">Все статусы</option>
            <option value="draft">Черновики</option>
            <option value="in_review">На проверке</option>
            <option value="scheduled">Запланировано</option>
            <option value="published">Опубликовано</option>
            <option value="rejected">Возвращено</option>
            <option value="trash">Корзина</option>
          </select>
        </div>
        <button type="submit" className="admin-btn-secondary">
          <Search aria-hidden className="size-4" strokeWidth={1.8} />
          Найти
        </button>
      </form>

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Найдено: {filtered.length}</h2>
        {(q || status) && (
          <Link href="/admin/news" className="text-sm font-semibold text-primary">
            Сбросить фильтры
          </Link>
        )}
      </div>

      <div className="divide-y divide-border border-y border-border bg-card">
        {filtered.map((article) => (
          <article key={article.id} className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <StatusBadge status={article.status} />
                <h3 className="mt-3 text-xl font-bold leading-snug">{article.title.ru}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Обновлено {fullDate(article.updatedAt, 'ru')}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href={`/admin/news/${article.id}`}
                  className="admin-btn-secondary min-h-10 px-4 text-sm"
                >
                  <Pencil aria-hidden className="size-4" strokeWidth={1.8} />
                  Редактировать
                </Link>

                <form action={updateArticleStateAction}>
                  <input type="hidden" name="articleId" value={article.id} />
                  <input type="hidden" name="action" value={article.showOnHome ? 'hide_home' : 'show_home'} />
                  <SubmitButton className="admin-btn-secondary min-h-10 px-4 text-sm">
                    {article.showOnHome ? 'Убрать с главной' : 'Показать на главной'}
                  </SubmitButton>
                </form>

                {article.status !== 'trash' && (
                  <form action={updateArticleStateAction}>
                    <input type="hidden" name="articleId" value={article.id} />
                    <input type="hidden" name="action" value="trash" />
                    <SubmitButton className="admin-btn-secondary min-h-10 px-4 text-sm">
                      <Trash2 aria-hidden className="size-4" strokeWidth={1.8} />
                      В корзину
                    </SubmitButton>
                  </form>
                )}

                {canPublish(user) && article.status !== 'published' && article.status !== 'trash' && (
                  <form action={updateArticleStateAction}>
                    <input type="hidden" name="articleId" value={article.id} />
                    <input type="hidden" name="action" value="publish" />
                    <SubmitButton
                      className="admin-btn-primary min-h-10 px-4 text-sm"
                      confirmMessage={`Опубликовать «${article.title.ru}» на сайте прямо сейчас?`}
                      pendingLabel="Публикуем..."
                    >
                      Опубликовать
                    </SubmitButton>
                  </form>
                )}
              </div>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <FileText aria-hidden className="size-9 text-muted-foreground" strokeWidth={1.5} />
            <h3 className="mt-4 text-lg font-bold">Новости не найдены</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Измените запрос или сбросьте фильтры, чтобы увидеть все материалы.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
