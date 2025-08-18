import React from "react";
import FullBleedTiles from "../components/FullBleedTiles.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";
import { Container, Paper, Typography, Box, Divider } from "@mui/material";

export default function Accommodations() {
  const asset = (path) =>
    `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

  return (
    <>
      <HeroCarousel
        slides={[
          {
            src: asset("/ubytovani/ubytovani2.webp"),
          },
          {
            src: asset("/ubytovani/ubytovani3.webp"),
          },
          {
            src: asset("/ubytovani/ubytovani4.webp"),
          },
          {
            src: asset("/ubytovani/ubytovani5.webp"),
          },
          {
            src: asset("/ubytovani/ubytovani6.webp"),
          },
          {
            src: asset("/ubytovani/ubytovani7.webp"),
          },
          {
            src: asset("/ubytovani/ubytovani1.webp"),
          },
        ]}
        interval={2000} // změň třeba na 4000 pro rychlejší střídání
        transition={100} // délka fade
        gradientTop="#9eb5c9"
      />

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }} id="oteviraciDoba">
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            textAlign: "center",
          }}
        >
          {/* Nadpis */}
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Otevírací doba pensionu: denně dle objednávek
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Otevírací doba restaurace pro UBYTOVANÉ HOSTY:
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Po - Čt 8:00-9:30 a 18:00-20:00
            </Typography>
            <Typography>Pá 8:00-9:30 a 11:30 - 21:00</Typography>
            <Typography>So 8:00-9:30 a 11:30 - 21:00</Typography>
            <Typography>Ne 8:00-9:30 a 11:30 - 20:00</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Nabídka speciálních akcí */}
          <Typography variant="body1" sx={{ mt: 2, fontStyle: "italic" }}>
            Mimo otevírací dobu mohou naši hosté od pondělí do čtvrtku využívat
            naši restauraci též jako SAMOOBSLUŽNÝ BAR - vše vysvětlíme a zaučíme
            na místě
          </Typography>
        </Paper>
      </Container>

      <FullBleedTiles
        fullBleedHack
        items={[
          {
            image: asset(
              "galerie/interier/100_HZ6_3979_Penzion_U_Lidmanu.webp"
            ),
            text: "V lokálu s krbem a kapacitou 40 osob podáváme formou DENNÍ NABÍDKY klasická jídla české kuchyně a domácí moučníky. Na našem baru najdete moravská vína, regionální pivo, nealkoholické, alkoholické a teplé nápoje.",
            alt: "Lokál",
          },
          {
            image: asset(
              "galerie/exterier/012_HZ6_3793_Penzion_U_Lidmanu.webp"
            ),
            text: "Při pěkném počasí můžete posedět na naší letní zahrádce s vítěznou jabloní– stromem roku ČR v roce 2020. Zde si můžete vychutnat klid venkova a krásné výhledy na okolní kopce. Děti si mohou pohrát na pískovišti nebo se zhoupnout na houpačce.",
            alt: "Zahrada",
          },
          {
            image: asset(
              "galerie/interier/088_HZ6_3958_Penzion_U_Lidmanu.webp"
            ),
            text: "Salónek restaurace s kapacitou 20 osob slouží k pořádání menších oslav, jako školící místnost, společenská místnost pro ubytované hosty nebo v případě většího množství hostů k rozšíření služeb lokálu.",
            alt: "Salonek",
          },
          {
            image: asset("galerie/sal/110_HZ6_3997_Penzion_U_Lidmanu.webp"),
            text: "Velký společenský sál s kapacitou 70 osob je určen k pořádání větších společenských akcí - svatby, oslavy, školení, přednášky, výstavy apod.",
            alt: "Sál",
          },
        ]}
      />
    </>
  );
}
