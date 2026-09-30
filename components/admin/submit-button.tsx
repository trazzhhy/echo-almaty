'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton({
  children,
  className,
  pendingLabel = 'Сохраняем...',
  confirmMessage,
}: {
  children: React.ReactNode
  className?: string
  pendingLabel?: string
  confirmMessage?: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault()
        }
      }}
    >
      {pending ? pendingLabel : children}
    </button>
  )
}
