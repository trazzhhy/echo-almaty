'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { categories, type CategorySlug } from '@/lib/i18n'
import { hashPassword, authenticateUser, clearSession, getCurrentUser, setSession } from '@/lib/cms/auth'
import {
  canChangeOwnership,
  canCreateNews,
  canEditArticle,
  canManageUsers,
  canModerate,
  canPublish,
} from '@/lib/cms/permissions'
import {
  getArticleById,
  getUserByEmail,
  getUserById,
  saveArticle,
  saveUser,
  touchUserLogin,
  updateArticleState,
} from '@/lib/cms/repository'
import type { Article, AuthUser, SaveArticleInput } from '@/lib/cms/types'
import { fromDateTimeLocalValue } from '@/lib/time'
import { splitBySeparators } from '@/lib/utils'

export type AdminFormState = {
  status: 'idle' | 'error'
  message?: string
}

function getAllowedCategories(values: string[]): CategorySlug[] {
  const allowed = new Set(categories.map((category) => category.slug))
  return values.filter((value): value is CategorySlug => allowed.has(value as CategorySlug))
}

function revalidateAdminAndPublic(article?: Article | null) {
  revalidatePath('/admin')
  revalidatePath('/admin/news')
  revalidatePath('/admin/review')
  revalidatePath('/admin/trash')
  revalidatePath('/ru')
  revalidatePath('/kk')
  revalidatePath('/ru/news')
  revalidatePath('/kk/news')
  revalidatePath('/ru/categories')
  revalidatePath('/kk/categories')
  revalidatePath('/ru/archive')
  revalidatePath('/kk/archive')
  revalidatePath('/ru/authors')
  revalidatePath('/kk/authors')
  revalidatePath('/ru/search')
  revalidatePath('/kk/search')

  if (article) {
    revalidatePath(`/ru/article/${article.slug}`)
    revalidatePath(`/kk/article/${article.slug}`)
    revalidatePath(`/ru/author/${article.authorId}`)
    revalidatePath(`/kk/author/${article.authorId}`)
    for (const category of article.categories) {
      revalidatePath(`/ru/category/${category}`)
      revalidatePath(`/kk/category/${category}`)
    }
  }
}

function requireText(value: string, label: string) {
  if (!value.trim()) {
    throw new Error(`Поле «${label}» обязательно.`)
  }
}

function parseArticleInput(formData: FormData, actor: AuthUser): SaveArticleInput {
  const categoriesInput = getAllowedCategories(
    formData.getAll('categories').map((value) => String(value)),
  )

  const authorId = canChangeOwnership(actor)
    ? String(formData.get('authorId') ?? actor.id)
    : actor.id

  return {
    id: String(formData.get('id') ?? '') || undefined,
    slug: String(formData.get('slug') ?? ''),
    title: {
      ru: String(formData.get('titleRu') ?? ''),
      kk: String(formData.get('titleKk') ?? ''),
    },
    excerpt: {
      ru: String(formData.get('excerptRu') ?? ''),
      kk: String(formData.get('excerptKk') ?? ''),
    },
    body: {
      ru: String(formData.get('bodyRu') ?? ''),
      kk: String(formData.get('bodyKk') ?? ''),
    },
    seoTitle: {
      ru: String(formData.get('seoTitleRu') ?? ''),
      kk: String(formData.get('seoTitleKk') ?? ''),
    },
    seoDescription: {
      ru: String(formData.get('seoDescriptionRu') ?? ''),
      kk: String(formData.get('seoDescriptionKk') ?? ''),
    },
    mainImage: String(formData.get('mainImage') ?? ''),
    gallery: splitBySeparators(String(formData.get('gallery') ?? '')),
    videoUrls: splitBySeparators(String(formData.get('videoUrls') ?? '')),
    authorId,
    categories: categoriesInput,
    tags: splitBySeparators(String(formData.get('tags') ?? '')),
    sourceName: String(formData.get('sourceName') ?? ''),
    sourceUrl: String(formData.get('sourceUrl') ?? ''),
    showOnHome: formData.get('showOnHome') === 'on',
    featured: formData.get('featured') === 'on',
    breaking: formData.get('breaking') === 'on',
    views: Number(formData.get('views') ?? 0),
    publishedAt: fromDateTimeLocalValue(String(formData.get('publishedAt') ?? '')),
    scheduledAt: fromDateTimeLocalValue(String(formData.get('scheduledAt') ?? '')),
  }
}

export async function loginAction(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const user = await authenticateUser(email, password)
  if (!user) {
    return {
      status: 'error',
      message: 'Неверный логин или пароль.',
    }
  }

  await setSession(user)
  await touchUserLogin(user.id)
  redirect('/admin')
}

export async function logoutAction() {
  await clearSession()
  redirect('/admin/login')
}

