import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();

export const ReservationContextProvider = ({ children }) => {
  const [step, setStep] = useState(1);

  const increaseStep = () => setStep((prev) => prev + 1);
  const decreaseStep = () => setStep((prev) => prev - 1);

  return (
    <ReservationContext.Provider
      value={{
        step,
        increaseStep,
        decreaseStep,
        setStep,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservationContext = () => useContext(ReservationContext);
