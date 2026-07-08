import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { Lang } from '@/lib/i18n'
import { PublicSiteFooter } from './site-footer'
import { PublicSiteHeader } from './site-header'

export function PublicSiteShell({
  lang,
  path,
  children,
  mainClassName,
}: {
  lang: Lang
  path: string
  children: ReactNode
  mainClassName?: string
}) {
  return (
    <div className="min-h-screen bg-background">
      <PublicSiteHeader lang={lang} path={path} />
      <main className={cn('mx-auto max-w-7xl px-4 py-8', mainClassName)}>
        {children}
      </main>
      <PublicSiteFooter lang={lang} />
    </div>
  )
}
