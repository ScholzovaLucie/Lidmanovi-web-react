import { Button, IconButton, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { ROOM_AMENITY_ICON_OPTIONS } from "../../../../../utils/roomAmenityIcons";

export default function RoomAmenitiesEditor({ amenities, onChange }) {
  const list = amenities || [];

  const updateItem = (index, patch) => {
    onChange(list.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index) => {
    onChange(list.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange([...list, { icon: "bed", text: "" }]);
  };

  return (
    <Stack spacing={1.5}>
      {list.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Zatím žádné ikony vybavení. Přidejte například televizi nebo možnost
          pobytu se psem.
        </Typography>
      )}

      {list.map((item, index) => (
        <Stack key={index} direction="row" spacing={1.5} alignItems="center">
          <Select
            size="small"
            value={item.icon in ROOM_AMENITY_ICON_OPTIONS ? item.icon : "bed"}
            onChange={(e) => updateItem(index, { icon: e.target.value })}
            sx={{ minWidth: 190 }}
          >
            {Object.entries(ROOM_AMENITY_ICON_OPTIONS).map(([key, option]) => (
              <MenuItem key={key} value={key}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <option.Icon fontSize="small" />
                  <span>{option.label}</span>
                </Stack>
              </MenuItem>
            ))}
          </Select>
          <TextField
            size="small"
            placeholder={
              item.icon === "bed"
                ? "Prázdné = automaticky počet lůžek"
                : "Krátký text (nepovinné)"
            }
            value={item.text || ""}
            onChange={(e) => updateItem(index, { text: e.target.value })}
            fullWidth
          />
          <IconButton onClick={() => removeItem(index)} color="error" size="small">
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ))}

      <Button startIcon={<Add />} onClick={addItem} sx={{ alignSelf: "flex-start" }}>
        Přidat ikonu
      </Button>
    </Stack>
  );
}
