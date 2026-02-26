import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { AppCardCustomizable } from "../../../components/containers/AppCard";
import { Bed } from "@mui/icons-material";
import { CalendarIcon } from "@mui/x-date-pickers";
import ReservationAppBar from "../components/ReservationAppBar";
import { useDispatch, useSelector } from "react-redux";
import {
  submitFormThunk,
  validateAll,
  validateTermAndGuests,
} from "../../../redux/slices/reservation/reservationThunks";
import dayjs from "dayjs";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

function formatGuestsText(numAdults, numChildren, t) {
  const guestParts = [
    numAdults > 0 && t("summary.adultsCount", { count: numAdults }),
    numChildren > 0 && t("summary.childrenCount", { count: numChildren }),
  ].filter(Boolean);

  return guestParts.join(", ");
}

function calculateTotalPriceForRoom(room) {
  return (
    room.num_adults * room.price_for_adult +
    room.num_children * room.price_for_children
  );
}

function calculateTotalPrice(rooms) {
  return rooms.reduce((total, room) => {
    return (
      total +
      room.num_adults * room.price_for_adult +
      room.num_children * room.price_for_children
    );
  }, 0);
}

export function OrderSummary() {
  const { t } = useTranslation("rezervace");
  const [loading, setLoading] = useState(false);
  const [reservationNumber, setReservationNumber] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const theme = useTheme();
  const values = useSelector((state) => state.reservation.values);

  const checkInFormatted = dayjs(values.check_in_date).format("D.MM");
  const checkOutFormatted = dayjs(values.check_out_date).format("D.MM.YYYY");
  const numberOfNights = dayjs(values.check_out_date).diff(
    dayjs(values.check_in_date),
    "day",
  );

  async function handleSubmit() {
    setLoading(true);
    const { isValid, validationErrors, response } =
      await dispatch(submitFormThunk());

    if (!isValid) {
      validationErrors.map((error) => {
        enqueueSnackbar(error, {
          variant: "error",
          autoHideDuration: null,
          action: (key) => (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => closeSnackbar(key)}
            >
              <Close fontSize="small" />
            </IconButton>
          ),
        });
      });
      setLoading(false);
      return;
    }

    setReservationNumber(
      response?.number ?? response?.reservation?.number ?? null,
    );
    setLoading(false);
  }

  return (
    <Stack
      sx={{
        minHeight: "calc(100vh - 190px)",
        paddingTop: 2, // Přidá mezeru pod sticky AppBar
      }}
      alignItems={"center"}
      justifyContent={"center"}
      p={3}
    >
      <Stack width={{ width: "100%", maxWidth: 500 }} spacing={4}>
        <Typography variant="h4" textAlign={{ xs: "start", sm: "center" }}>
          {t("summary.title")}
        </Typography>

        <AppCardCustomizable
          props={{
            border: reservationNumber
              ? `2px solid ${theme.palette.success.main}`
              : undefined,
            backgroundColor: reservationNumber
              ? alpha(
                  theme.palette.success.main,
                  theme.palette.mode === "dark" ? 0.14 : 0.06,
                )
              : undefined,
          }}
        >
          <Stack p={2} spacing={2} sx={{ width: "100%" }}>
            <Typography
              variant="h5"
              fontWeight={"bold"}
              textAlign={"start"}
              component={Box}
              paddingX={1}
            >
              {t("summary.property")}
            </Typography>

            <Divider />

            {/* Detalily pobytu */}
            <Stack alignItems={"center"} direction={"row"} spacing={1.5} p={1}>
              <HighlightedIcon Icon={CalendarIcon} />

              <Stack alignItems={"start"}>
                <Typography variant="body1" fontWeight={"bold"} color="text.primary">
                  {t("summary.stayTerm")}
                </Typography>
                <Typography variant="body1">
                  <strong>
                    {checkInFormatted} - {checkOutFormatted}
                  </strong>
                  &nbsp;({t("summary.nightsCount", { count: numberOfNights })})
                </Typography>
              </Stack>
            </Stack>

            {/* Počet hostů */}
            <Stack
              alignItems={"center"}
              direction={"row"}
              spacing={1.5}
              paddingX={1}
            >
              <HighlightedIcon Icon={Bed} />

              <Stack alignItems={"start"}>
                <Typography variant="body1" fontWeight={"bold"} color="text.primary">
                  {t("summary.guestCount")}
                </Typography>
                <Typography variant="body1">
                  <strong>
                    {t("summary.guestsTotal", {
                      count: values.num_adults + values.num_children,
                    })}
                  </strong>
                  &nbsp;(
                  {formatGuestsText(values.num_adults, values.num_children, t)})
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            {/* Ubytování */}
            <Stack spacing={1}>
              {values.rooms.map((room, index) => (
                <Stack
                  bgcolor={"primary.50"}
                  borderRadius={1}
                  p={1}
                  spacing={0.5}
                  key={index}
                >
                  <Stack alignItems={"center"} direction={"row"} spacing={1.5}>
                    <HighlightedIcon Icon={Bed} />

                    <Stack
                      alignItems={"start"}
                      justifyContent={"space-between"}
                      direction={"row"}
                      width={"100%"}
                    >
                      <Typography
                        variant="body1"
                        fontWeight={"bold"}
                        color="text.primary"
                      >
                        {room.name}
                      </Typography>
                      <Typography variant="body1" fontWeight={"bold"}>
                        {t("common.priceCzk", {
                          amount: calculateTotalPriceForRoom(room),
                        })}
                      </Typography>
                    </Stack>
                  </Stack>

                  {room.num_adults > 0 && (
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography variant="body2" color="text.secondary">
                        {t("summary.adultRow", { count: room.num_adults })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("common.priceCzk", { amount: room.price_for_adult })}
                      </Typography>
                    </Stack>
                  )}

                  {room.num_children > 0 && (
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography variant="body2" color="text.secondary">
                        {t("summary.childRow", { count: room.num_children })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("common.priceCzk", { amount: room.price_for_children })}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              ))}
            </Stack>

            <Divider />

            {/* Celková cena */}
            <Stack
              spacing={1}
              alignItems={"end"}
              justifyContent={"space-between"}
              direction={"row"}
              px={1}
            >
              <Typography variant="h6" color="text.primary">
                {t("summary.totalPrice")}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {t("common.priceCzk", { amount: calculateTotalPrice(values.rooms) })}
              </Typography>
            </Stack>

            <Box padding={1}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSubmit}
                disabled={loading || reservationNumber !== null}
              >
                {t("summary.submit")}
              </Button>
            </Box>
          </Stack>
        </AppCardCustomizable>
        {reservationNumber && (
          <>
            <Typography variant="h5" align="center" color="success.main">
              {t("summary.success")}
            </Typography>
            <Typography variant="h4" align="center" color="success.main">
              {t("summary.reservationNumber")} <strong>{reservationNumber}</strong>
            </Typography>
          </>
        )}
      </Stack>
    </Stack>
  );
}
function HighlightedIcon({ Icon }) {
  return (
    <Stack padding={1} borderRadius={1} bgcolor={"primary.100"}>
      <Icon color="primary" />
    </Stack>
  );
}
