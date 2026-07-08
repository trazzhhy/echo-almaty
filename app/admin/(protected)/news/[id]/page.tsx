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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <StatusBadge status={article.status} />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {article.slug}
            </span>
          </div>
          <h1 className="mt-3 font-heading text-4xl font-bold">{article.title.ru}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Обновлено {fullDate(article.updatedAt, 'ru')} · Ревизия #{article.revision}
          </p>
        </div>
      </div>

      <ArticleEditorForm article={article} authors={users} currentUser={user} />
    </div>
  )
}
