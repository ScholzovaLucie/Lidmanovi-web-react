import {
  AppBar,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useReservationContext } from "./context/ReservationContext";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RoomCartCompactCard } from "./components/RoomCardCompact";
import dayjs from "dayjs";
import ReservationStepper from "./components/ReservationStepper";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import { useTranslation } from "react-i18next";

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
        <Stack p={3} spacing={2} width={300} alignItems={"center"}>
          <Typography variant="h6" fontWeight={"bold"}>
            {t("layout.selectedRooms")}
          </Typography>
          {values.rooms.length === 0 ? (
            <Typography variant="body1">
              {t("layout.noRoomSelected")}
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {values.rooms.map((room) => (
                <RoomCartCompactCard key={room.id} room={room} />
              ))}
            </Stack>
          )}
        </Stack>
      </Drawer>

      <Stack>
        <AppBar
          position="sticky"
          sx={{
            top: { xs: 56, md: 64 },
            zIndex: 1100,
            minHeight: 64,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,248,251,0.92))",
            boxShadow: "0 10px 30px rgba(25,33,43,0.08)",
            borderBottom: "1px solid rgba(85,116,143,0.12)",
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 1.25,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={{ xs: 1, md: 2 }}
              direction="row"
              sx={{
                px: { xs: 1.5, md: 2.25 },
                py: 1,
                borderRadius: 999,
                background: "rgba(67,86,104,0.9)",
                color: "common.white",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 12px 28px rgba(25,33,43,0.16)",
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.92)",
                  fontSize: { xs: "0.82rem", md: "0.95rem" },
                  fontWeight: 400,
                }}
              >
                {dayjs(values.check_in_date).format("D.MM")} -{" "}
                {dayjs(values.check_out_date).format("D.MM.YYYY")}
              </Typography>

              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: { xs: "none", sm: "block" },
                  borderColor: "rgba(255,255,255,0.18)",
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.92)",
                  fontSize: { xs: "0.82rem", md: "0.95rem" },
                  fontWeight: 400,
                }}
              >
                {t("layout.guestsSummary", {
                  adults: values.num_adults,
                  children: values.num_children,
                })}
              </Typography>

              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: { xs: "none", sm: "block" },
                  borderColor: "rgba(255,255,255,0.18)",
                }}
              />

              <Badge
                badgeContent={values.rooms.length || "0"}
                color="warning"
                sx={{
                  "& .MuiBadge-badge": {
                    transform: "translate(2px, -2px)",
                  },
                }}
              >
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  sx={{
                    color: "common.white",
                    bgcolor: "rgba(255,255,255,0.08)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.14)",
                    },
                  }}
                >
                  <BedroomParentIcon fontSize="medium" />
                </IconButton>
              </Badge>
            </Stack>
          </Box>
        </AppBar>
        <Box pt={3} display={"flex"} justifyContent={"center"}>
          <ReservationStepper />
        </Box>
        {children}
      </Stack>
    </>
  );
}

/*

 {step > 0 ? (
              <Button
                variant="text"
                color="white"
                onClick={decreaseStep}
                disabled={step === 0}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <ArrowBackIos fontSize="small" />
                  <Typography>{"Back"}</Typography>
                </Stack>
              </Button>
            ) : (
              <Box />
            )}

            
{step < steps.length - 1 ? (
              <Button
                variant="text"
                color="white"
                onClick={increaseStep}
                disabled={step === steps.length - 1}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  <Typography>{"Next"}</Typography>
                  <ArrowForwardIos fontSize="small" />
                </Stack>
              </Button>
            ) : (
              <Box />
            )}
*/
/**
 <Stepper
              activeStep={step}
              sx={{
                maxWidth: "400px",
                width: "100%",
                "& .MuiStepIcon-root": {
                  backgroundColor: "white",
                  color: "white",
                  border: "2px solid white",
                  borderRadius: "50%",
                },
                "& .MuiStepIcon-text": {
                  fill: "black",
                  fontWeight: "bold",
                },
                "& .MuiStepLabel-label": {
                  color: "white",
                  fontWeight: 500,
                },
                "& .MuiStepIcon-root.Mui-active": {
                  backgroundColor: "white",
                  color: "white",
                },
                "& .MuiStepIcon-root.Mui-completed": {
                  backgroundColor: "white",
                  color: "primary.main",
                },
              }}
            >
              {steps.map((label, index) => (
                <Step
                  key={label}
                  onClick={() => setStep(index)}
                  sx={{ cursor: "pointer" }}
                >
                  <StepLabel>{step === index ? label : ""}</StepLabel>
                </Step>
              ))}
            </Stepper>
 */
