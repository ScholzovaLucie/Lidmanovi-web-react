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

export default function Layout({ children }) {
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
            Vybrané pokoje
          </Typography>
          {values.rooms.length === 0 ? (
            <Typography variant="body1">
              Zatím jste nevybrali žádný pokoj.
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
            top: { xs: 56, md: 64 }, // Pozice pod hlavním AppBar (pokud existuje)
            zIndex: 1100, // Ujistí se, že zůstane nahoře
            minHeight: 56, // Nastaví výšku AppBar
          }}
        >
          <Stack
            alignItems={"center"}
            justifyContent={"center"}
            spacing={2}
            direction={"row"}
            flex={1}
          >
            <Typography variant="body1">
              {dayjs(values.check_in_date).format("D.MM")} -{" "}
              {dayjs(values.check_out_date).format("D.MM.YYYY")}
            </Typography>

            <Divider
              orientation="vertical"
              sx={{ height: "20px", backgroundColor: "white" }}
            />

            <Typography variant="body1">
              {values.num_adults} dospělý {values.num_children} děti
            </Typography>

            <Divider
              orientation="vertical"
              sx={{ height: "20px", backgroundColor: "white" }}
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
              <IconButton onClick={() => setDrawerOpen(true)}>
                <BedroomParentIcon fontSize="medium" sx={{ color: "white" }} />
              </IconButton>
            </Badge>
          </Stack>
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
