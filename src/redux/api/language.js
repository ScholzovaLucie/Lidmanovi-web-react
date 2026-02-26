import i18n from "../../locales";

export function getRequestLanguage() {
  return String(i18n.resolvedLanguage || i18n.language || "cs").split("-")[0];
}

export function withLanguageHeader(headers) {
  headers.set("Accept-Language", getRequestLanguage());
  return headers;
}
