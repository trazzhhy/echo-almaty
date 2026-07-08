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
    title: t(safeLang, 'privacyPolicy'),
  }
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const safeLang: Lang = isLang(lang) ? lang : 'ru'

  return (
    <PublicSiteShell lang={safeLang} path="/privacy-policy" mainClassName="mx-auto max-w-5xl px-4 py-8">
      <PublicPageIntro
        eyebrow={t(safeLang, 'privacyShort')}
        title={t(safeLang, 'privacyPolicy')}
        description={
          safeLang === 'ru'
            ? 'Краткая политика обработки данных для пользователей сайта и подписчиков рассылки.'
            : 'Сайт пайдаланушылары мен таралым жазылушыларына арналған деректерді өңдеу саясатының қысқаша нұсқасы.'
        }
      />

      <div className="space-y-6 rounded-[2rem] border border-border bg-card p-8 text-base leading-8 text-foreground/90">
        <p>
          {safeLang === 'ru'
            ? 'Эхо Алматы хранит только те данные, которые пользователь передает добровольно: поисковые запросы, адрес электронной почты для подписки и сообщения, отправленные через редакционные контакты.'
            : 'Эхо Алматы пайдаланушы ерікті түрде берген деректерді ғана сақтайды: іздеу сұраулары, таралымға жазылу үшін электрондық пошта мекенжайы және редакцияға жіберілген хабарламалар.'}
        </p>
        <p>
          {safeLang === 'ru'
            ? 'Данные не используются для открытой регистрации на сайте, не продаются третьим лицам и применяются только для редакционной коммуникации, аналитики посещаемости и улучшения сервиса.'
            : 'Деректер сайттағы ашық тіркеу үшін пайдаланылмайды, үшінші тұлғаларға сатылмайды және тек редакциялық коммуникация, аудиторияны талдау және сервисті жақсарту үшін қолданылады.'}
        </p>
        <p>
          {safeLang === 'ru'
            ? 'По запросу пользователь может уточнить, изменить или удалить переданные контактные данные через редакцию.'
            : 'Сұрау бойынша пайдаланушы редакция арқылы берілген байланыс деректерін нақтылай, өзгерте немесе өшіре алады.'}
        </p>
      </div>
    </PublicSiteShell>
  )
}
