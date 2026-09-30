import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getOptionalEnv, getRequiredEnv, isProduction } from './env'

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

type StorageDriver = 'local' | 's3'

export type UploadableFile = {
  buffer: Buffer
  contentType: string
  originalName: string
}

function getStorageDriver(): StorageDriver {
  const configured = getOptionalEnv('STORAGE_DRIVER')
  if (configured === 'local' || configured === 's3') {
    return configured
  }

  return isProduction() ? 's3' : 'local'
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

export async function uploadMediaFiles(files: UploadableFile[]) {
  files.forEach(assertUploadableImage)

  const driver = getStorageDriver()
  return driver === 's3' ? uploadToS3(files) : uploadToLocal(files)
}
