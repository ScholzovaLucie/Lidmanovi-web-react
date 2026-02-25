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

export default function RoomSelect() {
  const { step, increaseStep, decreaseStep, setStep } = useReservationContext();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
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
  });

  const [availableRooms, setAvailableRooms] = useState([]);
  const remainingCapacityToSelect = useSelector(
    remainingCapacityToSelectSelector,
  );
  const reservationState = useSelector((state) => state.reservation);
  const values = reservationState.values;
  const allHostsCount = values.num_adults + values.num_children;

  const actuallySelectedCapacity = values.rooms.reduce((sum, room) => {
    const capacity = Math.max(room.max_adults, room.max_children);
    return sum + capacity;
  }, 0);

  function sortRooms(rooms) {
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

  function filterOutSelectedRooms(rooms, selectedRooms) {
    const selectedIds = selectedRooms.map((room) => room.id);
    return rooms.filter((room) => !selectedIds.includes(room.id));
  }

  useEffect(() => {
    if (isLoading || error || !rooms) return;
    console.log("RECALCULATE");
    const available = filterOutSelectedRooms(rooms.rooms, values.rooms);
    const sorted = sortRooms(available);
    setAvailableRooms((prev) => (prev = sorted));
  }, [rooms, isLoading, error, remainingCapacityToSelect, values.rooms]);

  function handleNextStep() {
    if (remainingCapacityToSelect > 0) {
      enqueueSnackbar(
        `${remainingCapacityToSelect} hosté nejsou přiřazeni. Prosím vyberte další pokoj.`,
        {
          variant: "error",
          autoHideDuration: 5000,
        },
      );
      return;
    }

    increaseStep();
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

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
        <Typography variant="h4">Dostupné pokoje</Typography>
        <Typography variant="h6">Vyberte pokoje pro všechny hosty</Typography>

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

        <Grid container spacing={2} justifyContent={"center"}>
          {availableRooms.map((room, index) => (
            <Grid key={index}>
              <RoomCard room={room} />
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          size="large"
          sx={{ maxWidth: "300px" }}
          onClick={handleNextStep}
        >
          Pokračovat na konfiguraci pokojů
        </Button>
      </Stack>
    </>
  );
}
