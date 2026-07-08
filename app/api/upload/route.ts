import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/cms/auth'
import { canCreateNews, canModerate } from '@/lib/cms/permissions'
import { uploadMediaFiles } from '@/lib/storage'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || (!canCreateNews(user) && !canModerate(user))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const files = formData.getAll('files').filter((value): value is File => value instanceof File)

  if (files.length === 0) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
  }

  try {
    const paths = await uploadMediaFiles(
      await Promise.all(
        files.map(async (file) => ({
          buffer: Buffer.from(await file.arrayBuffer()),
          contentType: file.type,
          originalName: file.name,
        })),
      ),
    )

    return NextResponse.json({ paths })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Не удалось загрузить файлы.',
      },
      { status: 400 },
    )
  }
}
