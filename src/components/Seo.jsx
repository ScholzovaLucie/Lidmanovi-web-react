import React from "react";
import { useLocation } from "react-router-dom";
import { SEO_DEFAULTS, SEO_ROUTES } from "../seo/siteSeo";

function upsertMeta(selector, attributes) {
  if (typeof document === "undefined") return;

  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, value);
    }
  });
}

function upsertLink(selector, attributes) {
  if (typeof document === "undefined") return;

  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, value);
    }
  });
}

function upsertJsonLd(id, payload) {
  if (typeof document === "undefined") return;

  const existing = document.getElementById(id);
  if (!payload) {
    existing?.remove();
    return;
  }

  const script = existing || document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(payload);

  if (!existing) {
    document.head.appendChild(script);
  }
}

function buildAbsoluteUrl(pathname) {
  if (typeof window === "undefined") return pathname;
  return new URL(pathname, window.location.origin).toString();
}

function buildCanonicalUrl(pathname) {
  if (typeof window === "undefined") return pathname;
  const basePath = import.meta.env.BASE_URL || "/";
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const trimmedPath = pathname === "/" ? "" : pathname.replace(/^\//, "");
  return new URL(`${normalizedBase}${trimmedPath}`, window.location.origin).toString();
}

export function Seo() {
  const location = useLocation();

  React.useEffect(() => {
    const routeSeo = SEO_ROUTES[location.pathname] || {};
    const title = routeSeo.title
      ? routeSeo.title === SEO_DEFAULTS.defaultTitle
        ? routeSeo.title
        : SEO_DEFAULTS.titleTemplate.replace("%s", routeSeo.title)
      : SEO_DEFAULTS.defaultTitle;
    const description = routeSeo.description || SEO_DEFAULTS.defaultDescription;
    const robots = routeSeo.robots || "index, follow";
    const canonicalUrl = buildCanonicalUrl(location.pathname);
    const imageUrl = buildAbsoluteUrl(routeSeo.image || SEO_DEFAULTS.defaultImage);
    const structuredData = routeSeo.structuredData
      ? {
          ...routeSeo.structuredData,
          url: buildCanonicalUrl(
            routeSeo.structuredData.url === "/" ? "/" : location.pathname,
          ),
          image: buildAbsoluteUrl(
            routeSeo.structuredData.image || SEO_DEFAULTS.defaultImage,
          ),
        }
      : null;

    document.title = title;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    upsertMeta('meta[name="keywords"]', {
      name: "keywords",
      content: routeSeo.keywords || "",
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: robots,
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SEO_DEFAULTS.siteName,
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: imageUrl,
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: imageUrl,
    });
    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: canonicalUrl,
    });

    upsertJsonLd("route-structured-data", structuredData);
  }, [location.pathname]);

  return null;
}
