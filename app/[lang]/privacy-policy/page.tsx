import type { Metadata } from 'next'
import { PublicPageIntro } from '@/components/public/page-intro'
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
    <PublicSiteShell lang={safeLang} path="/privacy-policy" mainClassName="max-w-5xl py-8">
      <PublicPageIntro
        eyebrow={t(safeLang, 'privacyShort')}
        title={t(safeLang, 'privacyPolicy')}
        description={
          localize(
            {
              ru: 'Краткая политика обработки данных для пользователей сайта и подписчиков рассылки.',
              kk: 'Сайт пайдаланушылары мен таралым жазылушыларына арналған деректерді өңдеу саясатының қысқаша нұсқасы.',
              en: 'A short summary of how we handle data for site visitors and newsletter subscribers.',
            },
            safeLang,
          )
        }
      />

      <div className="news-prose-card">
        <p>
          {localize(
            {
              ru: 'Эхо Алматы хранит только те данные, которые пользователь передает добровольно: поисковые запросы, адрес электронной почты для подписки и сообщения, отправленные через редакционные контакты.',
              kk: 'Эхо Алматы пайдаланушы ерікті түрде берген деректерді ғана сақтайды: іздеу сұраулары, таралымға жазылу үшін электрондық пошта мекенжайы және редакцияға жіберілген хабарламалар.',
              en: 'Echo Almaty stores only the data users provide voluntarily: search queries, an email address for the newsletter, and messages sent through our newsroom contacts.',
            },
            safeLang,
          )}
        </p>
        <p>
          {localize(
            {
              ru: 'Данные не используются для открытой регистрации на сайте, не продаются третьим лицам и применяются только для редакционной коммуникации, аналитики посещаемости и улучшения сервиса.',
              kk: 'Деректер сайттағы ашық тіркеу үшін пайдаланылмайды, үшінші тұлғаларға сатылмайды және тек редакциялық коммуникация, аудиторияны талдау және сервисті жақсарту үшін қолданылады.',
              en: 'This data is not used for public registration on the site, is never sold to third parties, and is used only for newsroom communication, audience analytics and improving the service.',
            },
            safeLang,
          )}
        </p>
        <p>
          {localize(
            {
              ru: 'По запросу пользователь может уточнить, изменить или удалить переданные контактные данные через редакцию.',
              kk: 'Сұрау бойынша пайдаланушы редакция арқылы берілген байланыс деректерін нақтылай, өзгерте немесе өшіре алады.',
              en: 'On request, users can ask the newsroom to correct, update or delete the contact details they have provided.',
            },
            safeLang,
          )}
        </p>
      </div>
    </PublicSiteShell>
  )
}
