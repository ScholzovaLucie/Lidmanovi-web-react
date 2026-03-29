import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { AppCardCustomizable } from "../../../components/containers/AppCard";
import { Bed, Person } from "@mui/icons-material";
import { CalendarIcon } from "@mui/x-date-pickers";
import ReservationAppBar from "../components/ReservationAppBar";
import { useReservationContext } from "../context/ReservationContext";
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
import { ArrowBackIos, Close } from "@mui/icons-material";
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
  const { decreaseStep } = useReservationContext();

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

    // Zobraz toast s potvrzením úspěšné rezervace
    enqueueSnackbar(t("summary.successEmailConfirmation"), {
      variant: "success",
      autoHideDuration: 8000,
    });

    setLoading(false);
  }

  return (
    <Stack flex={1}>
      <Stack alignItems={"center"} justifyContent={"center"} p={3} flex={1}>
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
              <Stack
                alignItems={"center"}
                direction={"row"}
                spacing={1.5}
                p={1}
              >
                <HighlightedIcon Icon={CalendarIcon} />

                <Stack alignItems={"start"}>
                  <Typography
                    variant="body1"
                    fontWeight={"bold"}
                    color="text.primary"
                  >
                    {t("summary.stayTerm")}
                  </Typography>
                  <Typography variant="body1">
                    <strong>
                      {checkInFormatted} - {checkOutFormatted}
                    </strong>
                    &nbsp;({t("summary.nightsCount", { count: numberOfNights })}
                    )
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
                  <Typography
                    variant="body1"
                    fontWeight={"bold"}
                    color="text.primary"
                  >
                    {t("summary.guestCount")}
                  </Typography>
                  <Typography variant="body1">
                    <strong>
                      {t("summary.guestsTotal", {
                        count: values.num_adults + values.num_children,
                      })}
                    </strong>
                    &nbsp;(
                    {formatGuestsText(
                      values.num_adults,
                      values.num_children,
                      t,
                    )}
                    )
                  </Typography>
                </Stack>
              </Stack>

              <Divider />

              <Stack>
                {/* Informace o hostu */}
                <Stack
                  alignItems={"center"}
                  direction={"row"}
                  spacing={1.5}
                  paddingX={1}
                >
                  <HighlightedIcon Icon={Person} />

                  <Stack alignItems={"start"}>
                    <Typography
                      variant="body1"
                      fontWeight={"bold"}
                      color="text.primary"
                    >
                      {t("summary.guestInfo")}
                    </Typography>
                    <Typography variant="body1" fontWeight={"bold"}>
                      {values.primary_guest?.first_name}{" "}
                      {values.primary_guest?.last_name}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack p={1} alignItems={"flex-start"}>
                  {values.primary_guest?.email && (
                    <Typography variant="body2" color="text.secondary">
                      {t("summary.guestEmail")}: {values.primary_guest.email}
                    </Typography>
                  )}

                  {values.primary_guest?.phone && (
                    <Typography variant="body2" color="text.secondary">
                      {t("summary.guestPhone")}: {values.primary_guest.phone}
                    </Typography>
                  )}

                  {values.primary_guest?.country && (
                    <Typography variant="body2" color="text.secondary">
                      {t("summary.guestCountry")}:{" "}
                      {values.primary_guest.country}
                    </Typography>
                  )}

                  {values.primary_guest?.note && (
                    <Typography variant="body2" color="text.secondary">
                      {t("summary.guestNote")}: {values.primary_guest.note}
                    </Typography>
                  )}
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
                    <Stack
                      alignItems={"center"}
                      direction={"row"}
                      spacing={1.5}
                    >
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
                          {t("common.priceCzk", {
                            amount: room.price_for_adult,
                          })}
                        </Typography>
                      </Stack>
                    )}

                    {room.num_children > 0 && (
                      <Stack direction={"row"} justifyContent={"space-between"}>
                        <Typography variant="body2" color="text.secondary">
                          {t("summary.childRow", { count: room.num_children })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t("common.priceCzk", {
                            amount: room.price_for_children,
                          })}
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
                  {t("common.priceCzk", {
                    amount: calculateTotalPrice(values.rooms),
                  })}
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
                {t("summary.reservationNumber")}{" "}
                <strong>{reservationNumber}</strong>
              </Typography>
            </>
          )}
        </Stack>{" "}
      </Stack>
      {/* Sticky bottom navigation */}
      {!reservationNumber && (
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
            justifyContent="flex-start"
            alignItems="center"
            maxWidth={900}
            width="100%"
            mx="auto"
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIos />}
              onClick={decreaseStep}
              sx={{ minWidth: { xs: 0, sm: 120 }, flexShrink: 0 }}
            >
              {t("common.back")}s
            </Button>
          </Stack>
        </Box>
      )}
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
