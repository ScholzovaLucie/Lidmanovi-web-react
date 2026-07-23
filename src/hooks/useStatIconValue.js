import { useEditorialEditor } from "../context/editorialEditorContext";

export function useStatIconValue(ns, i18nKey, fallback) {
  const { getInlineValue } = useEditorialEditor();
  const compositeKey = `${ns}.${i18nKey}`;
  return getInlineValue(compositeKey, fallback) || fallback;
}
