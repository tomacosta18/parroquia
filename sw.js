const APP_CACHE = "parroquias-app-v5";
const DATA_CACHE = "parroquias-data-v5";

const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

const DATA_URLS = [
  "./data/parroquias.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(APP_CACHE).then((cache) => cache.addAll(APP_SHELL)),
      caches.open(DATA_CACHE).then((cache) => cache.addAll(DATA_URLS))
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const validCaches = [APP_CACHE, DATA_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !validCaches.includes(key))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

function isDataRequest(request, url) {
  if (url.pathname.endsWith("/manifest.json")) return false;
  return (
    url.pathname.includes("/data/") ||
    url.pathname.endsWith(".json") ||
    request.headers.get("accept")?.includes("application/json")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Estrategia Network-first para los datos (data/parroquias.json)
  if (isDataRequest(request, url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Estrategia Cache-first para App Shell, Leaflet CDN y tipografías
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (
            response &&
            response.status === 200 &&
            (url.origin === self.location.origin ||
              url.hostname.includes("unpkg.com") ||
              url.hostname.includes("googleapis.com") ||
              url.hostname.includes("gstatic.com"))
          ) {
            const copy = response.clone();
            caches.open(APP_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          if (request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});
