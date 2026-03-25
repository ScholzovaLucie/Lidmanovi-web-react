import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Search, Clear, FilterListOff, Email } from "@mui/icons-material";
import dayjs from "dayjs";
import CustomTable from "../../components/CustomMuiTable";
import {
  useReservationsQuery,
  useReservationStatusesQuery,
  useUpdateReservationStatusMutation,
  useUpdateReservationNoteMutation,
} from "../../../../redux/api/reservationsApi";
import { useRoomsQuery } from "../../../../redux/api/roomsApi";
import { STATUS_META } from "../../constants";
import { useSnackbar } from "notistack";
import { AppCardCustomizable } from "../../../../components/containers/AppCard";
import { DatePicker } from "@mui/x-date-pickers";
import { formFieldStyles } from "./constants";
import { usePagination } from "../../../../hooks/usePagination";

// Constants
const STATUS_COLORS = {
  primary: "#1976d2",
  success: "#2e7d32",
  error: "#d32f2f",
  warning: "#ed6c02",
  info: "#0288d1",
  default: "#757575",
};

export default function ReservationsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [reservationFrom, setReservationFrom] = useState(null);
  const [reservationTo, setReservationTo] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [draftStatuses, setDraftStatuses] = useState({});
  const [updatingReservationId, setUpdatingReservationId] = useState(null);
  const [reservationNotes, setReservationNotes] = useState({});
  const [updatingNoteId, setUpdatingNoteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const pagination = usePagination({
    initialPageSize: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    pagination.reset();
  }, [
    statusFilter,
    reservationFrom,
    reservationTo,
    selectedRoomId,
    debouncedSearchTerm,
  ]);

  const apiFilters = useMemo(
    () => ({
      page: pagination.page,
      page_size: pagination.pageSize,
      status: statusFilter !== "all" ? statusFilter : undefined,
      reservation_from: reservationFrom
        ? dayjs(reservationFrom).format("YYYY-MM-DD")
        : undefined,
      reservation_to: reservationTo
        ? dayjs(reservationTo).format("YYYY-MM-DD")
        : undefined,
      room_id: selectedRoomId || undefined,
      search_text: debouncedSearchTerm || undefined,
    }),
    [
      pagination.page,
      pagination.pageSize,
      reservationFrom,
      reservationTo,
      selectedRoomId,
      statusFilter,
      debouncedSearchTerm,
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
  const [updateReservationNote, { isLoading: isUpdatingNote }] =
    useUpdateReservationNoteMutation();

  useEffect(() => {
    if (reservationsData?.results) {
      const notes = {};
      reservationsData.results.forEach((reservation) => {
        notes[reservation.id] = reservation.note || "";
      });
      setReservationNotes(notes);
    }
  }, [reservationsData]);

  const roomOptions = useMemo(() => {
    const roomList = roomsData?.results || roomsData || [];
    return roomList
      .map((room) => ({
        value: String(room.id),
        label: room.name || `Pokoj ${room.id}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "cs"));
  }, [roomsData]);

  const statusOptions = useMemo(() => {
    if (Array.isArray(statusesData)) {
      return statusesData.map((status) => ({
        value: status.value,
        label: status.label,
      }));
    }
    return Object.entries(STATUS_META).map(([value, meta]) => ({
      value,
      label: meta.label,
    }));
  }, [statusesData]);

  const handleStatusChange = async (reservationId, nextStatus) => {
    if (
      !nextStatus ||
      nextStatus ===
        reservationsData?.results?.find((r) => r.id === reservationId)?.status
    )
      return;

    setDraftStatuses((prev) => ({ ...prev, [reservationId]: nextStatus }));
    setUpdatingReservationId(reservationId);

    try {
      await updateReservationStatus({
        id: reservationId,
        status: nextStatus,
      }).unwrap();
      enqueueSnackbar("Stav rezervace byl aktualizován.", {
        variant: "success",
      });
      setDraftStatuses((prev) => {
        const next = { ...prev };
        delete next[reservationId];
        return next;
      });
    } catch (e) {
      enqueueSnackbar(
        e?.data?.detail || "Nepodařilo se změnit stav rezervace.",
        { variant: "error" },
      );
    } finally {
      setUpdatingReservationId(null);
    }
  };

  const handleEmailAction = (email) => {
    if (email) window.open(`mailto:${email}`, "_blank");
  };

  const handleNoteChange = (reservationId, note) => {
    setReservationNotes((prev) => ({ ...prev, [reservationId]: note }));
  };

  const handleSaveNote = async (reservationId) => {
    const note = reservationNotes[reservationId] || "";
    const originalNote =
      reservationsData?.results?.find((r) => r.id === reservationId)?.note ||
      "";

    if (note === originalNote) return;

    setUpdatingNoteId(reservationId);

    try {
      await updateReservationNote({ id: reservationId, note }).unwrap();
      enqueueSnackbar("Poznámka byla aktualizována.", { variant: "success" });
    } catch (e) {
      enqueueSnackbar(
        e?.data?.detail || "Nepodařilo se aktualizovat poznámku.",
        { variant: "error" },
      );
    } finally {
      setUpdatingNoteId(null);
    }
  };

  const enhancedReservationColumns = useMemo(
    () => [
      {
        key: "status",
        label: "Stav",
        align: "center",
        render: (row) => {
          const selectedStatus = draftStatuses[row.id] ?? row.status;
          const statusMeta = STATUS_META[selectedStatus];
          const isUpdating =
            isUpdatingStatus && updatingReservationId === row.id;
          const statusColor =
            STATUS_COLORS[statusMeta?.color] || STATUS_COLORS.default;

          return (
            <Box sx={{ minWidth: 140 }}>
              <FormControl size="small" fullWidth>
                {isUpdating && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CircularProgress size={14} sx={{ mr: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      Ukládám...
                    </Typography>
                  </Box>
                )}
                <Select
                  value={selectedStatus || ""}
                  onChange={(e) => handleStatusChange(row.id, e.target.value)}
                  disabled={isUpdating}
                  sx={{
                    backgroundColor: statusColor + "20",
                    "& .MuiSelect-select": {
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: statusColor,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: statusColor + "60",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: statusColor,
                    },
                  }}
                >
                  {statusOptions.map((option) => {
                    const optionColor =
                      STATUS_COLORS[STATUS_META[option.value]?.color] ||
                      STATUS_COLORS.default;
                    return (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{
                          backgroundColor: optionColor + "15",
                          "&:hover": { backgroundColor: optionColor + "25" },
                          "&.Mui-selected": {
                            backgroundColor: optionColor + "30",
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor: optionColor + "40",
                          },
                          mb: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              backgroundColor: optionColor,
                              mr: 1,
                            }}
                          />
                          <Typography
                            sx={{ fontWeight: 600, color: optionColor }}
                          >
                            {option.label}
                          </Typography>
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          );
        },
      },
      {
        key: "number",
        label: "Číslo rezervace",
        render: (row) => (
          <Typography variant="body2" fontWeight="600" color="primary.main">
            {row.number || "—"}
          </Typography>
        ),
      },
      {
        key: "stay",
        label: "Pobyt",
        render: (row) => (
          <Box>
            <Typography variant="body2" fontWeight="500" color="text.primary">
              {dayjs(row.check_in_date).format("DD. MM")} -{" "}
              {dayjs(row.check_out_date).format("DD. MM. YYYY")}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="400"
            >
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
            <Typography variant="body2" fontWeight="500" color="text.primary">
              {row.primary_guest?.first_name} {row.primary_guest?.last_name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="400"
            >
              {row.primary_guest?.email}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="400"
              display="block"
            >
              {row.primary_guest?.phone}
            </Typography>
          </Box>
        ),
      },
      {
        key: "room",
        label: "Pokoj",
        render: (row) => (
          <Typography variant="body2" fontWeight="400" color="text.primary">
            {row.rooms?.map((room) => room.name).join(", ") || "—"}
          </Typography>
        ),
      },
      {
        key: "guests",
        label: "Hosté",
        align: "center",
        render: (row) => (
          <Box textAlign="center">
            <Typography variant="body2" fontWeight="500" color="text.primary">
              {(row.num_adults || 0) + (row.num_children || 0)}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="400"
            >
              {row.num_adults} dospělý
              {row.num_children ? `, ${row.num_children} dítě` : ""}
            </Typography>
          </Box>
        ),
      },
      {
        key: "price",
        label: "Cena",
        align: "right",
        render: (row) => (
          <Typography variant="body2" fontWeight="600" color="primary.main">
            {row.price} Kč
          </Typography>
        ),
      },
      {
        key: "note",
        label: "Poznámka",
        render: (row) => {
          const note = reservationNotes[row.id] ?? row.note ?? "";
          const isUpdating = isUpdatingNote && updatingNoteId === row.id;

          return (
            <Box sx={{ minWidth: 200 }}>
              <TextField
                value={note}
                onChange={(e) => handleNoteChange(row.id, e.target.value)}
                onBlur={() => handleSaveNote(row.id)}
                placeholder="Přidat poznámku..."
                size="small"
                fullWidth
                multiline
                maxRows={3}
                disabled={isUpdating}
                InputProps={{
                  endAdornment: isUpdating ? (
                    <InputAdornment position="end">
                      <CircularProgress size={16} />
                    </InputAdornment>
                  ) : null,
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: "0.875rem",
                    fontWeight: 400,
                  },
                }}
              />
            </Box>
          );
        },
      },
      {
        key: "actions",
        label: "Akce",
        align: "center",
        render: (row) => (
          <Box>
            <IconButton
              size="small"
              onClick={() => handleEmailAction(row.primary_guest?.email)}
              disabled={!row.primary_guest?.email}
              title="Poslat email"
              color="primary"
            >
              <Email fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [
      draftStatuses,
      isUpdatingStatus,
      isUpdatingNote,
      statusOptions,
      updatingReservationId,
      updatingNoteId,
      reservationNotes,
    ],
  );

  // Backend zpracovává filtrování, sorting, takže jen extrahujeme data
  const reservations = useMemo(() => {
    if (!reservationsData) return [];
    return reservationsData.results || reservationsData || [];
  }, [reservationsData]);

  const hasStructuredFilters =
    (statusFilter !== "all" && statusFilter !== null) ||
    Boolean(reservationFrom) ||
    Boolean(reservationTo) ||
    Boolean(selectedRoomId);

  const hasSearchFilter = Boolean(searchTerm);
  const hasActiveFilters = hasStructuredFilters || hasSearchFilter;

  const handleClearFilters = () => {
    setStatusFilter(null);
    setReservationFrom(null);
    setReservationTo(null);
    setSelectedRoomId("");
  };

  const handleResetFilters = () => {
    handleClearFilters();
    setSearchTerm("");
  };

  const stats = useMemo(() => {
    if (!reservationsData)
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        thisMonth: 0,
        totalRevenue: 0,
      };

    const reservations = reservationsData.results || reservationsData;
    if (!Array.isArray(reservations))
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        thisMonth: 0,
        totalRevenue: 0,
      };

    const pending = reservations.filter((r) =>
      ["new", "payment_pending"].includes(r.status),
    ).length;
    const confirmed = reservations.filter((r) =>
      ["confirmed", "payed"].includes(r.status),
    ).length;
    const thisMonth = reservations.filter(
      (r) =>
        dayjs(r.check_in_date).isSame(dayjs(), "month") ||
        dayjs(r.check_out_date).isSame(dayjs(), "month"),
    ).length;
    const totalRevenue = reservations.reduce(
      (sum, r) => sum + (parseFloat(r.price) || 0),
      0,
    );

    return {
      total: reservationsData.count || reservations.length,
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
    <Stack spacing={5} p={3}>
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
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
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
                    minWidth: 180,
                    flex: { xs: 1, md: 0 },
                  },
                  InputProps: {
                    endAdornment: reservationFrom ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setReservationFrom(null)}
                          sx={{ mr: 1 }}
                        >
                          <Clear sx={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
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
                    minWidth: 180,
                    flex: { xs: 1, md: 0 },
                  },
                  InputProps: {
                    endAdornment: reservationTo ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setReservationTo(null)}
                          sx={{ mr: 1 }}
                        >
                          <Clear sx={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                },
              }}
            />

            <FormControl
              sx={{ ...formFieldStyles, minWidth: 180, flex: { xs: 1, md: 0 } }}
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
              sx={{ ...formFieldStyles, minWidth: 180, flex: { xs: 1, md: 0 } }}
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

            {hasActiveFilters && (
              <IconButton
                onClick={handleResetFilters}
                sx={{
                  color: "white",
                  backgroundColor: "rgb(172,0,0)",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "rgb(200,0,0)",
                    color: "white",
                  },
                }}
                size="large"
              >
                <FilterListOff />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Table */}
        <AppCardCustomizable>
          <CustomTable
            columns={enhancedReservationColumns}
            data={reservations}
            getRowId={(row) => row.id}
            paginationConfig={{
              ...pagination,
              totalCount: reservationsData?.count || reservations.length,
            }}
          />
          {reservations.length === 0 && hasActiveFilters && (
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
