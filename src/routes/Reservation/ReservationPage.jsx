import Layout from "./components/Layout";
import TermSelect from "./components/TermSelect";
import {
  ReservationContextProvider,
  useReservationContext,
} from "./context/ReservationContext";
import RoomSelect from "./components/RoomSelect";
import InformationAndConfirmation from "./components/InformationAndConfirmation";
import HostSelect from "./components/HostSelect";
import { OrderSummary } from "./components/OrderSummary";

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
