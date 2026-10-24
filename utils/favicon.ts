const PRIVATE_HOST = /^(localhost|.+\.local|.+\.home|.+\.home\.arpa|.+\.lan|.+\.internal)$/

let cachedBase: string | null = null

/** Prefix an absolute public path with the app base URL (e.g. /nutab in production). */
export function withBase(path: string): string {
  if (cachedBase === null) {
    cachedBase = useRuntimeConfig().app.baseURL.replace(/\/+$/, '')
  }
  return cachedBase + path
}

export function isPrivateHost(host: string): boolean {
  if (PRIVATE_HOST.test(host)) return true
  if (/^(127\.|10\.|192\.168\.)/.test(host)) return true
  const m = host.match(/^172\.(\d+)\./)
  if (m) return Number(m[1]) >= 16 && Number(m[1]) <= 31
  return false
}

export function normalizeHref(href: string): string {
  return /^https?:\/\//i.test(href) ? href : `https://${href}`
}

export function faviconUrl(link: { href: string; icon?: string }): string {
  if (link.icon) return withBase(link.icon)
  let host = ''
  try {
    host = new URL(normalizeHref(link.href)).hostname
  } catch {
    return withBase('/default_favicon.png')
  }
  // public favicon services cannot resolve internal hosts; use the fallback there
  if (isPrivateHost(host)) return withBase('/default_favicon.png')
  return `https://icons.duckduckgo.com/ip3/${host}.ico`
}
