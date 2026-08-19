import { useState } from "react";
import { Button, IconButton, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { Add, Delete, Settings } from "@mui/icons-material";
import { useAmenityIconsQuery } from "../../../../../redux/api/roomsApi";
import {
  DEFAULT_AMENITY_ICON_OPTIONS,
  resolveRoomAmenityIcon,
} from "../../../../../utils/roomAmenityIcons";
import RoomAmenityIconsManagerDialog from "./RoomAmenityIconsManagerDialog";

export default function RoomAmenitiesEditor({ amenities, onChange }) {
  const list = amenities || [];
  const [managerOpen, setManagerOpen] = useState(false);

  // Nabídku ikon řídí backendový číselník (AmenityIcon). Dokud endpoint
  // neexistuje / selže / je prázdný, použije se pevná výchozí sada.
  const { data: iconOptionsData, isError } = useAmenityIconsQuery();
  const activeOptions = (
    !isError && iconOptionsData && iconOptionsData.length > 0
      ? iconOptionsData
      : DEFAULT_AMENITY_ICON_OPTIONS
  ).filter((option) => option.is_active);

  const updateItem = (index, patch) => {
    onChange(list.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeItem = (index) => {
    onChange(list.filter((_, i) => i !== index));
  };

  const addItem = () => {
    onChange([...list, { icon: activeOptions[0]?.key || "bed", text: "" }]);
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
            value={item.icon}
            onChange={(e) => updateItem(index, { icon: e.target.value })}
            sx={{ minWidth: 190 }}
            renderValue={(value) => {
              const Icon = resolveRoomAmenityIcon(value);
              const label =
                activeOptions.find((o) => o.key === value)?.label || value;
              return (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Icon fontSize="small" />
                  <span>{label}</span>
                </Stack>
              );
            }}
          >
            {activeOptions.map((option) => {
              const Icon = resolveRoomAmenityIcon(option.key);
              return (
                <MenuItem key={option.key} value={option.key}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Icon fontSize="small" />
                    <span>{option.label}</span>
                  </Stack>
                </MenuItem>
              );
            })}
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

      <Stack direction="row" spacing={1} alignItems="center">
        <Button startIcon={<Add />} onClick={addItem}>
          Přidat ikonu
        </Button>
        <Button
          startIcon={<Settings />}
          color="inherit"
          size="small"
          onClick={() => setManagerOpen(true)}
        >
          Spravovat dostupné ikony
        </Button>
      </Stack>

      <RoomAmenityIconsManagerDialog
        open={managerOpen}
        onClose={() => setManagerOpen(false)}
      />
    </Stack>
  );
}
