import { Box, MenuItem, Select } from "@mui/material";
import { useEditorialEditor } from "../context/editorialEditorContext";
import { ICON_OPTIONS, NUMBER_MODE, resolveIcon } from "../utils/iconOptions";
import { useStatIconValue } from "../hooks/useStatIconValue";

export default function EditableIconPicker({ ns, i18nKey, fallback = "check", sx }) {
  const { isAuthenticated, isInlineEditing, setInlineValue } = useEditorialEditor();
  const compositeKey = `${ns}.${i18nKey}`;
  const value = useStatIconValue(ns, i18nKey, fallback);
  const ResolvedIcon = resolveIcon(value);

  if (!isAuthenticated || !isInlineEditing) {
    if (value === NUMBER_MODE) return null;
    return <ResolvedIcon sx={sx} />;
  }

  return (
    <Box
      data-inline-edit-field="true"
      onClick={(event) => event.stopPropagation()}
    >
      <Select
        value={value in ICON_OPTIONS ? value : "check"}
        onChange={(event) => setInlineValue(compositeKey, event.target.value)}
        size="small"
        sx={{ minWidth: 44, "& .MuiSelect-select": { py: 0.5, px: 1 } }}
      >
        {Object.entries(ICON_OPTIONS).map(([key, option]) => (
          <MenuItem key={key} value={key}>
            <option.Icon fontSize="small" sx={{ mr: 1 }} />
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
