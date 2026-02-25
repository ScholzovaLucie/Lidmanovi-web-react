import { useMemo } from 'react';
import { 
  Box, 
  Card, 
  Chip, 
  Stack, 
  Typography, 
  Grid,
  Paper
} from '@mui/material';
import dayjs from 'dayjs';
import { CalendarMonth, People, Hotel } from '@mui/icons-material';
import CustomMuiCalendar from '../../components/CustomMuiCalendar';
import { useReservationsQuery } from '../../../../redux/api/reservationsApi';

export default function CalendarSection() {
  const { data: reservationsData, isLoading } = useReservationsQuery();

  const calendarEventsFromApi = useMemo(() => {
    if (!reservationsData) return [];

    return reservationsData.map((reservation) => ({
      name: `${reservation.primary_guest.first_name}`,
      from: dayjs(reservation.check_in_date),
      to: dayjs(reservation.check_out_date),
      text: `${reservation.primary_guest.first_name} - ${reservation.rooms.map(r => r.name).join(', ')}`,
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
        <CustomMuiCalendar events={calendarEventsFromApi} />
      </Card>
    </Stack>
  );
}