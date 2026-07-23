export const SUPPORTED_LANGUAGES = ["cs", "en", "de", "pl"];

export const NAMESPACE_TO_CMS_PATH = {
  global: "/global",
  home: "/",
  kontakt: "/kontakt",
  restaurace: "/restaurace",
  galerie: "/galerie",
  sal: "/sal",
  svatby: "/svatby",
  oslavy: "/oslavy",
  ostatni: "/ostatni",
  ubytovani: "/ubytovani",
  balicky: "/balicky",
  rezervace: "/rezervace",
  cenik: "/cenik",
  gdpr: "/gdpr",
};

const FRONTEND_PATH_TO_CMS_CONFIG = {
  "/": { cmsPath: "/", namespaces: ["home"] },
  "/o-nas": { cmsPath: "/", namespaces: ["home"] },
  "/kontakt": { cmsPath: "/kontakt", namespaces: ["kontakt"] },
  "/restaurace": { cmsPath: "/restaurace", namespaces: ["restaurace"] },
  "/ubytovani": { cmsPath: "/ubytovani", namespaces: ["ubytovani"] },
  "/sal": { cmsPath: "/sal", namespaces: ["sal"] },
  "/svatby": { cmsPath: "/svatby", namespaces: ["svatby"] },
  "/oslavy": { cmsPath: "/oslavy", namespaces: ["oslavy"] },
  "/ostatni": { cmsPath: "/ostatni", namespaces: ["ostatni"] },
  "/balicky": { cmsPath: "/balicky", namespaces: ["balicky"] },
  "/pobytove_balicky": { cmsPath: "/balicky", namespaces: ["balicky"] },
  "/galerie": { cmsPath: "/galerie", namespaces: ["galerie"] },
  "/rezervace": { cmsPath: "/rezervace", namespaces: ["rezervace"] },
  "/cenik": { cmsPath: "/cenik", namespaces: ["cenik"] },
  "/gdpr": { cmsPath: "/gdpr", namespaces: ["gdpr"] },
};

export function resolveCmsPathFromNamespace(namespace) {
  return NAMESPACE_TO_CMS_PATH[namespace] || null;
}

export function resolveCmsConfigFromPath(pathname) {
  return FRONTEND_PATH_TO_CMS_CONFIG[pathname] || FRONTEND_PATH_TO_CMS_CONFIG["/"];
}

export function resolveCmsPathFromPath(pathname) {
  return resolveCmsConfigFromPath(pathname).cmsPath;
}

export function resolveNamespacesFromPath(pathname) {
  return ["global", ...resolveCmsConfigFromPath(pathname).namespaces];
}
