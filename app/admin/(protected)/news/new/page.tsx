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
      <header className="mx-auto max-w-5xl">
        <h1 className="admin-page-title">Новая новость</h1>
        <p className="admin-page-description">
          Заполните текст, выберите рубрику и сохраните черновик. Опубликовать можно сразу или позже.
        </p>
      </header>

      <ArticleEditorForm article={null} authors={users} currentUser={user} />
    </div>
  )
}
