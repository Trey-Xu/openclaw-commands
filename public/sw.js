const CACHE = 'openclaw-commands-v1'
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

self.addEventListener('fetch', (e) => {
  if (e.request.url.indexOf(self.location.origin) !== 0) return
  const url = new URL(e.request.url)
  if (url.pathname.indexOf(BASE) !== 0) return
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
