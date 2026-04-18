// Custom i18next backend — loads translations from the CMS API.
// Each namespace maps to a CMS path; language is passed as ?lang= param.
// Responses are cached per (path, lang) to avoid duplicate fetches.

import { resolveCmsPathFromNamespace } from "./pageRoutes.js";

// Cache keyed by "route|lang" — deduplicated across namespaces sharing the same route.
const cache = new Map();

function buildUrl(baseUrl, route, lang) {
  const base = (baseUrl || "").replace(/\/$/, "");
  return `${base}/editorial_system/pages/?path=${encodeURIComponent(route)}&lang=${lang}`;
}

class CmsBackend {
  static type = "backend";

  init(_services, options) {
    this.baseUrl =
      options?.baseUrl ||
      import.meta.env.VITE_API_BASE_URL ||
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
      const url = buildUrl(this.baseUrl, route, language);
      cache.set(
        cacheKey,
        fetch(url)
          .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
          .then((data) => {
            const payload = Array.isArray(data)
              ? data[0]
              : Array.isArray(data?.results)
                ? data.results[0]
                : data;
            return payload?.content_json ?? {};
          })
          .catch(() => ({})),
      );
    }

    cache.get(cacheKey).then((translations) => callback(null, translations));
  }
}

CmsBackend._clearCache = () => cache.clear();
CmsBackend._clearRouteCache = (route, language) => {
  if (!route) return;

  if (language) {
    cache.delete(`${route}|${language}`);
    return;
  }

  Array.from(cache.keys()).forEach((key) => {
    if (key.startsWith(`${route}|`)) {
      cache.delete(key);
    }
  });
};

export default CmsBackend;
