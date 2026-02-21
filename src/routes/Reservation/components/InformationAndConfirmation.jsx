import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AppCardCustomizable } from "../../../components/containers/AppCard";
import { TimePicker } from "@mui/x-date-pickers";
import { useReservationContext } from "../context/ReservationContext";
import { useDispatch, useSelector } from "react-redux";
import { updatePrimaryGuest } from "../../../redux/slices/reservation/reservationSlice";
import {
  validateFieldThunk,
  validateInformationAndConfirmation,
} from "../../../redux/slices/reservation/reservationThunks";
import ReservationAppBar from "./ReservationAppBar";

export default function InformationAndConfirmation() {
  const { step, increaseStep, decreaseStep, setStep } = useReservationContext();
  const dispatch = useDispatch();

  return (
    <>
      <ReservationAppBar />
      <Stack
        sx={{
          minHeight: "calc(100vh - 190px)",
          paddingTop: 2, // Přidá mezeru pod sticky AppBar
        }}
        alignItems={"center"}
        justifyContent={"center"}
        p={3}
      >
        <Stack spacing={4} width={{ xs: "100%", md: 700 }}>
          <Typography variant="h4">Informace a potvrzení</Typography>

          <PersonalInformation />

          <ArrivalTime />

          <SupplementaryServices />

          <SpecialRequests />

          <Button
            variant="contained"
            size="large"
            onClick={async () => {
              const isValid = await dispatch(
                validateInformationAndConfirmation(),
              );

              if (!isValid) {
                alert(
                  "Formulář obsahuje chyby. Opravte je prosím před odesláním.",
                );
                return;
              }

              increaseStep();
            }}
          >
            Pokračovat na souhrn
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
function PersonalInformation() {
  const dispatch = useDispatch();
  const reservationState = useSelector((state) => state.reservation);
  const values = reservationState.values;
  const errors = reservationState.errors;

  return (
    <Stack flex={1} spacing={1}>
      <Box>
        <Typography variant="h5">Osobní údaje</Typography>
        <Typography variant="body" color={"text.secondary"}>
          Vyplnte prosím své kontaktní údaje
        </Typography>
      </Box>
      <AppCardCustomizable>
        <Stack p={3} spacing={2} sx={{ width: "100%" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Jméno"
              fullWidth
              value={values.primary_guest.first_name}
              onBlur={() =>
                dispatch(validateFieldThunk("primary_guest.first_name"))
              }
              error={!!errors["primary_guest.first_name"]}
              helperText={errors["primary_guest.first_name"]}
              onChange={(e) =>
                dispatch(
                  updatePrimaryGuest({
                    fieldName: "first_name",
                    value: e.target.value,
                  }),
                )
              }
            />
            <TextField
              label="Příjmení"
              fullWidth
              value={values.primary_guest.last_name}
              onBlur={() =>
                dispatch(validateFieldThunk("primary_guest.last_name"))
              }
              error={!!errors["primary_guest.last_name"]}
              helperText={errors["primary_guest.last_name"]}
              onChange={(e) =>
                dispatch(
                  updatePrimaryGuest({
                    fieldName: "last_name",
                    value: e.target.value,
                  }),
                )
              }
            />
          </Stack>
          <TextField
            label="Email"
            fullWidth
            value={values.primary_guest.email}
            onBlur={() => dispatch(validateFieldThunk("primary_guest.email"))}
            error={!!errors["primary_guest.email"]}
            helperText={errors["primary_guest.email"]}
            onChange={(e) =>
              dispatch(
                updatePrimaryGuest({
                  fieldName: "email",
                  value: e.target.value,
                }),
              )
            }
          />
          <TextField
            label="Telefon"
            fullWidth
            value={values.primary_guest.phone}
            onBlur={() => dispatch(validateFieldThunk("primary_guest.phone"))}
            error={!!errors["primary_guest.phone"]}
            helperText={errors["primary_guest.phone"]}
            onChange={(e) =>
              dispatch(
                updatePrimaryGuest({
                  fieldName: "phone",
                  value: e.target.value,
                }),
              )
            }
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Stát</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.primary_guest.country}
              label="Stát"
              onChange={(e) =>
                dispatch(
                  updatePrimaryGuest({
                    fieldName: "country",
                    value: e.target.value,
                  }),
                )
              }
            >
              <MenuItem value={"Česká republika"}>Česká republika</MenuItem>
              <MenuItem value={"Slovensko"}>Slovensko</MenuItem>
              <MenuItem value={"Polsko"}>Polsko</MenuItem>
              <MenuItem value={"Německo"}>Německo</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </AppCardCustomizable>
    </Stack>
  );
}

function ArrivalTime() {
  return (
    <Stack spacing={1}>
      <Box>
        <Typography variant="h5">Čas příjezdu</Typography>
        <Typography variant="body" color={"text.secondary"}>
          Sdlěte nám, v kolik hodin plánujete přijet. Pokud nevíte přesný čas,
          uveďte přibližný čas příjezdu.
        </Typography>
      </Box>
      <AppCardCustomizable props={{ p: 3 }}>
        <TimePicker label="Čas příjezdu" fullWidth />
      </AppCardCustomizable>
    </Stack>
  );
}

function SupplementaryServices() {
  return (
    <Stack spacing={1}>
      <Box>
        <Typography variant="h5">Doplnkové služby</Typography>
        <Typography variant="body" color={"text.secondary"}>
          Pokud máte další přání nebo údaj, uveďte je zde.
        </Typography>
      </Box>
      <AppCardCustomizable>
        <Stack p={3} spacing={2}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked disableRipple />}
              label="Bufetová snídaně"
            />
            <FormControlLabel control={<Checkbox />} label="Parkování" />
          </FormGroup>
        </Stack>
      </AppCardCustomizable>
    </Stack>
  );
}

function SpecialRequests() {
  const dispatch = useDispatch();
  const reservationState = useSelector((state) => state.reservation);
  const values = reservationState.values;

  return (
    <Stack spacing={1}>
      <Box>
        <Typography variant="h5">Speciální požadavky</Typography>
        <Typography variant="body" color={"text.secondary"}>
          Pokud máte speciální požadavky, uveďte je zde.
        </Typography>
      </Box>
      <AppCardCustomizable>
        <Stack p={3}>
          <TextField
            label="Speciální požadavky"
            multiline
            rows={4}
            value={values.primary_guest.note}
            onChange={(e) =>
              dispatch(
                updatePrimaryGuest({
                  fieldName: "note",
                  value: e.target.value,
                }),
              )
            }
          />
        </Stack>
      </AppCardCustomizable>
    </Stack>
  );
}
