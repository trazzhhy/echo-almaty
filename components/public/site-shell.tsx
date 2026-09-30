import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { Lang } from '@/lib/i18n'
import { PublicSiteFooter } from './site-footer'
import { PublicSiteHeader } from './site-header'
import { SocialRail } from './social-links'

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
    <div className="public-theme min-h-screen">
      <PublicSiteHeader lang={lang} path={path} />
      <main className={cn('public-container py-6', mainClassName)}>
        {children}
      </main>
      <PublicSiteFooter lang={lang} />
      <SocialRail lang={lang} />
    </div>
  )
}
