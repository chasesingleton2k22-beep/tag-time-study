const CACHE_NAME = 'tag-time-study-v9';

// Core assets cached on install. SheetJS CDN is attempted but won't block install if offline.
const CORE_ASSETS = ['./', './index.html'];
const CDN_SHEETJS = 'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await cache.addAll(CORE_ASSETS);
      try { await cache.add(CDN_SHEETJS); } catch (_) { /* cached on first online load */ }
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first: serve from cache, fall back to network and cache the result.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    }).catch(() => caches.match('./index.html'))
  );
});

// Page posts SKIP_WAITING when user taps "Check for Update" and a new SW is waiting.
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
