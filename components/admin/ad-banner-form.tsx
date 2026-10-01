'use client'

import { useActionState } from 'react'
import { saveAdBannerAction, type AdminFormState } from '@/app/admin/actions'
import { MediaPathField } from '@/components/admin/media-field'
import { adBannerSlotLabels, type HomeAdBanner } from '@/lib/home-ads'

const initialState: AdminFormState = {
  status: 'idle',
}

export function AdBannerForm({ banner }: { banner: HomeAdBanner }) {
  const [state, formAction, pending] = useActionState(saveAdBannerAction, initialState)
  const slotLabel = adBannerSlotLabels[banner.slot]
  const saved = state.status === 'idle' && state.message === 'saved'

  return (
    <form action={formAction} className="admin-panel space-y-5">
      <input type="hidden" name="slot" value={banner.slot} />

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold">
          {slotLabel.ru}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {slotLabel.kk}
          </span>
        </h3>
        <label className="flex min-h-11 items-center gap-2.5 rounded-md border border-border px-3.5 py-2 text-sm font-medium">
          <input type="checkbox" name="enabled" defaultChecked={banner.enabled} />
          <span>Показывать на сайте</span>
        </label>
      </div>

      <MediaPathField
        label="Изображение баннера"
        name="imageSrc"
        defaultValue={banner.imageSrc}
      />

      <div>
        <label className="admin-label">Ссылка при клике</label>
        <input
          name="href"
          defaultValue={banner.href}
          className="admin-field"
        />
        <p className="admin-help">
          Внутренний путь (например /advertising) или полная ссылка на сайт рекламодателя.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="admin-label">Описание на русском</label>
          <input
            name="labelRu"
            defaultValue={banner.label.ru}
            className="admin-field"
          />
          <p className="admin-help">Для доступности и поисковиков (alt-текст).</p>
        </div>
        <div>
          <label className="admin-label">Описание на казахском</label>
          <input
            name="labelKk"
            defaultValue={banner.label.kk}
            className="admin-field"
          />
        </div>
        <div>
          <label className="admin-label">Описание на английском</label>
          <input
            name="labelEn"
            defaultValue={banner.label.en}
            className="admin-field"
          />
        </div>
      </div>

      {state.status === 'error' && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {state.message}
        </p>
      )}
      {saved && (
        <p role="status" className="text-sm font-medium text-primary">
          Баннер сохранён.
        </p>
      )}

      <button type="submit" disabled={pending} className="admin-btn-primary">
        {pending ? 'Сохраняем...' : 'Сохранить баннер'}
      </button>
    </form>
  )
}
