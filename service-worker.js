const CACHE_NAME = "skazhi-i-zabud-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./script.js",
  "./manifest.webmanifest",
  "./fonts/fonts.css",
  "./styles/variables.css",
  "./styles/globals.css",
  "./styles/style.css",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => (
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      )
    )),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => (
      cachedResponse ||
      fetch(request).then((networkResponse) => {
        const responseClone = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });

        return networkResponse;
      }).catch(() => caches.match("./index.html"))
    )),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const currentClient = clients.find((client) => "focus" in client);

      if (currentClient) {
        return currentClient.focus();
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow("./");
      }

      return null;
    }),
  );
});
