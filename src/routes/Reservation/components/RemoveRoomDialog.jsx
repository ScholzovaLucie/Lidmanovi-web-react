import { Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import AppModal from "../../../components/Modal";

export function RemoveRoomDialog({ open, onClose, onConfirm }) {
  const { t } = useTranslation("rezervace");

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <AppModal open={open} setOpen={onClose}>
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          {t("roomCardCompact.removeDialog.title")}
        </Typography>
        
        <Typography>
          {t("roomCardCompact.removeDialog.message")}
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={handleCancel} color="inherit">
            {t("roomCardCompact.removeDialog.cancel")}
          </Button>
          <Button onClick={handleConfirm} color="error" variant="contained">
            {t("roomCardCompact.removeDialog.confirm")}
          </Button>
        </Stack>
      </Stack>
    </AppModal>
  );
}