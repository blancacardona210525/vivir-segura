const CACHE = "vivir-segura-v5-mobile-20260818";
const ASSETS = [
  "./",
  "./index.html",
  "./styles-v5.css",
  "./app-v5.js",
  "./manifest-v5.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./semujer-logo-header-v5.png",
  "./semujer-logo-footer-v5.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html")))
  );
});
