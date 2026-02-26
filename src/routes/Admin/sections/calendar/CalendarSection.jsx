import { useMemo, useState } from 'react';
import { 
  Box, 
  Card, 
  Stack, 
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { CalendarMonth } from '@mui/icons-material';
import CustomMuiCalendar from '../../components/CustomMuiCalendar';
import { useReservationsQuery } from '../../../../redux/api/reservationsApi';

export default function CalendarSection() {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const { data: reservationsData, isLoading } = useReservationsQuery();

  const calendarEventsFromApi = useMemo(() => {
    if (!reservationsData) return [];

    return reservationsData.map((reservation) => ({
      id: reservation.id,
      name: `${reservation.primary_guest.first_name}`,
      number: reservation.number,
      status: reservation.status,
      from: dayjs(reservation.check_in_date),
      to: dayjs(reservation.check_out_date),
      text: `${reservation.primary_guest.first_name} - ${reservation.rooms.map(r => r.name).join(', ')}`,
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="body1">Načítání kalendáře...</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <CalendarMonth color="primary" />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: 'text.primary',
              fontFamily: '"Manrope", "Poppins", sans-serif'
            }}
          >
            Kalendář rezervací
          </Typography>
        </Stack>
      </Box>

      {/* Kalendář */}
      <Card 
        sx={{ 
          p: 3,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Stack spacing={2}>
          <CustomMuiCalendar
            events={calendarEventsFromApi}
            onEventClick={(event) => setSelectedReservation(event)}
          />

          {selectedReservation && (
            <Card
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: "background.default",
              }}
            >
              <Stack spacing={0.8}>
                <Typography variant="h6">
                  Rezervace {selectedReservation.number || `#${selectedReservation.id}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dayjs(selectedReservation.check_in_date).format("DD. MM. YYYY")} -{" "}
                  {dayjs(selectedReservation.check_out_date).format("DD. MM. YYYY")}
                </Typography>
                <Typography variant="body2">
                  Host: {selectedReservation.guest?.first_name} {selectedReservation.guest?.last_name}
                </Typography>
                <Typography variant="body2">
                  Pokoje: {selectedReservation.rooms?.map((room) => room.name).join(", ")}
                </Typography>
                <Typography variant="body2">
                  Stav: {selectedReservation.status}
                </Typography>
                <Typography variant="body2">
                  Hosté: {selectedReservation.num_adults || 0} dospělí
                  {selectedReservation.num_children
                    ? `, ${selectedReservation.num_children} děti`
                    : ""}
                  {" "}(
                  {(selectedReservation.num_adults || 0) +
                    (selectedReservation.num_children || 0)}{" "}
                  celkem)
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  Cena: {selectedReservation.price} Kč
                </Typography>
              </Stack>
            </Card>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
