const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function resolveMediaUrl(url) {
  if (!url) return url;
  if (/^https?:\/\//.test(url) || url.startsWith("data:")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
