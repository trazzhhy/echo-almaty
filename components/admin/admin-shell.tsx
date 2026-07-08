import Link from 'next/link'
import { logoutAction } from '@/app/admin/actions'
import type { AuthUser } from '@/lib/cms/types'

const navigation = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/news', label: 'Новости' },
  { href: '/admin/review', label: 'Модерация' },
  { href: '/admin/trash', label: 'Корзина' },
  { href: '/admin/users', label: 'Пользователи', adminOnly: true },
  { href: '/admin/history', label: 'История' },
]

export function AdminShell({
  user,
  children,
}: {
  user: AuthUser
  children: React.ReactNode
}) {
  return (
    <div className="admin-theme min-h-screen">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="admin-sidebar rounded-[2rem] border p-6">
          <div>
            <p className="admin-sidebar-muted text-xs uppercase tracking-[0.24em]">
              Эхо Алматы Admin
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold">Редакция</h1>
            <p className="admin-sidebar-muted mt-2 text-sm">
              {user.name} · {user.role}
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation
              .filter((item) => !item.adminOnly || user.role === 'admin')
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="admin-nav-link block rounded-2xl px-4 py-3 text-sm font-medium transition"
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/6 p-4 text-sm">
            <p className="font-semibold text-white">Демо-аккаунты</p>
            <p className="mt-2">admin@echoalmaty.local / admin123</p>
            <p>editor@echoalmaty.local / editor123</p>
            <p>author@echoalmaty.local / author123</p>
            <p>moderator@echoalmaty.local / moderator123</p>
          </div>

          <form action={logoutAction} className="mt-6">
            <button
              type="submit"
              className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
            >
              Выйти
            </button>
          </form>
        </aside>

        <main className="admin-main space-y-6">
          <header className="admin-shell-card admin-topbar rounded-[1.75rem] border border-border px-5 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Активная сессия
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="font-semibold">{user.name}</span>
                  <span className="admin-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/login"
                  className="rounded-full border border-border bg-background/75 px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary"
                >
                  Сменить аккаунт
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Выйти
                  </button>
                </form>
              </div>
            </div>
          </header>

          <div className="admin-shell-card rounded-[2rem] border border-border p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
