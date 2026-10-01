import type { Lang } from '@/lib/i18n'

export type AdBannerSlot = 'top' | 'middle' | 'bottom'

export type HomeAdBanner = {
  slot: AdBannerSlot
  href: string
  imageSrc: string
  label: Record<Lang, string>
  enabled: boolean
}

export const adBannerSlots: AdBannerSlot[] = ['top', 'middle', 'bottom']

export const adBannerSlotLabels: Record<AdBannerSlot, Record<Lang, string>> = {
  top: { ru: 'Верхний баннер', kk: 'Жоғарғы баннер', en: 'Top banner' },
  middle: { ru: 'Средний баннер', kk: 'Ортаңғы баннер', en: 'Middle banner' },
  bottom: { ru: 'Нижний баннер', kk: 'Төменгі баннер', en: 'Bottom banner' },
}

/**
 * Default content for the three homepage ad slots (1 = top, 2 = middle,
 * 3 = bottom). Used whenever the admin panel (/admin/ads) has no enabled
 * banner with an image for a slot — a banner saved in the admin always wins.
 *
 * To place an ad without the admin panel, edit the slot below:
 *   imageSrc — banner image: a file in /public (e.g. '/ads/partner.jpg') or an
 *              uploaded URL. Recommended size 1456×180 (728×90 @2x).
 *              Leave '' to show the styled "ad space available" block.
 *   href     — where the banner leads: site path ('/advertising') or full URL
 *              ('https://…', opens in a new tab with rel="sponsored").
 *   label    — alt text / accessible name, per language.
 */
export const fallbackAdBanners: Record<AdBannerSlot, HomeAdBanner> = {
  top: {
    slot: 'top',
    href: '/advertising',
    imageSrc: '',
    label: {
      ru: 'Рекламное место — верхний баннер',
      kk: 'Жарнама орны — жоғарғы баннер',
      en: 'Advertising space — top banner',
    },
    enabled: true,
  },
  middle: {
    slot: 'middle',
    href: '/advertising',
    imageSrc: '',
    label: {
      ru: 'Рекламное место — средний баннер',
      kk: 'Жарнама орны — ортаңғы баннер',
      en: 'Advertising space — middle banner',
    },
    enabled: true,
  },
  bottom: {
    slot: 'bottom',
    href: '/advertising',
    imageSrc: '',
    label: {
      ru: 'Рекламное место — нижний баннер',
      kk: 'Жарнама орны — төменгі баннер',
      en: 'Advertising space — bottom banner',
    },
    enabled: true,
  },
}
