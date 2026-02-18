import {
  AppBar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useReservationContext } from "../context/ReservationContext";

const steps = ["Termín", "Pokoje", "Hosté", "Osobní údaje", "Souhrn"];

export default function Layout({ children }) {
  const { step, increaseStep, decreaseStep, setStep } = useReservationContext();

  return children;

  return (
    <Stack>
      <AppBar position="sticky" sx={{ top: 64 }}>
        <Stack
          alignItems={"center"}
          p={2}
          direction={"row"}
          justifyContent="space-between"
        >
          <Typography>...</Typography>
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
          <Typography>...</Typography>
        </Stack>
      </AppBar>
      {children}
    </Stack>
  );
}
