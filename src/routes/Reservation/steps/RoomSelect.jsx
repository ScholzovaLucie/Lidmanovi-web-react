import {
  Box,
  Button,
  Drawer,
  Fab,
  Grid,
  Stack,
  Typography,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useReservationContext } from "../context/ReservationContext";
import { useAvailableRoomsQuery } from "../../../redux/api/roomsApi";
import { AppCardCustomizable } from "../../../components/containers/AppCard";
import {
  BathtubOutlined,
  Close,
  CheckCircleOutline,
  SpaOutlined,
  Wifi,
  ArrowBackIos,
  ArrowForwardIos,
  HotelOutlined,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addRoom,
  remainingCapacityToSelectSelector,
  removeRoom,
} from "../../../redux/slices/reservation/reservationSlice";
import IconWithText from "../../../components/IconWithText";
import ReservationAppBar from "../components/ReservationAppBar";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { SelectButton } from "../../../components/controls/SelectButton";
import RoomCard from "../components/RoomCard";
import ReservationStepper from "../components/ReservationStepper";
import { useTranslation } from "react-i18next";
import { RoomCartCompactCard } from "../components/RoomCardCompact";
import Cart from "../components/Cart";

export default function RoomSelect() {
  const { t, i18n } = useTranslation("rezervace");
  const { step, increaseStep, decreaseStep, setStepWithScroll } =
    useReservationContext();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const activeLang = String(
    i18n.resolvedLanguage || i18n.language || "cs",
  ).split("-")[0];

  const checkIn = useSelector((state) =>
    dayjs(state.reservation.values.check_in_date).format("YYYY-MM-DD"),
  );
  const checkOut = useSelector((state) =>
    dayjs(state.reservation.values.check_out_date).format("YYYY-MM-DD"),
  );
  const adults = useSelector((state) => state.reservation.values.num_adults);
  const children = useSelector(
    (state) => state.reservation.values.num_children,
  );

  const {
    data: rooms,
    isLoading,
    error,
  } = useAvailableRoomsQuery(
    { checkIn, checkOut, adults, children, language: activeLang },
    { skip: !checkIn || !checkOut },
  );

  const [availableRooms, setAvailableRooms] = useState([]);
  const remainingCapacityToSelect = useSelector(
    remainingCapacityToSelectSelector,
  );
  const reservationState = useSelector((state) => state.reservation);
  const values = reservationState.values;
  const selectedRoomsRef = useRef(null);
  const roomsList = getRoomsList(rooms);
  const hasNoAvailableRooms =
    !isLoading && !error && rooms && roomsList.length === 0;
  const hasEnoughCapacity =
    values.rooms.length > 0 && remainingCapacityToSelect <= 0;

  function sortRooms(rooms = []) {
    const sorted = [...rooms].sort((a, b) => {
      const aCapacity =
        Number(a.capacity) ||
        Math.max(Number(a.max_adults) || 0, Number(a.max_children) || 0);
      const bCapacity =
        Number(b.capacity) ||
        Math.max(Number(b.max_adults) || 0, Number(b.max_children) || 0);

      const aDiff = aCapacity - remainingCapacityToSelect;
      const bDiff = bCapacity - remainingCapacityToSelect;

      const aFits = aDiff >= 0;
      const bFits = bDiff >= 0;

      // 1. Pokoje které se vejdou mají prioritu
      if (aFits && !bFits) return -1;
      if (!aFits && bFits) return 1;

      // 2. Oba se vejdou → menší rozdíl je lepší
      if (aFits && bFits) {
        return aDiff - bDiff;
      }

      // 3. Ani jeden se nevejde → blíž k nule je lepší
      return Math.abs(aDiff) - Math.abs(bDiff);
    });
    return sorted;
  }

  function filterOutSelectedRooms(rooms = [], selectedRooms = []) {
    const selectedIds = selectedRooms.map((room) => room.id);
    return rooms.filter((room) => !selectedIds.includes(room.id));
  }

  function getRoomsList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.rooms)) return data.rooms;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  }

  useEffect(() => {
    if (isLoading || error || !rooms) return;
    const available = filterOutSelectedRooms(roomsList, values.rooms);
    const sorted = sortRooms(available);
    setAvailableRooms(sorted);
  }, [rooms, isLoading, error, remainingCapacityToSelect, values.rooms]);

  function handleNextStep() {
    if (remainingCapacityToSelect > 0) {
      enqueueSnackbar(
        t("rooms.notAssignedError", { count: remainingCapacityToSelect }),
        {
          variant: "error",
          autoHideDuration: 5000,
        },
      );
      return;
    }

    increaseStep();
  }

  if (isLoading) return <div>{t("common.loading")}</div>;
  if (error) return <div>{t("common.error")}</div>;

  return (
    <Stack flex={1} minHeight={0}>
      {/* Scrollable content */}
      <Stack
        alignItems="center"
        px={0}
        py={3}
        spacing={4}
        flex={1}
        minHeight={0}
      >
        <Stack width="100%" spacing={{ xs: 5, md: 7 }}>
          <Stack
            component="section"
            width="100%"
            spacing={3}
            alignItems="center"
            aria-labelledby="available-rooms-title"
          >
          <Stack alignItems="center" spacing={0.5}>
            <Typography id="available-rooms-title" variant="h4">
              {t("rooms.title")}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {t("rooms.subtitle")}
            </Typography>
          </Stack>

          {hasNoAvailableRooms ? (
            <AppCardCustomizable
              props={{
                width: "100%",
                maxWidth: 620,
                border: "1px solid",
                borderColor: "warning.light",
                backgroundColor: "warning.50",
              }}
            >
              <Stack spacing={2.5} p={3} alignItems="center">
                <Typography variant="h6" textAlign="center" color="warning.dark">
                  {t("rooms.noRoomTitle")}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                >
                  {t("rooms.noRoomText")}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setStepWithScroll(0)}
                >
                  {t("rooms.backToTerm")}
                </Button>
              </Stack>
            </AppCardCustomizable>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {availableRooms.map((room) => (
                <Grid key={room.id} sx={{ display: "flex" }}>
                  <RoomCard room={room} fillHeight />
                </Grid>
              ))}
            </Grid>
          )}
          </Stack>

          <Stack
            component="section"
            width="100%"
            spacing={2}
            alignItems="center"
            aria-labelledby="selected-rooms-title"
            sx={{
              bgcolor: "action.hover",
              px: { xs: 2, md: 3 },
              py: { xs: 3, md: 4 },
            }}
          >
          <Typography id="selected-rooms-title" variant="h4">
            {t("layout.selectedRooms")}
          </Typography>
          {values.rooms.length > 0 ? (
            <Grid
              ref={selectedRoomsRef}
              container
              spacing={2}
              justifyContent="center"
              sx={{ scrollMarginTop: 120 }}
            >
              {values.rooms.map((room) => (
                <Grid key={room.id} sx={{ display: "flex" }}>
                  <RoomCard room={room} selected fillHeight />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Stack spacing={0.5} alignItems="center">
              <Typography color="text.secondary" textAlign="center">
                {t("layout.noRoomSelected")}
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {t("rooms.noSelectedRoomsHint")}
              </Typography>
            </Stack>
          )}
          </Stack>
        </Stack>

        <Box
          component="nav"
          aria-label={t("stepper.rooms")}
          sx={{
            width: "100%",
            maxWidth: 900,
            pt: { xs: 2, md: 3 },
          }}
        >
          <Stack spacing={2.5}>
            <Stack alignItems="center">
              <Typography variant="body1" color="text.secondary" textAlign="center">
                {t("rooms.remainingCapacity", {
                  count: Math.max(remainingCapacityToSelect, 0),
                })}
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIos />}
                onClick={decreaseStep}
                sx={{ minWidth: { sm: 140 } }}
              >
                {t("common.back")}
              </Button>

              {!hasNoAvailableRooms && (
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIos />}
                  onClick={handleNextStep}
                  disabled={!hasEnoughCapacity}
                  sx={{ flex: 1 }}
                >
                  {t("common.continue")}
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      </Stack>
      {values.rooms.length > 0 && (
        <Fab
          variant="extended"
          color="primary"
          aria-label={t("layout.selectedRooms")}
          onClick={() =>
            selectedRoomsRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            })
          }
          sx={{
            position: "fixed",
            right: { xs: 16, md: 32 },
            bottom: { xs: 16, md: 32 },
            zIndex: 10,
          }}
        >
          <HotelOutlined sx={{ mr: 1 }} />
          {t("layout.selectedRooms")}
        </Fab>
      )}
    </Stack>
  );
}
