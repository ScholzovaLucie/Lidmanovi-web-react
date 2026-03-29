import { useMemo, useState } from "react";
import {
  Box,
  Card,
  Stack,
  Typography,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import { Close, FullscreenExit } from "@mui/icons-material";
import dayjs from "dayjs";
import { CalendarMonth } from "@mui/icons-material";
import CustomMuiCalendar from "../../components/CustomMuiCalendar";
import { useReservationsQuery } from "../../../../redux/api/reservationsApi";
import { AppCardCustomizable } from "../../../../components/containers/AppCard";
import ReservationDetail from "./components/ReservationDetail";
import { getColorForReservationStatus } from "../../../../functions/common";

export default function CalendarSection() {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const { data: reservationsData, isLoading } = useReservationsQuery();

  const calendarEventsFromApi = useMemo(() => {
    console.log(reservationsData);
    if (!reservationsData?.results) return [];

    return reservationsData.results.map((reservation) => ({
      id: reservation.id,
      name: `${reservation.primary_guest.first_name}`,
      number: reservation.number,
      label: `${reservation?.primary_guest.first_name} ${reservation?.primary_guest.last_name}`,
      status: reservation.status,
      color: getColorForReservationStatus(reservation.status),
      from: dayjs(reservation.check_in_date),
      to: dayjs(reservation.check_out_date),
      text: `${reservation.primary_guest.first_name} - ${reservation.rooms.map((r) => r.name).join(", ")}`,
      guest: reservation.primary_guest,
      rooms: reservation.rooms,
      num_adults: reservation.num_adults,
      num_children: reservation.num_children,
      check_in_date: reservation.check_in_date,
      check_out_date: reservation.check_out_date,
      price: reservation.price,
    }));
  }, [reservationsData]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="body1">Načítání kalendáře...</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={5} p={{ sx: 1, md: 3 }}>
      <Stack>
        <Typography variant="h4" gutterBottom>
          Kalendář rezervací
        </Typography>
        <Typography variant="body1">
          Zde můžete spravovat rezervace pro vaše hosty. Přidávejte, upravujte
          nebo odstraňujte rezervace, které se zobrazí v kalendáři nebo v
          profilu hosta.
        </Typography>
      </Stack>

      <Stack direction={{ md: "column", lg: "row" }} gap={2}>
        <AppCardCustomizable props={{ flex: 1 }}>
          <CustomMuiCalendar
            events={calendarEventsFromApi}
            onEventClick={(event) => setSelectedReservation(event)}
          />
        </AppCardCustomizable>

        {selectedReservation && (
          <Stack>
            <ReservationDetail
              selectedReservation={selectedReservation}
              onCrossClick={() => setSelectedReservation(null)}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
