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
  draft: 'bg-slate-100 text-slate-700',
  in_review: 'bg-amber-100 text-amber-900',
  scheduled: 'bg-blue-100 text-blue-900',
  published: 'bg-emerald-100 text-emerald-900',
  rejected: 'bg-orange-100 text-orange-900',
  trash: 'bg-red-100 text-red-900',
}

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span
      aria-label={`Статус: ${labels[status]}`}
      className={`inline-flex rounded-md px-2.5 py-1 text-sm font-semibold ${classes[status]}`}
    >
      {labels[status]}
    </span>
  )
}
