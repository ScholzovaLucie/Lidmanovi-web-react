import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

export default function RoomDeleteDialog({ open, onCancel, onConfirm }) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="span">
          Smazat pokoj
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Opravdu chcete smazat tento pokoj? Tato akce nelze vrátit zpět.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button onClick={onCancel}>Zrušit</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Smazat
        </Button>
      </DialogActions>
    </Dialog>
  );
}
