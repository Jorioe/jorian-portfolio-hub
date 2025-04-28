const CACHE_NAME = 'portfolio-v2'; // Verhoog de versie als je wijzigingen hebt

// Bij de installatie van de service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/', 
        '/index.html',
        // Voeg hier andere essentiële bestanden toe
      ]);
    })
  );
  self.skipWaiting();
});

// Bij de activatie van de service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          // Verwijder oude caches die niet meer in gebruik zijn
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Zorg ervoor dat we altijd naar de server gaan voor nieuwe content
self.addEventListener('fetch', (event) => {
  // Voor navigatieverzoeken (pagina herladen)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((response) => {
        // Update de cache met de nieuwe versie van de pagina
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(() => {
        // Als er geen netwerk is, geef dan de cache versie terug
        return caches.match('/index.html');
      })
    );
  } else {
    // Voor andere assets (zoals afbeeldingen, CSS, JS)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Als de resource in de cache staat, gebruik die dan, anders haal van de server
        return cachedResponse || fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone()); // Cache het bestand voor de volgende keer
            return response;
          });
        });
      })
    );
  }
});


// // Een eenvoudige service worker die cache gebruikt maar altijd vernieuwt bij expliciete vernieuwing
// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open('portfolio-v1').then((cache) => {
//       return cache.addAll([
//         '/',
//         '/index.html'
//       ]);
//     })
//   );
//   self.skipWaiting();
// });

// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.filter((cacheName) => {
//           return cacheName !== 'portfolio-v1';
//         }).map((cacheName) => {
//           return caches.delete(cacheName);
//         })
//       );
//     })
//   );
//   self.clients.claim();
// });

// // Zorg ervoor dat refreshes altijd direct naar de server gaan
// self.addEventListener('fetch', (event) => {
//   // Als het een navigatieverzoek is (paginavernieuwing)
//   if (event.request.mode === 'navigate') {
//     // Haal altijd vers van de server bij een expliciete refresh
//     event.respondWith(
//       fetch(event.request).catch(() => {
//         return caches.match('/index.html');
//       })
//     );
//   } else {
//     // Voor andere assets, probeer eerst de cache en daarna het netwerk
//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         return response || fetch(event.request);
//       })
//     );
//   }
// }); 