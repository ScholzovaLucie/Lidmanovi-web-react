import { useRef, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Grid,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Add, Delete, DeleteSweep, Edit, Error as ErrorIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import {
  useGetPhotosQuery,
  useLazyGetPhotosQuery,
  useDeletePhotoMutation,
} from "../../../../redux/api/galleryApi";
import { useBatchPhotoUpload } from "../../../../hooks/useBatchPhotoUpload";
import { resolveMediaUrl } from "../../../../utils/resolveMediaUrl";
import AltTextFields from "../../../../components/AltTextFields";
import PhotoAltEditDialog from "../../../../components/PhotoAltEditDialog";

const PAGE_SIZE = 24;
const DEFAULT_CATEGORY = "galerie";

export default function GallerySection() {
  const fileInputRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);
  const [confirmDeleteAllOpen, setConfirmDeleteAllOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [pendingFiles, setPendingFiles] = useState(null);
  const [pendingAltTextI18n, setPendingAltTextI18n] = useState({});
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [uploadSummary, setUploadSummary] = useState(null);

  const { data, isLoading, error } = useGetPhotosQuery({ page, pageSize: PAGE_SIZE });

  const photos = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const { uploadInBatches, isUploading, progress } = useBatchPhotoUpload();
  const [deletePhoto, { isLoading: isRemoving }] = useDeletePhotoMutation();
  const [fetchAllPhotos] = useLazyGetPhotosQuery();

  const handleAddClick = () => {
    if (!isUploading) fileInputRef.current?.click();
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
    const { uploaded, errors } = await uploadInBatches({
      category: DEFAULT_CATEGORY,
      files: pendingFiles,
      altTextI18n: pendingAltTextI18n,
    });

    if (errors.length === 0) {
      enqueueSnackbar(`Nahráno ${uploaded.length} fotek`, {
        variant: "success",
        autoHideDuration: 3000,
      });
      setPendingFiles(null);
      setPendingAltTextI18n({});
    } else {
      enqueueSnackbar(
        `Nahráno ${uploaded.length} z ${pendingFiles.length} fotek, ${errors.length} dávek selhalo`,
        { variant: "warning", autoHideDuration: 6000 },
      );
      setUploadSummary({ uploaded, errors });
    }
  };

  const handleDelete = async (photoId) => {
    try {
      await deletePhoto(photoId).unwrap();
      enqueueSnackbar("Fotka byla smazána", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      console.error("Chyba při mazání fotky:", err);
      enqueueSnackbar("Chyba při mazání fotky", {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  };

  const handleDeleteAll = async () => {
    setConfirmDeleteAllOpen(false);
    setIsDeletingAll(true);
    try {
      const all = await fetchAllPhotos({
        page: 1,
        pageSize: totalCount || PAGE_SIZE,
      }).unwrap();
      const ids = (all?.results || []).map((photo) => photo.id);
      for (const id of ids) {
        await deletePhoto(id).unwrap();
      }
      setPage(1);
      enqueueSnackbar("Všechny fotky byly smazány", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      console.error("Chyba při mazání všech fotek:", err);
      enqueueSnackbar("Chyba při mazání všech fotek", {
        variant: "error",
        autoHideDuration: 5000,
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <Stack p={{ md: 3 }} spacing={2}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
        <Stack>
          <Typography variant="h4" gutterBottom>
            Fotky
          </Typography>
          <Typography variant="body1">
            Zde je knihovna všech nahraných fotek. Přiřazení fotky na konkrétní
            místo webu (úvodní slideshow, galerie, úvodní fotky stránek) se dělá
            přímo na dané stránce pomocí "Inline editace".
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ke každé fotce prosím doplň popis (alt text) přes ikonu tužky na
            dlaždici fotky – zlepšuje to přístupnost webu pro nevidomé a
            pomáhá to i vyhledávačům (SEO).
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          color="error"
          startIcon={
            isDeletingAll ? <CircularProgress size={16} color="inherit" /> : <DeleteSweep />
          }
          disabled={isDeletingAll || isLoading || totalCount === 0}
          onClick={() => setConfirmDeleteAllOpen(true)}
          sx={{ whiteSpace: "nowrap" }}
        >
          Smazat vše
        </Button>
      </Stack>

      <Dialog open={confirmDeleteAllOpen} onClose={() => setConfirmDeleteAllOpen(false)}>
        <DialogTitle>Smazat všechny fotky?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Smažou se všechny fotky v knihovně ({totalCount}) a zároveň zmizí ze
            všech míst na webu, kde jsou aktuálně použité (úvodní slideshow,
            dlaždice, galerie stránek). Tuto akci nelze vrátit zpět.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteAllOpen(false)}>Zrušit</Button>
          <Button onClick={handleDeleteAll} color="error" variant="contained">
            Smazat vše
          </Button>
        </DialogActions>
      </Dialog>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFilesSelected}
      />

      <Dialog open={!!pendingFiles} onClose={isUploading ? undefined : handleCancelUpload} maxWidth="sm" fullWidth>
        <DialogTitle>Nahrát {pendingFiles?.length || 0} fotek</DialogTitle>
        <DialogContent>
          {uploadSummary ? (
            <Stack spacing={2}>
              <Typography variant="body2">
                Úspěšně nahráno {uploadSummary.uploaded.length} z{" "}
                {pendingFiles?.length || 0} fotek.
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
            </Stack>
          ) : isUploading ? (
            <Stack spacing={2} alignItems="center" py={3}>
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
              <DialogContentText sx={{ mb: 2 }}>
                Nepovinný alt text se použije pro všechny nahrávané fotky v této
                dávce. Pokud fotky potřebují různý alt text, uprav ho po nahrání u
                jednotlivých fotek pomocí ikony tužky.
              </DialogContentText>
              <AltTextFields value={pendingAltTextI18n} onChange={setPendingAltTextI18n} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          {uploadSummary ? (
            <Button onClick={handleCancelUpload} variant="contained">
              Zavřít
            </Button>
          ) : (
            <>
              <Button onClick={handleCancelUpload} disabled={isUploading}>
                Zrušit
              </Button>
              <Button
                onClick={handleConfirmUpload}
                variant="contained"
                disabled={isUploading}
                startIcon={isUploading ? <CircularProgress size={16} color="inherit" /> : null}
              >
                Nahrát
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <PhotoAltEditDialog
        open={!!editingPhoto}
        onClose={() => setEditingPhoto(null)}
        photo={editingPhoto}
      />

      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography>Načítání fotek...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", py: 8, color: "error.main" }}>
          <Typography>Chyba při načítání fotek</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <Stack
                component={Paper}
                variant="outlined"
                alignItems="center"
                justifyContent="center"
                spacing={1}
                sx={{
                  aspectRatio: "4 / 3",
                  borderStyle: "dashed",
                  borderRadius: 1,
                  p: 1.5,
                }}
              >
                {isUploading ? (
                  <CircularProgress size={28} />
                ) : (
                  <Stack
                    alignItems="center"
                    onClick={handleAddClick}
                    sx={{
                      cursor: "pointer",
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    <Add sx={{ fontSize: 32 }} />
                    <Typography variant="body2">Nahrát fotky</Typography>
                  </Stack>
                )}
              </Stack>
            </Grid>

            {photos.map((photo) => (
              <Grid key={photo.id} size={{ xs: 6, sm: 4, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    position: "relative",
                    aspectRatio: "4 / 3",
                    overflow: "hidden",
                    borderRadius: 1,
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
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      left: 4,
                      px: 0.75,
                      borderRadius: 0.5,
                      bgcolor: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {photo.category}
                  </Typography>
                  <IconButton
                    onClick={() => setEditingPhoto(photo)}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      left: 4,
                      bgcolor: "rgba(255,255,255,0.85)",
                      "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(photo.id)}
                    disabled={isRemoving || isDeletingAll}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "rgba(255,255,255,0.85)",
                      "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                    }}
                  >
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Stack alignItems="center" pt={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
}
