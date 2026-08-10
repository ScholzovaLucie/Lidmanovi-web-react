import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { useCreateReservationMutation } from "../../../../../redux/api/reservationsApi";
import { useAvailableRoomsQuery } from "../../../../../redux/api/roomsApi";
import { validateForm } from "../../../../../redux/slices/reservation/reservationValidation";
import { getApiErrorMessages } from "../../../../../utils/apiError";

const REQUIRED_FIELDS = [
  "check_in_date",
  "check_out_date",
  "num_adults",
  "num_children",
  "primary_guest.first_name",
  "primary_guest.last_name",
  "primary_guest.email",
  "primary_guest.phone",
  "primary_guest.country",
];

function emptyValues() {
  return {
    check_in_date: null,
    check_out_date: null,
    num_adults: 1,
    num_children: 0,
    currency: "CZK",
    note: "",
    primary_guest: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      country: "Česká republika",
      note: "",
    },
  };
}

function getRoomsList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.rooms)) return data.rooms;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

// Backend vyžaduje num_adults >= 1 u každého pokoje - rozpočítá celkový počet
// hostů rovnoměrně mezi vybrané pokoje (volající musí zajistit roomIds.length <= totalAdults).
function allocateGuestsToRooms(roomIds, totalAdults, totalChildren) {
  const n = roomIds.length;
  if (n === 0) return [];
  const baseAdults = Math.floor(totalAdults / n);
  const extraAdults = totalAdults % n;
  const baseChildren = Math.floor(totalChildren / n);
  const extraChildren = totalChildren % n;
  return roomIds.map((id, index) => ({
    id,
    num_adults: baseAdults + (index < extraAdults ? 1 : 0),
    num_children: baseChildren + (index < extraChildren ? 1 : 0),
  }));
}

