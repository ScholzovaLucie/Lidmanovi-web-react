import Layout from "./Layout";
import TermSelect from "./steps/TermSelect";
import {
  ReservationContextProvider,
  useReservationContext,
} from "./context/ReservationContext";
import RoomSelect from "./steps/RoomSelect";
import InformationAndConfirmation from "./steps/InformationAndConfirmation";
import HostSelect from "./steps/HostSelect";
import { OrderSummary } from "./steps/OrderSummary";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useBlocker, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { resetReservation } from "../../redux/slices/reservation/reservationSlice";

export default function ReservationPage2() {
  return (
    <ReservationContextProvider>
      <Layout>
        <ReservationResetOnEntry />
        <Content />
      </Layout>
    </ReservationContextProvider>
  );
}

function ReservationResetOnEntry() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetReservation());
  }, [dispatch, location.key]);

  return null;
}

function Content() {
  const { t } = useTranslation("rezervace");
  const { step, setStep } = useReservationContext();

  return (
    <>
      <ReservationNavigationGuard step={step} setStep={setStep} />
      {renderStep()}
    </>
  );

  function renderStep() {
    switch (step) {
      case 0:
        return <TermSelect />;
      case 1:
        return <RoomSelect />;
      case 2:
        return <HostSelect />;
      case 3:
        return <InformationAndConfirmation />;
      case 4:
        return <OrderSummary />;
      default:
        return t("common.unknownStep");
    }
  }
}

function ReservationNavigationGuard({ step, setStep }) {
  const { t } = useTranslation("rezervace");
  const dispatch = useDispatch();
  const blocker = useBlocker(step > 0);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (step === 0) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [step]);

  const handleLeave = () => {
    dispatch(resetReservation());
    setStep(0);
    blocker.proceed();
  };

  return (
    <Dialog open={blocker.state === "blocked"} onClose={() => blocker.reset()}>
      <DialogTitle>{t("navigationGuard.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("navigationGuard.message")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => blocker.reset()} color="inherit">
          {t("navigationGuard.stay")}
        </Button>
        <Button onClick={handleLeave} color="error" variant="contained">
          {t("navigationGuard.leave")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
