import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { Button, Stack } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useAuth } from "../hooks/useAuth";
import {
  useGetCmsPageByRouteLangQuery,
  useUpsertCmsPageMutation,
} from "../redux/api/cmsApi";

const EditorialEditorContext = createContext(null);

const ROUTE_NAMESPACES = {
  "/": ["home"],
  "/o-nas": ["home"],
  "/kontakt": ["kontakt"],
  "/restaurace": ["restaurace"],
  "/ubytovani": ["ubytovani"],
  "/svatby": ["svatby"],
  "/pobytove_balicky": ["balicky"],
  "/cenik": ["cenik"],
  "/galerie": ["galerie"],
  "/rezervace": ["rezervace"],
};

function getCmsRoute(pathname) {
  if (ROUTE_NAMESPACES[pathname]) return pathname;
  return "/";
}

function resolveNamespaces(pathname) {
  const cmsRoute = getCmsRoute(pathname);
  return ["global", ...(ROUTE_NAMESPACES[cmsRoute] || [])];
}

function isFlatOverrideMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.keys(value).some((key) => key.includes("."));
}

function flattenToDotMap(value, prefix = "", output = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const nextKey = prefix ? `${prefix}.${index}` : String(index);
      flattenToDotMap(item, nextKey, output);
    });
    return output;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, inner]) => {
      const nextKey = prefix ? `${prefix}.${key}` : key;
      flattenToDotMap(inner, nextKey, output);
    });
    return output;
  }

  if (!prefix) return output;
  output[prefix] = value;
  return output;
}

// Normalize backend payload into a stable structure:
// { "ns.key": { cs: "..", en: ".." } }
function normalizeTranslations(contentJson, contentI18n, route, lang, namespaces) {
  if ((!contentJson || typeof contentJson !== "object") && (!contentI18n || typeof contentI18n !== "object")) {
    return {};
  }
  const primaryNamespace = namespaces.find((ns) => ns !== "global") || namespaces[0] || "global";

  // Backend compatibility format:
  // { content_i18n: { cs: { "ns.key": "..." }, en: { "ns.key": "..." } } }
  if (contentI18n && typeof contentI18n === "object") {
    const merged = {};
    Object.entries(contentI18n).forEach(([langCode, langPayload]) => {
      if (!langPayload || typeof langPayload !== "object") return;
      const dotMap = isFlatOverrideMap(langPayload)
        ? langPayload
        : flattenToDotMap(langPayload);
      Object.entries(dotMap).forEach(([rawKey, value]) => {
        const firstSegment = String(rawKey).split(".")[0];
        const normalizedKey = namespaces.includes(firstSegment)
          ? rawKey
          : `${primaryNamespace}.${rawKey}`;
        if (!merged[normalizedKey]) merged[normalizedKey] = {};
        merged[normalizedKey][langCode] = value;
      });
    });
    if (Object.keys(merged).length) return merged;
  }

  // New target format: { translations: { "ns.key": { cs: ".." } } }
  const translationsNode = contentJson?.translations;
  if (translationsNode && typeof translationsNode === "object") {
    return translationsNode;
  }

  const toNamespacedMap = (candidate) => {
    if (!candidate || typeof candidate !== "object") return {};

    // Flat map: { "ns.key": "value" } or { "key": "value" }
    if (isFlatOverrideMap(candidate)) {
      const result = {};
      Object.entries(candidate).forEach(([key, value]) => {
        const firstSegment = String(key).split(".")[0];
        const normalizedKey = namespaces.includes(firstSegment)
          ? key
          : `${primaryNamespace}.${key}`;
        result[normalizedKey] = { [lang]: value };
      });
      return result;
    }

    // Nested by namespace: { home: { uvod: "..." } }
    const nestedByNamespace = {};
    namespaces.forEach((ns) => {
      if (candidate[ns] && typeof candidate[ns] === "object") {
        const flat = flattenToDotMap(candidate[ns]);
        Object.entries(flat).forEach(([k, v]) => {
          nestedByNamespace[`${ns}.${k}`] = { [lang]: v };
        });
      }
    });
    if (Object.keys(nestedByNamespace).length) return nestedByNamespace;

    // Generic nested object
    const flattened = flattenToDotMap(candidate);
    const withPrefix = {};
    Object.entries(flattened).forEach(([key, value]) => {
      withPrefix[`${primaryNamespace}.${key}`] = { [lang]: value };
    });
    return withPrefix;
  };

  // Legacy route/lang wrapper
  const legacy = contentJson?.overrides?.[route]?.[lang];
  if (legacy) return toNamespacedMap(legacy);

  // Last-resort compatibility
  return toNamespacedMap(contentJson);
}

