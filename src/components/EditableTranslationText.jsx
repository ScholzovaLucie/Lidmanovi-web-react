import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEditorialEditor } from "../context/editorialEditorContext";

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

  if (value === undefined || value === null || value === "") return [];
  return [String(value)];
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
}) {
  const { t } = useTranslation(ns);
  const {
    isAuthenticated,
    isInlineEditing,
    getInlineValue,
    setInlineValue,
    entryTypeMap,
  } = useEditorialEditor();

  const raw = t(i18nKey, { returnObjects: true });
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
              sx={sx}
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
      <Typography variant={variant} sx={sx} paragraph={paragraph} align={align}>
        {mergedValue}
      </Typography>
    );
  }

  const fieldValue = normalizedLines
    ? normalizedLines.join("\n")
    : String(mergedValue ?? "");

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
        value={fieldValue}
        onChange={(event) => {
          const nextRaw = event.target.value;
          if (isArray) {
            setInlineValue(
              compositeKey,
              nextRaw
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            );
            return;
          }
          setInlineValue(compositeKey, nextRaw);
        }}
      />
    </Box>
  );
}
