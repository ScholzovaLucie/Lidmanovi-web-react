import React from "react";
import ReservationForm from "../components/ReservationForm.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";

export default function ReservationPage() {
  return (
    <>
      {/* volitelně hero nahoře */}
      <ReservationForm recipient="info@ulidmanu.cz" />
    </>
  );
}
