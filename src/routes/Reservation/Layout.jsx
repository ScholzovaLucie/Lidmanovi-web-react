import { AppBar, Box, Button, Divider, Popover, Stack, Typography } from "@mui/material";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import ReservationStepper from "./components/ReservationStepper";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Layout({ children }) {
  const { t } = useTranslation("rezervace");
  const [infoAnchor, setInfoAnchor] = useState(null);
  const values = useSelector((state) => state.reservation.values);
  const reservationInfoLabel = t("layout.reservationInfo", {
    defaultValue: "Přehled aktuální rezervace",
  });

  return (
    <>
      <Stack flex={1} minHeight={0}>
        <AppBar
          position="sticky"
          sx={{
            top: { xs: 64, md: 64 },
            zIndex: 1100,
            background: "#fffaf0",
            boxShadow: "none",
            borderBottom: "1px solid #dfd4c4",
          }}
        >
          <Box
            sx={{
              display: "grid",
              background: "#446783",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              width: "100%",
              px: 5,
              py: 1,
            }}
          >
            {/* Pravý element */}
            <Box sx={{ gridColumn: 3, justifySelf: "end" }}>
              <Button
                variant="contained"
                startIcon={<WysiwygIcon />}
                onClick={(event) => setInfoAnchor(event.currentTarget)}
                aria-haspopup="dialog"
                aria-expanded={Boolean(infoAnchor)}
                sx={{
                  bgcolor: "common.white",
                  color: "primary.dark",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.88)",
                  },
                }}
              >
                {reservationInfoLabel}
              </Button>
              <Popover
                open={Boolean(infoAnchor)}
                anchorEl={infoAnchor}
                onClose={() => setInfoAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{ paper: { sx: { mt: 1, width: { xs: 280, sm: 340 } } } }}
              >
                <Stack spacing={2} p={2.5}>
                  <Typography variant="h6" fontWeight={700}>
                    {reservationInfoLabel}
                  </Typography>
                  <Divider />
                  <Stack spacing={0.25}>
                    <Typography variant="caption" color="text.secondary">
                      {t("stepper.term")}
                    </Typography>
                    <Typography>
                      {dayjs(values.check_in_date).format("D.M.YYYY")} -{" "}
                      {dayjs(values.check_out_date).format("D.M.YYYY")}
                    </Typography>
                  </Stack>
                  <Stack spacing={0.25}>
                    <Typography variant="caption" color="text.secondary">
                      {t("stepper.guests")}
                    </Typography>
                    <Typography>
                      {t("layout.guestsSummary", {
                        adults: values.num_adults,
                        children: values.num_children,
                      })}
                    </Typography>
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      {t("layout.selectedRooms")}
                    </Typography>
                    {values.rooms.length > 0 ? (
                      values.rooms.map((room) => (
                        <Typography key={room.id}>{room.name}</Typography>
                      ))
                    ) : (
                      <Typography color="text.secondary">
                        {t("layout.noRoomSelected")}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Popover>
            </Box>

            {/* Prostřední element */}
            <Box sx={{ gridColumn: 2, gridRow: 1 }}>
              <ReservationStepper />
            </Box>
          </Box>
        </AppBar>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            minHeight: 0,
            bgcolor: "background.default",
          }}
        >
          {children}
        </Box>
      </Stack>
    </>
  );
}
