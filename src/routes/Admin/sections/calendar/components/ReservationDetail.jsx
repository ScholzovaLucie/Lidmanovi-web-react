import {
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import dayjs from "dayjs";
import { AppCardCustomizable } from "../../../../../components/containers/AppCard";
import {
  getColorForReservationStatus,
  getCzechTranslationForReservationStatus,
} from "../../../../../functions/common";
export default function ReservationDetail({
  selectedReservation,
  onCrossClick,
}) {
  return (
    <AppCardCustomizable props={{ minWidth: { xs: "100%", md: 350 } }}>
      <Box display="flex" justifyContent="space-between" py={2} px={3} pb={1}>
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <Typography variant="h6" fontWeight={600}>
            Detail rezervace
          </Typography>

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
        </Stack>

        <IconButton
          onClick={onCrossClick}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      <Stack spacing={1.5} p={3} py={2} alignItems={"flex-start"}>
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

        <Typography textAlign={"left"}>
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
    </AppCardCustomizable>
  );
}
