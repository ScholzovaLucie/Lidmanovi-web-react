import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Clear, DeleteOutline, FilterListOff, Search } from "@mui/icons-material";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import CustomTable from "../../components/CustomMuiTable";
import { AppCardCustomizable } from "../../../../components/containers/AppCard";
import { usePagination } from "../../../../hooks/usePagination";
import { formFieldStyles } from "../reservations/constants";
import {
  useAdminVoucherAmountsQuery,
  useCreateVoucherAmountMutation,
  useDeleteVoucherAmountMutation,
  useLazyVoucherStatusesQuery,
  useUpdateVoucherAmountMutation,
  useUpdateVoucherStatusMutation,
  useVouchersQuery,
} from "../../../../redux/api/vouchersApi";

const voucherStatusLabels = {
  new: "Nová",
  confirmed: "Potvrzená",
  sent: "Odeslaná",
  cancelled: "Zrušená",
};

const voucherStatusColors = {
  new: "#ed6c02",
  confirmed: "#0288d1",
  sent: "#2e7d32",
  cancelled: "#d32f2f",
};

const formatDate = (value) => (value ? dayjs(value).format("DD. MM. YYYY HH:mm") : "—");

const getShippingAddress = (voucher) => {
  if (voucher.delivery_method !== "print") return "";

  const street = [voucher.shipping_street, voucher.shipping_house_number]
    .filter(Boolean)
    .join(" ");
  const city = [voucher.shipping_postal_code, voucher.shipping_city]
    .filter(Boolean)
    .join(" ");

  return [street, city, voucher.shipping_country].filter(Boolean).join("\n");
};

