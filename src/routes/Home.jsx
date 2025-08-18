import React from "react";
import FullBleedTiles from "../components/FullBleedTiles.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";
import { useTranslation } from "react-i18next";

export default function Home() {
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
  const { t } = useTranslation(["home"]);

  return (
    <>
      <HeroCarousel
        slides={[
          {
            src: asset("/uvod/uvod1.webp"),
          },
          {
            src: asset("/uvod/uvod2.webp"),
          },
          {
            src: asset("/uvod/uvod3.webp"),
          },
          {
            src: asset("/uvod/uvod4.webp"),
          },
          {
            src: asset("/uvod/nove5.webp"),
          },
        ]}
        interval={2000} // změň třeba na 4000 pro rychlejší střídání
        transition={100} // délka fade
        gradientTop="#9eb5c9"
      />

      <FullBleedTiles
        fullBleedHack
        items={[
          {
            image: asset("/uvod/uvod1.webp"),
            text: t("uvod"),
          },
          {
            image: asset(
              "galerie/exterier/132_HZ6_4056_Penzion_U_Lidmanu.webp"
            ),
            text: t("lokace"),
          },
          {
            image: asset(
              "/galerie/exterier/022_HZ6_3836_Penzion_U_Lidmanu.webp"
            ),
            title: t("jablon.nadpis"),
            text: t("jablon.text"),
          },
          {
            image: asset("/galerie/interier/opona.webp"),
            title: t("pribeh.nadpis"),
            paragraphs: t("pribeh.text", { returnObjects: true }),
          },
        ]}
      />
    </>
  );
}
