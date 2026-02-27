import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEditorialEditor } from "../context/EditorialEditorProvider";

function normalizeValue(value, fallback) {
  if (value !== undefined && value !== null) return value;
  return fallback;
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

  if (!isAuthenticated || !isInlineEditing) {
    if (Array.isArray(mergedValue)) {
      return (
        <>
          {mergedValue.map((line, idx) => (
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

  const fieldValue = Array.isArray(mergedValue)
    ? mergedValue.join("\n")
    : String(mergedValue ?? "");

  return (
    <Box sx={{ border: "1px dashed", borderColor: "secondary.main", borderRadius: 1, p: 1 }}>
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
