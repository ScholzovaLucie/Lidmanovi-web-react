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
    t("summary.title"),
  ];
  const { step } = useReservationContext();
  return (
    <Stepper
      activeStep={step}
      sx={{
        width: { xs: "100%", md: 520 },
        "& .MuiStepIcon-root": {
          color: "#b8b8b8 !important",
          borderRadius: "50%",
          fontSize: { xs: "1.4rem", md: "1.5rem" },
        },
        "& .MuiStepIcon-text": {
          fill: "#446783 !important",
          fontWeight: 600,
        },
        "& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed": {
          color: "#ffffff !important",
        },
        "& .MuiStepIcon-root.Mui-active .MuiStepIcon-text": {
          fill: "#446783 !important",
        },
        "& .MuiStepIcon-root.Mui-completed .MuiStepIcon-text": {
          fill: "#000000 !important",
        },
        "& .MuiStepConnector-line": {
          borderColor: "rgba(255, 255, 255, 0.75)",
          borderTopWidth: 1,
        },
        "& .MuiStepLabel-label": {
          fontSize: { xs: "0.8rem", md: "1.2rem" },
          color: "white !important",
          fontWeight: 500,
          whiteSpace: "nowrap",
        },
        "& .MuiStepConnector-root": {
          top: { xs: 10, md: 12 },
        },
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
