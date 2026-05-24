const CACHE_NAME = 'bilgi-notu-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Uygulama kurulduğunda ve yeni sürüm geldiğinde beklemeden aktif ol
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Yeni sürüm aktifleştiğinde eski hafızayı (önbelleği) anında sil
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim(); 
});

// AĞ ÖNCELİKLİ (Network First) YAKLAŞIMI
// Önce internetten en güncel halini çekmeye çalışır. Başarılı olursa onu gösterir ve hafızaya yazar.
// İnternet çekmiyorsa (offline), mecburen hafızadaki son çalışan halini gösterir.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
