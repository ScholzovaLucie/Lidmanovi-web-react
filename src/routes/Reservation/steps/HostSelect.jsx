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
import {
  Add,
  ArrowBackIos,
  ArrowForwardIos,
  Remove,
  SingleBed,
} from "@mui/icons-material";
import IconWithText from "../../../components/IconWithText";
import { AppCardCustomizable } from "../../../components/containers/AppCard";
import { useReservationContext } from "../context/ReservationContext";
import { updateRoom } from "../../../redux/slices/reservation/reservationSlice";
import useClickSound from "../../../hooks/useClickSound";
import ReservationAppBar from "../components/ReservationAppBar";
import { useTranslation } from "react-i18next";

export default function HostSelect() {
  const { t } = useTranslation("rezervace");
  const reservationState = useSelector((state) => state.reservation.values);
  const { step, increaseStep, decreaseStep, setStep } = useReservationContext();

  const remainingAdultsToAssign =
    reservationState.num_adults -
    reservationState.rooms.reduce((sum, room) => sum + room.num_adults, 0);
  const remainingChildrenToAssign =
    reservationState.num_children -
    reservationState.rooms.reduce((sum, room) => sum + room.num_children, 0);

  // Kontrola prázdných pokojů
  const hasEmptyRooms = reservationState.rooms.some(
    (room) => room.num_adults === 0 && room.num_children === 0,
  );

  // Validace pro tlačítko pokračovat
  const hasRemainingGuests =
    remainingAdultsToAssign > 0 || remainingChildrenToAssign > 0;
  const canProceed = !hasRemainingGuests && !hasEmptyRooms;

  // Zobrazit error pouze pokud jsou všichni hosté přiřazeni, ale existují prázdné pokoje
  const shouldShowEmptyRoomsError = !hasRemainingGuests && hasEmptyRooms;

  const remainingBedsToAssignTypography = (
    <Stack spacing={1}>
      <Typography variant="h6" textAlign={"center"}>
        {t("guests.remainingPrefix")}&nbsp;
        {remainingAdultsToAssign > 0 && (
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            {t("guests.remainingAdults", {
              count: remainingAdultsToAssign,
            })}
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
            {t("guests.remainingChildren", {
              count: remainingChildrenToAssign,
            })}
          </Typography>
        )}
      </Typography>
    </Stack>
  );

  return (
    <Stack flex={1} minHeight={0}>
      <Stack
        alignItems={"center"}
        py={3}
        spacing={4}
        flex={1}
        minHeight={0}
        overflow="auto"
      >
        <Stack
          component="section"
          width="100%"
          flex={1}
          minHeight={0}
          spacing={4}
          alignItems="center"
        >
          <Typography variant="h4">{t("guests.title")}</Typography>

          <Grid container spacing={2} justifyContent={"center"}>
            {reservationState.rooms.map((room, index) => (
              <Grid key={index}>
                <RoomHostCard room={room} index={index} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Stack>

      <Box
        width="100%"
        flexShrink={0}
        bgcolor="action.hover"
        py={{ xs: 3, md: 4 }}
      >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            maxWidth={900}
            width="100%"
            mx="auto"
            gap={2}
            px={{ xs: 2, md: 3 }}
          >
            {shouldShowEmptyRoomsError && (
              <Typography
                variant="body2"
                color="error"
                textAlign="center"
                sx={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                {t("guests.emptyRoomsError")}
              </Typography>
            )}

            {hasRemainingGuests && remainingBedsToAssignTypography}

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
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
                disabled={!canProceed}
                onClick={increaseStep}
                sx={{ flex: 1, maxWidth: { xs: "100%" } }}
              >
                {t("common.continue")}
              </Button>
            </Stack>
          </Stack>
      </Box>
    </Stack>
  );
}

export function RoomHostCard({ room, index }) {
  const { t } = useTranslation("rezervace");
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
  const roomCapacity = room.capacity || 0;

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
          src={`${import.meta.env.BASE_URL}ubytovani/ubytovani1.webp`}
          alt="Room"
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            objectFit: "cover",
            display: "block",
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
                  text={t("common.bed")}
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
              <Typography variant="h6">{t("guests.title")}</Typography>
              <Typography variant="body2">{t("guests.assignHint")}</Typography>
            </Stack>

            <BedSelect
              title={t("common.adult")}
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
              title={t("common.child")}
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
            <Typography variant="body1">{t("common.totalPerNight")}</Typography>
            <Typography variant="h5" fontWeight={"bold"}>
              {t("common.priceCzk", { amount: pricePerNight })}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </AppCardCustomizable>
  );
}

function BedSelect({ title, price, onMinus, onPlus, value }) {
  const { t } = useTranslation("rezervace");
  return (
    <AppCardCustomizable borderRadius={1.5}>
      <Stack direction={"row"} justifyContent={"space-between"} p={1.5}>
        <Stack alignItems={"start"}>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body1" color="primary.main">
            {t("common.pricePerNight", { amount: price })}
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
