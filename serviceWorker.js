const cacheName = 'food-locator';
const cacheVersion = `${cacheName}::1.0.0`;
const mapbox_token = 'pk.eyJ1IjoibGF6dG9wYXoiLCJhIjoiY2prbDJ5YmphMXF3NTNrb2c3MWVwd3J3cyJ9.A5kR6w5IyetjxUCi1huHdg';

const cachedFiles = [
  '/',
  '/img/',
  '/css/',
  '/js/',
  '/data/',
  '/restaurant.html',
  'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon-2x.png',
  //'//normalize-css.googlecode.com/svn/trunk/normalize.css',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  'manifest.json',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
  `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token=${mapbox_token}`
];

const networkFiles = [];

self.addEventListener('install', event => {

  console.log('[pwa install]');

  event.waitUntil(
    caches.open(cacheVersion)
    .then(cache => cache.addAll(cachedFiles))
  );

});

self.addEventListener('activate', event => {

  console.log('[pwa activate]');

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key.indexOf(cacheName) === 0 && key !== cacheVersion)
        .map(key => caches.delete(key))
      )
    )
  );

  return self.clients.claim();

});

self.addEventListener('fetch', event => {
  if (networkFiles.filter(item => event.request.url.match(item)).length) {
    console.log('[network fetch]', event.request.url);

    event.respondWith(
      caches.match(event.request)
      .then(response => response || fetch(event.request))
    );

  } else {
    console.log('[pwa fetch]', event.request.url);

    event.respondWith(
      caches.match(event.request)
      .then(response => {

        caches.open(cacheVersion).then(cache => cache.add(event.request.url));

        return response || fetch(event.request);

      })
    );

  }

});