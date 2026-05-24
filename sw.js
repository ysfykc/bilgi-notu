self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('bn-pro').then((cache) => cache.addAll(['./', 'index.html', 'manifest.json']))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
