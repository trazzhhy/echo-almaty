import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, CirclePlus, Clock3, FileText, Send, Users } from 'lucide-react'
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
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="admin-page-title">Добро пожаловать, {user.name}</h1>
          <p className="admin-page-description">
            Здесь собраны главные задачи по управлению сайтом.
          </p>
        </div>
        <Link href="/admin/news/new" className="admin-btn-primary">
          <CirclePlus aria-hidden className="size-5" strokeWidth={1.8} />
          Создать новость
        </Link>
      </div>

      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="mb-4 text-xl font-bold">
          Что нужно сделать?
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/news/new"
            className="group admin-panel flex min-h-36 flex-col justify-between transition hover:border-primary"
          >
            <CirclePlus aria-hidden className="size-7 text-primary" strokeWidth={1.7} />
            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Создать новость</h3>
                <p className="mt-1 text-sm text-muted-foreground">Начать новый материал</p>
              </div>
              <ArrowRight aria-hidden className="size-5 text-primary" strokeWidth={1.8} />
            </div>
          </Link>
          <Link
            href="/admin/news?status=draft"
            className="group admin-panel flex min-h-36 flex-col justify-between transition hover:border-primary"
          >
            <FileText aria-hidden className="size-7 text-primary" strokeWidth={1.7} />
            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Продолжить черновик</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Черновиков: {stats.drafts}
                </p>
              </div>
              <ArrowRight aria-hidden className="size-5 text-primary" strokeWidth={1.8} />
            </div>
          </Link>
          <Link
            href="/admin/review"
            className="group admin-panel flex min-h-36 flex-col justify-between transition hover:border-primary"
          >
            <Send aria-hidden className="size-7 text-primary" strokeWidth={1.7} />
            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Проверить материалы</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ожидают проверки: {stats.review}
                </p>
              </div>
              <ArrowRight aria-hidden className="size-5 text-primary" strokeWidth={1.8} />
            </div>
          </Link>
        </div>
      </section>

      <section aria-labelledby="site-status">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="site-status" className="text-xl font-bold">Состояние сайта</h2>
          <Link href="/admin/news" className="text-sm font-semibold text-primary">
            Все новости
          </Link>
        </div>
        <div className="admin-panel grid gap-0 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Опубликовано', stats.published],
          ['Запланировано', stats.scheduled],
          ['Черновики', stats.drafts],
          ['Корзина', stats.trash],
        ].map(([label, value]) => (
          <div key={label} className="border-b border-border p-5 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r">
            <p className="text-base text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
          </div>
        ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <div className="admin-panel">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Последние новости</h2>
            <Link href="/admin/news" className="text-sm font-medium text-primary">
              Показать все
            </Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                href={`/admin/news/${article.id}`}
                className="flex min-h-20 flex-col gap-3 py-4 transition hover:bg-secondary/50 sm:flex-row sm:items-center sm:justify-between sm:px-2"
              >
                <div>
                  <p className="font-medium">{article.title.ru}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Обновлено {fullDate(article.updatedAt, 'ru')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={article.status} />
                  <ArrowRight aria-hidden className="size-4 text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {canAccessHistory(user) && (
          <div className="admin-panel">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Недавние действия</h2>
              <Link href="/admin/history" className="text-sm font-medium text-primary">
                Вся история
              </Link>
            </div>
            <div className="mt-4 divide-y divide-border">
              {audit.map((entry) => (
                <div key={entry.id} className="py-4">
                  <p className="text-sm font-medium">{entry.summary}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.actorName}, {fullDate(entry.timestamp, 'ru')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {canManageUsers(user) && (
        <section className="admin-panel">
          <h2 className="text-xl font-bold">Дополнительная информация</h2>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Users aria-hidden className="size-4" />
              Подписчиков: {stats.subscribers}
            </span>
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Clock3 aria-hidden className="size-4" />
              Всего материалов: {stats.total}
            </span>
          </div>
        </section>
      )}
    </div>
  )
}
