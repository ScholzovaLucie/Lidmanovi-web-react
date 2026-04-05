import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AppCard from "../../../components/containers/AppCard";
import { DatePicker } from "@mui/x-date-pickers";
import MenuDecorator from "../../../components/decorators/MenuDecorator";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useReservationContext } from "../context/ReservationContext";
import { useDispatch, useSelector } from "react-redux";
import { updateReservation } from "../../../redux/slices/reservation/reservationSlice";
import {
  validateFieldThunk,
  validateTermAndGuests,
} from "../../../redux/slices/reservation/reservationThunks";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import ReservationStepper from "../components/ReservationStepper";
import { useEffect } from "react";

export default function TermSelect() {
  const { t } = useTranslation("rezervace");
  const { step, increaseStep, decreaseStep, setStep } = useReservationContext();
  const { enqueueSnackbar } = useSnackbar();
  const reservationState = useSelector((state) => state.reservation);
  const dispatch = useDispatch();
  const values = reservationState.values;
  const errors = reservationState.errors;
  const checkInDate = values.check_in_date ? dayjs(values.check_in_date) : null;
  const checkOutDate = values.check_out_date
    ? dayjs(values.check_out_date)
    : null;

  const handleNextStep = async () => {
    const { isValid, validationErrors } = await dispatch(
      validateTermAndGuests(),
    );

    if (!isValid) {
      validationErrors.map((error) => {
        enqueueSnackbar(error, {
          variant: "error",
          autoHideDuration: 5000,
        });
      });
      return;
    }
    increaseStep();
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Stack
      flex={1}
      alignItems={"center"}
      justifyContent={"center"}
      p={3}
      spacing={4}
    >
      <Typography variant="h4">{t("term.title")}</Typography>

      <AppCard>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <DatePicker
            label={t("term.labels.checkIn")}
            disablePast
            value={checkInDate}
            onChange={(value) => {
              const formattedCheckIn = value
                ? value.format("YYYY-MM-DD")
                : null;
              const nextPayload = { check_in_date: formattedCheckIn };

              if (!formattedCheckIn) {
                nextPayload.check_out_date = null;
              } else {
                const currentCheckOut = values.check_out_date
                  ? dayjs(values.check_out_date)
                  : null;

                if (
                  !currentCheckOut ||
                  !currentCheckOut.isAfter(value, "day")
                ) {
                  nextPayload.check_out_date = formattedCheckIn;
                }
              }

              dispatch(updateReservation(nextPayload));
            }}
            onBlur={() => dispatch(validateFieldThunk("check_in_date"))}
            error={!!errors["check_in_date"]}
            helperText={errors["check_in_date"]}
          />

          <DatePicker
            label={t("term.labels.checkOut")}
            disablePast
            value={checkOutDate}
            referenceDate={checkInDate || undefined}
            onChange={(value) =>
              dispatch(
                updateReservation({
                  check_out_date: value ? value.format("YYYY-MM-DD") : null,
                }),
              )
            }
            onBlur={() => dispatch(validateFieldThunk("check_out_date"))}
            error={!!errors["check_out_date"]}
            helperText={errors["check_out_date"]}
          />

          <MenuDecorator
            menuContent={
              <Stack>
                <Stack
                  p={2}
                  direction={"row"}
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Typography>{t("common.adults")}</Typography>
                  <Stack direction={"row"} alignItems="center" spacing={1}>
                    <IconButton
                      onClick={() =>
                        dispatch(
                          updateReservation({
                            num_adults: Math.max(
                              0,
                              (values.num_adults || 0) - 1,
                            ),
                          }),
                        )
                      }
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                    <Typography>{values.num_adults || 0}</Typography>
                    <IconButton
                      onClick={() =>
                        dispatch(
                          updateReservation({
                            num_adults: (values.num_adults || 0) + 1,
                          }),
                        )
                      }
                    >
                      <ControlPointIcon />
                    </IconButton>
                  </Stack>
                </Stack>
                <Stack
                  p={2}
                  direction={"row"}
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Typography>{t("common.children")}</Typography>
                  <Stack direction={"row"} alignItems="center" spacing={1}>
                    <IconButton
                      onClick={() =>
                        dispatch(
                          updateReservation({
                            num_children: Math.max(
                              0,
                              (values.num_children || 0) - 1,
                            ),
                          }),
                        )
                      }
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                    <Typography>{values.num_children || 0}</Typography>
                    <IconButton
                      onClick={() =>
                        dispatch(
                          updateReservation({
                            num_children: (values.num_children || 0) + 1,
                          }),
                        )
                      }
                    >
                      <ControlPointIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
            }
          >
            <TextField
              label={t("term.labels.addGuests")}
              value={t("term.labels.guestsValue", {
                adults: values.num_adults || 0,
                children: values.num_children || 0,
              })}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                width: "246px",
                cursor: "pointer",
                "& .MuiOutlinedInput-root": {
                  cursor: "pointer",
                },
              }}
            />
          </MenuDecorator>
        </Stack>
      </AppCard>
      <Button
        variant="contained"
        size="large"
        sx={{ maxWidth: "300px" }}
        onClick={handleNextStep}
      >
        {t("term.cta")}
      </Button>
    </Stack>
  );
}
