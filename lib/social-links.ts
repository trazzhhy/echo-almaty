import type { Lang } from '@/lib/i18n'

export type SocialNetwork = 'tiktok' | 'instagram' | 'facebook'

/**
 * Official Echo Almaty social accounts.
 *
 * Paste the full profile URL (e.g. 'https://www.instagram.com/<account>') to
 * make a network appear as a clickable link across the site: the side rail
 * on wide desktops, the homepage sidebar card and the footer.
 * Leave '' while the account does not exist yet — no fake links are rendered.
 */
export const socialLinks: Record<SocialNetwork, string> = {
  tiktok: '',
  instagram: '',
  facebook: '',
}

/**
 * While some URLs are still empty: true shows those networks as muted
 * "coming soon" icons (reserves the space, not clickable); false hides them.
 * If every URL is empty and this is false, the widget disappears entirely.
 */
export const showUpcomingSocialNetworks = true

export const socialNetworkOrder: SocialNetwork[] = ['tiktok', 'instagram', 'facebook']

export const socialNetworkNames: Record<SocialNetwork, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  facebook: 'Facebook',
}

export const socialLabels = {
  title: { ru: 'Мы в соцсетях', kk: 'Біз әлеуметтік желілерде' },
  text: {
    ru: 'Главные новости Алматы — в коротком формате.',
    kk: 'Алматының басты жаңалықтары — қысқа форматта.',
  },
  soon: { ru: 'скоро', kk: 'жақында' },
} satisfies Record<string, Record<Lang, string>>

export type SocialItem = {
  network: SocialNetwork
  name: string
  url: string | null
}

export function getSocialItems(): SocialItem[] {
  return socialNetworkOrder
    .map((network) => ({
      network,
      name: socialNetworkNames[network],
      url: socialLinks[network].trim() || null,
    }))
    .filter((item) => item.url || showUpcomingSocialNetworks)
}
