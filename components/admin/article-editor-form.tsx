'use client'

import { useActionState } from 'react'
import { saveArticleAction, type AdminFormState } from '@/app/admin/actions'
import { categories, localize, type Lang } from '@/lib/i18n'
import { toDateTimeLocalValue } from '@/lib/time'
import type { Article, AuthUser } from '@/lib/cms/types'
import { MediaListField, MediaPathField } from './media-field'

const initialState: AdminFormState = {
  status: 'idle',
}

function joinLines(values: string[]) {
  return values.join('\n')
}

export function ArticleEditorForm({
  article,
  authors,
  currentUser,
}: {
  article: Article | null
  authors: AuthUser[]
  currentUser: AuthUser
}) {
  const [state, formAction, pending] = useActionState(saveArticleAction, initialState)
  const canChangeAuthor = currentUser.role === 'admin' || currentUser.role === 'editor'
  const canPublish = currentUser.role === 'admin' || currentUser.role === 'editor'
  const isModerator = currentUser.role === 'moderator'

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="id" value={article?.id ?? ''} />

      <section className="grid gap-6 rounded-[2rem] border border-border bg-card p-6 xl:grid-cols-2">
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold">Контент RU</h2>
          <div>
            <label className="mb-2 block text-sm font-medium">Заголовок RU</label>
            <input
              name="titleRu"
              required
              defaultValue={article?.title.ru ?? ''}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Анонс RU</label>
            <textarea
              name="excerptRu"
              defaultValue={article?.excerpt.ru ?? ''}
              rows={4}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Основной текст RU</label>
            <textarea
              name="bodyRu"
              required
              defaultValue={article?.body.ru ?? ''}
              rows={10}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold">Контент KK</h2>
          <div>
            <label className="mb-2 block text-sm font-medium">Заголовок KK</label>
            <input
              name="titleKk"
              required
              defaultValue={article?.title.kk ?? ''}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Анонс KK</label>
            <textarea
              name="excerptKk"
              defaultValue={article?.excerpt.kk ?? ''}
              rows={4}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Основной текст KK</label>
            <textarea
              name="bodyKk"
              required
              defaultValue={article?.body.kk ?? ''}
              rows={10}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-[2rem] border border-border bg-card p-6 xl:grid-cols-2">
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold">Публикация</h2>
          <div>
            <label className="mb-2 block text-sm font-medium">Slug</label>
            <input
              name="slug"
              defaultValue={article?.slug ?? ''}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
            />
          </div>
          <MediaPathField
            label="Главное изображение"
            name="mainImage"
            defaultValue={article?.mainImage}
          />
          <MediaListField
            label="Галерея изображений"
            name="gallery"
            defaultValue={joinLines(article?.gallery ?? [])}
          />
          <div>
            <label className="mb-2 block text-sm font-medium">
              Видео (YouTube/Vimeo, по одному URL в строке)
            </label>
            <textarea
              name="videoUrls"
              defaultValue={joinLines(article?.videoUrls ?? [])}
              rows={4}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold">SEO и метаданные</h2>
          <div>
            <label className="mb-2 block text-sm font-medium">SEO title RU</label>
            <input
              name="seoTitleRu"
              defaultValue={article?.seoTitle.ru ?? ''}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">SEO title KK</label>
            <input
              name="seoTitleKk"
              defaultValue={article?.seoTitle.kk ?? ''}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">SEO description RU</label>
            <textarea
              name="seoDescriptionRu"
              defaultValue={article?.seoDescription.ru ?? ''}
              rows={3}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">SEO description KK</label>
            <textarea
              name="seoDescriptionKk"
              defaultValue={article?.seoDescription.kk ?? ''}
              rows={3}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-[2rem] border border-border bg-card p-6 xl:grid-cols-2">
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold">Редакционные поля</h2>
          <div>
            <label className="mb-2 block text-sm font-medium">Автор</label>
            <select
              name="authorId"
              defaultValue={article?.authorId ?? currentUser.id}
              disabled={!canChangeAuthor}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary disabled:opacity-60"
            >
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name} ({author.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">Рубрики</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <label key={category.slug} className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm">
                  <input
                    type="checkbox"
                    name="categories"
                    value={category.slug}
                    defaultChecked={article?.categories.includes(category.slug) ?? false}
                  />
                  <span>{localize(category.name, 'ru' as Lang)}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Теги (обязательно)</label>
            <input
              name="tags"
              required
              defaultValue={(article?.tags ?? []).join(', ')}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Источник</label>
              <input
                name="sourceName"
                defaultValue={article?.sourceName ?? ''}
                className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">URL источника</label>
              <input
                name="sourceUrl"
                defaultValue={article?.sourceUrl ?? ''}
                className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold">Статус и видимость</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Дата публикации</label>
              <input
                type="datetime-local"
                name="publishedAt"
                defaultValue={toDateTimeLocalValue(article?.publishedAt)}
                className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">План публикации</label>
              <input
                type="datetime-local"
                name="scheduledAt"
                defaultValue={toDateTimeLocalValue(article?.scheduledAt)}
                className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Просмотры</label>
            <input
              type="number"
              min="0"
              name="views"
              defaultValue={article?.views ?? 0}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
            />
          </div>
          <div className="grid gap-3">
            <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm">
              <input type="checkbox" name="showOnHome" defaultChecked={article?.showOnHome ?? true} />
              <span>Показывать на главной</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm">
              <input type="checkbox" name="featured" defaultChecked={article?.featured ?? false} />
              <span>Сделать hero-материалом</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3 text-sm">
              <input type="checkbox" name="breaking" defaultChecked={article?.breaking ?? false} />
              <span>Пометить как breaking news</span>
            </label>
          </div>
        </div>
      </section>

      {state.status === 'error' && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.message}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          name="intent"
          value="draft"
          disabled={pending}
          className="rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:bg-secondary disabled:opacity-70"
        >
          {pending ? 'Сохраняем...' : 'Сохранить черновик'}
        </button>

        {!isModerator && (
          <button
            type="submit"
            name="intent"
            value="review"
            disabled={pending}
            className="rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:bg-secondary disabled:opacity-70"
          >
            Отправить на проверку
          </button>
        )}

        {canPublish && (
          <>
            <button
              type="submit"
              name="intent"
              value="publish"
              disabled={pending}
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
            >
              Опубликовать
            </button>
            <button
              type="submit"
              name="intent"
              value="schedule"
              disabled={pending}
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
            >
              Запланировать
            </button>
          </>
        )}
      </div>
    </form>
  )
}
