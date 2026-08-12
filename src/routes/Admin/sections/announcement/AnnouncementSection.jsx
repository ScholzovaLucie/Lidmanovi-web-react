import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { AppCardCustomizable } from "../../../../components/containers/AppCard";
import { DatePicker } from "@mui/x-date-pickers";
import CustomTable from "../../components/CustomMuiTable";
import {
  useGetInfoBoxesQuery,
  useCreateInfoBoxMutation,
  useDeleteInfoBoxMutation,
} from "../../../../redux/api/announcementApi";
import { usePagination } from "../../../../hooks/usePagination";
import { formFieldStyles } from "../reservations/constants";
import { getApiErrorMessage } from "../../../../utils/apiError";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`language-tabpanel-${index}`}
      aria-labelledby={`language-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const languages = [
  { code: "cs", label: "Čeština" },
  { code: "en", label: "Angličtina" },
  { code: "pl", label: "Polština" },
  { code: "de", label: "Němčina" },
];

export default function AnnouncementSection() {
  // Formulář state
  const [titleI18n, setTitleI18n] = useState({ cs: "", en: "", pl: "", de: "" });
  const [activeTab, setActiveTab] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  // ✨ Pagination hook
  const pagination = usePagination({
    initialPageSize: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
  });

  // API hooks
  const {
    data: announcementsData,
    isLoading: announcementsLoading,
    error: announcementsError,
  } = useGetInfoBoxesQuery({
    page: pagination.page,
    page_size: pagination.pageSize,
  });

  const [createInfoBox, { isLoading: isCreating }] = useCreateInfoBoxMutation();
  const [deleteInfoBox, { isLoading: isDeleting }] = useDeleteInfoBoxMutation();

  const { enqueueSnackbar } = useSnackbar();

  // Handlers
  const handleSubmit = async () => {
    if (!titleI18n.cs?.trim() || !startDate || !endDate) {
      enqueueSnackbar("Vyplňte prosím všechna pole", {
        variant: "error",
        autoHideDuration: 5000,
      });
      return;
    }

    // Formulář má jen date pickery bez volby času - konec dne se doplňuje
    // automaticky. Bez toho by "stejný den na start i konec" (00:00 == 00:00)
    // padlo na backend validaci ends_at > starts_at.
    if (endDate.isBefore(startDate, "day")) {
      enqueueSnackbar("Konec zobrazení musí být později než začátek.", {
        variant: "error",
        autoHideDuration: 5000,
      });
      return;
    }

    try {
      await createInfoBox({
        title: titleI18n.cs,
        title_i18n: titleI18n,
        content_json: {},
        starts_at: startDate.startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        ends_at: endDate.endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
      }).unwrap();

      // Reset formuláře
      setTitleI18n({ cs: "", en: "", pl: "", de: "" });
      setStartDate(null);
      setEndDate(null);

      enqueueSnackbar("Oznámení bylo úspěšně vytvořeno", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (error) {
      console.error("Chyba při vytváření oznámení:", error);
      const nonFieldErrors = error?.data?.non_field_errors;
      const message =
        Array.isArray(nonFieldErrors) && nonFieldErrors.length > 0
          ? "Konec zobrazení musí být později než začátek."
          : getApiErrorMessage(error, "Chyba při vytváření oznámení");
      enqueueSnackbar(message, {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  };

  const handleDeleteClick = (announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!announcementToDelete) return;

    try {
      await deleteInfoBox(announcementToDelete.id).unwrap();
      setDeleteDialogOpen(false);
      setAnnouncementToDelete(null);

      enqueueSnackbar("Oznámení bylo úspěšně smazáno", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (error) {
      console.error("Chyba při mazání oznámení:", error);
      enqueueSnackbar("Chyba při mazání oznámení", {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAnnouncementToDelete(null);
  };

  // Sloupce tabulky s delete handlerem
  const announcementColumns = useMemo(
    () => [
      {
        key: "title",
        label: "Text oznámení",
        render: (row) => (
          <Typography
            sx={{
              maxWidth: 300,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {row.title}
          </Typography>
        ),
      },
      {
        key: "starts_at",
        label: "Aktivní od",
        render: (row) => (
          <Typography>
            {row.starts_at ? dayjs(row.starts_at).format("DD.MM.YYYY") : "-"}
          </Typography>
        ),
      },
      {
        key: "ends_at",
        label: "Aktivní do",
        render: (row) => (
          <Typography>
            {row.ends_at ? dayjs(row.ends_at).format("DD.MM.YYYY") : "-"}
          </Typography>
        ),
      },
      {
        key: "actions",
        label: "Akce",
        align: "center",
        render: (row) => (
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(row)}
            disabled={isDeleting}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        ),
      },
    ],
    [isDeleting],
  );

  const announcements = announcementsData?.results || [];

  if (announcementsLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="body1">Načítání oznámení...</Typography>
      </Box>
    );
  }

  if (announcementsError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="body1" color="error">
          Chyba při načítání oznámení
        </Typography>
      </Box>
    );
  }

  return (
    <Stack p={{ md: 3 }} spacing={5}>
      <Stack>
        <Typography variant="h4" gutterBottom>
          Oznámení
        </Typography>
        <Typography variant="body1">
          Zde můžete spravovat oznámení pro vaše hosty. Přidávejte, upravujte
          nebo odstraňujte důležitá sdělení, která se zobrazí při rezervaci nebo
          v profilu hosta.
        </Typography>
      </Stack>

      <Stack>
        <Typography variant="h5" gutterBottom>
          Nové oznámení
        </Typography>
        <AppCardCustomizable props={{ p: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                aria-label="language tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                {languages.map((lang, index) => (
                  <Tab
                    key={lang.code}
                    label={lang.label}
                    id={`language-tab-${index}`}
                    aria-controls={`language-tabpanel-${index}`}
                  />
                ))}
              </Tabs>
            </Box>

            {languages.map((lang, index) => (
              <TabPanel key={lang.code} value={activeTab} index={index}>
                <TextField
                  multiline
                  rows={5}
                  fullWidth
                  label={`Zpráva oznámení (${lang.label})`}
                  value={titleI18n[lang.code] || ""}
                  onChange={(e) =>
                    setTitleI18n({ ...titleI18n, [lang.code]: e.target.value })
                  }
                  required={lang.code === "cs"}
                  placeholder={lang.code !== "cs" ? "Překlad oznámení" : ""}
                  sx={formFieldStyles}
                />
              </TabPanel>
            ))}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
            >
              <DatePicker
                label="Od"
                sx={{ width: "100%" }}
                value={startDate}
                onChange={setStartDate}
              />
              <DatePicker
                label="Do"
                sx={{ width: "100%" }}
                value={endDate}
                onChange={setEndDate}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={isCreating}
              >
                {isCreating ? "Ukládám..." : "Uložit oznámení"}
              </Button>
            </Stack>
          </Stack>
        </AppCardCustomizable>
      </Stack>

      <Stack>
        <Typography variant="h5" gutterBottom>
          Aktivní oznámení
        </Typography>
        <AppCardCustomizable>
          <CustomTable
            columns={announcementColumns}
            data={announcements}
            getRowId={(row) => row.id}
            paginationConfig={{
              ...pagination,
              totalCount: announcementsData?.count || announcements.length,
            }}
          />
        </AppCardCustomizable>
      </Stack>

      {/* Potvrzovací dialog pro smazání */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="delete-dialog-title">Smazat oznámení</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description" sx={{ mb: 2 }}>
            Opravdu chcete trvale smazat toto oznámení? Tato akce je nevratná.
          </DialogContentText>

          {announcementToDelete && (
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "grey.50",
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Text oznámení:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  maxHeight: 100,
                  overflow: "auto",
                  wordBreak: "break-word",
                }}
              >
                {announcementToDelete.title}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Aktivní:{" "}
                {announcementToDelete.starts_at
                  ? dayjs(announcementToDelete.starts_at).format("DD.MM.YYYY")
                  : "-"}{" "}
                -{" "}
                {announcementToDelete.ends_at
                  ? dayjs(announcementToDelete.ends_at).format("DD.MM.YYYY")
                  : "-"}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Zrušit</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Mažu..." : "Smazat"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