export default function VouchersSection() {
  const pagination = usePagination({
    initialPageSize: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deliveryMethodFilter, setDeliveryMethodFilter] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [amountValues, setAmountValues] = useState({});
  const [amountToDelete, setAmountToDelete] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    pagination.reset();
  }, [statusFilter, deliveryMethodFilter, debouncedSearchTerm]);

  const { data: vouchersData, isLoading, error } = useVouchersQuery({
    page: pagination.page,
    page_size: pagination.pageSize,
    status: statusFilter || undefined,
    delivery_method: deliveryMethodFilter || undefined,
    search_text: debouncedSearchTerm || undefined,
  });
  const [loadVoucherStatuses, { data: voucherStatuses = [] }] =
    useLazyVoucherStatusesQuery();
  const [updateVoucherStatus, { isLoading: isUpdatingStatus }] =
    useUpdateVoucherStatusMutation();
  const [updatingVoucherId, setUpdatingVoucherId] = useState(null);
  const { data: voucherAmounts = [], isLoading: areAmountsLoading } =
    useAdminVoucherAmountsQuery();
  const [createVoucherAmount, { isLoading: isCreatingAmount }] =
    useCreateVoucherAmountMutation();
  const [updateVoucherAmount, { isLoading: isUpdatingAmount }] =
    useUpdateVoucherAmountMutation();
  const [deleteVoucherAmount, { isLoading: isDeletingAmount }] =
    useDeleteVoucherAmountMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleStatusMenuOpen = () => {
    loadVoucherStatuses();
  };

  const handleStatusChange = async (voucher, status) => {
    if (status === voucher.status) return;

    setUpdatingVoucherId(voucher.id);
    try {
      await updateVoucherStatus({ id: voucher.id, status }).unwrap();
      enqueueSnackbar("Stav poukázky byl aktualizován.", { variant: "success" });
    } catch (requestError) {
      enqueueSnackbar(
        requestError?.data?.detail || "Nepodařilo se aktualizovat stav poukázky.",
        { variant: "error" },
      );
    } finally {
      setUpdatingVoucherId(null);
    }
  };

  const handleAmountChange = (id, value) => {
    setAmountValues((currentValues) => ({ ...currentValues, [id]: value }));
  };

  const handleAmountSave = async (amount) => {
    const value = amountValues[amount.id];

    if (value === undefined) return;

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      enqueueSnackbar("Zadejte platnou hodnotu poukázky.", { variant: "error" });
      setAmountValues((currentValues) => ({
        ...currentValues,
        [amount.id]: String(amount.value),
      }));
      return;
    }

    if (numericValue === Number(amount.value)) {
      setAmountValues((currentValues) => ({
        ...currentValues,
        [amount.id]: String(amount.value),
      }));
      return;
    }

    try {
      const updatedAmount = await updateVoucherAmount({
        id: amount.id,
        value,
        currency: amount.currency,
        is_active: amount.is_active,
        sort_order: amount.sort_order,
      }).unwrap();
      setAmountValues((currentValues) => ({
        ...currentValues,
        [amount.id]: String(updatedAmount.value),
      }));
      enqueueSnackbar("Hodnota poukázky byla upravena.", { variant: "success" });
    } catch (requestError) {
      setAmountValues((currentValues) => ({
        ...currentValues,
        [amount.id]: String(amount.value),
      }));
      enqueueSnackbar(
        requestError?.data?.detail || "Hodnotu poukázky se nepodařilo upravit.",
        { variant: "error" },
      );
    }
  };

  const handleCreateAmount = async (event) => {
    event.preventDefault();
    const numericValue = Number(newAmount);

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      enqueueSnackbar("Zadejte platnou hodnotu poukázky.", { variant: "error" });
      return;
    }

    try {
      await createVoucherAmount({ value: newAmount }).unwrap();
      setNewAmount("");
      enqueueSnackbar("Hodnota poukázky byla přidána.", { variant: "success" });
    } catch (requestError) {
      enqueueSnackbar(
        requestError?.data?.detail || "Hodnotu poukázky se nepodařilo přidat.",
        { variant: "error" },
      );
    }
  };

  const handleDeleteAmount = async () => {
    if (!amountToDelete) return;

    try {
      await deleteVoucherAmount(amountToDelete.id).unwrap();
      setAmountValues((currentValues) => {
        const remainingValues = { ...currentValues };
        delete remainingValues[amountToDelete.id];
        return remainingValues;
      });
      setAmountToDelete(null);
      enqueueSnackbar("Hodnota poukázky byla odstraněna.", { variant: "success" });
    } catch (requestError) {
      enqueueSnackbar(
        requestError?.data?.detail || "Hodnotu poukázky se nepodařilo odstranit.",
        { variant: "error" },
      );
    }
  };

  const hasActiveFilters = Boolean(
    searchTerm || statusFilter || deliveryMethodFilter,
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDeliveryMethodFilter("");
  };

  const vouchers = vouchersData?.results || [];
  const statusOptions =
    voucherStatuses.length > 0
      ? voucherStatuses.map((status) => ({
          ...status,
          label: voucherStatusLabels[status.value] || status.label,
        }))
      : Object.entries(voucherStatusLabels).map(([value, label]) => ({ value, label }));
  const columns = [
      {
        key: "number",
        label: "Číslo a vytvořeno",
        render: (row) => (
          <Stack spacing={0.25}>
            <Typography variant="body2" fontWeight="bold">
              {row.number}
            </Typography>
            <Typography variant="body2">
              {formatDate(row.created_at)}
            </Typography>
          </Stack>
        ),
      },
      {
        key: "status",
        label: "Stav",
        cellSx: { minWidth: 150 },
        render: (row) => {
          const statusColor = voucherStatusColors[row.status] || "#757575";

          return (
            <Stack spacing={0.5}>
              <Select
                value={row.status}
                onOpen={handleStatusMenuOpen}
                onChange={(event) => handleStatusChange(row, event.target.value)}
                disabled={isUpdatingStatus && updatingVoucherId === row.id}
                size="small"
                fullWidth
                renderValue={(value) => voucherStatusLabels[value] || value}
                sx={{
                  backgroundColor: `${statusColor}20`,
                  "& .MuiSelect-select": {
                    color: statusColor,
                    fontWeight: 600,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${statusColor}60`,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: statusColor,
                  },
                }}
              >
                {statusOptions.map((status) => {
                  const optionColor = voucherStatusColors[status.value] || "#757575";

                  return (
                    <MenuItem
                      key={status.value}
                      value={status.value}
                      sx={{
                        backgroundColor: `${optionColor}15`,
                        "&:hover": { backgroundColor: `${optionColor}25` },
                        "&.Mui-selected": { backgroundColor: `${optionColor}30` },
                        "&.Mui-selected:hover": { backgroundColor: `${optionColor}40` },
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: optionColor,
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2" fontWeight={600} color={optionColor}>
                        {voucherStatusLabels[status.value] || status.label}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Select>
              {row.status === "sent" && row.sent_at && (
                <Typography variant="body2">{formatDate(row.sent_at)}</Typography>
              )}
            </Stack>
          );
        },
      },
      {
        key: "guest",
        label: "Objednatel",
        render: (row) => (
          <Stack spacing={0.25}>
            <Typography variant="body2" fontWeight="bold">
              {`${row.guest?.first_name || ""} ${row.guest?.last_name || ""}`.trim() || "—"}
            </Typography>
            <Typography variant="body2">
              {row.guest?.email || "—"}
            </Typography>
            {row.guest?.phone && (
              <Typography variant="body2">
                {row.guest.phone}
              </Typography>
            )}
          </Stack>
        ),
      },
      {
        key: "amount",
        label: "Hodnota",
        align: "right",
        render: (row) => (
          <Typography variant="body2" fontWeight="bold">
            {`${row.amount} ${row.currency}`}
          </Typography>
        ),
      },
      {
        key: "delivery_method",
        label: "Doručení",
        render: (row) => (
          <Typography variant="body2">
            {row.delivery_method === "print" ? "Tištěná podoba" : "E-mail"}
          </Typography>
        ),
      },
      {
        key: "shipping_address",
        label: "Adresa",
        cellSx: { minWidth: 180 },
        render: (row) => (
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {getShippingAddress(row)}
          </Typography>
        ),
      },
      {
        key: "note",
        label: "Poznámka",
        cellSx: { minWidth: 180, maxWidth: 280 },
        render: (row) => (
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {row.note || "—"}
          </Typography>
        ),
      },
    ];
  const amountColumns = [
    {
      key: "value",
      label: "Hodnota",
      cellSx: { minWidth: 180 },
      render: (row) => (
        <TextField
          value={amountValues[row.id] ?? String(row.value)}
          onChange={(event) => handleAmountChange(row.id, event.target.value)}
          onBlur={() => handleAmountSave(row)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          type="number"
          size="small"
          disabled={isUpdatingAmount}
          slotProps={{
            htmlInput: { min: "0.01", step: "0.01" },
            input: {
              endAdornment: <InputAdornment position="end">{row.currency}</InputAdornment>,
            },
          }}
          aria-label={`Hodnota poukázky ${row.value} ${row.currency}`}
        />
      ),
    },
    {
      key: "actions",
      label: "Akce",
      align: "right",
      render: (row) => (
        <IconButton
          color="error"
          onClick={() => setAmountToDelete(row)}
          disabled={isDeletingAmount}
          aria-label={`Odstranit hodnotu ${row.value} ${row.currency}`}
        >
          <DeleteOutline />
        </IconButton>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="body1">Načítání poukázek...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="body1" color="error">
          Chyba při načítání poukázek.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={5} p={{ md: 3 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Poukázky
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Přehled vytvořených objednávek dárkových poukázek.
        </Typography>
      </Box>

      <Stack spacing={1}>
        <Typography variant="h5">Objednávky poukázek</Typography>
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
            placeholder="Vyhledejte číslo, jméno, e-mail, telefon nebo poznámku..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
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

          <FormControl sx={{ ...formFieldStyles, minWidth: 180 }}>
            <InputLabel>Stav</InputLabel>
            <Select
              value={statusFilter}
              label="Stav"
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {Object.entries(voucherStatusLabels).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ ...formFieldStyles, minWidth: 180 }}>
            <InputLabel>Doručení</InputLabel>
            <Select
              value={deliveryMethodFilter}
              label="Doručení"
              onChange={(event) => setDeliveryMethodFilter(event.target.value)}
            >
              <MenuItem value="email">E-mail</MenuItem>
              <MenuItem value="print">Tištěná podoba</MenuItem>
            </Select>
          </FormControl>

          {hasActiveFilters && (
            <IconButton
              onClick={handleResetFilters}
              sx={{
                color: "white",
                backgroundColor: "rgb(172,0,0)",
                borderRadius: 1,
                "&:hover": { backgroundColor: "rgb(200,0,0)", color: "white" },
              }}
              size="large"
              aria-label="Vymazat filtry"
            >
              <FilterListOff />
            </IconButton>
          )}
        </Box>
        <AppCardCustomizable>
          <CustomTable
            columns={columns}
            data={vouchers}
            getRowId={(row) => row.id}
            paginationConfig={{
              ...pagination,
              totalCount: vouchersData?.count || vouchers.length,
            }}
          />
        </AppCardCustomizable>
      </Stack>

      <Stack spacing={2}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Hodnoty poukázek
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cena se uloží po opuštění pole nebo stisknutí Enteru.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleCreateAmount}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
            <TextField
              label="Nová hodnota"
              value={newAmount}
              onChange={(event) => setNewAmount(event.target.value)}
              type="number"
              size="small"
              required
              slotProps={{
                htmlInput: { min: "0.01", step: "0.01" },
                input: { endAdornment: <InputAdornment position="end">CZK</InputAdornment> },
              }}
              sx={{ width: { xs: "100%", sm: 220 } }}
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={isCreatingAmount ? <CircularProgress size={16} color="inherit" /> : <Add />}
              disabled={isCreatingAmount}
            >
              Přidat hodnotu
            </Button>
          </Stack>
        </Box>

        <AppCardCustomizable>
          {areAmountsLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress aria-label="Načítání hodnot poukázek" />
            </Box>
          ) : (
            <CustomTable columns={amountColumns} data={voucherAmounts} getRowId={(row) => row.id} />
          )}
        </AppCardCustomizable>
      </Stack>

      <Dialog open={Boolean(amountToDelete)} onClose={() => setAmountToDelete(null)}>
        <DialogTitle>Odstranit hodnotu poukázky?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hodnota {amountToDelete?.value} {amountToDelete?.currency} nebude nadále dostupná pro nové poukázky.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAmountToDelete(null)}>Zrušit</Button>
          <Button onClick={handleDeleteAmount} color="error" variant="contained" disabled={isDeletingAmount}>
            Odstranit
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
