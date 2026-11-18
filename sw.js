const CACHE_NAME = 'pwa-camara-v2';
const ARCHIVOS_PRECACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ARCHIVOS_PRECACHE);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((nombresCaches) => {
        return Promise.all(
          nombresCaches.map((nombre) => {
            if (nombre !== CACHE_NAME) {
              return caches.delete(nombre);
            }
            return Promise.resolve();
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Estrategia Cache First
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((respuestaCache) => {
        if (respuestaCache) {
          return respuestaCache;
        }
        return fetch(event.request);
      })
      .catch(() => {
        return caches.match('./index.html');
      })
  );
});