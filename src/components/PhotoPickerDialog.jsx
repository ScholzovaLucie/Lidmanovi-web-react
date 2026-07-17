import { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Typography,
  Pagination,
  Stack,
} from "@mui/material";
import { Check, CloudUpload } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import {
  useGetPhotosQuery,
  useUploadPhotosMutation,
  useCreatePhotoPlacementMutation,
} from "../redux/api/galleryApi";

const LIBRARY_PAGE_SIZE = 24;

export default function PhotoPickerDialog({
  open,
  onClose,
  location,
  existingPhotoIds = [],
  currentCount = 0,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const fileInputRef = useRef(null);

  const { data, isLoading } = useGetPhotosQuery(
    { page, pageSize: LIBRARY_PAGE_SIZE },
    { skip: !open || tab !== 0 },
  );
  const photos = data?.results || [];
  const totalPages = Math.max(1, Math.ceil((data?.count || 0) / LIBRARY_PAGE_SIZE));

  const [uploadPhotos, { isLoading: isUploading }] = useUploadPhotosMutation();
  const [createPhotoPlacement, { isLoading: isPlacing }] =
    useCreatePhotoPlacementMutation();

  const isBusy = isUploading || isPlacing;

  const handleClose = () => {
    if (isBusy) return;
    setSelectedIds([]);
    setTab(0);
    onClose();
  };

  const toggleSelect = (photoId) => {
    if (existingPhotoIds.includes(photoId)) return;
    setSelectedIds((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId],
    );
  };

  const placePhotos = async (photoIds) => {
    let nextOrder = currentCount;
    for (const photoId of photoIds) {
      await createPhotoPlacement({
        photo: photoId,
        location,
        order: nextOrder++,
      }).unwrap();
    }
  };

  const handleAddSelected = async () => {
    if (!selectedIds.length) return;
    try {
      await placePhotos(selectedIds);
      enqueueSnackbar("Fotky byly přidány", {
        variant: "success",
        autoHideDuration: 3000,
      });
      handleClose();
    } catch (err) {
      console.error("Chyba při přidávání fotek:", err);
      enqueueSnackbar("Chyba při přidávání fotek", {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  };

  const handleFilesSelected = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    try {
      const result = await uploadPhotos({ category: location, files }).unwrap();
      const uploaded = Array.isArray(result) ? result : [result];
      await placePhotos(uploaded.map((photo) => photo.id));

      enqueueSnackbar("Fotky byly nahrány a přidány", {
        variant: "success",
        autoHideDuration: 3000,
      });
      handleClose();
    } catch (err) {
      console.error("Chyba při nahrávání fotek:", err);
      enqueueSnackbar("Chyba při nahrávání fotek", {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { "data-inline-edit-allow-action": "true" } }}
    >
      <DialogTitle>Přidat fotky</DialogTitle>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ px: 3 }}>
        <Tab label="Vybrat z knihovny" />
        <Tab label="Nahrát nové" />
      </Tabs>
      <DialogContent dividers>
        {tab === 0 ? (
          isLoading ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <>
              <Grid container spacing={1.5}>
                {photos.map((photo) => {
                  const alreadyPlaced = existingPhotoIds.includes(photo.id);
                  const isSelected = selectedIds.includes(photo.id);
                  return (
                    <Grid key={photo.id} size={{ xs: 4, sm: 3, md: 2 }}>
                      <Paper
                        variant="outlined"
                        onClick={() => toggleSelect(photo.id)}
                        sx={{
                          position: "relative",
                          aspectRatio: "1 / 1",
                          overflow: "hidden",
                          borderRadius: 1,
                          cursor: alreadyPlaced ? "not-allowed" : "pointer",
                          opacity: alreadyPlaced ? 0.4 : 1,
                          outline: isSelected ? "3px solid" : "none",
                          outlineColor: "primary.main",
                        }}
                      >
                        <Box
                          component="img"
                          src={photo.url}
                          alt=""
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        {isSelected && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              borderRadius: "50%",
                              width: 22,
                              height: 22,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Check fontSize="small" />
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
              {totalPages > 1 && (
                <Stack alignItems="center" pt={2}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    size="small"
                  />
                </Stack>
              )}
            </>
          )
        ) : (
          <Stack alignItems="center" justifyContent="center" spacing={2} py={6}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFilesSelected}
            />
            {isUploading ? (
              <CircularProgress size={32} />
            ) : (
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current?.click()}
              >
                Vybrat soubory k nahrání
              </Button>
            )}
            <Typography variant="body2" color="text.secondary">
              Podporované formáty: JPG, PNG, WebP
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isBusy}>
          Zrušit
        </Button>
        {tab === 0 && (
          <Button
            onClick={handleAddSelected}
            variant="contained"
            disabled={!selectedIds.length || isBusy}
          >
            Přidat vybrané ({selectedIds.length})
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
