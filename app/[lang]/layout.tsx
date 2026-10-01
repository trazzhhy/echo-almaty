import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { defaultLang, isLang, locales, t } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const safeLang = isLang(lang) ? lang : defaultLang
  const brand = t(safeLang, 'brandTitle')

  return {
    title: {
      default: brand,
      template: `%s | ${brand}`,
    },
    description: t(safeLang, 'siteDescription'),
  }
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
