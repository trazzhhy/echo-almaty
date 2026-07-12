import { notFound, redirect } from 'next/navigation'
import { ArticleEditorForm } from '@/components/admin/article-editor-form'
import { StatusBadge } from '@/components/admin/status-badge'
import { getCurrentUser } from '@/lib/cms/auth'
import { canEditArticle } from '@/lib/cms/permissions'
import { getArticleById, getUsers } from '@/lib/cms/repository'
import { fullDate } from '@/lib/time'

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/admin/login')
  }

  const { id } = await params
  const article = await getArticleById(id)
  if (!article) {
    notFound()
  }

  if (!canEditArticle(user, article)) {
    redirect('/admin')
  }

  const users = await getUsers()

  return (
    <div className="space-y-6">
      <header className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <StatusBadge status={article.status} />
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{article.title.ru}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Последнее изменение: {fullDate(article.updatedAt, 'ru')}
          </p>
        </div>
        </div>
        <p className="admin-page-description">
          Внесите изменения и выберите нужное действие внизу формы.
        </p>
      </header>

      <ArticleEditorForm article={article} authors={users} currentUser={user} />
    </div>
  )
}
