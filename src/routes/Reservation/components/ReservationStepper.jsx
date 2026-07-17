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
        "& .MuiStepConnector-line": {
          borderColor: "#d8cbb8",
          borderTopWidth: 2,
        },
        "& .MuiStepIcon-root": {
          color: "#ded3c1",
          borderRadius: "50%",
        },
        "& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed": {
          color: "#446783",
        },
        "& .MuiStepLabel-label": {
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: "1.2rem",
          color: "#2d2823",
        },
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
