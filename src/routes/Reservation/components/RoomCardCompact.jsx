import { IconButton, Stack, Typography } from "@mui/material";
import { AppCardCustomizable } from "../../../components/containers/AppCard";
import { useDispatch } from "react-redux";
import { removeRoom } from "../../../redux/slices/reservation/reservationSlice";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
import { useTranslation } from "react-i18next";
import { useReservationContext } from "../context/ReservationContext";
import { RemoveRoomDialog } from "./RemoveRoomDialog";
import { useState } from "react";
import { roomsApi } from "../../../redux/api/roomsApi";

export function RoomCartCompactCard({ room }) {
  const { t } = useTranslation("rezervace");
  const dispatch = useDispatch();
  const { step, setStep } = useReservationContext();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  function handleRemoveClick() {
    if (step === 1) {
      // Na kroku 1 odeber rovnou bez dialogu
      dispatch(removeRoom(room.id));
    } else {
      // Na ostatních krocích zobraz potvrzovací dialog
      setShowRemoveDialog(true);
    }
  }

  function handleConfirmRemove() {
    dispatch(removeRoom(room.id));
    setStep(1);
  }

  return (
    <AppCardCustomizable>
      <img
        src="https://www.thespruce.com/thmb/Afg3IVBq0tV-7DHBME5woSNCZxQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/put-together-a-perfect-guest-room-1976987-hero-223e3e8f697e4b13b62ad4fe898d492d.jpg"
        alt="Room"
        style={{
          width: "100%",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        p={1.5}
      >
        <Stack spacing={0.5} minWidth={0} alignItems={"start"}>
          <Typography fontWeight="bold" lineHeight="20px">
            {room.name}
          </Typography>
          <Typography fontSize={13} color="text.secondary" lineHeight="16px">
            {t("roomCardCompact.adultPrice", { amount: room.price_for_adult })}
          </Typography>
          <Typography fontSize={13} color="text.secondary" lineHeight="16px">
            {t("roomCardCompact.childPrice", {
              amount: room.price_for_children,
            })}
          </Typography>
          <Typography fontSize={13} color="text.secondary" lineHeight="16px">
            {`${room.capacity} ${t("roomCard.beds")}`}
          </Typography>
        </Stack>

        <IconButton
          variant="filled"
          size="small"
          onClick={handleRemoveClick}
          color="error"
        >
          <DeleteIconOutline />
        </IconButton>
      </Stack>

      <RemoveRoomDialog
        open={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        onConfirm={handleConfirmRemove}
      />
    </AppCardCustomizable>
  );
}
