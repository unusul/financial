// Cassetto – service worker. Incrementa VERSIONE a ogni aggiornamento dell'app.
const VERSIONE = "financial-v70";
const BASE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
const ESTERNI = [
  "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSIONE).then(async c => {
    await c.addAll(BASE);
    for (const u of ESTERNI) { try { await c.add(u); } catch (_) {} }
  }).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(n => n !== VERSIONE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const proprio = url.origin === location.origin;
  const consentito = proprio || url.hostname === "cdnjs.cloudflare.com" ||
    url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!consentito) return; // niente cache per altri host (es. API Google in futuro)
  // Pagina e file propri: rete prima (così gli aggiornamenti arrivano), cache se offline.
  // Librerie e font: cache prima.
  if (proprio) {
    e.respondWith(fetch(e.request).then(r => {
      const copia = r.clone();
      caches.open(VERSIONE).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(n => {
      const copia = n.clone();
      caches.open(VERSIONE).then(c => c.put(e.request, copia));
      return n;
    })));
  }
});
