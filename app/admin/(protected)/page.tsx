import Link from 'next/link'
import { redirect } from 'next/navigation'
import { StatusBadge } from '@/components/admin/status-badge'
import { getCurrentUser } from '@/lib/cms/auth'
import { canAccessHistory, canManageUsers } from '@/lib/cms/permissions'
import { getAdminArticles, getAuditEntries, getDashboardStats } from '@/lib/cms/repository'
import { fullDate } from '@/lib/time'

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/admin/login')
  }

  const [stats, articles, audit] = await Promise.all([
    getDashboardStats(user),
    getAdminArticles(user),
    canAccessHistory(user) ? getAuditEntries(8) : Promise.resolve([]),
  ])

  const latestArticles = articles.slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
            Dashboard
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold">Редакционный центр</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Быстрый обзор статусов материалов, очереди модерации и активности команды.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/news/new"
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Новая новость
          </Link>
          <Link
            href="/admin/review"
            className="rounded-full border border-border px-5 py-3 text-sm font-semibold"
          >
            Очередь модерации
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Всего материалов', stats.total],
          ['Опубликовано', stats.published],
          ['На модерации', stats.review],
          ['Запланировано', stats.scheduled],
          ['Черновики', stats.drafts],
          ['Корзина', stats.trash],
          ['Подписчики', stats.subscribers],
          ['Ваши материалы', articles.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[1.5rem] border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 font-heading text-4xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold">Последние материалы</h2>
            <Link href="/admin/news" className="text-sm font-medium text-primary">
              Все материалы
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {latestArticles.map((article) => (
              <div
                key={article.id}
                className="flex flex-col gap-3 rounded-2xl border border-border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium">{article.title.ru}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Обновлено {fullDate(article.updatedAt, 'ru')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={article.status} />
                  <Link
                    href={`/admin/news/${article.id}`}
                    className="text-sm font-medium text-primary"
                  >
                    Открыть
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {canAccessHistory(user) && (
          <div className="rounded-[1.75rem] border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">История действий</h2>
              <Link href="/admin/history" className="text-sm font-medium text-primary">
                Все записи
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {audit.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-border p-4">
                  <p className="font-medium">{entry.summary}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.actorName} · {fullDate(entry.timestamp, 'ru')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {canManageUsers(user) && (
        <section className="rounded-[1.75rem] border border-border bg-card p-6">
          <h2 className="font-heading text-2xl font-bold">Административные зоны</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link href="/admin/users" className="rounded-2xl border border-border p-5 transition hover:bg-secondary">
              Управление пользователями
            </Link>
            <Link href="/admin/trash" className="rounded-2xl border border-border p-5 transition hover:bg-secondary">
              Корзина материалов
            </Link>
            <Link href="/admin/history" className="rounded-2xl border border-border p-5 transition hover:bg-secondary">
              Журнал изменений
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
