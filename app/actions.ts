'use server'

import { saveNewsletterSubscriber } from '@/lib/cms/repository'

export type NewsletterState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function subscribeToNewsletterAction(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get('email') ?? '')

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return {
      status: 'error',
      message: 'Укажите корректный e-mail.',
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
