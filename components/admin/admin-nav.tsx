'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileText,
  History,
  LayoutDashboard,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react'

const navigation = [
  { href: '/admin', label: 'Главная', icon: LayoutDashboard },
  { href: '/admin/news', label: 'Все новости', icon: FileText },
  { href: '/admin/review', label: 'На проверке', icon: ShieldCheck },
  { href: '/admin/trash', label: 'Корзина', icon: Trash2 },
  { href: '/admin/users', label: 'Пользователи', icon: Users, adminOnly: true },
  { href: '/admin/history', label: 'История действий', icon: History },
]

function isCurrentPath(pathname: string, href: string) {
  if (href === '/admin') return pathname === href
  if (href === '/admin/news') {
    return pathname === href || pathname.startsWith('/admin/news/')
  }
  return pathname.startsWith(href)
}

export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Разделы админ-панели" className="space-y-1.5">
      {navigation
        .filter((item) => !item.adminOnly || isAdmin)
        .map((item) => {
          const Icon = item.icon
          const active = isCurrentPath(pathname, item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              data-active={active}
              aria-current={active ? 'page' : undefined}
              className="admin-nav-link flex min-h-12 items-center gap-3 rounded-md px-3.5 py-3 text-base font-medium transition"
            >
              <Icon aria-hidden className="size-5 shrink-0" strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          )
        })}
    </nav>
  )
}

export function AdminMobileNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const visibleItems = navigation.filter((item) => !item.adminOnly || isAdmin)

  return (
    <div className="overflow-x-auto border-b border-border bg-card xl:hidden">
      <nav
        aria-label="Разделы админ-панели"
        className="mx-auto flex min-w-max max-w-7xl gap-1 px-4 py-2"
      >
        {visibleItems.map((item) => {
          const Icon = item.icon
          const active = isCurrentPath(pathname, item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold ${
                active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              <Icon aria-hidden className="size-4" strokeWidth={1.8} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
