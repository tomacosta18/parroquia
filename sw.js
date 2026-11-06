const APP_CACHE = "parroquias-app-v30";
const DATA_CACHE = "parroquias-data-v30";

const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/logo.png",
  "./audio/cara-a-cara.mp3",
  "./audio/haciendote-pan.mp3",
  "./audio/a-tanto-amor.mp3"
];

const DATA_URLS = [
  "./data/parroquias.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(APP_CACHE).then((cache) =>
        Promise.allSettled(
          APP_SHELL.map((url) =>
            fetch(new Request(url, { cache: "reload" })).then((res) => {
              if (res.ok) return cache.put(url, res);
            })
          )
        )
      ),
      caches.open(DATA_CACHE).then((cache) =>
        Promise.allSettled(DATA_URLS.map((u) => fetch(u, { cache: "reload" }).then((r) => r.ok && cache.put(u, r))))
      )
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

  // Audio: el reproductor pide rangos de bytes (Range). Safari exige 206 Partial Content;
  // devolver el 200 completo del caché deja la radio muda. Audio externo: directo a la red.
  const isAudio = request.destination === "audio" || /\.(mp3|m4a|aac|ogg|wav)$/i.test(url.pathname);
  if (isAudio) {
    if (url.origin !== self.location.origin) return; // CDN externo: sin intervención del SW
    event.respondWith(serveAudio(request));
    return;
  }

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

  // Estrategia Network-first (con respaldo offline) para index.html, style.css y app.js:
  // las recargas nunca ejecutan scripts viejos desde la caché.
  const isCoreAsset =
    url.origin === self.location.origin &&
    (request.mode === "navigate" ||
      url.pathname.endsWith("/") ||
      url.pathname.endsWith("/index.html") ||
      url.pathname.endsWith("/style.css") ||
      url.pathname.endsWith("/app.js"));

  if (isCoreAsset) {
    event.respondWith(
      fetch(request, { cache: "no-cache" })
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(APP_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("./index.html"))
        )
    );
    return;
  }

  // Estrategia Cache-first para Leaflet CDN, tipografías, íconos y demás recursos estáticos
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

// Sirve audio local desde caché respetando la cabecera Range (respuesta 206).
// Sin copia en caché: va a la red tal cual (el servidor ya maneja Range).
async function serveAudio(request) {
  const cached = await caches.match(request.url, { ignoreSearch: true });
  if (!cached) {
    try {
      return await fetch(request);
    } catch (err) {
      return new Response("", { status: 504, statusText: "Audio no disponible sin conexión" });
    }
  }

  const range = request.headers.get("range");
  if (!range) return cached;

  const buf = await cached.arrayBuffer();
  const size = buf.byteLength;
  const match = /bytes=(\d*)-(\d*)/.exec(range);
  let start = match && match[1] ? parseInt(match[1], 10) : 0;
  let end = match && match[2] ? parseInt(match[2], 10) : size - 1;
  if (match && !match[1] && match[2]) { // sufijo: "bytes=-500" = últimos 500 bytes
    start = Math.max(0, size - parseInt(match[2], 10));
    end = size - 1;
  }
  if (isNaN(start) || start >= size) {
    return new Response("", { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }
  end = Math.min(end, size - 1);

  return new Response(buf.slice(start, end + 1), {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type": cached.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes"
    }
  });
}
