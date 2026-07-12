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
  required = false,
}: {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
}) {
  const [value, setValue] = useState(defaultValue ?? '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="space-y-2">
      <label className="admin-label">{label}</label>
      <input
        name={name}
        value={value}
        required={required}
        onChange={(event) => setValue(event.target.value)}
        className="admin-field"
      />
      <p className="admin-help">Вставьте ссылку или выберите файл с компьютера.</p>
      <label className="admin-btn-secondary cursor-pointer" aria-busy={pending}>
        <span>{pending ? 'Загружаем...' : 'Выбрать изображение'}</span>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
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
      {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
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
      <label className="admin-label">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={4}
        className="admin-textarea"
      />
      <p className="admin-help">Можно выбрать несколько изображений сразу.</p>
      <label className="admin-btn-secondary cursor-pointer" aria-busy={pending}>
        <span>{pending ? 'Загружаем...' : 'Выбрать изображения'}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
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
      {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  )
}
