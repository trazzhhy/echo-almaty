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
    <PublicSiteShell lang={safeLang} path="/contacts" mainClassName="mx-auto max-w-5xl px-4 py-8">
      <PublicPageIntro
        eyebrow={t(safeLang, 'contacts')}
        title={t(safeLang, 'contactEditorial')}
        description={
          safeLang === 'ru'
            ? 'Контакты редакции, рекламного отдела и общих запросов по проекту.'
            : 'Редакцияның, жарнама бөлімінің және жоба бойынша жалпы сұраулардың байланыстары.'
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-[2rem] border border-border bg-card p-6">
          <h2 className="font-heading text-2xl font-bold">
            {safeLang === 'ru' ? 'Редакция' : 'Редакция'}
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <li>info@echoalmaty.kz</li>
            <li>+7 (7172) 00-00-00</li>
            <li>{safeLang === 'ru' ? 'Астана, Казахстан' : 'Астана, Қазақстан'}</li>
          </ul>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-6">
          <h2 className="font-heading text-2xl font-bold">
            {safeLang === 'ru' ? 'Реклама и партнёрства' : 'Жарнама және серіктестік'}
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <li>ads@echoalmaty.kz</li>
            <li>partners@echoalmaty.kz</li>
            <li>{safeLang === 'ru' ? 'Ответ в рабочее время в течение дня.' : 'Жұмыс уақытында бір күн ішінде жауап беріледі.'}</li>
          </ul>
        </section>
      </div>
    </PublicSiteShell>
  )
}