export async function saveArticleAction(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  try {
    const actor = await getCurrentUser()
    if (!actor || !canCreateNews(actor)) {
      return {
        status: 'error',
        message: 'Недостаточно прав для работы с материалами.',
      }
    }

    const input = parseArticleInput(formData, actor)
    requireText(input.title.ru, 'Заголовок на русском')
    requireText(input.title.kk, 'Заголовок на казахском')
    requireText(input.body.ru, 'Текст на русском')
    requireText(input.body.kk, 'Текст на казахском')
    requireText(input.mainImage, 'Главное изображение')

    if (input.categories.length === 0) {
      return {
        status: 'error',
        message: 'Выберите хотя бы одну рубрику.',
      }
    }

    if (input.tags.length === 0) {
      return {
        status: 'error',
        message: 'Добавьте хотя бы один тег.',
      }
    }

    const articleId = input.id
    const existing = articleId ? await getArticleById(articleId) : null

    if (existing && !canEditArticle(actor, existing)) {
      return {
        status: 'error',
        message: 'У вас нет прав на редактирование этого материала.',
      }
    }

    const owner = await getUserById(input.authorId)
    if (!owner) {
      return {
        status: 'error',
        message: 'Выбранный автор не найден.',
      }
    }

    const intent = String(formData.get('intent') ?? 'draft')
    if ((intent === 'publish' || intent === 'schedule') && !canPublish(actor)) {
      return {
        status: 'error',
        message: 'Публикация и планирование доступны только редактору или администратору.',
      }
    }

    if (intent === 'reject' && !canModerate(actor)) {
      return {
        status: 'error',
        message: 'Недостаточно прав для возврата материала.',
      }
    }

    if (intent === 'schedule' && !input.scheduledAt) {
      return {
        status: 'error',
        message: 'Укажите дату и время плановой публикации.',
      }
    }

    const nextArticle = await saveArticle(
      actor,
      input,
      intent === 'review'
        ? 'review'
        : intent === 'publish'
          ? 'publish'
          : intent === 'schedule'
            ? 'schedule'
            : intent === 'reject'
              ? 'reject'
              : 'draft',
    )

    revalidateAdminAndPublic(nextArticle)
    redirect(`/admin/news/${nextArticle.id}`)
  } catch (error) {
    return {
      status: 'error',
      message:
        error instanceof Error ? error.message : 'Не удалось сохранить материал.',
    }
  }
}

export async function updateArticleStateAction(formData: FormData) {
  const actor = await getCurrentUser()
  if (!actor) {
    redirect('/admin/login')
  }

  const articleId = String(formData.get('articleId') ?? '')
  const action = String(formData.get('action') ?? '')
  const article = await getArticleById(articleId)

  if (!article || !canEditArticle(actor, article)) {
    return
  }

  if ((action === 'publish' || action === 'show_home' || action === 'hide_home') && !canPublish(actor)) {
    return
  }

  if (action === 'restore' || action === 'trash' || action === 'purge' || action === 'publish' || action === 'hide_home' || action === 'show_home' || action === 'send_review') {
    await updateArticleState(
      actor,
      articleId,
      action as
        | 'trash'
        | 'restore'
        | 'publish'
        | 'hide_home'
        | 'show_home'
        | 'purge'
        | 'send_review',
    )
    revalidateAdminAndPublic(article)
  }
}

export async function saveUserAction(
  _prevState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const actor = await getCurrentUser()
  if (!actor || !canManageUsers(actor)) {
    return {
      status: 'error',
      message: 'Только администратор может управлять пользователями.',
    }
  }

  const id = String(formData.get('id') ?? '')
  const name = String(formData.get('name') ?? '')
  const email = String(formData.get('email') ?? '').toLowerCase()
  const role = String(formData.get('role') ?? 'author') as AuthUser['role']
  const password = String(formData.get('password') ?? '')
  const active = formData.get('active') === 'on'
  const avatar = String(formData.get('avatar') ?? '/placeholder-user.jpg')
  const bioRu = String(formData.get('bioRu') ?? '')
  const bioKk = String(formData.get('bioKk') ?? '')

  requireText(name, 'Имя')
  requireText(email, 'E-mail')

  const existingByEmail = await getUserByEmail(email)
  if (existingByEmail && existingByEmail.id !== id) {
    return {
      status: 'error',
      message: 'Пользователь с таким e-mail уже существует.',
    }
  }

  let passwordHash: string | undefined
  if (password) {
    passwordHash = hashPassword(password)
  } else if (!id) {
    return {
      status: 'error',
      message: 'Для нового пользователя нужен пароль.',
    }
  }

  await saveUser(actor, {
    id,
    name,
    email,
    role,
    active,
    avatar,
    bio: {
      ru: bioRu,
      kk: bioKk,
    },
    passwordHash,
  })

  revalidatePath('/admin/users')
  redirect('/admin/users')
}
