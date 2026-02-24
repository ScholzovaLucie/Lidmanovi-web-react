import { Box, Button, Drawer, Grid, Stack, Typography } from "@mui/material";
import { useReservationContext } from "../context/ReservationContext";
import { useAvailableRoomsQuery } from "../../../redux/api/roomsApi";
import { AppCardCustomizable } from "../../../components/containers/AppCard";
import {
  BathtubOutlined,
  Person,
  PersonOutline,
  SpaOutlined,
  Wifi,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addRoom,
  remainingCapacityToSelectSelector,
  removeRoom,
} from "../../../redux/slices/reservation/reservationSlice";
import IconWithText from "../../../components/IconWithText";
import ReservationAppBar from "./ReservationAppBar";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { SelectButton } from "../../../components/controls/SelectButton";

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

  /*
  const {
    data: availableRoomsData,
    isLoading: isAvailableRoomsLoading,
    error: availableRoomsError,
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
  */

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

  const [drawerOpen, setDrawerOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;


  return (
    <>
      <ReservationAppBar
        Component={() => {
          return SelectButton({
            variant: "text",
            color: "white",
            label: "Vybrané pokoje",
            onClick: () => setDrawerOpen(true),
          });
        }}
      />
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
        {values.rooms.length > 0 && (
          <>
            <Typography variant="h4">Vybrané pokoje</Typography>
            <Typography variant="h6">
              Vyberte pokoje pro všechny hosty
            </Typography>
            <Grid container spacing={2} justifyContent={"center"}>
              {values.rooms.map((room, index) => (
                <Grid key={index}>
                  <RoomCard room={room} selected />
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              size="large"
              sx={{ maxWidth: "300px" }}
              onClick={increaseStep}
              disabled={remainingCapacityToSelect > 0}
            >
              Pokračovat k rozložení hostů
            </Button>
          </>
        )}
      </Stack>
    </>
  );
}

export function RoomCard({ room, selected }) {
  const dispatch = useDispatch();

  return (
    <AppCardCustomizable>
      <Box maxWidth={370}>
        <img
          src="https://www.thespruce.com/thmb/Afg3IVBq0tV-7DHBME5woSNCZxQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/put-together-a-perfect-guest-room-1976987-hero-223e3e8f697e4b13b62ad4fe898d492d.jpg"
          alt="Room"
          style={{
            width: "100%",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
        <Stack alignItems={"start"} spacing={3} flex={1} padding={3}>
          {/* top */}
          <Stack alignItems={"start"} spacing={1.5} width={"100%"}>
            <Typography fontSize={24} fontWeight={"bold"}>
              {room.name}
            </Typography>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              <IconWithText
                Icon={Wifi}
                iconProps={{ fontSize: "16" }}
                text="Wi-Fi"
              />
              <IconWithText
                Icon={SpaOutlined}
                iconProps={{ fontSize: "16" }}
                text="Ručníky"
              />
              <IconWithText
                Icon={BathtubOutlined}
                iconProps={{ fontSize: "16" }}
                text="Koupelna"
              />
            </Stack>

            <CollapsableText text={room.description} />
          </Stack>
          {/* top */}

          {/* price */}
          <Stack
            width={"100%"}
            direction={"row"}
            alignItems={"end"}
            justifyContent={"space-between"}
          >
            <Price room={room} />
            <Button
              variant="contained"
              size="large"
              color={selected ? "error" : "primary"}
              onClick={() => {
                selected
                  ? dispatch(removeRoom(room.id))
                  : dispatch(addRoom(room));
              }}
            >
              {selected ? "Odebrat" : "Vybrat"}
            </Button>
          </Stack>
        </Stack>
        {/* price */}
      </Box>
    </AppCardCustomizable>
  );
}

function CollapsableText({ text }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <Stack spacing={1} alignItems={"center"}>
      <Typography
        fontSize={16}
        color={"text.secondary"}
        lineHeight="24px"
        textAlign={"start"}
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "none" : 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {text}
      </Typography>
      <Button onClick={toggleExpanded} size="small">
        {expanded ? "Zobrazit méně" : "Zobrazit více"}
      </Button>
    </Stack>
  );
}

function Price({ room }) {
  return (
    <Stack direction={"column"} spacing={0.5} alignItems={"start"}>
      <Typography fontSize={14} color={"text.secondary"} lineHeight="16px">
        CENA ZA NOC
      </Typography>

      <Stack direction={"row"} spacing={0.5} alignItems={"end"}>
        <Typography
          fontSize={28}
          color="primary"
          fontWeight={"bold"}
          lineHeight="30px"
        >
          {room.price_for_adult} Kč
        </Typography>
        <Typography fontSize={14} color={"text.secondary"} lineHeight="22px">
          / dospělý
        </Typography>
      </Stack>
      <Stack direction={"row"} spacing={0.5} alignItems={"end"}>
        <Typography
          fontSize={20}
          color={"text.secondary"}
          fontWeight={"bold"}
          lineHeight="22px"
        >
          {room.price_for_children} Kč
        </Typography>
        <Typography fontSize={14} color={"text.secondary"} lineHeight="18px">
          / dítě
        </Typography>
      </Stack>
    </Stack>
  );
}
