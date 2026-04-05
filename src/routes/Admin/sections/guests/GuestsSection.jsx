import { useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Search, Email, Phone, Clear } from "@mui/icons-material";
import CustomTable from "../../components/CustomMuiTable";
import { useGuestsQuery } from "../../../../redux/api/guestApi";
import { useReservationsQuery } from "../../../../redux/api/reservationsApi";
import { AppCardCustomizable } from "../../../../components/containers/AppCard";
import { formFieldStyles } from "../reservations/constants";
import { usePagination } from "../../../../hooks/usePagination";

export default function GuestsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const pagination = usePagination({
    initialPageSize: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
  });
  const {
    data: guestsData,
    isLoading: guestsLoading,
    error: guestsError,
  } = useGuestsQuery({
    page: pagination.page,
    page_size: pagination.pageSize,
    queryString: searchTerm,
  });
  const { data: reservationsData, isLoading: reservationsLoading } =
    useReservationsQuery();

  // Spočítáme rezervace pro každého hosta z rezervačních dat
  const reservationCountsByGuestId = useMemo(() => {
    if (!reservationsData?.results) return {};

    const counts = {};
    reservationsData.results.forEach((reservation) => {
      const guestId = reservation.primary_guest?.id;
      if (guestId) {
        counts[guestId] = (counts[guestId] || 0) + 1;
      }
    });
    return counts;
  }, [reservationsData]);

  const isLoading = guestsLoading || reservationsLoading;
  const error = guestsError;

  const guestColumns = useMemo(
    () => [
      {
        key: "first_name",
        label: "Jméno",
        render: (row) => <Typography>{row.first_name}</Typography>,
      },
      {
        key: "last_name",
        label: "Příjmení",
        render: (row) => <Typography>{row.last_name}</Typography>,
      },
      {
        key: "email",
        label: "Email",
        render: (row) => (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Email sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography>{row.email}</Typography>
          </Stack>
        ),
      },
      {
        key: "phone",
        label: "Telefon",
        render: (row) =>
          row.phone ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography>{row.phone}</Typography>
            </Stack>
          ) : (
            <Typography>—</Typography>
          ),
      },
      {
        key: "reservations",
        label: "Rezervace",
        align: "center",
        render: (row) => {
          const count = reservationCountsByGuestId[row.id] || 0;
          return <Typography>{count}</Typography>;
        },
      },
    ],
    [reservationCountsByGuestId],
  );

  const guests = guestsData?.results || [];

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="body1">Načítání hostů...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="body1" color="error">
          Chyba při načítání hostů
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={5} p={{ md: 3 }}>
      <Stack>
        <Typography variant="h4" gutterBottom>
          Správa hostů
        </Typography>
        <Typography variant="body1">
          Zde můžete spravovat své hosty. Vyhledávejte je, prohlížejte jejich
          informace, můžete také vidět, kolik rezervací každý host má, a získat
          přehled o jejich aktivitě.
        </Typography>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="h5" gutterBottom>
          Hosté
        </Typography>

        <TextField
          placeholder="Vyhledejte podle jména, příjmení, emailu nebo telefonu..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            pagination.setPage(0);
          }}
          variant="outlined"
          fullWidth
          sx={formFieldStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchTerm("");
                    pagination.setPage(0);
                  }}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <AppCardCustomizable>
          {/* ✨ Dramaticky jednodušší API! */}
          <CustomTable
            columns={guestColumns}
            data={guests}
            getRowId={(row) => row.id}
            paginationConfig={{
              ...pagination,
              totalCount: guestsData?.count || 0,
            }}
          />
        </AppCardCustomizable>
      </Stack>
    </Stack>
  );
}
