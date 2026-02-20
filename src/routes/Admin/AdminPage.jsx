import { useEffect, useMemo } from "react";
import { Box, Card, Chip, Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import CustomMuiCalendar from "./components/CustomMuiCalendar";
import CustomTable from "./components/CustomMuiTable";
import { useReservationsQuery } from "../../redux/api/reservationsApi";
import { useGuestsQuery } from "../../redux/api/guestApi";
import { HOST_COLUMNS, reservationColumns } from "./constants";

export default function AdminPage() {
  const { data: reservationsData, isLoading, error } = useReservationsQuery();
  const {
    data: guestsData,
    isLoading: isGuestsLoading,
    error: guestsError,
  } = useGuestsQuery();

  useEffect(() => {
    console.log(guestsData);
  }, [guestsData, isGuestsLoading, guestsError]);

  const calendarEventsFromApi = useMemo(() => {
    if (!reservationsData) return [];

    return reservationsData.map((reservation) => ({
      name: `${reservation.primary_guest.first_name}`,
      from: dayjs(reservation.check_in_date),
      to: dayjs(reservation.check_out_date),
      text: `clicked room`,
    }));
  }, [reservationsData]);

  if (isLoading || isGuestsLoading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 130px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Stack
      spacing={3}
      sx={{
        minHeight: "calc(100vh - 130px)",
        pt: 2,
        px: { xs: 1, md: 2 },
        pb: 4,
        background:
          "radial-gradient(circle at 12% 0%, rgba(176, 230, 218, 0.35), transparent 38%), radial-gradient(circle at 95% 4%, rgba(250, 227, 199, 0.35), transparent 32%), #f5f8fb",
      }}
    >
      {!isLoading && (
        <Card
          sx={{
            width: "100%",
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            boxShadow: "0 18px 45px rgba(29, 43, 61, 0.12)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.65)",
          }}
        >
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Manrope", "Poppins", sans-serif',
                fontWeight: 700,
                color: "#213547",
                letterSpacing: "0.01em",
              }}
            >
              Reservation Calendar
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={`${reservationsData.length} reservations`}
                color="primary"
              />
            </Stack>
          </Stack>
          <CustomMuiCalendar events={calendarEventsFromApi} />
        </Card>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" },
          gap: 2,
          alignItems: "start",
        }}
      >
        <Card
          sx={{
            p: { xs: 1.25, sm: 2 },
            borderRadius: 2,
            boxShadow: "0 12px 35px rgba(32, 50, 69, 0.08)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Manrope", "Poppins", sans-serif',
              fontWeight: 700,
              color: "#243244",
              mb: 1.5,
            }}
          >
            Hotel Hosts
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <CustomTable
            columns={HOST_COLUMNS}
            data={guestsData}
            getRowId={(row) => row.id}
          />
        </Card>

        <Card
          sx={{
            p: { xs: 1.25, sm: 2 },
            borderRadius: 2,
            boxShadow: "0 12px 35px rgba(32, 50, 69, 0.08)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Manrope", "Poppins", sans-serif',
              fontWeight: 700,
              color: "#243244",
              mb: 1.5,
            }}
          >
            Reservations
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <CustomTable
            columns={reservationColumns}
            data={reservationsData}
            getRowId={(row) => row.id}
          />
        </Card>
      </Box>
    </Stack>
  );
}
