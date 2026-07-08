import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { isLang, locales } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLang(lang)) {
    notFound()
  }

  return <div lang={lang}>{children}</div>
}
