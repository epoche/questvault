const CACHE_NAME = 'questvault-pwa-v3';
const MAX_HASHED_ASSET_ENTRIES = 160;
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './apple-touch-icon.png',
  './icon-192.png',
];

async function pruneAssetCache(cache) {
  try {
    const keys = await cache.keys();
    const assetKeys = keys.filter((req) => new URL(req.url).pathname.includes('/assets/'));
    if (assetKeys.length > MAX_HASHED_ASSET_ENTRIES) {
      const toEvict = assetKeys.slice(0, assetKeys.length - MAX_HASHED_ASSET_ENTRIES);
      await Promise.all(toEvict.map((req) => cache.delete(req)));
    }
  } catch {
    // Ignore cache pruning errors in restricted contexts
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('questvault-pwa-') && k !== CACHE_NAME)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim())
      .catch(() => undefined),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }

  // Only handle same-origin requests; never intercept cross-origin or sw.js itself
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/sw.js')) return;

  // Navigation requests: Network-first, keeping both req and './index.html' synchronized
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy1 = res.clone();
            const copy2 = res.clone();
            event.waitUntil(
              caches
                .open(CACHE_NAME)
                .then((c) => Promise.all([c.put(req, copy1), c.put('./index.html', copy2)]))
                .catch(() => undefined),
            );
          }
          return res;
        })
        .catch(() =>
          caches
            .match(req)
            .then((cached) => cached || caches.match('./index.html'))
            .then((fallback) => fallback || new Response('Offline', { status: 503 })),
        ),
    );
    return;
  }

  // Static same-origin assets: Stale-While-Revalidate with bounded hashed-asset pruning
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            const writePromise = caches
              .open(CACHE_NAME)
              .then(async (c) => {
                await c.put(req, copy);
                if (url.pathname.includes('/assets/')) {
                  await pruneAssetCache(c);
                }
              })
              .catch(() => undefined);
            event.waitUntil(writePromise);
          }
          return res;
        })
        .catch(() => cached || Response.error());

      if (cached) {
        event.waitUntil(fetchPromise.catch(() => undefined));
        return cached;
      }
      return fetchPromise;
    }),
  );
});
