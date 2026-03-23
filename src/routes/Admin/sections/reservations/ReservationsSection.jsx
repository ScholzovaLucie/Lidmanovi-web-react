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
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Search, BookOnline, Clear, FilterListOff } from "@mui/icons-material";
import dayjs from "dayjs";
import CustomTable from "../../components/CustomMuiTable";
import {
  useReservationsQuery,
  useReservationStatusesQuery,
  useUpdateReservationStatusMutation,
} from "../../../../redux/api/reservationsApi";
import { useRoomsQuery } from "../../../../redux/api/roomsApi";
import { STATUS_META } from "../../constants";
import { useSnackbar } from "notistack";
import { AppCardCustomizable } from "../../../../components/containers/AppCard";
import { DatePicker } from "@mui/x-date-pickers";
import { formFieldStyles } from "./constants";

function normalizeStatusOptions(statusesData) {
  if (!statusesData) return [];

  if (Array.isArray(statusesData)) {
    return statusesData
      .map((item) => {
        if (typeof item === "string") {
          return {
            value: item,
            label: STATUS_META[item]?.label || item,
          };
        }

        if (item && typeof item === "object") {
          const value = item.value ?? item.status ?? item.key ?? item.id;
          if (!value) return null;

          return {
            value,
            label:
              item.label ?? item.name ?? STATUS_META[value]?.label ?? value,
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  if (typeof statusesData === "object") {
    return Object.entries(statusesData).map(([value, label]) => ({
      value,
      label: label || STATUS_META[value]?.label || value,
    }));
  }

  return [];
}

export default function ReservationsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [reservationFrom, setReservationFrom] = useState(null);
  const [reservationTo, setReservationTo] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [primaryGuestEmail, setPrimaryGuestEmail] = useState("");
  const [primaryGuestLastName, setPrimaryGuestLastName] = useState("");
  const [draftStatuses, setDraftStatuses] = useState({});
  const [updatingReservationId, setUpdatingReservationId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const apiFilters = useMemo(
    () => ({
      status: statusFilter !== "all" ? statusFilter : undefined,
      reservation_from: reservationFrom || undefined,
      reservation_to: reservationTo || undefined,
      room_id: selectedRoomId || undefined,
      primary_guest_email: primaryGuestEmail || undefined,
      primary_guest_last_name: primaryGuestLastName || undefined,
    }),
    [
      primaryGuestEmail,
      primaryGuestLastName,
      reservationFrom,
      reservationTo,
      selectedRoomId,
      statusFilter,
    ],
  );

  const {
    data: reservationsData,
    isLoading,
    error,
  } = useReservationsQuery(apiFilters);
  const { data: statusesData } = useReservationStatusesQuery();
  const { data: roomsData } = useRoomsQuery();
  const [updateReservationStatus, { isLoading: isUpdatingStatus }] =
    useUpdateReservationStatusMutation();

  const roomOptions = useMemo(() => {
    const roomList = Array.isArray(roomsData)
      ? roomsData
      : Array.isArray(roomsData?.rooms)
        ? roomsData.rooms
        : [];

    return roomList
      .map((room) => ({
        value: String(room.id),
        label: room.title || room.name || `Pokoj ${room.id}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "cs"));
  }, [roomsData]);

  const statusOptions = useMemo(() => {
    const normalized = normalizeStatusOptions(statusesData);
    if (normalized.length > 0) return normalized;

    return Object.entries(STATUS_META).map(([value, meta]) => ({
      value,
      label: meta.label,
    }));
  }, [statusesData]);

  const handleDraftStatusChange = (reservationId, nextStatus) => {
    setDraftStatuses((prev) => ({
      ...prev,
      [reservationId]: nextStatus,
    }));
  };

  const handleUpdateStatus = async (reservationId, nextStatus) => {
    if (!nextStatus) return;
    setUpdatingReservationId(reservationId);

    try {
      await updateReservationStatus({
        id: reservationId,
        status: nextStatus,
      }).unwrap();
      enqueueSnackbar("Stav rezervace byl aktualizován.", {
        variant: "success",
        autoHideDuration: 3000,
      });
      setDraftStatuses((prev) => {
        const next = { ...prev };
        delete next[reservationId];
        return next;
      });
    } catch (e) {
      enqueueSnackbar(
        e?.data?.detail || "Nepodařilo se změnit stav rezervace.",
        {
          variant: "error",
          autoHideDuration: 5000,
        },
      );
    } finally {
      setUpdatingReservationId(null);
    }
  };

  const enhancedReservationColumns = useMemo(
    () => [
      {
        key: "status",
        label: "Stav",
        align: "center",
        render: (row) => {
          const statusMeta = STATUS_META[row.status];
          return (
            <Chip
              label={statusMeta?.label || row.status}
              color={statusMeta?.color || "default"}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          );
        },
      },
      {
        key: "number",
        label: "Číslo rezervace",
        render: (row) => (
          <Typography variant="body2" fontWeight="700">
            {row.number || "—"}
          </Typography>
        ),
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
              {dayjs(row.check_out_date).diff(dayjs(row.check_in_date), "day")}{" "}
              nocí
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
              {row.num_adults} Dospělý
              {row.num_children ? `, ${row.num_children} Dítě` : ""}
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
        render: (row) => {
          const selectedStatus = draftStatuses[row.id] ?? row.status;
          const isUnchanged = selectedStatus === row.status;
          const isUpdatingThisRow =
            isUpdatingStatus && updatingReservationId === row.id;

          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={selectedStatus || ""}
                  onChange={(e) =>
                    handleDraftStatusChange(row.id, e.target.value)
                  }
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                size="small"
                variant="contained"
                color="primary"
                disabled={isUnchanged || isUpdatingThisRow}
                onClick={() => handleUpdateStatus(row.id, selectedStatus)}
                startIcon={
                  isUpdatingThisRow ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : null
                }
              >
                Uložit
              </Button>
            </Stack>
          );
        },
      },
    ],
    [draftStatuses, isUpdatingStatus, statusOptions, updatingReservationId],
  );

  const filteredReservations = useMemo(() => {
    if (!reservationsData) return [];

    let filtered = reservationsData;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (reservation) =>
          String(reservation.number ?? "")
            .toLowerCase()
            .includes(term) ||
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
  }, [reservationsData, searchTerm]);

  const hasActiveFilters =
    (statusFilter !== "all" && statusFilter !== null) ||
    Boolean(reservationFrom) ||
    Boolean(reservationTo) ||
    Boolean(selectedRoomId) ||
    Boolean(primaryGuestEmail) ||
    Boolean(primaryGuestLastName) ||
    Boolean(searchTerm);

  const hasStructuredFilters =
    (statusFilter !== "all" && statusFilter !== null) ||
    Boolean(reservationFrom) ||
    Boolean(reservationTo) ||
    Boolean(selectedRoomId) ||
    Boolean(primaryGuestEmail) ||
    Boolean(primaryGuestLastName);
  const hasSearchFilter = Boolean(searchTerm);

  const handleClearFilters = () => {
    setStatusFilter(null);
    setReservationFrom(null);
    setReservationTo(null);
    setSelectedRoomId("");
    setPrimaryGuestEmail("");
    setPrimaryGuestLastName("");
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleResetFilters = () => {
    handleClearFilters();
    handleClearSearch();
  };

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
    <Stack spacing={5}>
      {/* Header */}
      <Box>
        <Typography variant="h4" gutterBottom>
          Správa rezervací
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Spravujte rezervace, stavy a vyhledávejte podle různých kritérií.
        </Typography>
      </Box>

      <Stack spacing={1}>
        <Typography variant="h5">Rezervace</Typography>

        {/* Filters and Search */}
        <Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "stretch", md: "center" },
            }}
          >
            <TextField
              placeholder="Vyhledejte podle čísla, jména, emailu nebo pokoje..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              sx={{
                ...formFieldStyles,
                flex: { xs: 1, md: 1 },
                minWidth: { xs: "100%", md: 300 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <DatePicker
              label="Od"
              value={reservationFrom}
              onChange={setReservationFrom}
              slotProps={{
                textField: {
                  variant: "outlined",
                  sx: {
                    ...formFieldStyles,
                    minWidth: 140,
                    flex: { xs: 1, md: 0 },
                  },
                },
              }}
            />

            <DatePicker
              label="Do"
              value={reservationTo}
              onChange={setReservationTo}
              slotProps={{
                textField: {
                  variant: "outlined",
                  sx: {
                    ...formFieldStyles,
                    minWidth: 140,
                    flex: { xs: 1, md: 0 },
                  },
                },
              }}
            />

            <FormControl
              sx={{ ...formFieldStyles, minWidth: 120, flex: { xs: 1, md: 0 } }}
            >
              <InputLabel>Stav</InputLabel>
              <Select
                value={statusFilter || ""}
                label="Stav"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ minHeight: 56 }}
                IconComponent={
                  statusFilter && statusFilter !== "all"
                    ? () => null
                    : undefined
                }
                endAdornment={
                  statusFilter && statusFilter !== "all" ? (
                    <InputAdornment
                      position="end"
                      sx={{
                        position: "absolute",
                        right: 8,
                        pointerEvents: "auto",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusFilter(null);
                        }}
                      >
                        <Clear sx={{ fontSize: 18 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              sx={{ ...formFieldStyles, minWidth: 120, flex: { xs: 1, md: 0 } }}
            >
              <InputLabel>Pokoj</InputLabel>
              <Select
                value={selectedRoomId}
                label="Pokoj"
                onChange={(e) => setSelectedRoomId(e.target.value)}
                sx={{ minHeight: 56 }}
                IconComponent={selectedRoomId ? () => null : undefined}
                endAdornment={
                  selectedRoomId ? (
                    <InputAdornment
                      position="end"
                      sx={{
                        position: "absolute",
                        right: 8,
                        pointerEvents: "auto",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoomId("");
                        }}
                      >
                        <Clear sx={{ fontSize: 18 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              >
                {roomOptions.map((room) => (
                  <MenuItem key={room.value} value={room.value}>
                    {room.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {hasStructuredFilters && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<FilterListOff />}
                  onClick={handleClearFilters}
                >
                  Vymazat filtry
                </Button>
              )}
              {hasSearchFilter && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleClearSearch}
                >
                  Vymazat hledání
                </Button>
              )}
              <Button
                size="small"
                variant="text"
                onClick={handleResetFilters}
                sx={{ color: "text.secondary" }}
              >
                Vymazat vše
              </Button>
            </Box>
          )}
        </Box>

        {/* Table */}
        <AppCardCustomizable>
          <CustomTable
            columns={enhancedReservationColumns}
            data={filteredReservations}
            getRowId={(row) => row.id}
          />
          {filteredReservations.length === 0 && hasActiveFilters && (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary" gutterBottom>
                Žádná rezervace nenalezena
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={handleResetFilters}
                startIcon={<Clear />}
              >
                Vymazat filtry
              </Button>
            </Box>
          )}
        </AppCardCustomizable>
      </Stack>
    </Stack>
  );
}
