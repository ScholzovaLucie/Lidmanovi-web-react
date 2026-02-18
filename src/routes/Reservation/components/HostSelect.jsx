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
import ReservationAppBar from "./ReservationAppBar";

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

  return (
    <>
      <ReservationAppBar />
      <Stack
        sx={{ 
          minHeight: "calc(100vh - 190px)",
          paddingTop: 2 // Přidá mezeru pod sticky AppBar
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
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            1&nbsp;dospělý
          </Typography>
          &nbsp;a&nbsp;
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            2&nbsp;dítě
          </Typography>
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
        onClick={increaseStep}
      >
        Pokračovat na údaje
      </Button>
    </Stack>
    </>
  );
}

export function RoomHostCard({ room, index }) {
  const dispatch = useDispatch();
  const roomState = useSelector(
    (state) => state.reservation.values.rooms[index],
  );

  const numOfSelectedGuests = roomState.num_adults + roomState.num_children;

  const pricePerNight =
    roomState.num_adults * room.price_for_adult +
    roomState.num_children * room.price_for_children;

  const updateGuestCount = (field, increment) => {
    // Současná hodnota pro daný typ hosta
    const currentValue = roomState[field];
    // Celkový počet už přiřazených hostů
    const totalAssigned = roomState.num_adults + roomState.num_children;

    // Maximální kapacita pokoje
    const roomCapacity = Math.max(room.max_adults, room.max_children);

    // Vypočítat novou hodnotu s omezeními (min 0, max volná kapacita + současná hodnota)
    const availableSlots = roomCapacity - totalAssigned + currentValue;
    const newValue = Math.min(
      availableSlots,
      Math.max(0, currentValue + increment),
    );

    dispatch(updateRoom({ index, data: { [field]: newValue } }));
  };

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
              onMinus={() => updateGuestCount("num_adults", -1)}
              onPlus={() => updateGuestCount("num_adults", 1)}
              value={roomState.num_adults}
            />
            <BedSelect
              title="Dítě"
              price={room.price_for_children}
              onMinus={() => updateGuestCount("num_children", -1)}
              onPlus={() => updateGuestCount("num_children", 1)}
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
        sx={{ backgroundColor: "lightgray", borderRadius: 1 }}
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
