import type { ArticleStatus } from '@/lib/cms/types'

const labels: Record<ArticleStatus, string> = {
  draft: 'Черновик',
  in_review: 'На проверке',
  scheduled: 'Запланировано',
  published: 'Опубликовано',
  rejected: 'Возвращено',
  trash: 'Корзина',
}

const classes: Record<ArticleStatus, string> = {
  draft: 'bg-[#ede0cc] text-[#5e4936]',
  in_review: 'bg-[#f1d7a8] text-[#6e4b1f]',
  scheduled: 'bg-[#d9e7df] text-[#2f5548]',
  published: 'bg-[#dbe7d3] text-[#345437]',
  rejected: 'bg-[#efd5cd] text-[#7d4033]',
  trash: 'bg-[#dcd3c7] text-[#4f4437]',
}

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes[status]}`}>
      {labels[status]}
    </span>
  )
}
