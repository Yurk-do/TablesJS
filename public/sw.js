const CACHE_NAME = 'scope-cache-v2';
const urlsToCache = [
    '/',
    'favicon.ico',
    'logo192.png',
    'logo512.png',
    'manifest.json',
    'index.html',
    'static/js/bundle.js',
    'static/js/main.58e014ad.js',
    'static/js/main.58e014ad.js.map',
    'static/css/main.07a8b673.css',
    'static/css/main.07a8b673.css.map',
    'static/media/close-arrows.6ae5e270b018476f8058aefe5e8261ba.svg',
    'static/media/open-arrows.14d26bc26fb6813090a22ceb7a2043de.svg',
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
          .filter((key) =>!cacheKeeplist.includes(key))
          .map((key) => caches.delete(key)
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
