'use client'

import { useEffect } from 'react'

export function ArticleViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    const controller = new AbortController()

    void fetch(`/api/articles/${articleId}/view`, {
      method: 'POST',
      cache: 'no-store',
      keepalive: true,
      signal: controller.signal,
    }).catch(() => {
      // The page should stay usable even if analytics delivery fails.
    })

    return () => controller.abort()
  }, [articleId])

  return null
}
