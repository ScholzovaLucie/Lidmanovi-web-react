import { Step, StepLabel, Stepper } from "@mui/material";
import { useReservationContext } from "../context/ReservationContext";
import { useTranslation } from "react-i18next";

export default function ReservationStepper({ sx }) {
  const { t } = useTranslation("rezervace");
  const steps = [
    t("stepper.term"),
    t("stepper.rooms"),
    t("stepper.guests"),
    t("stepper.personal"),
    t("summary.title"),
  ];
  const { step, setStep } = useReservationContext();
  return (
    <Stepper
      activeStep={step}
      sx={{
        maxWidth: { xs: "100%", md: 520 },
        width: "100%",
        ...sx,
      }}
    >
      {steps.map((label, index) => (
        <Step
          key={label}
          //onClick={() => setStep(index)}
          sx={{ cursor: "pointer" }}
        >
          <StepLabel>{step === index ? label : ""}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
