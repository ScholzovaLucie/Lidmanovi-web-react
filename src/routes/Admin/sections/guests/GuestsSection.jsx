import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  Stack,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { People, Search, Email, Phone } from "@mui/icons-material";
import CustomTable from "../../components/CustomMuiTable";
import { useGuestsQuery } from "../../../../redux/api/guestApi";
import { useLazyReservationsQuery } from "../../../../redux/api/reservationsApi";
import AppCard, {
  AppCardCustomizable,
} from "../../../../components/containers/AppCard";

function getReservationsCountFromGuestRow(row) {
  if (Array.isArray(row?.reservations)) return row.reservations.length;
  if (typeof row?.reservations === "number") return row.reservations;
  if (typeof row?.reservations === "string")
    return Number(row.reservations) || 0;
  if (typeof row?.reservations_count === "number")
    return row.reservations_count;
  if (typeof row?.reservations_count === "string")
    return Number(row.reservations_count) || 0;
  if (typeof row?.reservation_count === "number") return row.reservation_count;
  if (typeof row?.reservation_count === "string")
    return Number(row.reservation_count) || 0;
  if (typeof row?.num_reservations === "number") return row.num_reservations;
  if (typeof row?.num_reservations === "string")
    return Number(row.num_reservations) || 0;
  return 0;
}

export default function GuestsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reservationCountsByGuestId, setReservationCountsByGuestId] = useState(
    {},
  );
  const { data: guestsData, isLoading, error } = useGuestsQuery();
  const [fetchReservationsByGuest] = useLazyReservationsQuery();

  useEffect(() => {
    if (!Array.isArray(guestsData) || guestsData.length === 0) {
      setReservationCountsByGuestId({});
      return;
    }

    let cancelled = false;

    const loadCounts = async () => {
      const entries = await Promise.all(
        guestsData.map(async (guest) => {
          if (guest?.id == null) {
            return [guest?.id, getReservationsCountFromGuestRow(guest)];
          }

          try {
            const response = await fetchReservationsByGuest(
              { primary_guest_id: guest.id },
              true,
            ).unwrap();

            const list = Array.isArray(response)
              ? response
              : Array.isArray(response?.results)
                ? response.results
                : [];

            return [guest.id, list.length];
          } catch (e) {
            return [guest.id, getReservationsCountFromGuestRow(guest)];
          }
        }),
      );

      if (!cancelled) {
        const map = {};
        entries.forEach(([guestId, count]) => {
          if (guestId != null) {
            map[guestId] = count;
          }
        });
        setReservationCountsByGuestId(map);
      }
    };

    loadCounts();

    return () => {
      cancelled = true;
    };
  }, [fetchReservationsByGuest, guestsData]);

  const guestColumns = useMemo(
    () => [
      {
        key: "first_name",
        label: "Jméno",
        render: (row) => (
          <Typography fontWeight="600">{row.first_name}</Typography>
        ),
      },
      {
        key: "last_name",
        label: "Příjmení",
        render: (row) => (
          <Typography fontWeight="600">{row.last_name}</Typography>
        ),
      },
      {
        key: "email",
        label: "Email",
        render: (row) => (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Email sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2">{row.email}</Typography>
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
              <Typography variant="body2">{row.phone}</Typography>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          ),
      },
      {
        key: "reservations",
        label: "Rezervace",
        align: "center",
        render: (row) => {
          const calculatedCount =
            row.id != null ? reservationCountsByGuestId[row.id] : undefined;

          const fallbackCount = getReservationsCountFromGuestRow(row);
          const count =
            typeof calculatedCount === "number"
              ? calculatedCount
              : fallbackCount;

          return (
            <Typography variant="body2" color="text.secondary">
              {count}
            </Typography>
          );
        },
      },
    ],
    [reservationCountsByGuestId],
  );

  const filteredGuests = useMemo(() => {
    if (!guestsData || !searchTerm) return guestsData || [];

    const term = searchTerm.toLowerCase();
    return guestsData.filter(
      (guest) =>
        guest.first_name?.toLowerCase().includes(term) ||
        guest.last_name?.toLowerCase().includes(term) ||
        guest.email?.toLowerCase().includes(term) ||
        guest.phone?.includes(term),
    );
  }, [guestsData, searchTerm]);

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
    <Stack spacing={3} p={{sx: 1, md: 3}}>
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
        <Typography variant="h6" gutterBottom>
          Hosté
        </Typography>

        <TextField
          placeholder="Vyhledávání..."
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <AppCardCustomizable>
          <CustomTable
            columns={guestColumns}
            data={filteredGuests}
            getRowId={(row) => row.id}
          />
          {filteredGuests.length === 0 && searchTerm && (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                Žádný host nenalezen pro hledání "{searchTerm}"
              </Typography>
            </Box>
          )}
        </AppCardCustomizable>
      </Stack>
    </Stack>
  );
}
