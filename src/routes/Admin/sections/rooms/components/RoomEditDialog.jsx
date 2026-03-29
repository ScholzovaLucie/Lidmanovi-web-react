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
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import SpinnerField from "./SpinnerField";

export default function RoomEditDialog({
  open,
  onClose,
  editingRoom,
  formData,
  setFormData,
  onSave,
  isUpdating,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="span">
          {editingRoom ? "Upravit pokoj" : "Přidat nový pokoj"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Základní informace */}
          <Typography variant="h6" sx={{ mb: -1 }}>
            Základní informace
          </Typography>

          <TextField
            label="Název pokoje"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            required
          />

          <TextField
            label="Popis pokoje"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            fullWidth
            multiline
            rows={3}
            required
          />

          {/* Kapacita */}
          <Typography variant="h6" sx={{ mb: -1, mt: 2 }}>
            Kapacita
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <SpinnerField
                label="Max dospělých"
                value={formData.max_adults}
                onChange={(val) =>
                  setFormData({ ...formData, max_adults: val })
                }
                min={1}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <SpinnerField
                label="Max dětí"
                value={formData.max_children}
                onChange={(val) =>
                  setFormData({ ...formData, max_children: val })
                }
                min={0}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Celková kapacita"
                value={Math.max(
                  parseInt(formData.max_adults) || 0,
                  parseInt(formData.max_children) || 0,
                )}
                fullWidth
                type="number"
                disabled
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>

          {/* Ceny */}
          <Typography variant="h6" sx={{ mb: -1, mt: 2 }}>
            Ceny
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
          onClick={onSave}
          variant="contained"
          startIcon={<Save />}
          disabled={
            isUpdating ||
            !formData.name ||
            !formData.description ||
            !formData.max_adults ||
            !formData.price_for_adult ||
            !formData.price_for_children
          }
        >
          {isUpdating
            ? "Ukládání..."
            : editingRoom
              ? "Uložit změny"
              : "Přidat pokoj"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
