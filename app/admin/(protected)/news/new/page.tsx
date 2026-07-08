import { redirect } from 'next/navigation'
import { ArticleEditorForm } from '@/components/admin/article-editor-form'
import { getCurrentUser } from '@/lib/cms/auth'
import { canCreateNews } from '@/lib/cms/permissions'
import { getUsers } from '@/lib/cms/repository'

export default async function NewArticlePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/admin/login')
  }

  if (!canCreateNews(user)) {
    redirect('/admin')
  }

  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
          Новая публикация
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold">Создание новости</h1>
      </div>

      <ArticleEditorForm article={null} authors={users} currentUser={user} />
    </div>
  )
}
