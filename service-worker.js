const CACHE_NAME = "docket-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function putInCache(request, response) {
  if (response && response.status === 200 && response.type === "basic") {
    const clone = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
  }
}

// Navigation requests (index.html): always try the network first so updates
// reach the user immediately; fall back to the cached copy only when offline.
function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      putInCache(request, response);
      return response;
    })
    .catch(() =>
      caches.match(request).then((cached) => cached || caches.match("./index.html"))
    );
}

// Static assets (manifest, icons): serve from cache immediately, they rarely change.
function cacheFirst(request) {
  return caches.match(request).then((cached) => {
    if (cached) return cached;
    return fetch(request).then((response) => {
      putInCache(request, response);
      return response;
    });
  });
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const isNavigation =
    event.request.mode === "navigate" || event.request.destination === "document";
  event.respondWith(isNavigation ? networkFirst(event.request) : cacheFirst(event.request));
});
