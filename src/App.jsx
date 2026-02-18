import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Kontakt from "./routes/Kontakt.jsx";
import Restauration from "./routes/Restauration.jsx";
import Accommodations from "./routes/Accommodations.jsx";
import Weddings from "./routes/Weddings.jsx";
import AccommodationPackages from "./routes/AccommodationPackages.jsx";
import PriceList from "./routes/PriceList.jsx";
import Galerie from "./routes/Galerie.jsx";
import Obedy from "./routes/Obedy.jsx";
import ReservationPage from "./routes/Reservation.jsx";
import AdminPage from "./routes/Admin/AdminPage.jsx";
import HomePage from "./routes/Home/HomePage.jsx";
import ReservationPage2 from "./routes/Reservation/ReservationPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/restaurace" element={<Restauration />} />
        <Route path="/ubytovani" element={<Accommodations />} />
        <Route path="/svatby" element={<Weddings />} />
        <Route path="/pobytove_balicky" element={<AccommodationPackages />} />
        <Route path="/cenik" element={<PriceList />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/rezervace" element={<ReservationPage2 />} />
        <Route path="/obedy" element={<Obedy />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
