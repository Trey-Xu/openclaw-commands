const CACHE = 'openclaw-commands-v4'
const BASE = '/openclaw-commands/'

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll([
        BASE,
        BASE + 'index.html'
      ])
    )
  )
  self.skipWaiting()
})

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  try {
    const fresh = await fetch(request)
    if (fresh && fresh.ok) {
      cache.put(request, fresh.clone())
    }
    return fresh
  } catch {
    const cached = await cache.match(request)
    if (cached) return cached
    throw new Error('offline')
  }
}

self.addEventListener('fetch', (e) => {
  if (e.request.url.indexOf(self.location.origin) !== 0) return
  const url = new URL(e.request.url)
  if (url.pathname.indexOf(BASE) !== 0) return
  if (e.request.mode === 'navigate') {
    e.respondWith(networkFirst(BASE + 'index.html'))
    return
  }
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})
