import { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { UploadFile, CheckCircle, Cancel, Error as ErrorIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useBulkImportReservationsMutation } from "../../../../../redux/api/reservationsApi";
import { getApiErrorMessage } from "../../../../../utils/apiError";

export default function ImportReservationsDialog({ open, onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);
  const [sheet, setSheet] = useState("");
  const [preview, setPreview] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const [bulkImportReservations, { isLoading }] =
    useBulkImportReservationsMutation();

  const resetState = () => {
    setFile(null);
    setPreview(null);
    setIsDragActive(false);
  };

  const handleClose = () => {
    if (isLoading) return;
    resetState();
    setSheet("");
    onClose();
  };

  const runDryRun = async (selectedFile) => {
    setFile(selectedFile);
    setPreview(null);
    try {
      const result = await bulkImportReservations({
        file: selectedFile,
        sheet: sheet || undefined,
        dryRun: true,
      }).unwrap();
      setPreview(result);
    } catch (err) {
      console.error("Chyba při validaci importu:", err);
      enqueueSnackbar(getApiErrorMessage(err, "Chyba při validaci souboru"), {
        variant: "error",
        autoHideDuration: 6000,
      });
      setFile(null);
    }
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";
    if (selectedFile) runDryRun(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) runDryRun(droppedFile);
  };

  const handleConfirmImport = async () => {
    try {
      const result = await bulkImportReservations({
        file,
        sheet: sheet || undefined,
        dryRun: false,
      }).unwrap();
      enqueueSnackbar(
        `Import dokončen: ${result.created?.length || 0} vytvořeno, ${result.skipped?.length || 0} přeskočeno`,
        { variant: "success", autoHideDuration: 5000 },
      );
      handleClose();
    } catch (err) {
      console.error("Chyba při importu rezervací:", err);
      enqueueSnackbar(getApiErrorMessage(err, "Chyba při importu rezervací"), {
        variant: "error",
        autoHideDuration: 6000,
      });
    }
  };

  const createdCount = preview?.created?.length || 0;
  const skippedCount = preview?.skipped?.length || 0;
  const rowErrorsCount = preview?.row_errors?.length || 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import rezervací z Excelu</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="Název listu (nepovinné)"
            placeholder="Pokud rezervace nejsou v prvním/aktivním listu"
            value={sheet}
            onChange={(e) => setSheet(e.target.value)}
            size="small"
            disabled={isLoading}
            fullWidth
          />

          {!file && (
            <Box
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
              sx={{
                border: "2px dashed",
                borderColor: isDragActive ? "primary.main" : "divider",
                borderRadius: 1,
                bgcolor: isDragActive ? "primary.50" : "transparent",
                py: 6,
                textAlign: "center",
                cursor: "pointer",
                transition: "border-color 120ms ease, background-color 120ms ease",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                hidden
                onChange={handleFileInputChange}
              />
              <UploadFile sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
              <Typography variant="body1">
                Přetáhni sem .xlsx soubor, nebo klikni pro výběr
              </Typography>
            </Box>
          )}

          {isLoading && !preview && (
            <Stack alignItems="center" spacing={1} py={4}>
              <CircularProgress size={28} />
              <Typography variant="body2" color="text.secondary">
                Validuji soubor...
              </Typography>
            </Stack>
          )}

          {preview && (
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Typography variant="body2" sx={{ color: "success.main", fontWeight: 600 }}>
                  {createdCount} k vytvoření
                </Typography>
                {skippedCount > 0 && (
                  <Typography variant="body2" sx={{ color: "error.main", fontWeight: 600 }}>
                    · {skippedCount} přeskočeno
                  </Typography>
                )}
                {rowErrorsCount > 0 && (
                  <Typography variant="body2" sx={{ color: "warning.main", fontWeight: 600 }}>
                    · {rowErrorsCount} chyb na řádcích
                  </Typography>
                )}
              </Stack>

              {createdCount > 0 && (
                <List dense sx={{ maxHeight: 160, overflowY: "auto" }}>
                  {preview.created.map((item) => (
                    <ListItem key={item.booking_reference} disableGutters>
                      <CheckCircle fontSize="small" color="success" sx={{ mr: 1 }} />
                      <ListItemText
                        primary={item.booking_reference}
                        secondary={`${item.number} · ${item.room_count} pokoj(e)`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {skippedCount > 0 && (
                <>
                  <Divider />
                  <List dense sx={{ maxHeight: 160, overflowY: "auto" }}>
                    {preview.skipped.map((item) => (
                      <ListItem key={item.booking_reference} disableGutters alignItems="flex-start">
                        <Cancel fontSize="small" color="error" sx={{ mr: 1, mt: 0.5 }} />
                        <ListItemText
                          primary={item.booking_reference}
                          secondary={item.errors?.join("; ")}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {rowErrorsCount > 0 && (
                <>
                  <Divider />
                  <List dense sx={{ maxHeight: 160, overflowY: "auto" }}>
                    {preview.row_errors.map((item, idx) => (
                      <ListItem key={`${item.row}-${idx}`} disableGutters alignItems="flex-start">
                        <ErrorIcon fontSize="small" color="warning" sx={{ mr: 1, mt: 0.5 }} />
                        <ListItemText primary={`Řádek ${item.row}`} secondary={item.message} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <Button size="small" onClick={resetState} disabled={isLoading}>
                Vybrat jiný soubor
              </Button>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Zrušit
        </Button>
        {preview && (
          <Button
            onClick={handleConfirmImport}
            variant="contained"
            disabled={isLoading || createdCount === 0}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Potvrdit import ({createdCount})
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
