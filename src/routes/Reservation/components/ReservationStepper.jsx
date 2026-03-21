import { Step, StepLabel, Stepper } from "@mui/material";
import { useReservationContext } from "../context/ReservationContext";
import { useTranslation } from "react-i18next";

export default function ReservationStepper() {
  const { t } = useTranslation("rezervace");
  const steps = [
    t("stepper.term"),
    t("stepper.rooms"),
    t("stepper.guests"),
    t("stepper.personal"),
  ];
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
