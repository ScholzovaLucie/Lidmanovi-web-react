import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useUpdatePhotoAltMutation } from "../redux/api/galleryApi";
import { getApiErrorMessage } from "../utils/apiError";
import AltTextFields from "./AltTextFields";

export default function PhotoAltEditDialog({ open, onClose, photo }) {
  const { enqueueSnackbar } = useSnackbar();
  const [altTextI18n, setAltTextI18n] = useState({});
  const [updatePhotoAlt, { isLoading }] = useUpdatePhotoAltMutation();

  useEffect(() => {
    if (open) {
      setAltTextI18n(photo?.alt_text_i18n || {});
    }
  }, [open, photo]);

  const handleSave = async () => {
    try {
      await updatePhotoAlt({ id: photo.id, altTextI18n }).unwrap();
      enqueueSnackbar("Alt text byl uložen", {
        variant: "success",
        autoHideDuration: 3000,
      });
      onClose();
    } catch (err) {
      console.error("Chyba při ukládání alt textu:", err);
      enqueueSnackbar(getApiErrorMessage(err, "Chyba při ukládání alt textu"), {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { "data-inline-edit-allow-action": "true" } }}
    >
      <DialogTitle>Upravit alt text obrázku</DialogTitle>
      <DialogContent>
        <AltTextFields value={altTextI18n} onChange={setAltTextI18n} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Zrušit
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Uložit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