export default function AddReservationDialog({ open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const [values, setValues] = useState(emptyValues);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [errors, setErrors] = useState({});

  const [createReservation, { isLoading }] = useCreateReservationMutation();

  const canQueryRooms =
    !!values.check_in_date && !!values.check_out_date && values.num_adults >= 1;
  const { data: roomsData, isLoading: roomsLoading } = useAvailableRoomsQuery(
    {
      checkIn: values.check_in_date,
      checkOut: values.check_out_date,
      adults: values.num_adults,
      children: values.num_children,
    },
    { skip: !canQueryRooms },
  );
  const availableRooms = getRoomsList(roomsData);

  const updateValues = (patch) => {
    setValues((prev) => ({ ...prev, ...patch }));
  };

  const updateGuest = (field, value) => {
    setValues((prev) => ({
      ...prev,
      primary_guest: { ...prev.primary_guest, [field]: value },
    }));
  };

  const toggleRoom = (roomId) => {
    setSelectedRoomIds((prev) => {
      if (prev.includes(roomId)) return prev.filter((id) => id !== roomId);
      if (prev.length >= values.num_adults) {
        enqueueSnackbar(
          `Nelze vybrat víc pokojů, než je dospělých hostů (${values.num_adults}).`,
          { variant: "warning", autoHideDuration: 4000 },
        );
        return prev;
      }
      return [...prev, roomId];
    });
  };

  const handleClose = () => {
    if (isLoading) return;
    setValues(emptyValues());
    setSelectedRoomIds([]);
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    const fieldErrors = validateForm(values, REQUIRED_FIELDS);
    if (selectedRoomIds.length === 0) {
      fieldErrors.rooms = "Vyber alespoň jeden pokoj.";
    } else if (selectedRoomIds.length > values.num_adults) {
      fieldErrors.rooms = `Nelze vybrat víc pokojů (${selectedRoomIds.length}), než je dospělých hostů (${values.num_adults}).`;
    }
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      enqueueSnackbar("Formulář obsahuje chyby, zkontroluj vyplněná pole.", {
        variant: "error",
        autoHideDuration: 5000,
      });
      return;
    }

    const payload = {
      ...values,
      rooms: allocateGuestsToRooms(
        selectedRoomIds,
        values.num_adults,
        values.num_children,
      ),
    };

    try {
      await createReservation(payload).unwrap();
      enqueueSnackbar("Rezervace byla vytvořena.", {
        variant: "success",
        autoHideDuration: 3000,
      });
      handleClose();
    } catch (err) {
      console.error("Chyba při vytváření rezervace:", err);
      const messages = getApiErrorMessages(err, "Chyba při vytváření rezervace");
      enqueueSnackbar(messages.join(" · "), {
        variant: "error",
        autoHideDuration: 8000,
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Přidat rezervaci</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Termín a hosté</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <DatePicker
                label="Od"
                value={values.check_in_date ? dayjs(values.check_in_date) : null}
                onChange={(newValue) =>
                  updateValues({
                    check_in_date: newValue ? newValue.format("YYYY-MM-DD") : null,
                  })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.check_in_date,
                    helperText: errors.check_in_date,
                  },
                }}
              />
              <DatePicker
                label="Do"
                value={values.check_out_date ? dayjs(values.check_out_date) : null}
                onChange={(newValue) =>
                  updateValues({
                    check_out_date: newValue ? newValue.format("YYYY-MM-DD") : null,
                  })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.check_out_date,
                    helperText: errors.check_out_date,
                  },
                }}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Dospělí"
                type="number"
                fullWidth
                value={values.num_adults}
                onChange={(e) => updateValues({ num_adults: Number(e.target.value) })}
                error={!!errors.num_adults}
                helperText={errors.num_adults}
                slotProps={{ htmlInput: { min: 1 } }}
              />
              <TextField
                label="Děti"
                type="number"
                fullWidth
                value={values.num_children}
                onChange={(e) => updateValues({ num_children: Number(e.target.value) })}
                error={!!errors.num_children}
                helperText={errors.num_children}
                slotProps={{ htmlInput: { min: 0 } }}
              />
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="subtitle2">Pokoj</Typography>
            {!canQueryRooms ? (
              <Typography variant="body2" color="text.secondary">
                Nejdřív vyplň termín a počet dospělých.
              </Typography>
            ) : roomsLoading ? (
              <Stack alignItems="center" py={2}>
                <CircularProgress size={24} />
              </Stack>
            ) : availableRooms.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Pro zadaný termín a počet hostů nejsou volné žádné pokoje.
              </Typography>
            ) : (
              <Stack>
                {availableRooms.map((room) => (
                  <FormControlLabel
                    key={room.id}
                    control={
                      <Checkbox
                        checked={selectedRoomIds.includes(room.id)}
                        onChange={() => toggleRoom(room.id)}
                      />
                    }
                    label={`${room.name}${room.capacity ? ` (kapacita ${room.capacity})` : ""}`}
                  />
                ))}
              </Stack>
            )}
            {errors.rooms && (
              <Typography variant="caption" color="error">
                {errors.rooms}
              </Typography>
            )}
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <Typography variant="subtitle2">Údaje o hostovi</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Jméno"
                fullWidth
                value={values.primary_guest.first_name}
                onChange={(e) => updateGuest("first_name", e.target.value)}
                error={!!errors["primary_guest.first_name"]}
                helperText={errors["primary_guest.first_name"]}
              />
              <TextField
                label="Příjmení"
                fullWidth
                value={values.primary_guest.last_name}
                onChange={(e) => updateGuest("last_name", e.target.value)}
                error={!!errors["primary_guest.last_name"]}
                helperText={errors["primary_guest.last_name"]}
              />
            </Stack>
            <TextField
              label="Email"
              fullWidth
              value={values.primary_guest.email}
              onChange={(e) => updateGuest("email", e.target.value)}
              error={!!errors["primary_guest.email"]}
              helperText={errors["primary_guest.email"]}
            />
            <TextField
              label="Telefon"
              fullWidth
              value={values.primary_guest.phone}
              onChange={(e) => updateGuest("phone", e.target.value)}
              error={!!errors["primary_guest.phone"]}
              helperText={errors["primary_guest.phone"]}
            />
            <FormControl fullWidth error={!!errors["primary_guest.country"]}>
              <InputLabel id="add-reservation-country-label">Země</InputLabel>
              <Select
                labelId="add-reservation-country-label"
                label="Země"
                value={values.primary_guest.country}
                onChange={(e) => updateGuest("country", e.target.value)}
              >
                <MenuItem value="Česká republika">Česká republika</MenuItem>
                <MenuItem value="Slovensko">Slovensko</MenuItem>
                <MenuItem value="Polsko">Polsko</MenuItem>
                <MenuItem value="Německo">Německo</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <TextField
            label="Poznámka (nepovinné)"
            fullWidth
            multiline
            minRows={2}
            value={values.note}
            onChange={(e) => updateValues({ note: e.target.value })}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Zrušit
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Vytvořit rezervaci
        </Button>
      </DialogActions>
    </Dialog>
  );
}
