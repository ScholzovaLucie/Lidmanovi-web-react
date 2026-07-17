import React, { useMemo, useRef, useState } from "react";
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
  useUpsertCmsPageTranslationMutation,
} from "../redux/api/cmsApi";
import { EditorialEditorContext } from "./editorialEditorContext";
import CmsBackend from "../locales/cmsBackend";
import {
  resolveCmsPathFromNamespace,
  resolveCmsPathFromPath,
  resolveNamespacesFromPath,
} from "../locales/pageRoutes";

const INLINE_EDITING_STORAGE_KEY = "editorialInlineEditing";

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

function cloneTranslatableValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => cloneTranslatableValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, inner]) => [key, cloneTranslatableValue(inner)]),
    );
  }

  return value;
}

function setNestedValue(target, pathSegments, value) {
  let cursor = target;

  pathSegments.forEach((segment, index) => {
    const isLast = index === pathSegments.length - 1;
    const nextSegment = pathSegments[index + 1];
    const nextIsIndex = /^\d+$/.test(String(nextSegment));
    const currentIsIndex = /^\d+$/.test(String(segment));
    const key = currentIsIndex ? Number(segment) : segment;

    if (isLast) {
      cursor[key] = cloneTranslatableValue(value);
      return;
    }

    if (cursor[key] === undefined) {
      cursor[key] = nextIsIndex ? [] : {};
    }

    cursor = cursor[key];
  });
}

function buildContentJsonFromDraft(entries, namespace) {
  const content = {};

  Object.entries(entries).forEach(([compositeKey, value]) => {
    const prefix = `${namespace}.`;
    if (!String(compositeKey).startsWith(prefix)) return;
    const localKey = compositeKey.slice(prefix.length);
    if (!localKey) return;
    setNestedValue(content, localKey.split("."), value);
  });

  return content;
}

export function EditorialEditorProvider({ children }) {
  const [isInlineEditing, setIsInlineEditing] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(INLINE_EDITING_STORAGE_KEY) === "true";
  });
  const [inlineDraft, setInlineDraft] = useState({});
  const [, setResourcesVersion] = useState(0);
  const lastAppliedSignatureRef = useRef("");

  const location = useLocation();
  const { i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuth();
  const [upsertCmsPage, { isLoading: isSaving }] = useUpsertCmsPageMutation();
  const [upsertCmsPageTranslation, { isLoading: isSavingTranslation }] =
    useUpsertCmsPageTranslationMutation();

  const currentLanguage = String(i18n.resolvedLanguage || i18n.language || "cs").split("-")[0];
  const currentRoute = resolveCmsPathFromPath(location.pathname);
  const namespaces = useMemo(
    () => resolveNamespacesFromPath(location.pathname),
    [location.pathname],
  );

  const { data: cmsPage } = useGetCmsPageByRouteLangQuery({
    path: currentRoute,
    lang: currentLanguage,
  });
  const { data: globalCmsPage } = useGetCmsPageByRouteLangQuery(
    {
      path: "/global",
      lang: currentLanguage,
    },
    {
      skip: currentRoute === "/global",
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
    if (currentRoute === "/global") return {};

    const normalized = normalizeTranslations(
      globalCmsPage?.content_json,
      globalCmsPage?.content_i18n,
      "/global",
      currentLanguage,
      ["global"],
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
      i18n.addResource(
        currentLanguage,
        ns,
        key,
        cloneTranslatableValue(value),
        true,
        true,
      );
      appliedAny = true;
    });

    lastAppliedSignatureRef.current = signature;
    if (appliedAny) {
      setResourcesVersion((v) => v + 1);
    }
  }, [translationMap, i18n, currentLanguage]);

  React.useEffect(() => {
    setInlineDraft({});
  }, [currentRoute, currentLanguage]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (!isAuthenticated) {
      window.localStorage.removeItem(INLINE_EDITING_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      INLINE_EDITING_STORAGE_KEY,
      isInlineEditing ? "true" : "false",
    );
  }, [isAuthenticated, isInlineEditing]);

  const savePayload = async (draftForCurrentLang) => {
    const draftEntries = Object.entries(draftForCurrentLang);
    if (!draftEntries.length) return;

    const payloadsByPath = new Map();

    draftEntries.forEach(([compositeKey, value]) => {
      const namespace = String(compositeKey).split(".")[0];
      const cmsPath = resolveCmsPathFromNamespace(namespace) || currentRoute;
      const existingEntries = payloadsByPath.get(cmsPath) || {};
      payloadsByPath.set(cmsPath, {
        ...existingEntries,
        [compositeKey]: value,
      });
    });

    await Promise.all(
      Array.from(payloadsByPath.entries()).map(async ([cmsPath, pathDraft]) => {
        const pageData = cmsPath === "/global" ? globalCmsPage : cmsPage;
        const translationSource =
          cmsPath === "/global" ? globalTranslationMap : routeTranslationMap;
        const namespace =
          cmsPath === "/global"
            ? "global"
            : namespaces.find((item) => item !== "global") || "global";
        const mergedEntries = {};

        Object.entries(translationSource || {}).forEach(([compositeKey, langMap]) => {
          const value = pickLanguageValue(langMap, currentLanguage);
          if (value !== undefined) {
            mergedEntries[compositeKey] = value;
          }
        });

        Object.assign(mergedEntries, pathDraft);

        const content_json = buildContentJsonFromDraft(mergedEntries, namespace);

        if (
          pageData?.id &&
          currentLanguage !== String(pageData?.lang || "cs").split("-")[0]
        ) {
          await upsertCmsPageTranslation({
            pageId: pageData.id,
            lang: currentLanguage,
            content_json,
          }).unwrap();
        } else {
          await upsertCmsPage({
            path: cmsPath,
            lang: currentLanguage,
            content_json,
          }).unwrap();
        }

        CmsBackend._clearRouteCache?.(cmsPath, currentLanguage);
      }),
    );
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
    i18n.addResource(
      currentLanguage,
      ns,
      key,
      cloneTranslatableValue(value),
      true,
      true,
    );
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
      isSaving: isSaving || isSavingTranslation,
      entryTypeMap,
    }),
    [
      isAuthenticated,
      isInlineEditing,
      isSaving,
      isSavingTranslation,
      inlineDraft,
      translationMap,
      entryTypeMap,
    ],
  );

  return (
    <EditorialEditorContext.Provider value={contextValue}>
      {children}

      {isAuthenticated && (
        <Stack
          data-inline-editor-toolbar="true"
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
