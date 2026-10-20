import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import dayjs from "dayjs";
import {
  getColorForReservationStatus,
  getCzechTranslationForReservationStatus,
} from "../../../../../functions/common";
export default function ReservationDetail({
  selectedReservation,
  onClose,
}) {
  const isOpen = Boolean(selectedReservation);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle component="div" sx={{ py: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" fontWeight={600}>
            Detail rezervace
          </Typography>

            {selectedReservation && (
              <Chip
                label={getCzechTranslationForReservationStatus(
                  selectedReservation.status,
                )}
                size="small"
                sx={{
                  backgroundColor: getColorForReservationStatus(
                    selectedReservation.status,
                  ),
                  color: "#fff",
                  fontWeight: 600,
                }}
              />
            )}
          </Stack>

          <IconButton onClick={onClose} size="small" aria-label="Zavřít detail rezervace">
            <Close fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      {selectedReservation && (
        <DialogContent>
          <Stack spacing={1.5} alignItems="flex-start">
            <Typography>
              <strong>Číslo rezervace:</strong> {selectedReservation.number}
            </Typography>
            <Typography>
              <strong>Datum:</strong>{" "}
              {`${dayjs(selectedReservation.check_in_date).format("DD.MM.YYYY")} - ${dayjs(selectedReservation.check_out_date).format("DD.MM.YYYY")}`}
            </Typography>

            <Typography>
              <strong>Host:</strong>{" "}
              {`${selectedReservation.guest?.first_name} ${selectedReservation.guest?.last_name}`}
            </Typography>

            <Typography textAlign="left">
              <strong>Pokoje:</strong>{" "}
              {selectedReservation.rooms?.map((room) => room.name).join(", ")}
            </Typography>

            <Typography>
              <strong>Hosté:</strong> {selectedReservation.num_adults || 0} dospělí
              {", "}
              {selectedReservation.num_children || 0} děti
            </Typography>

            <Typography variant="body1" fontWeight="bold">
              Cena: {selectedReservation.price} Kč
            </Typography>
          </Stack>
        </DialogContent>
      )}
    </Dialog>
  );
}
