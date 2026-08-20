import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  InputAdornment,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { Save, Cancel, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import SpinnerField from "./SpinnerField";
import RoomAmenitiesEditor from "./RoomAmenitiesEditor";
import { useGetPhotoPlacementsQuery } from "../../../../../redux/api/galleryApi.js";
import { resolveMediaUrl } from "../../../../../utils/resolveMediaUrl.js";
import PhotoPickerDialog from "../../../../../components/PhotoPickerDialog.jsx";

// Kontroluje, jestli je pole vyplněné platným číslem - na rozdíl od `!value`
// nepovažuje legitimní hodnotu 0 (např. cenu zdarma) za "nevyplněné".
function isFilledNumber(value, { min = 0 } = {}) {
  if (value === "" || value === null || value === undefined) return false;
  const num = Number(value);
  return !Number.isNaN(num) && num >= min;
}

// Tab Panel component pro jazykové taby
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`language-tabpanel-${index}`}
      aria-labelledby={`language-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function RoomEditDialog({
  open,
  onClose,
  editingRoom,
  formData,
  setFormData,
  onSave,
  isUpdating,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState(null);

  const photoLocation = editingRoom ? `pokoj-${editingRoom.id}` : null;
  const { data: photoData } = useGetPhotoPlacementsQuery(
    { location: photoLocation, page: 1, pageSize: 10 },
    { skip: !photoLocation },
  );
  const photoPlacements = photoData?.results || [];
  const currentPhotoUrl =
    resolveMediaUrl(
      photoPlacements[0]?.photo?.variants?.card || photoPlacements[0]?.photo?.url,
    ) || `${import.meta.env.BASE_URL}ubytovani/ubytovani1.webp`;
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

  // Jazykové varianty
  const languages = [
    { code: "cs", label: "Čeština" },
    { code: "en", label: "Angličtina" },
    { code: "pl", label: "Polština" },
    { code: "de", label: "Němčina" },
  ];

  // Inicializace i18n dat pokud ještě neexistují
  const initializeI18nData = () => {
    const nameI18n = formData.name_i18n || {};
    const descriptionI18n = formData.description_i18n || {};
    
    // Inicializace všech jazyků, pokud neexistují
    languages.forEach(lang => {
      if (!nameI18n[lang.code]) {
        nameI18n[lang.code] = lang.code === 'cs' ? (formData.name || '') : '';
      }
      if (!descriptionI18n[lang.code]) {
        descriptionI18n[lang.code] = lang.code === 'cs' ? (formData.description || '') : '';
      }
    });
    
    return { nameI18n, descriptionI18n };
  };

  // Aktualizace hodnot pro konkrétní jazyk
  const updateLanguageData = (languageCode, field, value) => {
    const { nameI18n, descriptionI18n } = initializeI18nData();
    
    const updatedFormData = { ...formData };

    if (field === 'name') {
      updatedFormData.name_i18n = {
        ...nameI18n,
        [languageCode]: value
      };
      // Pokud je to čeština, aktualizujeme i hlavní pole name
      if (languageCode === 'cs') {
        updatedFormData.name = value;
      }
    } else if (field === 'description') {
      updatedFormData.description_i18n = {
        ...descriptionI18n,
        [languageCode]: value
      };
      // Pokud je to čeština, aktualizujeme i hlavní pole description
      if (languageCode === 'cs') {
        updatedFormData.description = value;
      }
    }

    setFormData(updatedFormData);
  };

  // Získání hodnoty pro konkrétní jazyk a pole
  const getLanguageValue = (languageCode, field) => {
    const { nameI18n, descriptionI18n } = initializeI18nData();
    if (field === 'name') {
      return nameI18n[languageCode] || '';
    } else if (field === 'description') {
      return descriptionI18n[languageCode] || '';
    }
    return '';
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePhotoSelection = (selection) => {
    setPendingPhoto({
      ...selection,
      previewUrl:
        selection.type === "upload" ? URL.createObjectURL(selection.file) : undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="span">
          {editingRoom ? "Upravit pokoj" : "Přidat nový pokoj"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Základní informace s jazykovými taby */}
          <Typography variant="h6" sx={{ mb: 0 }}>
            Základní informace
          </Typography>

          {/* Jazykové taby */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="language tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              {languages.map((lang, index) => (
                <Tab 
                  key={lang.code} 
                  label={lang.label} 
                  id={`language-tab-${index}`}
                  aria-controls={`language-tabpanel-${index}`}
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab panely pro jednotlivé jazyky */}
          {languages.map((lang, index) => (
            <TabPanel key={lang.code} value={activeTab} index={index}>
              <Stack spacing={2}>
                <TextField
                  label={`Název pokoje (${lang.label})`}
                  value={getLanguageValue(lang.code, 'name')}
                  onChange={(e) => updateLanguageData(lang.code, 'name', e.target.value)}
                  fullWidth
                  required={lang.code === 'cs'}
                  placeholder={lang.code !== 'cs' ? 'Překlad názvu pokoje' : ''}
                />

                <TextField
                  label={`Popis pokoje (${lang.label})`}
                  value={getLanguageValue(lang.code, 'description')}
                  onChange={(e) => updateLanguageData(lang.code, 'description', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  required={lang.code === 'cs'}
                  placeholder={lang.code !== 'cs' ? 'Překlad popisu pokoje' : ''}
                />
              </Stack>
            </TabPanel>
          ))}

          {/* Fotka pokoje */}
          <Typography variant="h6" sx={{ mb: -1, mt: 2 }}>
            Fotka pokoje
          </Typography>

          {editingRoom ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                component="img"
                src={currentPhotoUrl}
                alt={photoPlacements[0]?.photo?.alt_text || formData.name || ""}
                sx={{
                  width: 140,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setPhotoDialogOpen(true)}
              >
                Změnit fotku
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              {pendingPhotoUrl && (
                <Box
                  component="img"
                  src={pendingPhotoUrl}
                  alt={formData.name || "Náhled vybrané fotky pokoje"}
                  sx={{
                    width: 140,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
              )}
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setPhotoDialogOpen(true)}
              >
                {pendingPhoto ? "Změnit fotku" : "Vybrat fotku"}
              </Button>
            </Stack>
          )}

          {/* Kapacita */}
          <Typography variant="h6" sx={{ mb: -1, mt: 2 }}>
            Kapacita
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <SpinnerField
                label="Celkový počet lůžek"
                value={formData.capacity}
                onChange={(val) => setFormData({ ...formData, capacity: val })}
                min={1}
                required
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Ceny */}
          <Typography variant="h6" sx={{ mb: -1, mt: 2 }}>
            Ceny
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Cena za dospělého"
                value={formData.price_for_adult}
                onChange={(e) =>
                  setFormData({ ...formData, price_for_adult: e.target.value })
                }
                fullWidth
                type="number"
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">Kč</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Cena za dítě"
                value={formData.price_for_children}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price_for_children: e.target.value,
                  })
                }
                fullWidth
                type="number"
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">Kč</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Vybavení - ikony s krátkým textem u pokoje */}
          <Typography variant="h6" sx={{ mb: -1, mt: 2 }}>
            Vybavení (ikony u pokoje)
          </Typography>
          <RoomAmenitiesEditor
            amenities={formData.amenities}
            onChange={(amenities) => setFormData({ ...formData, amenities })}
          />

          {/* Status */}
          <FormControlLabel
            control={
              <Switch
                checked={!!formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                color="success"
              />
            }
            label="Aktivní pokoj"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button onClick={onClose} startIcon={<Cancel />} disabled={isUpdating}>
          Zrušit
        </Button>
        <Button
          onClick={() => onSave(pendingPhoto)}
          variant="contained"
          startIcon={<Save />}
          disabled={
            isUpdating ||
            getLanguageValue('cs', 'name').trim() === '' ||
            getLanguageValue('cs', 'description').trim() === '' ||
            !isFilledNumber(formData.capacity, { min: 1 }) ||
            !isFilledNumber(formData.price_for_adult) ||
            !isFilledNumber(formData.price_for_children)
          }
        >
          {isUpdating
            ? "Ukládání..."
            : editingRoom
              ? "Uložit změny"
              : "Přidat pokoj"}
        </Button>
      </DialogActions>

      {(photoLocation || !editingRoom) && (
        <PhotoPickerDialog
          open={photoDialogOpen}
          onClose={() => setPhotoDialogOpen(false)}
          location={photoLocation}
          existingPlacements={photoPlacements}
          singlePhoto
          onPhotoSelection={
            editingRoom
              ? undefined
              : handlePhotoSelection
          }
        />
      )}
    </Dialog>
  );
}
