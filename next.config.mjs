const storagePublicBaseUrl = process.env.STORAGE_PUBLIC_BASE_URL
// Images uploaded to Vercel Blob are served from this domain.
const remotePatterns = [
  { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
]

if (storagePublicBaseUrl) {
  const url = new URL(storagePublicBaseUrl)
  const pathname = url.pathname === '/' ? '/**' : `${url.pathname.replace(/\/$/, '')}/**`

  remotePatterns.push({
    protocol: url.protocol.replace(':', ''),
    hostname: url.hostname,
    pathname,
    ...(url.port ? { port: url.port } : {}),
  })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns },
}

export default nextConfig
