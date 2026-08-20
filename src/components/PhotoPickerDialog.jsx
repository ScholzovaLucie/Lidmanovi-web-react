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
  IconButton,
  Select,
  MenuItem,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Check, CloudUpload, Delete, Edit, Error as ErrorIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import {
  useGetPhotosQuery,
  useCreatePhotoPlacementMutation,
  useDeletePhotoPlacementMutation,
  useUpdatePhotoPlacementOrderMutation,
} from "../redux/api/galleryApi";
import { useBatchPhotoUpload } from "../hooks/useBatchPhotoUpload";
import { resolveMediaUrl } from "../utils/resolveMediaUrl";
import AltTextFields from "./AltTextFields";
import PhotoAltEditDialog from "./PhotoAltEditDialog";

const LIBRARY_PAGE_SIZE = 24;

export default function PhotoPickerDialog({
  open,
  onClose,
  location,
  existingPlacements = [],
  singlePhoto = false,
  onPhotoSelection,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pendingFiles, setPendingFiles] = useState(null);
  const [pendingAltTextI18n, setPendingAltTextI18n] = useState({});
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [uploadSummary, setUploadSummary] = useState(null);
  const fileInputRef = useRef(null);
  const isDeferredSelection = Boolean(onPhotoSelection);

  const existingPhotoIds = existingPlacements
    .map((p) => p.photo?.id)
    .filter(Boolean);
  const currentCount = existingPlacements.length;
  const sortedExisting = [...existingPlacements].sort((a, b) => a.order - b.order);

  const { data, isLoading } = useGetPhotosQuery(
    { page, pageSize: LIBRARY_PAGE_SIZE },
    { skip: !open || tab !== 0 },
  );
  const photos = data?.results || [];
  const totalPages = Math.max(1, Math.ceil((data?.count || 0) / LIBRARY_PAGE_SIZE));

  const { uploadInBatches, isUploading, progress } = useBatchPhotoUpload();
  const [createPhotoPlacement, { isLoading: isPlacing }] =
    useCreatePhotoPlacementMutation();
  const [deletePhotoPlacement, { isLoading: isRemoving }] =
    useDeletePhotoPlacementMutation();
  const [updatePhotoPlacementOrder] = useUpdatePhotoPlacementOrderMutation();

  const isBusy = isUploading || isPlacing || isRemoving;

  const handleRemoveExisting = async (placementId) => {
    try {
      await deletePhotoPlacement(placementId).unwrap();
    } catch (err) {
      console.error("Chyba při odebírání fotky:", err);
      enqueueSnackbar("Chyba při odebírání fotky", {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  };

  const handleMoveExisting = async (placementId, newPosition) => {
    const oldIndex = sortedExisting.findIndex((p) => p.id === placementId);
    const newIndex = newPosition - 1;
    if (oldIndex === -1 || oldIndex === newIndex) return;

    const reordered = [...sortedExisting];
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
    } catch (err) {
      console.error("Chyba při změně pořadí:", err);
      enqueueSnackbar("Chyba při změně pořadí", {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  };

  const handleClose = () => {
    if (isBusy) return;
    setSelectedIds([]);
    setTab(0);
    setPendingFiles(null);
    setPendingAltTextI18n({});
    setUploadSummary(null);
    onClose();
  };

  const toggleSelect = (photoId) => {
    if (singlePhoto) {
      setSelectedIds([photoId]);
      return;
    }
    if (existingPhotoIds.includes(photoId)) return;
    setSelectedIds((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId],
    );
  };

  const placePhotos = async (photoIds) => {
    if (singlePhoto) {
      await Promise.all(
        existingPlacements.map((p) => deletePhotoPlacement(p.id).unwrap()),
      );
    }
    let nextOrder = singlePhoto ? 0 : currentCount;
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
    if (isDeferredSelection) {
      const photo = photos.find((item) => item.id === selectedIds[0]);
      if (photo) {
        onPhotoSelection({ type: "existing", photo });
        handleClose();
      }
      return;
    }
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

  const handleFilesSelected = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    setPendingFiles(files);
    setPendingAltTextI18n({});
  };

  const handleCancelUpload = () => {
    setPendingFiles(null);
    setPendingAltTextI18n({});
    setUploadSummary(null);
  };

  const handleConfirmUpload = async () => {
    if (isDeferredSelection) {
      onPhotoSelection({
        type: "upload",
        file: pendingFiles[0],
        altTextI18n: pendingAltTextI18n,
      });
      handleClose();
      return;
    }

    const { uploaded, errors } = await uploadInBatches({
      category: location,
      files: pendingFiles,
      altTextI18n: pendingAltTextI18n,
    });

    if (uploaded.length > 0) {
      try {
        await placePhotos(uploaded.map((photo) => photo.id));
      } catch (err) {
        console.error("Chyba při přidávání nahraných fotek:", err);
        enqueueSnackbar("Fotky se nahrály, ale nepodařilo se je přiřadit", {
          variant: "error",
          autoHideDuration: 5000,
        });
        return;
      }
    }

    if (errors.length === 0) {
      enqueueSnackbar("Fotky byly nahrány a přidány", {
        variant: "success",
        autoHideDuration: 3000,
      });
      handleClose();
    } else {
      enqueueSnackbar(
        `Nahráno a přidáno ${uploaded.length} z ${pendingFiles.length} fotek, ${errors.length} dávek selhalo`,
        { variant: "warning", autoHideDuration: 6000 },
      );
      setUploadSummary({ uploaded, errors });
    }
  };

  return (
    <>
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { "data-inline-edit-allow-action": "true" } }}
    >
      <DialogTitle>{singlePhoto ? "Vybrat fotku" : "Spravovat fotky"}</DialogTitle>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ px: 3 }}>
        <Tab label="Vybrat z knihovny" />
        <Tab label="Nahrát nové" />
      </Tabs>
      <DialogContent dividers>
        {!singlePhoto && sortedExisting.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Aktuální fotky
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {sortedExisting.map((placement, index) => (
                <Box
                  key={placement.id}
                  sx={{
                    position: "relative",
                    width: 88,
                    height: 66,
                    borderRadius: 1,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    component="img"
                    src={resolveMediaUrl(placement.photo?.variants?.card || placement.photo?.url)}
                    alt={placement.photo?.alt_text || ""}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <IconButton
                    onClick={() => setEditingPhoto(placement.photo)}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 2,
                      left: 2,
                      p: 0.25,
                      bgcolor: "rgba(255,255,255,0.85)",
                      "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                    }}
                  >
                    <Edit fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleRemoveExisting(placement.id)}
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
                    onChange={(e) => handleMoveExisting(placement.id, e.target.value)}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      left: 2,
                      bgcolor: "rgba(255,255,255,0.85)",
                      "& .MuiSelect-select": { py: 0, px: 0.75, fontSize: "0.75rem" },
                    }}
                  >
                    {sortedExisting.map((_, pos) => (
                      <MenuItem key={pos} value={pos + 1}>
                        {pos + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              ))}
            </Stack>
            <Divider sx={{ mt: 2.5 }} />
          </Box>
        )}
        {tab === 0 ? (
          isLoading ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <>
              <Grid container spacing={1.5}>
                {photos.map((photo) => {
                  const alreadyPlaced =
                    !singlePhoto && existingPhotoIds.includes(photo.id);
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
                          src={resolveMediaUrl(photo.variants?.card || photo.url)}
                          alt={photo.alt_text || ""}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPhoto(photo);
                          }}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 4,
                            left: 4,
                            p: 0.25,
                            bgcolor: "rgba(255,255,255,0.85)",
                            "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                          }}
                        >
                          <Edit fontSize="inherit" />
                        </IconButton>
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
          <Stack alignItems="center" justifyContent="center" spacing={2} py={pendingFiles ? 2 : 6}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={!singlePhoto}
              hidden
              onChange={handleFilesSelected}
            />
            {pendingFiles ? (
              <Stack spacing={2} sx={{ width: "100%" }}>
                {uploadSummary ? (
                  <>
                    <Typography variant="body2">
                      Úspěšně nahráno a přidáno {uploadSummary.uploaded.length} z{" "}
                      {pendingFiles.length} fotek.
                    </Typography>
                    <List dense>
                      {uploadSummary.errors.map((err) => (
                        <ListItem key={err.batchIndex} disableGutters alignItems="flex-start">
                          <ErrorIcon fontSize="small" color="error" sx={{ mr: 1, mt: 0.5 }} />
                          <ListItemText
                            primary={`Dávka ${err.batchIndex + 1} (${err.fileCount} fotek) selhala`}
                            secondary={err.message}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Stack direction="row" justifyContent="flex-end">
                      <Button variant="contained" onClick={handleClose}>
                        Zavřít
                      </Button>
                    </Stack>
                  </>
                ) : isUploading ? (
                  <Stack spacing={2} alignItems="center" py={2}>
                    <Typography variant="body2">
                      {progress
                        ? `Nahrávám dávku ${progress.batch}/${progress.totalBatches} (celkem ${progress.uploadedSoFar}/${progress.totalFiles} fotek)…`
                        : "Připravuji nahrávání…"}
                    </Typography>
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress
                        variant={progress ? "determinate" : "indeterminate"}
                        value={
                          progress
                            ? ((progress.batch - 1) / progress.totalBatches) * 100
                            : undefined
                        }
                      />
                    </Box>
                  </Stack>
                ) : (
                  <>
                    <Typography variant="subtitle2">
                      {pendingFiles.length} {pendingFiles.length === 1 ? "soubor" : "souborů"} k nahrání
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Nepovinný alt text se použije pro všechny nahrávané fotky.
                      Pokud fotky potřebují různý alt text, uprav ho po nahrání u
                      jednotlivých fotek pomocí ikony tužky.
                    </Typography>
                    <AltTextFields value={pendingAltTextI18n} onChange={setPendingAltTextI18n} />
                    <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                      <Button onClick={handleCancelUpload}>Zrušit</Button>
                      <Button variant="contained" onClick={handleConfirmUpload}>
                        {isDeferredSelection ? "Použít pro pokoj" : "Nahrát"}
                      </Button>
                    </Stack>
                  </>
                )}
              </Stack>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Vybrat soubory k nahrání
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Podporované formáty: JPG, PNG, WebP
                </Typography>
              </>
            )}
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
            {singlePhoto
              ? "Použít vybranou fotku"
              : `Přidat vybrané (${selectedIds.length})`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
    <PhotoAltEditDialog
      open={!!editingPhoto}
      onClose={() => setEditingPhoto(null)}
      photo={editingPhoto}
    />
    </>
  );
}
