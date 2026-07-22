import { useState } from "react";
import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useEditorialEditor } from "../context/editorialEditorContext";
import { useGetPhotoPlacementsQuery } from "../redux/api/galleryApi";
import PhotoPickerDialog from "./PhotoPickerDialog";

const LOCATION_PAGE_SIZE = 100;

export default function PhotoEditBadge({ location, singlePhoto = true, sx }) {
  const { isAuthenticated, isInlineEditing } = useEditorialEditor();
  const [open, setOpen] = useState(false);
  const showEditUi = isAuthenticated && isInlineEditing;

  const { data } = useGetPhotoPlacementsQuery(
    { location, page: 1, pageSize: LOCATION_PAGE_SIZE },
    { skip: !showEditUi },
  );
  const placements = data?.results || [];

  if (!showEditUi) return null;

  return (
    <>
      <IconButton
        data-inline-edit-allow-action="true"
        onClick={() => setOpen(true)}
        size="small"
        title={singlePhoto ? `Změnit fotku (${location})` : `Spravovat fotky (${location})`}
        sx={{
          position: "absolute",
          zIndex: 3,
          bgcolor: "rgba(255,255,255,0.9)",
          border: "1px solid",
          borderColor: "secondary.main",
          "&:hover": { bgcolor: "secondary.main", color: "secondary.contrastText" },
          ...sx,
        }}
      >
        <Edit fontSize="small" />
      </IconButton>
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
