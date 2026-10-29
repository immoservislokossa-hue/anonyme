// Service worker : au premier passage, il télécharge toutes les pages et le code de l'application.
// Ensuite tout marche sans connexion (pages, outils, Afi sur l'appareil). Les appels à /api ne sont jamais mis en cache.
const CACHE = "shell-v2";
const NETWORK_WAIT_MS = 4000;

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(precache());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

async function precache() {
  const cache = await caches.open(CACHE);
  let pages = ["/"];
  try {
    const manifest = await (await fetch("/offline-manifest.json")).json();
    if (Array.isArray(manifest.pages)) pages = manifest.pages;
  } catch {
    // Sans liste, on garde au moins l'accueil.
  }

  const assets = new Set();
  const grab = (text) => {
    for (const match of text.matchAll(/\/_next\/static\/[^"'\\\s)]+/g)) assets.add(match[0]);
  };

  await Promise.allSettled(
    pages.map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) return;
      grab(await response.clone().text());
      await cache.put(path, response);
    }),
  );

  // Code, styles et polices. Les styles peuvent appeler des polices : on les lit aussi.
  await Promise.allSettled(
    [...assets].map(async (path) => {
      const response = await fetch(path);
      if (!response.ok) return;
      if (path.endsWith(".css")) grab(await response.clone().text());
      await cache.put(path, response);
    }),
  );
  await Promise.allSettled(
    [...assets].filter((path) => path.includes("/media/")).map(async (path) => {
      if (await cache.match(path)) return;
      const response = await fetch(path);
      if (response.ok) await cache.put(path, response);
    }),
  );
  await cache.put("/icon.svg", await fetch("/icon.svg")).catch(() => {});

  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  clients.forEach((client) => client.postMessage({ type: "offline-ready", pages: pages.length }));
}

// Pages : on cherche par adresse sans paramètres (?utm=…), pour retrouver la copie.
const fromCache = (request) => {
  const url = new URL(typeof request === "string" ? request : request.url, self.location.origin);
  return caches.match(url.origin + url.pathname, { ignoreVary: true }).then((cached) => cached ?? undefined);
};

// Réseau d'abord (contenu à jour), mais si le réseau est trop lent ou absent, on prend la copie de l'appareil.
function networkFirst(request) {
  return new Promise((resolve) => {
    let settled = false;
    const useCache = async () => {
      const cached = await fromCache(request);
      if (cached) return cached;
      return request.mode === "navigate" ? ((await fromCache("/")) ?? Response.error()) : Response.error();
    };
    const timer = setTimeout(async () => {
      const cached = await fromCache(request);
      if (cached && !settled) {
        settled = true;
        resolve(cached);
      }
    }, NETWORK_WAIT_MS);

    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        if (!settled) {
          settled = true;
          resolve(response);
        }
      })
      .catch(async () => {
        clearTimeout(timer);
        if (!settled) {
          settled = true;
          resolve(await useCache());
        }
      });
  });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api")) {
    return;
  }

  // Les échanges internes de Next (changement de page) ne sont pas gardés : hors connexion, Next recharge la page, qui vient de l'appareil.
  if (url.searchParams.has("_rsc") || request.headers.has("RSC")) return;

  // Le code versionné ne change jamais : la copie de l'appareil passe en premier.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          }),
      ),
    );
    return;
  }

  event.respondWith(networkFirst(request));
});
