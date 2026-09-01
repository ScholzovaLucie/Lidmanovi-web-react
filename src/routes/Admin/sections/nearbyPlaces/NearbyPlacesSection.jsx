import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import NearbyPlaceAdminCard from "./components/NearbyPlaceAdminCard";
import NearbyPlaceEditDialog from "./components/NearbyPlaceEditDialog";
import NearbyPlaceDeleteDialog from "./components/NearbyPlaceDeleteDialog";
import {
  useAdminNearbyPlacesQuery,
  useCreateNearbyPlaceMutation,
  useUpdateNearbyPlaceMutation,
  useDeleteNearbyPlaceMutation,
} from "../../../../redux/api/nearbyPlacesApi";
import { useCreatePhotoPlacementMutation, useUploadPhotosMutation } from "../../../../redux/api/galleryApi";
import { getApiErrorMessage } from "../../../../utils/apiError";

const EMPTY_FORM = {
  name: "",
  name_i18n: {},
  media_type: "image",
  media_url: "",
  link: "",
  is_active: true,
};

export default function NearbyPlacesSection() {
  const { enqueueSnackbar } = useSnackbar();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [deletingPlaceId, setDeletingPlaceId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const { data, isLoading, error } = useAdminNearbyPlacesQuery();
  const [createNearbyPlace, { isLoading: isCreating }] = useCreateNearbyPlaceMutation();
  const [updateNearbyPlace, { isLoading: isUpdating }] = useUpdateNearbyPlaceMutation();
  const [deleteNearbyPlace] = useDeleteNearbyPlaceMutation();
  const [uploadPhotos, { isLoading: isUploadingPhoto }] = useUploadPhotosMutation();
  const [createPhotoPlacement, { isLoading: isPlacingPhoto }] = useCreatePhotoPlacementMutation();

  const places = data?.results || data || [];

  const handleAddNew = () => {
    setEditingPlace(null);
    setFormData(EMPTY_FORM);
    setEditDialogOpen(true);
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name || "",
      name_i18n: place.name_i18n || {},
      media_type: place.media_type || "image",
      media_url: place.media_type === "iframe" ? place.media_url || "" : "",
      link: place.link || "",
      is_active: place.is_active !== undefined ? place.is_active : true,
    });
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditingPlace(null);
    setFormData(EMPTY_FORM);
  };

  const savePendingPhoto = async (place, pendingPhoto) => {
    if (!pendingPhoto) return;
    const location = `nearby-place-${place.id}`;
    let photoId;

    if (pendingPhoto.type === "existing") {
      photoId = pendingPhoto.photo.id;
    } else {
      const uploaded = await uploadPhotos({
        category: location,
        files: [pendingPhoto.file],
        altTextI18n: pendingPhoto.altTextI18n,
      }).unwrap();
      const photo = Array.isArray(uploaded) ? uploaded[0] : uploaded;
      photoId = photo?.id;
    }

    if (!photoId) throw new Error("Nahraná fotografie neobsahuje identifikátor.");
    await createPhotoPlacement({ photo: photoId, location, order: 0 }).unwrap();
  };

  const handleSave = async (pendingPhoto) => {
    let createdPlace = null;
    try {
      const placeData = {
        name_i18n: formData.name_i18n,
        media_type: formData.media_type,
        link: formData.link,
        is_active: formData.is_active,
      };
      if (formData.media_type === "iframe") {
        placeData.media_url = formData.media_url;
      }

      if (editingPlace) {
        await updateNearbyPlace({ id: editingPlace.id, ...placeData }).unwrap();
      } else {
        createdPlace = await createNearbyPlace(placeData).unwrap();
        if (formData.media_type === "image") {
          await savePendingPhoto(createdPlace, pendingPhoto);
        }
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Error saving nearby place:", err);
      if (createdPlace) {
        setEditingPlace(createdPlace);
        enqueueSnackbar("Místo bylo uloženo, ale fotku se nepodařilo přidat. Zkuste ji vybrat znovu.", {
          variant: "error",
          autoHideDuration: 5000,
        });
      } else {
        enqueueSnackbar(getApiErrorMessage(err, "Místo se nepodařilo uložit"), {
          variant: "error",
          autoHideDuration: 5000,
        });
      }
    }
  };

  const handleDelete = (id) => {
    setDeletingPlaceId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteNearbyPlace(deletingPlaceId).unwrap();
      setDeleteDialogOpen(false);
      setDeletingPlaceId(null);
    } catch (err) {
      console.error("Error deleting nearby place:", err);
      enqueueSnackbar(getApiErrorMessage(err, "Místo se nepodařilo smazat"), {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeletingPlaceId(null);
  };

  return (
    <Stack p={{ md: 3 }} spacing={2}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
        <Stack>
          <Typography variant="h4" gutterBottom>
            Místa v okolí
          </Typography>
          <Typography variant="body1">
            Spravujte seznam míst v okolí, který se zobrazuje na veřejné stránce.
            Ke každému místu patří obrázek nebo iframe (např. mapa) a odkaz.
          </Typography>
        </Stack>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddNew} sx={{ whiteSpace: "nowrap" }}>
          Přidat místo
        </Button>
      </Stack>

      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography>Načítání míst...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", py: 8, color: "error.main" }}>
          <Typography>Chyba při načítání míst v okolí</Typography>
        </Box>
      ) : places.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary">Zatím nejsou přidaná žádná místa.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "stretch" }}>
          {places.map((place) => (
            <Box key={place.id} sx={{ width: "100%", maxWidth: 320 }}>
              <NearbyPlaceAdminCard place={place} onEdit={handleEdit} onDelete={handleDelete} />
            </Box>
          ))}
        </Box>
      )}

      <NearbyPlaceEditDialog
        open={editDialogOpen}
        onClose={handleCloseDialog}
        editingPlace={editingPlace}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        isSaving={isCreating || isUpdating || isUploadingPhoto || isPlacingPhoto}
      />

      <NearbyPlaceDeleteDialog open={deleteDialogOpen} onCancel={cancelDelete} onConfirm={confirmDelete} />
    </Stack>
  );
}
