import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";
import PhotoPickerDialog from "../../../../../components/PhotoPickerDialog.jsx";
import { useGetPhotoPlacementsQuery } from "../../../../../redux/api/galleryApi.js";
import { resolveMediaUrl } from "../../../../../utils/resolveMediaUrl.js";

const LANGUAGES = [
  { code: "cs", label: "Čeština" },
  { code: "en", label: "Angličtina" },
  { code: "pl", label: "Polština" },
  { code: "de", label: "Němčina" },
];

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function NearbyPlaceEditDialog({
  open,
  onClose,
  editingPlace,
  formData,
  setFormData,
  onSave,
  isSaving,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState(null);

  const photoLocation = editingPlace ? `nearby-place-${editingPlace.id}` : null;
  const { data: photoData } = useGetPhotoPlacementsQuery(
    { location: photoLocation, page: 1, pageSize: 10 },
    { skip: !photoLocation },
  );
  const photoPlacements = photoData?.results || [];
  const currentPhotoUrl = resolveMediaUrl(
    photoPlacements[0]?.photo?.variants?.card || photoPlacements[0]?.photo?.url,
  );
  const pendingPhotoUrl =
    pendingPhoto?.type === "upload"
      ? pendingPhoto.previewUrl
      : resolveMediaUrl(pendingPhoto?.photo?.variants?.card || pendingPhoto?.photo?.url);

  useEffect(() => {
    return () => {
      if (pendingPhoto?.previewUrl) URL.revokeObjectURL(pendingPhoto.previewUrl);
    };
  }, [pendingPhoto]);

  useEffect(() => {
    if (!open) setPendingPhoto(null);
  }, [open]);

  const nameI18n = formData.name_i18n || {};

  const updateName = (langCode, value) => {
    const nextI18n = { ...nameI18n, [langCode]: value };
    setFormData({
      ...formData,
      name_i18n: nextI18n,
      ...(langCode === "cs" ? { name: value } : {}),
    });
  };

  const handlePhotoSelection = (selection) => {
    setPendingPhoto({
      ...selection,
      previewUrl:
        selection.type === "upload" ? URL.createObjectURL(selection.file) : undefined,
    });
  };

  const isNameValid = (nameI18n.cs || "").trim() !== "";
  const isLinkValid = (formData.link || "").trim() !== "";
  const isIframeValid =
    formData.media_type !== "iframe" || (formData.media_url || "").trim() !== "";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="span">
          {editingPlace ? "Upravit místo" : "Přidat místo v okolí"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography variant="h6" sx={{ mb: -1 }}>
            Název
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {LANGUAGES.map((lang) => (
                <Tab key={lang.code} label={lang.label} />
              ))}
            </Tabs>
          </Box>
          {LANGUAGES.map((lang, index) => (
            <TabPanel key={lang.code} value={activeTab} index={index}>
              <TextField
                label={`Název místa (${lang.label})`}
                value={nameI18n[lang.code] || ""}
                onChange={(e) => updateName(lang.code, e.target.value)}
                fullWidth
                required={lang.code === "cs"}
                placeholder={lang.code !== "cs" ? "Překlad názvu" : ""}
              />
            </TabPanel>
          ))}

          <Typography variant="h6" sx={{ mb: -1, mt: 1 }}>
            Zobrazení
          </Typography>
          <RadioGroup
            row
            value={formData.media_type}
            onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
          >
            <FormControlLabel value="image" control={<Radio />} label="Obrázek" />
            <FormControlLabel value="iframe" control={<Radio />} label="Iframe (např. mapa)" />
          </RadioGroup>

          {formData.media_type === "iframe" ? (
            <TextField
              label="URL pro iframe (src)"
              value={formData.media_url || ""}
              onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
              helperText='U Google Maps: Sdílet → Vložit mapu → zkopírujte jen adresu z uvozovek atributu src="...".'
              fullWidth
              required
            />
          ) : editingPlace ? (
            <Stack direction="row" spacing={2} alignItems="center">
              {currentPhotoUrl && (
                <Box
                  component="img"
                  src={currentPhotoUrl}
                  alt=""
                  sx={{ width: 140, height: 100, objectFit: "cover", borderRadius: 1, border: "1px solid", borderColor: "divider" }}
                />
              )}
              <Button variant="outlined" startIcon={<Edit />} onClick={() => setPhotoDialogOpen(true)}>
                {currentPhotoUrl ? "Změnit fotku" : "Vybrat fotku"}
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              {pendingPhotoUrl && (
                <Box
                  component="img"
                  src={pendingPhotoUrl}
                  alt=""
                  sx={{ width: 140, height: 100, objectFit: "cover", borderRadius: 1, border: "1px solid", borderColor: "divider" }}
                />
              )}
              <Button variant="outlined" startIcon={<Edit />} onClick={() => setPhotoDialogOpen(true)}>
                {pendingPhoto ? "Změnit fotku" : "Vybrat fotku"}
              </Button>
            </Stack>
          )}

          <Typography variant="h6" sx={{ mb: -1, mt: 1 }}>
            Odkaz
          </Typography>
          <TextField
            label="Odkaz (URL)"
            value={formData.link || ""}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://..."
            fullWidth
            required
          />

          <FormControlLabel
            control={
              <Switch
                checked={!!formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                color="success"
              />
            }
            label="Zobrazeno na webu"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button onClick={onClose} startIcon={<Cancel />} disabled={isSaving}>
          Zrušit
        </Button>
        <Button
          onClick={() => onSave(pendingPhoto)}
          variant="contained"
          startIcon={<Save />}
          disabled={isSaving || !isNameValid || !isLinkValid || !isIframeValid}
        >
          {isSaving ? "Ukládání..." : editingPlace ? "Uložit změny" : "Přidat místo"}
        </Button>
      </DialogActions>

      {formData.media_type === "image" && (photoLocation || !editingPlace) && (
        <PhotoPickerDialog
          open={photoDialogOpen}
          onClose={() => setPhotoDialogOpen(false)}
          location={photoLocation}
          existingPlacements={photoPlacements}
          singlePhoto
          onPhotoSelection={editingPlace ? undefined : handlePhotoSelection}
        />
      )}
    </Dialog>
  );
}
