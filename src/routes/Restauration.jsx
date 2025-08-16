import React from "react";
import FullBleedTiles from "../components/FullBleedTiles.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";
import { Container, Paper, Typography, Box, Divider } from "@mui/material";

export default function Restauration() {
  return (
    <>
      <HeroCarousel
        slides={[
          {
            src: "/restaurace/restaurace2.webp",
          },
          {
            src: "/restaurace/restaurace3.webp",
          },
          {
            src: "/restaurace/restaurace4.webp",
          },
          {
            src: "/restaurace/restaurace5.webp",
          },
          {
            src: "/restaurace/restaurace1.webp",
          },
          {
            src: "/restaurace/br1733.webp",
          },
          {
            src: "/restaurace/007_HZ6_4294_Setkani_U_Lidmanu_MASJABLON_podzim22.webp",
          },
          {
            src: "/restaurace/010_HZ6_4311_Setkani_U_Lidmanu_MASJABLON_podzim22.webp",
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
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Otevírací doba restaurace pro veřejnost
          </Typography>

          {/* Letní období */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Květen – září
            </Typography>
            <Typography>Pátek: 14.00 – 20.00 (vaříme do 19.00)</Typography>
            <Typography>Sobota: 11.30 – 20.00 (vaříme do 19.00)</Typography>
            <Typography>Neděle: 11.30 – 19.00 (vaříme do 18.30)</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Zimní období */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Říjen – duben
            </Typography>
            <Typography>Pátek: 15.00 – 20.00 (vaříme do 19.00)</Typography>
            <Typography>Sobota: 11.30 – 20.00 (vaříme do 19.00)</Typography>
            <Typography>Neděle: 11.30 – 18.00 (vaříme do 17.30)</Typography>
          </Box>

          {/* Nabídka speciálních akcí */}
          <Typography variant="body1" sx={{ mt: 2, fontStyle: "italic" }}>
            Rádi pro Vás připravíme různé větší společenské akce (svatby,
            rodinné oslavy, pohřební hostiny, rauty, schůze, školení apod.).{" "}
            <br />
            <strong>OTEVÍRACÍ DOBA dle dohody.</strong>
          </Typography>
        </Paper>
      </Container>

      <FullBleedTiles
        fullBleedHack
        items={[
          {
            image: "galerie/interier/100_HZ6_3979_Penzion_U_Lidmanu.webp",
            text: "V lokálu s krbem a kapacitou 40 osob podáváme formou DENNÍ NABÍDKY klasická jídla české kuchyně a domácí moučníky. Na našem baru najdete moravská vína, regionální pivo, nealkoholické, alkoholické a teplé nápoje.",
            alt: "Lokál",
          },
          {
            image: "galerie/exterier/012_HZ6_3793_Penzion_U_Lidmanu.webp",
            text: "Při pěkném počasí můžete posedět na naší letní zahrádce s vítěznou jabloní– stromem roku ČR v roce 2020. Zde si můžete vychutnat klid venkova a krásné výhledy na okolní kopce. Děti si mohou pohrát na pískovišti nebo se zhoupnout na houpačce.",
            alt: "Zahrada",
          },
          {
            image: "galerie/interier/088_HZ6_3958_Penzion_U_Lidmanu.webp",
            text: "Salónek restaurace s kapacitou 20 osob slouží k pořádání menších oslav, jako školící místnost, společenská místnost pro ubytované hosty nebo v případě většího množství hostů k rozšíření služeb lokálu.",
            alt: "Salonek",
          },
          {
            image: "galerie/sal/110_HZ6_3997_Penzion_U_Lidmanu.webp",
            text: "Velký společenský sál s kapacitou 70 osob je určen k pořádání větších společenských akcí - svatby, oslavy, školení, přednášky, výstavy apod.",
            alt: "Sál",
          },
        ]}
      />
    </>
  );
}
