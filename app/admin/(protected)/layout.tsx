import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/admin-shell'
import { getCurrentUser } from '@/lib/cms/auth'

export const dynamic = 'force-dynamic'

export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/admin/login')
  }

  return <AdminShell user={user}>{children}</AdminShell>
}
