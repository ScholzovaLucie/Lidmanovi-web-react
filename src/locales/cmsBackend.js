// Custom i18next backend — loads translations from the CMS API.
// Each namespace maps to a CMS path; language is passed as ?lang= param.
//
// Two cache layers:
// - in-memory Map: dedupes concurrent fetches within the current session
// - localStorage: persists across page reloads/visits so text renders
//   instantly instead of blocking on a network round-trip (react-i18next
//   Suspense waits for this read to resolve). A stale persisted entry is
//   served immediately and silently revalidated in the background.
// Both layers are invalidated explicitly via _clearRouteCache/_clearCache
// when an editor saves content through the inline editor.

import { resolveCmsPathFromNamespace } from "./pageRoutes.js";

const STORAGE_PREFIX = "i18nCms:";
const STORAGE_TTL_MS = 24 * 60 * 60 * 1000; // pojistka, kdyby invalidace něco minula

const cache = new Map();

function buildUrl(baseUrl, route, lang) {
  const base = (baseUrl || "").replace(/\/$/, "");
  return `${base}/editorial_system/pages/?path=${encodeURIComponent(route)}&lang=${lang}`;
}

function fetchTranslations(baseUrl, route, language) {
  const url = buildUrl(baseUrl, route, language);
  return fetch(url)
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((data) => {
      const payload = Array.isArray(data)
        ? data[0]
        : Array.isArray(data?.results)
          ? data.results[0]
          : data;
      return payload?.content_json ?? {};
    });
}

function readPersisted(cacheKey) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + cacheKey);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!entry || Date.now() - entry.ts > STORAGE_TTL_MS) return null;
    return entry.translations;
  } catch {
    return null;
  }
}

function writePersisted(cacheKey, translations) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_PREFIX + cacheKey,
      JSON.stringify({ translations, ts: Date.now() }),
    );
  } catch {
    // localStorage plný/nedostupný - v paměti cache pořád funguje
  }
}

function clearPersisted(predicate) {
  if (typeof window === "undefined") return;
  try {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX) && predicate(key.slice(STORAGE_PREFIX.length)))
      .forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // ignore
  }
}

class CmsBackend {
  static type = "backend";

  init(_services, options) {
    this.baseUrl =
      options?.baseUrl ||
      import.meta.env.VITE_API_URL ||
      "http://localhost:8000";
  }

  read(language, namespace, callback) {
    const route = resolveCmsPathFromNamespace(namespace);
    if (!route) {
      callback(null, {});
      return;
    }

    const cacheKey = `${route}|${language}`;

    if (!cache.has(cacheKey)) {
      const persisted = readPersisted(cacheKey);

      if (persisted) {
        cache.set(cacheKey, Promise.resolve(persisted));
        // Tiše obnovit na pozadí, aby další načtení mělo čerstvá data.
        fetchTranslations(this.baseUrl, route, language)
          .then((translations) => {
            writePersisted(cacheKey, translations);
            cache.set(cacheKey, Promise.resolve(translations));
          })
          .catch(() => {});
      } else {
        cache.set(
          cacheKey,
          fetchTranslations(this.baseUrl, route, language)
            .then((translations) => {
              writePersisted(cacheKey, translations);
              return translations;
            })
            .catch(() => ({})),
        );
      }
    }

    cache.get(cacheKey).then((translations) => callback(null, translations));
  }
}

CmsBackend._clearCache = () => {
  cache.clear();
  clearPersisted(() => true);
};

CmsBackend._clearRouteCache = (route, language) => {
  if (!route) return;

  if (language) {
    cache.delete(`${route}|${language}`);
    clearPersisted((key) => key === `${route}|${language}`);
    return;
  }

  Array.from(cache.keys()).forEach((key) => {
    if (key.startsWith(`${route}|`)) {
      cache.delete(key);
    }
  });
  clearPersisted((key) => key.startsWith(`${route}|`));
};

export default CmsBackend;
