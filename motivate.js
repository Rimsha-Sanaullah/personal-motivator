// Service Worker for notifications and offline support
const CACHE_NAME = 'motivation-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/icon-192x192.png',
  '/badge.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SEND_NOTIFICATION') {
    self.registration.showNotification('Your Daily Motivation', {
      body: event.data.quote,
      icon: 'icon-192x192.png',
      badge: 'badge.png',
      vibrate: [200, 100, 200],
      data: { url: event.data.options.url }
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow(event.notification.data.url);
      })
  );
});