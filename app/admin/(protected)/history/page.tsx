import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/cms/auth'
import { canAccessHistory } from '@/lib/cms/permissions'
import { getAuditEntries } from '@/lib/cms/repository'
import { fullDate } from '@/lib/time'

export default async function HistoryPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/admin/login')
  }

  if (!canAccessHistory(user)) {
    redirect('/admin')
  }

  const history = await getAuditEntries()

  return (
    <div className="space-y-8">
      <header>
        <h1 className="admin-page-title">История действий</h1>
        <p className="admin-page-description">
          Запись о том, кто и когда менял материалы или настройки сайта.
        </p>
      </header>

      <div className="overflow-x-auto border border-border bg-card">
        <table className="min-w-[640px] w-full border-collapse text-left text-sm">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Когда</th>
              <th className="px-4 py-3 font-semibold">Кто</th>
              <th className="px-4 py-3 font-semibold">Что изменилось</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id} className="border-t border-border">
                <td className="px-4 py-3 text-muted-foreground">
                  {fullDate(entry.timestamp, 'ru')}
                </td>
                <td className="px-4 py-3">{entry.actorName}</td>
                <td className="px-4 py-3">{entry.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
