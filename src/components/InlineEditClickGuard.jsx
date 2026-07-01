import React from "react";
import Box from "@mui/material/Box";
import { useEditorialEditor } from "../context/editorialEditorContext";

const ACTION_SELECTOR = [
  "a[href]",
  "button",
  "[role='button']",
  "[data-inline-edit-block-action='true']",
].join(",");

const ALLOW_SELECTOR = [
  "[data-inline-editor-toolbar='true']",
  "[data-inline-edit-allow-action='true']",
  "[data-inline-edit-field='true']",
  "input",
  "textarea",
  "select",
  "[contenteditable='true']",
].join(",");

export default function InlineEditClickGuard({ children }) {
  const { isAuthenticated, isInlineEditing } = useEditorialEditor();

  const handleClickCapture = React.useCallback(
    (event) => {
      if (!isAuthenticated || !isInlineEditing) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(ALLOW_SELECTOR)) return;

      const action = target.closest(ACTION_SELECTOR);
      if (!action) return;

      event.preventDefault();
      event.stopPropagation();
    },
    [isAuthenticated, isInlineEditing],
  );

  return (
    <Box component="div" onClickCapture={handleClickCapture} sx={{ display: "contents" }}>
      {children}
    </Box>
  );
}
