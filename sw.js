const CACHE_NAME = 'focus-command-pwa-v2';
const APP_SHELL = [
  './task-focus-timer.html',
  './manifest.webmanifest',
  './pwa-icon-192.png',
  './pwa-icon-512.png',
  './apple-touch-icon.png',
  './focus-command-bg.png',
  './fruit-cats-1.png',
  './fruit-cats-2.png',
  './fruit-cats-3.png',
  './fruit-cats-4.png',
  './fruit-cats-5.png',
  './inventory-items.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if (response && response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached || caches.match('./task-focus-timer.html'));
      return cached || network;
    })
  );
});
