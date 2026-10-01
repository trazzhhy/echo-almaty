'use server'

import { saveNewsletterSubscriber } from '@/lib/cms/repository'
import { defaultLang, isLang, localize } from '@/lib/i18n'

export type NewsletterState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function subscribeToNewsletterAction(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get('email') ?? '')
  const formLang = String(formData.get('lang') ?? '')
  const lang = isLang(formLang) ? formLang : defaultLang

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return {
      status: 'error',
      message: localize(
        {
          ru: 'Укажите корректный e-mail.',
          kk: 'Дұрыс e-mail енгізіңіз.',
          en: 'Please enter a valid email address.',
        },
        lang,
      ),
    }
  }

  const result = await saveNewsletterSubscriber(email)
  if (!result.ok) {
    return {
      status: 'error',
      message: result.message,
    }
  }

  return {
    status: 'success',
  }
}
