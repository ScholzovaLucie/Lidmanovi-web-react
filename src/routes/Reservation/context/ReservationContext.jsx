import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ReservationContext = createContext();

export const ReservationContextProvider = ({ children }) => {
  const [step, setStep] = useState(0);
  const resetVersion = useSelector((state) => state.reservation.resetVersion);

  useEffect(() => {
    setStep(0);
  }, [resetVersion]);

  const scrollToTop = () => {
    // Scroll to top of the page smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const increaseStep = () => {
    setStep((prev) => prev + 1);
    scrollToTop();
  };
  
  const decreaseStep = () => {
    setStep((prev) => prev - 1);
    scrollToTop();
  };

  const setStepWithScroll = (newStep) => {
    setStep(newStep);
    scrollToTop();
  };

  return (
    <ReservationContext.Provider
      value={{
        step,
        increaseStep,
        decreaseStep,
        setStep, // původní funkce bez scrollování
        setStepWithScroll, // nová funkce se scrollováním
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservationContext = () => useContext(ReservationContext);
