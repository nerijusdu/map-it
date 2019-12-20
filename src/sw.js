const RUNTIME = 'runtime';
const PRECACHE = 'static-files-v1';
const PRECACHE_URLS = [
  'index.html',
  'static/favicon-16x16.png',
  'static/favicon-32x32.png',
  'static/favicon.ico',
  'static/js/app.js',
  'static/js/vendor.js',
  'static/js/manifest.js',
  'static/css/app.css',
  // Development mode
  'app.js'
];

const apiUrl = self.location.host.startsWith('localhost')
  ? 'http://localhost:9091/api'
  : `${self.location.origin}/api`;

const cacheStaticFiles = (e) => {
  e.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
};

const removeOldCaches = (e) => {
  const currentCaches = [PRECACHE, RUNTIME];
  const cachePromise = caches.keys()
    .then(cacheNames => cacheNames.filter(cacheName => !currentCaches.includes(cacheName)))
    .then(cachesToDelete => Promise.all(cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete))))
    .then(() => self.clients.claim());

  e.waitUntil(cachePromise);
};

const onFetchHandler = (e) => {
  if (e.request.method.toLowerCase() !== 'get') {
    e.respondWith(fetch(e.request));
    return;
  }

  const isApiCall = e.request.url.startsWith(apiUrl);
  const cacheOptions = { ignoreSearch: !isApiCall };
  const fetchPromise = fetch(e.request)
    .then((res) => {
      if (isApiCall) {
        const resClone = res.clone();
        caches.open(RUNTIME).then((cache) => {
          cache.put(e.request, resClone);
        });
      }
      return res;
    })
    .catch(() => caches.match(e.request, cacheOptions).then((res) => {
      if (!isApiCall) {
        return res;
      }

      const anotherResponse = new Response(res.body, {
        status: res.status,
        statusText: 'CACHED',
        headers: res.headers
      });
      return anotherResponse;
    }));

  e.respondWith(fetchPromise);
};

self.addEventListener('install', cacheStaticFiles);
self.addEventListener('activate', removeOldCaches);
self.addEventListener('fetch', onFetchHandler);
