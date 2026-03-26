import bundled from './releases.bundled.json'

const API_BASE = 'https://api.github.com/repos/openclaw/openclaw'
const CACHE_KEY = 'openclaw-release-notes-cache:v1'
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6h

function safeJsonParse(raw) {
  try { return JSON.parse(raw) } catch { return null }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function renderInlineMarkdown(md) {
  // Minimal inline markdown renderer for release bullets.
  // Escapes HTML first, then allows: links, inline code, bold.
  let s = escapeHtml(md ?? '')
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  return s
}

export function pickBilingualText(item, locale) {
  if (item && typeof item === 'object') {
    const zh = typeof item.zh === 'string' ? item.zh : ''
    const en = typeof item.en === 'string' ? item.en : ''
    if (locale === 'zh') return zh || en || ''
    return en || zh || ''
  }
  return String(item ?? '')
}

function toReleaseModel(release) {
  const tagName = release.tag_name
  const version = tagName?.startsWith('v') ? tagName.slice(1) : tagName
  const body = release.body || ''
  const sections = parseReleaseBody(body)
  return {
    tagName,
    version,
    name: release.name || tagName,
    publishedAt: release.published_at,
    url: release.html_url,
    sections
  }
}

function parseReleaseBody(body) {
  const text = String(body || '')
  const lines = text.split('\n')

  const out = []
  let current = null

  const pushCurrent = () => {
    if (current) out.push(current)
    current = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const heading = line.match(/^###\s+(.+?)\s*$/)
    if (heading) {
      pushCurrent()
      current = { title: heading[1].trim(), items: [] }
      continue
    }
    const item = line.match(/^-\s+(.+?)\s*$/)
    if (item) {
      if (!current) current = { title: 'Changes', items: [] }
      current.items.push({ en: item[1].trim() })
    }
  }
  pushCurrent()

  // Normalize ordering for common headings.
  const preferred = ['Breaking', 'Changes', 'Fixes']
  out.sort((a, b) => {
    const ai = preferred.indexOf(a.title)
    const bi = preferred.indexOf(b.title)
    if (ai === -1 && bi === -1) return a.title.localeCompare(b.title)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
  return out
}

function loadCache() {
  const raw = localStorage.getItem(CACHE_KEY)
  if (!raw) return null
  const parsed = safeJsonParse(raw)
  if (!parsed?.ts || !parsed?.releases) return null
  if (Date.now() - parsed.ts > CACHE_TTL_MS) return null
  return parsed.releases
}

function saveCache(releases) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), releases }))
}

export async function fetchReleaseNotes({ force = false } = {}) {
  if (!force) {
    const cached = loadCache()
    if (cached) return cached
  }

  try {
    const res = await fetch(`${API_BASE}/releases?per_page=100`, {
      headers: { Accept: 'application/vnd.github+json' }
    })
    if (!res.ok) throw new Error(`GitHub API ${res.status}`)
    const json = await res.json()
    const releases = (json || [])
      .filter(r => !r.draft)
      .map(toReleaseModel)
    saveCache(releases)
    return releases
  } catch {
    // Fallback to bundled minimal data (still keeps the page usable offline).
    return bundled.releases || []
  }
}

