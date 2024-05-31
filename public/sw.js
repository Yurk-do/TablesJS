const CACHE_NAME = 'scope-cache-v1';
const urlsToCache = [
    '/',
    'favicon.ico',
    'logo192.png',
    'logo512.png',
    'manifest.json',
    'index.html',
    'static/js/bundle.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).then(() => {
        console.log("cached!")
        this.skipWaiting();
      });
    }),
  );
});

self.addEventListener('activate', event => {
  const cacheKeeplist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(
      (keyList) => Promise.all(
        keyList
          .filter(() => {})
          .map(
          (key) => {
            if (cacheKeeplist.indexOf(key) === -1) {
              return caches.delete(key);
            }
          }
        )
      ),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request);
  event.respondWith(
    caches.match(event.request.url).then((cachedResponse) => {
      console.log(cachedResponse);
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});
