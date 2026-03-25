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
import { Close } from "@mui/icons-material";
import dayjs from "dayjs";
import { CalendarMonth } from "@mui/icons-material";
import CustomMuiCalendar from "../../components/CustomMuiCalendar";
import { useReservationsQuery } from "../../../../redux/api/reservationsApi";
import { AppCardCustomizable } from "../../../../components/containers/AppCard";

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
      status: reservation.status,
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

      {selectedReservation && (
        <AppCardCustomizable>
          {/* Header with title and close button */}
          <Box display="flex" justifyContent="space-between" p={2} pb={1}>
            <Typography variant="h6" fontWeight={600}>
              Rezervace{" "}
              {selectedReservation.number || `#${selectedReservation.id}`}
            </Typography>
            <IconButton
              onClick={() => setSelectedReservation(null)}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>

          <Divider />

          {/* Content */}
          <Stack spacing={1.5} p={2} alignItems={"flex-start"}>
            <Typography variant="body1" fontWeight={500}>
              {dayjs(selectedReservation.check_in_date).format("DD. MM. YYYY")}{" "}
              -{" "}
              {dayjs(selectedReservation.check_out_date).format("DD. MM. YYYY")}
            </Typography>

            <Typography variant="body2">
              <strong>Host:</strong> {selectedReservation.guest?.first_name}{" "}
              {selectedReservation.guest?.last_name}
            </Typography>

            <Typography variant="body2">
              <strong>Pokoje:</strong>{" "}
              {selectedReservation.rooms?.map((room) => room.name).join(", ")}
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">
                <strong>Stav:</strong>
              </Typography>
              <Chip
                label={selectedReservation.status}
                size="small"
                variant="outlined"
              />
            </Box>

            <Typography variant="body2">
              <strong>Hosté:</strong> {selectedReservation.num_adults || 0}{" "}
              dospělí
              {selectedReservation.num_children
                ? `, ${selectedReservation.num_children} děti`
                : ""}
              {" · "}
              {(selectedReservation.num_adults || 0) +
                (selectedReservation.num_children || 0)}{" "}
              celkem
            </Typography>

            <Typography
              variant="body1"
              fontWeight={600}
              color="primary"
              sx={{ mt: 1 }}
            >
              Cena: {selectedReservation.price} Kč
            </Typography>
          </Stack>
        </AppCardCustomizable>
      )}

      <AppCardCustomizable>
        <CustomMuiCalendar
          events={calendarEventsFromApi}
          onEventClick={(event) => setSelectedReservation(event)}
        />
      </AppCardCustomizable>
    </Stack>
  );
}
