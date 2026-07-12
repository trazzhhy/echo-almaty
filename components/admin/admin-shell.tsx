import Link from 'next/link'
import { ExternalLink, LogOut, Newspaper } from 'lucide-react'
import { logoutAction } from '@/app/admin/actions'
import type { AuthUser } from '@/lib/cms/types'
import { AdminMobileNav, AdminNav } from './admin-nav'

const roleLabels = {
  admin: 'Администратор',
  editor: 'Редактор',
  author: 'Автор',
  moderator: 'Модератор',
}

export function AdminShell({
  user,
  children,
}: {
  user: AuthUser
  children: React.ReactNode
}) {
  return (
    <div className="admin-theme min-h-screen">
      <a
        href="#admin-content"
        className="fixed left-4 top-3 z-50 -translate-y-20 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground focus:translate-y-0"
      >
        Перейти к содержимому
      </a>
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex min-h-16 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3 font-bold">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Newspaper aria-hidden className="size-5" strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-base leading-tight">Эхо Алматы</span>
              <span className="block text-xs font-normal text-muted-foreground">
                Управление сайтом
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/ru"
              target="_blank"
              rel="noreferrer"
              className="admin-btn-secondary hidden min-h-10 px-3 text-sm sm:inline-flex"
            >
              Открыть сайт
              <ExternalLink aria-hidden className="size-4" strokeWidth={1.8} />
            </Link>
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{roleLabels[user.role]}</p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="admin-btn-secondary min-h-10 px-3 text-sm"
                aria-label="Выйти из админ-панели"
              >
                <LogOut aria-hidden className="size-4" strokeWidth={1.8} />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <AdminMobileNav isAdmin={user.role === 'admin'} />

      <div className="mx-auto grid max-w-[1500px] xl:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="admin-sidebar hidden min-h-[calc(100vh-4rem)] border-r p-4 xl:flex xl:flex-col">
          <AdminNav isAdmin={user.role === 'admin'} />

          <div className="mt-auto border-t border-white/10 pt-4">
            <p className="admin-sidebar-muted px-3 text-sm leading-6">
              Вы вошли как
            </p>
            <p className="mt-1 px-3 text-sm font-semibold">{user.name}</p>
            <p className="admin-sidebar-muted px-3 text-sm">{roleLabels[user.role]}</p>
          </div>
        </aside>

        <main id="admin-content" className="admin-main min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
