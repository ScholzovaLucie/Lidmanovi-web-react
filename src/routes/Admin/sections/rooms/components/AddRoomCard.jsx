import { Paper, Stack, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

export default function AddRoomCard({ onClick }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: { xs: "100%", sm: 370 },
        height: 645,
        borderStyle: "dashed",
        borderRadius: 1,
        cursor: "pointer",
        color: "text.secondary",
        transition: "border-color 0.2s, color 0.2s",
        "&:hover": {
          borderColor: "primary.main",
          color: "primary.main",
        },
      }}
    >
      <Add sx={{ fontSize: 48, mb: 1 }} />
      <Typography variant="body1">Přidat pokoj</Typography>
    </Stack>
  );
}
