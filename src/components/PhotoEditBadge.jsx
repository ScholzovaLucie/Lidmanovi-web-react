import { useState } from "react";
import { Chip, IconButton } from "@mui/material";
import { Edit, Collections } from "@mui/icons-material";
import { useEditorialEditor } from "../context/editorialEditorContext";
import { useGetPhotoPlacementsQuery } from "../redux/api/galleryApi";
import PhotoPickerDialog from "./PhotoPickerDialog";

const LOCATION_PAGE_SIZE = 100;

export default function PhotoEditBadge({
  location,
  singlePhoto = true,
  label,
  showLabel = false,
  requireInlineEditing = true,
  sx,
}) {
  const { isAuthenticated, isInlineEditing } = useEditorialEditor();
  const [open, setOpen] = useState(false);
  const showEditUi = requireInlineEditing
    ? isAuthenticated && isInlineEditing
    : isAuthenticated;

  const { data } = useGetPhotoPlacementsQuery(
    { location, page: 1, pageSize: LOCATION_PAGE_SIZE },
    { skip: !showEditUi },
  );
  const placements = data?.results || [];

  if (!showEditUi) return null;

  const tooltip =
    label || (singlePhoto ? `Změnit fotku (${location})` : `Spravovat fotky (${location})`);
  const icon = singlePhoto ? <Edit fontSize="small" /> : <Collections fontSize="small" />;
  const accentColor = singlePhoto ? "secondary" : "primary";
  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      {showLabel ? (
        <Chip
          data-inline-edit-allow-action="true"
          onClick={handleOpen}
          icon={icon}
          label={label || (singlePhoto ? "Úvodní foto" : "Fotky")}
          size="small"
          title={tooltip}
          sx={{
            position: "absolute",
            zIndex: 3,
            bgcolor: "rgba(255,255,255,0.92)",
            border: "1px solid",
            borderColor: `${accentColor}.main`,
            fontWeight: 600,
            cursor: "pointer",
            "& .MuiChip-icon": { color: `${accentColor}.main` },
            "&:hover": {
              bgcolor: `${accentColor}.main`,
              color: `${accentColor}.contrastText`,
              "& .MuiChip-icon": { color: `${accentColor}.contrastText` },
            },
            ...sx,
          }}
        />
      ) : (
        <IconButton
          data-inline-edit-allow-action="true"
          onClick={handleOpen}
          size="small"
          title={tooltip}
          sx={{
            position: "absolute",
            zIndex: 3,
            bgcolor: "rgba(255,255,255,0.9)",
            border: "1px solid",
            borderColor: `${accentColor}.main`,
            "&:hover": {
              bgcolor: `${accentColor}.main`,
              color: `${accentColor}.contrastText`,
            },
            ...sx,
          }}
        >
          {icon}
        </IconButton>
      )}
      <PhotoPickerDialog
        open={open}
        onClose={() => setOpen(false)}
        location={location}
        existingPlacements={placements}
        singlePhoto={singlePhoto}
      />
    </>
  );
}
