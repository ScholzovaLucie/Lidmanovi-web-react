import React from "react";
import FullBleedTiles from "../components/FullBleedTiles.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";
import { Container, Paper, Typography, Box, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Accommodations() {
  const { t } = useTranslation("ubytovani");
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
        gradientTop="secondary.main"
      />

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }} id="oteviraciDoba">
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            boxShadow: (theme) => `0 1px 4px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.2)'}`,
            textAlign: "center",
          }}
        >
          {/* Nadpis */}
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {t("openingHours.pension")}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            {t("openingHours.restaurantTitle")}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t("openingHours.monThu")}
            </Typography>
            <Typography>{t("openingHours.fri")}</Typography>
            <Typography>{t("openingHours.sat")}</Typography>
            <Typography>{t("openingHours.sun")}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Nabídka speciálních akcí */}
          <Typography variant="body1" sx={{ mt: 2, fontStyle: "italic" }}>
            {t("openingHours.note")}
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
            text: t("tiles.0.text"),
            alt: t("tiles.0.alt"),
          },
          {
            image: asset(
              "galerie/exterier/012_HZ6_3793_Penzion_U_Lidmanu.webp"
            ),
            text: t("tiles.1.text"),
            alt: t("tiles.1.alt"),
          },
          {
            image: asset(
              "galerie/interier/088_HZ6_3958_Penzion_U_Lidmanu.webp"
            ),
            text: t("tiles.2.text"),
            alt: t("tiles.2.alt"),
          },
          {
            image: asset("galerie/sal/110_HZ6_3997_Penzion_U_Lidmanu.webp"),
            text: t("tiles.3.text"),
            alt: t("tiles.3.alt"),
          },
        ]}
      />
    </>
  );
}
