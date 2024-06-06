const CACHE_NAME = 'scope-cache-v23';

const isLocalhost = Boolean(
  self.location.hostname === 'localhost' ||
  self.location.hostname === '[::1]' ||
  self.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
  ),
);

const productionUrls = [
  'https://yurk-do.github.io/TablesJS/',
  'favicon.ico',
  'logo192.png',
  'logo512.png',
  'asset-manifest.json',
  'manifest.json',
  'index.html',
  // 'static/js/main.774e40eb.js',
  // 'static/css/main.07a8b673.css',
  // 'static/media/close-arrows.6ae5e270b018476f8058aefe5e8261ba.svg',
  // 'static/media/open-arrows.14d26bc26fb6813090a22ceb7a2043de.svg',
];

const localUrls = [
  '/',
  'index.html',
  'favicon.ico',
  'logo192.png',
  'logo512.png',
  'manifest.json',
];

const urlsToCache = isLocalhost ? localUrls : productionUrls;

const filesUpdate = (cache, urls) => {
  const stack = [];
  urls.forEach(file => stack.push(
    cache.add(file).catch(()=> console.error(`can't load ${file} to cache`))
  ));
  return Promise.all(stack);
};

self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => filesUpdate(cache, urlsToCache)).catch((err) => {console.log(err)})
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

self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    console.log('skip');
    self.skipWaiting();
  }
})



self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request.url).then((cachedResponse) => {
      if (cachedResponse && !navigator.onLine) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});
