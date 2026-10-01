import { prisma } from '@/lib/prisma'
import {
  adBannerSlots,
  fallbackAdBanners,
  type AdBannerSlot,
  type HomeAdBanner,
} from '@/lib/home-ads'
import type { LocalizedText } from '@/lib/i18n'

export type SaveAdBannerInput = {
  slot: AdBannerSlot
  href: string
  imageSrc: string
  label: LocalizedText
  enabled: boolean
}

type DbAdBanner = {
  slot: AdBannerSlot
  href: string
  imageSrc: string
  labelRu: string
  labelKk: string
  labelEn: string
  enabled: boolean
}

function mapDbBanner(row: DbAdBanner): HomeAdBanner {
  const fallback = fallbackAdBanners[row.slot]
  return {
    slot: row.slot,
    href: row.href || fallback.href,
    imageSrc: row.imageSrc || fallback.imageSrc,
    label: {
      ru: row.labelRu || fallback.label.ru,
      kk: row.labelKk || fallback.label.kk,
      en: row.labelEn || fallback.label.en,
    },
    enabled: row.enabled,
  }
}

async function loadDbBanners(): Promise<Map<AdBannerSlot, HomeAdBanner>> {
  const result = new Map<AdBannerSlot, HomeAdBanner>()

  try {
    const rows = (await prisma.adBanner.findMany()) as DbAdBanner[]
    for (const row of rows) {
      result.set(row.slot, mapDbBanner(row))
    }
  } catch {
    // Table may not be migrated yet — public site falls back to placeholders.
  }

  return result
}

/**
 * Banners for the public homepage. Each slot resolves to its configured banner
 * when present and enabled; otherwise the placeholder is shown so the layout
 * stays intact. Never throws.
 */
export async function getHomeAdBanners(): Promise<HomeAdBanner[]> {
  const configured = await loadDbBanners()

  return adBannerSlots.map((slot) => {
    const banner = configured.get(slot)
    if (banner && banner.enabled && banner.imageSrc) {
      return banner
    }
    return fallbackAdBanners[slot]
  })
}

/**
 * Banners for the admin editor: the stored value for each slot, or an empty
 * template so every slot is always editable.
 */
export async function getAdminAdBanners(): Promise<HomeAdBanner[]> {
  const configured = await loadDbBanners()

  return adBannerSlots.map(
    (slot) =>
      configured.get(slot) ?? {
        slot,
        href: '/advertising',
        imageSrc: '',
        label: { ru: '', kk: '', en: '' },
        enabled: false,
      },
  )
}

export async function saveAdBanner(input: SaveAdBannerInput) {
  const data = {
    href: input.href.trim() || '/advertising',
    imageSrc: input.imageSrc.trim(),
    labelRu: input.label.ru.trim(),
    labelKk: input.label.kk.trim(),
    labelEn: input.label.en.trim(),
    enabled: input.enabled,
  }

  await prisma.adBanner.upsert({
    where: { slot: input.slot },
    update: data,
    create: { slot: input.slot, ...data },
  })
}
