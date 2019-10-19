importScripts("precache-manifest.db1cb9828e6df7b4c1fe391576ac1b61.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/* eslint-disable no-restricted-globals */
const cacheName = 'v2';
const cacheAssets = ['/', 'main.css', 'main.js'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

