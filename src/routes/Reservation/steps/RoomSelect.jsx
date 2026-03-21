import {
  Box,
  Button,
  Drawer,
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
  Person,
  PersonOutline,
  SpaOutlined,
  Wifi,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
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

export default function RoomSelect() {
  const { t, i18n } = useTranslation("rezervace");
  const { step, increaseStep, decreaseStep, setStep } = useReservationContext();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const activeLang = String(i18n.resolvedLanguage || i18n.language || "cs").split(
    "-",
  )[0];

  const {
    data: rooms,
    isLoading,
    error,
  } = useAvailableRoomsQuery({
    checkIn: useSelector((state) =>
      dayjs(state.reservation.values.check_in_date).format("YYYY-MM-DD"),
    ),
    checkOut: useSelector((state) =>
      dayjs(state.reservation.values.check_out_date).format("YYYY-MM-DD"),
    ),
    adults: useSelector((state) => state.reservation.values.num_adults),
    children: useSelector((state) => state.reservation.values.num_children),
    language: activeLang,
  });

  const [availableRooms, setAvailableRooms] = useState([]);
  const remainingCapacityToSelect = useSelector(
    remainingCapacityToSelectSelector,
  );
  const reservationState = useSelector((state) => state.reservation);
  const values = reservationState.values;
  const allHostsCount = values.num_adults + values.num_children;
  const roomsList = getRoomsList(rooms);
  const hasNoAvailableRooms = !isLoading && !error && rooms && roomsList.length === 0;
  const hasEnoughCapacity =
    values.rooms.length > 0 && remainingCapacityToSelect <= 0;

  const actuallySelectedCapacity = values.rooms.reduce((sum, room) => {
    const capacity = Math.max(room.max_adults, room.max_children);
    return sum + capacity;
  }, 0);

  function sortRooms(rooms = []) {
    const sorted = [...rooms].sort((a, b) => {
      const aCapacity = Math.max(a.max_adults, a.max_children);
      const bCapacity = Math.max(b.max_adults, b.max_children);

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
    console.log("RECALCULATE");
    const available = filterOutSelectedRooms(roomsList, values.rooms);
    const sorted = sortRooms(available);
    setAvailableRooms((prev) => (prev = sorted));
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
    <>
      <Stack
        sx={{
          minHeight: "calc(100vh - 190px)",
          paddingTop: 2, // Přidá mezeru pod sticky AppBar
        }}
        alignItems={"center"}
        justifyContent={"center"}
        p={3}
        spacing={4}
      >
        <Typography variant="h4">{t("rooms.title")}</Typography>
        <Typography variant="h6">{t("rooms.subtitle")}</Typography>

        <Grid container spacing={1} alignItems="center" justifyContent="center">
          {Array.from({ length: allHostsCount }).map((_, index) => (
            <Grid item key={index}>
              {index >= actuallySelectedCapacity ? (
                <PersonOutline fontSize="medium" color="disabled" />
              ) : (
                <Person fontSize="medium" />
              )}
            </Grid>
          ))}
        </Grid>

        {hasEnoughCapacity && (
          <AppCardCustomizable
            props={{
              width: "100%",
              maxWidth: 620,
              border: "1px solid",
              borderColor: "success.light",
              backgroundColor: "success.50",
            }}
          >
            <Stack direction="row" spacing={1.5} p={2} alignItems="center">
              <CheckCircleOutline color="success" />
              <Typography variant="body1" color="success.dark">
                {t("rooms.allSelected")}
              </Typography>
            </Stack>
          </AppCardCustomizable>
        )}

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
              <Typography variant="body1" color="text.secondary" textAlign="center">
                {t("rooms.noRoomText")}
              </Typography>
              <Button variant="contained" size="large" onClick={() => setStep(0)}>
                {t("rooms.backToTerm")}
              </Button>
            </Stack>
          </AppCardCustomizable>
        ) : (
          <Grid container spacing={2} justifyContent={"center"}>
            {availableRooms.map((room, index) => (
              <Grid key={index}>
                <RoomCard room={room} />
              </Grid>
            ))}
          </Grid>
        )}

        {!hasNoAvailableRooms && (
          <Button
            variant="contained"
            size="large"
            sx={{ maxWidth: "300px" }}
            onClick={handleNextStep}
          >
            {t("rooms.cta")}
          </Button>
        )}
      </Stack>
    </>
  );
}
