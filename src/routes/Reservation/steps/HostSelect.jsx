import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Add, Remove, SingleBed } from "@mui/icons-material";
import IconWithText from "../../../components/IconWithText";
import { AppCardCustomizable } from "../../../components/containers/AppCard";
import { useReservationContext } from "../context/ReservationContext";
import { updateRoom } from "../../../redux/slices/reservation/reservationSlice";
import useClickSound from "../../../hooks/useClickSound";
import ReservationAppBar from "../components/ReservationAppBar";

/*
 TODO: kolika hostům zbyvá přiřadit pokoj? (bez tohoto nepustit dál) 
 
 TODO:
      zobraz něcoj ako zbyva připradit postel x dospělým, x dětem. (budeš muset
      přidat do spinneru logiku aby nešlo zvolit víc dospelých dětí/než bylo
      vybráno na začátku)
 */

export default function HostSelect() {
  const reservationState = useSelector((state) => state.reservation.values);
  const { step, increaseStep, decreaseStep, setStep } = useReservationContext();

  const remainingAdultsToAssign =
    reservationState.num_adults -
    reservationState.rooms.reduce((sum, room) => sum + room.num_adults, 0);
  const remainingChildrenToAssign =
    reservationState.num_children -
    reservationState.rooms.reduce((sum, room) => sum + room.num_children, 0);

  return (
    <Stack
      sx={{
        minHeight: "calc(100vh - 190px)",
        paddingTop: 2, // Přidá mezeru pod sticky AppBar
      }}
      alignItems={"center"}
      justifyContent={"center"}
      p={2}
      spacing={4}
    >
      <Typography variant="h4">Rozdělení hostů</Typography>
      <Stack spacing={1}>
        <Typography variant="h6" textAlign={"center"}>
          Zbývá přiřadit lůžko pro&nbsp;
          {remainingAdultsToAssign > 0 && (
            <Typography
              component="span"
              variant="h6"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              {remainingAdultsToAssign}&nbsp;dospělý
            </Typography>
          )}
          {remainingAdultsToAssign > 0 && remainingChildrenToAssign > 0 && (
            <>&nbsp;a&nbsp;</>
          )}
          {remainingChildrenToAssign > 0 && (
            <Typography
              component="span"
              variant="h6"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              {remainingChildrenToAssign}&nbsp;dítě
            </Typography>
          )}
        </Typography>
      </Stack>

      <Grid container spacing={2} justifyContent={"center"}>
        {reservationState.rooms.map((room, index) => (
          <Grid key={index}>
            <RoomHostCard room={room} index={index} />
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        size="large"
        sx={{ maxWidth: "300px" }}
        disabled={remainingAdultsToAssign > 0 || remainingChildrenToAssign > 0}
        onClick={increaseStep}
      >
        Pokračovat na údaje
      </Button>
    </Stack>
  );
}

export function RoomHostCard({ room, index }) {
  const dispatch = useDispatch();
  const values = useSelector((state) => state.reservation.values);
  const roomState = useSelector(
    (state) => state.reservation.values.rooms[index],
  );

  const numOfSelectedGuests = roomState.num_adults + roomState.num_children;

  const pricePerNight =
    roomState.num_adults * room.price_for_adult +
    roomState.num_children * room.price_for_children;

  // Pomocné hodnoty pro výpočty
  const totalAssignedAdults = values.rooms.reduce(
    (sum, room) => sum + room.num_adults,
    0,
  );
  const totalAssignedChildren = values.rooms.reduce(
    (sum, room) => sum + room.num_children,
    0,
  );
  const roomCapacity =
    room.capacity || Math.max(room.max_adults || 0, room.max_children || 0);

  const updateGuestCount = (field, increment) => {
    const currentValue = roomState[field];
    const isAdults = field === "num_adults";

    // Vypočítat limity
    const minValue = 0;
    const maxByTotal = isAdults
      ? values.num_adults - (totalAssignedAdults - currentValue)
      : values.num_children - (totalAssignedChildren - currentValue);
    const maxByRoomCapacity =
      roomCapacity - (numOfSelectedGuests - currentValue);

    // Použít nejstriktnější limit
    const maxValue = Math.min(maxByTotal, maxByRoomCapacity);
    const newValue = Math.max(
      minValue,
      Math.min(maxValue, currentValue + increment),
    );

    // Actualizovat pouze pokud se hodnota změnila
    if (newValue !== currentValue) {
      dispatch(updateRoom({ index, data: { [field]: newValue } }));
    }
  };

  // Zjednodušené kontroly pro disable tlačítek
  const canAddAdults = () => {
    return (
      totalAssignedAdults < values.num_adults &&
      numOfSelectedGuests < roomCapacity
    );
  };

  const canAddChildren = () => {
    return (
      totalAssignedChildren < values.num_children &&
      numOfSelectedGuests < roomCapacity
    );
  };

  const canRemoveAdults = () => roomState.num_adults > 0;
  const canRemoveChildren = () => roomState.num_children > 0;

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
          {/* nadpis + ikonky */}
          <Stack alignItems={"start"} spacing={1.5} width={"100%"}>
            <Typography variant="h5" fontWeight={"bold"}>
              {room.name}
            </Typography>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              {Array.from({ length: room.capacity }, (_, index) => (
                <IconWithText
                  key={index}
                  Icon={SingleBed}
                  iconProps={{ fontSize: "medium", color: "primary.main" }}
                  text="Postel"
                  color={
                    index < numOfSelectedGuests ? "primary.main" : "lightgray"
                  }
                />
              ))}
            </Stack>
          </Stack>
          {/* nadpis + ikonky */}

          {/* rozdeleni */}

          <Stack width={"100%"} spacing={2}>
            <Stack spacing={0.5} alignItems={"start"}>
              <Typography variant="h6">Rozdělení hostů</Typography>
              <Typography variant="body2">Rozdělte lůžka mezi hosty</Typography>
            </Stack>

            <BedSelect
              title="Dospělý"
              price={room.price_for_adult}
              onMinus={
                canRemoveAdults()
                  ? () => updateGuestCount("num_adults", -1)
                  : null
              }
              onPlus={
                canAddAdults() ? () => updateGuestCount("num_adults", 1) : null
              }
              value={roomState.num_adults}
            />
            <BedSelect
              title="Dítě"
              price={room.price_for_children}
              onMinus={
                canRemoveChildren()
                  ? () => updateGuestCount("num_children", -1)
                  : null
              }
              onPlus={
                canAddChildren()
                  ? () => updateGuestCount("num_children", 1)
                  : null
              }
              value={roomState.num_children}
            />
          </Stack>
          {/* rozdeleni */}

          <Divider color="lightgray" width="100%" />

          <Stack
            alignItems={"center"}
            justifyContent={"space-between"}
            direction={"row"}
            width={"100%"}
          >
            <Typography variant="body1">Celkem za noc</Typography>
            <Typography variant="h5" fontWeight={"bold"}>
              {pricePerNight} Kč
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </AppCardCustomizable>
  );
}

function BedSelect({ title, price, onMinus, onPlus, value }) {
  return (
    <AppCardCustomizable borderRadius={1.5}>
      <Stack direction={"row"} justifyContent={"space-between"} p={1.5}>
        <Stack alignItems={"start"}>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body1" color="primary.main">
            {price} Kč / noc
          </Typography>
        </Stack>

        <AppSpinner value={value} onMinus={onMinus} onPlus={onPlus} />
      </Stack>
    </AppCardCustomizable>
  );
}

function AppSpinner({ value, onMinus, onPlus }) {
  const playClickSound = useClickSound();

  return (
    <Stack direction={"row"} spacing={2} alignItems={"center"}>
      <IconButton
        sx={{ backgroundColor: "primary.main", borderRadius: 1 }}
        disabled={onMinus === null}
        onClick={() => {
          playClickSound();
          onMinus();
        }}
      >
        <Remove />
      </IconButton>
      <Box minWidth={24}>
        <Typography variant="h5">{value}</Typography>
      </Box>
      <IconButton
        sx={{ backgroundColor: "primary.main", borderRadius: 1 }}
        disabled={onPlus === null}
        onClick={() => {
          playClickSound();
          onPlus();
        }}
      >
        <Add />
      </IconButton>
    </Stack>
  );
}
