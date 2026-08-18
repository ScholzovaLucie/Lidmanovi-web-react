import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEditorialEditor } from "../context/editorialEditorContext";

// Tab vloží tabulátor místo přeskočení na další pole (ruční zarovnání, např.
// den / čas v otevírací době). Ctrl/Cmd+Shift+Mezerník vloží nezlomitelnou
// mezeru (běžná zkratka z Wordu/Google Docs), aby dvojice jako "10 km" nebo
// "Kč 500" nešly rozdělit na konec/začátek řádku.
function handleEditorKeyDown(event, onInsert) {
  const isTab = event.key === "Tab" && !event.shiftKey;
  const isNbsp = event.code === "Space" && event.shiftKey && (event.ctrlKey || event.metaKey);
  if (!isTab && !isNbsp) return;

  event.preventDefault();
  const el = event.target;
  const { selectionStart, selectionEnd, value } = el;
  const insertChar = isTab ? "\t" : " ";
  const nextValue = `${value.slice(0, selectionStart)}${insertChar}${value.slice(selectionEnd)}`;
  onInsert(nextValue);
  requestAnimationFrame(() => {
    el.selectionStart = el.selectionEnd = selectionStart + 1;
  });
}

function normalizeValue(value, fallback) {
  if (value !== undefined && value !== null) return value;
  return fallback;
}

function flattenObjectValue(value) {
  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenObjectValue(item));
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap((item) => flattenObjectValue(item));
  }

  if (value === undefined || value === null) return [];
  return [String(value)];
}

function isEmptyValue(value) {
  if (value === undefined || value === null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

export default function EditableTranslationText({
  ns,
  i18nKey,
  variant = "body1",
  sx,
  paragraph = false,
  multilineRows = 2,
  paragraphs = false,
  align = "inherit",
  fallback,
}) {
  const { t } = useTranslation(ns);
  const {
    isAuthenticated,
    isInlineEditing,
    getInlineValue,
    setInlineValue,
    entryTypeMap,
  } = useEditorialEditor();

  const translated = t(i18nKey, { returnObjects: true, defaultValue: fallback });
  const raw =
    fallback !== undefined && (isEmptyValue(translated) || translated === i18nKey)
      ? fallback
      : translated;
  const isArray = Array.isArray(raw) || !!entryTypeMap[`${ns}.${i18nKey}`];
  const compositeKey = `${ns}.${i18nKey}`;
  const mergedValue = normalizeValue(getInlineValue(compositeKey, raw), raw);
  const normalizedLines =
    Array.isArray(mergedValue) || (mergedValue && typeof mergedValue === "object")
      ? flattenObjectValue(mergedValue)
      : null;

  if (!isAuthenticated || !isInlineEditing) {
    if (normalizedLines) {
      return (
        <>
          {normalizedLines.map((line, idx) => (
            <Typography
              key={`${compositeKey}-${idx}`}
              variant={variant}
              sx={[{ whiteSpace: "pre-wrap", tabSize: 4 }, ...(Array.isArray(sx) ? sx : [sx])]}
              paragraph={paragraphs || paragraph}
              align={align}
            >
              {line}
            </Typography>
          ))}
        </>
      );
    }

    return (
      <Typography
        variant={variant}
        sx={[{ whiteSpace: "pre-wrap", tabSize: 4 }, ...(Array.isArray(sx) ? sx : [sx])]}
        paragraph={paragraph}
        align={align}
      >
        {mergedValue}
      </Typography>
    );
  }

  const fieldValue = normalizedLines
    ? normalizedLines.join("\n")
    : String(mergedValue ?? "");

  const updateValue = (nextRaw) => {
    if (isArray) {
      setInlineValue(compositeKey, nextRaw.split("\n"));
      return;
    }
    setInlineValue(compositeKey, nextRaw);
  };

  return (
    <Box
      data-inline-edit-field="true"
      onClick={(event) => event.stopPropagation()}
      sx={{ border: "1px dashed", borderColor: "secondary.main", borderRadius: 1, p: 1 }}
    >
      <TextField
        fullWidth
        multiline
        minRows={Math.max(multilineRows, isArray ? 3 : 2)}
        size="small"
        label={compositeKey}
        helperText="Tab = tabulátor, Ctrl/Cmd+Shift+mezerník = nezlomitelná mezera. Mezery a prázdné řádky se zachovají."
        value={fieldValue}
        onChange={(event) => updateValue(event.target.value)}
        onKeyDown={(event) => handleEditorKeyDown(event, updateValue)}
      />
    </Box>
  );
}
