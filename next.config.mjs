const storagePublicBaseUrl = process.env.STORAGE_PUBLIC_BASE_URL
const remotePatterns = []

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
  images: remotePatterns.length > 0 ? { remotePatterns } : undefined,
}

export default nextConfig
