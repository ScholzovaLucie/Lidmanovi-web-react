import { useRef, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
  Pagination,
  TextField,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import {
  useGetPhotosQuery,
  useUploadPhotosMutation,
  useDeletePhotoMutation,
} from "../../../../redux/api/galleryApi";

const PAGE_SIZE = 24;
const DEFAULT_CATEGORY = "galerie";

export default function GallerySection() {
  const fileInputRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);

  const { data, isLoading, error } = useGetPhotosQuery({ page, pageSize: PAGE_SIZE });

  const photos = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const [uploadPhotos, { isLoading: isUploading }] = useUploadPhotosMutation();
  const [deletePhoto, { isLoading: isRemoving }] = useDeletePhotoMutation();

  const handleAddClick = () => {
    if (!isUploading) fileInputRef.current?.click();
  };

  const handleFilesSelected = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    try {
      await uploadPhotos({ category: category || DEFAULT_CATEGORY, files }).unwrap();
      enqueueSnackbar("Fotky byly úspěšně nahrány", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      console.error("Chyba při nahrávání fotek:", err);
      enqueueSnackbar("Chyba při nahrávání fotek", {
        variant: "error",
        autoHideDuration: 5000,
      });
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

  return (
    <Stack p={{ md: 3 }} spacing={2}>
      <Stack>
        <Typography variant="h4" gutterBottom>
          Fotky
        </Typography>
        <Typography variant="body1">
          Zde je knihovna všech nahraných fotek. Přiřazení fotky na konkrétní
          místo webu (úvodní slideshow, galerie, úvodní fotky stránek) se dělá
          přímo na dané stránce pomocí "Inline editace".
        </Typography>
      </Stack>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFilesSelected}
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
                  <>
                    <TextField
                      label="Kategorie"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      size="small"
                      onClick={(e) => e.stopPropagation()}
                      sx={{ width: "100%" }}
                    />
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
                  </>
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
                    src={photo.url}
                    alt=""
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
                    onClick={() => handleDelete(photo.id)}
                    disabled={isRemoving}
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
