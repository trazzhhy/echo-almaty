'use client'

import { useState } from 'react'

// Vercel rejects request bodies over 4.5 MB, so large photos are downscaled
// in the browser first; anything already small is sent untouched.
const COMPRESS_ABOVE_BYTES = 2 * 1024 * 1024
const MAX_IMAGE_SIDE = 2560

async function prepareImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size <= COMPRESS_ABOVE_BYTES) {
    return file
  }

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 0.85),
    )
    if (!blob || blob.size >= file.size) return file

    return new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' })
  } catch {
    return file
  }
}

async function uploadFile(file: File): Promise<string> {
  const body = new FormData()
  body.append('files', await prepareImage(file))

  const response = await fetch('/api/upload', { method: 'POST', body })

  if (response.status === 413) {
    throw new Error(`Файл «${file.name}» слишком большой. Уменьшите его и попробуйте снова.`)
  }

  const payload = (await response.json().catch(() => null)) as
    | { paths?: string[]; error?: string }
    | null

  if (!response.ok || !payload?.paths?.[0]) {
    throw new Error(payload?.error || 'Не удалось загрузить файл.')
  }

  return payload.paths[0]
}

// One request per file keeps each request under the platform size limit.
async function uploadFiles(files: FileList): Promise<string[]> {
  const paths: string[] = []
  for (const file of Array.from(files)) {
    paths.push(await uploadFile(file))
  }
  return paths
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
