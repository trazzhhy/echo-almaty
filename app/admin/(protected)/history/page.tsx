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
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
          История
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold">Журнал изменений</h1>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-border">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Когда</th>
              <th className="px-4 py-3 font-semibold">Кто</th>
              <th className="px-4 py-3 font-semibold">Сущность</th>
              <th className="px-4 py-3 font-semibold">Действие</th>
              <th className="px-4 py-3 font-semibold">Описание</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id} className="border-t border-border">
                <td className="px-4 py-3 text-muted-foreground">
                  {fullDate(entry.timestamp, 'ru')}
                </td>
                <td className="px-4 py-3">{entry.actorName}</td>
                <td className="px-4 py-3 uppercase text-muted-foreground">
                  {entry.entityType}
                </td>
                <td className="px-4 py-3">{entry.action}</td>
                <td className="px-4 py-3">{entry.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
