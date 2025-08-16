import React from "react";
import FullBleedTiles from "../components/FullBleedTiles.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";

export default function Home() {
  return (
    <>
      <HeroCarousel
        slides={[
          {
            src: "/uvod/uvod1.webp",
          },
          {
            src: "/uvod/uvod2.webp",
          },
          {
            src: "/uvod/uvod3.webp",
          },
          {
            src: "/uvod/uvod4.webp",
          },
          {
            src: "/uvod/nove5.webp",
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
            image: "/uvod/uvod1.webp",
            text: "Ubytování ve Stolových horách, Broumovsko, Machovská Lhota. Slunné místo v atraktivní zatím neobjevené turistické oblasti mezi Broumovskými stěnami a polskými Stolovými horami nedaleko Adršpachu. Klidná venkovská atmosféra. Stylové prostředí v budově starého hostince z roku 1884.",
          },
          {
            image: "galerie/exterier/132_HZ6_4056_Penzion_U_Lidmanu.webp",
            text: "Machovská Lhota, která je z jedné strany obklopena Národní parkem Stolové hory s věhlasnou Hejšovinou a z druhé strany Broumovskými stěnami, populární Adršpach je od nás vzdálen 22km. Machovsko je rájem pěší turistiky, cykloturistiky, běžeckého lyžování a boulderingu. Na své si zde přijdou milovníci klidné venkovské atmosféry a rodinného prostředí.",
          },
          {
            image: "/galerie/exterier/022_HZ6_3836_Penzion_U_Lidmanu.webp",
            title: "Jabloň u Lidmanů",
            text: "Blenheimská reneta, vítěz soutěže strom roku ČR 2020, 7.místo v evropské soutěži strom roku 2021.",
          },
          {
            image: "/galerie/interier/opona.webp",
            title: "Příběh hostince",
            paragraphs: [
              "Náš hostinec je v provozu již od druhé poloviny 19. století. Původním majitelem byl pan Eduard Šrám, který k původnímu statku broumovského typu přistavěl lokál a také pokojík v patře. Pro potřeby Lhotského ochotnického divadla též vytvořil a rozšířil společenský sál. Byl to také hospodský, který po vyhlášení vojny roku 1914 prý v lokálu ze vzteku trefil půllitrem obraz císaře pána a poničil ho, jak je na něm dodnes patrné.",
              "V roce 1950 koupili hostinec Lidmanovi, kterým však již roku 1953 komunistický režim hostinec znárodnil. Mohli tam alespoň bydlet a pracovat. Do konce 80. let jezdily k Lidmanům početné party trampů, protože na konci světa, blízko nepropustné hranice zůstávali stranou zájmu. V 90. letech Lidmanovi hostinec zrestituovali a provozovali jej až do roku 2014. Od roku 2014 jsou novými majiteli Šturmovi.",
            ],
          },
        ]}
      />
    </>
  );
}
