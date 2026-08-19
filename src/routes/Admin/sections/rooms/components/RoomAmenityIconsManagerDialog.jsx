import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Close, Delete } from "@mui/icons-material";
import {
  useAmenityIconsQuery,
  useCreateAmenityIconMutation,
  useDeleteAmenityIconMutation,
  useUpdateAmenityIconMutation,
} from "../../../../../redux/api/roomsApi";
import {
  DEFAULT_AMENITY_ICON_OPTIONS,
  ROOM_AMENITY_ICON_LIBRARY,
  resolveRoomAmenityIcon,
} from "../../../../../utils/roomAmenityIcons";

export default function RoomAmenityIconsManagerDialog({ open, onClose }) {
  const { data, isLoading, isError } = useAmenityIconsQuery(undefined, { skip: !open });
  const [createAmenityIcon] = useCreateAmenityIconMutation();
  const [updateAmenityIcon] = useUpdateAmenityIconMutation();
  const [deleteAmenityIcon] = useDeleteAmenityIconMutation();

  const [newKey, setNewKey] = useState("");

  // Backend endpoint ještě nemusí existovat (funkce se teprve zavádí) -
  // v tom případě jen ukážeme, co se použije jako výchozí sada, ale
  // spravovat to zatím nejde.
  const isManageable = !isError;
  const icons = isManageable ? data || [] : DEFAULT_AMENITY_ICON_OPTIONS;

  const usedKeys = new Set(icons.map((item) => item.key));
  const availableNewKeys = Object.keys(ROOM_AMENITY_ICON_LIBRARY).filter(
    (key) => !usedKeys.has(key),
  );

  const handleAdd = async () => {
    if (!newKey) return;
    await createAmenityIcon({
      key: newKey,
      label: ROOM_AMENITY_ICON_LIBRARY[newKey]?.label || newKey,
      order: icons.length,
      is_active: true,
    });
    setNewKey("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        Dostupné ikony vybavení
        <IconButton onClick={onClose} size="small">
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {!isManageable && !isLoading && (
            <Alert severity="info">
              Správa ikon zatím není na backendu dostupná - zobrazuje se výchozí
              sada. Jakmile bude endpoint <code>/pension/admin/amenity-icons/</code>{" "}
              hotový, půjde tu ikony přidávat, přejmenovávat a skrývat.
            </Alert>
          )}

          {isLoading && <Typography color="text.secondary">Načítám...</Typography>}

          <Stack spacing={1.5}>
            {icons.map((item) => {
              const Icon = resolveRoomAmenityIcon(item.key);
              return (
                <Stack key={item.key} direction="row" spacing={1.5} alignItems="center">
                  <Icon fontSize="small" />
                  <TextField
                    size="small"
                    value={item.label}
                    disabled={!isManageable}
                    onChange={(e) =>
                      isManageable &&
                      updateAmenityIcon({ id: item.id, label: e.target.value })
                    }
                    fullWidth
                  />
                  <Switch
                    checked={item.is_active}
                    disabled={!isManageable}
                    onChange={(e) =>
                      isManageable &&
                      updateAmenityIcon({ id: item.id, is_active: e.target.checked })
                    }
                  />
                  <IconButton
                    color="error"
                    size="small"
                    disabled={!isManageable}
                    onClick={() => isManageable && deleteAmenityIcon(item.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              );
            })}
          </Stack>

          {isManageable && availableNewKeys.length > 0 && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Select
                size="small"
                value={newKey}
                displayEmpty
                onChange={(e) => setNewKey(e.target.value)}
                sx={{ minWidth: 220 }}
              >
                <MenuItem value="">
                  <em>Vybrat ikonu k přidání...</em>
                </MenuItem>
                {availableNewKeys.map((key) => (
                  <MenuItem key={key} value={key}>
                    {ROOM_AMENITY_ICON_LIBRARY[key].label}
                  </MenuItem>
                ))}
              </Select>
              <Button onClick={handleAdd} disabled={!newKey}>
                Přidat
              </Button>
            </Stack>
          )}

          {isManageable && availableNewKeys.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Všechny ikony z aktuální palety jsou už v seznamu.
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose}>Zavřít</Button>
      </DialogActions>
    </Dialog>
  );
}
