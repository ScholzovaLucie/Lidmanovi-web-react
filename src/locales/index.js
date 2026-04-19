import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import CmsBackend from "./cmsBackend.js";
import { SUPPORTED_LANGUAGES } from "./pageRoutes.js";

function getInitialLanguage() {
  if (typeof window === "undefined") return "cs";
  const saved = window.localStorage.getItem("appLanguage");
  if (SUPPORTED_LANGUAGES.includes(saved)) return saved;

  const browserLanguage = String(window.navigator?.language || "cs").split("-")[0];
  return SUPPORTED_LANGUAGES.includes(browserLanguage) ? browserLanguage : "cs";
}

i18n
  .use(CmsBackend)
  .use(initReactI18next)
  .init({
    lng: getInitialLanguage(),
    fallbackLng: "cs",
    supportedLngs: SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: true,
    ns: [
      "global",
      "home",
      "kontakt",
      "restaurace",
      "galerie",
      "svatby",
      "ubytovani",
      "balicky",
      "cenik",
      "rezervace",
      "pokoje",
      "gdpr",
    ],
    defaultNS: "global",
    interpolation: { escapeValue: false },
    backend: {
      baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
    },
    react: {
      useSuspense: true,
    },
  });

i18n.on("languageChanged", (lng) => {
  const language = String(lng).split("-")[0];
  if (!SUPPORTED_LANGUAGES.includes(language)) return;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("appLanguage", language);
  }
  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
  }
});

if (typeof document !== "undefined") {
  document.documentElement.lang = String(i18n.resolvedLanguage || i18n.language || "cs").split("-")[0];
}

i18n.loadNamespaces(["global"]);

export default i18n;
