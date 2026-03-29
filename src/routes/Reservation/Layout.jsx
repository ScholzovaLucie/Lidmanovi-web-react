import { AppBar, Box, Divider, Drawer, Stack, Typography } from "@mui/material";
import { useReservationContext } from "./context/ReservationContext";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RoomCartCompactCard } from "./components/RoomCardCompact";
import dayjs from "dayjs";
import ReservationStepper from "./components/ReservationStepper";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import { useTranslation } from "react-i18next";
import Cart from "./components/Cart";

export default function Layout({ children }) {
  const { t } = useTranslation("rezervace");
  const { step, increaseStep, decreaseStep, setStep } = useReservationContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const values = useSelector((state) => state.reservation.values);

  return (
    <>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Cart />
      </Drawer>

      <Stack sx={{ minHeight: "100%" }} flex={1}>
        <AppBar
          position="sticky"
          sx={{
            top: { xs: 79, md: 64 },
            zIndex: 1100,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,248,251,0.92))",
            boxShadow: "0 10px 30px rgba(25,33,43,0.08)",
            borderBottom: "1px solid rgba(85,116,143,0.12)",
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(55,75,95,0.95)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Left: date + guests */}
            <Stack
              direction="row"
              spacing={{ xs: 1.5, md: 2.5 }}
              alignItems="center"
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarTodayIcon
                  sx={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 500,
                    letterSpacing: 0.2,
                  }}
                >
                  {dayjs(values.check_in_date).format("D.M")} –{" "}
                  {dayjs(values.check_out_date).format("D.M.YYYY")}
                </Typography>
              </Stack>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: "rgba(255,255,255,0.15)", my: 0.5 }}
              />

              <Stack direction="row" spacing={0.5} alignItems="center">
                <PeopleIcon
                  sx={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 500,
                    letterSpacing: 0.2,
                  }}
                >
                  {t("layout.guestsSummary", {
                    adults: values.num_adults,
                    children: values.num_children,
                  })}
                </Typography>
              </Stack>
            </Stack>

            {/* Right: cart */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.6}
              onClick={() => setDrawerOpen(true)}
              sx={{
                cursor: "pointer",
                bgcolor:
                  values.rooms.length > 0
                    ? "warning.main"
                    : "rgba(255,255,255,0.12)",
                borderRadius: 999,
                px: 1.25,
                py: 0.45,
                transition: "background-color 0.2s, transform 0.15s",
                "&:hover": {
                  bgcolor:
                    values.rooms.length > 0
                      ? "warning.dark"
                      : "rgba(255,255,255,0.2)",
                  transform: "scale(1.04)",
                },
              }}
            >
              <BedroomParentIcon sx={{ fontSize: 18, color: "common.white" }} />
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "common.white",
                  lineHeight: 1,
                }}
              >
                {values.rooms.length}
              </Typography>
            </Stack>
          </Box>

          {/* Stepper */}
          <Box
            sx={{
              py: 1.5,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ReservationStepper
              sx={{ maxWidth: { xs: "100%", md: 520 }, width: "100%" }}
            />
          </Box>
        </AppBar>
        {children}
      </Stack>
    </>
  );
}
