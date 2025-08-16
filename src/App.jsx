import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./routes/Home.jsx";
import Kontakt from "./routes/Kontakt.jsx";
import Restauration from "./routes/Restauration.jsx";
import Accommodations from "./routes/Accommodations.jsx";
import Weddings from "./routes/Weddings.jsx";
import AccommodationPackages from "./routes/AccommodationPackages.jsx";
import PriceList from "./routes/PriceList.jsx";
import Galerie from "./routes/Galerie.jsx";
import ReservationPage from "./routes/Reservation.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/restaurace" element={<Restauration />} />
        <Route path="/ubytovani" element={<Accommodations />} />
        <Route path="/svatby" element={<Weddings />} />
        <Route path="/pobytove_balicky" element={<AccommodationPackages />} />
        <Route path="/cenik" element={<PriceList />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/rezervace" element={<ReservationPage />} />
      </Route>
    </Routes>
  );
}