function pickLanguageValue(langMap, language, fallbackLanguage = null) {
  if (!langMap || typeof langMap !== "object") return undefined;
  if (Object.prototype.hasOwnProperty.call(langMap, language)) {
    return langMap[language];
  }
  if (
    fallbackLanguage &&
    Object.prototype.hasOwnProperty.call(langMap, fallbackLanguage)
  ) {
    return langMap[fallbackLanguage];
  }
  return undefined;
}

export function EditorialEditorProvider({ children }) {
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [inlineDraft, setInlineDraft] = useState({});
  const [, setResourcesVersion] = useState(0);
  const lastAppliedSignatureRef = useRef("");

  const location = useLocation();
  const { i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuth();
  const [upsertCmsPage, { isLoading: isSaving }] = useUpsertCmsPageMutation();

  const currentLanguage = String(i18n.resolvedLanguage || i18n.language || "cs").split("-")[0];
  const currentRoute = getCmsRoute(location.pathname);
  const namespaces = useMemo(() => resolveNamespaces(location.pathname), [location.pathname]);

  const { data: cmsPage } = useGetCmsPageByRouteLangQuery({
    path: currentRoute,
    lang: currentLanguage,
  });
  const { data: globalCmsPage } = useGetCmsPageByRouteLangQuery(
    {
      path: "/",
      lang: currentLanguage,
    },
    {
      skip: currentRoute === "/",
    },
  );

  const routeTranslationMap = useMemo(
    () =>
      normalizeTranslations(
        cmsPage?.content_json,
        cmsPage?.content_i18n,
        currentRoute,
        currentLanguage,
        namespaces,
      ),
    [cmsPage, currentRoute, currentLanguage, namespaces],
  );
  const globalTranslationMap = useMemo(() => {
    if (currentRoute === "/") return {};

    const normalized = normalizeTranslations(
      globalCmsPage?.content_json,
      globalCmsPage?.content_i18n,
      "/",
      currentLanguage,
      ["global", "home"],
    );

    return Object.fromEntries(
      Object.entries(normalized).filter(([key]) => String(key).startsWith("global.")),
    );
  }, [globalCmsPage, currentLanguage, currentRoute]);
  const translationMap = useMemo(
    () => ({ ...globalTranslationMap, ...routeTranslationMap }),
    [globalTranslationMap, routeTranslationMap],
  );

  const entryTypeMap = useMemo(() => {
    const map = {};

    Object.entries(translationMap).forEach(([compositeKey, langMap]) => {
      const value = pickLanguageValue(langMap, currentLanguage);
      map[compositeKey] = Array.isArray(value);
    });

    Object.entries(inlineDraft).forEach(([compositeKey, value]) => {
      if (Array.isArray(value)) {
        map[compositeKey] = true;
      }
    });

    return map;
  }, [translationMap, currentLanguage, inlineDraft]);

  // Apply CMS values into i18n runtime for current language.
  React.useEffect(() => {
    const currentLangMap = {};
    Object.entries(translationMap).forEach(([compositeKey, langMap]) => {
      if (!langMap || typeof langMap !== "object") return;
      const value = pickLanguageValue(langMap, currentLanguage);
      if (value === undefined) return;
      currentLangMap[compositeKey] = value;
    });

    const signature = JSON.stringify(currentLangMap);
    if (signature === lastAppliedSignatureRef.current) return;

    let appliedAny = false;
    Object.entries(currentLangMap).forEach(([compositeKey, value]) => {
      const firstDot = compositeKey.indexOf(".");
      if (firstDot <= 0) return;
      const ns = compositeKey.slice(0, firstDot);
      const key = compositeKey.slice(firstDot + 1);
      i18n.addResource(currentLanguage, ns, key, value, true, true);
      appliedAny = true;
    });

    lastAppliedSignatureRef.current = signature;
    if (appliedAny) {
      setResourcesVersion((v) => v + 1);
    }
  }, [translationMap, i18n, currentLanguage]);

  React.useEffect(() => {
    setInlineDraft({});
    setIsInlineEditing(false);
  }, [currentRoute, currentLanguage]);

  const savePayload = async (draftForCurrentLang) => {
    const nextTranslations = { ...(routeTranslationMap || {}) };

    Object.entries(draftForCurrentLang).forEach(([compositeKey, value]) => {
      const existingLangMap = nextTranslations[compositeKey] || {};
      nextTranslations[compositeKey] = {
        ...existingLangMap,
        [currentLanguage]: value,
      };
    });

    await upsertCmsPage({
      path: currentRoute,
      lang: currentLanguage,
      content_json: {
        schema_version: 2,
        translations: nextTranslations,
      },
    }).unwrap();
  };

  const startInlineEditing = () => {
    setInlineDraft({});
    setIsInlineEditing(true);
  };

  const stopInlineEditing = () => {
    setIsInlineEditing(false);
    setInlineDraft({});
  };

  const setInlineValue = (compositeKey, value) => {
    setInlineDraft((prev) => ({ ...prev, [compositeKey]: value }));

    const firstDot = compositeKey.indexOf(".");
    if (firstDot <= 0) return;
    const ns = compositeKey.slice(0, firstDot);
    const key = compositeKey.slice(firstDot + 1);
    i18n.addResource(currentLanguage, ns, key, value, true, true);
  };

  const getInlineValue = (compositeKey, fallbackValue) => {
    if (Object.prototype.hasOwnProperty.call(inlineDraft, compositeKey)) {
      return inlineDraft[compositeKey];
    }

    const langMap = translationMap[compositeKey];
    if (langMap) {
      const value = pickLanguageValue(langMap, currentLanguage);
      if (value !== undefined) return value;
    }

    return fallbackValue;
  };
  const listContentKeys = (prefix = "") => {
    const keys = new Set([
      ...Object.keys(translationMap || {}),
      ...Object.keys(inlineDraft || {}),
    ]);
    if (!prefix) return Array.from(keys);
    return Array.from(keys).filter((key) => key.startsWith(prefix));
  };

  const saveInlineChanges = async () => {
    try {
      await savePayload(inlineDraft);
      enqueueSnackbar("Inline změny byly uloženy.", { variant: "success" });
      setIsInlineEditing(false);
      setInlineDraft({});
    } catch (error) {
      enqueueSnackbar("Inline uložení se nezdařilo.", { variant: "error" });
    }
  };

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      isInlineEditing,
      startInlineEditing,
      stopInlineEditing,
      getInlineValue,
      listContentKeys,
      setInlineValue,
      saveInlineChanges,
      isSaving,
      entryTypeMap,
    }),
    [isAuthenticated, isInlineEditing, isSaving, inlineDraft, translationMap, entryTypeMap],
  );

  return (
    <EditorialEditorContext.Provider value={contextValue}>
      {children}

      {isAuthenticated && (
        <Stack
          spacing={1}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: (theme) => theme.zIndex.tooltip + 1,
          }}
        >
          {!isInlineEditing ? (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<BorderColorIcon />}
              onClick={startInlineEditing}
              sx={{ textTransform: "none", bgcolor: "background.paper" }}
            >
              Inline editace
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={saveInlineChanges}
                disabled={isSaving}
                sx={{ textTransform: "none" }}
              >
                Uložit
              </Button>
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={stopInlineEditing}
                disabled={isSaving}
                sx={{ textTransform: "none", bgcolor: "background.paper" }}
              >
                Konec
              </Button>
            </Stack>
          )}
        </Stack>
      )}
    </EditorialEditorContext.Provider>
  );
}

export function useEditorialEditor() {
  const context = useContext(EditorialEditorContext);
  if (!context) {
    throw new Error("useEditorialEditor must be used within EditorialEditorProvider");
  }
  return context;
}
