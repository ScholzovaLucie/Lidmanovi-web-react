import { Step, StepLabel, Stepper } from "@mui/material";
import { useReservationContext } from "../context/ReservationContext";

export default function ReservationStepper() {
  const steps = ["Termín", "Pokoje", "Hosté", "Osobní údaje"];
  const { step, setStep } = useReservationContext();
  return (
    <Stepper
      activeStep={step}
      sx={{
        maxWidth: { xs: 350, md: 400 },
        width: "100%",
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
  );
}
