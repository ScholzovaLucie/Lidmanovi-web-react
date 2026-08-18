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
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              background: "#446783",
              alignItems: "center",
              justifyContent: { md: "space-between" },
              width: "100%",
              px: { xs: 2, sm: 3, md: 5 },
              py: { xs: 1, md: 1 },
              gap: { xs: 1, md: 0 },
            }}
          >
            {/* Levý element - jen vyvažuje tlačítko vpravo, aby byl stepper na desktopu na střed */}
            <Box
              sx={{
                order: 1,
                display: { xs: "none", md: "block" },
                flex: "1 1 0",
              }}
            />

            {/* Prostřední element */}
            <Box sx={{ order: { xs: 1, md: 2 }, width: { xs: "100%", md: "auto" }, overflowX: "auto" }}>
              <ReservationStepper />
            </Box>

            {/* Pravý element */}
            <Box
              sx={{
                order: { xs: 2, md: 3 },
                width: { xs: "100%", md: "auto" },
                flex: { xs: "0 0 auto", md: "1 1 0" },
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              <Button
                variant="contained"
                size="small"
                startIcon={<WysiwygIcon />}
                onClick={(event) => setInfoAnchor(event.currentTarget)}
                aria-haspopup="dialog"
                aria-expanded={Boolean(infoAnchor)}
                sx={{
                  bgcolor: "common.white",
                  color: "primary.dark",
                  whiteSpace: "nowrap",
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
