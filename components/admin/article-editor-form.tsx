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
    <form action={formAction} className="admin-editor mx-auto max-w-5xl space-y-6">
      <input type="hidden" name="id" value={article?.id ?? ''} />

      <section className="grid gap-8">
        <div>
          <p className="text-sm font-semibold text-primary">Шаг 1</p>
          <h2 className="mt-1 text-2xl font-bold">Напишите текст новости</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Сначала заполните русскую версию, затем добавьте казахский перевод.
          </p>
        </div>
        <div className="space-y-6">
          <h3 className="border-b border-border pb-3 text-xl font-bold">Русская версия</h3>
          <div>
            <label className="admin-label">Заголовок</label>
            <input
              name="titleRu"
              required
              defaultValue={article?.title.ru ?? ''}
              className="admin-field"
            />
          </div>
          <div>
            <label className="admin-label">Краткое описание</label>
            <textarea
              name="excerptRu"
              defaultValue={article?.excerpt.ru ?? ''}
              rows={4}
              className="admin-textarea"
            />
            <p className="admin-help">Два или три предложения, которые кратко объясняют новость.</p>
          </div>
          <div>
            <label className="admin-label">Полный текст</label>
            <textarea
              name="bodyRu"
              required
              defaultValue={article?.body.ru ?? ''}
              rows={10}
              className="admin-textarea"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="border-b border-border pb-3 text-xl font-bold">Казахская версия</h3>
          <div>
            <label className="admin-label">Тақырып</label>
            <input
              name="titleKk"
              required
              defaultValue={article?.title.kk ?? ''}
              className="admin-field"
            />
          </div>
          <div>
            <label className="admin-label">Қысқаша сипаттама</label>
            <textarea
              name="excerptKk"
              defaultValue={article?.excerpt.kk ?? ''}
              rows={4}
              className="admin-textarea"
            />
          </div>
          <div>
            <label className="admin-label">Толық мәтін</label>
            <textarea
              name="bodyKk"
              required
              defaultValue={article?.body.kk ?? ''}
              rows={10}
              className="admin-textarea"
            />
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <MediaPathField
            label="Главное изображение"
            name="mainImage"
            defaultValue={article?.mainImage}
            required
          />
          <p className="admin-help">Обязательное изображение, которое будет показано рядом с новостью.</p>
        </div>
      </section>

      <details className="border border-border bg-card">
        <summary className="cursor-pointer px-5 py-5 text-lg font-bold marker:text-primary sm:px-6">
          Дополнительные настройки
          <span className="mt-1 block text-sm font-normal text-muted-foreground">
            Изображения, видео, адрес страницы и настройки поиска
          </span>
        </summary>
        <div className="grid gap-8 border-t border-border p-5 sm:p-6 xl:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Изображения и видео</h2>
          <div>
            <label className="admin-label">Адрес страницы</label>
            <input
              name="slug"
              defaultValue={article?.slug ?? ''}
              className="admin-field"
            />
            <p className="admin-help">Можно оставить пустым: адрес будет создан автоматически.</p>
          </div>
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
              className="admin-textarea"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Как новость выглядит в поиске</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Эти поля необязательны. Если оставить их пустыми, сайт использует заголовок и описание новости.
          </p>
          <div>
            <label className="admin-label">Заголовок для поиска на русском</label>
            <input
              name="seoTitleRu"
              defaultValue={article?.seoTitle.ru ?? ''}
              className="admin-field"
            />
          </div>
          <div>
            <label className="admin-label">Заголовок для поиска на казахском</label>
            <input
              name="seoTitleKk"
              defaultValue={article?.seoTitle.kk ?? ''}
              className="admin-field"
            />
          </div>
          <div>
            <label className="admin-label">Описание для поиска на русском</label>
            <textarea
              name="seoDescriptionRu"
              defaultValue={article?.seoDescription.ru ?? ''}
              rows={3}
              className="admin-textarea"
            />
          </div>
          <div>
            <label className="admin-label">Описание для поиска на казахском</label>
            <textarea
              name="seoDescriptionKk"
              defaultValue={article?.seoDescription.kk ?? ''}
              rows={3}
              className="admin-textarea"
            />
          </div>
        </div>
        </div>
      </details>

      <section className="grid gap-8">
        <div>
          <p className="text-sm font-semibold text-primary">Шаг 2</p>
          <h2 className="mt-1 text-2xl font-bold">Выберите рубрику и публикацию</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Укажите, где и когда материал должен появиться на сайте.
          </p>
        </div>
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Основные настройки</h3>
          <div>
            <label className="admin-label">Автор</label>
            <select
              name="authorId"
              defaultValue={article?.authorId ?? currentUser.id}
              disabled={!canChangeAuthor}
              className="admin-field"
            >
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name} ({author.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="admin-label">Рубрики</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <label key={category.slug} className="flex items-center gap-3 rounded-md border border-border px-4 py-3 text-base">
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
            <label className="admin-label">Ключевые слова</label>
            <input
              name="tags"
              required
              defaultValue={(article?.tags ?? []).join(', ')}
              className="admin-field"
            />
            <p className="admin-help">Введите слова через запятую. Например: Алматы, транспорт, акимат.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="admin-label">Название источника</label>
              <input
                name="sourceName"
                defaultValue={article?.sourceName ?? ''}
                className="admin-field"
              />
            </div>
            <div>
              <label className="admin-label">Ссылка на источник</label>
              <input
                name="sourceUrl"
                defaultValue={article?.sourceUrl ?? ''}
                className="admin-field"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">Дата и показ на сайте</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="admin-label">Дата публикации</label>
              <input
                type="datetime-local"
                name="publishedAt"
                defaultValue={toDateTimeLocalValue(article?.publishedAt)}
                className="admin-field"
              />
            </div>
            <div>
              <label className="admin-label">Опубликовать позже</label>
              <input
                type="datetime-local"
                name="scheduledAt"
                defaultValue={toDateTimeLocalValue(article?.scheduledAt)}
                className="admin-field"
              />
            </div>
          </div>
          <div>
            <label className="admin-label">Количество просмотров</label>
            <input
              type="number"
              min="0"
              name="views"
              defaultValue={article?.views ?? 0}
              className="admin-field"
            />
          </div>
          <div className="grid gap-3">
            <label className="flex items-center gap-3 rounded-md border border-border px-4 py-3 text-base">
              <input type="checkbox" name="showOnHome" defaultChecked={article?.showOnHome ?? true} />
              <span>Показывать на главной</span>
            </label>
            <label className="flex items-center gap-3 rounded-md border border-border px-4 py-3 text-base">
              <input type="checkbox" name="featured" defaultChecked={article?.featured ?? false} />
              <span>Сделать главной новостью</span>
            </label>
            <label className="flex items-center gap-3 rounded-md border border-border px-4 py-3 text-base">
              <input type="checkbox" name="breaking" defaultChecked={article?.breaking ?? false} />
              <span>Пометить как срочную новость</span>
            </label>
          </div>
        </div>
      </section>

      {state.status === 'error' && (
        <div role="alert" className="rounded-md border border-destructive/25 bg-destructive/5 p-4 text-destructive">
          <p className="font-bold">Не удалось сохранить</p>
          <p className="mt-1 text-sm">{state.message}</p>
        </div>
      )}

      <div className="sticky bottom-0 flex flex-wrap gap-3 border border-border bg-card p-4 shadow-[0_-4px_8px_oklch(0.23_0.025_250/0.06)]">
        <button
          type="submit"
          name="intent"
          value="draft"
          disabled={pending}
          className="admin-btn-secondary"
        >
          {pending ? 'Сохраняем...' : 'Сохранить черновик'}
        </button>

        {!isModerator && (
          <button
            type="submit"
            name="intent"
            value="review"
            disabled={pending}
            className="admin-btn-secondary"
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
              className="admin-btn-primary"
              onClick={(event) => {
                if (!window.confirm('Опубликовать эту новость на сайте прямо сейчас?')) {
                  event.preventDefault()
                }
              }}
            >
              Опубликовать
            </button>
            <button
              type="submit"
              name="intent"
              value="schedule"
              disabled={pending}
              className="admin-btn-secondary"
            >
              Запланировать
            </button>
          </>
        )}
      </div>
    </form>
  )
}
