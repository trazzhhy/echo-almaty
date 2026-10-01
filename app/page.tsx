import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { defaultLang, isLang, langCookieName } from '@/lib/i18n'

export default async function RootPage() {
  const saved = (await cookies()).get(langCookieName)?.value ?? ''
  redirect(`/${isLang(saved) ? saved : defaultLang}`)
}
