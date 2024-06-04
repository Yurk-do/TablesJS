const CACHE_NAME = 'scope-cache-v2';

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
  'favicon.ico',
  'logo192.png',
  'logo512.png',
  'manifest.json',
  'index.html',
];

const urlsToCache = isLocalhost ? localUrls : productionUrls;

const filesUpdate = (cache) => {
  const stack = [];
  urlsToCache.forEach(file => stack.push(
    cache.add(file).catch(()=> console.error(`can't load ${file} to cache`))
  ));
  return Promise.all(stack);
};

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(filesUpdate).catch((err) => {console.log(err)})
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
  event.respondWith(
    caches.match(event.request.url).then((cachedResponse) => {
      if (cachedResponse && !navigator.onLine) {
        return cachedResponse;
      }

      const regex = '/static\/(js|css|media)\/main/';
      if (regex.test(event.request.url)) {
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.add(event.request.url)
              .catch(()=> console.error(`can't load ${event.request.url} to cache`))
          })
      }

      return fetch(event.request);
    }),
  );
});
