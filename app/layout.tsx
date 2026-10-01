import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { headers } from 'next/headers'
import { defaultLang, isLang } from '@/lib/i18n'
import { siteConfig } from '@/lib/site-config'
import './globals.css'

// Self-hosted so builds never depend on reaching Google Fonts. Files in
// app/fonts are the Google Fonts variable fonts limited to the weights below
// and to latin, latin-ext, cyrillic and cyrillic-ext (Kazakh letters).
const roboto = localFont({
  src: './fonts/Roboto-Variable.woff2',
  weight: '400 700',
  variable: '--font-roboto',
})

const robotoCondensed = localFont({
  src: './fonts/RobotoCondensed-Variable.woff2',
  weight: '500 700',
  variable: '--font-roboto-condensed',
})

const manrope = localFont({
  src: './fonts/Manrope-Variable.woff2',
  weight: '700 800',
  variable: '--font-masthead',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: 'Эхо Алматы',
    template: '%s | Эхо Алматы',
  },
  description: siteConfig.description,
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerList = await headers()
  const headerLang = headerList.get('x-echo-almaty-lang') ?? ''
  const lang = isLang(headerLang) ? headerLang : defaultLang

  return (
    <html
      lang={lang}
      className={`bg-background ${roboto.variable} ${robotoCondensed.variable} ${manrope.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
