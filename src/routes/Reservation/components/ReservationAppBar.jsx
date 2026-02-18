import { AppBar, Box, Button, Stack, Typography } from "@mui/material";
import { useReservationContext } from "../context/ReservationContext";
import {
  ArrowBack,
  ArrowBackIos,
  ArrowForward,
  ArrowForwardIos,
} from "@mui/icons-material";

const steps = ["Termín", "Pokoje", "Hosté", "Osobní údaje", "Souhrn"];

export default function ReservationAppBar({ Component }) {
  const { step, increaseStep, decreaseStep, setStep } = useReservationContext();

  return (
    <>
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
          direction={"row"}
          justifyContent="space-between"
          flex={1}
        >
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
          {Component && <Component />}
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
        </Stack>
      </AppBar>
    </>
  );
}
