import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'
import { PublicSiteShell } from '@/components/public/site-shell'
import { isLang, localize, t, type Lang } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const safeLang = isLang(lang) ? lang : 'ru'

  return {
    title: t(safeLang, 'contacts'),
  }
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const safeLang: Lang = isLang(lang) ? lang : 'ru'

  return (
    <PublicSiteShell
      lang={safeLang}
      path="/contacts"
      mainClassName="pb-12 pt-8 sm:pt-10"
    >
      <header className="grid gap-6 border-b border-foreground/20 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] lg:items-end">
        <div>
          <p className="text-sm font-medium text-primary">{t(safeLang, 'contacts')}</p>
          <h1 className="mt-2 max-w-4xl font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.96] tracking-[-0.035em] text-balance">
            {t(safeLang, 'contactEditorial')}
          </h1>
        </div>
        <p className="max-w-[52ch] text-base leading-7 text-muted-foreground lg:pb-1">
          {localize(
            {
              ru: 'Присылайте новости, уточнения и предложения. Для рекламы и партнёрских проектов работает отдельная линия.',
              kk: 'Жаңалықтар, нақтылаулар мен ұсыныстарды жіберіңіз. Жарнама және серіктестік жобалар үшін жеке байланыс желісі бар.',
              en: 'Send us news tips, corrections and suggestions. Advertising and partnership enquiries have a dedicated line.',
            },
            safeLang,
          )}
        </p>
      </header>

      <div className="mt-8 grid border border-foreground/20 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="flex min-h-[390px] flex-col bg-foreground p-6 text-background sm:p-8 lg:p-10">
          <p className="text-sm text-background/60">
            {localize({ ru: 'Главный контакт', kk: 'Негізгі байланыс', en: 'Main contact' }, safeLang)}
          </p>
          <h2 className="mt-4 max-w-2xl font-heading text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.035em] text-balance">
            {localize(
              {
                ru: 'Есть важная история для города?',
                kk: 'Қала үшін маңызды оқиға бар ма?',
                en: 'Have a story that matters to the city?',
              },
              safeLang,
            )}
          </h2>
          <a
            href="mailto:info@echoalmaty.kz"
            className="mt-auto inline-flex w-fit items-center gap-3 border-b border-background/35 pb-2 text-lg font-semibold transition-colors hover:border-background"
          >
            <Mail aria-hidden className="size-5" strokeWidth={1.6} />
            info@echoalmaty.kz
          </a>
        </section>

        <div className="divide-y divide-foreground/20">
          <section className="p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.02em]">
              {localize({ ru: 'Редакция', kk: 'Редакция', en: 'Newsroom' }, safeLang)}
            </h2>
            <div className="mt-6 space-y-5 text-sm">
              <a
                href="tel:+77172000000"
                className="flex items-center gap-3 transition-colors hover:text-primary"
              >
                <Phone aria-hidden className="size-4 text-primary" strokeWidth={1.7} />
                +7 (7172) 00-00-00
              </a>
              <p className="flex items-center gap-3">
                <MapPin aria-hidden className="size-4 text-primary" strokeWidth={1.7} />
                {localize(
                  {
                    ru: 'Астана, Казахстан',
                    kk: 'Астана, Қазақстан',
                    en: 'Astana, Kazakhstan',
                  },
                  safeLang,
                )}
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold tracking-[-0.02em]">
              {localize(
                {
                  ru: 'Реклама и партнёрства',
                  kk: 'Жарнама және серіктестік',
                  en: 'Advertising and partnerships',
                },
                safeLang,
              )}
            </h2>
            <div className="mt-6 space-y-4">
              <a
                href="mailto:ads@echoalmaty.kz"
                className="block text-sm font-semibold transition-colors hover:text-primary"
              >
                ads@echoalmaty.kz
              </a>
              <a
                href="mailto:partners@echoalmaty.kz"
                className="block text-sm font-semibold transition-colors hover:text-primary"
              >
                partners@echoalmaty.kz
              </a>
              <p className="pt-2 text-sm leading-6 text-muted-foreground">
                {localize(
                  {
                    ru: 'Ответим в рабочее время в течение одного дня.',
                    kk: 'Жұмыс уақытында бір күн ішінде жауап береміз.',
                    en: 'We reply within one business day.',
                  },
                  safeLang,
                )}
              </p>
            </div>
          </section>
        </div>
      </div>
    </PublicSiteShell>
  )
}
