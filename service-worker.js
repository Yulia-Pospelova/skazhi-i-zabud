// Temporary design-preview service worker.
// It removes old PWA caches and unregisters itself so phones fetch fresh files.

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(clearPreviewCaches());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    clearPreviewCaches()
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window", includeUncontrolled: true }))
      .then((clients) => Promise.all(clients.map((client) => client.navigate(client.url)))),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});

function clearPreviewCaches() {
  if (!self.caches) {
    return Promise.resolve();
  }

  return caches.keys().then((cacheNames) => Promise.all(
    cacheNames
      .filter((cacheName) => cacheName.startsWith("skazhi-i-zabud"))
      .map((cacheName) => caches.delete(cacheName)),
  ));
}
