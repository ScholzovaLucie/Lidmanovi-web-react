import { useMemo, useState } from "react";
import {
  Box,
  Card,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Search, BookOnline } from "@mui/icons-material";
import dayjs from "dayjs";
import CustomTable from "../../components/CustomMuiTable";
import { useReservationsQuery } from "../../../../redux/api/reservationsApi";
import { reservationColumns, STATUS_META } from "../../constants";

const ENHANCED_RESERVATION_COLUMNS = [
  {
    key: "status",
    label: "Stav",
    align: "center",
    render: (row) => {
      const statusMeta = STATUS_META[row.status];
      return (
        <Chip
          label={statusMeta.label}
          color={statusMeta.color}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      );
    },
  },
  {
    key: "dates",
    label: "Datum pobytu",
    render: (row) => (
      <Box>
        <Typography variant="body2" fontWeight="600">
          {dayjs(row.check_in_date).format("DD. MM")} -{" "}
          {dayjs(row.check_out_date).format("DD. MM. YYYY")}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {dayjs(row.check_out_date).diff(dayjs(row.check_in_date), "day")} nocí
        </Typography>
      </Box>
    ),
  },
  {
    key: "guest",
    label: "Host",
    render: (row) => (
      <Box>
        <Typography variant="body2" fontWeight="600">
          {row.primary_guest.first_name} {row.primary_guest.last_name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.primary_guest.email}
        </Typography>
      </Box>
    ),
  },
  {
    key: "rooms",
    label: "Pokoje",
    render: (row) => (
      <Typography variant="body2" color="text.secondary">
        {row.rooms.map((room) => room.name).join(", ")}
      </Typography>
    ),
  },
  {
    key: "guests_count",
    label: "Počet hostů",
    align: "center",
    render: (row) => (
      <Box textAlign="center">
        <Typography variant="body2" fontWeight="600">
          {(row.num_adults || 0) + (row.num_children || 0)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.num_adults} Dospělý{row.num_children ? `, ${row.num_children} Dítě` : ""}
        </Typography>
      </Box>
    ),
  },
  {
    key: "price",
    label: "Cena",
    align: "right",
    render: (row) => (
      <Typography variant="body2" fontWeight="700" color="primary.main">
        {row.price} Kč
      </Typography>
    ),
  },
  {
    key: "actions",
    label: "Akce",
    align: "center",
    render: (row) => (
      <Button size="small" variant="contained" color="primary">
        Upravit
      </Button>
    ),
  },
];

export default function ReservationsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: reservationsData, isLoading, error } = useReservationsQuery();

  const filteredReservations = useMemo(() => {
    if (!reservationsData) return [];

    let filtered = reservationsData;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (reservation) => reservation.status === statusFilter,
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (reservation) =>
          reservation.primary_guest.first_name?.toLowerCase().includes(term) ||
          reservation.primary_guest.last_name?.toLowerCase().includes(term) ||
          reservation.primary_guest.email?.toLowerCase().includes(term) ||
          reservation.rooms.some((room) =>
            room.name?.toLowerCase().includes(term),
          ),
      );
    }

    return [...filtered].sort((a, b) =>
      dayjs(b.check_in_date).diff(dayjs(a.check_in_date)),
    );
  }, [reservationsData, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    if (!reservationsData) {
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        thisMonth: 0,
        totalRevenue: 0,
      };
    }

    const pending = reservationsData.filter((r) =>
      ["new", "payment_pending"].includes(r.status),
    ).length;
    const confirmed = reservationsData.filter((r) =>
      ["confirmed", "payed"].includes(r.status),
    ).length;
    const thisMonth = reservationsData.filter(
      (r) =>
        dayjs(r.check_in_date).isSame(dayjs(), "month") ||
        dayjs(r.check_out_date).isSame(dayjs(), "month"),
    ).length;
    const totalRevenue = reservationsData.reduce(
      (sum, r) => sum + (parseFloat(r.price) || 0),
      0,
    );

    return {
      total: reservationsData.length,
      pending,
      confirmed,
      thisMonth,
      totalRevenue,
    };
  }, [reservationsData]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="body1">Načítání rezervací...</Typography>
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
          Chyba při načítání rezervací
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header s statistikami */}
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <BookOnline color="primary" />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontFamily: '"Manrope", "Poppins", sans-serif',
              }}
            >
              Správa rezervací
            </Typography>
          </Stack>

        </Stack>
      </Box>

      {/* Seznam rezervací */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Filtrace a vyhledávání */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  fontFamily: '"Manrope", "Poppins", sans-serif',
                }}
              >
                Seznam rezervací
              </Typography>

              <Stack direction="row" spacing={2}>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Stav</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Stav"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">Všechny stavy</MenuItem>
                    {Object.entries(STATUS_META).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  placeholder="Hledat rezervaci..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  sx={{ width: 300 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Stack>

            <Box
              sx={{
                bgcolor: "background.default",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <CustomTable
                columns={ENHANCED_RESERVATION_COLUMNS}
                data={filteredReservations}
                getRowId={(row) => row.id}
                sx={{ bgcolor: "background.paper" }}
              />
            </Box>

            {filteredReservations.length === 0 &&
              (searchTerm || statusFilter !== "all") && (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    Žádná rezervace nenalezena pro zadané filtry
                  </Typography>
                </Box>
              )}
          </Stack>
        </Box>
      </Card>
    </Stack>
  );
}
