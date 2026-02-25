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

export default function ReservationPage2() {
  return (
    <ReservationContextProvider>
      <Layout>
        <Content />
      </Layout>
    </ReservationContextProvider>
  );
}

function Content() {
  const { step, increaseStep, decreaseStep, setStep } = useReservationContext();

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
      return "Unknown step";
  }
}
