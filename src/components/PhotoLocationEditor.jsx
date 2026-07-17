import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  IconButton,
  Select,
  MenuItem,
  Container,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useEditorialEditor } from "../context/editorialEditorContext";
import {
  useGetPhotoPlacementsQuery,
  useDeletePhotoPlacementMutation,
  useUpdatePhotoPlacementOrderMutation,
} from "../redux/api/galleryApi";
import PhotoPickerDialog from "./PhotoPickerDialog";

const LOCATION_PAGE_SIZE = 100;

export default function PhotoLocationEditor({ location, label }) {
  const { isAuthenticated, isInlineEditing } = useEditorialEditor();
  const { enqueueSnackbar } = useSnackbar();
  const [pickerOpen, setPickerOpen] = useState(false);

  const { data } = useGetPhotoPlacementsQuery(
    { location, page: 1, pageSize: LOCATION_PAGE_SIZE },
    { skip: !isAuthenticated || !isInlineEditing },
  );
  const [deletePhotoPlacement, { isLoading: isRemoving }] =
    useDeletePhotoPlacementMutation();
  const [updatePhotoPlacementOrder] = useUpdatePhotoPlacementOrderMutation();

  if (!isAuthenticated || !isInlineEditing) return null;

  const placements = data?.results || [];
  const sortedPlacements = [...placements].sort((a, b) => a.order - b.order);

  const handleRemove = async (placementId) => {
    try {
      await deletePhotoPlacement(placementId).unwrap();
      enqueueSnackbar("Fotka byla odebrána", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      console.error("Chyba při odebírání fotky:", err);
      enqueueSnackbar("Chyba při odebírání fotky", {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  };

  const handleMoveTo = async (placementId, newPosition) => {
    const oldIndex = sortedPlacements.findIndex((p) => p.id === placementId);
    const newIndex = newPosition - 1;
    if (oldIndex === -1 || oldIndex === newIndex) return;

    const reordered = [...sortedPlacements];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    try {
      await Promise.all(
        reordered
          .map((p, idx) => ({ id: p.id, order: idx, changed: p.order !== idx }))
          .filter(({ changed }) => changed)
          .map(({ id, order }) =>
            updatePhotoPlacementOrder({ id, order }).unwrap(),
          ),
      );
      enqueueSnackbar("Pořadí bylo změněno", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      console.error("Chyba při změně pořadí:", err);
      enqueueSnackbar("Chyba při změně pořadí", {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Paper
        variant="outlined"
        data-inline-edit-allow-action="true"
        sx={{
          p: 2,
          borderStyle: "dashed",
          borderColor: "secondary.main",
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Fotky: {label || location}
        </Typography>

        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          {sortedPlacements.map((placement, index) => (
            <Box
              key={placement.id}
              sx={{
                position: "relative",
                width: 100,
                height: 75,
                borderRadius: 1,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                component="img"
                src={placement.photo?.url}
                alt=""
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <IconButton
                onClick={() => handleRemove(placement.id)}
                disabled={isRemoving}
                size="small"
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  p: 0.25,
                  bgcolor: "rgba(255,255,255,0.85)",
                  "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                }}
              >
                <Delete fontSize="inherit" color="error" />
              </IconButton>
              <Select
                value={index + 1}
                onChange={(e) => handleMoveTo(placement.id, e.target.value)}
                size="small"
                sx={{
                  position: "absolute",
                  bottom: 2,
                  left: 2,
                  bgcolor: "rgba(255,255,255,0.85)",
                  "& .MuiSelect-select": { py: 0, px: 0.75, fontSize: "0.75rem" },
                }}
              >
                {sortedPlacements.map((_, pos) => (
                  <MenuItem key={pos} value={pos + 1}>
                    {pos + 1}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          ))}

          <Stack
            component={Paper}
            variant="outlined"
            onClick={() => setPickerOpen(true)}
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 100,
              height: 75,
              borderStyle: "dashed",
              cursor: "pointer",
              color: "text.secondary",
              "&:hover": { borderColor: "primary.main", color: "primary.main" },
            }}
          >
            <Add fontSize="small" />
            <Typography variant="caption">Přidat</Typography>
          </Stack>
        </Stack>
      </Paper>

      <PhotoPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        location={location}
        existingPhotoIds={sortedPlacements.map((p) => p.photo?.id)}
        currentCount={sortedPlacements.length}
      />
    </Container>
  );
}
