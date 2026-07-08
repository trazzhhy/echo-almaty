'use client'

import { useState } from 'react'

async function uploadFiles(files: FileList): Promise<string[]> {
  const body = new FormData()
  Array.from(files).forEach((file) => {
    body.append('files', file)
  })

  const response = await fetch('/api/upload', {
    method: 'POST',
    body,
  })

  if (!response.ok) {
    throw new Error('Не удалось загрузить файлы.')
  }

  const payload = (await response.json()) as { paths: string[] }
  return payload.paths
}

export function MediaPathField({
  label,
  name,
  defaultValue,
}: {
  label: string
  name: string
  defaultValue?: string
}) {
  const [value, setValue] = useState(defaultValue ?? '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <input
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-11 w-full rounded-2xl border border-border bg-background px-4 outline-none transition focus:border-primary"
      />
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-primary">
        <span>{pending ? 'Загрузка...' : 'Загрузить файл'}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (event) => {
            const files = event.target.files
            if (!files || files.length === 0) return

            setPending(true)
            setError('')

            try {
              const [path] = await uploadFiles(files)
              setValue(path)
            } catch (uploadError) {
              setError(
                uploadError instanceof Error
                  ? uploadError.message
                  : 'Ошибка загрузки.',
              )
            } finally {
              setPending(false)
              event.target.value = ''
            }
          }}
        />
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export function MediaListField({
  label,
  name,
  defaultValue,
}: {
  label: string
  name: string
  defaultValue?: string
}) {
  const [value, setValue] = useState(defaultValue ?? '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={4}
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary"
      />
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-primary">
        <span>{pending ? 'Загрузка...' : 'Загрузить изображения'}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={async (event) => {
            const files = event.target.files
            if (!files || files.length === 0) return

            setPending(true)
            setError('')

            try {
              const paths = await uploadFiles(files)
              setValue((current) => [current.trim(), ...paths].filter(Boolean).join('\n'))
            } catch (uploadError) {
              setError(
                uploadError instanceof Error
                  ? uploadError.message
                  : 'Ошибка загрузки.',
              )
            } finally {
              setPending(false)
              event.target.value = ''
            }
          }}
        />
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
