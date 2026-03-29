import {
  Box,
  Button,
  FormControl,
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
import ReservationAppBar from "../components/ReservationAppBar";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

export default function InformationAndConfirmation() {
  const { t } = useTranslation("rezervace");
  const { step, increaseStep, decreaseStep, setStep } = useReservationContext();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleButtonContinueToSummary = async () => {
    const { isValid, validationErrors } = await dispatch(
      validateInformationAndConfirmation(),
    );

    if (isValid) {
      increaseStep();
    } else {
      validationErrors.map((error) => {
        enqueueSnackbar(error, {
          variant: "error",
          autoHideDuration: 5000,
        });
      });
    }
  };

  return (
    <Stack flex={1}>
      <Stack alignItems={"center"} justifyContent={"center"} p={3}>
        <Stack spacing={4} width={{ xs: "100%", md: 700 }}>
          <Typography variant="h4">{t("info.title")}</Typography>

          <PersonalInformation />

          <ArrivalTime />

          <SpecialRequests />
        </Stack>
      </Stack>

      {/* Sticky bottom navigation */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          bgcolor: "background.default",
          borderTop: "1px solid",
          borderColor: "divider",
          px: { xs: 2, md: 3 },
          py: { xs: 1.5, md: 2 },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          maxWidth={900}
          width="100%"
          mx="auto"
          gap={2}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIos />}
            onClick={decreaseStep}
            sx={{ minWidth: { xs: 0, sm: 120 }, flexShrink: 0 }}
          >
            {t("common.back")}
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIos />}
            onClick={handleButtonContinueToSummary}
            sx={{ flex: 1, maxWidth: { xs: "100%" } }}
          >
            {t("common.continue")}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
function PersonalInformation() {
  const { t } = useTranslation("rezervace");
  const dispatch = useDispatch();
  const reservationState = useSelector((state) => state.reservation);
  const values = reservationState.values;
  const errors = reservationState.errors;

  return (
    <Stack flex={1} spacing={1}>
      <Box>
        <Typography variant="h5">Osobní údaje</Typography>
        <Typography variant="body" color={"text.secondary"}>
          {t("info.personalHint")}
        </Typography>
      </Box>
      <AppCardCustomizable>
        <Stack p={3} spacing={2} sx={{ width: "100%" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label={t("info.labels.firstName")}
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
              label={t("info.labels.lastName")}
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
            label={t("info.labels.email")}
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
            label={t("info.labels.phone")}
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
            <InputLabel id="demo-simple-select-label">
              {t("info.labels.country")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.primary_guest.country}
              label={t("info.labels.country")}
              onChange={(e) =>
                dispatch(
                  updatePrimaryGuest({
                    fieldName: "country",
                    value: e.target.value,
                  }),
                )
              }
            >
              <MenuItem value={"Česká republika"}>
                {t("info.countries.cz")}
              </MenuItem>
              <MenuItem value={"Slovensko"}>{t("info.countries.sk")}</MenuItem>
              <MenuItem value={"Polsko"}>{t("info.countries.pl")}</MenuItem>
              <MenuItem value={"Německo"}>{t("info.countries.de")}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </AppCardCustomizable>
    </Stack>
  );
}

function ArrivalTime() {
  const { t } = useTranslation("rezervace");
  return (
    <Stack spacing={1}>
      <Box>
        <Typography variant="h5">{t("info.arrivalTitle")}</Typography>
        <Typography variant="body" color={"text.secondary"}>
          {t("info.arrivalHint")}
        </Typography>
      </Box>
      <AppCardCustomizable props={{ p: 3 }}>
        <TimePicker label={t("info.labels.arrivalTime")} fullWidth />
      </AppCardCustomizable>
    </Stack>
  );
}

function SpecialRequests() {
  const { t } = useTranslation("rezervace");
  const dispatch = useDispatch();
  const reservationState = useSelector((state) => state.reservation);
  const values = reservationState.values;

  return (
    <Stack spacing={1}>
      <Box>
        <Typography variant="h5">{t("info.specialTitle")}</Typography>
        <Typography variant="body" color={"text.secondary"}>
          {t("info.specialHint")}
        </Typography>
      </Box>
      <AppCardCustomizable>
        <Stack p={3}>
          <TextField
            label={t("info.labels.specialRequests")}
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
