import type { Metadata } from 'next'
import { PublicPageIntro } from '@/components/public/page-intro'
import { PublicSiteShell } from '@/components/public/site-shell'
import { isLang, t, type Lang } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const safeLang = isLang(lang) ? lang : 'ru'

  return {
    title: t(safeLang, 'advertising'),
  }
}

export default async function AdvertisingPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const safeLang: Lang = isLang(lang) ? lang : 'ru'

  return (
    <PublicSiteShell lang={safeLang} path="/advertising" mainClassName="mx-auto max-w-5xl px-4 py-8">
      <PublicPageIntro
        eyebrow={t(safeLang, 'advertising')}
        title={safeLang === 'ru' ? 'Размещение рекламы на Эхо Алматы' : 'Эхо Алматы сайтындағы жарнама'}
        description={
          safeLang === 'ru'
            ? 'Спецпроекты, баннеры, нативные форматы и редакционные партнёрства.'
            : 'Арнайы жобалар, баннерлер, нативті форматтар және редакциялық серіктестіктер.'
        }
      />

      <div className="news-prose-card">
        <p>
          {safeLang === 'ru'
            ? 'Для рекламодателей доступны медийные размещения в ленте, брендированные спецпроекты, а также интеграции в тематических разделах и подборках.'
            : 'Жарнама берушілер үшін лентадағы медиялық орналастырулар, брендтелген арнайы жобалар және тақырыптық бөлімдер мен топтамалардағы интеграциялар қолжетімді.'}
        </p>
        <p>
          {safeLang === 'ru'
            ? 'Мы можем подготовить индивидуальный медиаплан под региональные, республиканские и отраслевые кампании.'
            : 'Біз өңірлік, республикалық және салалық науқандарға арналған жеке медиажоспар дайындай аламыз.'}
        </p>
        <p>
          ads@echoalmaty.kz
        </p>
      </div>
    </PublicSiteShell>
  )
}
