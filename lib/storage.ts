import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { put } from '@vercel/blob'
import { getOptionalEnv, getRequiredEnv, isProduction } from './env'

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

type StorageDriver = 'local' | 's3' | 'blob'

export type UploadableFile = {
  buffer: Buffer
  contentType: string
  originalName: string
}

function noStorageError() {
  // Names only — values are credentials. Helps tell "not connected" apart
  // from "connected to another environment" or "not redeployed yet".
  const blobVars = Object.keys(process.env).filter((name) => name.includes('BLOB')).sort()
  return new Error(
    'Хранилище для изображений не подключено. В Vercel откройте проект → Storage → ' +
      'Create Database → Blob (доступ Public) → Connect, затем сделайте Redeploy. ' +
      `[окружение: ${process.env.VERCEL_ENV ?? 'неизвестно'}; ` +
      `переменные BLOB: ${blobVars.length > 0 ? blobVars.join(', ') : 'нет'}]`,
  )
}

function getStorageDriver(): StorageDriver {
  const configured = getOptionalEnv('STORAGE_DRIVER')
  // Newer Vercel Blob stores connect via OIDC and only set BLOB_STORE_ID;
  // older ones set BLOB_READ_WRITE_TOKEN. @vercel/blob handles both.
  const hasBlob = Boolean(
    getOptionalEnv('BLOB_READ_WRITE_TOKEN') || getOptionalEnv('BLOB_STORE_ID'),
  )

  // Vercel's filesystem is read-only, so "local" can never work there.
  if (configured === 'local' && process.env.VERCEL) {
    if (hasBlob) return 'blob'
    throw noStorageError()
  }

  if (configured === 'local' || configured === 's3' || configured === 'blob') {
    return configured
  }

  // Not configured: use whatever storage is connected.
  if (hasBlob) return 'blob'
  if (getOptionalEnv('STORAGE_S3_BUCKET')) return 's3'
  if (isProduction()) throw noStorageError()
  return 'local'
}

function getExtension(file: UploadableFile) {
  const fileExtension = path.extname(file.originalName).toLowerCase()
  if (fileExtension) {
    return fileExtension
  }

  if (file.contentType === 'image/jpeg') return '.jpg'
  if (file.contentType === 'image/png') return '.png'
  if (file.contentType === 'image/webp') return '.webp'
  if (file.contentType === 'image/gif') return '.gif'
  if (file.contentType === 'image/svg+xml') return '.svg'

  return '.bin'
}

function createObjectKey(file: UploadableFile) {
  const now = new Date()
  const prefix = getOptionalEnv('STORAGE_S3_PREFIX')?.replace(/^\/+|\/+$/g, '') ?? 'uploads'
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${prefix}/${now.getFullYear()}/${month}/${randomUUID()}${getExtension(file)}`
}

function assertUploadableImage(file: UploadableFile) {
  if (!file.contentType.startsWith('image/')) {
    throw new Error('Можно загружать только изображения.')
  }

  if (file.buffer.byteLength > MAX_UPLOAD_BYTES) {
    throw new Error('Размер изображения не должен превышать 10 МБ.')
  }
}

let s3Client: S3Client | null = null

function getS3Client() {
  if (s3Client) {
    return s3Client
  }

  s3Client = new S3Client({
    region: getRequiredEnv('STORAGE_S3_REGION'),
    endpoint: getOptionalEnv('STORAGE_S3_ENDPOINT'),
    forcePathStyle: getOptionalEnv('STORAGE_S3_FORCE_PATH_STYLE') === 'true',
    credentials: {
      accessKeyId: getRequiredEnv('STORAGE_S3_ACCESS_KEY_ID'),
      secretAccessKey: getRequiredEnv('STORAGE_S3_SECRET_ACCESS_KEY'),
    },
  })

  return s3Client
}

function getS3PublicBaseUrl() {
  return getRequiredEnv('STORAGE_PUBLIC_BASE_URL').replace(/\/+$/, '')
}

async function uploadToLocal(files: UploadableFile[]) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })

  return Promise.all(
    files.map(async (file) => {
      const fileName = `${randomUUID()}${getExtension(file)}`
      const target = path.join(uploadDir, fileName)
      await writeFile(target, file.buffer)
      return `/uploads/${fileName}`
    }),
  )
}

async function uploadToS3(files: UploadableFile[]) {
  const bucket = getRequiredEnv('STORAGE_S3_BUCKET')
  const client = getS3Client()
  const publicBaseUrl = getS3PublicBaseUrl()

  return Promise.all(
    files.map(async (file) => {
      const key = createObjectKey(file)
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.contentType,
        }),
      )

      return `${publicBaseUrl}/${key}`
    }),
  )
}

async function uploadToBlob(files: UploadableFile[]) {
  return Promise.all(
    files.map(async (file) => {
      const blob = await put(createObjectKey(file), file.buffer, {
        access: 'public',
        contentType: file.contentType,
      })
      return blob.url
    }),
  )
}

export async function uploadMediaFiles(files: UploadableFile[]) {
  files.forEach(assertUploadableImage)

  const driver = getStorageDriver()
  if (driver === 'blob') return uploadToBlob(files)
  if (driver === 's3') return uploadToS3(files)
  return uploadToLocal(files)
}
