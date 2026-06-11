const CACHE_NAME = "skazhi-i-zabud-v93";
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

function isCacheFirst(pathname) {
  return (
    pathname.includes("/fonts/") ||
    pathname.includes("/icons/")
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  const isDocument =
    request.mode === "navigate" || request.destination === "document";

  if (!isDocument && isCacheFirst(requestUrl.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(request).then((networkResponse) => {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return networkResponse;
        });
      }),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return networkResponse;
      })
      .catch(() => (
        caches.match(request).then((cachedResponse) => (
          cachedResponse || caches.match("./index.html")
        ))
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
