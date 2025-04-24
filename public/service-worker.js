// Een eenvoudige service worker die cache gebruikt maar altijd vernieuwt bij expliciete vernieuwing
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('portfolio-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== 'portfolio-v1';
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// Zorg ervoor dat refreshes altijd direct naar de server gaan
self.addEventListener('fetch', (event) => {
  // Als het een navigatieverzoek is (paginavernieuwing)
  if (event.request.mode === 'navigate') {
    // Haal altijd vers van de server bij een expliciete refresh
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
  } else {
    // Voor andere assets, probeer eerst de cache en daarna het netwerk
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
}); 