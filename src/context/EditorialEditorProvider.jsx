import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import {
  Button,
  Stack,
} from "@mui/material";
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

function flattenTranslations(obj, prefix = "") {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj).flatMap(([key, value]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      const hasOnlyText = value.every((item) => typeof item === "string");
      return hasOnlyText ? [{ key: nextKey, value, isArray: true }] : [];
    }
    if (value && typeof value === "object") {
      return flattenTranslations(value, nextKey);
    }
    if (["string", "number", "boolean"].includes(typeof value)) {
      return [{ key: nextKey, value, isArray: false }];
    }
    return [];
  });
}

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

function normalizeOverrides(contentJson, route, lang, namespaces) {
  if (!contentJson || typeof contentJson !== "object") return {};
  const primaryNamespace = namespaces.find((ns) => ns !== "global") || namespaces[0] || "global";

  const toNamespacedMap = (candidate) => {
    if (!candidate || typeof candidate !== "object") return {};

    if (isFlatOverrideMap(candidate)) {
      const result = {};
      Object.entries(candidate).forEach(([key, value]) => {
        const firstSegment = String(key).split(".")[0];
        if (namespaces.includes(firstSegment)) {
          result[key] = value;
        } else {
          result[`${primaryNamespace}.${key}`] = value;
        }
      });
      return result;
    }

    const nestedByNamespace = {};
    namespaces.forEach((ns) => {
      if (candidate[ns] && typeof candidate[ns] === "object") {
        flattenToDotMap(candidate[ns], ns, nestedByNamespace);
      }
    });
    if (Object.keys(nestedByNamespace).length) return nestedByNamespace;

    const flattened = flattenToDotMap(candidate);
    const withPrefix = {};
    Object.entries(flattened).forEach(([key, value]) => {
      withPrefix[`${primaryNamespace}.${key}`] = value;
    });
    return withPrefix;
  };

  const direct = toNamespacedMap(contentJson);
  if (Object.keys(direct).length) return direct;

  const legacy = toNamespacedMap(contentJson?.overrides?.[route]?.[lang]);
  if (Object.keys(legacy).length) return legacy;

  return {};
}

export function EditorialEditorProvider({ children }) {
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [inlineDraft, setInlineDraft] = useState({});
  const [, setResourcesVersion] = useState(0);
  const lastAppliedOverridesRef = useRef("");

  const location = useLocation();
  const { i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuth();
  const [upsertCmsPage, { isLoading: isSaving }] = useUpsertCmsPageMutation();
  const currentLanguage = String(i18n.resolvedLanguage || i18n.language || "cs").split("-")[0];
  const currentRoute = getCmsRoute(location.pathname);
  const namespaces = useMemo(
    () => resolveNamespaces(location.pathname),
    [location.pathname],
  );

  const {
    data: cmsPage,
  } = useGetCmsPageByRouteLangQuery({ path: currentRoute, lang: currentLanguage });

  const routeOverrides = useMemo(
    () =>
      normalizeOverrides(
        cmsPage?.content_json,
        currentRoute,
        currentLanguage,
        namespaces,
      ),
    [cmsPage, currentRoute, currentLanguage, namespaces],
  );

  const editableEntries = useMemo(() => {
    const entries = [];
    namespaces.forEach((ns) => {
      const baseBundle = i18n.getResourceBundle(currentLanguage, ns) || {};
      flattenTranslations(baseBundle).forEach((entry) => {
        const compositeKey = `${ns}.${entry.key}`;
        const overrideValue = routeOverrides[compositeKey];
        entries.push({
          ...entry,
          ns,
          compositeKey,
          value: overrideValue !== undefined ? overrideValue : entry.value,
        });
      });
    });
    return entries;
  }, [i18n, currentLanguage, namespaces, routeOverrides]);

  const entryTypeMap = useMemo(() => {
    const map = {};
    editableEntries.forEach((entry) => {
      map[entry.compositeKey] = entry.isArray;
    });
    return map;
  }, [editableEntries]);

  React.useEffect(() => {
    const signature = JSON.stringify(routeOverrides);
    if (signature === lastAppliedOverridesRef.current) return;

    let appliedAny = false;
    Object.entries(routeOverrides).forEach(([compositeKey, value]) => {
      const firstDot = compositeKey.indexOf(".");
      if (firstDot <= 0) return;
      const ns = compositeKey.slice(0, firstDot);
      const key = compositeKey.slice(firstDot + 1);
      i18n.addResource(currentLanguage, ns, key, value, true, true);
      appliedAny = true;
    });

    // `addResource` itself doesn't always trigger react-i18next rerender.
    // Force a lightweight refresh so public (unauth) users see CMS text immediately.
    if (appliedAny) {
      lastAppliedOverridesRef.current = signature;
      setResourcesVersion((v) => v + 1);
    } else {
      lastAppliedOverridesRef.current = signature;
    }
  }, [routeOverrides, i18n, currentLanguage]);

  React.useEffect(() => {
    setInlineDraft({});
    setIsInlineEditing(false);
  }, [currentRoute, currentLanguage]);

  const buildMergedDraft = () => {
    const merged = {};
    editableEntries.forEach((entry) => {
      merged[entry.compositeKey] = entry.value;
    });
    return merged;
  };

  const savePayload = async (payload) => {
    await upsertCmsPage({
      path: currentRoute,
      lang: currentLanguage,
      content_json: payload,
    }).unwrap();
  };

  const startInlineEditing = () => {
    setInlineDraft(buildMergedDraft());
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
    if (Object.prototype.hasOwnProperty.call(routeOverrides, compositeKey)) {
      return routeOverrides[compositeKey];
    }
    return fallbackValue;
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
      setInlineValue,
      saveInlineChanges,
      isSaving,
      entryTypeMap,
    }),
    [isAuthenticated, isInlineEditing, isSaving, inlineDraft, routeOverrides, entryTypeMap],
  );

  return (
    <EditorialEditorContext.Provider value={contextValue}>
      {children}

      {isAuthenticated && (
        <Stack
          spacing={1}
          sx={{ position: "fixed", bottom: 16, right: 16, zIndex: (theme) => theme.zIndex.tooltip + 1 }}
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
